
import { useEffect, useRef, useCallback } from 'react';
import { 
  markPerformance, 
  measurePerformance, 
  setupLongTaskMonitoring,
  initPerformanceMonitoring,
  getMemoryUsage
} from '@/utils/performance-monitoring';

/**
 * A custom hook for component-level performance monitoring
 * @param componentName The name of the component being monitored
 */
export function usePerformanceMonitor(componentName: string) {
  const renderCountRef = useRef(0);
  const startTimeRef = useRef(0);
  const isInitialRender = useRef(true);
  
  // Track render times for this component
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      startTimeRef.current = performance.now();
      
      // Mark the start of component render with unique ID
      const renderIndex = renderCountRef.current;
      const startMark = `${componentName}_start_${renderIndex}`;
      markPerformance(startMark);
      
      return () => {
        // Measure render duration
        const endTime = performance.now();
        const duration = endTime - startTimeRef.current;
        
        // Only log significant render times to reduce noise
        if (duration > 30 || isInitialRender.current) {
          console.log(`[Performance] ${componentName} render #${renderIndex}: ${duration.toFixed(1)}ms`);
          
          // Mark the end of render
          const endMark = `${componentName}_end_${renderIndex}`;
          markPerformance(endMark);
          measurePerformance(startMark, endMark, `${componentName} render #${renderIndex}`);
          
          // Check memory usage periodically for heavy components
          if (renderIndex % 5 === 0) {
            const memory = getMemoryUsage();
            if (memory && parseFloat(memory.percentage) > 75) {
              console.warn(`[Memory] High usage during ${componentName}: ${memory.percentage}%`);
            }
          }
        }
        
        renderCountRef.current++;
        isInitialRender.current = false;
      };
    }
  });
  
  // Initialize performance monitoring once per component
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;
    
    console.log(`[Performance] Monitoring ${componentName}`);
    
    // Setup performance monitoring
    const cleanup = initPerformanceMonitoring();
    
    return () => {
      cleanup();
    };
  }, [componentName]);
  
  // Return utility methods for the component to use
  return {
    markEvent: useCallback((eventName: string) => {
      markPerformance(`${componentName}_${eventName}`);
    }, [componentName]),
    
    measureEvent: useCallback((startEventName: string, endEventName: string, label: string) => {
      measurePerformance(
        `${componentName}_${startEventName}`,
        `${componentName}_${endEventName}`,
        label
      );
    }, [componentName]),
    
    logPerformanceData: useCallback((data: Record<string, any>) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance Data: ${componentName}]`, data);
      }
    }, [componentName])
  };
}

/**
 * Hook to track Largest Contentful Paint (LCP) performance metric
 * @param onLcpUpdate Optional callback function when LCP is measured
 */
export function useLCPMonitoring(onLcpUpdate?: (lcpTime: number) => void) {
  useEffect(() => {
    if (typeof PerformanceObserver !== 'function') return;
    
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // Report LCP to analytics or callback
        const lcpTime = lastEntry.startTime;
        if (onLcpUpdate) onLcpUpdate(lcpTime);
        
        // Log if LCP is poor (>2.5s)
        if (lcpTime > 2500) {
          console.warn(`[Performance] Slow LCP detected: ${lcpTime.toFixed(1)}ms`);
        }
      });
      
      // Start observing LCP
      lcpObserver.observe({ 
        type: 'largest-contentful-paint', 
        buffered: true 
      });
      
      return () => {
        lcpObserver.disconnect();
      };
    } catch (e) {
      // Silent fail in browsers that don't support this
      return undefined;
    }
  }, [onLcpUpdate]);
}

/**
 * Helper function to measure render time for a component
 * @param componentName The name of the component being rendered
 * @returns Function to call when render is complete
 */
export const measureRenderTime = (componentName: string): (() => void) => {
  if (process.env.NODE_ENV !== 'development' || typeof performance === 'undefined') {
    return () => {};
  }
  
  const startTime = performance.now();
  const startMark = `${componentName}_render_start`;
  
  try {
    performance.mark(startMark);
  } catch (e) {
    // Silently fail if marking isn't supported
  }
  
  return () => {
    try {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Only log significant render times
      if (duration > 30) {
        console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(1)}ms`);
        
        const endMark = `${componentName}_render_end`;
        performance.mark(endMark);
        
        try {
          performance.measure(`${componentName}_render`, startMark, endMark);
        } catch (e) {
          // Silently fail if measurement fails
        }
        
        // Cleanup marks to prevent memory leaks
        performance.clearMarks(startMark);
        performance.clearMarks(endMark);
      }
    } catch (e) {
      // Silently fail if performance API fails
    }
  };
};

export default usePerformanceMonitor;
