
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChartBar, TrendingDown, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

interface MonthStatsType {
  totalProfit: number;
  totalTrades: number;
  profitDays: number;
  lossDays: number;
}

interface MonthSummaryCardProps {
  monthStats: MonthStatsType;
  month: Date;
}

const MonthSummaryCard: React.FC<MonthSummaryCardProps> = ({ monthStats, month }) => {
  if (monthStats.totalTrades === 0) {
    return null;
  }
  
  const winRate = monthStats.profitDays / (monthStats.profitDays + monthStats.lossDays) * 100;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/10"
        >
          <ChartBar className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4 p-1">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="font-medium">{format(month, 'MMMM yyyy')} Summary</h3>
            <span 
              className={cn(
                "font-bold text-lg",
                monthStats.totalProfit >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {monthStats.totalProfit >= 0 ? '+' : ''}₹{monthStats.totalProfit.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Trading Days</span>
                <span>{monthStats.profitDays + monthStats.lossDays} days</span>
              </div>
              <div className="flex gap-1">
                <div 
                  className="bg-success/20 text-xs py-1 px-2 rounded flex items-center justify-center"
                  style={{ width: `${winRate}%` }}
                >
                  {monthStats.profitDays}
                </div>
                <div 
                  className="bg-destructive/20 text-xs py-1 px-2 rounded flex items-center justify-center"
                  style={{ width: `${100 - winRate}%` }}
                >
                  {monthStats.lossDays}
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1 text-sm">
                <span>Win Rate</span>
                <span>{winRate.toFixed(1)}%</span>
              </div>
              <Progress value={winRate} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Total Trades</span>
              <span>{monthStats.totalTrades}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span>Avg. P&L per Day</span>
              <span
                className={cn(
                  "font-medium",
                  monthStats.totalProfit / (monthStats.profitDays + monthStats.lossDays) >= 0 
                    ? "text-success" 
                    : "text-destructive"
                )}
              >
                {monthStats.totalProfit / (monthStats.profitDays + monthStats.lossDays) >= 0 ? '+' : ''}
                ₹{(monthStats.totalProfit / (monthStats.profitDays + monthStats.lossDays)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthSummaryCard;
