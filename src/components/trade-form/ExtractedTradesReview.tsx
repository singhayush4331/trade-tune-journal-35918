import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, X, TrendingUp, TrendingDown, ArrowRight, Clock, Target, Zap } from 'lucide-react';
import { formatCurrency } from '@/utils/trade-form-utils';
import { motion } from 'framer-motion';

interface ExtractedTrade {
  symbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  type: 'long' | 'short';
  entryTime: string;
  exitTime: string;
  pnl: number;
  confidence: number;
}

interface ExtractedTradesReviewProps {
  trades: ExtractedTrade[];
  onAcceptTrade: (index: number) => void;
  onRejectTrade: (index: number) => void;
  onUnacceptTrade: (index: number) => void;
  onUnrejectTrade: (index: number) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onProcessAll: () => void;
  tradeStates?: Record<number, { status: 'pending' | 'accepted' | 'rejected'; isVisible: boolean }>;
}

export const ExtractedTradesReview: React.FC<ExtractedTradesReviewProps> = ({
  trades,
  onAcceptTrade,
  onRejectTrade,
  onUnacceptTrade,
  onUnrejectTrade,
  onAcceptAll,
  onRejectAll,
  onProcessAll,
  tradeStates = {}
}) => {

  return (
    <div className="space-y-4">
      {/* Modern Command Bar Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-sm" />
        <div className="relative bg-gradient-to-r from-card/95 via-card/98 to-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-lg shadow-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 animate-pulse" />
                <h3 className="text-lg font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                  Trading Analysis
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                  <Zap className="h-3 w-3 text-primary" />
                  <span className="text-xs font-semibold text-primary">{trades.length} Trades</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-muted/50 border border-border/50 rounded-full">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">AI Extracted</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRejectAll} 
                className="rounded-full border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-200"
              >
                <X className="h-3 w-3 mr-1" />
                Reject All
              </Button>
              <Button 
                size="sm" 
                onClick={onAcceptAll} 
                className="rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
              >
                <Check className="h-3 w-3 mr-1" />
                Accept All
              </Button>
              <Button 
                size="sm" 
                onClick={onProcessAll}
                className="rounded-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white shadow-lg shadow-success/20"
              >
                <ArrowRight className="h-3 w-3 mr-1" />
                Process
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Horizontal Timeline Layout */}
      <div className="space-y-3">
        {trades.map((trade, index) => {
          const tradeStatus = tradeStates[index]?.status || 'pending';
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
              className="group"
            >
              <div className={`relative overflow-hidden rounded-2xl border transition-all duration-500 hover:scale-[1.02] ${
                tradeStatus === 'accepted' 
                  ? 'bg-gradient-to-r from-success/5 via-success/8 to-success/5 border-success/30 shadow-lg shadow-success/10' 
                  : tradeStatus === 'rejected'
                  ? 'bg-gradient-to-r from-destructive/5 via-destructive/8 to-destructive/5 border-destructive/30 shadow-lg shadow-destructive/10'
                  : 'bg-gradient-to-r from-card/95 via-card/98 to-card/95 border-primary/20 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10'
              }`}>
                {/* Status Border */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                  tradeStatus === 'accepted' ? 'bg-gradient-to-b from-success to-success/60' :
                  tradeStatus === 'rejected' ? 'bg-gradient-to-b from-destructive to-destructive/60' :
                  'bg-gradient-to-b from-primary to-primary/60'
                }`} />
                
                <div className="p-5">
                  {/* Header with Symbol */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                        {trade.symbol}
                      </h3>
                      <Badge 
                        variant={trade.type === 'long' ? 'default' : 'secondary'}
                        className="rounded-full px-3 py-1 text-xs font-semibold"
                      >
                        {trade.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Horizontal Timeline Flow */}
                  <div className="flex items-center gap-4 mb-4">
                    {/* Entry Point */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-success/20 to-success/10 rounded-xl blur-sm" />
                        <div className="relative bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-4 hover:from-success/15 hover:to-success/8 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-success to-success/80 flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-success">Entry Point</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {trade.entryTime}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-success">{formatCurrency(trade.entryPrice)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Flow Arrow */}
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-px bg-gradient-to-r from-primary/50 to-primary/30" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                      <div className="w-12 h-px bg-gradient-to-r from-primary/30 to-primary/50" />
                    </div>

                    {/* Exit Point */}
                    <div className="flex-1">
                      <div className="relative">
                        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-destructive/20 to-destructive/10 rounded-xl blur-sm" />
                        <div className="relative bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 rounded-xl p-4 hover:from-destructive/15 hover:to-destructive/8 transition-all duration-300">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-destructive to-destructive/80 flex items-center justify-center">
                              <TrendingDown className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-destructive">Exit Point</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {trade.exitTime}
                              </p>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-destructive">{formatCurrency(trade.exitPrice)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Result Arrow */}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-px bg-gradient-to-r from-muted-foreground/30 to-muted-foreground/50" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>

                    {/* P&L Result */}
                    <div className="flex-1 max-w-xs">
                      <div className="relative">
                        <div className={`absolute -top-1 -left-1 w-full h-full ${
                          trade.pnl >= 0 ? 'bg-gradient-to-r from-success/20 to-success/10' : 'bg-gradient-to-r from-destructive/20 to-destructive/10'
                        } rounded-xl blur-sm`} />
                        <div className={`relative ${
                          trade.pnl >= 0 
                            ? 'bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:from-success/15 hover:to-success/8' 
                            : 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:from-destructive/15 hover:to-destructive/8'
                        } border rounded-xl p-4 transition-all duration-300`}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-8 h-8 rounded-full ${
                              trade.pnl >= 0 ? 'bg-gradient-to-r from-success to-success/80' : 'bg-gradient-to-r from-destructive to-destructive/80'
                            } flex items-center justify-center`}>
                              {trade.pnl >= 0 ? (
                                <TrendingUp className="h-4 w-4 text-white" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className={`text-sm font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                                Net P&L
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Qty: {trade.quantity.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className={`text-lg font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3">
                    {tradeStatus === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRejectTrade(index)}
                          className="rounded-full border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-200"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onAcceptTrade(index)}
                          className="rounded-full bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white shadow-lg shadow-success/20"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept Trade
                        </Button>
                      </>
                    )}
                    {tradeStatus === 'accepted' && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                          <span className="text-sm font-semibold text-success">Trade Accepted</span>
                          <Check className="h-4 w-4 text-success" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnacceptTrade(index)}
                          className="rounded-full border-muted-foreground/30 hover:bg-muted/20 hover:border-muted-foreground/50 transition-all duration-200"
                        >
                          Undo
                        </Button>
                      </div>
                    )}
                    {tradeStatus === 'rejected' && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-destructive/10 border border-destructive/20 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                          <span className="text-sm font-semibold text-destructive">Trade Rejected</span>
                          <X className="h-4 w-4 text-destructive" />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnrejectTrade(index)}
                          className="rounded-full border-muted-foreground/30 hover:bg-muted/20 hover:border-muted-foreground/50 transition-all duration-200"
                        >
                          Undo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};