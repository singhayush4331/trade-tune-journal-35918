import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trade } from '@/utils/trade-form-types';
import { useIsMobile } from '@/hooks/use-mobile';

// Lazy load trade item component
const TradeItem = lazy(() => import('./TradeItem'));

interface OptimizedTradesListProps {
  trades: Trade[];
  onTradeClick: (tradeId: string) => void;
  onEditTrade: (tradeId: string) => void;
  onDeleteTrade: (tradeId: string) => void;
  isLoading?: boolean;
}

// Loading skeleton for trade items
const TradeItemSkeleton = () => (
  <div className="p-4 border border-border/40 rounded-lg">
    <div className="flex justify-between items-start mb-3">
      <div className="space-y-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-6 w-12" />
    </div>
    <div className="grid grid-cols-2 gap-2">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  </div>
);

const OptimizedTradesList = memo<OptimizedTradesListProps>(({
  trades,
  onTradeClick,
  onEditTrade,
  onDeleteTrade,
  isLoading = false
}) => {
  const isMobile = useIsMobile();
  
  // Memoize container ref
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  // Estimate item size based on device
  const estimateSize = useCallback(() => {
    return isMobile ? 140 : 120;
  }, [isMobile]);

  // Setup virtualizer for large lists
  const rowVirtualizer = useVirtualizer({
    count: trades.length,
    getScrollElement: () => parentRef.current,
    estimateSize,
    overscan: 5,
  });

  // Memoized handlers
  const handleTradeClick = useCallback((tradeId: string) => {
    onTradeClick(tradeId);
  }, [onTradeClick]);

  const handleEditTrade = useCallback((tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onEditTrade(tradeId);
  }, [onEditTrade]);

  const handleDeleteTrade = useCallback((tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteTrade(tradeId);
  }, [onDeleteTrade]);

  // Calculate dynamic height
  const listHeight = useMemo(() => {
    const maxHeight = window.innerHeight * 0.7;
    const minHeight = 400;
    return Math.max(minHeight, Math.min(maxHeight, trades.length * estimateSize()));
  }, [trades.length, estimateSize]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <TradeItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No trades found</p>
      </Card>
    );
  }

  // Use virtualization for large lists (>20 items)
  if (trades.length > 20) {
    return (
      <div
        ref={parentRef}
        className="overflow-auto"
        style={{ height: `${listHeight}px` }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => {
            const trade = trades[virtualItem.index];
            
            return (
              <div
                key={virtualItem.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div className="p-2 h-full">
                  <Suspense fallback={<TradeItemSkeleton />}>
                    <TradeItem
                      trade={trade}
                      onTradeClick={() => handleTradeClick(trade.id)}
                      onEditClick={(tradeId, e) => handleEditTrade(tradeId, e)}
                      onDeleteClick={(tradeId, e) => handleDeleteTrade(tradeId, e)}
                    />
                  </Suspense>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // For smaller lists, render normally
  return (
    <div className="space-y-4">
      {trades.map((trade) => (
        <Suspense key={trade.id} fallback={<TradeItemSkeleton />}>
          <TradeItem
            trade={trade}
            onTradeClick={() => handleTradeClick(trade.id)}
            onEditClick={(tradeId, e) => handleEditTrade(tradeId, e)}
            onDeleteClick={(tradeId, e) => handleDeleteTrade(tradeId, e)}
          />
        </Suspense>
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.trades.length === nextProps.trades.length &&
    prevProps.isLoading === nextProps.isLoading &&
    JSON.stringify(prevProps.trades.map(t => ({ id: t.id, updatedAt: t.updatedAt }))) === 
    JSON.stringify(nextProps.trades.map(t => ({ id: t.id, updatedAt: t.updatedAt })))
  );
});

OptimizedTradesList.displayName = 'OptimizedTradesList';

export default OptimizedTradesList;