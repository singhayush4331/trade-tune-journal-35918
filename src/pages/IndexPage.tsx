
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { DateRange } from 'react-day-picker';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DateRangeSelector from '@/components/dashboard/DateRangeSelector';
import TrialBanner from '@/components/subscription/TrialBanner';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { autoInitializeForTrialUser } from '@/services/mock-data-service';
import { BarChart3, Plus } from 'lucide-react';
import { fetchUserTrades } from '@/services/trades-service';

const IndexPage = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isTrialActive, trialExpiresAt } = useTrialStatus();

  // Auto-initialize mock data for trial users
  useEffect(() => {
    if (isTrialActive) {
      console.log('Trial user detected, auto-initializing mock data');
      autoInitializeForTrialUser(isTrialActive);
    }
  }, [isTrialActive]);

  // Idle prefetch: warm up trades cache and analytics chunk
  useEffect(() => {
    const ric: any = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 200));
    ric(async () => {
      try {
        await fetchUserTrades({ page: 0 });
        // Preload analytics chunk used in DashboardTabs
        import('@/components/dashboard/AnalyticsOverview').catch(() => {});
      } catch (e) {}
    });
  }, []);

  const handleMockDataCleared = () => {
    // Force refresh of dashboard components by updating the key
    setRefreshKey(prev => prev + 1);
  };

  const handleAddTrade = () => {
    navigate('/trade-form');
  };

  return (
    <AppLayout>
      <Helmet>
        <title>Dashboard | Wiggly Trading Journal</title>
        <meta name="description" content="Your personal trading dashboard with analytics, performance metrics, and recent trades." />
      </Helmet>
      
      <div className="space-y-6 p-6">
        {/* Trial Banner */}
        {isTrialActive && trialExpiresAt && (
          <TrialBanner 
            trialExpiresAt={trialExpiresAt}
            className="mb-4"
            showDismiss={true}
            onMockDataCleared={handleMockDataCleared}
          />
        )}

        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Dashboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <DateRangeSelector onRangeChange={range => setDateRange(range)} />
            <Button 
              onClick={handleAddTrade}
              variant="gradient"
              className="flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
              size={isMobile ? "sm" : "lg"}
            >
              <Plus className="h-4 w-4" />
              {!isMobile && "Add Trade"}
            </Button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <DashboardTabs key={refreshKey} dateRange={dateRange} />
      </div>
    </AppLayout>
  );
};

export default IndexPage;
