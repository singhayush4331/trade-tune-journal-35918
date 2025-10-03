
import { toast } from "sonner";

export enum AIErrorType {
  RATE_LIMIT = "RATE_LIMIT",
  TOKEN_LIMIT = "TOKEN_LIMIT",
  CONTEXT_LENGTH = "CONTEXT_LENGTH",
  NETWORK = "NETWORK",
  AUTH = "AUTH",
  UNKNOWN = "UNKNOWN"
}

interface AIError {
  type: AIErrorType;
  message: string;
  suggestions: string[];
}

export const detectErrorType = (error: any): AIErrorType => {
  const errorMessage = error?.message?.toLowerCase() || 
                       error?.toString().toLowerCase() || 
                       "";
  
  if (errorMessage.includes("rate limit") || 
      errorMessage.includes("too many requests") ||
      errorMessage.includes("429")) {
    return AIErrorType.RATE_LIMIT;
  }
  
  if (errorMessage.includes("maximum context length") ||
      errorMessage.includes("token limit")) {
    return AIErrorType.CONTEXT_LENGTH;
  }
  
  if (errorMessage.includes("network") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("failed to fetch")) {
    return AIErrorType.NETWORK;
  }
  
  if (errorMessage.includes("auth") ||
      errorMessage.includes("key") ||
      errorMessage.includes("unauthorized") ||
      errorMessage.includes("401")) {
    return AIErrorType.AUTH;
  }
  
  return AIErrorType.UNKNOWN;
};

export const getErrorDetails = (error: any): AIError => {
  const errorType = detectErrorType(error);
  
  switch(errorType) {
    case AIErrorType.RATE_LIMIT:
      return {
        type: errorType,
        message: "OpenAI rate limit exceeded",
        suggestions: [
          "Wait a few minutes before trying again",
          "Try using simplified mode",
          "Ask shorter, more focused questions"
        ]
      };
    
    case AIErrorType.CONTEXT_LENGTH:
      return {
        type: errorType,
        message: "Your trading history is too large for analysis",
        suggestions: [
          "Enable simplified mode to use less context data",
          "Ask about specific recent trades",
          "Ask more focused questions about specific aspects"
        ]
      };
    
    case AIErrorType.NETWORK:
      return {
        type: errorType,
        message: "Network error connecting to AI service",
        suggestions: [
          "Check your internet connection",
          "Try again in a moment",
          "Refresh the page if problem persists"
        ]
      };
    
    case AIErrorType.AUTH:
      return {
        type: errorType,
        message: "Authentication error with OpenAI",
        suggestions: [
          "Check if your API key is valid",
          "Try adding your API key again",
          "Your API key may have expired or been revoked"
        ]
      };
    
    default:
      return {
        type: AIErrorType.UNKNOWN,
        message: "Unexpected error occurred",
        suggestions: [
          "Try again with a simpler query",
          "Refresh the page",
          "Clear chat history and start fresh"
        ]
      };
  }
};

export const handleAIError = (error: any): string => {
  const details = getErrorDetails(error);
  
  // Log detailed error for debugging
  console.error(`AI Error (${details.type}):`, error);
  
  // Show user-friendly toast with first suggestion
  toast.error(details.message, {
    description: details.suggestions[0],
    duration: 3000 // reduced from 5000ms to 3000ms
  });
  
  // Return friendly message for chat
  return `I encountered an error: ${details.message}.
  
Here are some suggestions:
- ${details.suggestions.join('\n- ')}

Feel free to try again with a different approach.`;
};
