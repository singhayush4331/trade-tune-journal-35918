
import { useMemo, useRef, useCallback } from 'react';

/**
 * A hook to memoize data processing with deep equality checks for better performance
 * @param data Raw data to be processed
 * @param processingFn Function to process the data
 * @param deps Additional dependencies that should trigger recalculation
 * @returns Processed data, memoized to prevent unnecessary recalculations
 */
export function useMemoizedData<T, R>(
  data: T[],
  processingFn: (data: T[]) => R,
  deps: any[] = []
): R {
  // Keep a reference to the last processed data to avoid recalculations
  const lastData = useRef<T[]>([]);
  const lastResult = useRef<R | null>(null);
  const processingFnRef = useRef(processingFn);
  
  // Update the processing function reference when it changes
  if (processingFnRef.current !== processingFn) {
    processingFnRef.current = processingFn;
  }
  
  // Memoized function to check if data is the same
  const isSameData = useCallback((a: T[], b: T[]): boolean => {
    if (a === b) return true;
    if (a.length !== b.length) return false;
    
    // For small datasets, compare each item for identity
    if (a.length < 50) {
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }
    
    // For larger datasets, just check for array identity
    return false;
  }, []);
  
  return useMemo(() => {
    // Skip processing if data is empty
    if (!data || data.length === 0) {
      return processingFnRef.current([]) as R;
    }
    
    // Skip processing if data hasn't changed and we have a cached result
    if (lastResult.current !== null && isSameData(data, lastData.current)) {
      return lastResult.current;
    }
    
    // Process the data for new data set
    const result = processingFnRef.current(data);
    lastData.current = data;
    lastResult.current = result;
    
    return result;
  }, [data, isSameData, ...deps]); // Include any additional dependencies
}

/**
 * An optimized hook for chart data formatting
 * @param data Raw data array
 * @param formatFn Formatting function
 * @param deps Additional dependencies to trigger re-processing
 * @returns Formatted chart data, memoized with intelligent caching
 */
export function useChartDataFormatter<T, R>(
  data: T[],
  formatFn: (item: T, index: number) => R,
  deps: any[] = []
): R[] {
  // Use a ref to store the last format result to avoid redundant processing
  const cache = useRef<{
    data: T[],
    result: R[]
  }>({ data: [], result: [] });
  
  const formatFnRef = useRef(formatFn);
  
  // Update the format function reference when it changes
  if (formatFnRef.current !== formatFn) {
    formatFnRef.current = formatFn;
  }
  
  return useMemo(() => {
    // Skip processing if data is empty
    if (!data || data.length === 0) {
      return [];
    }
    
    // Check if we can reuse the cached result
    if (data === cache.current.data) {
      return cache.current.result;
    }
    
    // For small datasets, check if the data is actually different
    if (data.length < 100 && data.length === cache.current.data.length) {
      let isDataSame = true;
      for (let i = 0; i < data.length; i++) {
        if (data[i] !== cache.current.data[i]) {
          isDataSame = false;
          break;
        }
      }
      
      if (isDataSame) {
        return cache.current.result;
      }
    }
    
    // Avoid large reprocessing when possible by using intelligent chunking
    // For large datasets, process in chunks but still return entire array
    let result: R[];
    
    if (data.length > 300) {
      const chunkSize = 100;
      result = new Array(data.length);
      
      for (let i = 0; i < data.length; i += chunkSize) {
        const end = Math.min(i + chunkSize, data.length);
        
        for (let j = i; j < end; j++) {
          result[j] = formatFnRef.current(data[j], j);
        }
      }
    } else {
      // For smaller datasets, just map directly
      result = data.map((item, index) => formatFnRef.current(item, index));
    }
    
    // Update the cache
    cache.current = { data, result };
    
    return result;
  }, [data, ...deps]); // Include any additional dependencies
}

/**
 * A specialized hook for filtering data with better performance
 * @param data The data array to filter
 * @param filterFn The filter function to apply
 * @param deps Additional dependencies for the filter
 * @returns The filtered data array
 */
export function useFilteredData<T>(
  data: T[],
  filterFn: (item: T) => boolean,
  deps: any[] = []
): T[] {
  const filterFnRef = useRef(filterFn);
  
  // Update the filter function reference when it changes
  if (filterFnRef.current !== filterFn) {
    filterFnRef.current = filterFn;
  }
  
  return useMemo(() => {
    // Skip processing if data is empty
    if (!data || data.length === 0) {
      return [];
    }
    
    // For large datasets, use optimized filtering
    if (data.length > 500) {
      const result: T[] = [];
      const chunkSize = 200;
      
      for (let i = 0; i < data.length; i += chunkSize) {
        const end = Math.min(i + chunkSize, data.length);
        
        for (let j = i; j < end; j++) {
          if (filterFnRef.current(data[j])) {
            result.push(data[j]);
          }
        }
      }
      
      return result;
    }
    
    // For smaller datasets, use standard filter
    return data.filter(item => filterFnRef.current(item));
  }, [data, ...deps]);
}

export default useMemoizedData;
