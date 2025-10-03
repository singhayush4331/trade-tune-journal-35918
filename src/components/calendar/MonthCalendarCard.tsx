
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import MonthSummaryCard from './MonthSummaryCard';
import { DayProps } from 'react-day-picker';

interface MonthCalendarCardProps {
  month: Date;
  modifiers: any;
  monthStats: any;
  dayComponent: React.ComponentType<DayProps>;
  isPrimary?: boolean;
}

const MonthCalendarCard: React.FC<MonthCalendarCardProps> = ({
  month,
  modifiers,
  monthStats,
  dayComponent,
  isPrimary = false
}) => {
  return (
    <Card className={cn(
      "overflow-hidden border-2 shadow-lg hover:shadow-xl transition-shadow rounded-xl relative group",
      isPrimary 
        ? "border-primary shadow-xl bg-gradient-to-b from-card to-card/95 transform hover:-translate-y-1 transition-all duration-300" 
        : "border-primary/20"
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br from-primary/5 to-background/0 opacity-70 pointer-events-none",
        isPrimary && "from-primary/10 animate-pulse"
      )}></div>
      
      <CardHeader className={cn(
        "bg-gradient-to-r from-primary/15 to-primary/5 pb-2 relative z-10",
        isPrimary && "from-primary/20 to-primary/10"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarDays className={cn(
              "h-5 w-5 mr-2 text-primary",
              isPrimary ? "" : "animate-pulse"
            )} />
            <CardTitle className="text-md font-medium">
              {format(month, 'MMMM yyyy')}
            </CardTitle>
          </div>
          <MonthSummaryCard monthStats={monthStats} month={month} />
        </div>
      </CardHeader>
      
      <CardContent className={cn(
        "p-3 md:p-5 relative z-10",
        isPrimary ? "" : "transform group-hover:scale-[1.01] transition-transform duration-300"
      )}>
        <Calendar
          mode="single"
          month={month}
          modifiers={modifiers}
          modifiersStyles={{
            profitHigh: { 
              background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.7))', 
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '1rem',
              transform: 'scale(0.9)',
              boxShadow: '0 4px 6px -1px rgba(34, 197, 94, 0.3)'
            },
            profitMedium: { 
              background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.4))', 
              color: 'white',
              borderRadius: '1rem',
              transform: isPrimary ? 'scale(0.88)' : 'scale(0.85)'
            },
            profitLow: { 
              background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.2))', 
              color: 'white',
              borderRadius: '1rem',
              transform: isPrimary ? 'scale(0.85)' : 'scale(0.82)'
            },
            lossHigh: { 
              background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.9), rgba(239, 68, 68, 0.7))', 
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '1rem',
              transform: 'scale(0.9)',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.3)'
            },
            lossMedium: { 
              background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.4))', 
              color: 'white',
              borderRadius: '1rem',
              transform: isPrimary ? 'scale(0.88)' : 'scale(0.85)'
            },
            lossLow: { 
              background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.2))', 
              color: 'white',
              borderRadius: '1rem',
              transform: isPrimary ? 'scale(0.85)' : 'scale(0.82)'
            }
          }}
          components={{
            Day: dayComponent as any, // Using type assertion here to resolve the type error
            Caption: () => null,
          }}
          classNames={{
            day_today: "bg-accent text-accent-foreground font-bold rounded-2xl shadow-sm",
            day_selected: cn(
              "bg-primary text-primary-foreground rounded-2xl",
              isPrimary ? "shadow-lg" : "shadow-md"
            ),
            day: cn(
              "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-2xl transition-all hover:scale-105"
            ),
            caption_label: "hidden",
            caption: "hidden",
          }}
          className={cn("p-3 pointer-events-auto")}
        />
      </CardContent>
    </Card>
  );
};

export default React.memo(MonthCalendarCard);
