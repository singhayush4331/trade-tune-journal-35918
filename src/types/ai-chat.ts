
export interface TradeContext {
  systemMessage: string;
  trades: any[];
  totalTrades: number;
  winRate: number;
  totalPnl: number;
  mostRecentTradeInfo: any;
  queryIntent: any;
}

export interface TradeAnalysis {
  trades: any[];
  tradeMetrics: any;
  totalCount: number;
}
