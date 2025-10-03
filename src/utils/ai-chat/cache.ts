
// Simple cache for AI chat data
interface CacheData {
  data: any;
  timestamp: number;
  isLoading: boolean;
  oldestTrade?: any;
}

// Set a short cache expiry time to ensure freshness
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

let cachedData: CacheData = {
  data: null,
  timestamp: 0,
  isLoading: false
};

export const getCachedData = (): CacheData => {
  return cachedData;
};

export const setCachedData = (data: any): void => {
  cachedData = {
    data,
    timestamp: Date.now(),
    isLoading: false,
    oldestTrade: cachedData.oldestTrade // Preserve oldest trade reference
  };
};

export const setLoadingState = (loading: boolean): void => {
  cachedData.isLoading = loading;
};

export const invalidateCache = (): void => {
  console.log("AI context cache invalidated - forcing fresh data");
  cachedData = {
    data: null,
    timestamp: 0,
    isLoading: false
  };
};

export const isCacheValid = (message: string): boolean => {
  // PnL related queries should ALWAYS bypass cache
  if (message.toLowerCase().includes("pnl") || 
      message.toLowerCase().includes("profit") || 
      message.toLowerCase().includes("total") ||
      message.toLowerCase().includes("earn") ||
      message.toLowerCase().includes("performance")) {
    console.log("PnL-related query detected - bypassing cache");
    return false;
  }
  
  // Cache is valid if:
  // 1. We have data
  // 2. The timestamp is recent
  const hasData = !!cachedData.data;
  const isFresh = Date.now() - cachedData.timestamp < CACHE_EXPIRY;
  
  // Check if this is a special query that should bypass cache
  const bypassCacheKeywords = [
    "refresh", "update", "latest", "newest", "current",
    "today", "now", "recent", "this week", "this month"
  ];
  
  const shouldBypassCache = bypassCacheKeywords.some(
    keyword => message.toLowerCase().includes(keyword)
  );
  
  return hasData && isFresh && !shouldBypassCache;
};

// Let subscribers know when the cache changes
export const notifyCacheChanged = (): void => {
  window.dispatchEvent(new CustomEvent('aiCacheUpdated', {
    detail: {
      timestamp: cachedData.timestamp
    }
  }));
};
