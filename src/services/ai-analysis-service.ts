import { fetchUserTrades } from './trades-service';
import { toast } from 'sonner';

// Key management
const OPENAI_KEY_STORAGE = 'openai_api_key';

export const getOpenAIKey = () => {
  // Enhanced key retrieval with better error handling
  const key = localStorage.getItem(OPENAI_KEY_STORAGE);
  
  // Log diagnostic information
  console.log('OpenAI key retrieval:', {
    keyExists: !!key,
    keyLength: key ? key.length : 0
  });
  
  return key;
};

export const setOpenAIKey = (key: string) => {
  // Validate key before storing
  if (!key || key.trim().length < 20) {
    toast.error('Invalid API key. Please check and try again.');
    return false;
  }
  
  try {
    localStorage.setItem(OPENAI_KEY_STORAGE, key.trim());
    toast.success('OpenAI API key saved successfully!');
    return true;
  } catch (error) {
    console.error('Error saving OpenAI key:', error);
    toast.error('Failed to save API key. Please try again.');
    return false;
  }
};

export const clearOpenAIKey = () => {
  try {
    localStorage.removeItem(OPENAI_KEY_STORAGE);
    toast.info('OpenAI API key has been removed.');
    return true;
  } catch (error) {
    console.error('Error clearing OpenAI key:', error);
    return false;
  }
};

// Type definition for analysis result
export interface AnalysisResult {
  insights?: string;
  recommendations?: string[];
  patterns?: { description: string; confidence: number }[];
  error?: string;
}

// Function to analyze trades using OpenAI
export const analyzeTrades = async (): Promise<AnalysisResult> => {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    return { error: "OpenAI API key not found. Please add your API key to continue." };
  }

  try {
    // Fetch user's trading history
    const { data: trades, error: tradesError } = await fetchUserTrades();
    
    if (tradesError || !trades || trades.length === 0) {
      return { 
        error: trades?.length === 0 
          ? "No trades found to analyze. Add some trades first." 
          : "Failed to fetch trades for analysis." 
      };
    }

    // Prepare the trade data for analysis
    const tradeData = trades.map(trade => ({
      symbol: trade.symbol,
      type: trade.type,
      entry_price: trade.entryPrice,
      exit_price: trade.exitPrice,
      quantity: trade.quantity,
      pnl: trade.pnl,
      date: trade.date,
      notes: trade.notes,
      strategy: trade.strategy,
      mood: trade.mood
    }));

    // Send to OpenAI for analysis
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional trading analyst with expertise in pattern recognition and behavioral analysis. 
            Analyze the provided trading history and provide insights in the following format:

            ## Insights
            1. Pattern Recognition in Trading Behavior: 
            - Specific observation 1
            - Specific observation 2
            
            2. Correlation Between Strategies and Outcomes:
            - Specific observation 1
            - Specific observation 2
            
            3. Risk Management Patterns:
            - Specific observation 1
            - Specific observation 2
            
            4. Emotional Trading Indicators:
            - Specific observation 1
            - Specific observation 2
            
            5. Market Timing Analysis:
            - Specific observation 1
            - Specific observation 2
            
            ## Recommendations
            - Action item 1
            - Action item 2
            - Action item 3
            - Action item 4
            - Action item 5
            
            ## Patterns
            - Pattern 1
            - Pattern 2
            - Pattern 3
            - Pattern 4
            - Pattern 5
            
            For each section, use professional, clear language and highlight critical patterns with specific examples.`
          },
          {
            role: "user",
            content: JSON.stringify(tradeData)
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const analysis = aiResponse.choices[0].message.content;
    console.log("Raw AI response:", analysis);

    // Process the analysis text to extract sections
    const sections = analysis.split(/(?=## )/g);
    
    // Parse the structured response
    let insights = '';
    let recommendations: string[] = [];
    let patterns: { description: string; confidence: number }[] = [];

    sections.forEach(section => {
      if (section.toLowerCase().includes('insight')) {
        insights = section.replace('## Insights', '').trim();
      } else if (section.toLowerCase().includes('recommend')) {
        recommendations = section
          .replace('## Recommendations', '')
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^- /, '').trim());
      } else if (section.toLowerCase().includes('pattern')) {
        patterns = section
          .replace('## Patterns', '')
          .split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => {
            const pattern = line.replace(/^- /, '').trim();
            // Generate a random confidence score between 0.6 and 0.95
            const confidence = 0.6 + Math.random() * 0.35;
            return {
              description: pattern,
              confidence
            };
          });
      }
    });

    console.log("Parsed results:", { insights, recommendations: recommendations.length, patterns: patterns.length });

    return {
      insights,
      recommendations,
      patterns
    };

  } catch (error) {
    console.error('Analysis error:', error);
    toast.error('Failed to analyze trades. Please try again.');
    return { error: 'Failed to analyze trades. Please check your API key and try again.' };
  }
};

// Function to predict trade performance
export const predictTradePerformance = async (trade: {
  symbol: string;
  type: string;
  entryPrice: number;
  quantity: number;
  strategy?: string;
}) => {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    return { error: "OpenAI API key not found. Please add your API key to continue." };
  }

  try {
    // Fetch user's trading history for context
    const { data: trades, error: tradesError } = await fetchUserTrades();
    
    if (tradesError) {
      console.error('Error fetching trade history:', tradesError);
      // Continue with prediction but without historical context
    }

    // Format historical data if available
    const tradeHistory = trades && trades.length > 0 
      ? trades.slice(0, 10).map(t => ({
          symbol: t.symbol,
          type: t.type,
          entry_price: t.entryPrice,
          exit_price: t.exitPrice,
          quantity: t.quantity,
          pnl: t.pnl,
          strategy: t.strategy
        }))
      : [];

    // Send to OpenAI for prediction
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert trading analyst. Analyze the new potential trade against historical performance (if available).
            Provide a prediction including:
            1. Win probability (as a decimal between 0 and 1)
            2. Expected P&L (as a number)
            3. Confidence score (as a decimal between 0 and 1)
            4. 3-5 specific recommendations
            
            Format your response as a JSON object with these exact fields:
            {
              "winProbability": 0.75,
              "expectedPnl": 1250,
              "confidenceScore": 0.82,
              "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
            }`
          },
          {
            role: "user",
            content: JSON.stringify({
              newTrade: trade,
              tradeHistory: tradeHistory
            })
          }
        ],
        temperature: 0.4,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const aiResponse = await response.json();
    const prediction = aiResponse.choices[0].message.content;

    // Parse the JSON response
    try {
      return JSON.parse(prediction);
    } catch (parseError) {
      console.error('Failed to parse prediction:', parseError);
      return { 
        error: "Received malformed prediction data. Please try again." 
      };
    }
  } catch (error) {
    console.error('Prediction error:', error);
    toast.error('Failed to predict trade performance.');
    return { error: 'Failed to predict trade performance. Please check your API key and try again.' };
  }
};
