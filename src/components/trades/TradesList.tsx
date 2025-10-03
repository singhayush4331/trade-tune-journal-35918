import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar as CalendarIcon, 
  Edit2, 
  ExternalLink, 
  EyeIcon, 
  Filter, 
  IndianRupee, 
  Search, 
  SortAsc, 
  PlusCircle, 
  Trash2, 
  ArrowDown,
  ArrowUp,
  LayoutGrid,
  BarChart3,
  Download,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { mockTrades } from '@/data/mockTradeData';
import { useNavigate } from 'react-router-dom';

type FilterStatus = 'all' | 'profit' | 'loss';
type SortOption = 'newest' | 'oldest' | 'highestPnl' | 'lowestPnl';

const TradesList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const navigate = useNavigate();
  
  const formattedTrades = mockTrades.map(trade => ({
    ...trade,
    date: format(trade.date, 'yyyy-MM-dd'),
  }));
  
  const filteredTrades = useMemo(() => {
    return formattedTrades
      .filter(trade => 
        (searchQuery === '' || 
         trade.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (trade.strategy && trade.strategy.toLowerCase().includes(searchQuery.toLowerCase())))
      )
      .filter(trade => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'profit') return trade.pnl > 0;
        if (filterStatus === 'loss') return trade.pnl < 0;
        return true;
      })
      .filter(trade => {
        if (!selectedDate) return true;
        
        const tradeDate = parseISO(trade.date);
        const startOfSelectedDate = startOfDay(selectedDate);
        const endOfSelectedDate = endOfDay(selectedDate);
        
        return isWithinInterval(tradeDate, {
          start: startOfSelectedDate,
          end: endOfSelectedDate
        });
      });
  }, [formattedTrades, searchQuery, filterStatus, selectedDate]);
  
  const sortedTrades = useMemo(() => {
    return [...filteredTrades].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highestPnl':
          return b.pnl - a.pnl;
        case 'lowestPnl':
          return a.pnl - b.pnl;
        default:
          return 0;
      }
    });
  }, [filteredTrades, sortOption]);

  const tradeStats = useMemo(() => {
    const totalTrades = filteredTrades.length;
    const winningTrades = filteredTrades.filter(trade => trade.pnl > 0).length;
    const winRate = totalTrades > 0 ? Math.round((winningTrades / totalTrades) * 100) : 0;
    const totalPnl = filteredTrades.reduce((sum, trade) => sum + trade.pnl, 0);
    
    return { totalTrades, winRate, totalPnl };
  }, [filteredTrades]);
  
  const handleAddTradeClick = () => {
    navigate('/trade-form');
  };
  
  const handleExportClick = () => {
    toast.success("Exporting trades...", {
      description: "Your trades will be downloaded as a CSV file."
    });
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
    toast.info("Date filter cleared");
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    toast.info(`Sorted by ${option.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  const renderTradeTable = (trades: any[]) => (
    <div className="rounded-md border backdrop-blur-sm bg-card/30">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>P&L</TableHead>
            <TableHead>Strategy</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id} className="hover:bg-muted/40 transition-colors">
              <TableCell className="font-mono text-xs">{trade.date}</TableCell>
              <TableCell className="font-medium">{trade.symbol}</TableCell>
              <TableCell>
                <Badge variant={trade.type === 'long' ? 'default' : 'secondary'} className="bg-opacity-20">
                  <span className="flex items-center gap-1">
                    {trade.type === 'long' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {trade.type}
                  </span>
                </Badge>
              </TableCell>
              <TableCell>
                <div className="font-mono flex items-center">
                  <IndianRupee className="h-3 w-3 mr-0.5" />
                  {trade.entryPrice}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-mono flex items-center">
                  <IndianRupee className="h-3 w-3 mr-0.5" />
                  {trade.exitPrice}
                </div>
              </TableCell>
              <TableCell className="font-mono">
                {trade.quantity}
              </TableCell>
              <TableCell>
                <div className={cn(
                  "font-mono flex items-center",
                  trade.pnl >= 0 ? "text-success" : "text-destructive"
                )}>
                  {trade.pnl >= 0 ? '+' : ''}<IndianRupee className="h-3 w-3 mr-0.5" />{trade.pnl.toFixed(2)}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-muted/30">{trade.strategy || 'N/A'}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setSelectedTrade(trade)}
                        className="h-8 w-8 rounded-full hover:bg-primary/10"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Badge variant={selectedTrade?.type === 'long' ? 'default' : 'secondary'} className="mr-2">
                            {selectedTrade?.type === 'long' ? 'LONG' : 'SHORT'}
                          </Badge> 
                          {selectedTrade?.symbol}
                        </DialogTitle>
                        <DialogDescription>
                          {selectedTrade && `Trade executed on ${selectedTrade.date}`}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTrade && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Card className="border-primary/10 bg-gradient-to-br from-card to-muted/30">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-semibold text-primary mb-2">Entry Details</h4>
                                <div className="text-sm mt-1 space-y-2">
                                  <p className="flex items-center">Price: <span className="font-mono ml-1 flex items-center"><IndianRupee className="h-3 w-3 mx-0.5" />{selectedTrade.entryPrice}</span></p>
                                  <p>Quantity: <span className="font-mono ml-1">{selectedTrade.quantity}</span></p>
                                  <p>Date: <span className="font-mono ml-1">{selectedTrade.date}</span></p>
                                </div>
                              </CardContent>
                            </Card>
                            <Card className="border-primary/10 bg-gradient-to-br from-card to-muted/30">
                              <CardContent className="p-4">
                                <h4 className="text-sm font-semibold text-primary mb-2">Exit Details</h4>
                                <div className="text-sm mt-1 space-y-2">
                                  <p className="flex items-center">Price: <span className="font-mono ml-1 flex items-center"><IndianRupee className="h-3 w-3 mx-0.5" />{selectedTrade.exitPrice}</span></p>
                                  <p className="flex items-center">P&L: <span className={selectedTrade.pnl >= 0 ? "text-success flex items-center font-mono ml-1" : "text-destructive flex items-center font-mono ml-1"}>
                                    {selectedTrade.pnl >= 0 ? '+' : ''}<IndianRupee className="h-3 w-3 mx-0.5" />{selectedTrade.pnl.toFixed(2)}
                                  </span></p>
                                  <p>Strategy: <Badge variant="outline" className="ml-1">{selectedTrade.strategy}</Badge></p>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <Card className="border-primary/10">
                            <CardContent className="p-4">
                              <h4 className="text-sm font-semibold text-primary mb-2">Trade Analysis</h4>
                              <p className="text-sm text-muted-foreground">
                                This was a {selectedTrade.type} trade based on a {selectedTrade.strategy} strategy.
                                The trade was executed on {selectedTrade.segment}.
                              </p>
                            </CardContent>
                          </Card>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="border rounded-md p-4 bg-card/50">
                              <h5 className="text-xs font-medium mb-2 text-primary">Entry Chart</h5>
                              <div className="bg-muted/30 w-full h-32 flex items-center justify-center rounded-md">
                                <ExternalLink className="h-8 w-8 text-muted-foreground opacity-20" />
                              </div>
                            </div>
                            <div className="border rounded-md p-4 bg-card/50">
                              <h5 className="text-xs font-medium mb-2 text-primary">Exit Chart</h5>
                              <div className="bg-muted/30 w-full h-32 flex items-center justify-center rounded-md">
                                <ExternalLink className="h-8 w-8 text-muted-foreground opacity-20" />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10" onClick={() => toast.info("Edit functionality coming soon")}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => toast.info("Delete functionality coming soon")}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderTradeGrid = (trades: any[]) => (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {trades.map((trade) => (
        <motion.div key={trade.id} variants={itemVariants}>
          <Card className="overflow-hidden border-border/40 hover:shadow-md transition-shadow cursor-pointer">
            <div className={cn(
              "h-1.5 w-full",
              trade.pnl >= 0 ? "bg-success/70" : "bg-destructive/70"
            )}></div>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{trade.symbol}</h3>
                  <p className="text-xs text-muted-foreground">{trade.date}</p>
                </div>
                <Badge variant={trade.type === 'long' ? 'default' : 'secondary'} className="bg-opacity-20">
                  <span className="flex items-center gap-1">
                    {trade.type === 'long' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {trade.type}
                  </span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-muted/30 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Entry</p>
                  <p className="font-mono flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{trade.entryPrice}</p>
                </div>
                <div className="bg-muted/30 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Exit</p>
                  <p className="font-mono flex items-center"><IndianRupee className="h-3 w-3 mr-0.5" />{trade.exitPrice}</p>
                </div>
                <div className="bg-muted/30 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-mono">{trade.quantity}</p>
                </div>
                <div className="bg-muted/30 p-2 rounded">
                  <p className="text-xs text-muted-foreground">P&L</p>
                  <p className={cn(
                    "font-mono flex items-center",
                    trade.pnl >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {trade.pnl >= 0 ? '+' : ''}<IndianRupee className="h-3 w-3 mr-0.5" />{trade.pnl.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="bg-muted/30">{trade.strategy || 'N/A'}</Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10" onClick={() => setSelectedTrade(trade)}>
                    <EyeIcon className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary/10" onClick={() => toast.info("Edit functionality coming soon")}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => toast.info("Delete functionality coming soon")}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
  
  const renderEmptyState = (type: FilterStatus) => {
    let icon = <Search className="h-6 w-6 text-muted-foreground/60" />;
    let title = "No trades found";
    let description = "Try adjusting your filters or search query";
    let bgColor = "bg-muted/30";
    
    if (type === 'profit') {
      icon = <Search className="h-6 w-6 text-success/40" />;
      title = "No profitable trades found";
      bgColor = "bg-success/10";
    } else if (type === 'loss') {
      icon = <Search className="h-6 w-6 text-destructive/40" />;
      title = "No loss-making trades found";
      bgColor = "bg-destructive/10";
    }
    
    return (
      <Card className="p-12 flex flex-col items-center justify-center border border-dashed border-muted-foreground/20">
        <div className={`${bgColor} p-4 rounded-full mb-4`}>
          {icon}
        </div>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
        {selectedDate && (
          <Button variant="ghost" size="sm" className="mt-4" onClick={clearDateFilter}>
            Clear date filter
          </Button>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)} className="w-full">
        <Card className="border border-border/40 shadow-sm p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-xs md:text-sm">All Trades</TabsTrigger>
              <TabsTrigger value="profit" className="text-xs md:text-sm">Profitable</TabsTrigger>
              <TabsTrigger value="loss" className="text-xs md:text-sm">Loss-making</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={handleExportClick} className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Export</span>
              </Button>
              <Button variant="outline" size="icon" className="w-8 h-8" onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}>
                {viewMode === 'list' ? <LayoutGrid className="h-4 w-4" /> : <BarChart3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trades..."
                className="pl-8 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
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
              
              <Button variant="outline" size="icon" className="w-9 h-9">
                <Filter className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="w-9 h-9">
                    <SortAsc className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-sm">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleSortChange('newest')} className={cn(sortOption === 'newest' && "bg-primary/10")}>
                    Date (Newest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('oldest')} className={cn(sortOption === 'oldest' && "bg-primary/10")}>
                    Date (Oldest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('highestPnl')} className={cn(sortOption === 'highestPnl' && "bg-primary/10")}>
                    P&L (Highest)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange('lowestPnl')} className={cn(sortOption === 'lowestPnl' && "bg-primary/10")}>
                    P&L (Lowest)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleAddTradeClick} size="sm" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                <PlusCircle className="mr-1 h-4 w-4" />
                Add Trade
              </Button>
            </div>
          </div>
        </Card>

        <TabsContent value="all" className="mt-4">
          <div className="hidden md:flex items-center gap-2 mb-4">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/20 border-primary/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Total Trades</span>
              <span className="text-xl font-semibold">{tradeStats.totalTrades}</span>
            </Card>
            <Card className="bg-gradient-to-r from-success/5 to-success/20 border-success/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Win Rate</span>
              <span className="text-xl font-semibold text-success">{tradeStats.winRate}%</span>
            </Card>
            <Card className="bg-gradient-to-r from-info/5 to-info/20 border-info/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">P&L</span>
              <span className="text-xl font-semibold">₹{tradeStats.totalPnl.toFixed(2)}</span>
            </Card>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:hidden mb-4">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/20 border-primary/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Total Trades</span>
              <span className="text-xl font-semibold">{tradeStats.totalTrades}</span>
            </Card>
            <Card className="bg-gradient-to-r from-success/5 to-success/20 border-success/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Win Rate</span>
              <span className="text-xl font-semibold text-success">{tradeStats.winRate}%</span>
            </Card>
            <Card className="bg-gradient-to-r from-info/5 to-info/20 border-info/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">P&L</span>
              <span className="text-xl font-semibold">₹{tradeStats.totalPnl.toFixed(2)}</span>
            </Card>
            <Card className="bg-gradient-to-r from-warning/5 to-warning/20 border-warning/10 p-3 flex flex-col items-center">
              <span className="text-xs text-muted-foreground">Last Trade</span>
              <span className="text-xl font-semibold">Today</span>
            </Card>
          </div>

          {sortedTrades.length > 0 ? (
            viewMode === 'list' ? renderTradeTable(sortedTrades) : renderTradeGrid(sortedTrades)
          ) : renderEmptyState('all')}
        </TabsContent>
        
        <TabsContent value="profit" className="mt-4">
          {sortedTrades.length > 0 ? (
            viewMode === 'list' ? renderTradeTable(sortedTrades) : renderTradeGrid(sortedTrades)
          ) : renderEmptyState('profit')}
        </TabsContent>
        
        <TabsContent value="loss" className="mt-4">
          {sortedTrades.length > 0 ? (
            viewMode === 'list' ? renderTradeTable(sortedTrades) : renderTradeGrid(sortedTrades)
          ) : renderEmptyState('loss')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradesList;
