interface ChargeRates {
  brokerage: {
    type: 'flat' | 'percentage' | 'flatOrPercentage';
    flat?: number;
    percentage?: number;
  };
  stt: {
    buy?: number;
    sell: number;
  };
  transactionCharges: {
    nse: number;
    bse: number;
  };
  sebiCharges: number; // per crore
  stampCharges: number; // percentage
  gstRate: number;
}

const zerodhaRates: Record<string, ChargeRates> = {
  'equity-delivery': {
    brokerage: { type: 'flat', flat: 0 },
    stt: { buy: 0.001, sell: 0.001 }, // 0.1% on both buy & sell
    transactionCharges: { nse: 0.0000297, bse: 0.0000375 },
    sebiCharges: 10, // ₹10 per crore
    stampCharges: 0.00015, // 0.015% or ₹1500/crore
    gstRate: 0.18
  },
  'equity-intraday': {
    brokerage: { type: 'flatOrPercentage', flat: 20, percentage: 0.0003 },
    stt: { sell: 0.00025 }, // 0.025% on sell side only
    transactionCharges: { nse: 0.0000297, bse: 0.0000375 },
    sebiCharges: 10,
    stampCharges: 0.00003, // 0.003% or ₹300/crore
    gstRate: 0.18
  },
  'futures': {
    brokerage: { type: 'flatOrPercentage', flat: 20, percentage: 0.0003 },
    stt: { sell: 0.0002 }, // 0.02% on sell side only
    transactionCharges: { nse: 0.0000173, bse: 0 },
    sebiCharges: 10,
    stampCharges: 0.00002, // 0.002% or ₹200/crore
    gstRate: 0.18
  },
  'options': {
    brokerage: { type: 'flat', flat: 20 }, // Flat ₹20 per executed order
    stt: { 
      sell: 0.001 // 0.1% on sell side (on premium), 0.125% on exercised options
    },
    transactionCharges: { nse: 0.0003503, bse: 0.000325 }, // On premium
    sebiCharges: 10,
    stampCharges: 0.00003, // 0.003% or ₹300/crore
    gstRate: 0.18
  }
};

interface CalculationParams {
  segment: string;
  exchange: string;
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  tradeType: 'long' | 'short';
}

export const calculateZerodhaCharges = (params: CalculationParams): number => {
  const { segment, exchange, entryPrice, exitPrice, quantity, tradeType } = params;
  
  const rates = zerodhaRates[segment];
  if (!rates) {
    console.warn(`Unknown segment: ${segment}`);
    return 0;
  }

  const entryValue = entryPrice * quantity;
  const exitValue = exitPrice * quantity;
  const totalValue = entryValue + exitValue;
  
  let totalCharges = 0;

  // 1. Brokerage calculation
  let brokerage = 0;
  if (rates.brokerage.type === 'flat') {
    brokerage = rates.brokerage.flat || 0;
  } else if (rates.brokerage.type === 'percentage') {
    brokerage = totalValue * (rates.brokerage.percentage || 0);
  } else if (rates.brokerage.type === 'flatOrPercentage') {
    const percentageBrokerage = totalValue * (rates.brokerage.percentage || 0);
    brokerage = Math.min(rates.brokerage.flat || 0, percentageBrokerage);
  }
  
  // For equity delivery, brokerage is 0, but for options it's flat ₹20 per order
  if (segment === 'options') {
    brokerage = 20; // Flat ₹20 per executed order
  }
  
  totalCharges += brokerage;

  // 2. STT calculation
  let stt = 0;
  if (segment === 'equity-delivery') {
    // 0.1% on both buy and sell
    stt = totalValue * rates.stt.sell;
  } else if (segment === 'equity-intraday') {
    // 0.025% on sell side only
    stt = exitValue * rates.stt.sell;
  } else if (segment === 'futures') {
    // 0.02% on sell side only
    stt = exitValue * rates.stt.sell;
  } else if (segment === 'options') {
    // 0.1% on sell side (on premium)
    if (tradeType === 'short') {
      stt = exitValue * rates.stt.sell;
    }
  }
  totalCharges += stt;

  // 3. Transaction charges
  const exchangeRate = exchange.toLowerCase() === 'nse' ? rates.transactionCharges.nse : rates.transactionCharges.bse;
  const transactionCharges = totalValue * exchangeRate;
  totalCharges += transactionCharges;

  // 4. SEBI charges (₹10 per crore)
  const sebiCharges = (totalValue / 10000000) * rates.sebiCharges;
  totalCharges += sebiCharges;

  // 5. Stamp charges (on buy side only)
  const stampCharges = entryValue * rates.stampCharges;
  totalCharges += stampCharges;

  // 6. GST (18% on brokerage + SEBI charges + transaction charges)
  const gstableAmount = brokerage + sebiCharges + transactionCharges;
  const gst = gstableAmount * rates.gstRate;
  totalCharges += gst;

  return Math.round(totalCharges * 100) / 100; // Round to 2 decimal places
};

// Simplified estimation function for real-time calculations
export const estimateZerodhaCharges = (
  segment: string, 
  exchange: string, 
  price: number, 
  quantity: number
): number => {
  return calculateZerodhaCharges({
    segment,
    exchange,
    entryPrice: price,
    exitPrice: price,
    quantity,
    tradeType: 'long'
  });
};