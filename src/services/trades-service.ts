// Optimized trades service with better caching and performance

import { supabase } from "@/integrations/supabase/client";
import { Trade, TradeFormData } from "@/utils/trade-form-types";
import { toast } from "sonner";
import { createFundsTransaction } from "./funds-service";
import { createStrategyIfNotExists } from "@/utils/playbook-utils";
import { loadDataInChunks } from "@/utils/performance-monitoring";
import { mockTrades } from "@/data/mockTradeData";
import { shouldUseMockData, isMockDataInitialized } from "./mock-data-service";
import { getSessionUser } from "@/utils/auth-cache";

// Enhanced caching with versioning and segmentation by page
const CACHE_DURATION = 5 * 60 * 1000; // Reduced to 5 minutes for better freshness
const PAGE_SIZE = 50; // Optimized size to balance initial load vs pagination

// Type-safe cache structure
interface TradeCache {
  data: Record<number, Trade[] | null>;  // Indexed by page number
  timestamp: Record<number, number>;
  isLoading: boolean;
  count: number | null;
}

// Create a properly initialized cache
let tradesCache: TradeCache = {
  data: {},
  timestamp: {},
  isLoading: false,
  count: null
};

export const clearTradesCache = () => {
  console.log("Clearing trades cache");
  tradesCache = {
    data: {},
    timestamp: {},
    isLoading: false,
    count: null
  };
};

if (typeof window !== 'undefined') {
  window.addEventListener('clearUserDataCache', () => {
    clearTradesCache();
  });
}

interface FetchTradesOptions {
  page?: number;
  pageSize?: number;
  forceRefresh?: boolean;
  getCountOnly?: boolean;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TradesResponse {
  data: Trade[] | null;
  error: Error | null;
  count?: number | null;
}

export interface TradeResponse {
  data: Trade | null;
  error: Error | null;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

// More efficient trade processing function with batch processing
const processTrades = (rawTrades: any[]): Trade[] => {
  if (!rawTrades || rawTrades.length === 0) return [];
  
  // Process in batches of 50 for better performance
  const processedTrades: Trade[] = [];
  const batchSize = 50;
  
  for (let i = 0; i < rawTrades.length; i += batchSize) {
    const batch = rawTrades.slice(i, i + batchSize);
    
    batch.forEach(trade => {
      processedTrades.push({
        ...trade,
        date: new Date(trade.date),
        createdAt: trade.created_at,
        updatedAt: trade.updated_at,
        entryTime: trade.entry_time,
        exitTime: trade.exit_time,
        entryPrice: trade.entry_price,
        exitPrice: trade.exit_price,
        riskToReward: trade.risk_reward_ratio
      });
    });
  }
  
  return processedTrades;
};

export const fetchUserTrades = async (options: FetchTradesOptions = {}): Promise<TradesResponse> => {
  const { 
    page = 0, 
    pageSize = PAGE_SIZE, 
    forceRefresh = false, 
    getCountOnly = false,
    sortField = 'date',
    sortOrder = 'desc'
  } = options;

  // Check if we're using trial mock data - get actual trial status
  const user = await getSessionUser();
  let useTrialMockData = false;
  
  if (user) {
    // Calculate if user is still in trial period (24 hours after signup)
    const createdAt = user.created_at ? new Date(user.created_at) : null;
    const now = new Date();
    const isTrialActive = createdAt && ((now.getTime() - createdAt.getTime()) < (24 * 60 * 60 * 1000));
    
    useTrialMockData = Boolean(isTrialActive && isMockDataInitialized());
    if (process.env.NODE_ENV === 'development') {
      console.log('Trial status check:', {
        isTrialActive,
        hasMockData: isMockDataInitialized(),
        useTrialMockData,
        userCreatedAt: createdAt
      });
    }
  }
  
  if (useTrialMockData) {
    console.log("Using mock trade data for trial user");
    
    // For count-only requests
    if (getCountOnly) {
      return { data: null, error: null, count: mockTrades.length };
    }
    
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    // Sort mock trades according to requested sort
    const sortedMockTrades = [...mockTrades].sort((a, b) => {
      if (sortField === 'date') {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return sortOrder === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      if (sortField === 'symbol') {
        return sortOrder === 'asc'
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      }
      
      if (sortField === 'pnl') {
        return sortOrder === 'asc' ? a.pnl - b.pnl : b.pnl - a.pnl;
      }
      
      return 0;
    });
    
    // Return paginated mock trades
    const paginatedTrades = sortedMockTrades.slice(from, to + 1);
    return {
      data: paginatedTrades,
      error: null,
      count: mockTrades.length
    };
  }
  
  // If not using mock data, proceed with original logic
  if (!user) {
    return { data: [], error: null, count: 0 };
  }
  // Check if we have a valid cached version for this page
  const now = Date.now();
  const cachedData = tradesCache.data[page];
  const cachedTimestamp = tradesCache.timestamp[page] || 0;
  
  if (!forceRefresh && 
      !getCountOnly &&
      cachedData && 
      (now - cachedTimestamp < CACHE_DURATION) && 
      !tradesCache.isLoading) {
    return { 
      data: cachedData, 
      error: null, 
      count: tradesCache.count 
    };
  }
  
  // Handle concurrent requests for same data
  if (tradesCache.isLoading) {
    // Wait briefly for loading to complete
    let attempts = 0;
    const maxAttempts = 30;
    
    while (tradesCache.isLoading && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 50));
      attempts++;
    }
    
    if (attempts < maxAttempts && tradesCache.data[page]) {
      return { 
        data: tradesCache.data[page], 
        error: null, 
        count: tradesCache.count 
      };
    }
  }
  
  tradesCache.isLoading = true;
  
  try {
    if (getCountOnly) {
      const { count, error } = await supabase
        .from('trades')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      tradesCache.count = count;
      tradesCache.isLoading = false;
      
      return { data: null, error: null, count };
    }
    
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    console.log(`Fetching trades - page: ${page}, size: ${pageSize}, range: ${from}-${to}, sort: ${sortField} ${sortOrder}`);
    
    // Use more efficient query with fewer columns for initial loads
    const initialColumns = 'id, date, symbol, pnl, type, entry_price, exit_price, quantity';
    const allColumns = '*';
    
    const query = supabase
      .from('trades')
      .select(page === 0 ? allColumns : initialColumns, { count: 'exact' })
      .eq('user_id', user.id)
      .order(sortField, { ascending: sortOrder === 'asc' })
      .range(from, to);
      
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Process trades more efficiently
    const processedTrades = processTrades(data);
    
    // Update cache for this page
    tradesCache.data[page] = processedTrades;
    tradesCache.timestamp[page] = now;
    
    if (count !== undefined) {
      tradesCache.count = count;
    }
    
    tradesCache.isLoading = false;
    
    return { 
      data: processedTrades, 
      error: null, 
      count 
    };
  } catch (error: any) {
    console.error("Error fetching trades:", error);
    tradesCache.isLoading = false;
    return { data: null, error, count: tradesCache.count };
  }
};

// Helper function to prepare screenshots array
const prepareScreenshots = (entryScreenshot: string | null | undefined, exitScreenshot: string | null | undefined): string[] | null => {
  const screenshots: string[] = [];
  
  if (entryScreenshot) {
    screenshots.push(entryScreenshot);
  }
  
  if (exitScreenshot) {
    screenshots.push(exitScreenshot);
  }
  
  return screenshots.length > 0 ? screenshots : null;
};

export const createTrade = async (tradeData: TradeFormData, pl: number, brokerage: number): Promise<TradeResponse> => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    if (tradeData.strategy) {
      await createStrategyIfNotExists(tradeData.strategy);
    }
    
    let entryTimeISO = null;
    let exitTimeISO = null;
    
    if (tradeData.entryTime) {
      const tradeDate = new Date(tradeData.date);
      const [hours, minutes] = tradeData.entryTime.split(':').map(Number);
      tradeDate.setHours(hours, minutes, 0, 0);
      entryTimeISO = tradeDate.toISOString();
    }
    
    if (tradeData.exitTime) {
      const tradeDate = new Date(tradeData.date);
      const [hours, minutes] = tradeData.exitTime.split(':').map(Number);
      tradeDate.setHours(hours, minutes, 0, 0);
      exitTimeISO = tradeDate.toISOString();
    }
    
    const newTrade = {
      user_id: userId,
      symbol: tradeData.symbol,
      entry_price: parseFloat(tradeData.entryPrice) || 0,
      exit_price: parseFloat(tradeData.exitPrice) || 0,
      quantity: parseInt(tradeData.quantity) || 0,
      date: new Date(tradeData.date).toISOString(),
      type: tradeData.tradeType,
      notes: tradeData.notes,
      mood: tradeData.mood,
      pnl: pl,
      strategy: tradeData.strategy || null,
      risk_reward_ratio: tradeData.riskToReward || null, // Save as risk_reward_ratio in DB
      screenshots: prepareScreenshots(tradeData.entryScreenshot, tradeData.exitScreenshot),
      entry_time: entryTimeISO,
      exit_time: exitTimeISO,
      market_segment: tradeData.marketSegment || 'equity-delivery',
      option_type: tradeData.optionType || null,
      position_type: tradeData.positionType || null,
      exchange: tradeData.exchange || 'NSE'
    };
    
    const { data, error } = await supabase
      .from('trades')
      .insert(newTrade)
      .select()
      .single();
    
    if (error) throw error;
    
    if (pl !== 0) {
      try {
        const transactionType = pl > 0 ? 'deposit' : 'withdrawal';
        const amount = Math.abs(pl);
        const notes = `${pl > 0 ? 'Profit' : 'Loss'} from ${tradeData.symbol} trade`;
        
        await createFundsTransaction(amount, transactionType, notes, new Date(tradeData.date));
        console.log(`Added ${transactionType} of ${amount} to funds from trade P&L`);
      } catch (fundError) {
        console.error("Error syncing trade P&L with funds:", fundError);
        toast.error("Trade saved but failed to update funds with P&L");
      }
    }
    
    // Removed success toast notification from here since it's already handled in TradeForm.tsx
    
    const processedTrade = {
      ...data,
      date: new Date(data.date),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      entryTime: data.entry_time,
      exitTime: data.exit_time,
      riskToReward: data.risk_reward_ratio || '', // Map from risk_reward_ratio
      entryPrice: data.entry_price,
      exitPrice: data.exit_price,
      optionType: (data.option_type === 'CE' || data.option_type === 'PE') ? data.option_type as 'CE' | 'PE' : undefined,
      option_type: (data.option_type === 'CE' || data.option_type === 'PE') ? data.option_type as 'CE' | 'PE' : undefined,
      positionType: (data.position_type === 'buy' || data.position_type === 'sell') ? data.position_type as 'buy' | 'sell' : undefined,
      position_type: (data.position_type === 'buy' || data.position_type === 'sell') ? data.position_type as 'buy' | 'sell' : undefined,
      marketSegment: data.market_segment,
      market_segment: data.market_segment
    };
    
    tradesCache.timestamp = {};
    tradesCache.data = {};
    
    dispatchTradeEvents();
    
    dispatchPlaybookEvents();
    
    return { data: processedTrade, error: null };
  } catch (error: any) {
    console.error("Error creating trade:", error);
    toast.error(error.message || "Failed to create trade");
    return { data: null, error };
  }
};

export const updateTrade = async (tradeId: string, tradeData: TradeFormData, pl: number, brokerage: number): Promise<TradeResponse> => {
  try {
    const { data: prevTrade } = await fetchTradeById(tradeId);
    const prevPL = prevTrade ? prevTrade.pnl : 0;
    
    if (tradeData.strategy && prevTrade?.strategy !== tradeData.strategy) {
      await createStrategyIfNotExists(tradeData.strategy);
    }
    
    let entryTimeISO = null;
    let exitTimeISO = null;
    
    if (tradeData.entryTime) {
      const tradeDate = new Date(tradeData.date);
      const [hours, minutes] = tradeData.entryTime.split(':').map(Number);
      tradeDate.setHours(hours, minutes, 0, 0);
      entryTimeISO = tradeDate.toISOString();
    }
    
    if (tradeData.exitTime) {
      const tradeDate = new Date(tradeData.date);
      const [hours, minutes] = tradeData.exitTime.split(':').map(Number);
      tradeDate.setHours(hours, minutes, 0, 0);
      exitTimeISO = tradeDate.toISOString();
    }
    
    const updatedTrade = {
      symbol: tradeData.symbol,
      entry_price: parseFloat(tradeData.entryPrice) || 0,
      exit_price: parseFloat(tradeData.exitPrice) || 0,
      quantity: parseInt(tradeData.quantity) || 0,
      date: new Date(tradeData.date).toISOString(),
      type: tradeData.tradeType,
      notes: tradeData.notes,
      mood: tradeData.mood,
      pnl: pl,
      strategy: tradeData.strategy || null,
      risk_reward_ratio: tradeData.riskToReward || null, // Use risk_reward_ratio
      screenshots: prepareScreenshots(tradeData.entryScreenshot, tradeData.exitScreenshot),
      entry_time: entryTimeISO,
      exit_time: exitTimeISO,
      market_segment: tradeData.marketSegment || 'equity-delivery',
      option_type: tradeData.optionType || null,
      position_type: tradeData.positionType || null,
      exchange: tradeData.exchange || 'NSE'
    };
    
    const { data, error } = await supabase
      .from('trades')
      .update(updatedTrade)
      .eq('id', tradeId)
      .select()
      .single();
    
    if (error) throw error;
    
    if (pl !== prevPL) {
      try {
        const plDifference = pl - prevPL;
        const transactionType = plDifference > 0 ? 'deposit' : 'withdrawal';
        const amount = Math.abs(plDifference);
        const notes = `Adjusted P&L from ${tradeData.symbol} trade update`;
        
        if (plDifference !== 0) {
          await createFundsTransaction(amount, transactionType, notes, new Date(tradeData.date));
          console.log(`Added ${transactionType} of ${amount} to funds from updated trade P&L`);
        }
      } catch (fundError) {
        console.error("Error syncing updated trade P&L with funds:", fundError);
        toast.error("Trade updated but failed to update funds with P&L change");
      }
    }
    
    // Removed success toast notification from here since it's already handled in TradeForm.tsx
    
    const processedTrade = {
      ...data,
      date: new Date(data.date),
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      entryTime: data.entry_time,
      exitTime: data.exit_time,
      riskToReward: data.risk_reward_ratio || '', // Map from risk_reward_ratio
      entryPrice: data.entry_price,
      exitPrice: data.exit_price,
      optionType: (data.option_type === 'CE' || data.option_type === 'PE') ? data.option_type as 'CE' | 'PE' : undefined,
      option_type: (data.option_type === 'CE' || data.option_type === 'PE') ? data.option_type as 'CE' | 'PE' : undefined,
      positionType: (data.position_type === 'buy' || data.position_type === 'sell') ? data.position_type as 'buy' | 'sell' : undefined,
      position_type: (data.position_type === 'buy' || data.position_type === 'sell') ? data.position_type as 'buy' | 'sell' : undefined,
      marketSegment: data.market_segment,
      market_segment: data.market_segment
    };
    
    tradesCache.timestamp = {};
    tradesCache.data = {};
    
    dispatchTradeEvents();
    
    dispatchPlaybookEvents();
    
    return { data: processedTrade, error: null };
  } catch (error: any) {
    console.error("Error updating trade:", error);
    toast.error(error.message || "Failed to update trade");
    return { data: null, error };
  }
};

export const deleteTrade = async (tradeId: string): Promise<{ error: any }> => {
  try {
    const { data: trade } = await fetchTradeById(tradeId);
    const tradePL = trade ? trade.pnl : 0;
    
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);
    
    if (error) throw error;
    
    if (trade && tradePL !== 0) {
      try {
        const transactionType = tradePL > 0 ? 'withdrawal' : 'deposit';
        const amount = Math.abs(tradePL);
        const notes = `Reversal for deleted ${trade.symbol} trade`;
        
        await createFundsTransaction(amount, transactionType, notes);
        console.log(`Added ${transactionType} of ${amount} to funds for deleted trade`);
      } catch (fundError) {
        console.error("Error reverting P&L in funds for deleted trade:", fundError);
        toast.error("Trade deleted but failed to revert P&L in funds");
      }
    }
    
    toast.success("Trade deleted successfully");
    
    tradesCache.timestamp = {};
    tradesCache.data = {};
    
    dispatchTradeEvents();
    
    dispatchPlaybookEvents();
    
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting trade:", error);
    toast.error(error.message || "Failed to delete trade");
    return { error };
  }
};

const dispatchTradeEvents = () => {
  console.log("Dispatching trade events to update components...");
  
  const tradeDataUpdatedEvent = new CustomEvent('tradeDataUpdated');
  window.dispatchEvent(tradeDataUpdatedEvent);
  
  const calendarUpdateEvent = new CustomEvent('calendarDataUpdated');
  window.dispatchEvent(calendarUpdateEvent);
  
  const dashboardUpdateEvent = new CustomEvent('dashboardDataUpdated');
  window.dispatchEvent(dashboardUpdateEvent);
  
  const analyticsUpdateEvent = new CustomEvent('analyticsDataUpdated');
  window.dispatchEvent(analyticsUpdateEvent);
  
  const fundsUpdateEvent = new CustomEvent('fundsDataUpdated');
  window.dispatchEvent(fundsUpdateEvent);
};

const dispatchPlaybookEvents = () => {
  console.log("Dispatching playbook events to update components...");
  
  const playbookDataUpdatedEvent = new CustomEvent('playbookDataUpdated');
  window.dispatchEvent(playbookDataUpdatedEvent);
};

// Update the fetchTradeById to use cache when possible
export const fetchTradeById = async (tradeId: string): Promise<TradeResponse> => {
  try {
    console.log("Fetching trade with ID:", tradeId);
    
    // Check all cached pages for this trade
    for (const pageData of Object.values(tradesCache.data)) {
      if (pageData) {
        const cachedTrade = pageData.find(t => t.id === tradeId);
        if (cachedTrade) {
          console.log("Found trade in cache");
          return { data: cachedTrade, error: null };
        }
      }
    }
    
    // Fetch from database if not in cache
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', tradeId)
      .single();
    
    if (error) {
      console.error("Supabase error fetching trade:", error);
      throw error;
    }
    
    if (!data) {
      console.error("No trade found with ID:", tradeId);
      return { data: null, error: new Error("Trade not found") };
    }
    
    // Process the trade data with optimized transformation
    const processedData = processTrades([data])[0];
    
    return { data: processedData, error: null };
  } catch (error: any) {
    console.error("Error fetching trade:", error);
    return { data: null, error };
  }
};

export const saveBatchTrades = async (tradesData: any[]): Promise<{ success: boolean; savedCount: number; message?: string }> => {
  try {
    console.log('Saving batch trades:', tradesData.length);
    
    let savedCount = 0;
    const errors: string[] = [];
    
    for (const tradeData of tradesData) {
      try {
        // Calculate metrics for each trade
        const pl = tradeData.pnl || 0;
        const brokerage = 0; // You may want to calculate this based on your logic
        
        // Convert to the format expected by createTrade
        const formattedTradeData = {
          symbol: tradeData.symbol,
          entryPrice: tradeData.entryPrice.toString(),
          exitPrice: tradeData.exitPrice.toString(),
          quantity: tradeData.quantity.toString(),
          date: new Date(),
          tradeType: tradeData.type,
          notes: tradeData.notes || '',
          mood: tradeData.mood || '',
          entryScreenshot: tradeData.entryScreenshot,
          exitScreenshot: tradeData.exitScreenshot,
          marketSegment: tradeData.marketSegment || 'equity-delivery',
          exchange: tradeData.exchange || 'NSE',
          strategy: tradeData.strategy || '',
          entryTime: tradeData.entryTime || '',
          exitTime: tradeData.exitTime || '',
          optionType: tradeData.optionType || '',
          positionType: tradeData.positionType || ''
        };
        
        const result = await createTrade(formattedTradeData, pl, brokerage);
        
        if (!result.error) {
          savedCount++;
        } else {
          errors.push(`${tradeData.symbol}: ${result.error.message}`);
        }
      } catch (tradeError) {
        console.error(`Error saving trade ${tradeData.symbol}:`, tradeError);
        errors.push(`${tradeData.symbol}: Failed to save`);
      }
    }
    
    if (errors.length > 0) {
      console.warn('Some trades failed to save:', errors);
    }
    
    return {
      success: savedCount > 0,
      savedCount,
      message: errors.length > 0 ? `${savedCount} trades saved, ${errors.length} failed` : undefined
    };
    
  } catch (error) {
    console.error('Error in batch trade save:', error);
    return {
      success: false,
      savedCount: 0,
      message: 'Failed to save trades'
    };
  }
};
