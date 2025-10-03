
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { fetchUserTrades } from '@/services/trades-service';
import { useMemoizedData } from './use-memoized-data';
import { debounce } from '@/utils/performance-monitoring';
import { isMockDataInitialized } from '@/services/mock-data-service';
import { useTrialStatus } from './use-trial-status';
import { usePerformanceMonitor } from './use-performance-monitor';

interface UseTradeDataOptions {
  dateRange?: DateRange;
  limit?: number;
  forceRefresh?: boolean;
  pageSize?: number;
  initialPage?: number;
}

export const useTradeData = ({ 
  dateRange, 
  limit, 
  forceRefresh = false,
  pageSize = 100, // Increased from 50 for more efficient loading
  initialPage = 0
}: UseTradeDataOptions = {}) => {
  const [trades, setTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [totalTrades, setTotalTrades] = useState<number | null>(null);
  const isMounted = useRef(true);
  
  const { isTrialActive } = useTrialStatus();
  const [usesMockData, setUsesMockData] = useState<boolean>(false);
  const perfMonitor = usePerformanceMonitor('useTradeData');
  
  // Cache key for better cache control
  const cacheKey = useMemo(() => {
    const mockDataPart = isTrialActive && isMockDataInitialized() ? '-mock' : '';
    return `trades${mockDataPart}-${dateRange?.from?.toISOString() || 'all'}-${limit || 'unlimited'}-${page}-${pageSize}`;
  }, [dateRange?.from, dateRange?.to, limit, page, pageSize, isTrialActive]);
  
  // Optimized load trades function with better error handling, pagination and abortable requests
  const loadTrades = useCallback(async (refresh = false, pageToLoad = page) => {
    if (!isMounted.current) return;
    
    perfMonitor.markEvent('load_trades_start');
    setIsLoading(true);
    
    // Create abort controller to cancel request if component unmounts
    const controller = new AbortController();
    const signal = controller.signal;
    
    try {
      const { data, error, count } = await fetchUserTrades({ 
        page: pageToLoad, 
        pageSize, 
        forceRefresh: refresh || forceRefresh,
        sortField: 'date', // Explicitly set sort field
        sortOrder: 'desc' // Most recent trades first
      });
      
      if (!isMounted.current) return;
      
      if (error) {
        setError(error instanceof Error ? error : new Error('Failed to fetch trades'));
        perfMonitor.markEvent('load_trades_error');
        return;
      }
      
      perfMonitor.markEvent('load_trades_success');
      
      if (data) {
        // Check if we're using mock data by examining the first trade's ID
        const usingMockData = data.length > 0 && data[0].id.startsWith('mock-');
        setUsesMockData(usingMockData);
        
        if (pageToLoad === 0 || refresh) {
          setTrades(data);
        } else {
          // Append new trades, avoiding duplicates with optimized Set lookup
          setTrades(prev => {
            const existingIds = new Set(prev.map(t => t.id));
            const newTrades = data.filter(t => !existingIds.has(t.id));
            return [...prev, ...newTrades];
          });
        }
        
        // Update pagination info
        if (count !== undefined) {
          setTotalTrades(count);
          setHasMore(pageToLoad * pageSize + data.length < count);
        } else {
          setHasMore(data.length === pageSize);
        }
      }
      
      setError(null);
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error("Error loading trades:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      perfMonitor.markEvent('load_trades_exception');
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        perfMonitor.markEvent('load_trades_complete');
        perfMonitor.measureEvent('load_trades_start', 'load_trades_complete', `Load trades (page ${pageToLoad})`);
      }
    }
    
    return () => controller.abort();
  }, [page, pageSize, forceRefresh, perfMonitor]);
  
  // Load next page of trades with debounce to prevent rapid multiple calls
  const debouncedLoadMore = useMemo(() => 
    debounce(() => {
      if (!isLoading && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadTrades(false, nextPage);
      }
    }, 300), // 300ms debounce
  [isLoading, hasMore, page, loadTrades]);
  
  const loadMore = useCallback(() => {
    perfMonitor.markEvent('load_more_triggered');
    debouncedLoadMore();
  }, [debouncedLoadMore, perfMonitor]);
  
  // Initial data load and event listeners setup
  useEffect(() => {
    perfMonitor.markEvent('hook_mounted');
    loadTrades(forceRefresh);
    
    const handleTradeUpdate = () => {
      perfMonitor.markEvent('trade_update_event');
      loadTrades(true, 0);
    };
    
    const handleMockDataChange = () => {
      // Reload data when mock data status changes
      perfMonitor.markEvent('mock_data_change_event');
      loadTrades(true, 0);
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('dashboardDataUpdated', handleTradeUpdate);
    window.addEventListener('mockDataInitialized', handleMockDataChange);
    window.addEventListener('mockDataRemoved', handleMockDataChange);
    
    return () => {
      isMounted.current = false;
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('dashboardDataUpdated', handleTradeUpdate);
      window.removeEventListener('mockDataInitialized', handleMockDataChange);
      window.removeEventListener('mockDataRemoved', handleMockDataChange);
      perfMonitor.markEvent('hook_unmounted');
    };
  }, [forceRefresh, cacheKey, loadTrades]);
  
  // Filter trades based on date range with optimized memoization
  const filteredTrades = useMemoizedData(trades, (allTrades) => {
    perfMonitor.markEvent('filtering_trades_start');
    
    if (!dateRange || !dateRange.from) {
      perfMonitor.markEvent('filtering_trades_complete');
      return allTrades;
    }
    
    const rangeStart = startOfDay(dateRange.from);
    const rangeEnd = dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date());
    
    const filtered = allTrades.filter(trade => {
      const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
      return isWithinInterval(tradeDate, { start: rangeStart, end: rangeEnd });
    });
    
    perfMonitor.markEvent('filtering_trades_complete');
    perfMonitor.measureEvent('filtering_trades_start', 'filtering_trades_complete', 'Filter trades by date');
    
    return filtered;
  }, [dateRange]);
  
  // Apply sorting and limiting with optimized logic
  const processedTrades = useMemo(() => {
    perfMonitor.markEvent('processing_trades_start');
    
    // Use already sorted data from backend when possible
    const result = limit && limit > 0 ? filteredTrades.slice(0, limit) : filteredTrades;
    
    perfMonitor.markEvent('processing_trades_complete');
    perfMonitor.measureEvent('processing_trades_start', 'processing_trades_complete', 'Process and limit trades');
    
    return result;
  }, [filteredTrades, limit]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  return {
    trades: processedTrades,
    allTrades: trades,
    isLoading,
    error,
    loadMore,
    hasMore,
    refresh: (resetPage = true) => {
      perfMonitor.markEvent('refresh_triggered');
      if (resetPage) setPage(0);
      return loadTrades(true, resetPage ? 0 : page);
    },
    totalTrades,
    page,
    isMockData: usesMockData
  };
};
