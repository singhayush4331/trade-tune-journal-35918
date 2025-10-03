
import { useState, useEffect, useMemo, useCallback } from 'react';
import { formatISO } from 'date-fns';
import { fetchUserTrades } from '@/services/trades-service';
import { Trade } from '@/utils/trade-form-types';
import { toast } from 'sonner';
import { useChartDataFormatter } from './use-memoized-data';

export interface TradeDay {
  date: Date;
  profit: number;
  trades: number;
}

interface UseCalendarDataOptions {
  year?: number;
  month?: number;
  forceRefresh?: boolean;
}

export const useCalendarData = ({ year, month, forceRefresh = false }: UseCalendarDataOptions = {}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  
  // Generate a cache key based on year and month
  const cacheKey = useMemo(() => {
    return `calendar-${year || 'all'}-${month || 'all'}`;
  }, [year, month]);
  
  // Load trades data optimized for calendar view
  const loadTradeData = useCallback(async (force = false) => {
    setIsLoading(true);
    
    try {
      // Fetch all trades in one go with optimized parameters
      const { data, error } = await fetchUserTrades({ 
        forceRefresh: force || forceRefresh,
        pageSize: 1000 // Larger page size for calendar view which needs all data
      });
      
      if (error) {
        console.error("Error fetching trades for calendar:", error);
        toast.error("Failed to load calendar data");
        setError(error instanceof Error ? error : new Error('Failed to fetch trades'));
        return;
      }
      
      if (data) {
        setTrades(data);
        setError(null);
      }
    } catch (err) {
      console.error("Error in loadTradeData:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      toast.error("Failed to load calendar data");
    } finally {
      setIsLoading(false);
    }
  }, [forceRefresh]);
  
  // Initial data load and event listeners setup
  useEffect(() => {
    loadTradeData();
    
    // Event handlers
    const handleTradeUpdate = () => {
      console.log("Calendar data hook detected trade update event");
      loadTradeData(true);
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('calendarDataUpdated', handleTradeUpdate);
    window.addEventListener('globalDataRefresh', handleTradeUpdate);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('calendarDataUpdated', handleTradeUpdate);
      window.removeEventListener('globalDataRefresh', handleTradeUpdate);
    };
  }, [cacheKey, loadTradeData]);
  
  // Convert trades to trade days with optimized processing
  const tradeDays = useChartDataFormatter<Trade, TradeDay>(
    trades,
    (trade) => {
      const dateKey = formatISO(new Date(trade.date), { representation: 'date' });
      return {
        date: new Date(trade.date),
        profit: trade.pnl || 0,
        trades: 1
      };
    },
    [trades.length]
  );
  
  // Group trade days by date
  const groupedTradeDays = useMemo(() => {
    if (!tradeDays.length) return [];
    
    const tradeDayMap = new Map<string, TradeDay>();
    
    tradeDays.forEach(day => {
      const dateKey = formatISO(new Date(day.date), { representation: 'date' });
      
      if (!tradeDayMap.has(dateKey)) {
        tradeDayMap.set(dateKey, {
          date: day.date,
          profit: 0,
          trades: 0
        });
      }
      
      const existingDay = tradeDayMap.get(dateKey)!;
      existingDay.profit += day.profit;
      existingDay.trades += day.trades;
    });
    
    return Array.from(tradeDayMap.values());
  }, [tradeDays]);
  
  // Filter trade days by year and month if specified
  const filteredTradeDays = useMemo(() => {
    if (!year && !month) return groupedTradeDays;
    
    return groupedTradeDays.filter(day => {
      const dayDate = new Date(day.date);
      const matchesYear = year ? dayDate.getFullYear() === year : true;
      const matchesMonth = month !== undefined ? dayDate.getMonth() === month : true;
      return matchesYear && matchesMonth;
    });
  }, [groupedTradeDays, year, month]);
  
  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    if (!filteredTradeDays.length) return {};
    
    const monthMap = new Map<number, {
      totalProfit: number;
      totalTrades: number;
      profitDays: number;
      lossDays: number;
    }>();
    
    filteredTradeDays.forEach(day => {
      const dayDate = new Date(day.date);
      const monthKey = dayDate.getMonth();
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          totalProfit: 0,
          totalTrades: 0,
          profitDays: 0,
          lossDays: 0
        });
      }
      
      const monthStat = monthMap.get(monthKey)!;
      monthStat.totalProfit += day.profit;
      monthStat.totalTrades += day.trades;
      
      if (day.profit >= 0) {
        monthStat.profitDays += 1;
      } else {
        monthStat.lossDays += 1;
      }
    });
    
    return Object.fromEntries(monthMap.entries());
  }, [filteredTradeDays]);
  
  return {
    tradeDays: filteredTradeDays,
    isLoading,
    error,
    refresh: () => loadTradeData(true),
    monthlyStats
  };
};
