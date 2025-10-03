import React, { memo, useMemo, lazy, Suspense } from 'react';
import { DateRange } from 'react-day-picker';
import { useQuery } from '@tanstack/react-query';
import { fetchUserTrades } from '@/services/trades-service';
import { Skeleton } from '@/components/ui/skeleton';
import OptimizedStatCard from './OptimizedStatCard';
import { formatIndianCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, LayoutGrid, ArrowUpDown } from 'lucide-react';

// Lazy load heavy chart components
const PerformanceChart = lazy(() => import('./PerformanceChart'));
const EmotionalAnalysisChart = lazy(() => import('./EmotionalAnalysisChart'));
const WinRateChart = lazy(() => import('./WinRateChart'));
const RecentTrades = lazy(() => import('./RecentTrades'));

interface OptimizedAnalyticsOverviewProps {
  dateRange?: DateRange | undefined;
}

// Chart loading skeleton
const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <Skeleton className={`w-full rounded-lg`} style={{ height }} />
);

const OptimizedAnalyticsOverview = memo<OptimizedAnalyticsOverviewProps>(({ 
  dateRange 
}) => {
  // Optimized data fetching with proper caching
  const { 
    data: tradesResponse, 
    isLoading 
  } = useQuery({
    queryKey: ['trades-analytics', dateRange],
    queryFn: () => fetchUserTrades({ 
      page: 0, 
      pageSize: 1000, // Get more data for analytics
      forceRefresh: false 
    }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000
  });

  const trades = tradesResponse?.data || [];

  // Memoized calculations for better performance
  const analytics = useMemo(() => {
    if (!trades.length) {
      return {
        totalTrades: 0,
        winningTrades: 0,
        winRate: 0,
        totalPnl: 0,
        avgPnl: 0
      };
    }

    const profitableTrades = trades.filter(trade => trade.pnl > 0);
    const totalTrades = trades.length;
    const winningTrades = profitableTrades.length;
    const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
    const totalPnl = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0;

    return {
      totalTrades,
      winningTrades,
      winRate,
      totalPnl,
      avgPnl
    };
  }, [trades]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ChartSkeleton height={320} />
          <ChartSkeleton height={320} />
          <ChartSkeleton height={320} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Optimized Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <OptimizedStatCard
          title="Total Trades"
          value={analytics.totalTrades}
          icon={<LayoutGrid className="h-4 w-4" />}
          subtitle="All time"
          delay={0}
        />
        <OptimizedStatCard
          title="Win Rate"
          value={`${analytics.winRate}%`}
          icon={<TrendingUp className="h-4 w-4" />}
          subtitle={`${analytics.winningTrades} winning trades`}
          trend="up"
          delay={0.1}
        />
        <OptimizedStatCard
          title="Total P&L"
          value={formatIndianCurrency(analytics.totalPnl)}
          icon={analytics.totalPnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          subtitle="Net result"
          trend={analytics.totalPnl >= 0 ? 'up' : 'down'}
          delay={0.2}
        />
        <OptimizedStatCard
          title="Avg. P&L"
          value={formatIndianCurrency(analytics.avgPnl)}
          icon={<ArrowUpDown className="h-4 w-4" />}
          subtitle="Per trade"
          trend={analytics.avgPnl >= 0 ? 'up' : 'down'}
          delay={0.3}
        />
      </div>

      {/* Lazy-loaded Charts */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Suspense fallback={<ChartSkeleton height={320} />}>
            <PerformanceChart dateRange={dateRange} />
          </Suspense>
        </div>
        <div className="space-y-4">
          <Suspense fallback={<ChartSkeleton height={150} />}>
            <WinRateChart dateRange={dateRange} />
          </Suspense>
          <Suspense fallback={<ChartSkeleton height={150} />}>
            <EmotionalAnalysisChart emotions={[]} />
          </Suspense>
        </div>
      </div>

      {/* Recent Trades */}
      <Suspense fallback={<ChartSkeleton height={200} />}>
        <RecentTrades dateRange={dateRange} />
      </Suspense>
    </div>
  );
}, (prevProps, nextProps) => {
  return JSON.stringify(prevProps.dateRange) === JSON.stringify(nextProps.dateRange);
});

OptimizedAnalyticsOverview.displayName = 'OptimizedAnalyticsOverview';

export default OptimizedAnalyticsOverview;