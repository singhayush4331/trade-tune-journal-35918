import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  format, 
  setMonth, 
  startOfMonth, 
  endOfMonth,
  isSameMonth,
  getMonth,
  isSameDay
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useMonthData } from '@/hooks/calendar/useMonthData';

interface YearlyViewProps {
  tradeDays?: any[];
  currentDate: Date;
  onMonthSelect: (date: Date) => void;
  className?: string;
}

const YearlyView: React.FC<YearlyViewProps> = ({
  tradeDays = [],
  currentDate,
  onMonthSelect,
  className
}) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = setMonth(new Date(currentDate.getFullYear(), 0), i);
    return {
      date,
      name: format(date, 'MMM'),
      isCurrentMonth: isSameMonth(date, new Date())
    };
  });

  const monthsWithStats = months.map(month => {
    const { monthStats } = useMonthData(month.date, tradeDays);
    
    let performanceLevel = 0;
    if (monthStats.totalProfit >= 2000) {
      performanceLevel = 3;
    } else if (monthStats.totalProfit >= 1000) {
      performanceLevel = 2;
    } else if (monthStats.totalProfit > 0) {
      performanceLevel = 1;
    } else if (monthStats.totalProfit <= -2000) {
      performanceLevel = -3;
    } else if (monthStats.totalProfit <= -1000) {
      performanceLevel = -2;
    } else if (monthStats.totalProfit < 0) {
      performanceLevel = -1;
    }
    
    return {
      ...month,
      stats: monthStats,
      performanceLevel
    };
  });

  const handleMonthClick = (date: Date) => {
    onMonthSelect(date);
  };
  
  const getMonthPerformanceClass = (performanceLevel: number) => {
    if (performanceLevel === 0) return "bg-muted/40 border-muted";
    
    switch (performanceLevel) {
      case 3:
        return "bg-success/80 border-success";
      case 2:
        return "bg-success/50 border-success/70";
      case 1:
        return "bg-success/30 border-success/50";
      case -1:
        return "bg-destructive/30 border-destructive/50";
      case -2:
        return "bg-destructive/50 border-destructive/70";
      case -3:
        return "bg-destructive/80 border-destructive";
      default:
        return "bg-muted/40 border-muted";
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="overflow-hidden border-2 border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
              <CardTitle>{currentDate.getFullYear()}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {monthsWithStats.map((month) => (
              <TooltipProvider key={month.name} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "flex flex-col h-32 p-2 rounded-2xl border-2 cursor-pointer transition-all duration-300",
                        getMonthPerformanceClass(month.performanceLevel),
                        month.isCurrentMonth && "ring-2 ring-primary ring-offset-2",
                        "hover:scale-105"
                      )}
                      onClick={() => handleMonthClick(month.date)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{month.name}</h3>
                        {month.stats.totalTrades > 0 && (
                          <Badge variant="outline" className={cn(
                            month.stats.totalProfit >= 0 
                              ? "bg-success/20 text-success border-success/50" 
                              : "bg-destructive/20 text-destructive border-destructive/50"
                          )}>
                            {month.stats.totalTrades} trades
                          </Badge>
                        )}
                      </div>
                      
                      {month.stats.totalTrades > 0 ? (
                        <div className="mt-auto text-center">
                          <div className={cn(
                            "text-lg font-bold",
                            month.stats.totalProfit >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {month.stats.totalProfit >= 0 ? '+' : ''}
                            ₹{month.stats.totalProfit.toFixed(2)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Win rate: {(month.stats.profitDays / (month.stats.profitDays + month.stats.lossDays || 1) * 100).toFixed(0)}%
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No trades
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="p-0 overflow-hidden max-w-sm">
                    <div className="p-3 bg-gradient-to-r from-card/95 to-card/80 backdrop-blur-md">
                      <h3 className="font-semibold mb-1">{format(month.date, 'MMMM yyyy')}</h3>
                      {month.stats.totalTrades > 0 ? (
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span>Total P&L:</span>
                            <span className={cn(month.stats.totalProfit >= 0 ? "text-success" : "text-destructive")}>
                              {month.stats.totalProfit >= 0 ? '+' : ''}₹{month.stats.totalProfit.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Trades:</span>
                            <span>{month.stats.totalTrades}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Win/Loss:</span>
                            <div className="flex gap-1">
                              <span className="text-success">{month.stats.profitDays}W</span>
                              <span>/</span>
                              <span className="text-destructive">{month.stats.lossDays}L</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span>Win Rate:</span>
                            <span>
                              {(month.stats.profitDays / (month.stats.profitDays + month.stats.lossDays || 1) * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-muted-foreground text-sm">No trading activity</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default YearlyView;
