
import React from 'react';
import { format, startOfMonth, endOfMonth, addDays, eachDayOfInterval, isSameMonth, formatISO, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CalendarGridProps {
  startDate: Date;
  tradeDays: any[];
  onDayClick: (day: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  startDate, 
  tradeDays, 
  onDayClick 
}) => {
  // Generate a 3-month calendar grid
  const months = [0, 1, 2].map(i => addDays(startDate, i * 31));
  
  // Get trade class for day
  const getTradeClass = (date: Date): { className: string, profit?: number, trades?: number } => {
    const dateStr = formatISO(date, { representation: 'date' });
    const tradeDay = tradeDays.find(day => 
      formatISO(new Date(day.date), { representation: 'date' }) === dateStr
    );
    
    if (!tradeDay) return { className: "" };
    
    if (tradeDay.profit >= 500) {
      return { 
        className: "bg-gradient-to-b from-success/90 to-success/70 text-white",
        profit: tradeDay.profit,
        trades: tradeDay.trades?.length || 0
      };
    } else if (tradeDay.profit >= 200) {
      return { 
        className: "bg-gradient-to-b from-success/70 to-success/50 text-white",
        profit: tradeDay.profit,
        trades: tradeDay.trades?.length || 0
      };
    } else if (tradeDay.profit > 0) {
      return { 
        className: "bg-gradient-to-b from-success/50 to-success/30 text-white",
        profit: tradeDay.profit,
        trades: tradeDay.trades?.length || 0
      };
    } else if (tradeDay.profit <= -500) {
      return { 
        className: "bg-gradient-to-b from-destructive/90 to-destructive/70 text-white",
        profit: tradeDay.profit,
        trades: tradeDay.trades?.length || 0
      };
    } else if (tradeDay.profit <= -200) {
      return { 
        className: "bg-gradient-to-b from-destructive/70 to-destructive/50 text-white",
        profit: tradeDay.profit,
        trades: tradeDay.trades?.length || 0
      };
    } else {
      return { 
        className: "bg-gradient-to-b from-destructive/50 to-destructive/30 text-white",
        profit: tradeDay.profit,
        trades: tradeDay.trades?.length || 0
      };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      {months.map((monthDate, monthIndex) => {
        const firstDay = startOfMonth(monthDate);
        const lastDay = endOfMonth(monthDate);
        const days = eachDayOfInterval({ start: firstDay, end: lastDay });
        
        // Get day names - starting with Sunday
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        return (
          <motion.div 
            key={format(monthDate, 'yyyy-MM')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: monthIndex * 0.1 }}
            className="border rounded-xl shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm"
          >
            <div className="bg-primary/10 p-2 text-center font-medium text-primary">
              {format(monthDate, 'MMMM yyyy')}
            </div>
            
            <div className="grid grid-cols-7 text-center py-2 bg-muted/10">
              {dayNames.map(day => (
                <div key={day} className="text-xs font-medium text-muted-foreground px-1">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1 p-2">
              {Array.from({ length: firstDay.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12 w-full"></div>
              ))}
              
              {days.map(day => {
                const tradeData = getTradeClass(day);
                
                return (
                  <motion.button
                    key={format(day, 'yyyy-MM-dd')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onDayClick(day)}
                    className={cn(
                      "relative h-12 w-full rounded-lg flex flex-col items-center justify-center transition-all",
                      !isSameMonth(day, monthDate) && "text-muted-foreground opacity-50",
                      isToday(day) && !tradeData.className && "border border-primary/30 bg-primary/5",
                      tradeData.className
                    )}
                  >
                    <span className={tradeData.className ? "font-medium" : ""}>
                      {format(day, 'd')}
                    </span>
                    
                    {tradeData.trades && tradeData.trades > 0 && (
                      <span className="text-[10px] opacity-90">
                        {tradeData.trades} {tradeData.trades === 1 ? 'trade' : 'trades'}
                      </span>
                    )}
                    
                    {tradeData.profit && (
                      <div className="absolute bottom-0 inset-x-0 rounded-b-lg flex items-center justify-center mt-1">
                        <span className="text-[9px] font-medium py-0.5">
                          {tradeData.profit > 0 ? '+' : ''}{tradeData.profit}
                        </span>
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
