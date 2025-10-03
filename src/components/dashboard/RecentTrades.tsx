
import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollText, TrendingDown, TrendingUp, BadgeCheck, Clock, Calendar } from 'lucide-react';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { fetchUserTrades } from '@/services/trades-service';
import { isWithinInterval, startOfDay, endOfDay, format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RecentTradesProps {
  dateRange?: DateRange | undefined;
}

const RecentTrades: React.FC<RecentTradesProps> = ({ dateRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const isMobile = useIsMobile();

  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchUserTrades();
      if (data) {
        const sortedTrades = [...data].sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        setTrades(sortedTrades);
      }
    } catch (err) {
      console.error("Error loading trades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrades();
    
    const handleTradeUpdate = () => {
      loadTrades();
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('dashboardDataUpdated', handleTradeUpdate);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('dashboardDataUpdated', handleTradeUpdate);
    };
  }, []);

  const filteredTrades = useMemo(() => {
    if (!dateRange || !dateRange.from || trades.length === 0) {
      return trades.slice(0, 3);
    }
    
    const rangeStart = startOfDay(dateRange.from);
    const rangeEnd = dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date());
    
    return trades.filter(trade => {
      const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
      return isWithinInterval(tradeDate, { start: rangeStart, end: rangeEnd });
    }).slice(0, 3);
  }, [trades, dateRange]);

  const getGradientClass = (pnl: number) => {
    return pnl >= 0 
      ? "bg-gradient-to-r from-emerald-50/20 via-emerald-100/20 to-transparent dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-transparent" 
      : "bg-gradient-to-r from-rose-50/20 via-rose-100/20 to-transparent dark:from-rose-950/30 dark:via-rose-900/20 dark:to-transparent";
  }

  // Animation variants for trade items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  }

  if (isLoading) {
    return (
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center">
              <ScrollText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <CardTitle className="text-sm sm:text-md font-medium">Recent Trades</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/10 shadow-lg flex flex-col relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-50"></div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl"></div>
      
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-2 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <ScrollText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <CardTitle className="text-sm sm:text-md font-medium bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Recent Trades</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 relative z-10">
        {filteredTrades.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground text-sm">
            <div className="rounded-full bg-muted/30 p-3 mb-3">
              <Calendar className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="font-medium mb-1">No recent trades</p>
            <p className="text-xs">Trades you add will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col">
            <motion.div 
              className="divide-y divide-border/30"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {filteredTrades.map((trade) => {
                const isProfitable = trade.pnl > 0;
                const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
                
                return (
                  <motion.div 
                    key={trade.id} 
                    className={cn(
                      "px-4 py-3 hover:bg-muted/20 transition-colors relative overflow-hidden",
                      getGradientClass(trade.pnl)
                    )}
                    variants={itemVariants}
                  >
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1",
                      isProfitable ? "bg-emerald-500/70" : "bg-rose-500/70"
                    )}/>
                    
                    {!isMobile ? (
                      // Desktop layout
                      <div className="flex items-center justify-between pl-2">
                        <div className="min-w-0 flex-1 pr-2">
                          <div className="flex items-center">
                            <span className="font-medium text-sm truncate max-w-[120px] sm:max-w-[160px]">
                              {trade.symbol || 'Unknown'}
                            </span>
                            <div className="flex items-center ml-2 text-xs text-muted-foreground gap-1">
                              <Clock className="h-3 w-3" />
                              <span className="shrink-0">
                                {format(tradeDate, 'dd MMM')}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground truncate max-w-[160px] sm:max-w-[200px] flex items-center gap-1">
                            {trade.strategy && (
                              <>
                                <BadgeCheck className="h-3 w-3" />
                                {trade.strategy}
                              </>
                            )}
                          </div>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-medium whitespace-nowrap shrink-0 py-1 px-2 rounded-full",
                          isProfitable 
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30" 
                            : "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30"
                        )}>
                          {isProfitable ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{formatIndianCurrency(trade.pnl)}</span>
                        </div>
                      </div>
                    ) : (
                      // Mobile layout (optimized to avoid scrolling)
                      <div className="flex items-center justify-between pl-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center">
                            <span className="font-medium text-sm truncate max-w-[100px]">
                              {trade.symbol || 'Unknown'}
                            </span>
                          </div>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-xs font-medium whitespace-nowrap shrink-0 py-1 px-2 rounded-full",
                          isProfitable 
                            ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30" 
                            : "text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/30"
                        )}>
                          {isProfitable ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span>{formatIndianCurrency(trade.pnl)}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
            <Link 
              to="/trades" 
              className="text-center block w-full py-3 px-2 text-xs text-primary hover:bg-primary/5 transition-colors border-t border-border/30 relative z-20 font-medium"
            >
              View all trades
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(RecentTrades);
