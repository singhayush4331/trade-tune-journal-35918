
import { Playbook } from "@/services/playbooks-service";
import { subDays } from "date-fns";

// Array of strategy templates for mock playbooks
const strategyTemplates = [
  {
    name: "Fair Value Gap Strategy",
    description: "Trade price returning to fill fair value gaps in the market structure",
    tags: ["fair value gap", "supply demand", "technical"],
    entryRules: "1. Identify fair value gaps on higher timeframes\n2. Look for price to return to the FVG\n3. Enter when price reaches the FVG with confirmation",
    exitRules: "1. Exit at the next significant structure\n2. Use a fixed risk-reward ratio of 1:2\n3. Place stop loss below the entry candle",
    riskReward: "1:2",
    notes: "Works best in trending markets. Avoid using in highly volatile market conditions."
  },
  {
    name: "Order Block Strategy",
    description: "Trade from institutional order blocks and mitigation zones",
    tags: ["smart money", "order blocks", "mitigation"],
    entryRules: "1. Identify order blocks on higher timeframe\n2. Wait for price to return to the order block\n3. Look for rejection candles as confirmation\n4. Enter after confirmation with tight stop",
    exitRules: "1. Target the next significant supply/demand zone\n2. Use a minimum 1:2 risk-reward\n3. Move stop to break-even after 1:1 reached",
    riskReward: "1:2",
    notes: "Focus on clean order blocks with strong rejection. Works in all market conditions but best in trending markets."
  },
  {
    name: "Liquidity Grab Strategy",
    description: "Capture market moves after liquidity grabs above/below key levels",
    tags: ["liquidity", "stop hunt", "reversal"],
    entryRules: "1. Identify key swing highs/lows where stops are likely placed\n2. Wait for price to sweep beyond the level\n3. Look for reversal candle patterns\n4. Enter on first pullback after liquidity grab",
    exitRules: "1. Target previous swing high/low\n2. Use 1:2 risk-reward minimum\n3. Trail stop after 1:1 is reached",
    riskReward: "1:3",
    notes: "Best traded around key market structure levels. Be patient and wait for clear liquidity sweep."
  },
  {
    name: "Breakout Momentum Strategy",
    description: "Trade strong breakouts from consolidation patterns with momentum",
    tags: ["breakout", "momentum", "volume"],
    entryRules: "1. Identify tight consolidation patterns\n2. Wait for price to break out with increased volume\n3. Enter on the breakout candle close\n4. Set stop below the consolidation zone",
    exitRules: "1. Exit at the measured move target\n2. Take partial profits at 1:1\n3. Trail remainder with ATR stop",
    riskReward: "1:2.5",
    notes: "Most effective in trending markets. Look for volume confirmation on breakouts."
  },
  {
    name: "Mean Reversion Strategy",
    description: "Capitalize on price returning to the average after extreme moves",
    tags: ["mean reversion", "oversold", "overbought"],
    entryRules: "1. Identify extreme RSI readings (>70 or <30)\n2. Wait for candlestick reversal patterns\n3. Enter after confirmation of reversal\n4. Place stop beyond the extreme point",
    exitRules: "1. Target the 20-period moving average\n2. Use a 1:1.5 risk-reward minimum\n3. Exit on first signs of momentum shift",
    riskReward: "1:1.5",
    notes: "Best in ranging markets. Avoid during strong trends or news events."
  }
];

// Function to generate a random playbook based on templates
const generateRandomPlaybook = (): Playbook => {
  const now = new Date();
  const template = strategyTemplates[Math.floor(Math.random() * strategyTemplates.length)];
  
  // Generate a random date in the past 14 days
  const createdAt = subDays(now, Math.floor(Math.random() * 14)).toISOString();
  
  return {
    id: `mock-pb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    user_id: "mock-user",
    name: template.name,
    description: template.description,
    tags: template.tags,
    entry_rules: template.entryRules,
    exit_rules: template.exitRules,
    risk_reward: template.riskReward,
    notes: template.notes,
    created_at: createdAt,
    updated_at: createdAt,
    createdAt: createdAt,
    updatedAt: createdAt
  };
};

// Generate mock playbooks
export const generateMockPlaybooks = (): Playbook[] => {
  // Generate one playbook for each template to ensure variety
  const playbooks = strategyTemplates.map(template => {
    const now = new Date();
    const createdAt = subDays(now, Math.floor(Math.random() * 14)).toISOString();
    
    return {
      id: `mock-pb-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user_id: "mock-user",
      name: template.name,
      description: template.description,
      tags: template.tags,
      entry_rules: template.entryRules,
      exit_rules: template.exitRules,
      risk_reward: template.riskReward,
      notes: template.notes,
      created_at: createdAt,
      updated_at: createdAt,
      createdAt: createdAt,
      updatedAt: createdAt
    };
  });
  
  return playbooks;
};

// Export empty array by default - will be populated when needed
export const mockPlaybooks: Playbook[] = [];
