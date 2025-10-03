
import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  IndianRupee, 
  ArrowUp, 
  ArrowDown, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Timer,
  Layers,
  LineChart,
  FileText,
  ImageIcon,
  Clock,
  Gauge,
  Tag
} from 'lucide-react';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import TradeScreenshotsGallery from './TradeScreenshotsGallery';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

type ScreenshotType = 'entry' | 'exit';

interface TradeDetailSheetProps {
  trade: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TradeDetailSheet: React.FC<TradeDetailSheetProps> = ({
  trade,
  open,
  onOpenChange
}) => {
  const isMobile = useIsMobile();

  // Handle screenshots for the trade
  const tradeScreenshots = [];
  
  if (trade.entryScreenshot) {
    tradeScreenshots.push({
      id: `${trade.id}-entry`,
      url: trade.entryScreenshot,
      type: 'entry' as ScreenshotType,
      timestamp: new Date(trade.updatedAt || trade.createdAt)
    });
  } else if (trade.screenshots && Array.isArray(trade.screenshots) && trade.screenshots.length > 0) {
    tradeScreenshots.push({
      id: `${trade.id}-entry-legacy`,
      url: trade.screenshots[0],
      type: 'entry' as ScreenshotType,
      timestamp: new Date(trade.updatedAt || trade.createdAt)
    });
  }
  
  if (trade.exitScreenshot) {
    tradeScreenshots.push({
      id: `${trade.id}-exit`,
      url: trade.exitScreenshot,
      type: 'exit' as ScreenshotType,
      timestamp: new Date(trade.updatedAt || trade.createdAt)
    });
  } else if (trade.screenshots && Array.isArray(trade.screenshots) && trade.screenshots.length > 1) {
    tradeScreenshots.push({
      id: `${trade.id}-exit-legacy`,
      url: trade.screenshots[1],
      type: 'exit' as ScreenshotType,
      timestamp: new Date(trade.updatedAt || trade.createdAt)
    });
  }
  
  // Get correct price values - checking both naming conventions
  const entry_price = trade.entry_price !== undefined ? trade.entry_price : 0;
  const exit_price = trade.exit_price !== undefined ? trade.exit_price : 0;
  const entryPrice = trade.entryPrice !== undefined ? trade.entryPrice : entry_price;
  const exitPrice = trade.exitPrice !== undefined ? trade.exitPrice : exit_price;
  
  // Ensure we have valid numbers
  const safePnl = typeof trade.pnl === 'number' && !isNaN(trade.pnl) ? trade.pnl : 0;
  const safeEntryPrice = typeof entryPrice === 'number' && !isNaN(entryPrice) ? entryPrice : 0;
  const safeExitPrice = typeof exitPrice === 'number' && !isNaN(exitPrice) ? exitPrice : 0;
  const safeQuantity = trade.quantity || 0;
  
  // Calculate percentage change
  const profitPercentage = (safeEntryPrice > 0 && safeExitPrice > 0) 
    ? ((safeExitPrice - safeEntryPrice) / safeEntryPrice * 100 * (trade.type === 'long' ? 1 : -1)).toFixed(2)
    : '0.00';

  // Convert profitPercentage to number for comparison
  const numericProfitPercentage = parseFloat(profitPercentage);
  
  // Format dates
  const tradeDate = format(new Date(trade.date), 'dd MMM yyyy');
  const tradeTime = format(new Date(trade.date), 'hh:mm a');
  
  const tradeType = trade.type ? trade.type.toUpperCase() : 'N/A';
  const hasNotes = trade.notes && trade.notes.trim().length > 0;
  
  // Calculate trade duration if entry_time and exit_time exist
  let tradeDuration = null;
  if (trade.entry_time && trade.exit_time) {
    const entryTime = new Date(trade.entry_time).getTime();
    const exitTime = new Date(trade.exit_time).getTime();
    const durationMs = exitTime - entryTime;
    
    if (durationMs > 0) {
      const minutes = Math.floor(durationMs / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      
      if (hours > 0) {
        tradeDuration = `${hours}h ${remainingMinutes}m`;
      } else {
        tradeDuration = `${minutes}m`;
      }
    }
  }

  // Calculate position value and profit/loss amount
  const positionValue = safeEntryPrice * safeQuantity;
  const profitLossAmount = safePnl;
  
  // Determine sentiment based on PnL
  const isProfitable = safePnl > 0;
  
  // Helper function for formatting large numbers
  const formatLargeNumber = (num: number) => {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(2) + ' Cr';
    } else if (num >= 100000) {
      return (num / 100000).toFixed(2) + ' L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  // Mobile layout (Drawer)
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[92vh] overflow-hidden">
          <div className="mx-auto w-full max-w-md">
            {/* Header with gradient */}
            <div 
              className={cn(
                "px-4 pt-6 pb-2 text-center bg-gradient-to-b",
                isProfitable
                  ? "from-emerald-500/30 via-emerald-500/5 to-transparent"
                  : "from-rose-500/30 via-rose-500/5 to-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-2">
                <Badge 
                  variant={trade.type === 'long' ? 'default' : 'secondary'} 
                  className={cn(
                    "px-2.5 py-0.5 text-xs font-medium",
                    trade.type === 'long' 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  )}
                >
                  {trade.type === 'long' ? 
                    <ArrowUp className="h-3 w-3 mr-1" /> : 
                    <ArrowDown className="h-3 w-3 mr-1" />
                  }
                  {tradeType}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {tradeDate}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <DrawerTitle className="text-2xl font-bold">
                  {trade.symbol}
                </DrawerTitle>
                {trade.segment && (
                  <span className="text-sm font-medium text-muted-foreground opacity-70">
                    {trade.segment}
                  </span>
                )}
              </div>
              
              {tradeDuration && (
                <div className="flex items-center justify-center text-xs text-muted-foreground mt-1">
                  <Timer className="h-3 w-3 mr-1" /> 
                  Duration: {tradeDuration}
                </div>
              )}
              
              {/* PnL Floating Card */}
              <div className="relative -mb-7 mt-3 z-10">
                <Card className={cn(
                  "w-4/5 mx-auto border-0 shadow-lg",
                  isProfitable
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                    : "bg-gradient-to-r from-rose-500 to-rose-600 text-white"
                )}>
                  <CardContent className="p-3 flex flex-col items-center gap-1">
                    <p className="text-xs font-medium opacity-90">P&L RESULT</p>
                    <div className="text-2xl font-bold flex items-center">
                      <span>{isProfitable ? '+' : ''}</span>
                      <IndianRupee className="h-5 w-5 mx-0.5 opacity-90" />
                      <span>{formatIndianCurrency(Math.abs(safePnl))}</span>
                    </div>
                    <div className="text-sm">
                      {isProfitable ? '+' : ''}{profitPercentage}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Content area with unified design */}
            <div className="mt-7 px-4 pt-4 overflow-auto h-[calc(100vh-250px)]">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Trade Summary Section */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <Card className="bg-card/70 border-border/30">
                    <CardContent className="p-3">
                      <div className="flex items-center mb-1">
                        <Tag className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                        <span className="text-xs text-muted-foreground">Position</span>
                      </div>
                      <p className="text-base font-semibold">{safeQuantity} shares</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/70 border-border/30">
                    <CardContent className="p-3">
                      <div className="flex items-center mb-1">
                        <IndianRupee className="h-3.5 w-3.5 text-muted-foreground mr-1.5" />
                        <span className="text-xs text-muted-foreground">Value</span>
                      </div>
                      <p className="text-base font-semibold">₹{formatLargeNumber(positionValue)}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Price Movement Card */}
                <Card className="mb-5 border-border/30 overflow-hidden">
                  <div className="bg-muted/30 px-3 py-2 border-b border-border/20 flex items-center">
                    <LineChart className="h-3.5 w-3.5 text-primary mr-1.5" />
                    <h3 className="text-sm font-medium">Trade Movement</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-4">
                      {/* Entry/Exit Section */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className={cn(
                          "rounded-lg p-3 border",
                          isProfitable 
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30" 
                            : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/30"
                        )}>
                          <div className="text-xs text-muted-foreground mb-1">Entry Price</div>
                          <div className="text-lg font-mono font-medium">₹{safeEntryPrice.toLocaleString('en-IN')}</div>
                          {trade.entry_time && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(trade.entry_time), 'hh:mm a')}
                            </div>
                          )}
                        </div>
                        
                        <div className={cn(
                          "rounded-lg p-3 border",
                          isProfitable 
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30" 
                            : "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-800/30"
                        )}>
                          <div className="text-xs text-muted-foreground mb-1">Exit Price</div>
                          <div className="text-lg font-mono font-medium">₹{safeExitPrice.toLocaleString('en-IN')}</div>
                          {trade.exit_time && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {format(new Date(trade.exit_time), 'hh:mm a')}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Profit/Loss Indicator */}
                      <div>
                        <div className="flex justify-between mb-1 text-xs">
                          <span>Entry</span>
                          <span>Exit</span>
                        </div>
                        <div className="relative h-2">
                          <Progress 
                            value={100} 
                            className={cn(
                              "h-2 rounded-full",
                              isProfitable ? "bg-emerald-200/50" : "bg-rose-200/50"
                            )}
                            indicatorClassName={cn(
                              "rounded-full",
                              isProfitable ? "bg-emerald-500" : "bg-rose-500"
                            )}
                          />
                          <div className={cn(
                            "absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-white text-xs -mt-5",
                            isProfitable ? "bg-emerald-500" : "bg-rose-500"
                          )}>
                            {isProfitable ? '+' : ''}{profitPercentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Notes Section (if available) */}
                {hasNotes && (
                  <Card className="mb-5 border-border/30">
                    <div className="bg-muted/30 px-3 py-2 border-b border-border/20 flex items-center">
                      <FileText className="h-3.5 w-3.5 text-primary mr-1.5" />
                      <h3 className="text-sm font-medium">Trade Notes</h3>
                    </div>
                    <CardContent className="p-4">
                      <div className="bg-muted/10 p-3 rounded-md border border-border/20 text-sm">
                        <p className="whitespace-pre-line">{trade.notes}</p>
                      </div>
                      
                      {trade.mood && (
                        <div className="mt-3 pt-3 border-t border-border/20">
                          <div className="text-xs text-muted-foreground mb-1.5 flex items-center">
                            <Gauge className="h-3.5 w-3.5 mr-1.5" />
                            TRADING MOOD
                          </div>
                          <div className="bg-muted/10 p-2 rounded-md border border-border/20 text-sm">
                            {trade.mood}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Screenshots Section (if available) */}
                {tradeScreenshots.length > 0 && (
                  <Card className="mb-5 border-border/30">
                    <div className="bg-muted/30 px-3 py-2 border-b border-border/20 flex items-center">
                      <ImageIcon className="h-3.5 w-3.5 text-primary mr-1.5" />
                      <h3 className="text-sm font-medium">Trade Screenshots</h3>
                    </div>
                    <CardContent className="p-4">
                      <TradeScreenshotsGallery screenshots={tradeScreenshots} size="larger" />
                    </CardContent>
                  </Card>
                )}
                
                {/* Additional Details */}
                <Card className="mb-5 border-border/30">
                  <div className="bg-muted/30 px-3 py-2 border-b border-border/20 flex items-center">
                    <Layers className="h-3.5 w-3.5 text-primary mr-1.5" />
                    <h3 className="text-sm font-medium">Trade Details</h3>
                  </div>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      {trade.strategy && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Strategy</p>
                          <p className="font-medium">{trade.strategy}</p>
                        </div>
                      )}
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Date</p>
                        <p className="font-medium">{tradeDate}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Time</p>
                        <p className="font-medium">{tradeTime}</p>
                      </div>
                      
                      {tradeDuration && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Duration</p>
                          <p className="font-medium">{tradeDuration}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            
            {/* Footer Actions */}
            <div className="px-4 py-3 border-t border-border/30">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop layout (Sheet)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-xl p-0 overflow-hidden border-l border-border/30">
        {/* Header section */}
        <div className={cn(
          "px-6 py-6 border-b border-border/20 bg-gradient-to-br",
          isProfitable
            ? "from-emerald-500/10 via-emerald-500/5 to-transparent"
            : "from-rose-500/10 via-rose-500/5 to-transparent"
        )}>
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-14 w-14 rounded-full flex items-center justify-center border-2",
              isProfitable 
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400"
            )}>
              {isProfitable ? (
                <TrendingUp className="h-7 w-7" />
              ) : (
                <TrendingDown className="h-7 w-7" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Badge 
                  variant={trade.type === 'long' ? 'default' : 'secondary'} 
                  className={cn(
                    "px-2.5 py-0.5 text-xs font-medium",
                    trade.type === 'long' 
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
                      : "bg-rose-500 hover:bg-rose-600 text-white"
                  )}
                >
                  {trade.type === 'long' ? 
                    <ArrowUp className="h-3 w-3 mr-1" /> : 
                    <ArrowDown className="h-3 w-3 mr-1" />
                  }
                  {tradeType}
                </Badge>
                {trade.strategy && (
                  <Badge variant="outline" className="px-2 py-0.5 text-xs bg-transparent">
                    {trade.strategy}
                  </Badge>
                )}
              </div>
              
              <SheetTitle className="text-2xl font-bold mt-1.5 flex items-baseline gap-2">
                {trade.symbol}
                {trade.segment && (
                  <span className="text-sm font-medium text-muted-foreground">
                    {trade.segment}
                  </span>
                )}
              </SheetTitle>
              
              <SheetDescription className="flex items-center gap-3 mt-1">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 opacity-70" />
                  {tradeDate}
                </div>
                {tradeDuration && (
                  <div className="flex items-center">
                    <Timer className="h-3.5 w-3.5 mr-1 opacity-70" />
                    {tradeDuration}
                  </div>
                )}
              </SheetDescription>
            </div>
          </div>
        </div>
        
        {/* Main content with scrolling */}
        <div className="overflow-y-auto h-[calc(100vh-200px)] px-6 py-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* PnL Summary */}
            <Card className={cn(
              "border-0 shadow-md overflow-hidden",
              isProfitable
                ? "bg-gradient-to-r from-emerald-500/90 to-emerald-600/90 text-white"
                : "bg-gradient-to-r from-rose-500/90 to-rose-600/90 text-white"
            )}>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90 uppercase tracking-wide">Profit & Loss</p>
                  <div className="text-3xl font-bold mt-1 flex items-center">
                    <span>{isProfitable ? '+' : ''}</span>
                    <IndianRupee className="h-6 w-6 mx-0.5 opacity-90" />
                    <span>{formatIndianCurrency(Math.abs(safePnl))}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium opacity-90 uppercase tracking-wide">Return</p>
                  <p className="text-3xl font-bold mt-1">{isProfitable ? '+' : ''}{profitPercentage}%</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Trade Details Grid */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border border-border/30 bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center mb-1.5 text-muted-foreground">
                    <Tag className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Position Size</span>
                  </div>
                  <p className="text-lg font-semibold">{safeQuantity} shares</p>
                </CardContent>
              </Card>
              
              <Card className="border border-border/30 bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center mb-1.5 text-muted-foreground">
                    <IndianRupee className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Position Value</span>
                  </div>
                  <p className="text-lg font-semibold">₹{positionValue.toLocaleString('en-IN')}</p>
                </CardContent>
              </Card>
              
              <Card className="border border-border/30 bg-card/60">
                <CardContent className="p-4">
                  <div className="flex items-center mb-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1.5" />
                    <span className="text-sm">Trading Time</span>
                  </div>
                  <p className="text-lg font-semibold">{tradeTime}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Price Movement Visualization */}
            <div className={cn(
              "relative p-6 rounded-xl border",
              isProfitable 
                ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200/50 dark:border-emerald-900/20" 
                : "bg-rose-50/30 dark:bg-rose-950/10 border-rose-200/50 dark:border-rose-900/20"
            )}>
              <h3 className="text-base font-medium mb-4 flex items-center">
                <LineChart className="h-4 w-4 mr-2 text-primary" />
                Price Movement
              </h3>
              
              <div className="flex justify-between items-start mb-8">
                <div className="text-center px-4 py-3 bg-card/60 rounded-lg border border-border/30 shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">Entry Price</p>
                  <p className="text-xl font-mono font-semibold">₹{safeEntryPrice.toLocaleString('en-IN')}</p>
                  {trade.entry_time && (
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(trade.entry_time), 'hh:mm a')}
                    </p>
                  )}
                </div>
                
                <div className={cn(
                  "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-white text-sm font-medium shadow-md",
                  isProfitable ? "bg-emerald-500" : "bg-rose-500"
                )}>
                  {isProfitable ? '+' : ''}{profitPercentage}%
                </div>
                
                <div className="text-center px-4 py-3 bg-card/60 rounded-lg border border-border/30 shadow-sm">
                  <p className="text-sm text-muted-foreground mb-1">Exit Price</p>
                  <p className="text-xl font-mono font-semibold">₹{safeExitPrice.toLocaleString('en-IN')}</p>
                  {trade.exit_time && (
                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(trade.exit_time), 'hh:mm a')}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="relative mt-6 mb-2">
                <div className="h-2 bg-card/60 rounded-full relative overflow-hidden border border-border/20">
                  <div 
                    className={cn(
                      "absolute h-full left-0 top-0 rounded-full",
                      isProfitable ? "bg-emerald-500" : "bg-rose-500"
                    )}
                    style={{ width: '100%' }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <div>Entry</div>
                  <div>Exit</div>
                </div>
              </div>
            </div>
            
            {/* Notes and Screenshots in a single card */}
            {(hasNotes || tradeScreenshots.length > 0) && (
              <Card className="border border-border/30 overflow-hidden">
                <div className="bg-muted/20 px-4 py-3 border-b border-border/20">
                  <h3 className="text-base font-medium">Trade Analysis</h3>
                </div>
                
                <CardContent className="p-6">
                  {/* Notes Section */}
                  {hasNotes && (
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <FileText className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="text-sm font-medium">Trade Notes</h4>
                      </div>
                      <div className="bg-muted/10 p-4 rounded-lg border border-border/20">
                        <p className="text-sm whitespace-pre-line leading-relaxed">{trade.notes}</p>
                      </div>
                      
                      {trade.mood && (
                        <div className="mt-4 pt-4 border-t border-border/20">
                          <div className="flex items-center mb-2">
                            <Gauge className="h-4 w-4 mr-2 text-primary" />
                            <h4 className="text-sm font-medium">Trading Mood</h4>
                          </div>
                          <div className="bg-muted/10 p-3 rounded-lg border border-border/20 text-sm">
                            {trade.mood}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Separator if both notes and screenshots exist */}
                  {hasNotes && tradeScreenshots.length > 0 && (
                    <Separator className="my-6" />
                  )}
                  
                  {/* Screenshots Section */}
                  {tradeScreenshots.length > 0 && (
                    <div>
                      <div className="flex items-center mb-3">
                        <ImageIcon className="h-4 w-4 mr-2 text-primary" />
                        <h4 className="text-sm font-medium">Trade Screenshots</h4>
                      </div>
                      <TradeScreenshotsGallery screenshots={tradeScreenshots} size="larger" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Additional details */}
            <Card className="border border-border/30">
              <div className="bg-muted/20 px-4 py-3 border-b border-border/20">
                <h3 className="text-base font-medium">Additional Details</h3>
              </div>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                  {trade.strategy && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Strategy</p>
                      <p className="text-base font-medium">{trade.strategy}</p>
                    </div>
                  )}
                  
                  {trade.date && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Trade Date</p>
                      <p className="text-base font-medium">{tradeDate}</p>
                    </div>
                  )}
                  
                  {tradeDuration && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Duration</p>
                      <p className="text-base font-medium">{tradeDuration}</p>
                    </div>
                  )}
                  
                  {trade.entry_time && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Entry Time</p>
                      <p className="text-base font-medium">{format(new Date(trade.entry_time), 'hh:mm a')}</p>
                    </div>
                  )}
                  
                  {trade.exit_time && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Exit Time</p>
                      <p className="text-base font-medium">{format(new Date(trade.exit_time), 'hh:mm a')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-border/30 mt-auto">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TradeDetailSheet;
