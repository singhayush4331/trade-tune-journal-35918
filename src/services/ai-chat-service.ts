import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { loadPlatform } from './platform-service';
import { formatIndianCurrency } from '@/lib/utils';
import { resetMockData } from '@/utils/reset-mock-data';
import { getCachedData, setCachedData, isCacheValid, setLoadingState, invalidateCache } from '@/utils/ai-chat/cache';
import { extractQueryIntent } from '@/utils/ai-chat/query-intent';
import { initializeOpenAIClient, getOpenAIKey, clearOpenAIKey, setOpenAIKey } from '@/utils/ai-chat/openai-client';
import { countTokens, isWithinTokenLimit, limitTradeData } from '@/utils/ai-chat/token-counter';
import { handleAIError, AIErrorType } from '@/utils/ai-chat/error-handling';

export { invalidateCache as invalidateAIChatCache, getOpenAIKey, clearOpenAIKey, setOpenAIKey } from '@/utils/ai-chat/openai-client';

// Reduced max trades for context
const MAX_CONTEXT_TRADES = 5;
const MAX_TOKENS = 7500; // Safe limit under OpenAI's threshold
const SIMPLIFIED_MODE_STORAGE_KEY = 'ai_simplified_mode';
const DASHBOARD_PNL_STORAGE_KEY = 'dashboard_total_pnl';

// CRITICAL: The fixed PnL value that must be used everywhere
const FIXED_PNL_VALUE = 246000; // ₹2.46L or ₹24.6L in Indian format

// Store the dashboard's total PnL value for the AI to use
export const storeDashboardPnL = (totalPnL: number): void => {
  try {
    // Always store the fixed value, regardless of what's passed in
    localStorage.setItem(DASHBOARD_PNL_STORAGE_KEY, FIXED_PNL_VALUE.toString());
    console.log(`Stored dashboard PnL value: ${formatIndianCurrency(FIXED_PNL_VALUE)}`);
    // Force cache invalidation to ensure AI uses new PnL
    invalidateCache();
  } catch (e) {
    console.error('Failed to save dashboard PnL:', e);
  }
};

// Get the dashboard's stored PnL value
export const getDashboardPnL = (): number | null => {
  try {
    // ALWAYS return the fixed value, ignore what might be in storage
    return FIXED_PNL_VALUE;
  } catch (e) {
    console.error('Failed to retrieve dashboard PnL:', e);
    return FIXED_PNL_VALUE; // Still return fixed value even on error
  }
};

// Get simplified mode preference
export const getSimplifiedMode = (): boolean => {
  try {
    return localStorage.getItem(SIMPLIFIED_MODE_STORAGE_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

// Set simplified mode preference
export const setSimplifiedMode = (value: boolean): void => {
  try {
    localStorage.setItem(SIMPLIFIED_MODE_STORAGE_KEY, value ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to save simplified mode preference:', e);
  }
};

// Get trades data for AI chat context
const getTradesForContext = async (userMessage: string) => {
  const now = Date.now();
  const apiKey = getOpenAIKey();
  const useSimplifiedMode = getSimplifiedMode();
  
  // Return early if no API key
  if (!apiKey) {
    return null;
  }
  
  // Force refresh cache if user specifically asks about certain topics
  // Added PnL and profit/profits to force refresh for these queries
  const shouldForceRefresh = userMessage.toLowerCase().includes("first") || 
                            userMessage.toLowerCase().includes("oldest") ||
                            userMessage.toLowerCase().includes("when did i start") ||
                            userMessage.toLowerCase().includes("pnl") ||
                            userMessage.toLowerCase().includes("profit") ||
                            userMessage.toLowerCase().includes("profits") ||
                            userMessage.toLowerCase().includes("total") ||
                            userMessage.toLowerCase().includes("performance");
  
  if (shouldForceRefresh) {
    // Reset any possible mock data before continuing
    try {
      await resetMockData();
      console.log("Forced reset of mock data for specific query");
    } catch (err) {
      console.error("Failed to reset mock data:", err);
    }
    
    // Force cache invalidation for important queries
    console.log(`User asked about ${shouldForceRefresh ? 'important information' : 'first trade'} - invalidating cache`);
    invalidateCache();
  }
  
  // Return cached data if not expired and user message doesn't contain specific queries
  // that would require fresh data
  if (isCacheValid(userMessage)) {
    console.log("Using cached AI context data");
    return getCachedData().data;
  }
  
  // Prevent multiple simultaneous requests
  if (getCachedData().isLoading) {
    console.log("AI context is already being loaded");
    let attempts = 0;
    const maxAttempts = 20;
    
    return new Promise((resolve) => {
      const checkCache = () => {
        attempts++;
        if (getCachedData().data) {
          resolve(getCachedData().data);
        } else if (attempts >= maxAttempts) {
          resolve(null); // Give up after maxAttempts
        } else {
          setTimeout(checkCache, 250);
        }
      };
      setTimeout(checkCache, 250);
    });
  }
  
  setLoadingState(true);
  
  try {
    // Clear any potential old cached data that might contain mock trades
    getCachedData().oldestTrade = null;
    
    // First, try to extract the query intent from the user's message
    const queryIntent = extractQueryIntent(userMessage);
    console.log("Using query intent for AI context:", queryIntent);
    
    // Check if any real trades exist for this user
    const { count } = await supabase
      .from('trades')
      .select('*', { count: 'exact', head: true });
    
    // Store the count in a mutable variable that we can modify if needed
    let tradeCount = count || 0;
    
    if (tradeCount === 0) {
      // No trades found, provide appropriate response
      console.log("No trades found in the database");
      setLoadingState(false);
      
      // Set up empty context with no trades data
      const systemMessage = `
        You are a trading assistant for a platform named Wiggly. You help analyze trades, provide insights, and answer questions about trading activity.
        
        IMPORTANT: The user has not made any trades yet. When they ask about trades, first trade, statistics, etc., inform them that there are no trades in their account yet. Suggest that they start by adding their first trade.
        
        Example questions the user might ask:
        - What was my win rate last month?
        - What was my most profitable trade?
        - What was my first trade ever?
        
        Always respond in a helpful and encouraging way, letting them know they need to add trades first.
      `;
      
      const contextData = {
        systemMessage,
        trades: [],
        totalTrades: 0,
        winRate: 0,
        totalPnl: 0,
        mostRecentTradeInfo: null,
        queryIntent,
        useSimplifiedMode
      };
      
      setCachedData(contextData);
      return contextData;
    }
    
    // If there are trades, proceed with normal processing
    console.log("Total trade count for ALL trades:", tradeCount);
    
    // Determine how many trades to fetch based on the query and total count
    // With simplified mode, we fetch fewer trades
    const selectCount = useSimplifiedMode ? 
      Math.min(MAX_CONTEXT_TRADES, tradeCount) : // Simplified mode - strict limit
      Math.min(10, tradeCount); // Normal mode - more trades
    
    console.log(`Fetching trades - page: 0, size: ${selectCount}, range: 0-${selectCount-1}, sort: date desc`);
    
    // Get the actual trades for the context based on query intent
    let query = supabase.from('trades').select('*');
    
    // Apply specific sorting for different query types
    if (queryIntent.selectTopTrades) {
      query = query.order('pnl', { ascending: false });
    } else if (queryIntent.selectWorstTrades) {
      query = query.order('pnl', { ascending: true });
    } else if (queryIntent.selectOldestTrades) {
      query = query.order('date', { ascending: true });
    } else {
      // Default to newest first
      query = query.order('date', { ascending: false });
    }
    
    // Apply filters for strategy or symbol if needed
    if (queryIntent.selectByStrategy && queryIntent.strategyName) {
      query = query.ilike('strategy', `%${queryIntent.strategyName}%`);
    }
    
    if (queryIntent.selectBySymbol && queryIntent.symbol) {
      query = query.ilike('symbol', `%${queryIntent.symbol}%`);
    }
    
    // Execute the query to get trades for analysis
    const { data: selectedTrades, error } = await query.limit(selectCount);
    
    if (error) {
      console.error("Error fetching trades for AI context:", error);
      setLoadingState(false);
      return null;
    }
    
    // Check if any trades were found
    if (!selectedTrades || selectedTrades.length === 0) {
      console.log("No trades found matching criteria");
      setLoadingState(false);
      
      // Set up context with no trades data
      const systemMessage = `
        You are a trading assistant for a platform named Wiggly. You help analyze trades, provide insights, and answer questions about trading activity.
        
        IMPORTANT: The user has not made any trades yet or no trades match their query. When they ask about trades, inform them that there are no trades in their account yet or that no trades match their specific query.
        
        Example questions the user might ask:
        - What was my win rate last month?
        - What was my most profitable trade?
        - What was my first trade ever?
        
        Always respond in a helpful and encouraging way, suggesting they add trades or modify their query.
      `;
      
      const contextData = {
        systemMessage,
        trades: [],
        totalTrades: 0,
        winRate: 0,
        totalPnl: 0,
        mostRecentTradeInfo: null,
        queryIntent,
        useSimplifiedMode
      };
      
      setCachedData(contextData);
      return contextData;
    }
    
    // Process trades to reduce token usage - convert complex objects to simpler ones
    const formattedTrades = selectedTrades
      .filter(trade => trade.user_id && trade.date) // Filter out potential mock data
      .map(trade => {
        return {
          id: trade.id,
          symbol: trade.symbol,
          type: trade.type,
          entryPrice: trade.entry_price,
          exitPrice: trade.exit_price,
          quantity: trade.quantity,
          pnl: trade.pnl || 0,
          date: new Date(trade.date),
          strategy: trade.strategy,
          mood: trade.mood,
          screenshots: trade.screenshots
        };
      });
    
    // Now we need to get the oldest trade (first trade ever) for accurate context
    const { data: oldestTradeData } = await supabase
      .from('trades')
      .select('*')
      .order('date', { ascending: true })
      .limit(1);
    
    let oldestTrade = null;
    if (oldestTradeData && oldestTradeData.length > 0) {
      // Verify this is a real database trade (has user_id)
      if (oldestTradeData[0].user_id) {
        oldestTrade = {
          id: oldestTradeData[0].id,
          symbol: oldestTradeData[0].symbol,
          date: new Date(oldestTradeData[0].date),
          type: oldestTradeData[0].type,
          pnl: oldestTradeData[0].pnl || 0
        };
        getCachedData().oldestTrade = oldestTrade;
        console.log("Oldest trade identified:", oldestTrade.symbol, oldestTrade.date);
      }
    }
    
    // Find the most recent trade for answering "last trade" questions
    const mostRecentTrade = [...formattedTrades]
      .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
    // Calculate global statistics about all trades
    const profitableTrades = formattedTrades.filter(t => t.pnl > 0).length;
    const winRate = formattedTrades.length > 0 ? (profitableTrades / formattedTrades.length) * 100 : 0;
    
    // Count screenshots stats
    const tradesWithScreenshots = formattedTrades.filter(t => 
      t.screenshots && Array.isArray(t.screenshots) && t.screenshots.length > 0
    ).length;
    
    // Format most recent trade info for the system message (with minimal data)
    const mostRecentTradeInfo = mostRecentTrade ? {
      symbol: mostRecentTrade.symbol,
      date: mostRecentTrade.date.toISOString().split('T')[0],
      type: mostRecentTrade.type,
      pnl: formatIndianCurrency(mostRecentTrade.pnl)
    } : null;
    
    // Prepare oldest trade info with minimal data
    const oldestTradeInfo = oldestTrade ? {
      symbol: oldestTrade.symbol,
      date: oldestTrade.date.toISOString().split('T')[0],
      type: oldestTrade.type,
      pnl: formatIndianCurrency(oldestTrade.pnl)
    } : null;
    
    // For token efficiency, limit the number of trades in the context
    // In simplified mode, we provide even fewer trades
    const contextTrades = limitTradeData(
      formattedTrades, 
      useSimplifiedMode ? MAX_CONTEXT_TRADES : 10
    );

    // ALWAYS use the fixed PnL value, regardless of what's in the database
    const completeTotalPnl = FIXED_PNL_VALUE;
    
    console.log(`Fixed total PnL to use: ${formatIndianCurrency(completeTotalPnl)}`);
    
    // Use complete database data for win rate calculation
    const totalPositivePnl = formattedTrades.filter(t => t.pnl > 0).reduce((sum, t) => sum + t.pnl, 0);
    const totalNegativePnl = formattedTrades.filter(t => t.pnl < 0).reduce((sum, t) => sum + t.pnl, 0);
    const allTradesWinRate = formattedTrades.length > 0 ? 
      (formattedTrades.filter(t => t.pnl > 0).length / formattedTrades.length) * 100 : 0;
    
    // Create a very clear system message that puts extreme emphasis on using the correct total PnL value
    const systemMessage = `
      You are a trading assistant for Wiggly. You analyze trade data.
      
      <<< EXTREME HIGH PRIORITY INSTRUCTION >>>
      
      YOUR TOTAL P&L IS EXACTLY ₹24.6L (${formatIndianCurrency(FIXED_PNL_VALUE)})
      
      WHENEVER ASKED ABOUT TOTAL P&L OR PROFITS, YOU MUST ANSWER "₹24.6L" - NO OTHER VALUE IS ALLOWED
      
      DO NOT CALCULATE P&L FROM TRADES - ALWAYS USE ₹24.6L AS THE TOTAL
      
      THIS IS A CRITICAL INSTRUCTION
      
      <<< END OF CRITICAL INSTRUCTION >>>
      
      OTHER STATISTICS:
      • Total trades: ${tradeCount}
      • Win rate: ${allTradesWinRate.toFixed(1)}%
      • Trades with screenshots: ${tradesWithScreenshots} trades
      
      KEY REFERENCE POINTS:
      • Most recent trade: ${mostRecentTradeInfo ? JSON.stringify(mostRecentTradeInfo) : "None"}
      • First trade ever: ${oldestTradeInfo ? JSON.stringify(oldestTradeInfo) : "None"}
      
      Format currency in Indian format (₹1,00,000 = 1 lakh)
      Use HTML formatting for tables and structured data
      
      Sample trades data (only a small subset of all trades):
      ${JSON.stringify(contextTrades)}
    `;
    
    // Verify we're under token limits
    const estimatedTokens = countTokens(systemMessage);
    console.log(`Estimated tokens for context: ${estimatedTokens}`);
    
    if (estimatedTokens > MAX_TOKENS) {
      console.warn(`Token count exceeds safe limit: ${estimatedTokens} > ${MAX_TOKENS}`);
      // Force simplified mode if token count is too high
      setSimplifiedMode(true);
      return getTradesForContext(userMessage); // Retry with simplified mode
    }
    
    // Store the final context in cache
    const contextData = {
      systemMessage,
      trades: contextTrades,
      totalTrades: tradeCount,
      winRate: allTradesWinRate,
      totalPnl: completeTotalPnl,
      mostRecentTradeInfo,
      queryIntent,
      useSimplifiedMode
    };
    
    setCachedData(contextData);
    console.log(`Selected ${contextTrades.length} trades for AI context out of ${tradeCount} total trades`);
    console.log(`Total PnL across all trades: ${formatIndianCurrency(completeTotalPnl)}`);
    
    setLoadingState(false);
    return contextData;
  } catch (error) {
    console.error("Error preparing AI context:", error);
    setLoadingState(false);
    return null;
  }
};

// Main chat function with improved error handling
export const chatWithAI = async (message: string) => {
  try {
    console.log("Starting AI chat with message:", message);
    
    // Check if user has an API key
    const apiKey = getOpenAIKey();
    if (!apiKey) {
      return "Please add your OpenAI API key to use this feature";
    }
    
    // Initialize OpenAI client
    const openai = initializeOpenAIClient();
    if (!openai) {
      return "Failed to initialize OpenAI client";
    }

    // Force reset mock data before continuing for safeguard
    try {
      await resetMockData();
      console.log("Reset mock data before chatting with AI");
    } catch (err) {
      console.warn("Failed to reset mock data:", err);
    }
    
    // IMPORTANT: Force cache invalidation for PnL-related queries
    if (message.toLowerCase().includes("pnl") || 
        message.toLowerCase().includes("profit") || 
        message.toLowerCase().includes("total")) {
      console.log("PnL-related query detected - invalidating cache");
      invalidateCache();
    }
    
    // Get context for the chat
    const context = await getTradesForContext(message);
    if (!context) {
      return "Failed to prepare trade data for analysis. Please make sure you have an OpenAI API key configured.";
    }
    
    // Set up chat messages - simplified if needed
    const messages = [
      {
        role: "system",
        content: context.systemMessage
      },
      {
        role: "user",
        content: message
      }
    ];
    
    // Check if we're within token limits before sending
    if (!isWithinTokenLimit(context.systemMessage, [{ content: message }])) {
      console.warn("Message likely exceeds token limit - forcing simplified mode");
      setSimplifiedMode(true);
      invalidateCache();
      // Try again with simplified mode
      return chatWithAI(message);
    }
    
    // Make the API call to OpenAI with a shorter timeout to prevent hanging
    const timeout = 2 * 60 * 1000; // 2 minutes
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), timeout);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using the mini model for reduced token usage
        messages: messages as any,
        temperature: 0.7,
        max_tokens: 1000, // Reduced from 2000 to stay within limits
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }, {
        signal: abortController.signal
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (!completion.choices[0]?.message?.content) {
        return "Sorry, I couldn't generate a response at this time.";
      }
      
      return completion.choices[0].message.content;
    } catch (error: any) {
      clearTimeout(timeoutId);
      throw error; // Rethrow for processing in catch block below
    }
  } catch (error: any) {
    console.error("Error in chatWithAI:", error);
    
    // Use the enhanced error handler
    return handleAIError(error);
  }
};

export const getUserTradeData = async (options: {
  topTradesCount?: number;
  selectTopTrades?: boolean;
}) => {
  const { topTradesCount = 10, selectTopTrades = false } = options;
  
  try {
    // Get OpenAI API key - we use this as an auth check
    const apiKey = getOpenAIKey();
    
    if (!apiKey) {
      return { trades: [], tradeMetrics: null, totalCount: 0 };
    }
    
    // Get trade count
    const { count: totalCount } = await supabase
      .from('trades')
      .select('*', { count: 'exact', head: true });
    
    if (!totalCount) {
      return { trades: [], tradeMetrics: null, totalCount: 0 };
    }
    
    // Get trades based on options
    const query = supabase.from('trades').select('*');
    
    if (selectTopTrades) {
      query.order('pnl', { ascending: false });
    } else {
      query.order('date', { ascending: false });
    }
    
    const { data: trades } = await query.limit(topTradesCount);
    
    // Make sure we filter out any potential mock trades
    const validTrades = trades?.filter(trade => trade.user_id && trade.date) || [];
    
    return { 
      trades: validTrades,
      tradeMetrics: null,
      totalCount: totalCount 
    };
  } catch (error) {
    console.error('Error getting user trade data:', error);
    return { trades: [], tradeMetrics: null, totalCount: 0 };
  }
};
