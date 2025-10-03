import React, { useState, useCallback, memo, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTrialStatus } from '@/hooks/use-trial-status';
import AppLayout from '@/components/layout/AppLayout';
import TrialBanner from '@/components/subscription/TrialBanner';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { usePerformanceOptimization } from '@/hooks/use-performance-optimization';

// Lazy load heavy components
const DashboardTabs = lazy(() => import('@/components/dashboard/DashboardTabs'));

// Loading fallback for dashboard
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-10 w-24" />
    </div>
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-lg" />
      ))}
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Skeleton className="h-80 sm:col-span-2 rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-lg" />
        <Skeleton className="h-40 rounded-lg" />
      </div>
    </div>
  </div>
);

const OptimizedIndexPage = memo(() => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isTrialActive } = useTrialStatus();
  const { prefetchData } = usePerformanceOptimization('IndexPage');
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  // Optimized navigation handler
  const handleAddTrade = useCallback(() => {
    // Prefetch trade form data if needed
    prefetchData(['trade-form'], () => Promise.resolve({}));
    navigate('/trade-form');
  }, [navigate, prefetchData]);

  // Optimized date range handler
  const handleDateRangeChange = useCallback((range: DateRange | undefined) => {
    setDateRange(range);
  }, []);

  return (
    <AppLayout>
      <Helmet>
        <title>Dashboard - Wiggly Trading Journal</title>
        <meta name="description" content="Your comprehensive trading dashboard with analytics, performance metrics, and insights." />
        <link rel="preload" href="/api/trades" as="fetch" crossOrigin="anonymous" />
      </Helmet>
      
      <div className="space-y-6 py-4 sm:py-6">
        {/* Trial Banner */}
        {isTrialActive && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrialBanner trialExpiresAt={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Trading Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track your trading performance and analyze your journey
            </p>
          </div>
          
          <Button 
            onClick={handleAddTrade}
            size={isMobile ? "sm" : "default"}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trade
          </Button>
        </motion.div>

        {/* Date Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <DateRangeSelector 
            onRangeChange={handleDateRangeChange}
          />
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ErrorBoundary>
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardTabs dateRange={dateRange} />
            </Suspense>
          </ErrorBoundary>
        </motion.div>
      </div>
    </AppLayout>
  );
});

OptimizedIndexPage.displayName = 'OptimizedIndexPage';

export default OptimizedIndexPage;