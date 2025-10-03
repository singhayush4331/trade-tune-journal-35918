import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trade } from '@/utils/trade-form-types';
import { formatIndianCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, Target, BarChart3, Zap, Award, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface OptionsAnalyticsChartProps {
  trades: Trade[];
}

const OptionsAnalyticsChart: React.FC<OptionsAnalyticsChartProps> = ({ trades }) => {
  const optionsData = useMemo(() => {
    // Filter only options trades
    const optionsTrades = trades.filter(trade => 
      trade.marketSegment === 'options' || 
      trade.market_segment === 'options' ||
      trade.symbol?.includes('CE') ||
      trade.symbol?.includes('PE')
    );

    if (optionsTrades.length === 0) {
      return {
        chartData: [],
        stats: { totalTrades: 0, totalPnL: 0, ceStats: null, peStats: null },
        isEmpty: true
      };
    }

    // Categorize by CE/PE
    const ceStats = {
      trades: 0,
      pnl: 0,
      wins: 0,
      losses: 0
    };
    
    const peStats = {
      trades: 0,
      pnl: 0,
      wins: 0,
      losses: 0
    };

    optionsTrades.forEach(trade => {
      const isCE = trade.symbol?.includes('CE') || trade.optionType === 'CE' || trade.option_type === 'CE';
      const isPE = trade.symbol?.includes('PE') || trade.optionType === 'PE' || trade.option_type === 'PE';
      
      if (isCE) {
        ceStats.trades++;
        ceStats.pnl += trade.pnl;
        if (trade.pnl > 0) ceStats.wins++;
        else ceStats.losses++;
      } else if (isPE) {
        peStats.trades++;
        peStats.pnl += trade.pnl;
        if (trade.pnl > 0) peStats.wins++;
        else peStats.losses++;
      }
    });

    const chartData = [
      {
        name: 'Call Options (CE)',
        value: ceStats.trades,
        pnl: ceStats.pnl,
        wins: ceStats.wins,
        losses: ceStats.losses,
        winRate: ceStats.trades > 0 ? Math.round((ceStats.wins / ceStats.trades) * 100) : 0,
        avgPnl: ceStats.trades > 0 ? ceStats.pnl / ceStats.trades : 0,
        color: 'hsl(var(--success))'
      },
      {
        name: 'Put Options (PE)',
        value: peStats.trades,
        pnl: peStats.pnl,
        wins: peStats.wins,
        losses: peStats.losses,
        winRate: peStats.trades > 0 ? Math.round((peStats.wins / peStats.trades) * 100) : 0,
        avgPnl: peStats.trades > 0 ? peStats.pnl / peStats.trades : 0,
        color: 'hsl(var(--destructive))'
      }
    ].filter(item => item.value > 0);

    return {
      chartData,
      stats: {
        totalTrades: optionsTrades.length,
        totalPnL: ceStats.pnl + peStats.pnl,
        ceStats: ceStats.trades > 0 ? ceStats : null,
        peStats: peStats.trades > 0 ? peStats : null
      },
      isEmpty: false
    };
  }, [trades]);

  if (optionsData.isEmpty) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-background/95 backdrop-blur-xl border border-primary/20 rounded-xl p-4 shadow-2xl"
        >
          <p className="font-semibold text-sm mb-3 text-primary">{data.name}</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Trades:</span>
              <span className="font-medium">{data.value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total P&L:</span>
              <span className={`font-medium ${data.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatIndianCurrency(data.pnl)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Win Rate:</span>
              <span className="font-medium text-primary">{data.winRate}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Avg P&L:</span>
              <span className={`font-medium ${data.avgPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatIndianCurrency(data.avgPnl)}
              </span>
            </div>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  const totalTrades = optionsData.stats.totalTrades;
  const cePercentage = optionsData.stats.ceStats ? Math.round((optionsData.stats.ceStats.trades / totalTrades) * 100) : 0;
  const pePercentage = optionsData.stats.peStats ? Math.round((optionsData.stats.peStats.trades / totalTrades) * 100) : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Redesigned Modern Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="relative overflow-hidden"
      >
        
        <div className="relative bg-gradient-to-r from-card/95 via-card/98 to-card/95 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-2xl blur-md opacity-30" />
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                  Options Trading Analysis
                </h3>
                <p className="text-sm text-foreground/80 mt-1">Advanced options performance insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">{totalTrades} Total</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full">
                <Activity className="h-4 w-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">Live Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Enhanced Portfolio Split Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="xl:col-span-4"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
            <Card className="relative bg-gradient-to-br from-card/95 via-card/98 to-card/95 backdrop-blur-xl border-primary/20 shadow-2xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <h4 className="font-bold text-lg text-foreground">
                      Portfolio Split
                    </h4>
                  </div>
                  <div className="relative">
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                      {totalTrades}
                    </div>
                    <div className="text-sm text-foreground/70 mt-1">Total Options Trades</div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl blur-sm" />
                  <div className="relative bg-gradient-to-br from-background/50 to-muted/30 rounded-2xl p-4">
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={optionsData.chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={75}
                          innerRadius={35}
                          paddingAngle={6}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1200}
                        >
                          {optionsData.chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke="transparent"
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xs font-bold text-foreground/80">CE vs PE</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-success/80 shadow-lg shadow-success/30"></div>
                      <span className="font-medium text-foreground">Call Options</span>
                    </div>
                    <span className="font-bold text-lg text-foreground">{cePercentage}%</span>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-destructive to-destructive/80 shadow-lg shadow-destructive/30"></div>
                      <span className="font-medium text-foreground">Put Options</span>
                    </div>
                    <span className="font-bold text-lg text-foreground">{pePercentage}%</span>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Enhanced Total P&L and Performance Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="xl:col-span-4 space-y-6"
        >
          {/* Total P&L Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
            <Card className={`relative overflow-hidden ${optionsData.stats.totalPnL >= 0 ? 'bg-gradient-to-br from-success/5 via-success/10 to-success/5' : 'bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/5'} backdrop-blur-xl border-primary/20 shadow-2xl`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <div className="text-sm text-foreground/80 font-medium">Total P&L</div>
                    </div>
                    <div className={`text-3xl font-bold ${optionsData.stats.totalPnL >= 0 ? 'bg-gradient-to-r from-success to-success/80' : 'bg-gradient-to-r from-destructive to-destructive/80'} bg-clip-text text-transparent`}>
                      {formatIndianCurrency(optionsData.stats.totalPnL)}
                    </div>
                    <div className="text-xs text-foreground mt-1">
                      Avg: {formatIndianCurrency(optionsData.stats.totalPnL / totalTrades)} per trade
                    </div>
                  </div>
                  <div className={`relative w-16 h-16 rounded-2xl ${optionsData.stats.totalPnL >= 0 ? 'bg-gradient-to-br from-success/20 to-success/10' : 'bg-gradient-to-br from-destructive/20 to-destructive/10'} flex items-center justify-center`}>
                    <div className={`absolute inset-0 ${optionsData.stats.totalPnL >= 0 ? 'bg-success/20' : 'bg-destructive/20'} rounded-2xl blur-md`} />
                    <div className="relative">
                      {optionsData.stats.totalPnL >= 0 ? (
                        <TrendingUp className="h-8 w-8 text-success" />
                      ) : (
                        <TrendingDown className="h-8 w-8 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
            <Card className="relative bg-gradient-to-br from-card/95 via-card/98 to-card/95 backdrop-blur-xl border-primary/20 shadow-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-5 w-5 text-accent" />
                  <h4 className="font-bold text-lg text-foreground">Performance Summary</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20"
                  >
                    <div className="text-2xl font-bold text-primary mb-1">
                      {Math.round(((optionsData.stats.ceStats?.wins || 0) + (optionsData.stats.peStats?.wins || 0)) / totalTrades * 100)}%
                    </div>
                    <div className="text-xs text-foreground/70 font-medium">Win Rate</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20"
                  >
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {formatIndianCurrency(optionsData.stats.totalPnL / totalTrades)}
                    </div>
                    <div className="text-xs text-foreground/70 font-medium">Avg Trade</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
                  >
                    <div className="text-lg font-bold text-success mb-1">
                      {(optionsData.stats.ceStats?.pnl || 0) >= (optionsData.stats.peStats?.pnl || 0) ? 'Calls' : 'Puts'}
                    </div>
                    <div className="text-xs text-foreground/70 font-medium">Best Type</div>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 rounded-xl bg-gradient-to-br from-muted/20 to-muted/10 border border-border/20"
                  >
                    <div className="text-2xl font-bold text-success mb-1">
                      {(optionsData.stats.ceStats?.wins || 0) + (optionsData.stats.peStats?.wins || 0)}
                    </div>
                    <div className="text-xs text-foreground/70 font-medium">Total Wins</div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Enhanced Detailed Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="xl:col-span-4 space-y-6"
        >
          {optionsData.stats.ceStats && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-success/30 via-success/20 to-success/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
              <Card className="relative overflow-hidden bg-gradient-to-br from-success/5 via-success/10 to-success/5 backdrop-blur-xl border-success/30 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-success via-success/80 to-success/60" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-success/30 rounded-xl blur-md" />
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-success to-success/80 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-lg text-foreground">Call Options</span>
                        <div className="text-xs text-foreground/60 font-medium">CE Positions</div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-success/20 to-success/10 text-foreground border-success/30 rounded-full px-4 py-2 text-sm font-bold">
                      {cePercentage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20">
                      <span className="text-sm font-medium text-foreground/80">Total P&L</span>
                      <span className={`font-bold text-lg ${optionsData.stats.ceStats.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatIndianCurrency(optionsData.stats.ceStats.pnl)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
                      >
                        <div className="text-2xl font-bold text-success">{optionsData.stats.ceStats.trades}</div>
                        <div className="text-xs text-foreground/60 font-medium">Trades</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
                      >
                        <div className="text-2xl font-bold text-success">{optionsData.stats.ceStats.wins}</div>
                        <div className="text-xs text-foreground/60 font-medium">Wins</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20"
                      >
                        <div className="text-2xl font-bold text-success">
                          {Math.round((optionsData.stats.ceStats.wins / optionsData.stats.ceStats.trades) * 100)}%
                        </div>
                        <div className="text-xs text-foreground/60 font-medium">Rate</div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {optionsData.stats.peStats && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-destructive/30 via-destructive/20 to-destructive/10 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-60" />
              <Card className="relative overflow-hidden bg-gradient-to-br from-destructive/5 via-destructive/10 to-destructive/5 backdrop-blur-xl border-destructive/30 shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-destructive via-destructive/80 to-destructive/60" />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-destructive/30 rounded-xl blur-md" />
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-destructive to-destructive/80 flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-white shadow-lg"></div>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-lg text-foreground">Put Options</span>
                        <div className="text-xs text-foreground/60 font-medium">PE Positions</div>
                      </div>
                    </div>
                    <Badge className="bg-gradient-to-r from-destructive/20 to-destructive/10 text-foreground border-destructive/30 rounded-full px-4 py-2 text-sm font-bold">
                      {pePercentage}%
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-destructive/10 to-destructive/5 border border-destructive/20">
                      <span className="text-sm font-medium text-foreground/80">Total P&L</span>
                      <span className={`font-bold text-lg ${optionsData.stats.peStats.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {formatIndianCurrency(optionsData.stats.peStats.pnl)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
                      >
                        <div className="text-2xl font-bold text-destructive">{optionsData.stats.peStats.trades}</div>
                        <div className="text-xs text-foreground/60 font-medium">Trades</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
                      >
                        <div className="text-2xl font-bold text-destructive">{optionsData.stats.peStats.wins}</div>
                        <div className="text-xs text-foreground/60 font-medium">Wins</div>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="text-center p-3 rounded-xl bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20"
                      >
                        <div className="text-2xl font-bold text-destructive">
                          {Math.round((optionsData.stats.peStats.wins / optionsData.stats.peStats.trades) * 100)}%
                        </div>
                        <div className="text-xs text-foreground/60 font-medium">Rate</div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
           )}
        </motion.div>
      </div>

    </motion.div>
  );
};

export default OptionsAnalyticsChart;