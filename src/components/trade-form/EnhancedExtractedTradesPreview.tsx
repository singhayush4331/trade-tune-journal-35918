import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Edit3, Clock, TrendingUp, TrendingDown, AlertTriangle, Zap, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/trade-form-utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';

interface ExtractedTrade {
  symbol: string;
  cleanSymbol?: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  type: 'long' | 'short';
  entryTime: string;
  exitTime: string;
  pnl: number;
  confidence: number;
  positionType?: 'buy' | 'sell';
  marketSegment?: string;
  optionType?: 'CE' | 'PE';
  underlyingSymbol?: string;
  strikePrice?: string;
  marketSentiment?: 'bullish' | 'bearish';
  strategy?: string;
  brokerage?: number;
  roi?: number;
}

interface IncompleteOrder {
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  time: string;
  confidence?: number;
}

interface EnhancedExtractedTradesPreviewProps {
  trades: ExtractedTrade[];
  incompleteOrders?: IncompleteOrder[];
  onConfirm: (confirmedTrades: ExtractedTrade[]) => void;
  onCancel: () => void;
  broker?: string;
  confidence?: number;
  processingWarnings?: string[];
}

export const EnhancedExtractedTradesPreview: React.FC<EnhancedExtractedTradesPreviewProps> = ({
  trades,
  incompleteOrders = [],
  onConfirm,
  onCancel,
  broker = 'unknown',
  confidence = 0,
  processingWarnings = []
}) => {
  const [editableTrades, setEditableTrades] = useState<ExtractedTrade[]>(trades);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const isMobile = useIsMobile();

  const updateTrade = (index: number, field: keyof ExtractedTrade, value: any) => {
    const updated = [...editableTrades];
    updated[index] = { ...updated[index], [field]: value };
    setEditableTrades(updated);
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return 'N/A';
    const match = timeString.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }
    return timeString;
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.95) return 'text-success';
    if (conf >= 0.85) return 'text-warning';
    return 'text-destructive';
  };

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 0.95) return 'Excellent';
    if (conf >= 0.85) return 'Good';
    return 'Needs Review';
  };

  const getStrategyBadgeVariant = (strategy?: string) => {
    if (!strategy) return 'outline';
    if (strategy.includes('Long')) return 'default';
    if (strategy.includes('Short')) return 'secondary';
    return 'outline';
  };

  const totalPnL = editableTrades.reduce((sum, trade) => sum + trade.pnl, 0);
  const totalBrokerage = editableTrades.reduce((sum, trade) => sum + (trade.brokerage || 0), 0);
  const netPnL = totalPnL - totalBrokerage;

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Analytics */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-sm" />
        <Card className="relative bg-gradient-to-r from-card/95 via-card/98 to-card/95 backdrop-blur-xl border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-success to-success/80 animate-pulse" />
                  <CardTitle className="text-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">
                    AI Trade Extraction Complete
                  </CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  <Zap className="h-3 w-3 mr-1 text-primary" />
                  {broker.charAt(0).toUpperCase() + broker.slice(1)}
                </Badge>
                <Badge variant="outline" className={`${getConfidenceColor(confidence)} border-current/20`}>
                  <Target className="h-3 w-3 mr-1" />
                  {getConfidenceBadge(confidence)} ({(confidence * 100).toFixed(0)}%)
                </Badge>
              </div>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-xl p-3">
                <div className="text-xs text-muted-foreground">Complete Trades</div>
                <div className="text-lg font-bold text-success">{editableTrades.length}</div>
              </div>
              <div className="bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20 rounded-xl p-3">
                <div className="text-xs text-muted-foreground">Incomplete Orders</div>
                <div className="text-lg font-bold text-warning">{incompleteOrders.length}</div>
              </div>
              <div className={`bg-gradient-to-br ${netPnL >= 0 ? 'from-success/10 to-success/5 border-success/20' : 'from-destructive/10 to-destructive/5 border-destructive/20'} border rounded-xl p-3`}>
                <div className="text-xs text-muted-foreground">Net P&L</div>
                <div className={`text-lg font-bold ${netPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(netPnL)}
                </div>
              </div>
              <div className="bg-gradient-to-br from-muted/10 to-muted/5 border border-muted/20 rounded-xl p-3">
                <div className="text-xs text-muted-foreground">Brokerage</div>
                <div className="text-lg font-bold text-muted-foreground">{formatCurrency(totalBrokerage)}</div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Processing Warnings */}
      {processingWarnings.length > 0 && (
        <Alert className="border-warning/20 bg-warning/5">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription>
            <div className="font-semibold text-warning mb-2">Processing Warnings:</div>
            <ul className="text-sm space-y-1">
              {processingWarnings.map((warning, index) => (
                <li key={index} className="text-muted-foreground">• {warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Complete Trades */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Complete Trades</h3>
        {editableTrades.map((trade, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden border-primary/20 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-bold text-lg">{trade.cleanSymbol || trade.symbol}</h4>
                      {trade.underlyingSymbol && (
                        <p className="text-sm text-muted-foreground">
                          {trade.underlyingSymbol} {trade.strikePrice} {trade.optionType}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStrategyBadgeVariant(trade.strategy)}>
                        {trade.type === 'long' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {trade.strategy || trade.type.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className={`${getConfidenceColor(trade.confidence)} border-current/20`}>
                        {(trade.confidence * 100).toFixed(0)}%
                      </Badge>
                      {trade.marketSentiment && (
                        <Badge variant="outline" className={trade.marketSentiment === 'bullish' ? 'text-success border-success/20' : 'text-destructive border-destructive/20'}>
                          {trade.marketSentiment}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>

                <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-5'}`}>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Entry Price</Label>
                    {editingIndex === index ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={trade.entryPrice}
                        onChange={(e) => updateTrade(index, 'entryPrice', parseFloat(e.target.value) || 0)}
                        className="h-9"
                      />
                    ) : (
                      <p className="font-medium text-success">{formatCurrency(trade.entryPrice)}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Exit Price</Label>
                    {editingIndex === index ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={trade.exitPrice}
                        onChange={(e) => updateTrade(index, 'exitPrice', parseFloat(e.target.value) || 0)}
                        className="h-9"
                      />
                    ) : (
                      <p className="font-medium text-destructive">{formatCurrency(trade.exitPrice)}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Quantity</Label>
                    {editingIndex === index ? (
                      <Input
                        type="number"
                        value={trade.quantity}
                        onChange={(e) => updateTrade(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="h-9"
                      />
                    ) : (
                      <p className="font-medium">{trade.quantity.toLocaleString()}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Net P&L</Label>
                    <p className={`font-bold ${trade.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{formatCurrency(trade.pnl)}
                    </p>
                    {trade.roi && (
                      <p className="text-xs text-muted-foreground">
                        ROI: {trade.roi.toFixed(2)}%
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Duration</Label>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{formatTimeForDisplay(trade.entryTime)} → {formatTimeForDisplay(trade.exitTime)}</span>
                    </div>
                    {trade.brokerage && (
                      <p className="text-xs text-muted-foreground">
                        Brokerage: {formatCurrency(trade.brokerage)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Incomplete Orders */}
      {incompleteOrders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Incomplete Orders</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowIncomplete(!showIncomplete)}
            >
              {showIncomplete ? 'Hide' : 'Show'} ({incompleteOrders.length})
            </Button>
          </div>
          
          {showIncomplete && (
            <Alert className="border-warning/20 bg-warning/5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription>
                <div className="font-semibold text-warning mb-2">
                  Found {incompleteOrders.length} orders without matching entry/exit pairs:
                </div>
                <div className="space-y-2">
                  {incompleteOrders.map((order, index) => (
                    <div key={index} className="flex items-center justify-between text-sm bg-card/50 rounded p-2">
                      <span>{order.symbol}</span>
                      <span className={order.type === 'buy' ? 'text-success' : 'text-destructive'}>
                        {order.type.toUpperCase()} {order.quantity} @ {formatCurrency(order.price)}
                      </span>
                      <span className="text-muted-foreground">{formatTimeForDisplay(order.time)}</span>
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
        <Button 
          onClick={() => onConfirm(editableTrades)}
          className="flex-1 bg-gradient-to-r from-success to-success/80 hover:from-success/90 hover:to-success/70 text-white shadow-lg shadow-success/20"
          size="lg"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Import {editableTrades.length} Trade{editableTrades.length !== 1 ? 's' : ''} 
          {netPnL !== 0 && (
            <span className="ml-2 font-bold">
              ({netPnL >= 0 ? '+' : ''}{formatCurrency(netPnL)})
            </span>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="flex-1 sm:flex-none border-destructive/30 hover:bg-destructive/10 hover:border-destructive/50"
          size="lg"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancel Import
        </Button>
      </div>
    </div>
  );
};