import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths, isSameMonth, isSameDay, formatISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ArrowLeft, ArrowRight, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { fetchUserTrades, TradesResponse } from '@/services/trades-service';
import { CalendarLegend } from '@/components/calendar/CalendarLegend';
import { CalendarMonthCard } from '@/components/calendar/CalendarMonthCard';
import { motion } from 'framer-motion';
import { cn, formatIndianCurrency } from '@/lib/utils';

interface ModernCalendarViewProps {
  onDayClick: (day: Date, dayTrades?: any[]) => void;
}

export const ModernCalendarView: React.FC<ModernCalendarViewProps> = ({
  onDayClick
}) => {
  const [focusDate, setFocusDate] = useState(() => subMonths(new Date(), 2));
  const [tradeDays, setTradeDays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [monthStats, setMonthStats] = useState<any>({
    totalProfit: 0,
    totalTrades: 0,
    profitDays: 0,
    lossDays: 0
  });

  const loadTradeData = async () => {
    setIsLoading(true);
    try {
      const response: TradesResponse = await fetchUserTrades();
      if (response.error) {
        console.error("Error fetching trades:", response.error);
        return;
      }
      if (response.data) {
        const tradeDayMap = new Map();
        response.data.forEach(trade => {
          const dateKey = formatISO(new Date(trade.date), {
            representation: 'date'
          });
          if (!tradeDayMap.has(dateKey)) {
            tradeDayMap.set(dateKey, {
              date: new Date(trade.date),
              profit: 0,
              trades: []
            });
          }
          const day = tradeDayMap.get(dateKey);
          day.profit += trade.pnl || 0;
          day.trades.push(trade);
        });
        const tradeDaysArray = Array.from(tradeDayMap.values());
        setTradeDays(tradeDaysArray);

        calculateMonthStats(tradeDaysArray);
      }
    } catch (err) {
      console.error("Error loading trade data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthStats = (tradeDaysArray: any[]) => {
    const currentMonthDays = tradeDaysArray.filter(day => isSameMonth(new Date(day.date), new Date()));
    const stats = {
      totalProfit: currentMonthDays.reduce((sum, day) => sum + day.profit, 0),
      totalTrades: currentMonthDays.reduce((sum, day) => sum + day.trades.length, 0),
      profitDays: currentMonthDays.filter(day => day.profit > 0).length,
      lossDays: currentMonthDays.filter(day => day.profit < 0).length
    };
    setMonthStats(stats);
  };

  useEffect(() => {
    loadTradeData();
    const handleTradeUpdate = () => {
      console.log("Trade data updated, reloading calendar data");
      loadTradeData();
    };
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('calendarDataUpdated', handleTradeUpdate);
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('calendarDataUpdated', handleTradeUpdate);
    };
  }, []);

  const goToPreviousMonth = () => setFocusDate(prev => subMonths(prev, 1));
  const goToNextMonth = () => setFocusDate(prev => addMonths(prev, 1));
  const goToCurrentMonth = () => setFocusDate(subMonths(new Date(), 2));

  const months = [0, 1, 2].map(i => addMonths(focusDate, i));

  const handleDaySelection = (day: Date) => {
    const selectedDateStr = formatISO(day, {
      representation: 'date'
    });
    const dayData = tradeDays.find(tradeDay => formatISO(new Date(tradeDay.date), {
      representation: 'date'
    }) === selectedDateStr);
    onDayClick(day, dayData?.trades || []);
  };

  return <div className="space-y-8 p-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <motion.div initial={{
          scale: 0.95,
          opacity: 0
        }} animate={{
          scale: 1,
          opacity: 1
        }} transition={{
          duration: 0.3
        }} className="flex items-center gap-3 bg-primary/5 rounded-xl px-4 py-2.5 shadow-sm border border-primary/10">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth} className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-base font-medium text-foreground flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <span className="hidden sm:inline">
                {format(months[0], 'MMMM')} - {format(months[2], 'MMMM')} {format(months[0], 'yyyy')}
              </span>
              <span className="sm:hidden">
                {format(months[0], 'MMM')} - {format(months[2], 'MMM')} {format(months[0], 'yyyy')}
              </span>
            </h2>
            
            <Button variant="ghost" size="icon" onClick={goToNextMonth} className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn("font-medium px-3 py-1.5 text-xs", isLoading && "animate-pulse")}>
              {isLoading ? "Loading..." : `${tradeDays.length} Trading Days`}
            </Badge>
            
            {!isLoading && monthStats.totalProfit !== 0 && 
              <Badge 
                variant={monthStats.totalProfit > 0 ? "success" : "destructive"} 
                className="font-medium px-3 py-1.5 text-xs"
              >
                {monthStats.totalProfit > 0 ? '+' : ''}{formatIndianCurrency(monthStats.totalProfit)}
              </Badge>
            }
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-success/10 border border-success/30 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Win Days</p>
            <p className="text-success font-bold text-lg">{monthStats.profitDays}</p>
          </div>
          
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Loss Days</p>
            <p className="text-destructive font-bold text-lg">{monthStats.lossDays}</p>
          </div>
          
          <div className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-center">
            <p className="text-xs text-muted-foreground">Trades</p>
            <p className="text-foreground font-bold text-lg">{monthStats.totalTrades}</p>
          </div>
          
          <div className={cn("border rounded-lg px-3 py-2 text-center", monthStats.totalProfit > 0 ? "bg-success/10 border-success/30" : "bg-destructive/10 border-destructive/30")}>
            <p className="text-xs text-muted-foreground">P&L</p>
            <p className={cn("font-bold text-lg", monthStats.totalProfit > 0 ? "text-success" : "text-destructive")}>
              {monthStats.totalProfit > 0 ? '+' : ''}{formatIndianCurrency(monthStats.totalProfit)}
            </p>
          </div>
        </div>
      </div>
      
      <CalendarLegend />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {months.map((month, index) => <motion.div key={index} className="w-full" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3,
        delay: index * 0.1
      }}>
            <CalendarMonthCard month={month} tradeDays={tradeDays} onDayClick={handleDaySelection} />
          </motion.div>)}
      </div>
    </div>;
};
