import React, { useState, useRef, useEffect } from 'react';
import { useSanitizedHtml } from '@/utils/sanitize-html';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Sparkles, Bot, Send, User, Loader2, MessageCircle, Trash2, Target, 
  TrendingUp, ChartLine, RefreshCcw, BarChart3, TrendingDown, Calendar, 
  Filter, Image, Settings, AlertTriangle 
} from 'lucide-react';
import { getOpenAIKey } from '@/services/ai-analysis-service';
import { 
  chatWithAI, invalidateAIChatCache, 
  getSimplifiedMode, setSimplifiedMode, getDashboardPnL
} from '@/services/ai-chat-service';
import OpenAIKeyForm from './OpenAIKeyForm';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { resetMockData } from '@/utils/reset-mock-data';
import { parseMarkdown, formatIndianCurrency } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isHtml?: boolean;
}

const CHAT_HISTORY_STORAGE_KEY = 'trading-chat-history';

const saveChatHistory = (messages: Message[]) => {
  try {
    localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString()
    }))));
  } catch (error) {
    console.error('Error saving chat history to localStorage:', error);
  }
};

const loadChatHistory = (): Message[] => {
  try {
    const savedHistory = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      return parsedHistory.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading chat history from localStorage:', error);
  }

  return [{
    role: 'assistant' as const,
    content: "Hello! I'm your AI trading mentor from Wiggly. Ask me anything about your trades, strategies, or performance patterns. I have access to your complete trading history.",
    timestamp: new Date(),
    isHtml: false
  }];
};

const QuickSuggestionChip = ({
  icon: Icon,
  text,
  onClick
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  text: string;
  onClick: () => void;
}) => <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors transform hover:scale-105 hover:shadow-md duration-200">
    <Icon className="h-4 w-4" />
    {text}
  </button>;

const MessageActionButton = ({
  icon: Icon,
  onClick,
  tooltip
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  onClick: () => void;
  tooltip: string;
}) => <button onClick={onClick} className="p-1.5 rounded-full hover:bg-primary/10 transition-colors group relative" aria-label={tooltip}>
    <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-background border text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
      {tooltip}
    </span>
  </button>;

const TradingChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(loadChatHistory);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!getOpenAIKey());
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [showSettings, setShowSettings] = useState(false);
  const [simplifiedMode, setSimplifiedModeState] = useState(getSimplifiedMode());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Force refresh on mount to ensure latest PnL is used
  useEffect(() => {
    const initializeChat = async () => {
      try {
        // Force invalidation of cache on component mount
        invalidateAIChatCache();
        await resetMockData();
        setLastRefreshed(new Date());
      } catch (err) {
        console.error('Error initializing chat:', err);
      }
    };
    
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();

    const checkApiKey = () => {
      setHasApiKey(!!getOpenAIKey());
    };
    checkApiKey();
    const interval = setInterval(checkApiKey, 5000);
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory(messages);
    }

    const handleTradeUpdate = () => {
      console.log("Invalidating AI chat cache due to trade update");
      invalidateAIChatCache();
      setRefreshCounter(prev => prev + 1);
      setLastRefreshed(new Date());
    };
    
    const handleDashboardUpdate = (e: any) => {
      console.log("Dashboard data updated - ensuring AI has latest PnL data", e.detail);
      invalidateAIChatCache();
      setRefreshCounter(prev => prev + 1);
      setLastRefreshed(new Date());
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('dashboardDataUpdated', handleDashboardUpdate);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('dashboardDataUpdated', handleDashboardUpdate);
    };
  }, [messages]);

  // Display dashboard PnL in the chat UI for debugging
  useEffect(() => {
    const dashboardPnL = getDashboardPnL();
    if (dashboardPnL !== null) {
      console.log(`Current dashboard PnL for AI: ${formatIndianCurrency(dashboardPnL)}`);
    }
  }, [refreshCounter]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleToggleSimplifiedMode = (value: boolean) => {
    setSimplifiedModeState(value);
    setSimplifiedMode(value);
    invalidateAIChatCache();
    toast.info(value ? 
      "Simplified mode enabled. Using fewer tokens for better performance." : 
      "Simplified mode disabled. Using full context for more comprehensive analysis."
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: newMessage,
      timestamp: new Date(),
      isHtml: false
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Always force cache invalidation for PnL-related queries
      if (newMessage.toLowerCase().includes("pnl") || 
          newMessage.toLowerCase().includes("profit") || 
          newMessage.toLowerCase().includes("total") ||
          newMessage.toLowerCase().includes("earning") ||
          newMessage.toLowerCase().includes("performance")) {
        console.log("User asked about important data - invalidating cache and resetting mock data");
        await resetMockData();
        invalidateAIChatCache();
      }
      
      const response = await chatWithAI(newMessage);
      
      // Convert Markdown to HTML in AI responses
      const formattedContent = parseMarkdown(response);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: formattedContent,
        timestamp: new Date(),
        isHtml: true
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isHtml: false
      }]);
      toast.error("Failed to get AI response. Try refreshing the context data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearConversation = async () => {
    const newInitialMessage: Message[] = [{
      role: 'assistant',
      content: "Hello! I'm your AI trading mentor from Wiggly. Ask me anything about your trades, strategies, or performance patterns. I have access to your complete trading history.",
      timestamp: new Date(),
      isHtml: false
    }];
    setMessages(newInitialMessage);
    saveChatHistory(newInitialMessage);
    
    await resetMockData();
    invalidateAIChatCache();
    setLastRefreshed(new Date());
    toast.success("Conversation cleared and data refreshed");
  };
  
  const refreshChatContext = async () => {
    await resetMockData();
    invalidateAIChatCache();
    setRefreshCounter(prev => prev + 1);
    setLastRefreshed(new Date());
    toast.success("AI context refreshed with latest trade data");
  };

  const quickSuggestions = [
    {
      icon: TrendingUp,
      text: "Top 5 Profitable Trades",
      onClick: () => setNewMessage("Show me my top 5 most profitable trades")
    },
    {
      icon: TrendingDown,
      text: "Worst 5 Trades",
      onClick: () => setNewMessage("What are my 5 worst performing trades?")
    },
    {
      icon: BarChart3,
      text: "Analysis by Symbol",
      onClick: () => setNewMessage("Analyze my trades for RELIANCE")
    },
    {
      icon: Calendar,
      text: "Last Month Trades",
      onClick: () => setNewMessage("How did my trades perform last month?")
    },
    {
      icon: ChartLine,
      text: "Strategy Performance",
      onClick: () => setNewMessage("Which trading strategy has been most profitable?")
    },
    {
      icon: Filter,
      text: "All Time Statistics",
      onClick: () => setNewMessage("What is my overall win rate and profit factor?")
    },
    {
      icon: Image,
      text: "Screenshot Data",
      onClick: () => setNewMessage("How many trades have screenshots and what can I learn from them?")
    }
  ];
  
  const formatTimeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      {!hasApiKey ? (
        <div className="p-6 h-full flex items-center justify-center">
          <OpenAIKeyForm />
        </div>
      ) : (
        <>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl" />
          </div>
          
          <div className="relative flex justify-between items-center p-4 border-b bg-card/80 backdrop-blur-xl z-10">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Wiggly Assistant</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSettings(!showSettings)} 
                className="text-xs flex gap-1.5 items-center hover:bg-primary/10 hover:text-primary"
                title="Chat settings"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Settings</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshChatContext}
                className="text-xs flex gap-1.5 items-center hover:bg-primary/10 hover:text-primary"
                title="Refresh AI context with latest data"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                <span>Refresh</span>
                <span className="text-xs text-muted-foreground ml-1">
                  {formatTimeSince(lastRefreshed)}
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearConversation} 
                className="text-xs flex gap-1.5 items-center hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Chat
              </Button>
            </div>
          </div>
          
          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-b overflow-hidden"
              >
                <div className="p-4 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <h3 className="font-medium">Performance Settings</h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-3">
                    If you're experiencing rate limit errors, try enabling simplified mode
                    to reduce API token usage.
                  </p>
                  
                  <div className="flex items-center justify-between bg-card/80 rounded-lg p-3 border">
                    <div>
                      <h4 className="font-medium">Simplified Mode</h4>
                      <p className="text-xs text-muted-foreground">
                        Uses less context data for better performance
                      </p>
                    </div>
                    <Switch 
                      checked={simplifiedMode}
                      onCheckedChange={handleToggleSimplifiedMode}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex gap-2 p-3 overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent mx-3 my-2">
            <AnimatePresence>
              {quickSuggestions.map((suggestion, index) => (
                <motion.div 
                  key={index} 
                  initial={{
                    opacity: 0,
                    y: 10
                  }} 
                  animate={{
                    opacity: 1,
                    y: 0
                  }} 
                  transition={{
                    duration: 0.3,
                    delay: index * 0.1
                  }}
                >
                  <QuickSuggestionChip icon={suggestion.icon} text={suggestion.text} onClick={suggestion.onClick} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-2 mt-1 relative">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`} 
                  initial={{
                    opacity: 0,
                    y: 20
                  }} 
                  animate={{
                    opacity: 1,
                    y: 0
                  }} 
                  transition={{
                    duration: 0.3
                  }}
                >
                  <div className="relative max-w-[85%]">
                    <div className={`flex ${message.role === 'user' ? 'flex-row-reverse bg-gradient-to-r from-primary/80 to-primary/60 text-white rounded-2xl rounded-tr-sm shadow-lg' : 'bg-card shadow-md rounded-2xl rounded-tl-sm border border-border/40 backdrop-blur-sm'} p-4 gap-3`}>
                      <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'} self-start`}>
                        {message.role === 'user' ? (
                          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center shadow-sm ring-2 ring-white/10">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1 flex-1 chat-message-content">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${message.role === 'user' ? 'text-white/90' : 'text-primary'}`}>
                            {message.role === 'user' ? 'You' : 'Wiggly AI'}
                          </span>
                          <span className={`text-xs ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        {message.isHtml ? (
                          <div 
                            className="text-sm prose prose-sm max-w-full dark:prose-invert chat-formatted-message" 
                            dangerouslySetInnerHTML={useSanitizedHtml(message.content, 'default')}
                          />
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  className="flex justify-start" 
                  initial={{
                    opacity: 0,
                    y: 10
                  }} 
                  animate={{
                    opacity: 1,
                    y: 0
                  }} 
                  transition={{
                    duration: 0.2
                  }}
                >
                  <div className="bg-card/80 backdrop-blur-sm shadow-md rounded-2xl rounded-tl-sm p-4 flex items-center gap-3 max-w-[85%] border border-border/40">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{
                        animationDelay: "0.2s"
                      }} />
                      <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{
                        animationDelay: "0.4s"
                      }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t bg-card/90 backdrop-blur-xl relative z-10">
            <div className="flex gap-3 items-end max-w-5xl mx-auto">
              <div className="flex-1 relative">
                <Textarea 
                  value={newMessage} 
                  onChange={e => setNewMessage(e.target.value)} 
                  onKeyDown={handleKeyDown} 
                  placeholder="Ask about your trades, patterns, or suggestions..." 
                  className="resize-none min-h-[60px] bg-background/80 backdrop-blur-sm rounded-xl pr-12 shadow-inner focus-within:shadow-primary/10 transition-shadow" 
                  disabled={isLoading} 
                />
                <div className="absolute right-3 bottom-3">
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !newMessage.trim()} 
                    size="icon" 
                    className="rounded-full h-9 w-9 bg-gradient-to-r from-primary to-blue-500 shadow-md hover:shadow-lg transition-all hover:scale-105 text-white"
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <style>
            {`
            .chat-formatted-message table {
              border-collapse: collapse;
              width: 100%;
              margin: 1rem 0;
              font-size: 0.875rem;
              overflow-x: auto;
              display: block;
              border-radius: 0.5rem;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
              background-color: rgb(255 255 255 / 0.05);
            }
            
            .chat-formatted-message th {
              background-color: rgba(155, 135, 245, 0.15);
              color: var(--primary);
              font-weight: 600;
              text-align: center;
              padding: 0.75rem;
              border: 1px solid rgba(148, 163, 184, 0.2);
            }
            
            .chat-formatted-message td {
              padding: 0.75rem;
              border: 1px solid rgba(148, 163, 184, 0.2);
              text-align: center;
            }
            
            .chat-formatted-message tr:nth-child(even) {
              background-color: rgba(241, 245, 249, 0.05);
            }
            
            .chat-formatted-message h1,
            .chat-formatted-message h2,
            .chat-formatted-message h3 {
              color: var(--primary);
              margin-top: 1.25rem;
              margin-bottom: 0.75rem;
              font-weight: 600;
              line-height: 1.5;
            }
            
            .chat-formatted-message h1 {
              font-size: 1.5rem;
            }
            
            .chat-formatted-message h2 {
              font-size: 1.25rem;
            }
            
            .chat-formatted-message h3 {
              font-size: 1.125rem;
            }
            
            .chat-formatted-message ul,
            .chat-formatted-message ol {
              margin-left: 1.5rem;
              margin-bottom: 1.25rem;
            }
            
            .chat-formatted-message li {
              margin-bottom: 0.35rem;
              padding-left: 0.5rem;
              position: relative;
            }
            
            .chat-formatted-message li::before {
              content: "•";
              position: absolute;
              left: -1rem;
              color: var(--primary);
            }
            
            .chat-formatted-message p {
              margin-bottom: 0.75rem;
              line-height: 1.6;
            }
            
            .chat-formatted-message a {
              color: var(--primary);
              text-decoration: underline;
              text-underline-offset: 2px;
              transition: all 0.2s ease;
            }
            
            .chat-formatted-message a:hover {
              opacity: 0.8;
            }
            
            /* Scrollbar styling */
            .scrollbar-thin {
              scrollbar-width: thin;
            }
            
            .scrollbar-thin::-webkit-scrollbar {
              width: 4px;
              height: 4px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-track {
              background: transparent;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb {
              background: rgba(155, 135, 245, 0.2);
              border-radius: 999px;
            }
            
            .scrollbar-thin::-webkit-scrollbar-thumb:hover {
              background: rgba(155, 135, 245, 0.4);
            }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default TradingChatBot;
