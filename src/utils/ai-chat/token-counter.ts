
import { encode } from "gpt-tokenizer";

/**
 * Counts the number of tokens in a string using the GPT tokenizer
 * @param text The text to count tokens for
 * @returns Number of tokens
 */
export const countTokens = (text: string): number => {
  if (!text) return 0;
  try {
    return encode(text).length;
  } catch (error) {
    console.error("Error counting tokens:", error);
    // Fallback to rough estimation (4 chars ≈ 1 token)
    return Math.ceil(text.length / 4);
  }
};

/**
 * Checks if a message's token count is within safe limits
 * @param systemPrompt The system prompt
 * @param messages The conversation history
 * @param maxTokens Maximum allowed tokens (default 8000)
 * @returns Whether the token count is safe
 */
export const isWithinTokenLimit = (
  systemPrompt: string, 
  messages: any[], 
  maxTokens: number = 8000
): boolean => {
  try {
    let totalTokens = countTokens(systemPrompt);
    
    for (const msg of messages) {
      totalTokens += countTokens(msg.content || "");
    }
    
    // Add 200 tokens as buffer for metadata
    return totalTokens + 200 < maxTokens;
  } catch (error) {
    console.error("Error calculating token limit:", error);
    return false;
  }
};

/**
 * Creates a simplified trade object with only essential fields
 * to reduce token usage
 */
export const createCompactTradeObject = (trade: any) => {
  if (!trade) return null;
  
  return {
    id: trade.id,
    symbol: trade.symbol,
    type: trade.type,
    entryPrice: trade.entryPrice,
    exitPrice: trade.exitPrice,
    quantity: trade.quantity,
    pnl: trade.pnl,
    date: trade.date instanceof Date ? trade.date.toISOString().split('T')[0] : 
          typeof trade.date === 'string' ? trade.date.split('T')[0] : null,
    strategy: trade.strategy,
    mood: trade.mood,
    // Only include count, not the actual screenshots
    screenshots: trade.screenshots ? 
      (Array.isArray(trade.screenshots) ? trade.screenshots.length : 0) : 0
  };
};

/**
 * Limits the trade data to essential information and a manageable number
 * @param trades The full trades array
 * @param limit Maximum number of trades to include
 * @returns Simplified trades array
 */
export const limitTradeData = (trades: any[], limit: number = 5): any[] => {
  if (!trades || !Array.isArray(trades)) return [];
  
  return trades
    .slice(0, limit)
    .map(createCompactTradeObject)
    .filter(Boolean);
};

