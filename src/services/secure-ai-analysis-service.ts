import { fetchUserTrades } from './trades-service';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Type definition for analysis result
export interface AnalysisResult {
  insights?: string;
  recommendations?: string[];
  patterns?: { description: string; confidence: number }[];
  error?: string;
}

// Secure function to analyze trades using server-side OpenAI API
export const analyzeTrades = async (): Promise<AnalysisResult> => {
  try {
    // Fetch user's trading history
    const { data: trades, error: tradesError } = await fetchUserTrades();
    
    if (tradesError || !trades || trades.length === 0) {
      return { 
        error: trades?.length === 0 
          ? "No trades found to analyze. Add some trades first." 
          : "Failed to fetch trades for analysis." 
      };
    }

    // Prepare the trade data for analysis (sanitized)
    const tradeData = trades.map(trade => ({
      symbol: trade.symbol,
      type: trade.type,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      quantity: trade.quantity,
      pnl: trade.pnl,
      date: trade.date,
      strategy: trade.strategy,
      mood: trade.mood
    }));

    // Get current session for authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { error: "Please log in to use AI analysis features." };
    }

    // Call secure edge function for analysis
    const { data, error } = await supabase.functions.invoke('analyze-trades-ai', {
      body: { trades: tradeData },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

    if (error) {
      console.error('Analysis error:', error);
      return { error: 'Failed to analyze trades. Please try again.' };
    }

    return data;

  } catch (error) {
    console.error('Analysis error:', error);
    toast.error('Failed to analyze trades. Please try again.');
    return { error: 'Failed to analyze trades. Please check your connection and try again.' };
  }
};

// Secure function to predict trade performance
export const predictTradePerformance = async (trade: {
  symbol: string;
  type: string;
  entryPrice: number;
  quantity: number;
  strategy?: string;
}) => {
  try {
    // Fetch user's trading history for context
    const { data: trades, error: tradesError } = await fetchUserTrades();
    
    // Format historical data if available (sanitized)
    const tradeHistory = trades && trades.length > 0 
      ? trades.slice(0, 10).map(t => ({
          symbol: t.symbol,
          type: t.type,
          entry_price: t.entryPrice,
          exit_price: t.exitPrice,
          quantity: t.quantity,
          pnl: t.pnl,
          strategy: t.strategy
        }))
      : [];

    // Get current session for authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { error: "Please log in to use AI prediction features." };
    }

    // Call secure edge function for prediction
    const { data, error } = await supabase.functions.invoke('predict-trade-performance', {
      body: { 
        newTrade: trade,
        tradeHistory: tradeHistory 
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      }
    });

    if (error) {
      console.error('Prediction error:', error);
      return { error: 'Failed to predict trade performance. Please try again.' };
    }

    return data;
    
  } catch (error) {
    console.error('Prediction error:', error);
    toast.error('Failed to predict trade performance.');
    return { error: 'Failed to predict trade performance. Please check your connection and try again.' };
  }
};