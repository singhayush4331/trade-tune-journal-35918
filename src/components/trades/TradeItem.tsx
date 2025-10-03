import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Edit, Trash, Image } from 'lucide-react';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

interface TradeItemProps {
  trade: {
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
  };
  onTradeClick: (tradeId: string) => void;
  onEditClick: (tradeId: string, e: React.MouseEvent) => void;
  onDeleteClick: (tradeId: string, e: React.MouseEvent) => void;
}

const TradeItem = React.memo(({ 
  trade, 
  onTradeClick, 
  onEditClick, 
  onDeleteClick 
}: TradeItemProps) => {
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  // Ensure pnl is a valid number
  const pnl = typeof trade.pnl === 'number' && !isNaN(trade.pnl) ? trade.pnl : 0;
  const hasScreenshots = trade.screenshots && trade.screenshots.length > 0;
  
  // Get correct price values - checking both naming conventions
  const entry_price = trade.entry_price !== undefined ? trade.entry_price : 0;
  const exit_price = trade.exit_price !== undefined ? trade.exit_price : 0;
  const entryPrice = trade.entryPrice !== undefined ? trade.entryPrice : entry_price;
  
  return (
    <Card 
      className={cn(
        "border-border/30 shadow-sm hover:shadow-md transition-all cursor-pointer",
        "bg-gradient-to-r from-card/80 to-card",
        pnl > 0 ? "border-l-4 border-l-emerald-500/40" : "border-l-4 border-l-rose-500/40"
      )}
      onClick={() => onTradeClick(trade.id)}
    >
      <CardContent className="p-3 sm:p-4">
        {!isXSmall ? (
          // Desktop/Tablet Layout
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                pnl > 0 ? "bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : 
                        "bg-rose-100/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
              )}>
                {pnl > 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-base">{trade.symbol}</div>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs px-2 py-0 h-5", 
                      trade.type === 'long' ? 
                        "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-300/50 dark:border-emerald-800/30" : 
                        "bg-rose-100/50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-300/50 dark:border-rose-800/30"
                    )}
                  >
                    {trade.type}
                  </Badge>
                  {hasScreenshots && (
                    <div className="text-muted-foreground" title="Has screenshots">
                      <Image className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(trade.date), 'dd MMM yyyy, hh:mm a')}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className={cn(
                  "font-bold",
                  pnl > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
                )}>
                  {formatIndianCurrency(pnl)}
                </div>
                <div className="flex text-xs text-muted-foreground mt-0.5 justify-end gap-2">
                  <span>{trade.quantity || 0} × ₹{entryPrice}</span>
                </div>
              </div>
              
              <div className="flex ml-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={(e) => onEditClick(trade.id, e)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-rose-500/10 hover:text-rose-500" 
                  onClick={(e) => onDeleteClick(trade.id, e)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Mobile Layout
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  pnl > 0 ? "bg-emerald-100/50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : 
                          "bg-rose-100/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"
                )}>
                  {pnl > 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">{trade.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(trade.date), 'dd MMM, hh:mm a')}
                  </div>
                </div>
              </div>
              
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs px-2 py-0 h-5", 
                  trade.type === 'long' ? 
                    "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-300/50 dark:border-emerald-800/30" : 
                    "bg-rose-100/50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-300/50 dark:border-rose-800/30"
                )}
              >
                {trade.type}
              </Badge>
            </div>
            
            <div className="flex justify-between items-end mt-1">
              <div>
                <div className="text-xs text-muted-foreground">Qty × Price</div>
                <div className="text-xs">{trade.quantity || 0} × ₹{entryPrice}</div>
              </div>
              
              <div className={cn(
                "font-bold text-base",
                pnl > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-rose-600 dark:text-rose-500"
              )}>
                {formatIndianCurrency(pnl)}
              </div>
              
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-primary/10"
                  onClick={(e) => onEditClick(trade.id, e)}
                >
                  <Edit className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-full hover:bg-rose-500/10 hover:text-rose-500" 
                  onClick={(e) => onDeleteClick(trade.id, e)}
                >
                  <Trash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            
            {hasScreenshots && (
              <div className="text-muted-foreground flex items-center text-xs mt-2">
                <Image className="h-3 w-3 mr-1" />
                <span>Has screenshots</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TradeItem.displayName = "TradeItem";

export default TradeItem;
