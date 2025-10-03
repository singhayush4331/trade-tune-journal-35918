import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { calculateTradeMetrics } from '@/utils/trade-form-utils';
import { formatCurrency } from '@/utils/trade-form-utils';
import { TrendingUp, TrendingDown, BarChart3, Target, Activity } from 'lucide-react';

interface DefaultOverviewPanelProps {
  trades: any[];
}

export const DefaultOverviewPanel: React.FC<DefaultOverviewPanelProps> = ({ trades }) => {
  // Calculate summary statistics for all trades
  const summary = React.useMemo(() => {
    let totalPL = 0;
    let totalBrokerage = 0;
    let winners = 0;
    let losers = 0;
    
    trades.forEach(trade => {
      const metrics = calculateTradeMetrics({
        entryPrice: parseFloat(trade.entryPrice) || 0,
        exitPrice: parseFloat(trade.exitPrice) || 0,
        quantity: parseInt(trade.quantity) || 0,
        tradeType: trade.type || 'long',
        marketSegment: trade.marketSegment || 'equity-delivery',
        exchange: trade.exchange || 'NSE'
      });
      
      totalPL += metrics.pl;
      totalBrokerage += metrics.brokerage;
      
      if (metrics.pl > 0) winners++;
      else if (metrics.pl < 0) losers++;
    });
    
    const winRate = trades.length > 0 ? (winners / trades.length) * 100 : 0;
    
    return {
      totalTrades: trades.length,
      totalPL,
      totalBrokerage,
      winners,
      losers,
      winRate
    };
  }, [trades]);

  return (
    <div className="space-y-4 sticky top-6">
      {/* Summary Card */}
      <Card className="shadow-lg border-primary/20 hover:border-primary/30 transition-all duration-300 bg-card/90 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold mb-2">Portfolio Overview</h3>
            <p className="text-sm text-muted-foreground">
              Summary of all {summary.totalTrades} detected trades
            </p>
          </div>
          
          {/* Total P&L */}
          <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {summary.totalPL >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-green-500" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Net P&L</span>
              </div>
              <span className={`font-bold text-lg ${summary.totalPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(summary.totalPL)}
              </span>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-green-500">Winners</span>
              </div>
              <span className="text-lg font-bold text-green-500">{summary.winners}</span>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-xs font-medium text-red-500">Losers</span>
              </div>
              <span className="text-lg font-bold text-red-500">{summary.losers}</span>
            </div>
          </div>
          
          {/* Win Rate */}
          <div className="text-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-blue-500">Win Rate</span>
            </div>
            <span className="text-lg font-bold text-blue-500">{summary.winRate.toFixed(1)}%</span>
          </div>
          
          {/* Brokerage */}
          <div className="text-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="h-4 w-4 text-orange-500" />
              <span className="text-xs font-medium text-orange-500">Total Brokerage</span>
            </div>
            <span className="text-sm font-bold text-orange-500">{formatCurrency(summary.totalBrokerage)}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Instructions Card */}
      <Card className="shadow-lg border-primary/20 hover:border-primary/30 transition-all duration-300 bg-card/90 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="text-center">
            <Activity className="h-8 w-8 text-primary mx-auto mb-3" />
            <h4 className="font-semibold mb-2">Ready to Review</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Click on any trade below to view detailed analysis and fill in additional information.
            </p>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {summary.totalTrades} trades pending
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};