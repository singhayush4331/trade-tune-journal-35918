
import React, { useState, lazy, Suspense, useCallback, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { LineChart, Calculator } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { usePerformanceOptimization } from '@/hooks/use-performance-optimization';

// Optimize lazy-loading with preloading
const AnalyticsOverview = lazy(() => 
  import('./AnalyticsOverview').then(module => ({ default: module.default }))
);
const PositionSizingCalculator = lazy(() => 
  import('./PositionSizingCalculator').then(module => ({ default: module.default }))
);

// Loading fallbacks for each component
const AnalyticsOverviewFallback = () => (
  <div className="space-y-4 sm:space-y-6">
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-lg" />)}
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

const PositionSizingCalculatorFallback = () => (
  <Skeleton className="h-[500px] w-full rounded-lg" />
);

interface DashboardTabsProps {
  dateRange?: DateRange | undefined;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  dateRange
}) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  const { prefetchData } = usePerformanceOptimization('DashboardTabs');

  // Preload other tab content when user hovers
  const handleTabHover = useCallback((tabValue: string) => {
    if (tabValue !== activeTab) {
      // Preload the component
      if (tabValue === 'positionSizing') {
        import('./PositionSizingCalculator');
      } else if (tabValue === 'analytics') {
        import('./AnalyticsOverview');
      }
    }
  }, [activeTab]);
  
  // Optimized animation variants
  const tabContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    }
  };
  
  const tabItemVariants = {
    hidden: {
      y: 5,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={tabContainerVariants} 
      className="relative"
      layoutId="dashboard-tabs-container"
    >
      <Tabs 
        defaultValue="analytics" 
        className="w-full" 
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full flex justify-between p-1 rounded-xl bg-muted/80 backdrop-blur-sm border border-border/50 shadow-sm overflow-hidden">
          <TabsTrigger 
            value="analytics" 
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg transition-all duration-300 py-1.5 px-2"
            onMouseEnter={() => handleTabHover('analytics')}
          >
            <LineChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className={`text-xs sm:text-sm ${isXSmall ? 'hidden sm:inline' : ''}`}>Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="positionSizing" 
            className="flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-500 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md rounded-lg transition-all duration-300 py-1.5 px-2"
            onMouseEnter={() => handleTabHover('positionSizing')}
          >
            <Calculator className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className={`text-xs sm:text-sm ${isXSmall ? 'hidden sm:inline' : ''}`}>Position Sizing</span>
          </TabsTrigger>
        </TabsList>
        
        <motion.div 
          key={activeTab} 
          initial={{
            opacity: 0,
            y: 10
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          exit={{
            opacity: 0,
            y: -10
          }} 
          transition={{
            duration: 0.3
          }} 
          className="overflow-x-hidden"
        >
          <TabsContent value="analytics" className="space-y-4 overflow-visible">
            <Suspense fallback={<AnalyticsOverviewFallback />}>
              <AnalyticsOverview dateRange={dateRange} />
            </Suspense>
          </TabsContent>
          <TabsContent value="positionSizing" className="space-y-4 overflow-visible my-[36px]">
            <Suspense fallback={<PositionSizingCalculatorFallback />}>
              <PositionSizingCalculator />
            </Suspense>
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
};

export default memo(DashboardTabs, (prevProps, nextProps) => {
  // Custom comparison for better memoization
  return JSON.stringify(prevProps.dateRange) === JSON.stringify(nextProps.dateRange);
});
