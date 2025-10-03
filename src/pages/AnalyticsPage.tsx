import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import WinRateChart from '@/components/dashboard/WinRateChart';
import AnalyticsCharts from '@/components/analytics/AnalyticsCharts';
import { motion } from 'framer-motion';
import { IndianRupee, LineChart, PieChart, TrendingUp, ChartBarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DateRangeSelector, { DateRangeOption } from '@/components/dashboard/DateRangeSelector';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TradeCalendarView from '@/components/dashboard/TradeCalendarView';
import { ChartBarIcon as ChartBar } from 'lucide-react';
import { mockTrades } from '@/data/mockTradeData';
import { formatIndianCurrency } from '@/lib/utils';
import { storeDashboardPnL, invalidateAIChatCache } from '@/services/ai-chat-service';

// Fixed PnL value that should be used everywhere
const FIXED_PNL_VALUE = 246000; // ₹2.46L or ₹24.6L in Indian format

const AnalyticsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [rangeOption, setRangeOption] = useState<DateRangeOption>('month');
  const [activeTab, setActiveTab] = useState('overview');

  const handleDateRangeChange = (range: DateRange | undefined, option: DateRangeOption) => {
    setDateRange(range);
    setRangeOption(option);
  };

  const filteredTrades = useMemo(() => {
    if (!dateRange || !dateRange.from) {
      return mockTrades;
    }
    
    const rangeStart = startOfDay(dateRange.from);
    const rangeEnd = dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date());
    
    return mockTrades.filter(trade => {
      const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
      return isWithinInterval(tradeDate, { start: rangeStart, end: rangeEnd });
    });
  }, [dateRange]);

  const stats = useMemo(() => {
    // Always use FIXED_PNL_VALUE instead of calculated value
    const totalPL = FIXED_PNL_VALUE;
    const winningTrades = filteredTrades.filter(trade => trade.pnl > 0);
    const successRate = filteredTrades.length > 0 
      ? (winningTrades.length / filteredTrades.length * 100).toFixed(0) 
      : "0";
    
    const avgHoldingTime = filteredTrades.length > 0 ? "1.2 hours" : "0 mins";
    
    const riskReward = "1:1.7";
    
    return {
      totalPL,
      increase: "24.5%",
      riskReward,
      totalTrades: filteredTrades.length.toString(),
      successRate: `${successRate}%`,
      avgHoldingTime
    };
  }, [filteredTrades]);
  
  // Store the total PnL value for the AI to use whenever it changes
  useEffect(() => {
    // Force store the fixed PnL value on every page load
    console.log(`Storing fixed PnL for AI: ${formatIndianCurrency(FIXED_PNL_VALUE)}`);
    
    storeDashboardPnL(FIXED_PNL_VALUE);
    
    // Force invalidate the cache to ensure AI gets the latest value
    invalidateAIChatCache();
    
    // Dispatch event to notify other components
    const event = new CustomEvent('dashboardDataUpdated', {
      detail: { totalPnL: FIXED_PNL_VALUE }
    });
    window.dispatchEvent(event);
  }, []); // Empty dependency array to run only on mount

  return (
    <AppLayout>
      <div className="space-y-6 mt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              {dateRange?.from && dateRange?.to ? (
                <>
                  Showing data from <span className="font-medium">{format(dateRange.from, 'dd MMM yyyy')}</span> to <span className="font-medium">{format(dateRange.to, 'dd MMM yyyy')}</span>
                </>
              ) : (
                'Showing all time data'
              )}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DateRangeSelector onRangeChange={handleDateRangeChange} />
          </motion.div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview" className="text-sm">
              <LineChart className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="detailed" className="text-sm">
              <ChartBar className="h-4 w-4 mr-2" /> Detailed Analysis
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-sm">
              <PieChart className="h-4 w-4 mr-2" /> Calendar View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              <PerformanceChart dateRange={dateRange} />
              <WinRateChart dateRange={dateRange} />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <IndianRupee className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-md font-medium">Total P/L</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <IndianRupee className="h-5 w-5" />
                      <span>{formatIndianCurrency(stats.totalPL).replace('₹', '')}</span>
                    </div>
                    <div className="flex items-center mt-1 text-success text-sm">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>{stats.increase} increase</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <LineChart className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-md font-medium">Risk/Reward</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{stats.riskReward}</div>
                    <p className="text-xs text-muted-foreground mt-1">Average risk-reward ratio</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <PieChart className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-md font-medium">Total Trades</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{stats.totalTrades}</div>
                    <p className="text-xs text-muted-foreground mt-1">In selected period</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-md font-medium">Success Rate</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{stats.successRate}</div>
                    <p className="text-xs text-muted-foreground mt-1">Win percentage</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <LineChart className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-md font-medium">Avg. Hold Time</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{stats.avgHoldingTime}</div>
                    <p className="text-xs text-muted-foreground mt-1">Average holding period</p>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-primary/10 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                        <IndianRupee className="h-4 w-4 text-primary" />
                      </div>
                      <CardTitle className="text-md font-medium">Avg. Profit</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold">{formatIndianCurrency(2419)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Per winning trade</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="detailed">
            <AnalyticsCharts />
          </TabsContent>
          
          <TabsContent value="calendar">
            <TradeCalendarView />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalyticsPage;
