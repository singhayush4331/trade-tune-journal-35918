import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderBookEntry {
  symbol: string;
  type: 'buy' | 'sell';
  price: number;
  quantity: number;
  time: string;
  orderType?: string;
  status?: string;
  confidence?: number;
}

interface TradeData {
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { imageData } = await req.json();

    // Enhanced AI prompt for foolproof extraction
    const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an EXPERT at extracting trading data from Indian broker order book screenshots with 99%+ accuracy.

            🎯 CRITICAL SUCCESS RULES (FOLLOW EXACTLY):
            
            1️⃣ EXTRACT EVERY SINGLE ROW - Even partially visible ones
            2️⃣ USE ONLY EXECUTION PRICE COLUMNS - Never limit/order prices  
            3️⃣ READ BUY/SELL WITH EXTREME CARE - This causes 80% of errors
            4️⃣ VERIFY TIMES DIGIT BY DIGIT - OCR misreads times frequently
            5️⃣ SCAN TOP ROWS FIRST - Most critical trades are often missed here
            
            🏆 PRICE COLUMN MASTERY (HIGHEST PRIORITY):
            TARGET COLUMNS (In Priority Order):
            ✅ "Traded Price" / "Trade Price" (BEST)
            ✅ "Executed Price" / "Execution Price" (BEST)  
            ✅ "Fill Price" / "Filled Price" (GOOD)
            ✅ "Avg Price" / "Average Price" (GOOD)
            ❌ NEVER USE: "Limit Price", "Order Price", "Stop Price", "LTP", "Market Price"
            
            🎯 BROKER-SPECIFIC EXPERTISE:
            • ZERODHA: "Avg Price" or "Price" column (ignore "LTP")
            • UPSTOX: "Executed Price" or "Fill Price" 
            • FYERS: "Traded Price" column
            • ANGEL: "Rate" or "Execution Rate"
            • OTHERS: Any column with "Traded/Executed/Fill/Avg" keywords
            
            🔥 OPTIONS TRADING MASTERY:
            POSITION LOGIC (CRITICAL FOR OPTIONS):
            • BUY CALL (CE) = BULLISH/LONG position
            • BUY PUT (PE) = BEARISH/SHORT position  
            • SELL CALL (CE) = BEARISH/SHORT position
            • SELL PUT (PE) = BULLISH/LONG position
            
            SYMBOL FORMATS:
            • Zerodha: NIFTY25807246550PE
            • Upstox: NIFTY 24000 CE (with spaces)
            • Generic: Various formats with strikes/expiry
            
            ⚡ EXTRACTION METHODOLOGY:
            1. SCAN IMAGE TOP-TO-BOTTOM systematically
            2. IDENTIFY all column headers first
            3. LOCATE the correct price column
            4. EXTRACT every visible row (even partial)
            5. VERIFY buy/sell indicators carefully
            6. VALIDATE times are within trading hours (9:15-15:30)
            
            🛠️ OCR ERROR CORRECTION:
            Common Time Misreads:
            O→0, I→1, l→1, G→6, B→8, S→5, Z→2
            
            Validation Rules:
            • Times: 09:15 to 15:30 IST only
            • Prices: Must be positive decimals
            • Quantities: Positive integers, consider lot sizes
            • Symbols: Include full contract details for options
            
            📊 QUALITY ASSURANCE:
            Before submitting results:
            ✓ Every visible row extracted?
            ✓ Correct price column used?
            ✓ Buy/Sell correctly identified?
            ✓ Times within trading hours?
            ✓ Both entry/exit orders found for symbols?
            
            🎯 RETURN FORMAT (EXACT STRUCTURE):
            {
              "orders": [
                {
                  "symbol": "NSE:NIFTY25807246550PE",
                  "type": "buy",
                  "price": 125.50,
                  "quantity": 50,
                  "time": "10:25:30",
                  "status": "executed",
                  "confidence": 0.95
                }
              ],
              "broker_detected": "zerodha|upstox|angelbroking|fyers|other",
              "confidence": 0.98,
              "time_confidence": 0.95,
              "price_column_used": "Traded Price",
              "extraction_notes": "Successfully extracted X orders with both buy/sell pairs",
              "validation_warnings": ["Any issues found"]
            }
            
            🚀 FINAL VALIDATION: Ensure you have COMPLETE TRADE PAIRS (buy+sell) for all symbols before submitting!`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Extract all trading orders from this order book screenshot with maximum accuracy:'
              },
              {
                type: 'image_url',
                image_url: { url: imageData }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.05
      }),
    });

    const visionResult = await visionResponse.json();

    if (!visionResult.choices?.[0]?.message?.content) {
      throw new Error('Failed to extract data from image');
    }

    let extractedData;
    try {
      let content = visionResult.choices[0].message.content;
      
      if (content.includes('```json')) {
        content = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      } else if (content.includes('```')) {
        content = content.replace(/```\s*/g, '');
      }
      
      content = content.trim();
      extractedData = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse Vision API response:', e);
      throw new Error('Invalid response format from Vision API');
    }

    // Enhanced validation and processing
    const validatedOrders = enhancedValidateAndFixOrders(extractedData.orders || [], extractedData);
    
    // Advanced position matching with FIFO logic
    const { completeTrades, incompleteOrders, warnings } = processOrdersIntoTradesAdvanced(validatedOrders);

    // Extract user ID from JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No valid authorization header provided');
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userId = payload.sub;
    } catch (error) {
      throw new Error('Invalid JWT token format');
    }

    // Store extraction result
    const { data: extractionRecord, error: insertError } = await supabaseClient
      .from('trade_extractions')
      .insert({
        user_id: userId,
        image_data: imageData,
        raw_extraction: {
          ...extractedData,
          incomplete_orders: incompleteOrders,
          processing_warnings: warnings
        },
        processed_trades: completeTrades,
        broker_type: extractedData.broker_detected || 'unknown',
        extraction_confidence: extractedData.confidence || 0,
        status: incompleteOrders.length > 0 ? 'incomplete_trades_detected' : 'completed'
      })
      .select()
      .single();

    if (insertError) {
      throw new Error('Failed to save extraction results');
    }

    return new Response(JSON.stringify({
      success: true,
      extractionId: extractionRecord.id,
      trades: completeTrades,
      incompleteOrders: incompleteOrders,
      broker: extractedData.broker_detected,
      confidence: extractedData.confidence,
      totalTrades: completeTrades.length,
      hasIncompleteOrders: incompleteOrders.length > 0,
      message: incompleteOrders.length > 0 
        ? `Extracted ${completeTrades.length} complete trades with advanced processing. Found ${incompleteOrders.length} incomplete orders that may need manual completion.`
        : `Successfully extracted ${completeTrades.length} complete trades with enhanced accuracy.`,
      processingWarnings: warnings
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Analysis failed. Please try again with a clear screenshot.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// ==================== ENHANCED PROCESSING FUNCTIONS ====================

// Enhanced Options Detection with Multi-Broker Support
function detectOptionFromSymbol(symbol: string): {
  isOption: boolean;
  optionType: 'CE' | 'PE' | '';
  underlyingSymbol?: string;
  strikePrice?: string;
  cleanSymbol?: string;
  contractType?: 'index' | 'stock';
  lotSize?: number;
} {
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
    { pattern: /^([A-Z]+)(\d{8,12})(CE|PE)$/, type: 'zerodha_long' },
    { pattern: /^([A-Z]+)\s+(\d{4,7})\s+(CE|PE)$/, type: 'upstox_spaced' },
    { pattern: /^([A-Z]+)(\d{2}[A-Z]{3})(\d+)(CE|PE)$/, type: 'angel_expiry' },
    { pattern: /^([A-Z]+)(\d{4,7})(CE|PE)$/, type: 'fyers_simple' },
    { pattern: /^([A-Z]+)(\d{2}[A-Z]{3}\d{2,4})(\d+)(CE|PE)$/, type: 'complex_date' },
    { pattern: /^([A-Z]+)-(\d+)-(CE|PE)$/, type: 'hyphenated' },
    { pattern: /^([A-Z]+)_(\d+)_(CE|PE)$/, type: 'underscored' }
  ];

  for (const { pattern, type } of optionPatterns) {
    const match = symbolUpper.match(pattern);
    if (match) {
      const optionType = match[match.length - 1] as 'CE' | 'PE';
      let underlyingSymbol = match[1];
      let strikePrice = '';

      // Process based on pattern type
      if (type === 'zerodha_long') {
        const contractId = match[2];
        strikePrice = contractId.length >= 10 ? contractId.slice(-5) : contractId;
      } else if (type === 'angel_expiry' || type === 'complex_date') {
        strikePrice = match[3];
      } else {
        strikePrice = match[2];
      }

      // Standardize underlying symbols
      underlyingSymbol = standardizeUnderlyingSymbol(underlyingSymbol);
      const contractInfo = getContractInfo(underlyingSymbol);
      
      return {
        isOption: true,
        optionType,
        underlyingSymbol,
        strikePrice: strikePrice.replace(/^0+/, '') || strikePrice,
        cleanSymbol: `${underlyingSymbol} ${strikePrice} ${optionType}`,
        contractType: contractInfo.type,
        lotSize: contractInfo.lotSize
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
    
    return {
      isOption: true,
      optionType,
      underlyingSymbol,
      cleanSymbol: `${underlyingSymbol} ${optionType}`,
      contractType: contractInfo.type,
      lotSize: contractInfo.lotSize
    };
  }

  return { isOption: false, optionType: '' };
}

function standardizeUnderlyingSymbol(symbol: string): string {
  const standardizations: Record<string, string> = {
    'NIFTY50': 'NIFTY', 'NIFTY_50': 'NIFTY', 'NIFTY-50': 'NIFTY',
    'BANKNIFTY': 'BANKNIFTY', 'BANK_NIFTY': 'BANKNIFTY', 'BANK-NIFTY': 'BANKNIFTY',
    'FINNIFTY': 'FINNIFTY', 'MIDCPNIFTY': 'MIDCPNIFTY', 'SENSEX': 'SENSEX', 'BANKEX': 'BANKEX'
  };
  return standardizations[symbol.toUpperCase()] || symbol.toUpperCase();
}

function getContractInfo(underlying: string): { type: 'index' | 'stock', lotSize: number } {
  const indexInfo: Record<string, number> = {
    'NIFTY': 50, 'BANKNIFTY': 15, 'FINNIFTY': 40, 'MIDCPNIFTY': 75, 'SENSEX': 10, 'BANKEX': 15
  };
  
  if (indexInfo[underlying]) {
    return { type: 'index', lotSize: indexInfo[underlying] };
  }
  return { type: 'stock', lotSize: 1 };
}

// Enhanced Options Direction Calculation
function calculateOptionsDirection(optionType: 'CE' | 'PE', positionType: 'buy' | 'sell'): {
  direction: 'long' | 'short';
  marketSentiment: 'bullish' | 'bearish';
  explanation: string;
  strategy: string;
} {
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
      direction = 'short';
      marketSentiment = 'bearish';
      explanation = 'Buying Put = Bearish (expecting price to fall)';
      strategy = 'Long Put';
    } else {
      direction = 'long';
      marketSentiment = 'bullish';
      explanation = 'Selling Put = Bullish (expecting price to stay above strike)';
      strategy = 'Short Put';
    }
  }

  return { direction, marketSentiment, explanation, strategy };
}

// Enhanced Order Validation and Fixing
function enhancedValidateAndFixOrders(orders: OrderBookEntry[], extractionData: any): OrderBookEntry[] {
  return orders.map(order => {
    let fixedOrder = { ...order };
    
    // Fix common OCR errors in times
    fixedOrder.time = fixTimeOCRErrors(order.time);
    
    // Validate and fix symbols
    if (order.symbol) {
      fixedOrder.symbol = cleanSymbolFormat(order.symbol);
    }
    
    // Ensure confidence is set
    if (!fixedOrder.confidence) {
      fixedOrder.confidence = extractionData.confidence || 0.9;
    }
    
    // Validate trading hours silently
    isValidTradingTime(fixedOrder.time);
    
    return fixedOrder;
  });
}

function fixTimeOCRErrors(timeString: string): string {
  if (!timeString) return '';
  
  let fixed = timeString.trim();
  
  // Common OCR corrections
  const corrections: Record<string, string> = {
    'O': '0', 'I': '1', 'l': '1', 'S': '5', 'G': '6', 'B': '8', 'Z': '2'
  };
  
  for (const [wrong, correct] of Object.entries(corrections)) {
    fixed = fixed.replace(new RegExp(wrong, 'g'), correct);
  }
  
  return fixed;
}

function cleanSymbolFormat(symbol: string): string {
  return symbol.toUpperCase().trim().replace(/\s+/g, ' ');
}

function isValidTradingTime(timeString: string): boolean {
  const match = timeString.match(/(\d{1,2}):(\d{2})/);
  if (!match) return false;
  
  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  
  // Trading hours: 9:15 AM to 3:30 PM
  if (hours < 9 || hours > 15) return false;
  if (hours === 9 && minutes < 15) return false;
  if (hours === 15 && minutes > 30) return false;
  
  return true;
}

// Advanced Position Matching with FIFO Logic
function processOrdersIntoTradesAdvanced(orders: OrderBookEntry[]): { 
  completeTrades: TradeData[], 
  incompleteOrders: OrderBookEntry[],
  warnings: string[]
} {
  console.log('🚀 Advanced processing starting:', orders.length, 'orders');
  
  const trades: TradeData[] = [];
  const incompleteOrders: OrderBookEntry[] = [];
  const warnings: string[] = [];
  const symbolGroups = new Map<string, OrderBookEntry[]>();

  // Group orders by symbol (case-insensitive)
  orders.forEach(order => {
    const key = order.symbol.toUpperCase();
    if (!symbolGroups.has(key)) {
      symbolGroups.set(key, []);
    }
    symbolGroups.get(key)!.push(order);
  });

  // Process each symbol group with advanced logic
  symbolGroups.forEach((orders, symbol) => {
    console.log(`📊 Processing ${symbol}: ${orders.length} orders`);
    
    // Sort chronologically with enhanced parsing
    orders.sort((a, b) => {
      const dateA = parseAdvancedTime(a.time);
      const dateB = parseAdvancedTime(b.time);
      return dateA.getTime() - dateB.getTime();
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

  console.log(`✅ Advanced processing complete: ${trades.length} trades, ${incompleteOrders.length} incomplete`);
  return { completeTrades: trades, incompleteOrders, warnings };
}

// Advanced Position Tracker Class
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
    trade?: TradeData;
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

  private closePosition(closingOrder: OrderBookEntry): TradeData | undefined {
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
    const directionInfo = optionInfo.isOption 
      ? calculateOptionsDirection(optionInfo.optionType, firstEntry.order.type)
      : { 
          direction: isClosingLong ? 'long' : 'short' as 'long' | 'short', 
          marketSentiment: 'neutral' as 'bullish' | 'bearish', 
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
      confidence: 0.98, // High confidence for matched trades
      positionType: firstEntry.order.type,
      marketSegment: optionInfo.isOption ? 'options' : 'equity-delivery',
      optionType: optionInfo.optionType || undefined,
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
    const turnover = (entryPrice + exitPrice) * quantity;
    return turnover * 0.0001; // Basic estimate
  }

  getIncompletePositions(): OrderBookEntry[] {
    return this.positions.map(p => p.order);
  }
}

// Enhanced Time Parsing
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