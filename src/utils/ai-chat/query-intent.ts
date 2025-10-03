
/**
 * Analyzes a user message to determine the query intent
 * This helps us provide optimized context data to the AI
 */
export interface QueryIntent {
  selectTopTrades: boolean;
  selectWorstTrades: boolean;
  selectOldestTrades: boolean;
  selectRecentTrades: boolean;
  selectBySymbol: boolean;
  selectByStrategy: boolean;
  selectByDateRange: boolean;
  topTradesCount: number;
  symbol: string | null;
  strategyName: string | null;
  dateRangeStart: string | null;
  dateRangeEnd: string | null;
}

export const extractQueryIntent = (message: string): QueryIntent => {
  const intent: QueryIntent = {
    selectTopTrades: false,
    selectWorstTrades: false,
    selectOldestTrades: false,
    selectRecentTrades: false,
    selectBySymbol: false,
    selectByStrategy: false,
    selectByDateRange: false,
    topTradesCount: 5,
    symbol: null,
    strategyName: null,
    dateRangeStart: null,
    dateRangeEnd: null
  };
  
  const normalizedMsg = message.toLowerCase();
  
  // Check for top trades
  if (normalizedMsg.includes("best") || 
      normalizedMsg.includes("top") || 
      normalizedMsg.includes("profitable") || 
      normalizedMsg.includes("most successful")) {
    intent.selectTopTrades = true;
    
    // Extract number if specified
    const numberMatch = normalizedMsg.match(/top\s+(\d+)|(\d+)\s+best|(\d+)\s+most/);
    if (numberMatch) {
      const matchedNumber = numberMatch[1] || numberMatch[2] || numberMatch[3];
      intent.topTradesCount = parseInt(matchedNumber, 10);
    }
  }
  
  // Check for worst trades
  if (normalizedMsg.includes("worst") || 
      normalizedMsg.includes("unprofitable") || 
      normalizedMsg.includes("losing") || 
      normalizedMsg.includes("bad trades") ||
      normalizedMsg.includes("negative") ||
      normalizedMsg.includes("loss")) {
    intent.selectWorstTrades = true;
    
    // Extract number if specified
    const numberMatch = normalizedMsg.match(/worst\s+(\d+)|(\d+)\s+worst|(\d+)\s+losing/);
    if (numberMatch) {
      const matchedNumber = numberMatch[1] || numberMatch[2] || numberMatch[3];
      intent.topTradesCount = parseInt(matchedNumber, 10);
    }
  }
  
  // Check for oldest trades
  if (normalizedMsg.includes("first") || 
      normalizedMsg.includes("oldest") || 
      normalizedMsg.includes("when did i start") ||
      normalizedMsg.includes("begin") || 
      normalizedMsg.includes("oldest") ||
      normalizedMsg.includes("started trading")) {
    intent.selectOldestTrades = true;
    intent.topTradesCount = 1; // Usually just need the first trade
  }
  
  // Check for recent trades
  if (normalizedMsg.includes("recent") || 
      normalizedMsg.includes("latest") || 
      normalizedMsg.includes("last") || 
      normalizedMsg.includes("newest") ||
      normalizedMsg.includes("current")) {
    intent.selectRecentTrades = true;
  }
  
  // Check for specific stock symbols (common Indian symbols)
  const commonSymbols = ["nifty", "banknifty", "sensex", "reliance", "tcs", "hdfc", "infy", 
                         "sbin", "icicibank", "axisbank", "tatasteel", "wipro", "hcltech"];
  
  for (const symbol of commonSymbols) {
    if (normalizedMsg.includes(symbol)) {
      intent.selectBySymbol = true;
      intent.symbol = symbol.toUpperCase();
      break;
    }
  }
  
  // Check for trading strategies
  const commonStrategies = ["swing", "intraday", "scalping", "momentum", "trend", 
                           "breakout", "reversal", "options", "futures", "positional"];
  
  for (const strategy of commonStrategies) {
    if (normalizedMsg.includes(strategy)) {
      intent.selectByStrategy = true;
      intent.strategyName = strategy;
      break;
    }
  }
  
  // Check for date ranges
  if (normalizedMsg.includes("last month") || 
      normalizedMsg.includes("previous month") ||
      normalizedMsg.includes("last 30 days")) {
    intent.selectByDateRange = true;
    
    // Set date range to last month (approximate)
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    
    intent.dateRangeStart = lastMonth.toISOString().split('T')[0];
    intent.dateRangeEnd = today.toISOString().split('T')[0];
  }
  
  return intent;
};
