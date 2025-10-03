// This file contains mock trade data for trial users
import { Trade } from "@/utils/trade-form-types";
import { addDays, subDays, subHours, setHours, setMinutes } from "date-fns";
import { mockPlaybooks, generateMockPlaybooks } from "@/data/mockPlaybookData";

// Array of common stock symbols
const stockSymbols = [
  "RELIANCE", "TATASTEEL", "INFY", "HDFCBANK", "TCS", 
  "WIPRO", "ICICIBANK", "SBIN", "LT", "BHARTIARTL",
  "ITC", "AXISBANK", "HINDUNILVR", "ADANIENT", "ZOMATO",
  "NIFTY50", "BANKNIFTY", "NIFTYMID", "NIFTYFIN"
];

// Fallback strategies if no playbooks are available
const fallbackStrategies = [
  "Breakout", "Pullback", "Trend Following", "Mean Reversion",
  "Gap and Go", "VWAP Bounce", "Support/Resistance", "Momentum"
];

// Array of moods
const moods = ["focused", "excited", "anxious", "frustrated", "confident", "fearful", "calm"];

// Function to get strategies from playbooks or use fallbacks
const getAvailableStrategies = (): string[] => {
  if (mockPlaybooks.length > 0) {
    console.log(`Getting strategies from ${mockPlaybooks.length} mock playbooks`);
    // Use the playbook names directly as strategies for better matching
    return mockPlaybooks.map(playbook => playbook.name);
  }
  
  console.log("No mock playbooks available, using fallback strategies");
  return fallbackStrategies;
};

// Function to generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Function to generate a random number within a range
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Function to generate a random float within a range with precision
const randomFloat = (min: number, max: number, precision: number = 2): number => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(precision));
};

// Function to generate a random trade
export const generateRandomTrade = (dateRange?: { start: Date; end: Date }): Trade => {
  const now = new Date();
  const start = dateRange?.start || subDays(now, 30);
  const end = dateRange?.end || now;
  
  const tradeDate = randomDate(start, end);
  
  const symbol = stockSymbols[Math.floor(Math.random() * stockSymbols.length)];
  
  // Get strategies from playbooks or use fallback strategies
  const availableStrategies = getAvailableStrategies();
  const strategy = availableStrategies[Math.floor(Math.random() * availableStrategies.length)];
  
  console.log(`Generated random trade using strategy: "${strategy}"`);
  
  const mood = moods[Math.floor(Math.random() * moods.length)];
  const type = Math.random() > 0.5 ? "long" : "short";
  
  // Generate random base price
  const basePrice = randomFloat(100, 3000);
  
  // Make more profitable than losing trades (70% win rate)
  const isProfitable = Math.random() <= 0.7;
  
  let entryPrice, exitPrice;
  if (type === "long") {
    entryPrice = basePrice;
    exitPrice = isProfitable 
      ? basePrice * (1 + randomFloat(0.01, 0.1)) 
      : basePrice * (1 - randomFloat(0.01, 0.05));
  } else {
    entryPrice = basePrice;
    exitPrice = isProfitable 
      ? basePrice * (1 - randomFloat(0.01, 0.1))
      : basePrice * (1 + randomFloat(0.01, 0.05));
  }
  
  const quantity = randomNumber(10, 500) * (Math.random() > 0.7 ? 10 : 1);
  
  // Calculate P&L
  let pnl;
  if (type === "long") {
    pnl = (exitPrice - entryPrice) * quantity;
  } else {
    pnl = (entryPrice - exitPrice) * quantity;
  }
  
  // Generate entry and exit times
  const entryTime = setMinutes(
    setHours(tradeDate, randomNumber(9, 15)), 
    randomNumber(0, 59)
  );
  
  const exitTime = new Date(entryTime);
  exitTime.setMinutes(entryTime.getMinutes() + randomNumber(10, 180));
  
  // Add risk to reward
  const riskToReward = isProfitable 
    ? `1:${randomNumber(2, 5)}` 
    : `1:${randomNumber(1, 2)}`;
  
  // Generate notes based on success and strategy
  let notes = "";
  if (isProfitable) {
    notes = `Good ${strategy} setup with clear ${type === "long" ? "support" : "resistance"} levels. ${
      mood === "confident" || mood === "focused" 
        ? "Executed according to plan and managed risk well." 
        : "Got lucky with timing despite some hesitation."
    }`;
  } else {
    notes = `Attempted ${strategy} but ${type === "long" ? "resistance" : "support"} broke unexpectedly. ${
      mood === "anxious" || mood === "fearful" 
        ? "Hesitated too much on exit." 
        : "Lesson learned about proper stop placement."
    }`;
  }

  return {
    id: `mock-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    user_id: "mock-user",
    symbol,
    entry_price: entryPrice,
    exit_price: exitPrice,
    entryPrice: entryPrice,
    exitPrice: exitPrice,
    quantity,
    date: tradeDate,
    type,
    notes,
    mood,
    pnl,
    screenshots: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    strategy,
    marketSegment: Math.random() > 0.5 ? "equity-delivery" : "equity-intraday",
    market_segment: Math.random() > 0.5 ? "equity-delivery" : "equity-intraday",
    exchange: "NSE",
    entryScreenshot: null,
    exitScreenshot: null,
    entryTime: entryTime.toISOString(),
    exitTime: exitTime.toISOString(),
    entry_time: entryTime.toISOString(),
    exit_time: exitTime.toISOString(),
    riskToReward
  };
};

// Generate mock trades for various time periods
export const generateMockTrades = (): Trade[] => {
  // Ensure we have playbook data before generating trades
  if (mockPlaybooks.length === 0) {
    console.log("Mock playbooks array is empty, generating fresh data");
    const generatedPlaybooks = generateMockPlaybooks();
    mockPlaybooks.push(...generatedPlaybooks);
  }

  console.log(`Generating mock trades using ${mockPlaybooks.length} playbooks`);

  const now = new Date();
  const mockTrades: Trade[] = [];
  
  // Generate trades for today (3-5 trades)
  const todayTradesCount = randomNumber(3, 5);
  for (let i = 0; i < todayTradesCount; i++) {
    mockTrades.push(generateRandomTrade({
      start: subHours(now, 8),
      end: now
    }));
  }
  
  // Generate trades for this week (15-20 additional trades)
  const weekTradesCount = randomNumber(15, 20);
  for (let i = 0; i < weekTradesCount; i++) {
    mockTrades.push(generateRandomTrade({
      start: subDays(now, 7),
      end: subDays(now, 1)
    }));
  }
  
  // Generate trades for this month (25-30 additional trades)
  const monthTradesCount = randomNumber(25, 30);
  for (let i = 0; i < monthTradesCount; i++) {
    mockTrades.push(generateRandomTrade({
      start: subDays(now, 30),
      end: subDays(now, 8)
    }));
  }
  
  // Generate some trades from 2-3 months ago (10-15 trades)
  const olderTradesCount = randomNumber(10, 15);
  for (let i = 0; i < olderTradesCount; i++) {
    mockTrades.push(generateRandomTrade({
      start: subDays(now, 90),
      end: subDays(now, 31)
    }));
  }
  
  // Return all trades sorted by date (newest first)
  return mockTrades.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA;
  });
};

// Export empty array by default - will be populated when needed
export const mockTrades: Trade[] = [];
