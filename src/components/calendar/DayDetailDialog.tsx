
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, formatISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { CalendarDays, TrendingDown, TrendingUp, Image, RefreshCw } from 'lucide-react';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { fetchUserTrades, TradesResponse } from '@/services/trades-service';
import TradeDetailSheet from '@/components/trades/TradeDetailSheet';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface DayDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  tradeDays?: any[];
}

const DayDetailDialog: React.FC<DayDetailDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedDate,
  tradeDays = []
}) => {
  const [dailyTrades, setDailyTrades] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    if (isOpen && selectedDate) {
      console.log('DayDetailDialog opened with date:', selectedDate);
      console.log('Trades passed to dialog:', tradeDays);
      
      setDailyTrades([]);
      setLoadError(null);
      
      if (Array.isArray(tradeDays) && tradeDays.length > 0) {
        // If trades are passed directly, use them
        console.log('Using directly passed trades:', tradeDays);
        setDailyTrades(tradeDays);
      } else {
        // Otherwise, fetch trades for the selected date
        console.log('Fetching trades for date:', selectedDate);
        loadTradesForDate();
      }
    } else {
      setDailyTrades([]);
      setLoadError(null);
    }
  }, [selectedDate, isOpen, tradeDays]);
  
  const loadTradesForDate = async () => {
    if (!selectedDate) return;
    
    setIsLoading(true);
    setIsRefreshing(true);
    
    try {
      const response: TradesResponse = await fetchUserTrades({ forceRefresh: true });
      
      if (response.error) {
        console.error("Error fetching trades:", response.error);
        setLoadError("Failed to load trades. Please try again later.");
        return;
      }
      
      if (response.data) {
        // Filter trades for the selected date
        const dayStart = startOfDay(selectedDate);
        const dayEnd = endOfDay(selectedDate);
        
        const tradesOnSelectedDay = response.data.filter(trade => {
          const tradeDate = new Date(trade.date);
          return isWithinInterval(tradeDate, { start: dayStart, end: dayEnd });
        });
        
        console.log('Fetched trades for date:', tradesOnSelectedDay);
        setDailyTrades(tradesOnSelectedDay);
        
        if (tradesOnSelectedDay.length === 0) {
          console.log('No trades found for the selected date');
        }
      }
    } catch (err) {
      console.error("Error loading trades for date:", err);
      setLoadError("An error occurred while fetching trades.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleTradeClick = (trade: any) => {
    setSelectedTrade(trade);
    setIsSheetOpen(true);
  };
  
  const handleRefresh = () => {
    toast.info("Refreshing trades data...");
    loadTradesForDate();
  };
  
  const dailyTotalPnl = dailyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  
  // Helper function to check if trade has screenshots
  const hasScreenshots = (trade: any) => {
    return (
      (trade.entryScreenshot || trade.exitScreenshot) || 
      (trade.screenshots && Array.isArray(trade.screenshots) && trade.screenshots.length > 0)
    );
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-xl">
          <DialogHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                {selectedDate && `Trades on ${format(selectedDate, 'MMMM d, yyyy')}`}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRefresh} 
                disabled={isRefreshing}
                className="h-7 px-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : loadError ? (
              <Alert>
                <AlertDescription>{loadError}</AlertDescription>
              </Alert>
            ) : dailyTrades.length > 0 ? (
              <>
                {dailyTrades.map((trade) => (
                  <div 
                    key={trade.id} 
                    className="group flex items-center justify-between border-b pb-2 hover:bg-muted/50 p-2 rounded-md transition-colors cursor-pointer"
                    onClick={() => handleTradeClick(trade)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        trade.pnl >= 0 ? "bg-success/20" : "bg-destructive/20"
                      )}>
                        {trade.pnl >= 0 ? (
                          <TrendingUp className="h-5 w-5 text-success" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-lg flex items-center gap-1">
                          {trade.symbol}
                          {hasScreenshots(trade) && <Image className="h-3 w-3 text-muted-foreground" />}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-xs", 
                            trade.type === 'long' ? "bg-success/10 text-success border-success/50" : "bg-destructive/10 text-destructive border-destructive/50"
                          )}
                        >
                          {trade.type}
                        </Badge>
                      </div>
                    </div>
                    <div className={cn(
                      "font-bold text-lg",
                      trade.pnl >= 0 ? "text-success" : "text-destructive"
                    )}>
                      {trade.pnl >= 0 ? '+' : ''}{formatIndianCurrency(Math.abs(trade.pnl || 0))}
                    </div>
                  </div>
                ))}
                <div className="pt-2 flex justify-between bg-muted/30 p-3 rounded-md">
                  <span className="font-bold text-lg">Total</span>
                  <span className={cn(
                    "font-bold text-lg",
                    dailyTotalPnl >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {dailyTotalPnl >= 0 ? '+' : ''}{formatIndianCurrency(Math.abs(dailyTotalPnl))}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No trades found for this day
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      {selectedTrade && (
        <TradeDetailSheet 
          trade={selectedTrade}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
        />
      )}
    </>
  );
};

export default DayDetailDialog;
