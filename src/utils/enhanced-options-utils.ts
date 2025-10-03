// Enhanced Options Trading Utilities for Foolproof AI Extraction
// Handles complex options scenarios, broker variations, and position matching

export interface OptionDetectionResult {
  isOption: boolean;
  optionType: 'CE' | 'PE' | '';
  underlyingSymbol?: string;
  strikePrice?: string;
  expiry?: string;
  contractType?: 'index' | 'stock';
  lotSize?: number;
  cleanSymbol?: string;
}

export interface TradeDirectionResult {
  direction: 'long' | 'short';
  positionType: 'buy' | 'sell';
  marketSentiment: 'bullish' | 'bearish';
  explanation: string;
  strategy?: string;
}

export interface OrderBookEntry {
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  time: string;
  orderType?: string;
  status?: string;
  broker?: string;
}

export interface ProcessedTrade {
  symbol: string;
  cleanSymbol: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  type: 'long' | 'short';
  entryTime: string;
  exitTime: string;
  pnl: number;
  confidence: number;
  positionType: 'buy' | 'sell';
  marketSegment: string;
  optionType?: 'CE' | 'PE';
  exchange?: string;
  underlyingSymbol?: string;
  strikePrice?: string;
  marketSentiment?: 'bullish' | 'bearish';
  strategy?: string;
  brokerage?: number;
  roi?: number;
}

/**
 * Enhanced Options Symbol Detection with Multi-Broker Support
 * Handles complex broker-specific naming conventions
 */
export function detectOptionFromSymbol(symbol: string): OptionDetectionResult {
  console.log('🔍 Enhanced Options Detection for:', symbol);
  
  if (!symbol) return { isOption: false, optionType: '' };

  let symbolUpper = symbol.toUpperCase().trim();
  let detectedExchange = '';
  
  // Remove and store exchange prefixes
  const exchangePrefixes = ['NSE:', 'BSE:', 'MCX:', 'NFO:', 'BFO:'];
  for (const prefix of exchangePrefixes) {
    if (symbolUpper.startsWith(prefix)) {
      detectedExchange = prefix.replace(':', '');
      symbolUpper = symbolUpper.substring(prefix.length);
      break;
    }
  }
  
  // Enhanced patterns for all major Indian brokers
  const optionPatterns = [
    // Zerodha/Kite: NIFTY25807246550PE, BANKNIFTY25807245000CE
    { pattern: /^([A-Z]+)(\d{8,12})(CE|PE)$/, type: 'zerodha_long' },
    
    // Upstox: NIFTY 24000 CE, BANKNIFTY 45000 PE
    { pattern: /^([A-Z]+)\s+(\d{4,7})\s+(CE|PE)$/, type: 'upstox_spaced' },
    
    // Angel Broking: NIFTY24JAN24000CE, BANKNIFTY24FEB45000PE
    { pattern: /^([A-Z]+)(\d{2}[A-Z]{3})(\d+)(CE|PE)$/, type: 'angel_expiry' },
    
    // Fyers: NIFTY24000CE, BANKNIFTY45000PE
    { pattern: /^([A-Z]+)(\d{4,7})(CE|PE)$/, type: 'fyers_simple' },
    
    // Complex date formats: NIFTY24JAN2024000CE
    { pattern: /^([A-Z]+)(\d{2}[A-Z]{3}\d{2,4})(\d+)(CE|PE)$/, type: 'complex_date' },
    
    // Hyphenated: NIFTY-24000-CE, BANKNIFTY-45000-PE
    { pattern: /^([A-Z]+)-(\d+)-(CE|PE)$/, type: 'hyphenated' },
    
    // Underscored: NIFTY_24000_CE
    { pattern: /^([A-Z]+)_(\d+)_(CE|PE)$/, type: 'underscored' }
  ];

  for (const { pattern, type } of optionPatterns) {
    const match = symbolUpper.match(pattern);
    if (match) {
      console.log(`✅ Pattern matched (${type}):`, match);
      
      const optionType = match[match.length - 1] as 'CE' | 'PE';
      let underlyingSymbol = match[1];
      let strikePrice = '';
      let expiry = '';

      // Process based on pattern type
      if (type === 'zerodha_long') {
        // Extract strike from long contract ID
        const contractId = match[2];
        if (contractId.length >= 10) {
          // Complex date+strike: take last 5-6 digits as strike
          strikePrice = contractId.slice(-5);
          expiry = contractId.slice(0, -5);
        } else {
          strikePrice = contractId;
        }
      } else if (type === 'angel_expiry' || type === 'complex_date') {
        expiry = match[2];
        strikePrice = match[3];
      } else {
        strikePrice = match[2];
      }

      // Standardize underlying symbols
      underlyingSymbol = standardizeUnderlyingSymbol(underlyingSymbol);
      
      // Determine contract type and lot size
      const contractInfo = getContractInfo(underlyingSymbol);
      
      return {
        isOption: true,
        optionType,
        underlyingSymbol,
        strikePrice: strikePrice.replace(/^0+/, '') || strikePrice, // Remove leading zeros
        expiry,
        contractType: contractInfo.type,
        lotSize: contractInfo.lotSize,
        cleanSymbol: `${underlyingSymbol} ${strikePrice} ${optionType}`
      };
    }
  }

  // Enhanced fallback detection
  if (symbolUpper.includes('CE') || symbolUpper.includes('PE')) {
    const optionType = symbolUpper.includes('CE') ? 'CE' : 'PE';
    let underlyingSymbol = symbolUpper
      .replace(/(CE|PE)$/, '')
      .replace(/\d+$/, '')
      .replace(/[-_\s]+$/, '')
      .trim();
    
    underlyingSymbol = standardizeUnderlyingSymbol(underlyingSymbol);
    const contractInfo = getContractInfo(underlyingSymbol);
    
    console.log('✅ Fallback detection successful');
    return {
      isOption: true,
      optionType,
      underlyingSymbol,
      contractType: contractInfo.type,
      lotSize: contractInfo.lotSize,
      cleanSymbol: `${underlyingSymbol} ${optionType}`
    };
  }

  console.log('❌ No options pattern detected');
  return { isOption: false, optionType: '' };
}

/**
 * Standardizes underlying symbol names across brokers
 */
function standardizeUnderlyingSymbol(symbol: string): string {
  const standardizations: Record<string, string> = {
    'NIFTY50': 'NIFTY',
    'NIFTY_50': 'NIFTY',
    'NIFTY-50': 'NIFTY',
    'BANKNIFTY': 'BANKNIFTY',
    'BANK_NIFTY': 'BANKNIFTY',
    'BANK-NIFTY': 'BANKNIFTY',
    'FINNIFTY': 'FINNIFTY',
    'MIDCPNIFTY': 'MIDCPNIFTY',
    'SENSEX': 'SENSEX',
    'BANKEX': 'BANKEX'
  };

  const upper = symbol.toUpperCase();
  return standardizations[upper] || upper;
}

/**
 * Gets contract information for underlying symbols
 */
function getContractInfo(underlying: string): { type: 'index' | 'stock', lotSize: number } {
  const indexInfo: Record<string, number> = {
    'NIFTY': 50,
    'BANKNIFTY': 15,
    'FINNIFTY': 40,
    'MIDCPNIFTY': 75,
    'SENSEX': 10,
    'BANKEX': 15
  };

  if (indexInfo[underlying]) {
    return { type: 'index', lotSize: indexInfo[underlying] };
  }

  return { type: 'stock', lotSize: 1 }; // Default for stocks
}

/**
 * Enhanced Options Trading Direction Logic
 * Handles complex strategies and position combinations
 */
export function calculateOptionsDirection(
  optionType: 'CE' | 'PE',
  positionType: 'buy' | 'sell',
  context?: {
    underlyingPrice?: number;
    strikePrice?: number;
    timeToExpiry?: number;
  }
): TradeDirectionResult {
  console.log('📊 Calculating direction:', { optionType, positionType, context });

  let direction: 'long' | 'short';
  let marketSentiment: 'bullish' | 'bearish';
  let explanation: string;
  let strategy: string;

  if (optionType === 'CE') {
    if (positionType === 'buy') {
      direction = 'long';
      marketSentiment = 'bullish';
      explanation = 'Buying Call = Bullish (expecting price to rise)';
      strategy = 'Long Call';
    } else {
      direction = 'short';
      marketSentiment = 'bearish';
      explanation = 'Selling Call = Bearish (expecting price to stay below strike)';
      strategy = 'Short Call';
    }
  } else { // PE
    if (positionType === 'buy') {
      direction = 'short'; // Buying puts is bearish
      marketSentiment = 'bearish';
      explanation = 'Buying Put = Bearish (expecting price to fall)';
      strategy = 'Long Put';
    } else {
      direction = 'long'; // Selling puts is bullish
      marketSentiment = 'bullish';
      explanation = 'Selling Put = Bullish (expecting price to stay above strike)';
      strategy = 'Short Put';
    }
  }

  // Enhanced strategy detection based on context
  if (context?.underlyingPrice && context?.strikePrice) {
    const moneyness = context.underlyingPrice / context.strikePrice;
    
    if (moneyness > 1.02) {
      strategy += ' (ITM)';
    } else if (moneyness < 0.98) {
      strategy += ' (OTM)';
    } else {
      strategy += ' (ATM)';
    }
  }

  return {
    direction,
    positionType,
    marketSentiment,
    explanation,
    strategy
  };
}

/**
 * Advanced Position Matching with FIFO Logic
 * Handles partial fills, averaging, and complex scenarios
 */
export function processOrdersIntoTrades(orders: OrderBookEntry[]): {
  completeTrades: ProcessedTrade[];
  incompleteOrders: OrderBookEntry[];
  warnings: string[];
} {
  console.log('🔄 Processing orders into trades:', orders.length);
  
  const trades: ProcessedTrade[] = [];
  const incompleteOrders: OrderBookEntry[] = [];
  const warnings: string[] = [];
  const symbolGroups = new Map<string, OrderBookEntry[]>();

  // Group orders by symbol
  orders.forEach(order => {
    const key = order.symbol.toUpperCase();
    if (!symbolGroups.has(key)) {
      symbolGroups.set(key, []);
    }
    symbolGroups.get(key)!.push(order);
  });

  // Process each symbol group
  symbolGroups.forEach((orders, symbol) => {
    console.log(`🔍 Processing ${symbol}: ${orders.length} orders`);
    
    // Sort chronologically with enhanced time parsing
    orders.sort((a, b) => {
      const timeA = parseAdvancedTime(a.time);
      const timeB = parseAdvancedTime(b.time);
      return timeA.getTime() - timeB.getTime();
    });

    // Advanced position tracking
    const positionTracker = new PositionTracker(symbol);
    
    for (const order of orders) {
      const result = positionTracker.processOrder(order);
      
      if (result.trade) {
        trades.push(result.trade);
      }
      
      if (result.warnings) {
        warnings.push(...result.warnings);
      }
    }
    
    // Check for incomplete positions
    const incomplete = positionTracker.getIncompletePositions();
    incompleteOrders.push(...incomplete);
  });

  console.log(`✅ Processed: ${trades.length} trades, ${incompleteOrders.length} incomplete`);
  return { completeTrades: trades, incompleteOrders, warnings };
}

/**
 * Advanced Position Tracker with FIFO Logic
 */
class PositionTracker {
  private symbol: string;
  private positions: Array<{
    price: number;
    quantity: number;
    time: string;
    type: 'long' | 'short';
    order: OrderBookEntry;
  }> = [];

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  processOrder(order: OrderBookEntry): {
    trade?: ProcessedTrade;
    warnings?: string[];
  } {
    const warnings: string[] = [];
    const isLong = order.type === 'buy';
    const currentPosition = this.getNetPosition();
    
    // Detect if this is opening or closing a position
    if ((isLong && currentPosition >= 0) || (!isLong && currentPosition <= 0)) {
      // Opening position
      this.positions.push({
        price: order.price,
        quantity: isLong ? order.quantity : -order.quantity,
        time: order.time,
        type: isLong ? 'long' : 'short',
        order
      });
      return { warnings };
    } else {
      // Closing position - use FIFO
      const trade = this.closePosition(order);
      return { trade, warnings };
    }
  }

  private closePosition(closingOrder: OrderBookEntry): ProcessedTrade | undefined {
    const isClosingLong = closingOrder.type === 'sell';
    let remainingQty = closingOrder.quantity;
    let totalCost = 0;
    let totalQuantity = 0;
    let firstEntry: any = null;

    // FIFO: Close oldest positions first
    const positionsToClose = this.positions.filter(p => 
      isClosingLong ? p.quantity > 0 : p.quantity < 0
    );

    for (const position of positionsToClose) {
      if (remainingQty <= 0) break;
      
      const availableQty = Math.abs(position.quantity);
      const closingQty = Math.min(remainingQty, availableQty);
      
      totalCost += closingQty * position.price;
      totalQuantity += closingQty;
      remainingQty -= closingQty;
      
      if (!firstEntry) firstEntry = position;
      
      // Update position
      if (closingQty === availableQty) {
        const index = this.positions.indexOf(position);
        this.positions.splice(index, 1);
      } else {
        position.quantity = position.quantity > 0 
          ? position.quantity - closingQty 
          : position.quantity + closingQty;
      }
    }

    if (totalQuantity === 0 || !firstEntry) return undefined;

    const avgEntryPrice = totalCost / totalQuantity;
    const pnl = isClosingLong 
      ? (closingOrder.price - avgEntryPrice) * totalQuantity
      : (avgEntryPrice - closingOrder.price) * totalQuantity;

    // Enhanced trade data with options analysis
    const optionInfo = detectOptionFromSymbol(this.symbol);
    const directionInfo = optionInfo.isOption && optionInfo.optionType !== ''
      ? calculateOptionsDirection(optionInfo.optionType as 'CE' | 'PE', firstEntry.order.type)
      : { 
          direction: (isClosingLong ? 'long' : 'short') as 'long' | 'short', 
          marketSentiment: 'bullish' as 'bullish' | 'bearish', 
          explanation: '', 
          strategy: '' 
        };

    return {
      symbol: this.symbol,
      cleanSymbol: optionInfo.cleanSymbol || this.symbol,
      entryPrice: avgEntryPrice,
      exitPrice: closingOrder.price,
      quantity: totalQuantity,
      type: directionInfo.direction,
      entryTime: firstEntry.time,
      exitTime: closingOrder.time,
      pnl,
      confidence: 0.95, // High confidence for matched trades
      positionType: firstEntry.order.type,
      marketSegment: optionInfo.isOption ? 'options' : 'equity-delivery',
      optionType: (optionInfo.optionType !== '' ? optionInfo.optionType : undefined) as 'CE' | 'PE' | undefined,
      exchange: this.detectExchange(),
      underlyingSymbol: optionInfo.underlyingSymbol,
      strikePrice: optionInfo.strikePrice,
      marketSentiment: directionInfo.marketSentiment,
      strategy: directionInfo.strategy,
      brokerage: this.calculateBrokerage(avgEntryPrice, closingOrder.price, totalQuantity),
      roi: (pnl / (avgEntryPrice * totalQuantity)) * 100
    };
  }

  private getNetPosition(): number {
    return this.positions.reduce((sum, pos) => sum + pos.quantity, 0);
  }

  private detectExchange(): string {
    if (this.symbol.includes('NIFTY') || this.symbol.includes('BANK')) {
      return 'NFO';
    }
    return 'NSE';
  }

  private calculateBrokerage(entryPrice: number, exitPrice: number, quantity: number): number {
    // Basic brokerage calculation - can be enhanced
    const turnover = (entryPrice + exitPrice) * quantity;
    return turnover * 0.0001; // 0.01% basic estimate
  }

  getIncompletePositions(): OrderBookEntry[] {
    return this.positions.map(p => p.order);
  }
}

/**
 * Enhanced Time Parsing with OCR Error Correction
 */
function parseAdvancedTime(timeString: string): Date {
  if (!timeString) return new Date();
  
  let correctedTime = timeString.trim();
  
  // Common OCR corrections
  const ocrCorrections: Record<string, string> = {
    'O': '0', 'I': '1', 'l': '1', 'S': '5', 'G': '6', 'B': '8', 'Z': '2'
  };
  
  // Apply OCR corrections
  for (const [wrong, correct] of Object.entries(ocrCorrections)) {
    correctedTime = correctedTime.replace(new RegExp(wrong, 'g'), correct);
  }
  
  // Extract time in various formats
  const timePatterns = [
    /(\d{1,2}):(\d{2}):(\d{2})/, // HH:MM:SS
    /(\d{1,2}):(\d{2})/, // HH:MM
    /(\d{1,2})(\d{2})(\d{2})/, // HHMMSS
  ];
  
  for (const pattern of timePatterns) {
    const match = correctedTime.match(pattern);
    if (match) {
      const hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const seconds = match[3] ? parseInt(match[3]) : 0;
      
      // Validate trading hours (9:15 AM to 3:30 PM)
      if (hours >= 9 && hours <= 15 && minutes >= 0 && minutes < 60) {
        const date = new Date();
        date.setHours(hours, minutes, seconds, 0);
        return date;
      }
    }
  }
  
  // Fallback to current time
  return new Date();
}

/**
 * Validation Functions for Data Quality
 */
export function validateTradeData(trade: ProcessedTrade): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Price validation
  if (trade.entryPrice <= 0 || trade.exitPrice <= 0) {
    errors.push('Invalid prices detected');
  }
  
  // Quantity validation
  if (trade.quantity <= 0) {
    errors.push('Invalid quantity detected');
  }
  
  // Options validation
  if (trade.marketSegment === 'options' && !trade.optionType) {
    warnings.push('Options trade missing option type');
  }
  
  // Time validation
  if (trade.entryTime === trade.exitTime) {
    warnings.push('Entry and exit times are identical');
  }
  
  // P&L reasonableness check
  const expectedPnl = trade.type === 'long' 
    ? (trade.exitPrice - trade.entryPrice) * trade.quantity
    : (trade.entryPrice - trade.exitPrice) * trade.quantity;
    
  if (Math.abs(trade.pnl - expectedPnl) > expectedPnl * 0.1) {
    warnings.push('P&L calculation may be incorrect');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}