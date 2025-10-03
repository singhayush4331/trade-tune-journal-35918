import { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

// Performance optimization hook for component-level optimizations
export const usePerformanceOptimization = (componentName: string) => {
  const renderTimeRef = useRef<number | null>(null);
  const queryClient = useQueryClient();

  // Start measuring render time
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      renderTimeRef.current = performance.now();
    }
  });

  // End measuring render time
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && renderTimeRef.current) {
      const renderTime = performance.now() - renderTimeRef.current;
      if (renderTime > 16) { // More than one frame at 60fps
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }
    }
  });

  // Optimized prefetch function
  const prefetchData = useCallback((queryKey: any[], queryFn: () => Promise<any>) => {
    queryClient.prefetchQuery({
      queryKey,
      queryFn,
      staleTime: 10 * 60 * 1000
    });
  }, [queryClient]);

  // Invalidate specific queries efficiently
  const invalidateQueries = useCallback((queryKey: any[]) => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient]);

  return {
    prefetchData,
    invalidateQueries
  };
};

// Debounced search hook
export const useDebouncedValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized component factory
export const withMemoization = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = React.memo(Component, areEqual);
  MemoizedComponent.displayName = `Memoized${Component.displayName || Component.name}`;
  return MemoizedComponent;
};

// Virtual scrolling utilities
export const useVirtualization = (itemCount: number, containerHeight: number, itemHeight: number) => {
  return useMemo(() => {
    const visibleItems = Math.ceil(containerHeight / itemHeight);
    const overscan = Math.min(5, Math.ceil(visibleItems * 0.2));
    
    return {
      shouldVirtualize: itemCount > visibleItems * 2,
      visibleItems,
      overscan,
      totalHeight: itemCount * itemHeight
    };
  }, [itemCount, containerHeight, itemHeight]);
};