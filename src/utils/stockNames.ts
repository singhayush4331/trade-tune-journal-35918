// Popular Indian stocks with their symbols and names
export const stockNames = [
  // Indian Indices
  { symbol: "NIFTY50", name: "Nifty 50 Index", type: "Index" },
  { symbol: "BANKNIFTY", name: "Bank Nifty Index", type: "Index" },
  { symbol: "FINNIFTY", name: "Nifty Financial Services", type: "Index" },
  { symbol: "SENSEX", name: "S&P BSE SENSEX", type: "Index" },
  { symbol: "MIDCPNIFTY", name: "Nifty Midcap Select", type: "Index" },
  { symbol: "NIFTYMETAL", name: "Nifty Metal", type: "Index" },
  { symbol: "NIFTYIT", name: "Nifty IT", type: "Index" },
  { symbol: "NIFTYPHARMA", name: "Nifty Pharma", type: "Index" },
  { symbol: "NIFTYAUTO", name: "Nifty Auto", type: "Index" },
  { symbol: "NIFTYFMCG", name: "Nifty FMCG", type: "Index" },
  { symbol: "NIFTY100", name: "Nifty 100 Index", type: "Index" },
  
  // Nifty 100 Stocks
  { symbol: "RELIANCE", name: "Reliance Industries", type: "Stock" },
  { symbol: "TCS", name: "Tata Consultancy Services", type: "Stock" },
  { symbol: "HDFCBANK", name: "HDFC Bank", type: "Stock" },
  { symbol: "INFY", name: "Infosys", type: "Stock" },
  { symbol: "ICICIBANK", name: "ICICI Bank", type: "Stock" },
  { symbol: "SBIN", name: "State Bank of India", type: "Stock" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", type: "Stock" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", type: "Stock" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", type: "Stock" },
  { symbol: "ADANIENT", name: "Adani Enterprises", type: "Stock" },
  { symbol: "WIPRO", name: "Wipro", type: "Stock" },
  { symbol: "AXISBANK", name: "Axis Bank", type: "Stock" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", type: "Stock" },
  { symbol: "LT", name: "Larsen & Toubro", type: "Stock" },
  { symbol: "MARUTI", name: "Maruti Suzuki India", type: "Stock" },
  { symbol: "TATAMOTORS", name: "Tata Motors", type: "Stock" },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", type: "Stock" },
  { symbol: "ITC", name: "ITC", type: "Stock" },
  { symbol: "ASIANPAINT", name: "Asian Paints", type: "Stock" },
  { symbol: "HCLTECH", name: "HCL Technologies", type: "Stock" },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", type: "Stock" },
  { symbol: "TATASTEEL", name: "Tata Steel", type: "Stock" },
  { symbol: "POWERGRID", name: "Power Grid Corporation", type: "Stock" },
  { symbol: "NTPC", name: "NTPC", type: "Stock" },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", type: "Stock" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv", type: "Stock" },
  { symbol: "JSWSTEEL", name: "JSW Steel", type: "Stock" },
  { symbol: "HINDALCO", name: "Hindalco Industries", type: "Stock" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", type: "Stock" },
  { symbol: "ZOMATO", name: "Zomato", type: "Stock" },
  { symbol: "PAYTM", name: "Paytm (One97)", type: "Stock" },
  { symbol: "NYKAA", name: "FSN E-commerce (Nykaa)", type: "Stock" },
  { symbol: "POLICYBZR", name: "PB Fintech (PolicyBazaar)", type: "Stock" },
  // Additional Nifty 100 Stocks
  { symbol: "ADANIPOWER", name: "Adani Power", type: "Stock" },
  { symbol: "ADANIGREEN", name: "Adani Green Energy", type: "Stock" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals", type: "Stock" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", type: "Stock" },
  { symbol: "BAJAJHLDNG", name: "Bajaj Holdings", type: "Stock" },
  { symbol: "BPCL", name: "Bharat Petroleum", type: "Stock" },
  { symbol: "BRITANNIA", name: "Britannia Industries", type: "Stock" },
  { symbol: "CIPLA", name: "Cipla", type: "Stock" },
  { symbol: "COALINDIA", name: "Coal India", type: "Stock" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories", type: "Stock" },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", type: "Stock" },
  { symbol: "EICHERMOT", name: "Eicher Motors", type: "Stock" },
  { symbol: "GRASIM", name: "Grasim Industries", type: "Stock" },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance", type: "Stock" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", type: "Stock" },
  { symbol: "HDFC", name: "Housing Development Finance Corporation", type: "Stock" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank", type: "Stock" },
  { symbol: "IOC", name: "Indian Oil Corporation", type: "Stock" },
  { symbol: "JSWSTEEL", name: "JSW Steel", type: "Stock" },
  { symbol: "JUBLFOOD", name: "Jubilant FoodWorks", type: "Stock" },
  { symbol: "LTI", name: "Larsen & Toubro Infotech", type: "Stock" },
  { symbol: "M&M", name: "Mahindra & Mahindra", type: "Stock" },
  { symbol: "MARICO", name: "Marico", type: "Stock" },
  { symbol: "NESTLEIND", name: "Nestle India", type: "Stock" },
  { symbol: "NIFTY", name: "Nifty 50 Index Fund", type: "Stock" },
  { symbol: "ONGC", name: "Oil and Natural Gas Corporation", type: "Stock" },
  { symbol: "PNB", name: "Punjab National Bank", type: "Stock" },
  { symbol: "PIDILITIND", name: "Pidilite Industries", type: "Stock" },
  { symbol: "SBILIFE", name: "SBI Life Insurance", type: "Stock" },
  { symbol: "SHREECEM", name: "Shree Cement", type: "Stock" },
  { symbol: "SIEMENS", name: "Siemens", type: "Stock" },
  { symbol: "TATACONSUM", name: "Tata Consumer Products", type: "Stock" },
  { symbol: "TATAPOWER", name: "Tata Power", type: "Stock" },
  { symbol: "TATASTEEL", name: "Tata Steel", type: "Stock" },
  { symbol: "TECHM", name: "Tech Mahindra", type: "Stock" },
  { symbol: "TITAN", name: "Titan Company", type: "Stock" },
  { symbol: "TORNTPHARM", name: "Torrent Pharmaceuticals", type: "Stock" },
  { symbol: "UPL", name: "UPL Limited", type: "Stock" },
  { symbol: "VEDL", name: "Vedanta", type: "Stock" },
  { symbol: "YESBANK", name: "Yes Bank", type: "Stock" },
  { symbol: "ZEEL", name: "Zee Entertainment Enterprises", type: "Stock" },
  { symbol: "GODREJCP", name: "Godrej Consumer Products", type: "Stock" },
  { symbol: "HAVELLS", name: "Havells India", type: "Stock" },
  { symbol: "DABUR", name: "Dabur India", type: "Stock" },
  { symbol: "DLF", name: "DLF Limited", type: "Stock" },
  { symbol: "BANKBARODA", name: "Bank of Baroda", type: "Stock" },
  { symbol: "BIOCON", name: "Biocon", type: "Stock" },
  { symbol: "BOSCHLTD", name: "Bosch", type: "Stock" },
  { symbol: "COLPAL", name: "Colgate-Palmolive", type: "Stock" },
  { symbol: "CONCOR", name: "Container Corporation of India", type: "Stock" },
  { symbol: "GAIL", name: "GAIL India", type: "Stock" },
  { symbol: "GODREJPROP", name: "Godrej Properties", type: "Stock" },
  { symbol: "HDFCAMC", name: "HDFC Asset Management Company", type: "Stock" },
  { symbol: "INDIGO", name: "InterGlobe Aviation", type: "Stock" },
  { symbol: "LUPIN", name: "Lupin", type: "Stock" },
  { symbol: "MRF", name: "MRF", type: "Stock" },
  { symbol: "MUTHOOTFIN", name: "Muthoot Finance", type: "Stock" },
  { symbol: "NMDC", name: "NMDC", type: "Stock" },
  { symbol: "PIIND", name: "PI Industries", type: "Stock" },
  { symbol: "PAGEIND", name: "Page Industries", type: "Stock" },
  { symbol: "SAIL", name: "Steel Authority of India", type: "Stock" },
  { symbol: "SRF", name: "SRF Limited", type: "Stock" },
  { symbol: "SBICARD", name: "SBI Cards and Payment Services", type: "Stock" },
  { symbol: "ADANITRANS", name: "Adani Transmission", type: "Stock" },
  { symbol: "AMBUJACEM", name: "Ambuja Cements", type: "Stock" },
  { symbol: "ACC", name: "ACC", type: "Stock" },
  { symbol: "AUROPHARMA", name: "Aurobindo Pharma", type: "Stock" },
  { symbol: "BERGEPAINT", name: "Berger Paints", type: "Stock" },
  { symbol: "CHOLAFIN", name: "Cholamandalam Investment", type: "Stock" },
  { symbol: "JINDALSTEL", name: "Jindal Steel & Power", type: "Stock" },
];

export const getStockSuggestions = (query: string): Array<{ symbol: string; name: string; type: string }> => {
  if (!query || query.length < 1) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  
  // Create arrays for different match types based on relevance
  const symbolStartsWithMatches: Array<{ symbol: string; name: string; type: string }> = [];
  const nameStartsWithMatches: Array<{ symbol: string; name: string; type: string }> = [];
  const symbolContainsMatches: Array<{ symbol: string; name: string; type: string }> = [];
  const nameContainsMatches: Array<{ symbol: string; name: string; type: string }> = [];
  
  stockNames.forEach(stock => {
    const symbolLower = stock.symbol.toLowerCase();
    const nameLower = stock.name.toLowerCase();
    
    // Highest priority: Symbol starts with query
    if (symbolLower.startsWith(lowerCaseQuery)) {
      symbolStartsWithMatches.push(stock);
    }
    // Second priority: Name starts with query
    else if (nameLower.startsWith(lowerCaseQuery)) {
      nameStartsWithMatches.push(stock);
    }
    // Third priority: Symbol contains query
    else if (symbolLower.includes(lowerCaseQuery)) {
      symbolContainsMatches.push(stock);
    }
    // Lowest priority: Name contains query
    else if (nameLower.includes(lowerCaseQuery)) {
      nameContainsMatches.push(stock);
    }
  });
  
  // Combine the arrays in order of priority
  const combinedMatches = [
    ...symbolStartsWithMatches,
    ...nameStartsWithMatches,
    ...symbolContainsMatches,
    ...nameContainsMatches
  ];
  
  // Return a reasonable number of suggestions (10 for better coverage)
  return combinedMatches.slice(0, 10);
};

export const groupStocksByType = (stocks: Array<{ symbol: string; name: string; type: string }>) => {
  const indices = stocks.filter(stock => stock.type === 'Index');
  const stocks_ = stocks.filter(stock => stock.type === 'Stock');
  
  return {
    indices,
    stocks: stocks_
  };
};
