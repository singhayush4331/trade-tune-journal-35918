
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatIndianCurrency } from '@/lib/utils';
import { ChartPie, LineChart as LineChartIcon, BarChart3, TrendingUp, BadgePercent } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const winLossData = [
  { name: 'Wins', value: 65 },
  { name: 'Losses', value: 35 },
];

const strategyData = [
  { name: 'Breakout', wins: 12, losses: 5, total: 17 },
  { name: 'Reversal', wins: 9, losses: 6, total: 15 },
  { name: 'Trend Following', wins: 18, losses: 4, total: 22 },
  { name: 'Swing', wins: 6, losses: 3, total: 9 },
  { name: 'Scalping', wins: 20, losses: 17, total: 37 },
];

const monthlyPnLData = [
  { name: 'Jan', pnl: 350 },
  { name: 'Feb', pnl: -120 },
  { name: 'Mar', pnl: 580 },
  { name: 'Apr', pnl: 820 },
  { name: 'May', pnl: -250 },
  { name: 'Jun', pnl: 1200 },
];

const stockPnLData = [
  { name: 'AAPL', pnl: 580 },
  { name: 'MSFT', pnl: -210 },
  { name: 'AMZN', pnl: 320 },
  { name: 'GOOGL', pnl: 450 },
  { name: 'TSLA', pnl: -180 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AnalyticsCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState('6m');
  const [isClient, setIsClient] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle SSR/hydration issues by only rendering charts on client-side
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const formatValue = (value: any) => {
    if (typeof value === 'number') {
      return formatIndianCurrency(value);
    }
    return value;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
  
  // Handle SSR/hydration by only rendering charts on client-side
  if (!isClient) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="w-[150px] h-10 bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[300px] bg-muted animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  // Chart height handling for responsive design
  const chartHeight = isMobile ? 250 : 300;
  
  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-end">
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] bg-card border-2 border-muted shadow-md hover:border-primary/30 transition-all duration-200">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last Month</SelectItem>
            <SelectItem value="3m">Last 3 Months</SelectItem>
            <SelectItem value="6m">Last 6 Months</SelectItem>
            <SelectItem value="1y">Last Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card/90 to-card/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10 border-b border-primary/10 pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-sm sm:text-md font-medium flex items-center gap-2">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                    <ChartPie className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Win/Loss Ratio
                  </span>
                </CardTitle>
                <div className="bg-card/60 border border-border/50 rounded-full px-2 py-0.5 text-xs flex items-center">
                  <BadgePercent className="w-3.5 h-3.5 mr-1" />
                  {winLossData[0].value}:{winLossData[1].value}
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10 p-4">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
                  <defs>
                    <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0.7} />
                    </linearGradient>
                    <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={1} />
                      <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={winLossData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={isMobile ? 75 : 100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      isMobile && percent < 0.15 ? null : 
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    animationBegin={isMobile ? 0 : 300}
                    animationDuration={isMobile ? 800 : 1500}
                    isAnimationActive={!isMobile}
                  >
                    {winLossData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? 'url(#winGradient)' : 'url(#lossGradient)'} 
                        stroke="hsl(var(--background))"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: string | number) => [`${value}%`, 'Percentage']} 
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--card))',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: isMobile ? '4px 8px' : '8px 12px',
                      fontSize: isMobile ? '10px' : '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card/90 to-card/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10 border-b border-primary/10 pb-3">
              <CardTitle className="text-sm sm:text-md font-medium flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                  <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Strategy Performance
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 p-4">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={isMobile ? strategyData.slice(0, 4) : strategyData}>
                  <defs>
                    <linearGradient id="winsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="lossesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickLine={!isMobile}
                    axisLine={!isMobile}
                  />
                  <YAxis 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickLine={!isMobile}
                    axisLine={!isMobile}
                  />
                  <Tooltip 
                    formatter={(value: string | number, name: string) => [value, name === 'wins' ? 'Winning Trades' : 'Losing Trades']} 
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--card))',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: isMobile ? '4px 8px' : '8px 12px',
                      fontSize: isMobile ? '10px' : '12px'
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ 
                      fontSize: isMobile ? '10px' : '12px',
                      paddingTop: isMobile ? '5px' : '10px'
                    }} 
                  />
                  <Bar 
                    dataKey="wins" 
                    stackId="a" 
                    fill="url(#winsGradient)" 
                    name="Winning Trades"
                    stroke="hsl(var(--success))"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                    animationDuration={isMobile ? 800 : 1500}
                    animationBegin={isMobile ? 0 : 300}
                    isAnimationActive={!isMobile}
                  />
                  <Bar 
                    dataKey="losses" 
                    stackId="a" 
                    fill="url(#lossesGradient)" 
                    name="Losing Trades"
                    stroke="hsl(var(--destructive))"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                    animationDuration={isMobile ? 800 : 1500}
                    animationBegin={isMobile ? 100 : 500}
                    isAnimationActive={!isMobile}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card/90 to-card/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10 border-b border-primary/10 pb-3">
              <CardTitle className="text-sm sm:text-md font-medium flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                  <LineChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Monthly P&L
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 p-4">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <LineChart data={isMobile ? monthlyPnLData.slice(-4) : monthlyPnLData}>
                  <defs>
                    <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickLine={!isMobile}
                    axisLine={!isMobile}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (typeof value === 'number') {
                        return isMobile 
                          ? formatIndianCurrency(value).replace('₹', '').substring(0, 4)
                          : formatIndianCurrency(value).replace('₹', '');
                      }
                      return value;
                    }} 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickLine={!isMobile}
                    axisLine={!isMobile}
                  />
                  <Tooltip 
                    formatter={(value: string | number) => {
                      if (typeof value === 'number') {
                        return [formatIndianCurrency(value), 'P&L'];
                      }
                      return [value, 'P&L'];
                    }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--card))',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: isMobile ? '4px 8px' : '8px 12px',
                      fontSize: isMobile ? '10px' : '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pnl"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ stroke: 'hsl(var(--primary))', fill: 'white', strokeWidth: 2, r: isMobile ? 3 : 4 }}
                    activeDot={{ r: isMobile ? 5 : 6, strokeWidth: 2 }}
                    animationDuration={isMobile ? 800 : 1500}
                    animationBegin={isMobile ? 0 : 300}
                    isAnimationActive={!isMobile}
                    fill="url(#pnlGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card/90 to-card/80 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-purple/5 rounded-full blur-3xl"></div>
            
            <CardHeader className="relative z-10 border-b border-primary/10 pb-3">
              <CardTitle className="text-sm sm:text-md font-medium flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Stock P&L
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 p-4">
              <ResponsiveContainer width="100%" height={chartHeight}>
                <BarChart data={isMobile ? stockPnLData.slice(0, 4) : stockPnLData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickLine={!isMobile}
                    axisLine={!isMobile}
                  />
                  <YAxis 
                    tickFormatter={(value) => {
                      if (typeof value === 'number') {
                        return isMobile 
                          ? formatIndianCurrency(value).replace('₹', '').substring(0, 4)
                          : formatIndianCurrency(value).replace('₹', '');
                      }
                      return value;
                    }}
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    tickLine={!isMobile}
                    axisLine={!isMobile}
                  />
                  <Tooltip 
                    formatter={(value: string | number) => {
                      if (typeof value === 'number') {
                        return [formatIndianCurrency(value), 'P&L'];
                      }
                      return [value, 'P&L'];
                    }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--card))',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      padding: isMobile ? '4px 8px' : '8px 12px',
                      fontSize: isMobile ? '10px' : '12px'
                    }}
                  />
                  <Bar 
                    dataKey="pnl"
                    animationDuration={isMobile ? 800 : 1500}
                    animationBegin={isMobile ? 0 : 300}
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={!isMobile}
                  >
                    {stockPnLData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={entry.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                        fillOpacity={0.8}
                        stroke={entry.pnl >= 0 ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                        strokeWidth={1}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsCharts;
