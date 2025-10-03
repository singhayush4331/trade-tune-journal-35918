import React, { useMemo, useState, useEffect } from 'react';
import { IndianRupee, TrendingUp, BarChart3, ArrowRightLeft, Calendar, Gavel, TimerIcon, Hourglass, Lightbulb } from 'lucide-react';
import StatCard from './StatCard';
import PerformanceChart from './PerformanceChart';
import WinRateChart from './WinRateChart';
import RecentTrades from './RecentTrades';
import { motion } from 'framer-motion';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay, differenceInMinutes } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchUserTrades } from '@/services/trades-service';
import { Trade } from '@/utils/trade-form-types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimeDistributionChart from './TimeDistributionChart';
import EmotionalAnalysisChart from './EmotionalAnalysisChart';
import OptionsAnalyticsChart from './OptionsAnalyticsChart';
import { calculateRiskRewardStats } from '@/utils/risk-reward-utils';
import { formatIndianCurrency } from '@/lib/utils';

interface AnalyticsOverviewProps {
  dateRange?: DateRange | undefined;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({
  dateRange
}) => {
  const isMobile = useIsMobile();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeInsightTab, setActiveInsightTab] = useState('sessions');

  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await fetchUserTrades();
      if (error) {
        console.error("Error fetching trades:", error);
        return;
      }
      if (data) {
        const processedTrades = data.map(trade => ({
          ...trade,
          date: trade.date instanceof Date ? trade.date : new Date(trade.date)
        }));
        setTrades(processedTrades);
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
      console.log("AnalyticsOverview component detected trade update");
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
    if (!dateRange || !dateRange.from) {
      return trades;
    }
    const rangeStart = startOfDay(dateRange.from);
    const rangeEnd = dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date());
    return trades.filter(trade => {
      const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
      return isWithinInterval(tradeDate, {
        start: rangeStart,
        end: rangeEnd
      });
    });
  }, [dateRange, trades]);

  const stats = useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        totalPnL: "₹0",
        winRate: "0%",
        totalTrades: "0",
        riskRewardStats: {
          avgRatio: 0,
          trend: 0,
          profitableRatios: []
        },
        pnLTrend: 0,
        winRateTrend: 0,
        totalTradesTrend: 0
      };
    }
    const totalPnL = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = filteredTrades.filter(trade => trade.pnl > 0);
    const winRate = Math.round(winningTrades.length / filteredTrades.length * 100);
    const {
      avgRatio,
      profitableRatios
    } = calculateRiskRewardStats(filteredTrades);
    const previousAvgRatio = calculateRiskRewardStats(filteredTrades.slice(0, Math.floor(filteredTrades.length / 2))).avgRatio;
    const riskRewardTrend = previousAvgRatio ? (avgRatio - previousAvgRatio) / previousAvgRatio * 100 : 0;
    const pnLTrend = winRate > 50 ? 10.5 : -5.2;
    const winRateTrend = winRate > 60 ? 5.3 : -2.1;
    const totalTradesTrend = filteredTrades.length > 10 ? 8.1 : 0;
    return {
      totalPnL: formatIndianCurrency(totalPnL),
      winRate: `${winRate}%`,
      totalTrades: filteredTrades.length.toString(),
      riskRewardStats: {
        avgRatio,
        trend: riskRewardTrend,
        profitableRatios
      },
      pnLTrend,
      winRateTrend,
      totalTradesTrend
    };
  }, [filteredTrades]);

  const advancedStats = useMemo(() => {
    if (filteredTrades.length === 0) {
      return {
        bestTime: 'N/A',
        avgHoldingTime: 'N/A',
        bestStrategy: 'N/A',
        weekdayPerformance: [{
          name: 'Mon',
          value: 0
        }, {
          name: 'Tue',
          value: 0
        }, {
          name: 'Wed',
          value: 0
        }, {
          name: 'Thu',
          value: 0
        }, {
          name: 'Fri',
          value: 0
        }],
        timeOfDayPerformance: [],
        emotions: []
      };
    }
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekdayStats = [0, 0, 0, 0, 0, 0, 0];
    const weekdayCounts = [0, 0, 0, 0, 0, 0, 0];
    const timeOfDayPerformance = Array(24).fill(0).map((_, i) => ({
      hour: i,
      pnl: 0,
      count: 0
    }));
    const strategyPerformance: Record<string, {
      pnl: number;
      count: number;
      wins: number;
    }> = {};
    let totalHoldingMinutes = 0;
    let tradeCountWithTime = 0;
    const emotionStats: Record<string, {
      count: number;
      totalPnl: number;
    }> = {};
    filteredTrades.forEach(trade => {
      const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
      const dayOfWeek = tradeDate.getDay(); // 0 is Sunday, 6 is Saturday

      weekdayStats[dayOfWeek] += trade.pnl;
      weekdayCounts[dayOfWeek]++;
      let hour = tradeDate.getHours();
      if (trade.entryTime) {
        const entryTimeDate = new Date(trade.entryTime);
        hour = entryTimeDate.getHours();
      }
      timeOfDayPerformance[hour].pnl += trade.pnl;
      timeOfDayPerformance[hour].count++;
      if (trade.strategy) {
        if (!strategyPerformance[trade.strategy]) {
          strategyPerformance[trade.strategy] = {
            pnl: 0,
            count: 0,
            wins: 0
          };
        }
        strategyPerformance[trade.strategy].pnl += trade.pnl;
        strategyPerformance[trade.strategy].count++;
        if (trade.pnl > 0) {
          strategyPerformance[trade.strategy].wins++;
        }
      }
      if (trade.entryTime && trade.exitTime) {
        try {
          const entryTime = new Date(trade.entryTime);
          const exitTime = new Date(trade.exitTime);
          const holdingMinutes = differenceInMinutes(exitTime, entryTime);
          if (holdingMinutes > 0) {
            totalHoldingMinutes += holdingMinutes;
            tradeCountWithTime++;
          }
        } catch (err) {
          console.error("Error calculating holding time:", err);
        }
      }
      if (trade.mood) {
        if (!emotionStats[trade.mood]) {
          emotionStats[trade.mood] = {
            count: 0,
            totalPnl: 0
          };
        }
        emotionStats[trade.mood].count++;
        emotionStats[trade.mood].totalPnl += trade.pnl;
      }
    });
    let bestDayIndex = 0;
    let bestDayPnl = weekdayStats[0];
    for (let i = 1; i < 7; i++) {
      if (weekdayCounts[i] > 0 && weekdayStats[i] / Math.max(1, weekdayCounts[i]) > bestDayPnl / Math.max(1, weekdayCounts[bestDayIndex])) {
        bestDayIndex = i;
        bestDayPnl = weekdayStats[i];
      }
    }
    let bestHourIndex = 0;
    let bestHourAvgPnl = 0;
    timeOfDayPerformance.forEach((hourData, index) => {
      if (hourData.count > 0) {
        const avgPnl = hourData.pnl / hourData.count;
        if (avgPnl > bestHourAvgPnl) {
          bestHourAvgPnl = avgPnl;
          bestHourIndex = index;
        }
      }
    });
    const bestTime = bestHourIndex === 0 ? 'N/A' : `${bestHourIndex}:00 - ${bestHourIndex + 1}:00`;
    let bestStrategy = 'N/A';
    let bestStrategyWinRate = 0;
    Object.entries(strategyPerformance).forEach(([strategy, data]) => {
      if (data.count >= 3) {
        const winRate = data.wins / data.count;
        if (winRate > bestStrategyWinRate) {
          bestStrategyWinRate = winRate;
          bestStrategy = strategy;
        }
      }
    });
    const avgHoldingTime = tradeCountWithTime > 0 ? `${Math.round(totalHoldingMinutes / tradeCountWithTime)} min` : 'N/A';
    const weekdayPerformance = weekdayStats.map((pnl, index) => ({
      name: daysOfWeek[index],
      value: weekdayCounts[index] > 0 ? pnl / weekdayCounts[index] : 0
    })).filter((_, i) => i > 0 && i < 6);
    const emotions = Object.entries(emotionStats).map(([mood, data]) => ({
      name: mood,
      value: data.count,
      pnl: data.totalPnl,
      avgPnl: data.count > 0 ? data.totalPnl / data.count : 0
    })).sort((a, b) => b.value - a.value);
    return {
      bestTime,
      avgHoldingTime,
      bestStrategy,
      weekdayPerformance,
      timeOfDayPerformance: timeOfDayPerformance.filter(hour => hour.count > 0).map(hour => ({
        name: `${hour.hour}:00`,
        pnl: hour.pnl,
        avgPnl: hour.count > 0 ? hour.pnl / hour.count : 0,
        count: hour.count
      })),
      emotions
    };
  }, [filteredTrades]);

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (isLoading) {
    return <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Skeleton className="h-80 sm:col-span-2 rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>;
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants} 
      className="space-y-6 sm:space-y-8 my-[36px]"
    >
      <motion.div 
        className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" 
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="h-full">
          <StatCard 
            title="Total P&L" 
            value={stats.totalPnL} 
            icon={<IndianRupee className="h-4 w-4 text-primary" />} 
            trend={{
              value: stats.pnLTrend,
              isPositive: stats.pnLTrend >= 0
            }} 
            className="bg-gradient-to-br from-success/5 to-transparent border-success/20 hover:border-success/40 hover:shadow-success/10 h-full" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="h-full">
          <StatCard 
            title="Win Rate" 
            value={stats.winRate} 
            icon={<TrendingUp className="h-4 w-4 text-primary" />} 
            trend={{
              value: stats.winRateTrend,
              isPositive: stats.winRateTrend >= 0
            }} 
            className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20 hover:border-primary/40 hover:shadow-primary/10 h-full" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="h-full">
          <StatCard 
            title="Total Trades" 
            value={stats.totalTrades} 
            icon={<BarChart3 className="h-4 w-4 text-primary" />} 
            trend={{
              value: stats.totalTradesTrend,
              isPositive: stats.totalTradesTrend >= 0
            }} 
            className="bg-gradient-to-br from-warning/5 to-transparent border-warning/20 hover:border-warning/40 hover:shadow-warning/10 h-full" 
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="h-full">
          <StatCard 
            title="Risk/Reward Ratio" 
            value={stats.riskRewardStats.avgRatio.toFixed(2)} 
            icon={<ArrowRightLeft className="h-4 w-4 text-primary" />} 
            trend={{
              value: stats.riskRewardStats.trend,
              isPositive: stats.riskRewardStats.trend >= 0
            }} 
            className="bg-gradient-to-br from-info/5 to-transparent border-info/20 hover:border-info/40 hover:shadow-info/10 h-full" 
          />
        </motion.div>
      </motion.div>
      
      {/* Main charts section - Fixed height for mobile and spacing issue */}
      <motion.div 
        className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:h-[500px]" 
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="sm:col-span-2 h-full">
          <PerformanceChart dateRange={dateRange} />
        </motion.div>
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
          <div className="flex-1 min-h-[200px]">
            <WinRateChart dateRange={dateRange} />
          </div>
          <div className="flex-1 min-h-[200px]">
            <RecentTrades dateRange={dateRange} />
          </div>
        </motion.div>
      </motion.div>
      
      {/* Trading Insights section - Added proper spacing for mobile */}
      <motion.div 
        className="space-y-4 pt-10 mt-10 border-t border-border/30" 
        initial={{
          opacity: 0,
          y: 20
        }} 
        animate={{
          opacity: 1,
          y: 0
        }} 
        transition={{
          duration: 0.5,
          delay: 0.3
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-md border border-primary/20">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Trading Insights</h3>
          </div>
        </div>
        
        <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 backdrop-blur-md p-1 rounded-lg border border-muted">
            <TabsTrigger value="sessions" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow text-xs sm:text-sm transition-all duration-200">
              <Calendar className="h-4 w-4 mr-1 sm:mr-2 opacity-70" /> Trading Sessions
            </TabsTrigger>
            <TabsTrigger value="emotions" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow text-xs sm:text-sm transition-all duration-200">
              <Lightbulb className="h-4 w-4 mr-1 sm:mr-2 opacity-70" /> Emotional Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sessions" className="space-y-4 mt-0">
            {/* Options Analytics - Show if options trades exist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4"
            >
              <OptionsAnalyticsChart trades={filteredTrades} />
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4
            }}>
                <Card className="overflow-hidden rounded-xl col-span-1 border-2 border-primary/20 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                        <Gavel className="h-4 w-4 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Best Trading Day</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple/80 bg-clip-text text-transparent">
                        {advancedStats.weekdayPerformance.length > 0 ? advancedStats.weekdayPerformance.reduce((max, day) => day.value > max.value ? day : max, advancedStats.weekdayPerformance[0]).name : 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Based on average P&L
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: 0.1
            }}>
                <Card className="overflow-hidden rounded-xl col-span-1 border-2 border-primary/20 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                        <TimerIcon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Best Trading Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple/80 bg-clip-text text-transparent">
                        {advancedStats.bestTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Most profitable hour
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.4,
              delay: 0.2
            }}>
                <Card className="overflow-hidden rounded-xl col-span-1 border-2 border-primary/20 bg-card shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                        <Hourglass className="h-4 w-4 text-primary" />
                      </div>
                      <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Avg. Holding Time</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple/80 bg-clip-text text-transparent">
                        {advancedStats.avgHoldingTime}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Per trade
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            <TimeDistributionChart weekdayData={advancedStats.weekdayPerformance} hourlyData={advancedStats.timeOfDayPerformance} />
          </TabsContent>
          
          <TabsContent value="emotions" className="mt-0">
            <EmotionalAnalysisChart emotions={advancedStats.emotions} />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsOverview;
