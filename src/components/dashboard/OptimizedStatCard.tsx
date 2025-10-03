import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OptimizedStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  delay?: number;
}

// Memoized stat card component
const OptimizedStatCard = memo<OptimizedStatCardProps>(({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend = 'neutral',
  className,
  delay = 0
}) => {
  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-foreground'
  };

  const borderColors = {
    up: 'border-success/10',
    down: 'border-destructive/10',
    neutral: 'border-primary/10'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn(
        "border bg-gradient-to-br from-card/80 to-card overflow-hidden shadow-sm hover:shadow-md transition-all",
        borderColors[trend],
        className
      )}>
        <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            {icon && <div className="text-primary">{icon}</div>}
          </div>
          <h3 className={cn("text-2xl font-bold", trendColors[trend])}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the value or trend actually changed
  return (
    prevProps.title === nextProps.title &&
    prevProps.value === nextProps.value &&
    prevProps.subtitle === nextProps.subtitle &&
    prevProps.trend === nextProps.trend
  );
});

OptimizedStatCard.displayName = 'OptimizedStatCard';

export default OptimizedStatCard;