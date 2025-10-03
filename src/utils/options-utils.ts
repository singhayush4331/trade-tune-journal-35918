// Utility functions for options trading detection and auto-calculation

export interface OptionDetectionResult {
  isOption: boolean;
  optionType: 'CE' | 'PE' | '';
  underlyingSymbol?: string;
  strikePrice?: string;
  expiry?: string;
}

/**
 * Detects if a symbol is an options contract and extracts option details
 * Supports various Indian options naming conventions including real trading platform formats
 */
export function detectOptionFromSymbol(symbol: string): OptionDetectionResult {
  console.log('🔍 Options detection called with symbol:', symbol);
  
  if (!symbol) {
    console.log('❌ No symbol provided');
    return { isOption: false, optionType: '' };
  }

  let symbolUpper = symbol.toUpperCase().trim();
  console.log('🧹 Cleaned symbol:', symbolUpper);
  
  // Remove common exchange prefixes
  const exchangePrefixes = ['NSE:', 'BSE:', 'MCX:', 'NFO:'];
  for (const prefix of exchangePrefixes) {
    if (symbolUpper.startsWith(prefix)) {
      symbolUpper = symbolUpper.substring(prefix.length);
      console.log('🏛️ Removed exchange prefix, new symbol:', symbolUpper);
      break;
    }
  }
  
  // Enhanced patterns for real trading platform symbols:
  // NSE:NIFTY25807246550PE, BANKNIFTY45000CE, RELIANCE2500CE
  // NIFTY 24000 CE, BANKNIFTY 45000 PE (with spaces)
  // NIFTY24JAN2500CE, BANKNIFTY24FEB45000PE (with expiry)
  
  const optionPatterns = [
    // Pattern 1: SYMBOL + LONG_CONTRACT_ID + CE/PE (e.g., NIFTY25807246650PE)
    /^([A-Z]+)(\d{8,})(CE|PE)$/,
    // Pattern 2: SYMBOL + STRIKE + CE/PE (e.g., NIFTY24000CE)
    /^([A-Z]+)(\d{4,7})(CE|PE)$/,
    // Pattern 3: SYMBOL + EXPIRY + STRIKE + CE/PE (e.g., NIFTY24JAN2500CE)
    /^([A-Z]+)(\d{2}[A-Z]{3})(\d+)(CE|PE)$/,
    // Pattern 4: SYMBOL + space + STRIKE + space + CE/PE
    /^([A-Z]+)\s+(\d+)\s+(CE|PE)$/,
    // Pattern 5: More complex with dates
    /^([A-Z]+)(\d{2}[A-Z]{3}\d{2})(\d+)(CE|PE)$/
  ];

  console.log('🔍 Testing patterns against symbol:', symbolUpper);
  
  for (let i = 0; i < optionPatterns.length; i++) {
    const pattern = optionPatterns[i];
    const match = symbolUpper.match(pattern);
    console.log(`📋 Pattern ${i + 1} (${pattern.source}):`, match ? 'MATCH' : 'NO MATCH');
    
    if (match) {
      const optionType = match[match.length - 1] as 'CE' | 'PE';
      let underlyingSymbol = match[1];
      const contractInfo = match.length > 3 ? match[2] : '';
      
      // Standardize underlying symbols for major indices
      if (underlyingSymbol.includes('NIFTY')) {
        underlyingSymbol = underlyingSymbol.includes('BANK') ? 'BANKNIFTY' : 'NIFTY';
      }
      
      // Extract strike price from contract info if it's a long contract ID
      let strikePrice = '';
      if (contractInfo.length >= 8) {
        // For long contract IDs like 25807246650, the last 5 digits are usually the strike
        strikePrice = contractInfo.slice(-5);
      } else {
        strikePrice = contractInfo;
      }
      
      console.log('✅ Pattern matched! Details:', {
        pattern: i + 1,
        optionType,
        underlyingSymbol,
        strikePrice,
        fullMatch: match
      });
      
      return {
        isOption: true,
        optionType,
        underlyingSymbol,
        strikePrice,
        expiry: match.length > 4 ? match[2] : undefined
      };
    }
  }

  // Enhanced fallback: Check for CE/PE anywhere in the symbol
  if (symbolUpper.includes('CE') || symbolUpper.includes('PE')) {
    const optionType = symbolUpper.includes('CE') ? 'CE' : 'PE';
    
    // Extract underlying symbol more intelligently
    let underlyingSymbol = symbolUpper;
    
    // Remove CE/PE from the end
    underlyingSymbol = underlyingSymbol.replace(/(CE|PE)$/, '');
    
    // Remove numbers from the end (contract identifiers, strike prices)
    underlyingSymbol = underlyingSymbol.replace(/\d+$/, '');
    
    // Remove common separators and clean up
    underlyingSymbol = underlyingSymbol.replace(/[-_\s]+$/, '').trim();
    
    // Handle common underlying symbols
    if (underlyingSymbol.includes('NIFTY')) {
      underlyingSymbol = underlyingSymbol.includes('BANK') ? 'BANKNIFTY' : 'NIFTY';
    }
    
    console.log('✅ Fallback detection successful:', {
      optionType,
      underlyingSymbol
    });
    
    return {
      isOption: true,
      optionType,
      underlyingSymbol: underlyingSymbol || 'UNKNOWN'
    };
  }

  console.log('❌ No options pattern detected');
  return { isOption: false, optionType: '' };
}

/**
 * Auto-calculates trade direction based on options logic
 * Buy CE = Bullish (Long), Buy PE = Bearish (Short)
 * Sell CE = Bearish (Short), Sell PE = Bullish (Long)
 */
export function calculateOptionsTradeDirection(
  optionType: 'CE' | 'PE',
  positionType: 'buy' | 'sell'
): 'long' | 'short' {
  if (optionType === 'CE') {
    return positionType === 'buy' ? 'long' : 'short';
  } else if (optionType === 'PE') {
    return positionType === 'buy' ? 'short' : 'long';
  }
  
  return 'long'; // default fallback
}

/**
 * Gets the explanation text for the auto-detected direction
 */
export function getOptionsDirectionExplanation(
  optionType: 'CE' | 'PE',
  positionType: 'buy' | 'sell',
  tradeDirection: 'long' | 'short'
): string {
  const action = positionType === 'buy' ? 'Buying' : 'Selling';
  const optionName = optionType === 'CE' ? 'Call' : 'Put';
  const sentiment = tradeDirection === 'long' ? 'Bullish' : 'Bearish';
  
  return `${action} ${optionName} = ${sentiment} on underlying`;
}

/**
 * Validates if the detected options data is consistent
 */
export function validateOptionsData(
  symbol: string,
  marketSegment: string,
  optionType: string,
  positionType: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check if symbol contains CE/PE when market segment is options
  if (marketSegment === 'options') {
    const detection = detectOptionFromSymbol(symbol);
    if (!detection.isOption && symbol) {
      errors.push('Symbol should contain CE/PE for options trading');
    }
  }
  
  // Check if options fields are filled when market segment is options
  if (marketSegment === 'options' && (!optionType || !positionType)) {
    errors.push('Option type and position type are required for options trading');
  }
  
  // Warn if non-options symbol is used with options market segment
  if (marketSegment !== 'options' && (optionType || positionType)) {
    errors.push('Option fields should only be used with options market segment');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}