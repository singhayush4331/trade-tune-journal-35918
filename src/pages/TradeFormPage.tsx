
import React, { useEffect, useMemo, Suspense, lazy, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { fetchTradeById } from '@/services/trades-service';
import { toast } from 'sonner';
import { TradeFormSkeleton } from '@/components/shared/LoadingSkeletons';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load the TradeForm component with optimized loading
const TradeForm = lazy(() => 
  import('./TradeForm').then(module => ({
    default: module.default
  }))
);

// Custom error fallback for trade form
const TradeFormErrorFallback = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`p-${isMobile ? '4' : '6'} text-center`}>
      <h3 className="text-lg font-medium mb-2">Unable to load trade form</h3>
      <p className="text-muted-foreground mb-4">
        There was a problem loading the trade form. Please try again later.
      </p>
      <button 
        className="px-4 py-2 bg-primary text-white rounded-md"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  );
};

const TradeFormPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // Memoize tradeId to prevent unnecessary rerenders
  const tradeId = useMemo(() => id || undefined, [id]);
  
  // Enhanced prefetching with improved error handling and retry strategy
  const prefetchTradeData = useCallback(async (id: string) => {
    console.log("Prefetching trade data for ID:", id);
    
    try {
      await queryClient.prefetchQuery({
        queryKey: ['trade', id],
        queryFn: () => fetchTradeById(id),
        staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
        retry: (failureCount, error) => {
          // Only retry network errors, not 404s
          if (failureCount >= 2) return false;
          // @ts-ignore
          return !error.status || error.status !== 404;
        },
      });
    } catch (error) {
      console.error("Error prefetching trade data:", error);
      toast.error("Could not load trade data. Please try again.");
    }
  }, [queryClient]);
  
  // Setup prefetching once when component mounts
  useEffect(() => {
    if (id) {
      prefetchTradeData(id);
    } else {
      console.log("TradeFormPage: Creating new trade");
      // Preload trade form dependencies for better performance
      queryClient.setQueryData(['newTradeForm'], {
        prepared: true,
        timestamp: Date.now()
      });
    }
  }, [id, prefetchTradeData, queryClient]);
  
  return (
    <ErrorBoundary fallbackUI={<TradeFormErrorFallback />}>
      <Suspense fallback={<TradeFormSkeleton />}>
        <div className={`${isMobile ? 'px-2 py-4' : 'px-0 py-0'}`}>
          <TradeForm tradeId={tradeId} />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

// Prevent unnecessary re-renders
export default React.memo(TradeFormPage);
