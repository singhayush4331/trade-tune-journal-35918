import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import CalendarViewSelector from './CalendarViewSelector';
import DateNavigator from './DateNavigator';
import MonthlyView from './views/MonthlyView';
import YearlyView from './views/YearlyView';
import { formatISO, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { Trade } from '@/utils/trade-form-types';
import { toast } from 'sonner';
import { fetchUserTrades } from '@/services/trades-service';
import { useAuth } from '@/hooks/use-auth';
import { useMemoizedData } from '@/hooks/use-memoized-data';

interface TradeCalendarProps {
  onDayClick?: (day: Date, tradeDays?: any[]) => void;
}

// Optimized trade day conversion with better memoization
const convertTradesToTradeDay = (trades: Trade[]) => {
  if (!trades || trades.length === 0) return [];

  const tradeDayMap = new Map();
  
  // Process in chunks for large datasets to avoid UI freezing
  const processChunk = (startIdx: number, endIdx: number) => {
    for (let i = startIdx; i < endIdx && i < trades.length; i++) {
      const trade = trades[i];
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
    }
  };
  
  // Process in chunks of 200 trades for better performance
  const chunkSize = 200;
  for (let i = 0; i < trades.length; i += chunkSize) {
    processChunk(i, i + chunkSize);
  }
  
  return Array.from(tradeDayMap.values());
};

const TradeCalendar: React.FC<TradeCalendarProps> = ({ onDayClick }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'monthly' | 'yearly'>('monthly');
  const [tradeDays, setTradeDays] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [tradesData, setTradesData] = useState<Trade[] | null>(null);
  const { user } = useAuth();
  
  // Calculate tradeDays using memoized function for better performance
  const calculatedTradeDays = useMemoizedData(tradesData || [], convertTradesToTradeDay);
  
  // Update tradeDays when calculatedTradeDays changes
  useEffect(() => {
    if (calculatedTradeDays && calculatedTradeDays.length > 0) {
      setTradeDays(calculatedTradeDays);
    }
  }, [calculatedTradeDays]);
  
  // Parse URL parameters
  useEffect(() => {
    const viewParam = searchParams.get('view');
    if (viewParam && (viewParam === 'monthly' || viewParam === 'yearly')) {
      setView(viewParam);
    }
    
    const dateParam = searchParams.get('date');
    if (dateParam) {
      try {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          setCurrentDate(parsedDate);
        }
      } catch (e) {
        // Invalid date, ignore
      }
    }
  }, [searchParams]);
  
  const loadTradeData = useCallback(async (forceRefresh = false) => {
    if (!user) {
      setTradesData([]);
      setTradeDays([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await fetchUserTrades({ 
        forceRefresh,
        // Added pagination with larger page size for initial load
        pageSize: 500
      });
      
      if (error) {
        console.error("Error fetching trades:", error);
        toast.error("Failed to load trades data");
        return;
      }
      
      if (data) {
        setTradesData(data);
        // tradeDays will be updated via the effect when calculatedTradeDays changes
      }
    } catch (err) {
      console.error("Error in loadTradeData:", err);
      toast.error("Failed to load trades data");
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Load trade data and setup event listeners
  useEffect(() => {
    loadTradeData();
    
    // Event handlers with proper cleanup
    const handleTradeUpdate = () => {
      console.log("TradeCalendar component detected trade update event");
      loadTradeData(true); // Force refresh on update
    };
    
    const handleGlobalRefresh = (event: Event) => {
      console.log("TradeCalendar component detected global refresh event");
      const customEvent = event as CustomEvent;
      
      if (customEvent.detail?.isLogout || customEvent.detail?.newLogin) {
        console.log("Logout or new login detected in calendar, forcing refresh");
        loadTradeData(true);
      } else {
        loadTradeData();
      }
    };
    
    // Listen for cache clear events
    const handleCacheClear = () => {
      console.log("TradeCalendar component detected cache clear event");
      setTradeDays([]); // Clear the local state immediately
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('calendarDataUpdated', handleTradeUpdate);
    window.addEventListener('globalDataRefresh', handleGlobalRefresh);
    window.addEventListener('clearUserDataCache', handleCacheClear);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('calendarDataUpdated', handleTradeUpdate);
      window.removeEventListener('globalDataRefresh', handleGlobalRefresh);
      window.removeEventListener('clearUserDataCache', handleCacheClear);
    };
  }, [loadTradeData]);
  
  // Update URL when view or date changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', view);
    params.set('date', formatISO(currentDate, { representation: 'date' }));
    setSearchParams(params, { replace: true });
  }, [view, currentDate, setSearchParams]);
  
  // Memoized handlers with improved performance
  const handleViewChange = useCallback((newView: 'monthly' | 'yearly') => {
    setView(newView);
  }, []);
  
  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);
  
  const handleDayClick = useCallback((day: Date) => {
    console.log('Day clicked in TradeCalendar:', day);
    setSelectedDate(day);
    toast.info(`Selected ${day.toLocaleDateString()}`);
    
    if (onDayClick) {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);
      
      // Use existing tradeDays directly for better performance
      const dayTrades = tradeDays.filter(tradeDay => {
        const tradeDate = new Date(tradeDay.date);
        return isWithinInterval(tradeDate, { start: dayStart, end: dayEnd });
      });
      
      onDayClick(day, dayTrades);
    }
  }, [onDayClick, tradeDays]);

  // Memoize the components for better rendering performance
  const monthlyViewComponent = useMemo(() => (
    <MonthlyView 
      tradeDays={tradeDays}
      currentDate={currentDate}
      onDateChange={handleDateChange}
      onDayClick={handleDayClick}
      isLoading={isLoading}
    />
  ), [tradeDays, currentDate, handleDateChange, handleDayClick, isLoading]);

  const yearlyViewComponent = useMemo(() => (
    <YearlyView 
      tradeDays={tradeDays}
      currentDate={currentDate}
      onMonthSelect={handleDateChange}
    />
  ), [tradeDays, currentDate, handleDateChange]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/10 to-transparent p-4 rounded-xl">
        <DateNavigator 
          currentDate={currentDate}
          onDateChange={handleDateChange}
          view={view}
        />
        
        <div className="flex items-center gap-4">
          <CalendarViewSelector 
            currentView={view} 
            onViewChange={handleViewChange} 
          />
        </div>
      </div>
      
      <Card className="border border-border/40 shadow-md overflow-hidden rounded-xl bg-gradient-to-b from-card to-card/95">
        <CardContent className="p-6">
          <div className="flex items-center justify-end gap-2 mb-6">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xl bg-success/80 border border-success shadow-sm shadow-success/20"></div>
                <span className="text-xs text-muted-foreground">High Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xl bg-success/50 border border-success/60"></div>
                <span className="text-xs text-muted-foreground">Medium Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xl bg-success/30 border border-success/40"></div>
                <span className="text-xs text-muted-foreground">Low Profit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xl bg-destructive/30 border border-destructive/40"></div>
                <span className="text-xs text-muted-foreground">Low Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xl bg-destructive/50 border border-destructive/60"></div>
                <span className="text-xs text-muted-foreground">Medium Loss</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-xl bg-destructive/80 border border-destructive shadow-sm shadow-destructive/20"></div>
                <span className="text-xs text-muted-foreground">High Loss</span>
              </div>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {view === 'monthly' ? monthlyViewComponent : yearlyViewComponent}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(TradeCalendar);
