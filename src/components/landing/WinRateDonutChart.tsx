
import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface WinRateDonutChartProps {
  data?: {
    winRate: number;
    lossRate: number;
    breakEvenRate?: number;
  };
  size?: 'small' | 'medium' | 'large';
}

const WinRateDonutChart: React.FC<WinRateDonutChartProps> = ({ 
  data = { winRate: 0, lossRate: 0, breakEvenRate: 0 },
  size = 'medium' 
}) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  // Log actual data being used
  useEffect(() => {
    console.log("WinRateDonutChart received data:", data);
  }, [data]);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Memoize chart data to prevent unnecessary recreations
  const chartData = useMemo(() => {
    console.log("Generating chart data from:", data);
    const result = [
      { name: 'Wins', value: data.winRate },
      { name: 'Losses', value: data.lossRate }
    ];
    
    if (data.breakEvenRate && data.breakEvenRate > 0) {
      result.push({ name: 'Break Even', value: data.breakEvenRate });
    }
    
    return result;
  }, [data.winRate, data.lossRate, data.breakEvenRate]);

  // Memoize sizing calculations with increased sizes for mobile
  const chartSizing = useMemo(() => {
    if (isXSmall) {
      return {
        width: 140, // Increased from 90
        height: 140, // Increased from 90
        innerRadius: 36, // Increased from 24
        outerRadius: 62, // Increased from 40
        fontSize: '16px', // Increased from 12px
        labelSize: '10px', // Increased from 8px
      };
    }

    if (isMobile) {
      return {
        width: 160, // Increased from 110
        height: 160, // Increased from 110
        innerRadius: 48, // Increased from 32
        outerRadius: 72, // Increased from 50
        fontSize: '18px', // Increased from 14px
        labelSize: '11px', // Increased from 9px
      };
    }
    
    // Default desktop sizes
    switch(size) {
      case 'small':
        return {
          width: 110,
          height: 110,
          innerRadius: 32,
          outerRadius: 52,
          fontSize: '15px',
          labelSize: '10px',
        };
      case 'large':
        return {
          width: 150,
          height: 150,
          innerRadius: 45,
          outerRadius: 70,
          fontSize: '18px',
          labelSize: '11px',
        };
      default: // medium
        return {
          width: 120,
          height: 120,
          innerRadius: 35,
          outerRadius: 58,
          fontSize: '16px',
          labelSize: '10px',
        };
    }
  }, [isXSmall, isMobile, size]);

  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
        <span className="text-xs opacity-70">Loading...</span>
      </div>
    );
  }

  const { width, height, innerRadius, outerRadius, fontSize, labelSize } = chartSizing;

  // Non-responsive version for fixed size rendering with improved mobile display
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-2">
        <div className="relative">
          <PieChart width={width} height={height}>
            <defs>
              <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9b87f5" stopOpacity={1} />
                <stop offset="100%" stopColor="#7E69AB" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D6BCFA" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="breakEvenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.7} />
                <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <Pie
              data={chartData}
              cx={width / 2}
              cy={height / 2}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={1}
              stroke="hsl(var(--background))"
              animationDuration={800}
            >
              {chartData.map((entry, index) => {
                let fillUrl;
                if (entry.name === 'Wins') fillUrl = "url(#winGradient)";
                else if (entry.name === 'Losses') fillUrl = "url(#lossGradient)";
                else fillUrl = "url(#breakEvenGradient)";
                
                return <Cell key={`cell-${index}`} fill={fillUrl} />;
              })}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-bold" style={{ fontSize }}>
              {data.winRate}%
            </span>
            <span className="text-muted-foreground" style={{ fontSize: labelSize }}>
              Win Rate
            </span>
          </div>
        </div>
      </div>
    );
  }
  
  // Responsive version for desktop
  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9b87f5" stopOpacity={1} />
              <stop offset="100%" stopColor="#7E69AB" stopOpacity={0.9} />
            </linearGradient>
            <linearGradient id="lossGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D6BCFA" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#C4B5FD" stopOpacity={0.7} />
            </linearGradient>
            <linearGradient id="breakEvenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.7} />
              <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            dataKey="value"
            strokeWidth={1}
            stroke="hsl(var(--background))"
            animationDuration={1000}
          >
            {chartData.map((entry, index) => {
              let fillUrl;
              if (entry.name === 'Wins') fillUrl = "url(#winGradient)";
              else if (entry.name === 'Losses') fillUrl = "url(#lossGradient)";
              else fillUrl = "url(#breakEvenGradient)";
              
              return <Cell key={`cell-${index}`} fill={fillUrl} />;
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span className="font-bold text-lg sm:text-xl">
          {data.winRate}%
        </span>
        <span className="text-xs text-muted-foreground">
          Win Rate
        </span>
      </motion.div>
    </div>
  );
};

export default WinRateDonutChart;
