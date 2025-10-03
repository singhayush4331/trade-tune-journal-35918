import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  TrendingDown, 
  TrendingUp, 
  ArrowUpDown,
  LayoutGrid,
  MoreHorizontal,
  Filter,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchUserTrades, deleteTrade } from '@/services/trades-service';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatIndianCurrency } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trade } from '@/utils/trade-form-types';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';

const TradeDetailSheet = lazy(() => import('@/components/trades/TradeDetailSheet'));
const VirtualizedTradesList = lazy(() => import('@/components/trades/VirtualizedTradesList'));

const TradesListSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-20 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
    <Skeleton className="h-16 w-full rounded-lg" />
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="text-center p-4 bg-destructive/10 rounded-lg">
    <h3 className="text-lg font-medium text-destructive">Something went wrong</h3>
    <p className="text-sm text-muted-foreground mb-4">{error?.message || "An unexpected error occurred"}</p>
    <Button variant="outline" onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

const PAGE_SIZE = 50;

const TradesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  const perfMonitor = usePerformanceMonitor('TradesPage');
  
  const loadMoreObserverRef = useRef(null);
  const observerRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [selectedTrade, setSelectedTrade] = useState<any | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [localTrades, setLocalTrades] = useState<any[]>([]);
  
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const { 
    data: tradesResponse, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['trades', page, PAGE_SIZE, sortOrder],
    queryFn: () => fetchUserTrades({ page, pageSize: PAGE_SIZE }),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: prevData => prevData,
  });

  const queryClient = useQueryClient();
  useEffect(() => {
    const ric: any = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 200));
    ric(() => {
      queryClient.prefetchQuery({
        queryKey: ['trades', 0, PAGE_SIZE, sortOrder],
        queryFn: () => fetchUserTrades({ page: 0, pageSize: PAGE_SIZE }),
        staleTime: 5 * 60 * 1000,
      });
    });
  }, [queryClient, sortOrder]);

  // Check for refresh state when the component mounts or location changes
  useEffect(() => {
    const needsRefresh = location.state?.refreshTrades === true;
    const newTradeId = location.state?.newTradeId;
    
    if (needsRefresh) {
      perfMonitor.markEvent('refreshing_trades_after_navigation');
      console.log("Refreshing trades after new trade submission");
      
      // Reset page to 0 to ensure we get the latest data
      setPage(0);
      
      // Clear the location state to prevent repeated refreshes
      navigate(location.pathname, { replace: true, state: {} });
      
      // Trigger a refetch without showing a duplicate toast notification
      refetch();
      
      // Remove the duplicate toast notification
      // We'll highlight the new trade in the UI instead of showing a toast
      if (newTradeId) {
        perfMonitor.markEvent('new_trade_highlighted');
        // Visual indication can happen in the UI without another toast
        // The toast notification already happened in the TradeForm component
      }
    }
  }, [location, navigate, refetch, perfMonitor]);

  useEffect(() => {
    if (tradesResponse?.data) {
      if (page === 0) {
        setLocalTrades(tradesResponse.data);
      } else {
        setLocalTrades(prev => {
          const newTradeIds = new Set(tradesResponse.data.map(t => t.id));
          const filteredPrev = prev.filter(t => !newTradeIds.has(t.id));
          return [...filteredPrev, ...tradesResponse.data];
        });
      }
      
      setHasMore(tradesResponse.data.length === PAGE_SIZE);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tradesResponse, page]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching trades:", error);
      toast.error("Failed to load trades. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    const handleTradeUpdate = (event) => {
      console.log("Trade data updated, refetching...");
      perfMonitor.markEvent('trade_update_event_received');
      
      // Only refetch if we're already on the trades page
      // This prevents double-refetching when we navigate from the trade form
      if (!location.state?.refreshTrades) {
        setPage(0);
        refetch();
      }
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    return () => window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
  }, [refetch, location.state, perfMonitor]);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    
    const loadMoreElement = document.getElementById('load-more-trades');
    if (loadMoreElement) {
      observerRef.current.observe(loadMoreElement);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, handleLoadMore]);

  const handleTradeClick = useCallback((tradeId: string) => {
    const trade = localTrades.find(t => t.id === tradeId);
    if (trade) {
      setSelectedTrade(trade);
      setIsSheetOpen(true);
    }
  }, [localTrades]);

  const handleDeleteTrade = useCallback(async (tradeId: string) => {
    try {
      const { error } = await deleteTrade(tradeId);
      
      if (error) {
        console.error("Error deleting trade:", error);
        toast.error("Failed to delete trade");
        return;
      }
      
      setLocalTrades(trades => trades.filter(trade => trade.id !== tradeId));
      
      toast.success("Trade deleted successfully");
      
      if (selectedTrade && selectedTrade.id === tradeId) {
        setIsSheetOpen(false);
        setSelectedTrade(null);
      }
    } catch (error) {
      console.error("Error deleting trade:", error);
      toast.error("Failed to delete trade");
    }
  }, [selectedTrade]);

  const handleEditTrade = useCallback((tradeId: string) => {
    console.log("Navigating to edit trade:", tradeId);
    navigate(`/trade-form/${tradeId}`);
  }, [navigate]);

  const handleAddTrade = useCallback(() => {
    navigate('/trade-form');
  }, [navigate]);

  const clearDateFilter = useCallback(() => {
    setSelectedDate(undefined);
    toast.info("Date filter cleared");
  }, []);

  const tradeStats = useMemo(() => {
    console.time('stats-calculation');
    const totalTrades = localTrades.length;
    const profitableTrades = localTrades.filter(trade => trade.pnl > 0);
    const winningTrades = profitableTrades.length;
    const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
    const totalPnl = localTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const avgPnl = totalTrades > 0 ? totalPnl / totalTrades : 0;
    console.timeEnd('stats-calculation');

    return { totalTrades, winningTrades, winRate, totalPnl, avgPnl };
  }, [localTrades]);

  const filteredTrades = useMemo(() => {
    console.time('filter-trades');
    const filtered = localTrades
      .filter(trade => 
        (trade.symbol && trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (trade.type && trade.type.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .filter(trade => {
        if (!selectedDate) return true;
        
        const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
        return isWithinInterval(tradeDate, {
          start: startOfDay(selectedDate),
          end: endOfDay(selectedDate)
        });
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          if (sortOrder === 'asc') {
            const aDate = a.updatedAt ? new Date(a.updatedAt) : a.date;
            const bDate = b.updatedAt ? new Date(b.updatedAt) : b.date;
            return aDate.getTime() - bDate.getTime();
          } else {
            const aDate = a.updatedAt ? new Date(a.updatedAt) : a.date;
            const bDate = b.updatedAt ? new Date(b.updatedAt) : b.date;
            return bDate.getTime() - aDate.getTime();
          }
        }
        if (sortBy === 'pnl') {
          const aPnl = a.pnl !== undefined ? a.pnl : a.pnl;
          const bPnl = b.pnl !== undefined ? b.pnl : b.pnl;
          return sortOrder === 'asc' ? aPnl - bPnl : bPnl - aPnl;
        }
        if (sortBy === 'symbol') {
          return sortOrder === 'asc' 
            ? a.symbol.localeCompare(b.symbol)
            : b.symbol.localeCompare(a.symbol);
        }
        return 0;
      });
    console.timeEnd('filter-trades');
    return filtered;
  }, [searchTerm, sortBy, sortOrder, localTrades, selectedDate]);

  return (
    <AppLayout>
      <div className="space-y-6 py-4 sm:py-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Trades History
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Your trading journey visualized</p>
            </div>
            <Button 
              onClick={handleAddTrade} 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all"
            >
              Add Trade
            </Button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "grid gap-3",
              isXSmall ? "grid-cols-1" : "grid-cols-2 md:grid-cols-4"
            )}
          >
            <Card className="border border-primary/10 bg-gradient-to-br from-card/80 to-card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Total Trades</p>
                <h3 className="text-2xl font-bold mt-1">{tradeStats.totalTrades}</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <LayoutGrid className="h-3 w-3" />
                  <span>All time</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-success/10 bg-gradient-to-br from-card/80 to-card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-success/10 rounded-full blur-xl"></div>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Win Rate</p>
                <h3 className="text-2xl font-bold mt-1 text-success">{tradeStats.winRate}%</h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span>{tradeStats.winningTrades} winning trades</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-primary/10 bg-gradient-to-br from-card/80 to-card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Total P&L</p>
                <h3 className={cn(
                  "text-2xl font-bold mt-1",
                  tradeStats.totalPnl >= 0 ? "text-success" : "text-destructive"
                )}>
                  {formatIndianCurrency(tradeStats.totalPnl)}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  {tradeStats.totalPnl >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span>Net result</span>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-primary/10 bg-gradient-to-br from-card/80 to-card overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="absolute -right-6 -top-6 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground">Avg. P&L</p>
                <h3 className={cn(
                  "text-2xl font-bold mt-1",
                  tradeStats.avgPnl >= 0 ? "text-success" : "text-destructive"
                )}>
                  {formatIndianCurrency(tradeStats.avgPnl)}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <ArrowUpDown className="h-3 w-3" />
                  <span>Per trade</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mobile-optimized search and filter controls */}
          <Card className="border border-border/40 shadow-sm p-3 sm:p-4 bg-card/60 backdrop-blur-sm">
            {isMobile ? (
              <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by symbol or type..."
                    className="pl-9 bg-background/50 border-border/30 transition-all focus-visible:ring-primary/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-1">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn(
                          selectedDate && "bg-primary/10 border-primary/30"
                        )}>
                          <CalendarIcon className={cn("h-3.5 w-3.5 mr-1", selectedDate && "text-primary")} />
                          <span>{selectedDate ? format(selectedDate, 'dd MMM') : 'Date'}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setIsCalendarOpen(false);
                            if (date) {
                              toast.info(`Filtered to ${format(date, 'dd MMM yyyy')}`);
                            }
                          }}
                          initialFocus
                          className="p-3"
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {selectedDate && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={clearDateFilter} 
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  
                  <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-3.5 w-3.5 mr-1" />
                        <span>Sort & Filter</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="max-h-[70vh]">
                      <SheetHeader className="mb-4">
                        <SheetTitle>Sort & Filter Options</SheetTitle>
                      </SheetHeader>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Sort by</h3>
                          <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="pnl">P&L</SelectItem>
                              <SelectItem value="symbol">Symbol</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Sort order</h3>
                          <Select 
                            value={sortOrder} 
                            onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Order" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">Ascending</SelectItem>
                              <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator />
                        
                        <Button 
                          className="w-full"
                          onClick={() => setIsFilterSheetOpen(false)}
                        >
                          Apply
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by symbol or type..."
                    className="pl-9 bg-background/50 border-border/30 transition-all focus-visible:ring-primary/30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-background/50 border-border/30 w-32">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="pnl">P&L</SelectItem>
                      <SelectItem value="symbol">Symbol</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                    <SelectTrigger className="bg-background/50 border-border/30 w-32">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon" className={cn(
                        "w-9 h-9", 
                        selectedDate && "bg-primary/10 border-primary/30"
                      )}>
                        <CalendarIcon className={cn("h-4 w-4", selectedDate && "text-primary")} />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setIsCalendarOpen(false);
                        }}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                      <div className="border-t flex items-center justify-between p-2 bg-muted/20">
                        <span className="text-xs text-muted-foreground">Filter by date</span>
                        <Button variant="ghost" size="sm" onClick={clearDateFilter} className="h-7 px-2 text-xs">
                          Clear
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  {selectedDate && (
                    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-xs gap-1 px-2">
                      <span>{format(selectedDate, 'dd MMM yyyy')}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={clearDateFilter} />
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
        
        {isLoading && page === 0 ? (
          <TradesListSkeleton />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-card/60 backdrop-blur-sm rounded-lg border border-border/30 shadow-sm"
          >
            {filteredTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/40 flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-medium">No trades found</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  {searchTerm || selectedDate ? 
                    "Try adjusting your search filters" : 
                    "You haven't added any trades yet. Start by adding your first trade."
                  }
                </p>
                {(searchTerm || selectedDate) && (
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                    setSearchTerm('');
                    setSelectedDate(undefined);
                  }}>
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Suspense fallback={<TradesListSkeleton />}>
                  <VirtualizedTradesList 
                    trades={filteredTrades}
                    handleTradeClick={handleTradeClick}
                    onDeleteTrade={handleDeleteTrade}
                    onEditTrade={handleEditTrade}
                    isLoading={isLoading && page > 0}
                  />
                </Suspense>
                
                {hasMore && (
                  <div 
                    id="load-more-trades" 
                    className="py-4 flex justify-center items-center"
                  >
                    {isLoading && page > 0 ? (
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-5 h-5 rounded-full animate-pulse" />
                        <Skeleton className="w-24 h-4 rounded-full animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4 animate-pulse" />
                        <span>Loading more trades</span>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </div>

      {selectedTrade && (
        <Suspense fallback={<div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />}>
          <TradeDetailSheet 
            trade={selectedTrade}
            open={isSheetOpen}
            onOpenChange={setIsSheetOpen}
          />
        </Suspense>
      )}
    </AppLayout>
  );
};

export default React.memo(TradesPage);
