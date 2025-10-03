// Utility functions for calculating P&L with proper chronological order handling

export interface TradeTransaction {
  price: number;
  quantity: number;
  time: string;
  type: 'buy' | 'sell';
}

export interface PnLCalculationResult {
  pnl: number;
  entryPrice: number;
  exitPrice: number;
  totalQuantity: number;
  isProfit: boolean;
}

/**
 * Calculates P&L based on chronological order of transactions
 * Handles both equity and options trades correctly
 */
export function calculateChronologicalPnL(
  entryPrice: number,
  exitPrice: number,
  quantity: number,
  entryTime?: string,
  exitTime?: string,
  positionType?: 'buy' | 'sell'
): PnLCalculationResult {
  
  // If we have timestamps, use chronological order
  if (entryTime && exitTime) {
    const entryTimestamp = new Date(entryTime).getTime();
    const exitTimestamp = new Date(exitTime).getTime();
    
    console.log('🕐 Chronological P&L calculation:', {
      entryTime,
      exitTime,
      entryTimestamp,
      exitTimestamp,
      entryPrice,
      exitPrice,
      quantity,
      positionType
    });
    
    // Determine which transaction happened first
    if (entryTimestamp < exitTimestamp) {
      // Normal order: entry first, then exit
      const pnl = (exitPrice - entryPrice) * quantity;
      return {
        pnl,
        entryPrice,
        exitPrice,
        totalQuantity: quantity,
        isProfit: pnl > 0
      };
    } else {
      // Reversed order: exit happened before entry
      // This shouldn't happen in normal trading, but handle it
      const pnl = (entryPrice - exitPrice) * quantity;
      return {
        pnl,
        entryPrice: exitPrice,
        exitPrice: entryPrice,
        totalQuantity: quantity,
        isProfit: pnl > 0
      };
    }
  }
  
  // Fallback to position type logic for options
  if (positionType) {
    if (positionType === 'buy') {
      // Bought first, then sold
      const pnl = (exitPrice - entryPrice) * quantity;
      return {
        pnl,
        entryPrice,
        exitPrice,
        totalQuantity: quantity,
        isProfit: pnl > 0
      };
    } else {
      // Sold first, then bought (short position)
      const pnl = (entryPrice - exitPrice) * quantity;
      return {
        pnl,
        entryPrice,
        exitPrice,
        totalQuantity: quantity,
        isProfit: pnl > 0
      };
    }
  }
  
  // Default calculation (normal long position)
  const pnl = (exitPrice - entryPrice) * quantity;
  return {
    pnl,
    entryPrice,
    exitPrice,
    totalQuantity: quantity,
    isProfit: pnl > 0
  };
}

/**
 * Calculates P&L for options trades with proper direction handling
 */
export function calculateOptionsPnL(
  buyPrice: number,
  sellPrice: number,
  quantity: number,
  optionType: 'CE' | 'PE',
  positionType: 'buy' | 'sell'
): PnLCalculationResult {
  
  console.log('📊 Options P&L calculation:', {
    buyPrice,
    sellPrice,
    quantity,
    optionType,
    positionType
  });
  
  let pnl = 0;
  let entryPrice = 0;
  let exitPrice = 0;
  
  if (positionType === 'buy') {
    // Buying options: Entry = Buy Price, Exit = Sell Price
    entryPrice = buyPrice;
    exitPrice = sellPrice;
    pnl = (sellPrice - buyPrice) * quantity;
  } else {
    // Selling options: Entry = Sell Price, Exit = Buy Price
    entryPrice = sellPrice;
    exitPrice = buyPrice;
    pnl = (sellPrice - buyPrice) * quantity;
  }
  
  return {
    pnl,
    entryPrice,
    exitPrice,
    totalQuantity: quantity,
    isProfit: pnl > 0
  };
}