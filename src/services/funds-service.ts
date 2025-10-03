
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { getSessionUser } from "@/utils/auth-cache";

// Interface for the response from funds service methods
interface FundsResponse<T> {
  data: T | null;
  error: any;
}

// Define types based on the Database interface
type Fund = Database['public']['Tables']['funds']['Row'];
type FundInsert = Database['public']['Tables']['funds']['Insert'];

// Custom type for processed funds with consistent date handling
interface ProcessedFund {
  id: string;
  user_id: string;
  amount: number;
  transaction_type: string;
  notes: string | null;
  date: Date;
  created_at: string;
  createdAt: string;
}

// Fetch all funds transactions for the current user
export const fetchUserFunds = async (): Promise<FundsResponse<ProcessedFund[]>> => {
  try {
    const user = await getSessionUser();
    const userId = user?.id || '';
    const { data, error } = await supabase
      .from('funds')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Return empty array if no data
    if (!data || data.length === 0) {
      return { data: [], error: null };
    }
    
    // Process the funds data to ensure consistent format
    const processedFunds = data.map((fund): ProcessedFund => ({
      ...fund,
      date: new Date(fund.date),
      createdAt: fund.created_at
    }));
    
    return { data: processedFunds, error: null };
  } catch (error: any) {
    console.error("Error fetching funds:", error);
    return { data: null, error };
  }
};

// Create a new funds transaction
export const createFundsTransaction = async (
  amount: number, 
  transactionType: string, 
  notes: string = '', 
  date: Date = new Date()
): Promise<FundsResponse<ProcessedFund>> => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    const newTransaction: FundInsert = {
      user_id: userId,
      amount,
      transaction_type: transactionType,
      notes,
      date: date.toISOString()
    };
    
    const { data, error } = await supabase
      .from('funds')
      .insert([newTransaction])  // Use array to match expected type
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error("No data returned from insert");
    
    toast.success("Funds transaction added successfully");
    
    // Convert dates for consistency with our app
    const processedTransaction: ProcessedFund = {
      ...data,
      date: new Date(data.date),
      createdAt: data.created_at
    };
    
    return { data: processedTransaction, error: null };
  } catch (error: any) {
    console.error("Error creating funds transaction:", error);
    toast.error(error.message || "Failed to add funds transaction");
    return { data: null, error };
  }
};

// Delete a funds transaction
export const deleteFundsTransaction = async (transactionId: string): Promise<FundsResponse<null>> => {
  try {
    const { error } = await supabase
      .from('funds')
      .delete()
      .eq('id', transactionId);
    
    if (error) throw error;
    
    toast.success("Funds transaction deleted successfully");
    
    return { data: null, error: null };
  } catch (error: any) {
    console.error("Error deleting funds transaction:", error);
    toast.error(error.message || "Failed to delete funds transaction");
    return { data: null, error };
  }
};

// Get total funds
export const getTotalFunds = async (): Promise<FundsResponse<number>> => {
  try {
    const user = await getSessionUser();
    const userId = user?.id || '';
    const { data, error } = await supabase
      .from('funds')
      .select('amount, transaction_type')
      .eq('user_id', userId);
    
    if (error) throw error;
    if (!data || data.length === 0) return { data: 0, error: null };
    
    // Calculate total funds (safely check each property)
    const totalFunds = data.reduce((total, transaction) => {
      if (transaction && typeof transaction.transaction_type === 'string') {
        if (transaction.transaction_type === 'deposit' && typeof transaction.amount === 'number') {
          return total + transaction.amount;
        } else if (transaction.transaction_type === 'withdrawal' && typeof transaction.amount === 'number') {
          return total - transaction.amount;
        }
      }
      return total;
    }, 0);
    
    return { data: totalFunds, error: null };
  } catch (error: any) {
    console.error("Error calculating total funds:", error);
    return { data: 0, error };
  }
};

// Set initial capital (replaces all previous capital transactions)
export const setInitialCapital = async (amount: number): Promise<FundsResponse<ProcessedFund>> => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    // First, get all existing fund transactions
    const { data: existingFunds, error: fetchError } = await supabase
      .from('funds')
      .select('id, transaction_type')
      .eq('user_id', userId);
    
    if (fetchError) throw fetchError;
    if (!existingFunds) throw new Error("Could not fetch existing funds data");
    
    // Delete all existing deposit/withdrawal transactions
    if (existingFunds.length > 0) {
      // Filter for valid transaction types to avoid type errors
      const idsToDelete = existingFunds
        .filter(fund => fund && 
          typeof fund.transaction_type === 'string' && 
          (fund.transaction_type === 'deposit' || fund.transaction_type === 'withdrawal') &&
          typeof fund.id === 'string'
        )
        .map(fund => fund.id);
      
      if (idsToDelete.length > 0) {
        const { error: deleteError } = await supabase
          .from('funds')
          .delete()
          .in('id', idsToDelete);
        
        if (deleteError) throw deleteError;
      }
    }
    
    // Create new initial capital transaction
    const newTransaction: FundInsert = {
      user_id: userId,
      amount,
      transaction_type: 'deposit',
      notes: 'Initial capital',
      date: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('funds')
      .insert([newTransaction])  // Use array to match expected type
      .select()
      .single();
    
    if (error) throw error;
    if (!data) throw new Error("No data returned from insert");
    
    toast.success("Initial capital set successfully");
    
    // Convert dates for consistency with our app
    const processedTransaction: ProcessedFund = {
      ...data,
      date: new Date(data.date),
      createdAt: data.created_at
    };
    
    return { data: processedTransaction, error: null };
  } catch (error: any) {
    console.error("Error setting initial capital:", error);
    toast.error(error.message || "Failed to set initial capital");
    return { data: null, error };
  }
};
