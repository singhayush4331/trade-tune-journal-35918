
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Clock, Timer, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const mockDayData = [
  { name: 'Mon', pnl: -2.1 },
  { name: 'Tue', pnl: 1.2 },
  { name: 'Wed', pnl: 0 },
  { name: 'Thu', pnl: 1.5 },
  { name: 'Fri', pnl: 7.2 }
];

const mockTimeData = [
  { name: '9:15', pnl: 0.8 },
  { name: '10:00', pnl: 2.1 },
  { name: '11:00', pnl: -1.2 },
  { name: '12:00', pnl: -0.5 },
  { name: '13:00', pnl: 0.3 },
  { name: '14:00', pnl: 1.8 },
  { name: '15:00', pnl: 4.2 },
  { name: '15:30', pnl: 2.5 }
];

// Chart component to handle rendering properly
const TimeBarChart = ({ data, isMobile }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !data) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  // Mobile-specific chart rendering
  if (isMobile) {
    return (
      <div className="h-[300px] w-full">
        <BarChart width={300} height={300} data={data} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}L`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value !== undefined ? Number(payload[0].value) : 0;
                
                return (
                  <div className="rounded-lg border bg-background dark:bg-card/90 p-2 shadow-sm 
                                dark:border-primary/30 dark:shadow-primary/20">
                    <div className="text-xs text-muted-foreground">
                      {payload[0].payload.name}
                    </div>
                    <div className={cn(
                      "text-sm font-bold",
                      value >= 0 ? "text-success dark:text-green-400" : "text-destructive dark:text-red-400"
                    )}>
                      {value > 0 ? "+" : ""}{value}L
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="pnl"
            radius={[4, 4, 0, 0]}
            fill="hsl(var(--primary))"
            opacity={0.8}
          />
        </BarChart>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.2} />
          <XAxis 
            dataKey="name" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}L`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value !== undefined ? Number(payload[0].value) : 0;
                
                return (
                  <div className="rounded-lg border bg-background dark:bg-card/90 p-2 shadow-sm 
                              dark:border-primary/30 dark:shadow-primary/20">
                    <div className="text-xs text-muted-foreground">
                      {payload[0].payload.name}
                    </div>
                    <div className={cn(
                      "text-sm font-bold",
                      value >= 0 ? "text-success dark:text-green-400" : "text-destructive dark:text-red-400"
                    )}>
                      {value > 0 ? "+" : ""}{value}L
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="pnl"
            radius={[4, 4, 0, 0]}
            fill="hsl(var(--primary))"
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const TimeDistributionSection = () => {
  const [activeTab, setActiveTab] = useState('day');
  const [chartKey, setChartKey] = useState(0); // Force re-render key
  const isMobile = useIsMobile();
  const bestTradingTime = "15:00 - 16:00";
  const avgHoldingTime = "74 min";
  const bestDay = "Fri";

  // Re-render charts when tab changes
  useEffect(() => {
    setChartKey(prevKey => prevKey + 1);
  }, [activeTab, isMobile]);

  // Add handler to prevent default behavior
  const handleTabChange = (value: string, event: React.MouseEvent) => {
    // Prevent default browser behavior
    event.preventDefault();
    setActiveTab(value);
  };

  return (
    <section className="py-24 px-4 bg-background/90 backdrop-blur-sm relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  <Timer className="mr-2 h-4 w-4" />
                  Time Intelligence
                </motion.span>
                <h2 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Optimize Your <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">Trading</span> Windows
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discover your most profitable moments and enhance your timing strategy with our advanced time-based analytics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card/95 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-70"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Best Day</p>
                      <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {bestDay}
                      </h3>
                      <p className="text-xs text-muted-foreground">Highest P&L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card/95 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-70"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Peak Time</p>
                      <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {bestTradingTime}
                      </h3>
                      <p className="text-xs text-muted-foreground">Most profitable</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card/95 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-70"></div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Timer className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                      <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {avgHoldingTime}
                      </h3>
                      <p className="text-xs text-muted-foreground">Per trade</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Add navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/features/time">
                  Explore Time Analysis
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary/30 hover:border-primary hover:bg-primary/5 group">
                <Link to="/signup" className="flex items-center gap-2">
                  Start Optimizing
                  <Clock className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:pl-8"
          >
            <Card className="border-primary/20 bg-card/90 hover:border-primary/40 transition-all duration-300 ease-in-out hover:shadow-lg dark:hover:shadow-primary/20">
              <CardContent className="pt-6">
                <Tabs defaultValue="day" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2 mb-4 bg-muted/30 dark:bg-muted/20">
                    <TabsTrigger 
                      value="day" 
                      className="data-[state=active]:bg-primary/30 dark:data-[state=active]:bg-primary/40 flex items-center"
                      onClick={(e) => handleTabChange("day", e)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-foreground">
                        Day of <span className="font-bold">Week</span>
                      </span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="time" 
                      className="data-[state=active]:bg-primary/30 dark:data-[state=active]:bg-primary/40 flex items-center"
                      onClick={(e) => handleTabChange("time", e)}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-foreground">
                        Time of <span className="font-bold">Day</span>
                      </span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <motion.div
                    key={activeTab + '-' + chartKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="overflow-x-hidden"
                  >
                    <TabsContent value="day" className="h-auto mt-2">
                      <TimeBarChart data={mockDayData} isMobile={isMobile} />
                    </TabsContent>
                    
                    <TabsContent value="time" className="h-auto mt-2">
                      <TimeBarChart data={mockTimeData} isMobile={isMobile} />
                    </TabsContent>
                  </motion.div>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TimeDistributionSection;
