
import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatIndianCurrency } from '@/lib/utils';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { debounce } from '@/utils/performance-monitoring';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    value: number;
  }>;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Memoize formatting functions to prevent unnecessary recalculations
  const formatYAxisTick = useMemo(() => (value: number) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  }, []);

  // Memoize tooltip formatter to improve performance
  const tooltipFormatter = useMemo(() => 
    (value: number) => formatIndianCurrency(value),
  []);

  if (!mounted || !data?.length) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  // Mobile-specific chart rendering with fixed dimensions
  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <AreaChart 
          data={data} 
          width={isXSmall ? 260 : 280} 
          height={isXSmall ? 120 : 150}
          margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false} 
            axisLine={false} 
            height={20}
            interval="preserveStartEnd" 
          />
          <YAxis 
            tickFormatter={formatYAxisTick} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 8 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false} 
            axisLine={false} 
            width={30} 
            tickCount={4}
          />
          <Tooltip 
            formatter={tooltipFormatter} 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '0.65rem',
              padding: '0.25rem'
            }} 
            labelStyle={{ fontSize: '0.65rem' }} 
            itemStyle={{ fontSize: '0.65rem' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(var(--primary))" 
            strokeWidth={1.5} 
            fill="url(#colorValue)" 
            isAnimationActive={true} 
          />
        </AreaChart>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data} 
          margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false} 
            axisLine={false} 
            height={24}
            interval="preserveStartEnd" 
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tickFormatter={formatYAxisTick} 
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false} 
            axisLine={false} 
            width={35} 
            tickCount={4}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={tooltipFormatter} 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              padding: '0.5rem'
            }} 
            labelStyle={{ fontSize: '0.75rem' }} 
            itemStyle={{ fontSize: '0.75rem' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="hsl(var(--primary))" 
            strokeWidth={1.5} 
            fill="url(#colorValue)" 
            isAnimationActive={true} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
