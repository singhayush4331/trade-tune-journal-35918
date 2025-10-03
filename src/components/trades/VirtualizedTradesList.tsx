
import React, { useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import TradeItem from './TradeItem';
import { measureRenderTime } from '@/utils/performance-monitoring';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

interface Trade {
  id: string;
  date: Date;
  symbol: string;
  type: string;
  pnl: number;
  quantity?: number;
  entryPrice?: number;
  exitPrice?: number;
  entry_price?: number;
  exit_price?: number;
  screenshots?: string[] | null;
}

interface VirtualizedTradesListProps {
  trades: Trade[];
  handleTradeClick: (tradeId: string) => void;
  onDeleteTrade?: (tradeId: string) => void;
  onEditTrade?: (tradeId: string) => void;
  isLoading?: boolean;
}

// Window size detection to optimize virtualized list rendering
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', updateSize);
    updateSize();
    
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  
  return size;
};

const VirtualizedTradesList: React.FC<VirtualizedTradesListProps> = ({
  trades,
  handleTradeClick,
  onDeleteTrade,
  onEditTrade,
  isLoading = false
}) => {
  // Performance measurement
  const endMeasure = measureRenderTime('VirtualizedTradesList');
  
  // Create a reference to the parent container
  const parentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [tradeToDelete, setTradeToDelete] = useState<string | null>(null);
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  // Get estimated item size based on trade data complexity and screen width
  // More consistent sizing with smaller variations between items
  const getEstimatedSize = useCallback((index: number) => {
    const trade = trades[index];
    
    // More consistent size calculations across different screen sizes
    if (width < 375) {
      // Very small mobile devices
      return trade?.screenshots?.length ? 140 : 132;
    } else if (width < 480) {
      // Small mobile devices
      return trade?.screenshots?.length ? 125 : 120;
    } else if (width < 640) {
      // Medium mobile devices
      return trade?.screenshots?.length ? 115 : 110; 
    }
    
    // Desktop/tablet size
    return trade?.screenshots?.length ? 100 : 98;
  }, [trades, width]);

  // Set up the virtualizer with improved configuration
  const rowVirtualizer = useVirtualizer({
    count: trades.length,
    getScrollElement: () => parentRef.current,
    estimateSize: getEstimatedSize,
    overscan: Math.min(5, Math.ceil(trades.length * 0.1)), // Dynamic overscan based on total items
    paddingStart: 8,
    paddingEnd: 8,
    scrollPaddingStart: 8,
    scrollPaddingEnd: 8
  });

  // Memoize handlers to prevent unnecessary rerenders
  const handleEditTrade = useCallback((tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onEditTrade) {
      onEditTrade(tradeId);
    } else {
      navigate(`/trade-form/${tradeId}`);
      toast.info("Editing trade");
    }
  }, [onEditTrade, navigate]);

  const handleDeleteClick = useCallback((tradeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTradeToDelete(tradeId);
  }, []);

  const confirmDelete = useCallback(() => {
    if (tradeToDelete && onDeleteTrade) {
      onDeleteTrade(tradeToDelete);
      toast.success("Trade deleted successfully");
    }
    setTradeToDelete(null);
  }, [tradeToDelete, onDeleteTrade]);

  // Show loading state with optimized loading UI
  if (isLoading) {
    return (
      <div className="text-center p-10 text-muted-foreground">
        Loading trades...
      </div>
    );
  }

  // Early return if no trades
  if (!trades?.length) {
    return (
      <div className="text-center p-10 text-muted-foreground">
        No trades found.
      </div>
    );
  }
  
  // Calculate dynamic height based on available screen space
  const calculatedHeight = Math.max(300, Math.min(window.innerHeight - (isMobile ? 340 : 380), isMobile ? 500 : 600));
  const listHeight = isXSmall ? calculatedHeight - 40 : calculatedHeight;
  
  // End performance measurement when we're done with calculations
  endMeasure();

  // Memoize virtual items for better performance
  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <>
      <div 
        ref={parentRef} 
        className={cn(
          "relative overflow-auto px-3",
          isXSmall ? "pb-4" : ""
        )}
        style={{ 
          height: `${listHeight}px`,
          contain: 'strict', 
          contentVisibility: 'auto',
          willChange: 'transform'
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualItem) => {
            const trade = trades[virtualItem.index];
            return (
              <div
                key={trade.id}
                className="absolute top-0 left-0 w-full py-1.5"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <TradeItem 
                  trade={trade}
                  onTradeClick={handleTradeClick}
                  onEditClick={handleEditTrade}
                  onDeleteClick={handleDeleteClick}
                />
              </div>
            );
          })}
        </div>
      </div>

      <AlertDialog open={!!tradeToDelete} onOpenChange={() => setTradeToDelete(null)}>
        <AlertDialogContent className="border border-border/30 bg-card/90 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the selected trade and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/30">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-500 text-white hover:bg-rose-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Add missing import for cn utility
import { cn } from '@/lib/utils';

export default React.memo(VirtualizedTradesList);
