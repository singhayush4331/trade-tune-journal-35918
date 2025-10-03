
import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowUpRight, ChevronUpIcon, IndianRupee, LineChart } from 'lucide-react';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { DateRange } from 'react-day-picker';
import { format, isWithinInterval, eachDayOfInterval, eachMonthOfInterval, isSameDay, startOfDay } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchUserTrades } from '@/services/trades-service';
import { Trade } from '@/utils/trade-form-types';
import { Skeleton } from '@/components/ui/skeleton';

interface PerformanceChartProps {
  dateRange?: DateRange | undefined;
}

// Mobile-specific chart component with fixed dimensions
const MobileAreaChart: React.FC<{
  data: any[];
  dataKey: string;
  valueFormatter?: (value: any) => string;
  height?: number;
}> = ({
  data,
  dataKey,
  valueFormatter = (value) => String(value),
  height = 200
}) => {
  console.log('Rendering MobileAreaChart with data:', data?.length);
  
  if (!data?.length) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <AreaChart
        width={300}
        height={height}
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: -15,
          bottom: 5
        }}
      >
        <defs>
          <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <filter id="mobileGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
        
        <XAxis 
          dataKey="date" 
          tickLine={false} 
          axisLine={false} 
          tick={(props) => {
            const { x, y, payload } = props;
            return (
              <g transform={`translate(${x},${y})`}>
                <text 
                  x={0} 
                  y={0}
                  dy={10}
                  textAnchor="end"
                  fill="hsl(var(--muted-foreground))"
                  fontSize={10}
                  transform="rotate(-20)"
                >
                  {payload.value}
                </text>
              </g>
            );
          }}
          height={35}
          interval="preserveStartEnd"
        />
        
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          tickFormatter={value => valueFormatter(value).replace('₹', '')} 
          tick={{
            fill: 'hsl(var(--muted-foreground))',
            fontSize: 10
          }}
          width={30}
        />
        
        <Tooltip 
          formatter={(value) => [valueFormatter(Number(value)), 'Profit']}
          labelFormatter={(label) => `${label}`}
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backgroundColor: 'hsl(var(--card))',
            padding: '4px 8px',
            fontSize: '10px'
          }}
        />
        
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke="hsl(var(--primary))" 
          strokeWidth={2} 
          fill="url(#mobileGradient)" 
          activeDot={{
            r: 4,
            strokeWidth: 2,
            stroke: 'hsl(var(--background))',
            fill: 'hsl(var(--primary))',
          }}
        />
      </AreaChart>
    </div>
  );
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  dateRange
}) => {
  const isMobile = useIsMobile();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0); // Force re-render key

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
        setTrades(data);
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
      console.log("PerformanceChart component detected trade update");
      loadTrades();
    };
    
    // Force a re-render after orientation changes
    const handleOrientationChange = () => {
      console.log('Orientation changed, forcing performance chart re-render');
      setTimeout(() => setKey(prevKey => prevKey + 1), 200);
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('dashboardDataUpdated', handleTradeUpdate);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('dashboardDataUpdated', handleTradeUpdate);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const filteredTrades = useMemo(() => {
    if (!dateRange || !dateRange.from) {
      return trades;
    }
    const to = dateRange.to || new Date();
    return trades.filter(trade => isWithinInterval(new Date(trade.date), {
      start: dateRange.from,
      end: to
    }));
  }, [dateRange, trades]);

  const isYearDateRange = useMemo(() => {
    if (!dateRange?.from) return false;
    
    const isStartOfYear = dateRange.from.getMonth() === 0 && dateRange.from.getDate() === 1;
    const isCurrentYearSelected = dateRange.from.getFullYear() === new Date().getFullYear();
    
    return isStartOfYear && isCurrentYearSelected;
  }, [dateRange]);

  const isShortDateRange = useMemo(() => {
    if (!dateRange || !dateRange.from || !dateRange.to) return false;
    const dayDiff = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    return dayDiff <= 14;
  }, [dateRange]);

  const data = useMemo(() => {
    if (isLoading || trades.length === 0) {
      return [];
    }
    if (!dateRange || !dateRange.from) {
      return generateAllMonthsData(trades);
    }
    const to = dateRange.to || new Date();
    const dayDiff = Math.round((to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff <= 1) {
      return [{
        date: format(dateRange.from, 'dd MMM'),
        profit: sumProfits(filteredTrades)
      }];
    } else if (dayDiff <= 7) {
      return generateDailyData(filteredTrades, dateRange, isMobile);
    } else if (dayDiff <= 90) {
      return generateWeeklyData(filteredTrades, dateRange, isMobile);
    } else {
      return generateAllMonthsData(filteredTrades);
    }
  }, [dateRange, filteredTrades, trades, isLoading, isMobile]);

  const totalProfit = useMemo(() => {
    return filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  }, [filteredTrades]);

  const percentageChange = useMemo(() => {
    if (filteredTrades.length === 0) return 0;
    const wins = filteredTrades.filter(trade => trade.pnl > 0).length;
    const winRate = wins / filteredTrades.length * 100;
    return Math.round(winRate / 4 * 10) / 10;
  }, [filteredTrades]);

  const mobileData = useMemo(() => {
    if (!isMobile || !data.length) return data;
    
    if (!dateRange || !dateRange.from || isYearDateRange) {
      return data;
    }
    
    if (data.length <= 7) return data;
    return data.slice(-7);
  }, [data, isMobile, dateRange, isYearDateRange]);

  const skipInterval = useMemo(() => {
    if (!isMobile) return 0;
    
    if (!dateRange || !dateRange.from || isYearDateRange) {
      return Math.max(0, Math.floor(data.length / 12) - 1);
    }
    
    if (isShortDateRange) {
      return 1;
    }
    
    if (data.length <= 5) return 0;
    if (data.length <= 10) return 1;
    return Math.floor(data.length / 5);
  }, [data.length, isMobile, dateRange, isYearDateRange, isShortDateRange]);

  if (isLoading) {
    return <Card className="h-full col-span-1 md:col-span-2 overflow-hidden border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all flex flex-col">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex flex-row items-center justify-between py-3 sm:pb-6 relative">
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <LineChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
            <CardTitle className="text-sm sm:text-md font-medium">Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-2 sm:pt-4 pb-3 sm:pb-5 flex-1">
          <Skeleton className="h-full w-full rounded-lg" />
        </CardContent>
      </Card>;
  }

  return <Card className="h-full col-span-1 md:col-span-2 overflow-hidden border-2 border-primary/10 shadow-lg hover:shadow-xl transition-all flex flex-col" key={`performance-chart-${key}`}>
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent flex flex-row items-center justify-between py-3 sm:pb-6 relative my-0">
        <div className="absolute inset-0 opacity-50 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <LineChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <CardTitle className="text-sm sm:text-md font-medium">Performance</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-2 sm:pt-4 pb-3 sm:pb-5 flex-1 flex flex-col">
        <div className="mb-3 sm:mb-4 flex justify-between items-center">
          <div>
            <div className="text-lg sm:text-2xl font-bold flex items-center">
              <IndianRupee className="h-4 w-4 sm:h-5 sm:w-5 mr-1 text-primary" />
              <span>{formatIndianCurrency(totalProfit).replace('₹', '')}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total profit</p>
          </div>
          <div className="flex flex-col items-end">
            <div className={`${percentageChange >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'} flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm font-medium`}>
              {percentageChange >= 0 ? <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4" /> : <ChevronUpIcon className="h-3 w-3 sm:h-4 sm:w-4 rotate-180" />}
              <span>{percentageChange >= 0 ? '+' : ''}{percentageChange}%</span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">Trading performance</p>
          </div>
        </div>
        
        <div className="flex-1">
          {data.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center">
              <p className="text-muted-foreground text-sm">No data available</p>
            </div>
          ) : (
            <div className="w-full h-full">
              {isMobile ? (
                <MobileAreaChart 
                  data={mobileData} 
                  dataKey="profit" 
                  valueFormatter={formatIndianCurrency} 
                />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 5
                  }}>
                    <defs>
                      <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
                    
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 12
                    }} dy={10} interval={skipInterval} />
                    
                    <YAxis tickLine={false} axisLine={false} tickFormatter={value => formatIndianCurrency(value).replace('₹', '')} tick={{
                      fill: 'hsl(var(--muted-foreground))',
                      fontSize: 12
                    }} width={50} />
                    
                    <Tooltip 
                      formatter={value => [formatIndianCurrency(Number(value)), 'Profit']}
                      labelFormatter={label => `${label}`} 
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        backgroundColor: 'hsl(var(--card))',
                        padding: '8px 12px',
                        fontSize: '14px'
                      }}
                      wrapperStyle={{ zIndex: 1000 }}
                    />
                    
                    <Area 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      fill="url(#profitGradient)" 
                      activeDot={{
                        r: 6,
                        strokeWidth: 2,
                        stroke: 'hsl(var(--background))',
                        fill: 'hsl(var(--primary))',
                        filter: 'url(#glow)',
                        className: "drop-shadow-md"
                      }}
                      isAnimationActive={data.length < 100} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          )}
        </div>

        <div className="mt-3 sm:mt-6 border-t border-border/40 pt-2 sm:pt-4 flex justify-between items-center">
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm bg-primary"></div>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Realized P/L</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};

function generateAllMonthsData(trades: Trade[]) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  return months.map(month => {
    const monthIndex = months.indexOf(month);
    const monthTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return tradeDate.getMonth() === monthIndex;
    });
    
    return {
      date: month,
      profit: sumProfits(monthTrades)
    };
  });
}

function generateDailyData(trades: Trade[], dateRange: DateRange, isMobile = false) {
  if (!dateRange.from) return [];
  const to = dateRange.to || new Date();
  const days = eachDayOfInterval({
    start: dateRange.from,
    end: to
  });
  
  return days.map(day => {
    const dayTrades = trades.filter(trade => isSameDay(new Date(trade.date), day));
    return {
      date: isMobile ? format(day, 'd/M') : format(day, 'dd MMM'),
      profit: sumProfits(dayTrades),
      fullDate: format(day, 'dd MMM yyyy')
    };
  });
}

function generateWeeklyData(trades: Trade[], dateRange: DateRange, isMobile = false) {
  if (!dateRange.from) return [];
  const to = dateRange.to || new Date();
  const days = eachDayOfInterval({
    start: dateRange.from,
    end: to
  });
  const weeklyData = [];

  for (let i = 0; i < days.length; i += 7) {
    const weekStart = days[i];
    const weekEnd = i + 6 < days.length ? days[i + 6] : days[days.length - 1];
    const weekTrades = trades.filter(trade => {
      const tradeDate = new Date(trade.date);
      return isWithinInterval(tradeDate, {
        start: startOfDay(weekStart),
        end: weekEnd
      });
    });
    
    let dateLabel;
    if (isMobile) {
      dateLabel = `${format(weekStart, 'd/M')}${weekStart.getMonth() !== weekEnd.getMonth() ? '-' + format(weekEnd, 'd/M') : ''}`;
    } else {
      dateLabel = `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')}`;
    }
    
    weeklyData.push({
      date: dateLabel,
      profit: sumProfits(weekTrades),
      fullDate: `${format(weekStart, 'dd MMM')} - ${format(weekEnd, 'dd MMM')}`
    });
  }
  return weeklyData;
}

function sumProfits(trades: Trade[]) {
  return trades.reduce((sum, trade) => sum + trade.pnl, 0);
}

export default PerformanceChart;
