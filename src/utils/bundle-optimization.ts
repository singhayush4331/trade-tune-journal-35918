// Bundle optimization utilities

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical CSS
  const linkElements = document.querySelectorAll('link[rel="stylesheet"]');
  linkElements.forEach(link => {
    if (link.getAttribute('href')?.includes('index.css')) {
      link.setAttribute('rel', 'preload');
      link.setAttribute('as', 'style');
    }
  });
};

// Dynamic imports with better error handling
export const loadComponentAsync = async <T>(
  importFn: () => Promise<{ default: T }>,
  retries: number = 3
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < retries; i++) {
    try {
      const module = await importFn();
      return module.default;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed to load component (attempt ${i + 1}):`, error);
      
      // Wait before retrying
      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError!;
};

// Prefetch resources on hover/focus
export const setupPrefetchOnInteraction = () => {
  const prefetchMap = new Map<string, boolean>();
  
  const prefetchResource = (href: string) => {
    if (prefetchMap.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
    
    prefetchMap.set(href, true);
  };
  
  // Prefetch on hover
  document.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a[href]') as HTMLAnchorElement;
    
    if (link && link.href) {
      prefetchResource(link.href);
    }
  });
  
  // Prefetch on focus
  document.addEventListener('focus', (e) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'A' && (target as HTMLAnchorElement).href) {
      prefetchResource((target as HTMLAnchorElement).href);
    }
  }, true);
};

// Initialize optimizations
export const initializeBundleOptimizations = () => {
  if (typeof window !== 'undefined') {
    // Run after initial load
    window.addEventListener('load', () => {
      preloadCriticalResources();
      setupPrefetchOnInteraction();
    });
    
    // Run immediately if already loaded
    if (document.readyState === 'complete') {
      preloadCriticalResources();
      setupPrefetchOnInteraction();
    }
  }
};