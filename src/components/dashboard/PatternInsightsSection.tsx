import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, BarChart3, Sparkles, Award, AlertCircle, Target, Zap, Lightbulb, BadgeCheck, CircleCheck, Flame } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils';
import { fetchPlaybookStrategies } from '@/utils/playbook-utils';
import { Trade } from '@/utils/trade-form-types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PatternInsightsSectionProps {
  trades: Trade[];
}

const PatternInsightsSection: React.FC<PatternInsightsSectionProps> = ({ trades }) => {
  // Add state to store strategies once they're loaded
  const [strategies, setStrategies] = useState<string[]>([]);
  
  // Load strategies when component mounts
  useEffect(() => {
    async function loadStrategies() {
      try {
        const loadedStrategies = await fetchPlaybookStrategies();
        setStrategies(loadedStrategies);
      } catch (error) {
        console.error("Error loading strategies:", error);
        setStrategies([]);
      }
    }
    
    loadStrategies();
  }, []);
  
  // Calculate insights based on trade patterns
  const insights = useMemo(() => {
    if (trades.length === 0) {
      return {
        bestStrategy: { name: 'N/A', winRate: 0, pnl: 0, count: 0 },
        profitFactorInsight: { value: 0, description: 'N/A' },
        streaks: { bestWin: 0, worstLoss: 0, current: 0 },
        tradingPatterns: []
      };
    }

    // Strategy analysis
    const strategiesRecord: Record<string, { wins: number; losses: number; pnl: number; count: number }> = {};
    
    // Initialize all strategies from our loaded strategies array
    strategies.forEach(strategy => {
      strategiesRecord[strategy] = { wins: 0, losses: 0, pnl: 0, count: 0 };
    });
    
    // Add any additional strategies from trades
    trades.forEach(trade => {
      if (trade.strategy && !strategiesRecord[trade.strategy]) {
        strategiesRecord[trade.strategy] = { wins: 0, losses: 0, pnl: 0, count: 0 };
      }
    });
    
    // Group all profits and losses to calculate profit factor
    let totalProfit = 0;
    let totalLoss = 0;
    
    // Streak tracking
    let currentStreak = 0;
    let bestWinStreak = 0;
    let worstLossStreak = 0;
    let tempWinStreak = 0;
    let tempLossStreak = 0;
    
    // Process each trade
    trades.forEach(trade => {
      // Strategy stats
      if (trade.strategy) {
        strategiesRecord[trade.strategy].count++;
        strategiesRecord[trade.strategy].pnl += trade.pnl;
        
        if (trade.pnl > 0) {
          strategiesRecord[trade.strategy].wins++;
        } else {
          strategiesRecord[trade.strategy].losses++;
        }
      }
      
      // Profit factor calculation
      if (trade.pnl > 0) {
        totalProfit += trade.pnl;
      } else {
        totalLoss += Math.abs(trade.pnl);
      }
      
      // Streak tracking
      if (trade.pnl > 0) {
        // Reset loss streak
        tempLossStreak = 0;
        // Increment win streak
        tempWinStreak++;
        // Update best win streak
        bestWinStreak = Math.max(bestWinStreak, tempWinStreak);
        
        if (tempWinStreak > 0) {
          currentStreak = tempWinStreak;
        }
      } else {
        // Reset win streak
        tempWinStreak = 0;
        // Increment loss streak
        tempLossStreak++;
        // Update worst loss streak
        worstLossStreak = Math.max(worstLossStreak, tempLossStreak);
        
        if (tempLossStreak > 0) {
          currentStreak = -tempLossStreak;
        }
      }
    });
    
    // Find best strategy by win rate (with minimum count threshold)
    let bestStrategy = { name: 'N/A', winRate: 0, pnl: 0, count: 0 };
    
    Object.entries(strategiesRecord).forEach(([name, data]) => {
      if (data.count >= 3) { // Minimum sample size
        const winRate = data.wins / data.count;
        if (winRate > bestStrategy.winRate) {
          bestStrategy = { 
            name, 
            winRate: winRate, 
            pnl: data.pnl,
            count: data.count
          };
        }
      }
    });
    
    // Calculate profit factor
    const profitFactor = totalLoss > 0 ? totalProfit / totalLoss : totalProfit > 0 ? Infinity : 0;
    
    // Create profit factor insight
    let profitFactorDescription = 'N/A';
    
    if (profitFactor === Infinity) {
      profitFactorDescription = 'Perfect (no losses)';
    } else if (profitFactor >= 3) {
      profitFactorDescription = 'Excellent';
    } else if (profitFactor >= 2) {
      profitFactorDescription = 'Very Good';
    } else if (profitFactor >= 1.5) {
      profitFactorDescription = 'Good';
    } else if (profitFactor >= 1) {
      profitFactorDescription = 'Profitable';
    } else {
      profitFactorDescription = 'Needs Improvement';
    }
    
    // Detect patterns
    const tradingPatterns = [];
    
    // Pattern: Significant gaps between win and loss sizes
    const winningTrades = trades.filter(t => t.pnl > 0);
    const losingTrades = trades.filter(t => t.pnl < 0);
    
    const avgWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, t) => sum + t.pnl, 0) / winningTrades.length 
      : 0;
    
    const avgLoss = losingTrades.length > 0 
      ? losingTrades.reduce((sum, t) => sum + Math.abs(t.pnl), 0) / losingTrades.length 
      : 0;
    
    if (winningTrades.length > 3 && losingTrades.length > 3) {
      if (avgWin > 2 * avgLoss) {
        tradingPatterns.push({
          type: 'positive',
          title: 'Good Risk/Reward Ratio',
          description: 'Your winning trades are significantly larger than your losing trades.',
          metric: `${(avgWin / Math.max(1, avgLoss)).toFixed(1)}:1`,
          icon: Target
        });
      } else if (avgLoss > avgWin) {
        tradingPatterns.push({
          type: 'negative',
          title: 'Poor Risk/Reward Ratio',
          description: 'Your losing trades are larger than your winning trades.',
          metric: `${(avgWin / Math.max(1, avgLoss)).toFixed(1)}:1`,
          icon: AlertCircle
        });
      }
    }
    
    // Pattern: Consecutive losses (if worst streak is concerning)
    if (worstLossStreak >= 4) {
      tradingPatterns.push({
        type: 'negative',
        title: 'Consecutive Losses',
        description: 'You had a streak of consecutive losing trades. Review risk management.',
        metric: `${worstLossStreak} trades`,
        icon: AlertCircle
      });
    }
    
    // Pattern: High win streak
    if (bestWinStreak >= 5) {
      tradingPatterns.push({
        type: 'positive',
        title: 'Strong Win Streak',
        description: 'You achieved a significant streak of winning trades.',
        metric: `${bestWinStreak} trades`,
        icon: Award
      });
    }
    
    return {
      bestStrategy,
      profitFactorInsight: {
        value: profitFactor,
        description: profitFactorDescription
      },
      streaks: {
        bestWin: bestWinStreak,
        worstLoss: worstLossStreak,
        current: currentStreak
      },
      tradingPatterns
    };
  }, [trades, strategies]); // Add strategies as a dependency

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Strategy Card */}
        <Card className="col-span-1 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Best Strategy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="flex flex-col justify-between">
              <div className="text-2xl font-bold mb-1 flex items-center">
                {insights.bestStrategy.name !== 'N/A' && (
                  <motion.div 
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <Zap className="h-5 w-5 mr-2 text-amber-500" />
                  </motion.div>
                )}
                <span className={cn(
                  "bg-clip-text text-transparent transition-all",
                  insights.bestStrategy.name !== 'N/A' 
                    ? 'bg-gradient-to-r from-primary via-primary/90 to-purple/80' 
                    : 'bg-gradient-to-r from-foreground to-foreground/70'
                )}>
                  {insights.bestStrategy.name}
                </span>
              </div>
              {insights.bestStrategy.name !== 'N/A' ? (
                <motion.div 
                  className="flex items-center space-x-2 text-sm mt-1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="px-2 py-0.5 bg-success/10 text-success rounded-full text-xs font-medium flex items-center">
                    <BadgeCheck className="h-3 w-3 mr-1" />
                    {(insights.bestStrategy.winRate * 100).toFixed(0)}% win rate
                  </span>
                  <span className="text-muted-foreground text-xs">
                    ({insights.bestStrategy.count} trades)
                  </span>
                </motion.div>
              ) : (
                <div className="text-sm text-muted-foreground mt-1">
                  Not enough data to determine
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Profit Factor Card */}
        <Card className="col-span-1 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute top-0 left-0 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Profit Factor</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="flex flex-col justify-between">
              <motion.div 
                className="text-2xl font-bold mb-1"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className={cn(
                  "bg-clip-text text-transparent transition-all",
                  insights.profitFactorInsight.value >= 3 ? 'bg-gradient-to-r from-success to-green-400' :
                  insights.profitFactorInsight.value >= 1.5 ? 'bg-gradient-to-r from-primary to-purple-400' :
                  insights.profitFactorInsight.value >= 1 ? 'bg-gradient-to-r from-warning to-amber-400' :
                  'bg-gradient-to-r from-destructive to-red-400'
                )}>
                  {insights.profitFactorInsight.value === Infinity 
                    ? '∞' 
                    : insights.profitFactorInsight.value.toFixed(2)}
                </span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={cn(
                  "text-sm mt-1 px-2 py-0.5 rounded-full inline-flex w-fit items-center",
                  insights.profitFactorInsight.value >= 3 ? "bg-success/10 text-success" :
                  insights.profitFactorInsight.value >= 1.5 ? "bg-primary/10 text-primary" :
                  insights.profitFactorInsight.value >= 1 ? "bg-warning/10 text-warning" :
                  "bg-destructive/10 text-destructive"
                )}
              >
                {insights.profitFactorInsight.value >= 1.5 && <CircleCheck className="h-3 w-3 mr-1" />}
                {insights.profitFactorInsight.description}
              </motion.div>
            </div>
          </CardContent>
        </Card>
        
        {/* Trading Streaks Card */}
        <Card className="col-span-1 overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-primary/5 rounded-full blur-xl"></div>
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5">
                <BarChart3 className="h-4 w-4 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Trading Streaks</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            <div className="flex flex-col justify-between">
              <motion.div 
                className="text-xl font-bold mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {insights.streaks.current > 0 
                  ? (
                    <div className="flex items-center text-success">
                      <Flame className="h-5 w-5 mr-1.5 text-success" />
                      <span className="bg-gradient-to-r from-success to-green-400 bg-clip-text text-transparent">
                        {insights.streaks.current} wins
                      </span>
                    </div>
                  ) : insights.streaks.current < 0 
                    ? (
                      <div className="flex items-center text-destructive">
                        <TrendingUp className="h-5 w-5 mr-1.5 rotate-180" />
                        <span className="bg-gradient-to-r from-destructive to-red-400 bg-clip-text text-transparent">
                          {Math.abs(insights.streaks.current)} losses
                        </span>
                      </div>
                    ) : 'No streak'}
              </motion.div>
              <motion.div 
                className="flex text-xs justify-between mt-2 gap-2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="bg-success/10 text-success rounded-full px-2 py-0.5 flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Best: {insights.streaks.bestWin} wins
                </span>
                <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Worst: {insights.streaks.worstLoss} losses
                </span>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Trading Pattern Insights */}
      <motion.div variants={item}>
        <Card className="overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple/5 rounded-full blur-3xl"></div>
          
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Trading Pattern Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 relative z-10">
            {insights.tradingPatterns.length > 0 ? (
              <div className="space-y-4">
                {insights.tradingPatterns.map((pattern, index) => {
                  const Icon = pattern.icon || (pattern.type === 'positive' ? Award : AlertCircle);
                  return (
                    <motion.div 
                      key={index} 
                      className={`rounded-xl p-4 border ${
                        pattern.type === 'positive' 
                          ? 'border-success/30 bg-gradient-to-br from-success/10 to-success/5 hover:border-success/40' 
                          : 'border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 hover:border-destructive/40'
                      } transition-all duration-300 backdrop-blur-sm`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className={`p-2 rounded-lg ${
                            pattern.type === 'positive' 
                              ? 'bg-success/10 text-success'
                              : 'bg-destructive/10 text-destructive'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className={`font-medium ${
                              pattern.type === 'positive' ? 'text-success' : 'text-destructive'
                            }`}>
                              {pattern.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {pattern.description}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pattern.type === 'positive' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                        } flex items-center`}>
                          {pattern.type === 'positive' && <BadgeCheck className="h-3 w-3 mr-1" />}
                          {pattern.type === 'negative' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {pattern.metric}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : trades.length > 0 ? (
              <div className="py-8 text-center">
                <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl p-6 backdrop-blur-sm flex flex-col items-center">
                  <Lightbulb className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                  <p className="text-muted-foreground">No significant patterns detected yet</p>
                  <p className="text-xs mt-1 text-muted-foreground">Add more trades to unlock pattern insights</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center">
                <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl p-6 backdrop-blur-sm flex flex-col items-center">
                  <Sparkles className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
                  <p className="text-muted-foreground">Add trades to get pattern insights</p>
                  <p className="text-xs mt-1 text-muted-foreground">Trade patterns will appear automatically</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default PatternInsightsSection;
