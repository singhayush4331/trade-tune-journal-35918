
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import PlaybooksManager from '@/components/playbooks/PlaybooksManager';
import { BookOpen, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { fetchUserTrades } from '@/services/trades-service';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTrialStatus } from '@/hooks/use-trial-status';
import { Button } from '@/components/ui/button';
import { forceInitializeMockData, isMockDataInitialized } from '@/services/mock-data-service';
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';

const PlaybooksPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const { isTrialActive } = useTrialStatus();
  const perfMonitor = usePerformanceMonitor('PlaybooksPage');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Prefetch trades data when navigating to playbooks
  useEffect(() => {
    perfMonitor.markEvent('page_mounted');
    
    queryClient.prefetchQuery({
      queryKey: ['trades', 0, 50],
      queryFn: () => fetchUserTrades({ page: 0, pageSize: 50 })
    });
    
    return () => {
      perfMonitor.markEvent('page_unmounted');
    };
  }, [queryClient]);
  
  // Function to manually refresh mock data with reduced notifications
  const handleRefreshMockData = () => {
    if (isTrialActive) {
      perfMonitor.markEvent('refresh_mock_data_start');
      setIsRefreshing(true);
      
      setTimeout(() => {
        forceInitializeMockData();
        setTimeout(() => {
          setIsRefreshing(false);
          perfMonitor.markEvent('refresh_mock_data_complete');
        }, 1000);
      }, 100);
    }
  };
  
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 pb-24">
        <div className="container px-4 py-6 sm:py-8 pb-32">
          <motion.div 
            className="flex items-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onAnimationComplete={() => perfMonitor.markEvent('header_animation_complete')}
          >
            <div className="flex flex-col sm:flex-row sm:items-center w-full">
              <motion.div 
                className="hidden sm:flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mr-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <BookOpen className="h-6 w-6 text-primary" />
              </motion.div>
              <div className="flex-grow">
                <h1 className="flex items-center text-2xl sm:text-3xl md:text-4xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 pb-2">
                    Trading Playbooks
                  </span>
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-1">
                  Create and manage your trading strategies and rules in one place
                </p>
              </div>
              
              {isTrialActive && isMockDataInitialized() && (
                <Button 
                  id="refresh-mock-data-button"
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefreshMockData} 
                  disabled={isRefreshing}
                  className="flex items-center gap-1 mt-2 sm:mt-0"
                >
                  {isRefreshing ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {isRefreshing ? 'Refreshing...' : 'Refresh Demo Data'}
                </Button>
              )}
            </div>
          </motion.div>
          
          <PlaybooksManager />
        </div>
      </div>
    </AppLayout>
  );
};

export default PlaybooksPage;
