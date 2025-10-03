
import { supabase } from "@/integrations/supabase/client";
import { getSessionUser } from "@/utils/auth-cache";
import { toast } from "sonner";
import { mockPlaybooks, generateMockPlaybooks } from "@/data/mockPlaybookData";
import { shouldUseMockData } from "./mock-data-service";

// Type definitions
export interface PlaybookStrategy {
  name: string;
  description?: string;
}

export interface Playbook {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  tags?: string[];
  entry_rules?: string;
  exit_rules?: string;
  risk_reward?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  createdAt?: string; // Mapped from created_at
  updatedAt?: string; // Mapped from updated_at
}

// Get trial status to check if mock data should be used
const getTrialStatus = () => {
  try {
    // Since we can't use hooks directly in non-component code,
    // we check localStorage directly
    const isTrialActive = localStorage.getItem('isTrialActive') === 'true';
    return { isTrialActive };
  } catch (error) {
    console.error("Error getting trial status:", error);
    return { isTrialActive: false };
  }
};

// Fetch all playbooks for the current user
export const fetchUserPlaybooks = async () => {
  try {
    // Check if we should use mock data
    const { isTrialActive } = getTrialStatus();
    
    if (shouldUseMockData(isTrialActive)) {
      console.log("Using mock playbook data for trial user", mockPlaybooks);
      
      // If mockPlaybooks array is empty but we're in trial mode, generate fresh data
      if (mockPlaybooks.length === 0) {
        console.log("Mock playbooks array is empty, generating fresh data");
        const freshPlaybooks = generateMockPlaybooks();
        mockPlaybooks.push(...freshPlaybooks);
        
        // Store in localStorage for persistence
        localStorage.setItem('trade-journal-mock-playbooks', JSON.stringify(freshPlaybooks));
      }
      
      return { data: mockPlaybooks, error: null };
    }
    
    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Convert dates from strings to Date objects
    const processedPlaybooks = data.map(playbook => ({
      ...playbook,
      createdAt: playbook.created_at,
      updatedAt: playbook.updated_at
    }));
    
    return { data: processedPlaybooks, error: null };
  } catch (error: any) {
    console.error("Error fetching playbooks:", error);
    return { data: null, error };
  }
};

// Fetch a single playbook by ID
export const fetchPlaybookById = async (playbookId: string) => {
  try {
    // Check if we should use mock data
    const { isTrialActive } = getTrialStatus();
    
    if (shouldUseMockData(isTrialActive) && mockPlaybooks.length > 0) {
      const mockPlaybook = mockPlaybooks.find(p => p.id === playbookId);
      if (mockPlaybook) {
        return { data: mockPlaybook, error: null };
      }
    }
    
    const { data, error } = await supabase
      .from('playbooks')
      .select('*')
      .eq('id', playbookId)
      .single();
    
    if (error) throw error;
    
    // Convert dates from strings to Date objects
    const processedPlaybook = {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    return { data: processedPlaybook, error: null };
  } catch (error: any) {
    console.error("Error fetching playbook:", error);
    return { data: null, error };
  }
};

// Create a new playbook
export const createPlaybook = async (playbookData: any) => {
  try {
    const user = await getSessionUser();
    if (!user) throw new Error("User not authenticated");
    
    const userId = user.id;
    
    const newPlaybook = {
      user_id: userId,
      name: playbookData.name,
      description: playbookData.description || null,
      tags: playbookData.tags || null,
      entry_rules: playbookData.entryRules || null,
      exit_rules: playbookData.exitRules || null,
      risk_reward: playbookData.riskReward || null,
      notes: playbookData.notes || null
    };
    
    const { data, error } = await supabase
      .from('playbooks')
      .insert(newPlaybook)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Playbook created successfully");
    
    // Convert dates for consistency
    const processedPlaybook = {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    // Dispatch event to update components
    dispatchPlaybookEvents();
    
    return { data: processedPlaybook, error: null };
  } catch (error: any) {
    console.error("Error creating playbook:", error);
    toast.error(error.message || "Failed to create playbook");
    return { data: null, error };
  }
};

// Update an existing playbook
export const updatePlaybook = async (playbookId: string, playbookData: any) => {
  try {
    const updatedPlaybook = {
      name: playbookData.name,
      description: playbookData.description || null,
      tags: playbookData.tags || null,
      entry_rules: playbookData.entryRules || null,
      exit_rules: playbookData.exitRules || null,
      risk_reward: playbookData.riskReward || null,
      notes: playbookData.notes || null,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('playbooks')
      .update(updatedPlaybook)
      .eq('id', playbookId)
      .select()
      .single();
    
    if (error) throw error;
    
    toast.success("Playbook updated successfully");
    
    // Convert dates for consistency
    const processedPlaybook = {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
    
    // Dispatch event to update components
    dispatchPlaybookEvents();
    
    return { data: processedPlaybook, error: null };
  } catch (error: any) {
    console.error("Error updating playbook:", error);
    toast.error(error.message || "Failed to update playbook");
    return { data: null, error };
  }
};

// Delete a playbook
export const deletePlaybook = async (playbookId: string) => {
  try {
    const { error } = await supabase
      .from('playbooks')
      .delete()
      .eq('id', playbookId);
    
    if (error) throw error;
    
    // Dispatch event to update components
    dispatchPlaybookEvents();
    
    return { error: null };
  } catch (error: any) {
    console.error("Error deleting playbook:", error);
    toast.error(error.message || "Failed to delete playbook");
    return { error };
  }
};

// Helper function to dispatch all playbook-related events
const dispatchPlaybookEvents = () => {
  console.log("Dispatching playbook events to update components...");
  
  // Main playbook data updated event
  const playbookDataUpdatedEvent = new CustomEvent('playbookDataUpdated');
  window.dispatchEvent(playbookDataUpdatedEvent);
  
  // Notify trade form components that playbook data has changed
  const tradeFormUpdateEvent = new CustomEvent('tradeFormStrategyUpdate');
  window.dispatchEvent(tradeFormUpdateEvent);
};

// Get all strategy names from playbooks (for use in trade form)
export const fetchAllStrategyNames = async (): Promise<string[]> => {
  try {
    const { data, error } = await fetchUserPlaybooks();
    
    if (error || !data) {
      console.error("Error fetching strategies:", error);
      return [];
    }
    
    const strategyNames = new Set<string>();
    
    data.forEach(playbook => {
      // Add playbook name as a strategy
      strategyNames.add(playbook.name);
    });
    
    return Array.from(strategyNames);
  } catch (error) {
    console.error("Error fetching strategy names:", error);
    return [];
  }
};
