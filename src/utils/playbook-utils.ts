
import { fetchUserPlaybooks, Playbook, createPlaybook } from "@/services/playbooks-service";
import { fetchUserTrades } from "@/services/trades-service";
import { formatIndianCurrency } from '@/lib/utils';
import { isMockDataInitialized } from "@/services/mock-data-service";
import { mockPlaybooks } from "@/data/mockPlaybookData";
import { toast } from "sonner";

/**
 * Fetches all strategies from the user's playbooks
 * @returns Promise that resolves to an array of strategy names
 */
export const fetchPlaybookStrategies = async (): Promise<string[]> => {
  try {
    // Use the same service function for consistency
    const { data: playbooks, error } = await fetchUserPlaybooks();
    
    if (error || !playbooks) {
      console.error("Failed to fetch playbooks for strategies:", error);
      return [];
    }
    
    // Extract unique strategy names from playbooks
    const strategies = new Set<string>();
    
    playbooks.forEach(playbook => {
      strategies.add(playbook.name);
    });
    
    console.log(`Found ${strategies.size} strategies from playbooks`);
    
    return Array.from(strategies);
  } catch (error) {
    console.error("Error fetching playbook strategies:", error);
    return [];
  }
};

/**
 * Returns default strategy names when no playbooks are available
 */
const getDefaultStrategies = (): string[] => {
  return [
    'Order Block Strategy',
    'Liquidity Grab Strategy',
    'Fair Value Gap Strategy',
    'Pin Bar Reversal',
    'Inside Bar Strategy',
    'Break and Retest'
  ];
};

/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (value: number): string => {
  return formatIndianCurrency(value);
};

/**
 * Calculate risk/reward ratio as a string (e.g., "1:2")
 */
const calculateRiskRewardRatio = (risk: number, reward: number): string => {
  if (risk <= 0 || reward <= 0) return "0:0";
  
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };
  
  const divisor = gcd(risk, reward);
  return `${Math.round(risk / divisor)}:${Math.round(reward / divisor)}`;
};

/**
 * Get the playbook ID for a given strategy name
 * Updated to properly match strategy names with playbooks
 */
const getPlaybookIdForStrategy = (playbooks: any[], strategyName: string): string | null => {
  console.log(`Looking for playbook matching strategy: "${strategyName}"`, { 
    playbooksCount: playbooks.length,
    playbookNames: playbooks.map(p => p.name)
  });
  
  // First, try direct name matching (most reliable method)
  const directMatch = playbooks.find(playbook => playbook.name === strategyName);
  if (directMatch) {
    console.log(`Found direct playbook match for strategy "${strategyName}": ${directMatch.id}`);
    return directMatch.id;
  }
  
  // If no direct match, look for partial matches or strategy-related fields
  for (const playbook of playbooks) {
    // Check if the playbook has this strategy as a direct strategy
    if (playbook.strategy === strategyName) {
      console.log(`Found playbook with matching strategy field: ${playbook.id}`);
      return playbook.id;
    }
    
    // Check if the strategy is in the playbook's strategies array
    if (playbook.strategies && Array.isArray(playbook.strategies)) {
      for (const strategy of playbook.strategies) {
        if (typeof strategy === 'string' && strategy === strategyName) {
          console.log(`Found playbook with strategy in strategies array: ${playbook.id}`);
          return playbook.id;
        } else if (strategy && strategy.name === strategyName) {
          console.log(`Found playbook with strategy object match: ${playbook.id}`);
          return playbook.id;
        }
      }
    }
  }
  
  // If we get here, no match was found
  console.log(`No playbook found for strategy: "${strategyName}"`);
  
  // If we have playbooks but couldn't find a match, assign to the first playbook as fallback
  if (playbooks.length > 0) {
    console.log(`Assigning strategy "${strategyName}" to first playbook as fallback: ${playbooks[0].id}`);
    return playbooks[0].id;
  }
  
  return null;
};

/**
 * Fetch analytics data for all playbooks
 */
export const fetchPlaybookAnalytics = async (playbooks: any[]): Promise<Record<string, any>> => {
  // Get all trades from Supabase
  const { data: trades, error } = await fetchUserTrades();
  
  if (error) {
    console.error("Error fetching trades for playbook analytics:", error);
    return {};
  }
  
  const allTrades = trades || [];
  console.log(`Processing analytics for ${allTrades.length} trades and ${playbooks.length} playbooks`);
  
  // Initialize analytics for each playbook
  const playbookAnalytics: Record<string, any> = {};
  playbooks.forEach(playbook => {
    playbookAnalytics[playbook.id] = {
      winRate: 0,
      totalTrades: 0,
      profitLoss: 0,
      avgRiskReward: "0:0",
      winningTrades: 0,
      losingTrades: 0,
    };
  });

  // Track trades for each strategy
  const strategyTrades: Record<string, any[]> = {};
  
  // Group trades by strategy
  allTrades.forEach((trade: any) => {
    if (!trade.strategy) return;
    
    if (!strategyTrades[trade.strategy]) {
      strategyTrades[trade.strategy] = [];
    }
    
    strategyTrades[trade.strategy].push(trade);
  });
  
  // Process each strategy and update the corresponding playbook
  for (const [strategyName, strategyTradesList] of Object.entries(strategyTrades)) {
    const playbookId = getPlaybookIdForStrategy(playbooks, strategyName);
    if (!playbookId || !playbookAnalytics[playbookId]) continue;
    
    let winningTrades = 0;
    let totalPL = 0;
    let totalRiskReward = 0;
    
    // Process each trade for this strategy
    strategyTradesList.forEach(trade => {
      const pl = trade.profitLoss || trade.pnl || 0;
      totalPL += pl;
      
      if (pl > 0) {
        winningTrades++;
      }
      
      // If we have risk/reward data, add it up
      if (trade.riskReward) {
        const [risk, reward] = trade.riskReward.split(':').map(Number);
        if (!isNaN(risk) && !isNaN(reward) && risk > 0) {
          totalRiskReward += reward / risk;
        }
      }
    });
    
    const totalTrades = strategyTradesList.length;
    const losingTrades = totalTrades - winningTrades;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    // Calculate average risk/reward
    let avgRiskReward = "0:0";
    if (totalTrades > 0) {
      const avgRR = totalRiskReward > 0 && totalTrades > 0 ? 
                  totalRiskReward / totalTrades : 
                  parseFloat(playbooks.find(p => p.id === playbookId)?.riskReward?.split(':')[1] || "2") / 
                  parseFloat(playbooks.find(p => p.id === playbookId)?.riskReward?.split(':')[0] || "1");
      
      avgRiskReward = calculateRiskRewardRatio(1, avgRR);
    }
    
    // Update the analytics for this playbook
    playbookAnalytics[playbookId] = {
      winRate,
      totalTrades,
      profitLoss: totalPL,
      avgRiskReward,
      winningTrades,
      losingTrades,
    };
  }
  
  return playbookAnalytics;
};

/**
 * Helper function to check if a strategy exists in playbooks
 * This is used to validate strategy selections in the trade form
 */
export const doesStrategyExist = async (strategyName: string): Promise<boolean> => {
  if (!strategyName) return false;
  
  const strategies = await fetchPlaybookStrategies();
  return strategies.includes(strategyName);
};

/**
 * Create a new strategy if it doesn't exist in playbooks
 */
export const createStrategyIfNotExists = async (strategyName: string): Promise<boolean> => {
  try {
    if (!strategyName) return false;
    
    // Check if strategy already exists in playbooks
    const existingStrategies = await fetchPlaybookStrategies();
    
    if (existingStrategies.includes(strategyName)) {
      console.log(`Strategy "${strategyName}" already exists`);
      return true;
    }
    
    // Check if we're in trial mode - if so, add to mock playbooks
    const isTrialActive = localStorage.getItem('isTrialActive') === 'true';
    const isUsingMockData = isTrialActive && isMockDataInitialized();
    
    if (isUsingMockData) {
      console.log(`Adding new strategy "${strategyName}" to mock playbooks`);
      
      // Create a simple mock playbook with this strategy name
      const newPlaybook: Playbook = {
        id: `mock-pb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        user_id: "mock-user",
        name: strategyName,
        description: `Strategy created from trade form.`,
        tags: [],
        entry_rules: "",
        exit_rules: "",
        risk_reward: "",
        notes: "This strategy was automatically created when you added it to a trade.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to mockPlaybooks array
      mockPlaybooks.push(newPlaybook);
      
      // Update localStorage
      localStorage.setItem('trade-journal-mock-playbooks', JSON.stringify(mockPlaybooks));
      
      // Dispatch event to notify components
      window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
      
      toast.success(`Strategy "${strategyName}" created successfully`);
      return true;
    } else {
      // For real users, create a playbook in the database
      const result = await createPlaybook({
        name: strategyName,
        description: "Strategy created from trade form",
        entryRules: "",
        exitRules: "",
        riskReward: "",
        notes: "This strategy was automatically created when you added it to a trade."
      });
      
      if (result.error) {
        toast.error(`Failed to create strategy: ${result.error.message}`);
        return false;
      }
      
      toast.success(`Strategy "${strategyName}" created successfully`);
      return true;
    }
  } catch (error) {
    console.error("Error creating strategy:", error);
    toast.error("Failed to create strategy");
    return false;
  }
};
