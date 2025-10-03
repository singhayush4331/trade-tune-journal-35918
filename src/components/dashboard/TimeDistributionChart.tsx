import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Clock, Calendar, ArrowUpCircle, ChevronUp } from 'lucide-react';
import { formatIndianCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
interface WeekdayData {
  name: string;
  value: number;
}
interface HourlyData {
  name: string;
  pnl: number;
  avgPnl: number;
  count: number;
}
interface TimeDistributionChartProps {
  weekdayData: WeekdayData[];
  hourlyData: HourlyData[];
}

// Simple mobile fallback component that doesn't use ResponsiveContainer
const MobileBarChart: React.FC<{
  data: any[];
  dataKey: string;
  valueFormatter?: (value: any) => string;
  colors?: {
    positive: string;
    negative: string;
  };
  height?: number;
}> = ({
  data,
  dataKey,
  valueFormatter,
  colors = {
    positive: 'hsl(var(--primary))',
    negative: 'hsl(var(--destructive))'
  },
  height = 250
}) => {
  console.log('Rendering MobileBarChart with data:', data?.length);
  if (!data?.length) {
    return <div className="h-[250px] flex items-center justify-center text-muted-foreground">
        No data available
      </div>;
  }
  return <div className="w-full h-full">
      <BarChart width={300} height={height} data={data} margin={{
      top: 20,
      right: 10,
      left: 0,
      bottom: 20
    }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
        fontSize: 10
      }} interval={1} />
        <YAxis tickFormatter={value => valueFormatter ? valueFormatter(value) : String(value)} axisLine={false} tickLine={false} tick={{
        fontSize: 10
      }} width={30} />
        <Tooltip cursor={{
        fill: 'rgba(0, 0, 0, 0.1)'
      }} />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} barSize={24}>
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry[dataKey] >= 0 ? colors.positive : colors.negative} stroke={entry[dataKey] >= 0 ? colors.positive : colors.negative} strokeWidth={1} />)}
        </Bar>
      </BarChart>
    </div>;
};
const TimeDistributionChart: React.FC<TimeDistributionChartProps> = ({
  weekdayData,
  hourlyData
}) => {
  const [activeTab, setActiveTab] = useState('weekday');
  const [isReady, setIsReady] = useState(false);
  const isMobile = useIsMobile();
  const [key, setKey] = useState(0); // Force re-render key

  // Add detection for initial render and set isReady
  useEffect(() => {
    // Short delay to ensure component is fully mounted
    const timer = setTimeout(() => {
      console.log('TimeDistributionChart ready, mobile:', isMobile);
      setIsReady(true);
    }, 300);

    // Force a re-render after orientation changes
    const handleOrientationChange = () => {
      console.log('Orientation changed, forcing chart re-render');
      setTimeout(() => setKey(prevKey => prevKey + 1), 200);
    };
    window.addEventListener('orientationchange', handleOrientationChange);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile]);
  const handleTabChange = (value: string, event: React.MouseEvent) => {
    event.preventDefault();
    setActiveTab(value);
  };
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-background/95 backdrop-blur-sm p-3 border border-border rounded-lg shadow-lg text-xs">
          <p className="font-semibold text-foreground">{label}</p>
          {activeTab === 'weekday' ? <div className="mt-2 space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary/80"></span>
                <span>Avg P&L: {formatIndianCurrency(payload[0].value)}</span>
              </p>
            </div> : <div className="mt-2 space-y-1">
              <p className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary/80"></span>
                <span>Avg P&L: {formatIndianCurrency(payload[0].payload.avgPnl)}</span>
              </p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary/40"></span>
                <span>Total: {formatIndianCurrency(payload[0].payload.pnl)}</span>
              </p>
              <p className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary/20"></span>
                <span>Trades: {payload[0].payload.count}</span>
              </p>
            </div>}
        </div>;
    }
    return null;
  };

  // Helper function to format currency values for YAxis
  const formatCurrency = (value: number) => {
    return formatIndianCurrency(value).replace('₹', '');
  };

  // Debug display for development
  const renderDebugInfo = () => {
    if (process.env.NODE_ENV !== 'development') return null;
    return;
  };
  return <motion.div initial={{
    opacity: 0,
    y: 10
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.5
  }} className="relative z-10">
      <Card className="overflow-hidden rounded-xl border-2 border-primary/20 bg-gradient-to-br from-card/90 via-card/95 to-card/90 shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple/5 to-transparent opacity-70 z-0"></div>
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple/5 rounded-full blur-3xl"></div>
        
        <CardHeader className="pb-2 relative z-10">
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 p-1.5 border border-primary/20">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Time Distribution Analysis
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 relative z-10" key={`chart-container-${key}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 rounded-lg p-1 border border-muted">
              <TabsTrigger value="weekday" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow text-xs sm:text-sm transition-all duration-200" onClick={e => handleTabChange("weekday", e)}>
                <Calendar className="h-4 w-4 mr-2 opacity-70" /> Day of Week
              </TabsTrigger>
              <TabsTrigger value="hourly" className="rounded-md data-[state=active]:bg-background data-[state=active]:shadow text-xs sm:text-sm transition-all duration-200" onClick={e => handleTabChange("hourly", e)}>
                <Clock className="h-4 w-4 mr-2 opacity-70" /> Time of Day
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weekday" className="mt-0">
              {weekdayData.length > 0 ? <div className="h-[250px] sm:h-[280px] w-full relative">
                  {/* Mobile specific chart */}
                  {isMobile ? <MobileBarChart data={weekdayData} dataKey="value" valueFormatter={formatCurrency} colors={{
                positive: 'hsl(var(--primary))',
                negative: 'hsl(var(--destructive))'
              }} /> : <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={weekdayData} margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5
                }}>
                        <defs>
                          <linearGradient id="weekdayGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary)/0.8)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary)/0.3)" stopOpacity={0.3} />
                          </linearGradient>
                          <linearGradient id="weekdayNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive)/0.8)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--destructive)/0.3)" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                    fontSize: 12
                  }} interval={0} />
                        <YAxis tickFormatter={value => formatIndianCurrency(value).replace('₹', '')} axisLine={false} tickLine={false} tick={{
                    fontSize: 12
                  }} width={50} />
                        <Tooltip content={<CustomTooltip />} cursor={{
                    fill: 'rgba(0, 0, 0, 0.1)'
                  }} wrapperStyle={{
                    zIndex: 1000
                  }} />
                        <Bar dataKey="value" name="Avg P&L" radius={[6, 6, 0, 0]} barSize={36} animationDuration={1500} animationBegin={300}>
                          {weekdayData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.value >= 0 ? 'url(#weekdayGradient)' : 'url(#weekdayNegativeGradient)'} stroke={entry.value >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} strokeWidth={1} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>}
                </div> : <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                  <Calendar className="h-12 w-12 mb-2 opacity-20" />
                  <p>No day-of-week data available</p>
                  <p className="text-xs mt-1">Add more trades to see patterns</p>
                </div>}
            </TabsContent>
            
            <TabsContent value="hourly" className="mt-0">
              {hourlyData.length > 0 ? <div className="h-[250px] sm:h-[280px] w-full relative">
                  {/* Mobile specific chart */}
                  {isMobile ? <MobileBarChart data={hourlyData} dataKey="avgPnl" valueFormatter={formatCurrency} colors={{
                positive: 'hsl(var(--primary))',
                negative: 'hsl(var(--destructive))'
              }} /> : <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData} margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 5
                }}>
                        <defs>
                          <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary)/0.8)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary)/0.3)" stopOpacity={0.3} />
                          </linearGradient>
                          <linearGradient id="hourlyNegativeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive)/0.8)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--destructive)/0.3)" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.5} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{
                    fontSize: 12
                  }} interval={0} />
                        <YAxis tickFormatter={value => formatIndianCurrency(value).replace('₹', '')} axisLine={false} tickLine={false} tick={{
                    fontSize: 12
                  }} width={50} />
                        <Tooltip content={<CustomTooltip />} cursor={{
                    fill: 'rgba(0, 0, 0, 0.1)'
                  }} wrapperStyle={{
                    zIndex: 1000
                  }} />
                        <Bar dataKey="avgPnl" name="Avg P&L" radius={[6, 6, 0, 0]} barSize={24} animationDuration={1500} animationBegin={300}>
                          {hourlyData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.avgPnl >= 0 ? 'url(#hourlyGradient)' : 'url(#hourlyNegativeGradient)'} stroke={entry.avgPnl >= 0 ? 'hsl(var(--primary))' : 'hsl(var(--destructive))'} strokeWidth={1} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>}
                </div> : <div className="flex flex-col items-center justify-center h-[250px] text-muted-foreground">
                  <Clock className="h-12 w-12 mb-2 opacity-20" />
                  <p>No time-of-day data available</p>
                  <p className="text-xs mt-1">Add more trades with timestamps</p>
                </div>}
            </TabsContent>
          </Tabs>

          {hourlyData.length > 0 && activeTab === 'hourly' && <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.3,
          duration: 0.3
        }} className="mt-4 flex justify-end">
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs flex items-center border border-primary/20 shadow-sm">
                <ArrowUpCircle className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  Best trading hour: {hourlyData.reduce((best, current) => current.avgPnl > best.avgPnl ? current : best, hourlyData[0]).name}
                </span>
              </div>
            </motion.div>}
          
          {weekdayData.length > 0 && activeTab === 'weekday' && <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.3,
          duration: 0.3
        }} className="mt-4 flex justify-end">
              <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs flex items-center border border-primary/20 shadow-sm">
                <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                <span>
                  Best trading day: {weekdayData.reduce((best, current) => current.value > best.value ? current : best, weekdayData[0]).name}
                </span>
              </div>
            </motion.div>}
          
          {renderDebugInfo()}
        </CardContent>
      </Card>
    </motion.div>;
};
export default TimeDistributionChart;