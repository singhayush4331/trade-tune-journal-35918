import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { useEmotionUtils, EmotionData } from '@/hooks/use-emotion-utils';
import CustomPieTooltip from './CustomPieTooltip';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
interface EmotionDistributionPieProps {
  emotions: EmotionData[];
}

// Enhanced mobile specific chart component with better styling
const MobileEmotionPie: React.FC<{
  processedEmotions: any[];
  innerRadius: number;
  outerRadius: number;
}> = ({
  processedEmotions,
  innerRadius,
  outerRadius
}) => {
  return <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-center" style={{
      height: '220px'
    }}>
        <PieChart width={220} height={220}>
          <defs>
            {processedEmotions.map((entry, index) => <linearGradient key={`gradient-${entry.name}`} id={`colorGradient-${entry.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
              </linearGradient>)}
          </defs>
          <Pie data={processedEmotions} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={2} dataKey="value" isAnimationActive={true} animationDuration={800} animationBegin={100} label={entry => entry.emoji} labelLine={false}>
            {processedEmotions.map((entry, index) => <Cell key={`cell-${index}`} fill={`url(#colorGradient-${entry.name})`} stroke="hsl(var(--background))" strokeWidth={1} />)}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} wrapperStyle={{
          zIndex: 1000
        }} />
        </PieChart>
      </div>
      
      {/* Enhanced mobile legend */}
      <div className="mt-3 flex flex-wrap justify-center gap-2.5 px-1.5 text-xs">
        {processedEmotions.map((entry, index) => <motion.div key={`legend-${index}`} className="flex items-center gap-2 bg-muted/30 px-2.5 py-1.5 rounded-full border border-border/20" initial={{
        opacity: 0,
        y: 5
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.2 + index * 0.05
      }}>
            <div className="h-3 w-3 rounded-full" style={{
          backgroundColor: entry.color
        }} />
            <span className="truncate max-w-[60px] capitalize">{entry.name}</span>
            <span className="text-muted-foreground">{entry.value}</span>
          </motion.div>)}
      </div>
      
      {/* Add emotion insights for mobile */}
      {processedEmotions.length > 0 && <motion.div className="mt-3 text-center text-xs text-muted-foreground px-2" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      delay: 0.5
    }}>
          <span className="font-medium text-foreground">Top emotion:</span> {' '}
          {processedEmotions.sort((a, b) => b.value - a.value)[0]?.emoji} {' '}
          {processedEmotions.sort((a, b) => b.value - a.value)[0]?.name}
        </motion.div>}
      
      {/* Only show debug info in development */}
      {process.env.NODE_ENV === 'development'}
    </div>;
};

// Default fallback data for development and testing
const DEFAULT_FALLBACK_DATA = [{
  name: 'happy',
  value: 5,
  pnl: 2500,
  avgPnl: 500
}, {
  name: 'confident',
  value: 3,
  pnl: 1800,
  avgPnl: 600
}];
const EmotionDistributionPie: React.FC<EmotionDistributionPieProps> = ({
  emotions
}) => {
  const {
    processEmotionData,
    animationVariants
  } = useEmotionUtils();
  const isMobile = useIsMobile();
  const [isReady, setIsReady] = useState(false);
  const [forceRerender, setForceRerender] = useState(0);

  // Force a re-render after mount to ensure proper rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceRerender(prev => prev + 1);
      setIsReady(true);
    }, isMobile ? 300 : 100);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Process emotion data with memoization and robust fallback
  const processedEmotions = useMemo(() => {
    console.log('Processing emotion data:', emotions, 'Mobile:', isMobile);

    // If no emotions, provide fallback - more robust handling
    if (!emotions || !Array.isArray(emotions) || emotions.length === 0) {
      console.log('Using fallback data for emotions');
      return processEmotionData(DEFAULT_FALLBACK_DATA);
    }
    const processed = processEmotionData(emotions);
    console.log('Processed emotions:', processed);
    return processed;
  }, [processEmotionData, emotions, forceRerender]);

  // Memoized label renderer function - now simpler for mobile
  const renderPieLabel = useCallback(({
    name,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius
  }: any) => {
    // Skip labels on mobile completely
    if (isMobile) return null;
    const currentEmotion = processedEmotions.find(e => e.name === name);
    const emoji = currentEmotion?.emoji || '😐';
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" style={{
      fontSize: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
        {emoji}
      </text>;
  }, [processedEmotions, isMobile]);

  // Simpler legend renderer for better performance
  const renderLegendContent = useCallback((props: any) => {
    const {
      payload
    } = props;
    return <div className="flex flex-wrap justify-center gap-2 px-1 text-xs pt-2">
        {payload.map((entry: any, index: number) => <motion.div key={`item-${index}`} className="flex items-center gap-1" initial="hidden" animate="visible" custom={index} variants={animationVariants.legendItem}>
            <div className="h-2.5 w-2.5 rounded-full" style={{
          backgroundColor: entry.color
        }} />
            <span className="truncate max-w-[60px] sm:max-w-full">{entry.value}</span>
          </motion.div>)}
      </div>;
  }, [animationVariants.legendItem]);

  // Calculate responsive dimensions - improved for mobile
  const innerRadius = isMobile ? 35 : 60;
  const outerRadius = isMobile ? 65 : 90;
  const chartHeight = isMobile ? 250 : 300;

  // Debug info
  useEffect(() => {
    console.log('Component state:', {
      isMobile,
      isReady,
      emotionsLength: emotions?.length,
      processedLength: processedEmotions?.length,
      chartHeight,
      forceRerender
    });
  }, [isMobile, isReady, emotions, processedEmotions, chartHeight, forceRerender]);

  // Return an explicit fallback for empty data
  if (!processedEmotions?.length) {
    console.log('No processed emotions data');
    return <div className="h-[180px] sm:h-[300px] flex items-center justify-center text-muted-foreground">
        No emotion data available
      </div>;
  }

  // For mobile devices, use the enhanced version
  if (isMobile) {
    console.log('Using enhanced mobile specific renderer');
    return <motion.div className="w-full relative h-full flex items-center justify-center py-2" data-chart-type="emotion-pie-mobile" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }}>
        <MobileEmotionPie processedEmotions={processedEmotions} innerRadius={innerRadius} outerRadius={outerRadius} />
      </motion.div>;
  }

  // Desktop version with ResponsiveContainer
  return <div className="w-full" data-chart-type="emotion-pie" style={{
    height: chartHeight,
    minHeight: chartHeight,
    position: 'relative'
  }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{
        top: 5,
        right: 5,
        bottom: 5,
        left: 5
      }}>
          <Pie data={processedEmotions} cx="50%" cy="50%" innerRadius={innerRadius} outerRadius={outerRadius} paddingAngle={3} dataKey="value" labelLine={false} label={renderPieLabel} isAnimationActive={!isMobile} animationBegin={0} animationDuration={800} animationEasing="ease-out">
            {processedEmotions.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="hsl(var(--background))" strokeWidth={1} />)}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} wrapperStyle={{
          zIndex: 1000
        }} />
          <Legend content={renderLegendContent} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Debug loader */}
      {process.env.NODE_ENV === 'development' && !isReady && <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-xs text-muted-foreground">Loading chart...</div>
        </div>}
    </div>;
};
export default React.memo(EmotionDistributionPie);