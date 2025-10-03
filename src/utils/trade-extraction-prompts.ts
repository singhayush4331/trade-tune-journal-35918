// Advanced AI Prompts for Foolproof Trade Extraction
// Specialized prompts for different brokers and scenarios

export interface PromptConfig {
  systemPrompt: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
}

/**
 * Gets specialized extraction prompt based on detected broker
 */
export function getExtractionPrompt(detectedBroker?: string): PromptConfig {
  const basePrompt = getBaseExtractionPrompt();
  const brokerSpecific = getBrokerSpecificPrompt(detectedBroker);
  
  return {
    systemPrompt: `${basePrompt}\n\n${brokerSpecific}`,
    userPrompt: 'Extract all trading orders from this order book screenshot with maximum accuracy:',
    temperature: 0.1,
    maxTokens: 2000
  };
}

/**
 * Core extraction prompt with advanced instructions
 */
function getBaseExtractionPrompt(): string {
  return `You are an expert at extracting trading data from Indian broker order book screenshots with 99%+ accuracy.

CRITICAL EXECUTION RULES:
1. EXTRACT EVERY SINGLE ROW - Even if partially visible, extract what you can see
2. FOCUS ON TRADED PRICE COLUMNS ONLY - Never use limit prices or LTP
3. READ BUY/SELL INDICATORS EXTREMELY CAREFULLY - This is the most common error
4. VERIFY TIME EXTRACTION - OCR often misreads times, double-check each digit
5. SCAN TOP ROWS FIRST - These are often missed but contain recent trades

COLUMN IDENTIFICATION STRATEGY:
Primary Target: "Traded Price", "Executed Price", "Fill Price", "Avg Price"
Secondary: "Price" (if clearly execution price)
NEVER USE: "Limit Price", "Order Price", "Stop Price", "LTP", "Market Price"

Price Column Hierarchy (in order of preference):
1. "Traded Price" / "Trade Price"
2. "Executed Price" / "Execution Price"  
3. "Fill Price" / "Filled Price"
4. "Avg Price" / "Average Price"
5. "Price" (only if context suggests execution price)

OPTIONS TRADING SPECIFIC RULES:
- For Options: Extract full contract details (NIFTY25807246550PE)
- Understand Position Types:
  * BUY CE = BULLISH (Long Call)
  * BUY PE = BEARISH (Long Put)  
  * SELL CE = BEARISH (Short Call)
  * SELL PE = BULLISH (Short Put)
- Auto-detect underlying symbols (NIFTY, BANKNIFTY, etc.)
- Recognize lot sizes and contract multipliers

BUY/SELL DETECTION RULES:
1. Look for explicit text: "Buy", "B", "Sell", "S"
2. Check color coding: Green typically = Buy, Red = Sell
3. Verify with quantity signs: +/- indicators
4. Cross-reference with position changes
5. For options: Ensure direction matches position intent

TIME EXTRACTION WITH OCR CORRECTION:
Common OCR Errors and Corrections:
- 0 ↔ O (Zero vs Letter O)
- 1 ↔ I ↔ l (One vs Letter I vs lowercase L)  
- 6 ↔ G (Six vs Letter G)
- 8 ↔ B (Eight vs Letter B)
- 5 ↔ S (Five vs Letter S)
- 2 ↔ Z (Two vs Letter Z)

Time Validation Rules:
- Trading hours: 09:15 to 15:30 IST
- Format: HH:MM or HH:MM:SS
- If time shows 00:XX, likely 09:XX or 10:XX
- Verify chronological order makes sense

SYMBOL EXTRACTION RULES:
- Include exchange prefix if visible (NSE:, NFO:)
- For options, capture complete contract identifier
- Examples: "NSE:RELIANCE", "NFO:NIFTY25807246550PE"
- Never truncate or abbreviate symbols
- Maintain exact case and formatting

QUANTITY AND PRICE VALIDATION:
- Quantities must be positive integers
- Prices must be positive decimals
- Verify lot sizes for options (NIFTY=50, BANKNIFTY=15)
- Check price reasonableness for the symbol type

EXTRACTION COMPLETENESS VALIDATION:
After extraction, verify:
1. Both BUY and SELL orders exist for completed trades
2. Times are in chronological order
3. Prices are reasonable for the symbol type
4. All visible rows have been captured
5. No obvious OCR errors remain

Return data as JSON with this exact structure:
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
  "confidence": 0.95,
  "time_confidence": 0.95,
  "price_column_used": "Traded Price",
  "extraction_notes": "Found complete buy-sell pairs for all symbols",
  "validation_warnings": ["Any issues found during extraction"]
}`;
}

/**
 * Broker-specific extraction instructions
 */
function getBrokerSpecificPrompt(broker?: string): string {
  const brokerPrompts: Record<string, string> = {
    zerodha: `
ZERODHA/KITE SPECIFIC INSTRUCTIONS:
- Order book typically shows: Symbol, Qty, Price, Type, Status, Time
- Price column is usually labeled "Avg. Price" or "Price"
- Buy orders typically show in green, Sell in red
- Option symbols: NIFTY25807246550PE format
- Look for "EXECUTED" status orders only
- Time format usually HH:MM:SS
- Quantity column may show signed values (+/-)`,

    upstox: `
UPSTOX SPECIFIC INSTRUCTIONS:
- Order book layout: Symbol, Order Type, Qty, Price, Status, Time
- Price column labeled "Executed Price" or "Fill Price" 
- Clear BUY/SELL indicators in separate column
- Option symbols may have spaces: "NIFTY 24000 CE"
- Status column shows "COMPLETE" for executed orders
- Time in HH:MM format typically`,

    angelbroking: `
ANGEL BROKING SPECIFIC INSTRUCTIONS:
- Columns: Symbol, Type, Qty, Rate, Status, Time
- Price column labeled "Rate" or "Execution Rate"
- Type column clearly shows BUY/SELL
- Option symbols: Mixed formats possible
- Look for "EXECUTED" or "FILLED" status
- Time format varies: HH:MM or HH:MM:SS`,

    fyers: `
FYERS SPECIFIC INSTRUCTIONS:
- Order table: Symbol, Side, Qty, Price, Status, Time
- Price column labeled "Traded Price" 
- Side column shows BUY/SELL clearly
- Symbol format varies by segment
- Status shows "TRADED" or "EXECUTED"
- Clean time format in HH:MM:SS`,

    generic: `
GENERIC BROKER INSTRUCTIONS:
- Adapt to visible column headers
- Prioritize any column with "Traded", "Executed", or "Fill" in name
- Look for clear BUY/SELL indicators
- Verify execution status before including orders
- Handle various time and symbol formats flexibly`
  };

  return brokerPrompts[broker?.toLowerCase() || 'generic'];
}

/**
 * Gets validation prompt for verifying extracted data
 */
export function getValidationPrompt(extractedData: any): PromptConfig {
  return {
    systemPrompt: `You are a trading data validation expert. Review the extracted order data for accuracy and completeness.

VALIDATION CHECKLIST:
1. Are all BUY/SELL pairs correctly identified?
2. Do prices fall within reasonable ranges for the symbols?
3. Are times in chronological order and within trading hours?
4. Do option symbols follow correct naming conventions?
5. Are quantities appropriate for the market segment?

For any issues found, provide specific corrections and confidence adjustments.`,
    
    userPrompt: `Validate this extracted trading data and suggest any corrections: ${JSON.stringify(extractedData)}`,
    temperature: 0.2,
    maxTokens: 1000
  };
}

/**
 * Gets position matching prompt for complex scenarios
 */
export function getPositionMatchingPrompt(orders: any[]): PromptConfig {
  return {
    systemPrompt: `You are an expert at matching buy/sell orders into complete trades using FIFO logic.

POSITION MATCHING RULES:
1. Use strict chronological order (First In, First Out)
2. Match orders by exact symbol
3. Handle partial fills and position averaging
4. Identify incomplete positions that lack matching orders
5. Calculate accurate P&L for each matched trade

For options trading:
- Understand that buying/selling options doesn't always mean long/short
- BUY CE = Bullish, BUY PE = Bearish, SELL CE = Bearish, SELL PE = Bullish
- Match contracts by exact strike and expiry`,

    userPrompt: `Match these orders into complete trades using FIFO logic: ${JSON.stringify(orders)}`,
    temperature: 0.1,
    maxTokens: 1500
  };
}

/**
 * Gets error correction prompt for fixing common issues
 */
export function getErrorCorrectionPrompt(issues: string[]): PromptConfig {
  return {
    systemPrompt: `You are an OCR error correction specialist for trading data.

COMMON CORRECTIONS:
- Time errors: 0↔O, 1↔I, 6↔G, 8↔B, 5↔S, 2↔Z
- Price errors: Decimal point misplacement, digit confusion
- Symbol errors: Exchange prefix issues, option contract format
- Quantity errors: Lot size validation, sign errors

Fix only obvious errors while maintaining data integrity.`,

    userPrompt: `Correct these identified issues in the trading data: ${issues.join(', ')}`,
    temperature: 0.1,
    maxTokens: 800
  };
}