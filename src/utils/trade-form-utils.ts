
import { TradeFormData, TradeType } from './trade-form-types';
import { fetchTradeById as fetchTradeFromService } from '@/services/trades-service';
import { fetchPlaybookStrategies, createStrategyIfNotExists } from './playbook-utils';
import { calculateZerodhaCharges } from './zerodhaCharges';

export function formatCurrency(amount: number): string {
  // If amount is NaN, undefined, or null, return formatted 0
  if (amount === undefined || amount === null || isNaN(amount)) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(0);
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
}

export function calculateTradeMetrics({ 
  entryPrice, 
  exitPrice, 
  quantity,
  tradeType,
  marketSegment,
  exchange
}: {
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  tradeType: TradeType;
  marketSegment: string;
  exchange: string;
}) {
  // Validate numeric inputs to prevent NaN results
  const validEntryPrice = isNaN(entryPrice) ? 0 : entryPrice;
  const validExitPrice = isNaN(exitPrice) ? 0 : exitPrice;
  const validQuantity = isNaN(quantity) || quantity <= 0 ? 1 : quantity;
  
  // Use Zerodha-accurate charges calculation
  const totalCharges = calculateZerodhaCharges({
    segment: marketSegment,
    exchange,
    entryPrice: validEntryPrice,
    exitPrice: validExitPrice,
    quantity: validQuantity,
    tradeType
  });
  
  // Calculate P&L with validated inputs
  let pl = 0;
  if (tradeType === 'long') {
    pl = (validExitPrice - validEntryPrice) * validQuantity - totalCharges;
  } else {
    pl = (validEntryPrice - validExitPrice) * validQuantity - totalCharges;
  }

  // Calculate ROI - prevent division by zero
  const investment = tradeType === 'long' ? validEntryPrice * validQuantity : validExitPrice * validQuantity;
  const roi = investment > 0 ? (pl / investment) * 100 : 0;
  
  // Ensure no NaN values are returned
  return { 
    pl: isNaN(pl) ? 0 : pl, 
    brokerage: isNaN(totalCharges) ? 0 : totalCharges,
    roi: isNaN(roi) ? 0 : roi
  };
}

export function saveTrade(
  formData: TradeFormData, 
  pl: number, 
  brokerage: number, 
  entryScreenshot: string | null,
  exitScreenshot: string | null,
  isEditMode: boolean = false
) {
  // Get existing trades from localStorage
  const existingTrades = JSON.parse(localStorage.getItem('trades') || '[]');
  
  const currentTime = new Date().toISOString();
  
  // Parse numeric values safely
  const entryPrice = parseFloat(formData.entryPrice) || 0;
  const exitPrice = parseFloat(formData.exitPrice) || 0;
  const quantity = parseInt(formData.quantity) || 0;
  
  // Ensure P&L is a valid number, not NaN
  const safePl = isNaN(pl) ? 0 : pl;
  const safeBrokerage = isNaN(brokerage) ? 0 : brokerage;
  
  // Convert entry and exit times to complete datetime strings
  let entryTime = null;
  let exitTime = null;
  
  if (formData.entryTime) {
    const tradeDate = new Date(formData.date);
    const [hours, minutes] = formData.entryTime.split(':').map(Number);
    tradeDate.setHours(hours, minutes, 0, 0);
    entryTime = tradeDate.toISOString();
  }
  
  if (formData.exitTime) {
    const tradeDate = new Date(formData.date);
    const [hours, minutes] = formData.exitTime.split(':').map(Number);
    tradeDate.setHours(hours, minutes, 0, 0);
    exitTime = tradeDate.toISOString();
  }
  
  // Prepare the trade data
  const tradeData = {
    id: formData.id || `t${Date.now()}`,
    symbol: formData.symbol,
    entryPrice: entryPrice,
    exitPrice: exitPrice,
    quantity: quantity,
    date: formData.date,
    type: formData.tradeType,
    marketSegment: formData.marketSegment,
    exchange: formData.exchange,
    strategy: formData.strategy,
    notes: formData.notes,
    mood: formData.mood,
    riskToReward: formData.riskToReward,
    pnl: safePl,
    brokerage: safeBrokerage,
    entryScreenshot,
    exitScreenshot,
    entryTime,
    exitTime,
    updatedAt: currentTime,
    createdAt: formData.createdAt || currentTime
  };

  let updatedTrades;

  if (isEditMode && formData.id) {
    // Update existing trade
    updatedTrades = existingTrades.map((trade: any) => {
      if (trade.id === formData.id) {
        return { ...trade, ...tradeData };
      }
      return trade;
    });
  } else {
    // Add new trade
    updatedTrades = [tradeData, ...existingTrades];
  }

  // Update localStorage
  localStorage.setItem('trades', JSON.stringify(updatedTrades));

  // Dispatch event for real-time updates
  try {
    const event = new CustomEvent('tradeDataUpdated', { 
      detail: { 
        trade: tradeData,
        action: isEditMode ? 'update' : 'create',
        timestamp: Date.now()
      } 
    });
    window.dispatchEvent(event);
    console.log(`Trade ${isEditMode ? 'updated' : 'created'} event dispatched:`, tradeData.id);
  } catch (err) {
    console.error("Error dispatching trade update event:", err);
  }

  return tradeData;
}

export async function fetchTradeById(id: string) {
  try {
    // Fetch trade from the database
    const { data, error } = await fetchTradeFromService(id);
    
    if (error) {
      console.error("Error fetching trade:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Error in fetchTradeById:", err);
    
    // Check localStorage as fallback
    const storedTrades = JSON.parse(localStorage.getItem('trades') || '[]');
    return storedTrades.find((trade: any) => trade.id === id) || null;
  }
}

/**
 * Fetch strategies for the trade form dropdown
 */
export const getStrategiesForTradeForm = async (): Promise<string[]> => {
  try {
    return await fetchPlaybookStrategies();
  } catch (error) {
    console.error("Error fetching strategies for trade form:", error);
    return [];
  }
};

/**
 * Handle adding a new strategy when selected in trade form
 */
export const handleNewStrategy = async (strategyName: string): Promise<void> => {
  if (!strategyName) return;
  
  try {
    await createStrategyIfNotExists(strategyName);
    
    // Dispatch event to update the trade form
    dispatchTradeFormEvent();
  } catch (error) {
    console.error("Error handling new strategy:", error);
  }
};

/**
 * Dispatch an event to notify components that trade form data has changed
 */
/**
 * Format time string to "HH:MM" format for HTML time inputs
 */
export const formatTimeForInput = (timeString: string): string => {
  if (!timeString) return '';
  
  console.log("formatTimeForInput: Processing time string:", timeString);
  
  try {
    let cleanedTime = timeString.trim();
    
    // Handle timestamp formats (ISO: "2025-08-04T04:18:00.000Z" or PostgreSQL: "2025-08-04 04:28:00+00")
    if ((cleanedTime.includes('T') && (cleanedTime.includes('Z') || cleanedTime.includes('+'))) || 
        (cleanedTime.includes(' ') && (cleanedTime.includes('+') || cleanedTime.includes('Z')))) {
      const date = new Date(cleanedTime);
      if (!isNaN(date.getTime())) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        console.log(`formatTimeForInput: Extracted time from timestamp "${timeString}" to "${result}"`);
        return result;
      }
    }
    
    // Check if it contains AM/PM first and handle it
    if (cleanedTime.toLowerCase().includes('am') || cleanedTime.toLowerCase().includes('pm')) {
      const isPM = cleanedTime.toLowerCase().includes('pm');
      
      // Extract just the time part (remove AM/PM and any extra spaces)
      const timeOnly = cleanedTime.replace(/\s*(am|pm)/gi, '').trim();
      
      // Remove seconds if present (e.g., "01:11:18" -> "01:11")
      let timeParts = timeOnly.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1] || '0');
        
        // Convert to 24-hour format
        let hour24 = hours;
        if (isPM && hours !== 12) {
          hour24 = hours + 12;
        } else if (!isPM && hours === 12) {
          hour24 = 0;
        }
        
        const result = `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        console.log(`formatTimeForInput: Converted AM/PM "${timeString}" to "${result}"`);
        return result;
      }
    }
    
    // Handle time without AM/PM (assume 24-hour format)
    if (cleanedTime.includes(':')) {
      // Remove seconds if present
      let timeParts = cleanedTime.split(':');
      if (timeParts.length >= 2) {
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1] || '0');
        
        if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          const result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          console.log(`formatTimeForInput: Formatted 24h time "${timeString}" to "${result}"`);
          return result;
        }
      }
    }
    
    console.warn("formatTimeForInput: Could not format time:", timeString);
    return '';
  } catch (error) {
    console.error("formatTimeForInput: Error formatting time:", error, "Input:", timeString);
    return '';
  }
};

export const dispatchTradeFormEvent = (eventType = 'tradeFormUpdate', detail = {}) => {
  try {
    const event = new CustomEvent(eventType, { detail });
    window.dispatchEvent(event);
    console.log(`Event "${eventType}" dispatched successfully`);
    return true;
  } catch (err) {
    console.error(`Error dispatching "${eventType}" event:`, err);
    return false;
  }
};
