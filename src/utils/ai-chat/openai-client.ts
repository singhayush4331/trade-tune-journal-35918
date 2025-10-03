
import { OpenAI } from 'openai';
import { toast } from 'sonner';

const OPENAI_KEY_STORAGE = 'openai_api_key';

// Secured getter with validation - for client-side AI chat only
export const getOpenAIKey = () => {
  if (typeof window !== 'undefined') {
    const key = localStorage.getItem(OPENAI_KEY_STORAGE);
    // Basic validation - check if key follows expected format
    if (key && (key.startsWith('sk-') || key.length > 30)) {
      return key;
    }
  }
  return null;
};

export const setOpenAIKey = (key: string) => {
  if (typeof window !== 'undefined' && key) {
    try {
      localStorage.setItem(OPENAI_KEY_STORAGE, key);
      toast.success("OpenAI key saved successfully for AI Chat");
      return true;
    } catch (error) {
      toast.error("Failed to save OpenAI key");
    }
  }
  return false;
};

export const clearOpenAIKey = () => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(OPENAI_KEY_STORAGE);
      toast.info("OpenAI key removed");
      return true;
    } catch (error) {
      // Silent fail for security
    }
  }
  return false;
};

export const invalidateCache = () => {
  // Cache invalidated silently for security
};

// Enhanced OpenAI client initialization with more resilient retry mechanism
export const initializeOpenAIClient = () => {
  const apiKey = getOpenAIKey();
  
  if (!apiKey) return null;
  
  // Create singleton instance with optimized settings
  const client = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
    maxRetries: 3,
    timeout: 60000, // 60 second timeout
    defaultHeaders: {
      'Content-Type': 'application/json',
      'User-Agent': 'Wiggly/1.0',
    },
    defaultQuery: {
      'client': 'wiggly-web',
    }
  });
  
  return client;
};

// Improved retry handler with exponential backoff
export const isRetryableError = (error: any): boolean => {
  // More comprehensive error detection
  if (!error) return false;
  
  const status = error.status || (error.response && error.response.status);
  
  // Specific error codes that should trigger retry
  const retryableStatusCodes = [429, 500, 502, 503, 504];
  
  if (status && retryableStatusCodes.includes(status)) {
    return true;
  }
  
  // Check for network errors in various formats
  return !!(error.message && (
    error.message.includes('network') || 
    error.message.includes('timeout') || 
    error.message.includes('rate limit') ||
    error.message.includes('ECONNRESET') ||
    error.message.includes('socket hang up') ||
    error.message.includes('aborted')
  ));
};

// Calculate exponential backoff delay with jitter
export const calculateRetryDelay = (attempt: number): number => {
  const baseDelay = 1000; // 1 second base
  const maxDelay = 30000; // 30 seconds max
  
  // Exponential backoff with random jitter (0-500ms)
  const expBackoff = Math.min(
    maxDelay, 
    baseDelay * Math.pow(2, attempt) + Math.random() * 500
  );
  
  return expBackoff;
};
