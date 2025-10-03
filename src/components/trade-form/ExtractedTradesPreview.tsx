import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Edit3, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/utils/trade-form-utils';
import { useIsMobile } from '@/hooks/use-mobile';

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

interface ExtractedTradesPreviewProps {
  trades: ExtractedTrade[];
  onConfirm: (confirmedTrades: ExtractedTrade[]) => void;
  onCancel: () => void;
  broker?: string;
  confidence?: number;
}

export const ExtractedTradesPreview: React.FC<ExtractedTradesPreviewProps> = ({
  trades,
  onConfirm,
  onCancel,
  broker = 'unknown',
  confidence = 0
}) => {
  const [editableTrades, setEditableTrades] = useState<ExtractedTrade[]>(trades);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const updateTrade = (index: number, field: keyof ExtractedTrade, value: any) => {
    const updated = [...editableTrades];
    updated[index] = { ...updated[index], [field]: value };
    setEditableTrades(updated);
  };

  const formatTimeForDisplay = (timeString: string) => {
    if (!timeString) return 'N/A';
    // Extract HH:MM from the time string
    const match = timeString.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      return `${match[1].padStart(2, '0')}:${match[2]}`;
    }
    return timeString;
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 0.9) return 'text-green-600';
    if (conf >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (conf: number) => {
    if (conf >= 0.9) return 'High';
    if (conf >= 0.7) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Extracted Trades Preview
          </CardTitle>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              {broker.charAt(0).toUpperCase() + broker.slice(1)} Broker
            </Badge>
            <Badge variant="outline" className={getConfidenceColor(confidence)}>
              {getConfidenceBadge(confidence)} Confidence ({(confidence * 100).toFixed(0)}%)
            </Badge>
            <Badge variant="outline">
              {editableTrades.length} Trade{editableTrades.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {editableTrades.map((trade, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{trade.symbol}</h4>
                      <Badge variant={trade.type === 'long' ? 'default' : 'secondary'}>
                        {trade.type === 'long' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {trade.type.toUpperCase()}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getConfidenceColor(trade.confidence)}
                      >
                        {(trade.confidence * 100).toFixed(0)}%
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-4'}`}>
                    <div>
                      <Label className="text-xs text-muted-foreground">Entry Price</Label>
                      {editingIndex === index ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={trade.entryPrice}
                          onChange={(e) => updateTrade(index, 'entryPrice', parseFloat(e.target.value) || 0)}
                          className="h-8"
                        />
                      ) : (
                        <p className="font-medium">₹{trade.entryPrice.toFixed(2)}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Exit Price</Label>
                      {editingIndex === index ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={trade.exitPrice}
                          onChange={(e) => updateTrade(index, 'exitPrice', parseFloat(e.target.value) || 0)}
                          className="h-8"
                        />
                      ) : (
                        <p className="font-medium">₹{trade.exitPrice.toFixed(2)}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">Quantity</Label>
                      {editingIndex === index ? (
                        <Input
                          type="number"
                          value={trade.quantity}
                          onChange={(e) => updateTrade(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      ) : (
                        <p className="font-medium">{trade.quantity}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">P&L</Label>
                      <p className={`font-medium ${trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(trade.pnl)}
                      </p>
                    </div>
                  </div>

                  <div className={`grid gap-3 mt-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Entry Time
                      </Label>
                      {editingIndex === index ? (
                        <Input
                          type="time"
                          value={formatTimeForDisplay(trade.entryTime)}
                          onChange={(e) => updateTrade(index, 'entryTime', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        <p className="font-medium">{formatTimeForDisplay(trade.entryTime)}</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Exit Time
                      </Label>
                      {editingIndex === index ? (
                        <Input
                          type="time"
                          value={formatTimeForDisplay(trade.exitTime)}
                          onChange={(e) => updateTrade(index, 'exitTime', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        <p className="font-medium">{formatTimeForDisplay(trade.exitTime)}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              onClick={() => onConfirm(editableTrades)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Import {editableTrades.length} Trade{editableTrades.length !== 1 ? 's' : ''}
            </Button>
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};