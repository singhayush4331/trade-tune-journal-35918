
import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIndianCurrency } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlaybookAnalyticsChartProps {
  winRate: number;
  totalTrades: number;
  profitLoss: number;
  avgRiskReward: string;
  winningTrades: number;
  losingTrades: number;
}

const PlaybookAnalyticsChart: React.FC<PlaybookAnalyticsChartProps> = ({
  winRate,
  totalTrades,
  profitLoss,
  avgRiskReward,
  winningTrades,
  losingTrades,
}) => {
  const isMobile = useIsMobile();
  
  if (totalTrades === 0) {
    return (
      <div className="bg-muted/5 rounded-lg border border-border/30 p-3 sm:p-4 text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">No trade data available</p>
      </div>
    );
  }

  const isProfit = profitLoss >= 0;
  const statusColor = isProfit ? "from-green-500/80 to-green-700" : "from-red-500/80 to-red-700";
  const bgGradient = isProfit 
    ? "from-green-500/10 to-green-700/5" 
    : "from-red-500/10 to-red-700/5";
  
  const getWinRateColor = (rate: number) => {
    if (rate >= 70) return "bg-emerald-500";
    if (rate >= 50) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <motion.div 
      className="mt-3 sm:mt-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={cn(
        "rounded-xl overflow-hidden border shadow-md",
        isProfit 
          ? "border-green-500/20 bg-gradient-to-br from-green-950/10 to-background" 
          : "border-red-500/20 bg-gradient-to-br from-red-950/10 to-background"
      )}>
        <div className="p-3 sm:p-4">
          {/* Main Stats */}
          <div className="flex justify-between items-start mb-2 sm:mb-3">
            <div>
              <p className="text-xs text-muted-foreground font-medium mb-0.5 sm:mb-1">Win Rate</p>
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <span className={cn(
                  "text-lg sm:text-2xl font-bold",
                  winRate >= 70 ? "text-emerald-500" : 
                  winRate >= 50 ? "text-blue-500" : "text-amber-500"
                )}>
                  {winRate.toFixed(0)}%
                </span>
                <span className="text-2xs sm:text-xs text-muted-foreground">
                  ({winningTrades}/{totalTrades})
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium mb-0.5 sm:mb-1">Profit/Loss</p>
              <p className={cn(
                "text-lg sm:text-2xl font-bold",
                isProfit ? "text-green-500" : "text-red-500"
              )}>
                {isProfit ? '+' : ''}{formatIndianCurrency(profitLoss)}
              </p>
            </div>
          </div>
          
          {/* Win Rate Progress Bar */}
          <div className="mt-2 sm:mt-3">
            <div className="h-2 sm:h-2.5 w-full bg-muted/30 rounded-full overflow-hidden">
              <motion.div 
                className={cn("h-full rounded-full", getWinRateColor(winRate))}
                initial={{ width: 0 }}
                animate={{ width: `${winRate}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
              />
            </div>
            
            <div className="flex justify-between mt-1">
              <span className="text-[8px] sm:text-[10px] text-muted-foreground">0%</span>
              <span className="text-[8px] sm:text-[10px] text-muted-foreground">50%</span>
              <span className="text-[8px] sm:text-[10px] text-muted-foreground">100%</span>
            </div>
          </div>
        </div>
        
        {/* Footer Stats */}
        <div className={cn(
          "py-1.5 sm:py-2 px-3 sm:px-4 flex justify-between items-center text-white",
          "bg-gradient-to-r", statusColor
        )}>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Target className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className="text-2xs sm:text-xs font-medium">R:R {avgRiskReward}</span>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-1.5">
            {isProfit ? (
              <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            )}
            <span className="text-2xs sm:text-xs font-medium">
              {isProfit ? "Profitable" : "Loss-making"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlaybookAnalyticsChart;
