import React, { memo, useMemo, lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load chart components to reduce initial bundle size
const LazyLineChart = lazy(() => 
  import('recharts').then(module => ({ default: module.LineChart }))
);
const LazyBarChart = lazy(() => 
  import('recharts').then(module => ({ default: module.BarChart }))
);
const LazyPieChart = lazy(() => 
  import('recharts').then(module => ({ default: module.PieChart }))
);

// Chart loading fallback
const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <Skeleton className={`w-full rounded-lg`} style={{ height }} />
);

interface OptimizedChartProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  height?: number;
  children: React.ReactNode;
}

// Memoized chart component that only re-renders when data changes
const OptimizedChart = memo<OptimizedChartProps>(({ 
  type, 
  data, 
  height = 300, 
  children 
}) => {
  // Memoize chart component selection
  const ChartComponent = useMemo(() => {
    switch (type) {
      case 'line':
        return LazyLineChart;
      case 'bar':
        return LazyBarChart;
      case 'pie':
        return LazyPieChart;
      default:
        return LazyLineChart;
    }
  }, [type]);

  // Memoize data processing
  const processedData = useMemo(() => {
    // Only process if data has actually changed
    return data?.length > 0 ? data : [];
  }, [data]);

  if (!processedData.length) {
    return <ChartSkeleton height={height} />;
  }

  return (
    <Suspense fallback={<ChartSkeleton height={height} />}>
      <ChartComponent 
        data={processedData} 
        height={height}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        {children}
      </ChartComponent>
    </Suspense>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.type === nextProps.type &&
    prevProps.height === nextProps.height &&
    JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
  );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;