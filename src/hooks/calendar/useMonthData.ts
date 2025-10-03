
import { useState, useMemo, useEffect, useCallback } from 'react';
import { isWithinInterval, startOfMonth, endOfMonth, formatISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Trade } from '@/utils/trade-form-types';
import { fetchUserTrades, TradesResponse } from '@/services/trades-service';

export const useMonthData = (month: Date, tradeDays: any[] = []) => {
  const [allTradeDays, setAllTradeDays] = useState<any[]>(tradeDays);
  const [isLoading, setIsLoading] = useState(false);
  
  // Convert trades to trade days - memoized
  const convertTradesToTradeDay = useCallback((trades: Trade[]) => {
    const tradeDayMap = new Map();
    
    trades.forEach(trade => {
      const dateKey = formatISO(new Date(trade.date), { representation: 'date' });
      
      if (!tradeDayMap.has(dateKey)) {
        tradeDayMap.set(dateKey, {
          date: new Date(trade.date),
          profit: 0,
          trades: 0
        });
      }
      
      const day = tradeDayMap.get(dateKey);
      day.profit += trade.pnl || 0;
      day.trades += 1;
    });
    
    return Array.from(tradeDayMap.values());
  }, []);
  
  // Memoize month boundaries
  const monthBoundaries = useMemo(() => {
    return {
      start: startOfMonth(month),
      end: endOfMonth(month)
    };
  }, [month]);
  
  // Load trade data
  useEffect(() => {
    const loadTradeData = async () => {
      if (tradeDays.length > 0) {
        setAllTradeDays(tradeDays);
        return;
      }
      
      setIsLoading(true);
      try {
        const response: TradesResponse = await fetchUserTrades();
        
        if (response.error) {
          console.error("Error fetching trades:", response.error);
          return;
        }
        
        if (response.data) {
          const calculatedTradeDays = convertTradesToTradeDay(response.data);
          setAllTradeDays(calculatedTradeDays);
        }
      } catch (err) {
        console.error("Error loading trade data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTradeData();
    
    const handleTradeDataUpdated = () => loadTradeData();
    
    window.addEventListener('tradeDataUpdated', handleTradeDataUpdated);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeDataUpdated);
    };
  }, [tradeDays, convertTradesToTradeDay]);
  
  // Filter trades for this month
  const monthTradeDays = useMemo(() => {
    return allTradeDays.filter(day => 
      isWithinInterval(new Date(day.date), monthBoundaries)
    );
  }, [allTradeDays, monthBoundaries]);
  
  // Calculate month stats
  const monthStats = useMemo(() => {
    const totalProfit = monthTradeDays.reduce((sum, day) => sum + day.profit, 0);
    const totalTrades = monthTradeDays.reduce((sum, day) => sum + day.trades, 0);
    const profitDays = monthTradeDays.filter(day => day.profit > 0).length;
    const lossDays = monthTradeDays.filter(day => day.profit < 0).length;
    
    return {
      totalProfit,
      totalTrades,
      profitDays,
      lossDays
    };
  }, [monthTradeDays]);
  
  // Create modifiers for the calendar
  const modifiers = useMemo(() => {
    return {
      hasTrades: monthTradeDays.map(day => new Date(day.date)),
      profitHigh: monthTradeDays
        .filter(day => day.profit >= 500)
        .map(day => new Date(day.date)),
      profitMedium: monthTradeDays
        .filter(day => day.profit >= 200 && day.profit < 500)
        .map(day => new Date(day.date)),
      profitLow: monthTradeDays
        .filter(day => day.profit > 0 && day.profit < 200)
        .map(day => new Date(day.date)),
      lossHigh: monthTradeDays
        .filter(day => day.profit <= -500)
        .map(day => new Date(day.date)),
      lossMedium: monthTradeDays
        .filter(day => day.profit <= -200 && day.profit > -500)
        .map(day => new Date(day.date)),
      lossLow: monthTradeDays
        .filter(day => day.profit < 0 && day.profit > -200)
        .map(day => new Date(day.date))
    };
  }, [monthTradeDays]);
  
  // Get class name for a specific day
  const getDayClassName = useCallback((date: Date): string => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const tradeDay = monthTradeDays.find(
      day => format(new Date(day.date), 'yyyy-MM-dd') === dateStr
    );
    
    if (!tradeDay) return "";
    
    if (tradeDay.profit >= 500) {
      return "bg-gradient-to-b from-success/90 to-success/70 text-white font-semibold flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit >= 200) {
      return "bg-gradient-to-b from-success/70 to-success/50 text-white font-medium flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_6px_rgba(34,197,94,0.4)] hover:shadow-[0_0_10px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit > 0) {
      return "bg-gradient-to-b from-success/50 to-success/30 text-white flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_4px_rgba(34,197,94,0.3)] hover:shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit <= -500) {
      return "bg-gradient-to-b from-destructive/90 to-destructive/70 text-white font-semibold flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit <= -200) {
      return "bg-gradient-to-b from-destructive/70 to-destructive/50 text-white font-medium flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_6px_rgba(239,68,68,0.4)] hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105 mx-auto";
    } else {
      return "bg-gradient-to-b from-destructive/50 to-destructive/30 text-white flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_4px_rgba(239,68,68,0.3)] hover:shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105 mx-auto";
    }
  }, [monthTradeDays]);
  
  return {
    monthTradeDays,
    monthStats,
    isLoading,
    modifiers,
    getDayClassName
  };
};
