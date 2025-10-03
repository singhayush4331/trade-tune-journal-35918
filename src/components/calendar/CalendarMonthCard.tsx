import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { format, formatISO, isToday } from 'date-fns';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CalendarMonthCardProps {
  month: Date;
  tradeDays: any[];
  onDayClick: (day: Date) => void;
}

export const CalendarMonthCard: React.FC<CalendarMonthCardProps> = ({ 
  month, 
  tradeDays,
  onDayClick 
}) => {
  const getDayClassName = (date: Date): string => {
    const dateStr = formatISO(date, { representation: 'date' });
    const tradeDay = tradeDays.find(day => 
      formatISO(new Date(day.date), { representation: 'date' }) === dateStr
    );
    
    if (!tradeDay) return "";
    
    if (tradeDay.profit >= 500) {
      return "bg-gradient-to-br from-success/90 to-success/70 text-white font-semibold flex items-center justify-center w-7 h-7 text-center rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit >= 200) {
      return "bg-gradient-to-br from-success/70 to-success/50 text-white font-medium flex items-center justify-center w-7 h-7 text-center rounded-lg shadow-[0_0_6px_rgba(34,197,94,0.4)] hover:shadow-[0_0_10px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit > 0) {
      return "bg-gradient-to-br from-success/50 to-success/30 text-white flex items-center justify-center w-7 h-7 text-center rounded-lg shadow-[0_0_4px_rgba(34,197,94,0.3)] hover:shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit <= -500) {
      return "bg-gradient-to-br from-destructive/90 to-destructive/70 text-white font-semibold flex items-center justify-center w-7 h-7 text-center rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit <= -200) {
      return "bg-gradient-to-br from-destructive/70 to-destructive/50 text-white font-medium flex items-center justify-center w-7 h-7 text-center rounded-lg shadow-[0_0_6px_rgba(239,68,68,0.4)] hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105 mx-auto";
    } else {
      return "bg-gradient-to-br from-destructive/50 to-destructive/30 text-white flex items-center justify-center w-7 h-7 text-center rounded-lg shadow-[0_0_4px_rgba(239,68,68,0.3)] hover:shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105 mx-auto";
    }
  };

  const getDayInfo = (date: Date): { profit?: number, trades?: number } => {
    const dateStr = formatISO(date, { representation: 'date' });
    const tradeDay = tradeDays.find(day => 
      formatISO(new Date(day.date), { representation: 'date' }) === dateStr
    );
    
    if (!tradeDay) return {};
    
    return {
      profit: tradeDay.profit,
      trades: tradeDay.trades.length
    };
  };

  const CustomDayComponent = (props: any) => {
    if (!props.date) return <button {...props}>--</button>;
    
    const customClassName = getDayClassName(props.date);
    const dayNumber = props.date.getDate();
    const dayInfo = getDayInfo(props.date);
    const isCurrentDay = isToday(props.date);
    
    if (customClassName) {
      return (
        <button 
          {...props} 
          className={cn(props.className || "", "relative flex items-center justify-center p-0 h-10 w-10 group")}
          onClick={(e) => {
            e.stopPropagation();
            onDayClick(props.date);
          }}
        >
          <div className={cn(customClassName, "relative")}>
            {dayNumber}
            
            {dayInfo.trades && dayInfo.trades > 0 && (
              <span className="absolute -top-2 -right-2 bg-background text-foreground text-[8px] font-bold rounded-full h-4 w-4 flex items-center justify-center border border-border shadow-sm">
                {dayInfo.trades}
              </span>
            )}
          </div>
          
          {dayInfo.profit !== undefined && (
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-[8px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-background/80 backdrop-blur-sm rounded-full px-1.5 py-0.5 border border-border shadow-sm">
              {formatIndianCurrency(dayInfo.profit)}
            </span>
          )}
        </button>
      );
    }
    
    return (
      <button 
        {...props} 
        className={cn(
          props.className || "",
          "flex items-center justify-center w-7 h-7 rounded-lg hover:bg-muted/30 hover:scale-105 transition-all duration-200 mx-auto",
          isCurrentDay && "bg-primary/10 border border-primary/30 text-primary font-medium"
        )}
        onClick={(e) => {
          e.stopPropagation();
          onDayClick(props.date);
        }}
      >
        {dayNumber}
      </button>
    );
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

  return (
    <motion.div 
      className="rounded-xl shadow-md overflow-hidden bg-gradient-to-b from-card/80 to-card border border-border/50 hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <div className="text-center font-medium py-2 px-4 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border/50">
        {format(month, 'MMMM yyyy')}
      </div>
      <Calendar
        mode="single"
        month={month}
        onDayClick={onDayClick}
        modifiers={modifiers}
        components={{
          Day: CustomDayComponent,
          IconLeft: () => null,
          IconRight: () => null
        }}
        classNames={{
          day_today: "bg-accent text-accent-foreground font-bold rounded-2xl shadow-sm",
          day_selected: "bg-primary text-primary-foreground rounded-2xl shadow-md",
          day: cn(
            "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-2xl transition-all hover:scale-105"
          ),
          nav_button: "hidden",
          months: "flex flex-col space-y-3",
          month: "space-y-3",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          table: "w-full border-collapse",
          head_row: "flex w-full justify-between",
          head_cell: "text-xs text-muted-foreground w-9 font-medium text-center",
          row: "flex w-full mt-2 justify-between",
          cell: "relative p-0 text-center text-sm w-10 h-10 focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent/30"
        }}
        className="p-2 w-full"
      />
    </motion.div>
  );
};
