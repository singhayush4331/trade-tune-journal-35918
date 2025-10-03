// Performance monitoring utilities with optimized imports and execution

interface PerformanceLogEntry {
  component: string;
  duration: number;
  timestamp: number;
  type: 'render' | 'function' | 'longTask';
}

let performanceLogs: PerformanceLogEntry[] = [];
const LOG_THRESHOLD_MS = 50; // Increased threshold to reduce logging
const MAX_LOGS = 50; // Reduced max logs to save memory

// Measure component render time with reduced overhead
export const measureRenderTime = (componentName: string) => {
  // Only run in development and if Performance API is available
  if (process.env.NODE_ENV !== 'development' || typeof performance === 'undefined') return () => {};
  
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Only log significant render times to reduce console noise
    if (duration > LOG_THRESHOLD_MS) {
      console.log(`[Performance] ${componentName} render time: ${duration.toFixed(1)}ms`);
      
      // Store in performance log with limit
      performanceLogs.push({
        component: componentName,
        duration,
        timestamp: Date.now(),
        type: 'render'
      });
      
      // Keep logs under the maximum size
      if (performanceLogs.length > MAX_LOGS) {
        performanceLogs = performanceLogs.slice(-MAX_LOGS);
      }
    }
  };
};

// Type-safe debounce function
type AnyFunction = (...args: any[]) => any;

export const debounce = <F extends AnyFunction>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  const debounced = (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(() => {
        const result = func(...args);
        resolve(result);
        timeout = null;
      }, waitFor);
    });
  };
  
  // Add cancel method
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };
  
  return debounced;
};

// Performance observer setup with better typings
interface PerformanceObserverOptions {
  entryTypes: string[];
  buffered?: boolean;
}

// Memory-efficient long task monitoring
export const setupLongTaskMonitoring = () => {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return null;
  }
  
  try {
    // Only monitor tasks longer than 100ms
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 150) { // Increased threshold to reduce noise
          console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(1)}ms`);
          
          // Store long task in performance logs
          performanceLogs.push({
            component: entry.name || 'unknown',
            duration: entry.duration,
            timestamp: Date.now(),
            type: 'longTask'
          });
          
          // Keep logs under the maximum size
          if (performanceLogs.length > MAX_LOGS) {
            performanceLogs = performanceLogs.slice(-MAX_LOGS);
          }
        }
      });
    });
    
    observer.observe({ 
      entryTypes: ['longtask'], 
      buffered: true 
    } as PerformanceObserverOptions);
    
    return observer;
  } catch (e) {
    // Silent fail in browsers that don't support this
    return null;
  }
};

// More efficient memory monitoring with typings
interface MemoryUsage {
  used: number;
  total: number;
  percentage: string;
}

export const getMemoryUsage = (): MemoryUsage | null => {
  try {
    // @ts-ignore - Chrome-specific API not in TypeScript defs
    if (performance?.memory) {
      // @ts-ignore
      const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
      const usedMemoryPercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
      
      return {
        used: Math.round(usedJSHeapSize / (1024 * 1024)), // MB
        total: Math.round(jsHeapSizeLimit / (1024 * 1024)), // MB
        percentage: usedMemoryPercent.toFixed(1)
      };
    }
  } catch (e) {
    // Silently fail
  }
  
  return null;
};

// Get performance logs for debugging
export const getPerformanceLogs = () => {
  return [...performanceLogs];
};

// Clear performance logs
export const clearPerformanceLogs = () => {
  performanceLogs = [];
};

// Efficient performance monitoring initialization
export const initPerformanceMonitoring = () => {
  // Only run in browser environment
  if (typeof window === 'undefined') return () => {};
  
  let longTaskObserver = null;
  let memoryInterval: number | null = null;
  
  // Only run monitoring in development mode
  if (process.env.NODE_ENV === 'development') {
    // Setup long task monitoring
    longTaskObserver = setupLongTaskMonitoring();
    
    // Check memory less frequently (increased to 2 minutes)
    memoryInterval = window.setInterval(() => {
      // @ts-ignore - Chrome-specific API not in TypeScript defs
      if (performance?.memory) {
        // @ts-ignore
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usedMemoryPercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
        
        if (usedMemoryPercent > 85) {
          console.warn(`[Performance] High memory usage: ${Math.round(usedJSHeapSize / (1024 * 1024))}MB (${usedMemoryPercent.toFixed(1)}%)`);
          
          // Force garbage collection if possible
          if (typeof global !== 'undefined' && global.gc) {
            try {
              global.gc();
            } catch (e) {
              // Ignore errors
            }
          }
        }
      }
    }, 120000); // Check every 2 minutes
  }
  
  // Return cleanup function
  return () => {
    if (longTaskObserver) {
      longTaskObserver.disconnect();
    }
    if (memoryInterval !== null) {
      clearInterval(memoryInterval);
    }
  };
};

// Add performance markers with better browser compatibility
export const markPerformance = (name: string) => {
  if (typeof performance === 'undefined' || !performance.mark) return;
  try {
    performance.mark(name);
  } catch (e) {
    // Some browsers might throw if the name is invalid
  }
};

// Measure between two performance marks safely
export const measurePerformance = (startMark: string, endMark: string, label: string) => {
  if (typeof performance === 'undefined' || !performance.measure) return;
  try {
    performance.measure(label, startMark, endMark);
    const measurements = performance.getEntriesByName(label, 'measure');
    if (measurements.length > 0) {
      console.log(`[Performance] ${label}: ${measurements[0].duration.toFixed(1)}ms`);
    }
    // Clean up marks after measuring
    performance.clearMarks(startMark);
    performance.clearMarks(endMark);
    performance.clearMeasures(label);
  } catch (e) {
    // Silently fail if marks don't exist
  }
};

// Type-safe version of data loading with chunking
export const loadDataInChunks = <T>(
  data: T[], 
  chunkSize: number = 200,
  processChunk: (chunk: T[]) => void
): void => {
  if (!data || data.length === 0) return;
  
  // For small datasets, just process immediately
  if (data.length <= chunkSize) {
    processChunk(data);
    return;
  }
  
  // For large datasets, process in chunks
  let currentIndex = 0;
  
  const processNextChunk = () => {
    const end = Math.min(currentIndex + chunkSize, data.length);
    const chunk = data.slice(currentIndex, end);
    
    processChunk(chunk);
    currentIndex = end;
    
    // If there's more data to process, schedule the next chunk
    if (currentIndex < data.length) {
      if ('requestIdleCallback' in window) {
        // Use requestIdleCallback for browser compatibility
        const requestIdleCallback = window.requestIdleCallback || 
          ((cb: IdleRequestCallback) => setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1));
          
        requestIdleCallback(() => processNextChunk(), { timeout: 200 });
      } else {
        setTimeout(processNextChunk, 1);
      }
    }
  };
  
  processNextChunk();
};

// Virtualization helper - improved with better heuristics
export const shouldUseVirtualization = (
  itemCount: number, 
  itemHeight: number = 50,
  viewportHeight: number = window.innerHeight
): boolean => {
  // Use virtualization if many items or items would exceed viewport by 2x
  return itemCount > 50 || (itemCount * itemHeight > viewportHeight * 2);
};

// Memory-efficient data processor for large datasets with proper typing
export const processTradesEfficiently = <T extends Record<string, any>, R>(
  items: T[], 
  processor: (item: T) => R
): R[] => {
  // For small datasets, use standard processing
  if (items.length <= 500) {
    return items.map(processor);
  }
  
  // For large datasets, use optimized processing
  const result = new Array(items.length);
  const chunkSize = 250; // Increased for efficiency
  
  // Process in batches
  for (let i = 0; i < items.length; i += chunkSize) {
    const end = Math.min(i + chunkSize, items.length);
    
    for (let j = i; j < end; j++) {
      result[j] = processor(items[j]);
    }
    
    // Yield to browser for very large datasets
    if (items.length > 2000 && i % 2000 === 0) {
      // Force a small pause every 2000 items
      setTimeout(() => {}, 0);
    }
  }
  
  return result;
};
