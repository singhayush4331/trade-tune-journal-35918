
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DateRange } from 'react-day-picker';
import { format, formatISO, addMonths, subMonths } from 'date-fns';
import { useMonthData } from '@/hooks/calendar/useMonthData';
import { cn } from '@/lib/utils';
import { DayClickEventHandler } from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchUserTrades } from '@/services/trades-service';

interface MultiMonthCalendarViewProps {
  dateRange?: DateRange;
  onDayClick: (day: Date, dayTrades?: any[]) => void;
}

export const MultiMonthCalendarView: React.FC<MultiMonthCalendarViewProps> = ({ 
  dateRange,
  onDayClick 
}) => {
  const [currentMonth, setCurrentMonth] = useState(subMonths(new Date(), 2));
  const [tradeDays, setTradeDays] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const monthsToShow = 3;
  
  const loadTradeData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await fetchUserTrades();
      
      if (error) {
        console.error("Error fetching trades:", error);
        return;
      }
      
      if (data) {
        const tradeDayMap = new Map();
        
        data.forEach(trade => {
          const dateKey = formatISO(new Date(trade.date), { representation: 'date' });
          
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
        
        setTradeDays(Array.from(tradeDayMap.values()));
      }
    } catch (err) {
      console.error("Error loading trade data:", err);
    } finally {
      setIsLoading(false);
    }
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
  
  useEffect(() => {
    if (dateRange?.from) {
      setCurrentMonth(dateRange.from);
    }
  }, [dateRange]);
  
  const { getDayClassName } = useMonthData(currentMonth, tradeDays);
  
  const handleDayClick: DayClickEventHandler = (day, modifiers, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const selectedDateStr = formatISO(day, { representation: 'date' });
    const dayData = tradeDays.find(tradeDay => 
      formatISO(new Date(tradeDay.date), { representation: 'date' }) === selectedDateStr
    );
    
    console.log('Day clicked:', day);
    console.log('Found day data:', dayData);
    console.log('Passing trades to handler:', dayData?.trades || []);
    
    onDayClick(day, dayData?.trades || []);
  };
  
  const modifiers = {
    hasTrades: tradeDays.map(day => day.date),
    profitHigh: tradeDays
      .filter(day => day.profit >= 500)
      .map(day => day.date),
    profitMedium: tradeDays
      .filter(day => day.profit >= 200 && day.profit < 500)
      .map(day => day.date),
    profitLow: tradeDays
      .filter(day => day.profit > 0 && day.profit < 200)
      .map(day => day.date),
    lossHigh: tradeDays
      .filter(day => day.profit <= -500)
      .map(day => day.date),
    lossMedium: tradeDays
      .filter(day => day.profit <= -200 && day.profit > -500)
      .map(day => day.date),
    lossLow: tradeDays
      .filter(day => day.profit < 0 && day.profit > -200)
      .map(day => day.date)
  };
  
  const navigatePrevious = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };
  
  const navigateNext = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const CustomDayComponent = (props: any) => {
    if (!props.date) return (
      <button 
        {...props} 
        type="button" 
        className="pointer-events-auto cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (props.onClick) props.onClick(e);
        }}
      >
        --
      </button>
    );
    
    const customClassName = getDayClassName(props.date);
    const dayNumber = props.date.getDate();
    
    if (customClassName) {
      return (
        <button 
          {...props} 
          type="button"
          className={cn(
            props.className || "", 
            "flex items-center justify-center p-0 h-9 w-9 pointer-events-auto cursor-pointer hover:bg-primary/20"
          )}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Calendar day clicked:", props.date);
            if (props.onClick) {
              props.onClick(e);
            }
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <div className={cn(customClassName)}>
            {dayNumber}
          </div>
        </button>
      );
    }
    
    return (
      <button 
        {...props} 
        type="button"
        className={cn(
          props.className || "",
          "flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/30 hover:scale-105 transition-all mx-auto pointer-events-auto cursor-pointer"
        )}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("Calendar day clicked:", props.date);
          if (props.onClick) {
            props.onClick(e);
          }
        }}
        style={{ pointerEvents: 'auto' }}
      >
        {dayNumber}
      </button>
    );
  };

  const currentViewMonth = currentMonth;
  const endViewMonth = addMonths(currentMonth, monthsToShow - 1);

  return (
    <div className="space-y-6 pointer-events-auto">
      <div className="flex justify-between items-center mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={navigatePrevious}
          type="button"
          className="rounded-full"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">
          {format(currentViewMonth, 'MMMM yyyy')} - {format(endViewMonth, 'MMMM yyyy')}
        </h2>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={navigateNext}
          type="button"
          className="rounded-full"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: monthsToShow }).map((_, index) => {
          const month = addMonths(currentMonth, index);
          return (
            <div key={index} className="border rounded-xl shadow-sm p-2 pointer-events-auto">
              <div className="text-center font-medium mb-2 text-primary pointer-events-auto">
                {format(month, 'MMMM yyyy')}
              </div>
              <Calendar
                mode="single"
                month={month}
                onDayClick={handleDayClick}
                modifiers={modifiers}
                components={{
                  Day: CustomDayComponent
                }}
                classNames={{
                  day_today: "bg-accent text-accent-foreground font-bold rounded-2xl shadow-sm",
                  day_selected: "bg-primary text-primary-foreground rounded-2xl shadow-md",
                  day: cn(
                    "h-8 w-8 p-0 font-normal aria-selected:opacity-100 rounded-2xl transition-all hover:scale-105 pointer-events-auto cursor-pointer"
                  ),
                  months: "flex flex-col space-y-3",
                  month: "space-y-3",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium",
                  table: "w-full border-collapse",
                  head_row: "flex w-full justify-between",
                  head_cell: "text-xs text-muted-foreground w-8 font-medium text-center",
                  row: "flex w-full mt-1 justify-between",
                  cell: "relative p-0 text-center text-sm w-8 h-8 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/30"
                }}
                className="p-2 pointer-events-auto"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
