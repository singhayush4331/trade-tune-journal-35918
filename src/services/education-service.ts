
import { getOpenAIKey } from './ai-analysis-service';
import { getUserTradeData } from './ai-chat-service';
import { toast } from 'sonner';

// OpenAI API constants
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini"; // Using a smaller model to reduce costs

/**
 * Generate personalized learning material based on user's trading history
 */
export async function generateLearningMaterial(topic: string): Promise<{ content: string; success: boolean }> {
  try {
    if (!getOpenAIKey()) {
      toast.error("OpenAI API key is required");
      return { content: "Please add your OpenAI API key in the settings.", success: false };
    }

    // Get user trade data to personalize content
    const { trades, tradeMetrics } = await getUserTradeData({ topTradesCount: 10 });
    
    // Construct system prompt with personalization
    const systemPrompt = `
      You are an expert trading educator for Wiggly, a trading platform for Indian markets.
      Create a structured, concise learning material about "${topic}" that is:
      - Easy to understand for a retail trader
      - Contains practical examples
      - Includes actionable tips
      - Makes references to Indian market conditions when relevant
      - Is formatted with markdown for better readability (##, *, etc.)
      
      ${tradeMetrics ? `
      The user's trading metrics show:
      - Win rate: ${tradeMetrics.winRate}%
      - Most traded symbols: ${JSON.stringify(tradeMetrics.mostTradedSymbols)}
      - Avg profit: ${tradeMetrics.averageWin}
      - Avg loss: ${tradeMetrics.averageLoss}
      ` : 'No trading metrics available, provide general guidance.'}
      
      Structure the content with:
      1. A brief introduction
      2. Key concepts (with examples)
      3. Practical application
      4. Common mistakes to avoid
      5. A short conclusion with action items

      Keep the total content under 1000 words and focus on practical knowledge.
    `;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getOpenAIKey()}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate learning material about "${topic}" that's relevant to my trading history and experience level.` }
        ],
        temperature: 0.5,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return { 
        content: "Failed to generate learning material. Please try again later.", 
        success: false 
      };
    }

    const data = await response.json();
    return { 
      content: data.choices[0]?.message?.content || "No content generated", 
      success: true 
    };
  } catch (error) {
    console.error("Error generating learning material:", error);
    toast.error("Failed to generate learning material");
    return { 
      content: "An error occurred while generating learning material.", 
      success: false 
    };
  }
}

/**
 * Generate a quiz based on a topic and user's trading history
 */
export async function generateQuiz(topic: string): Promise<{ questions: QuizQuestion[]; success: boolean }> {
  try {
    if (!getOpenAIKey()) {
      toast.error("OpenAI API key is required");
      return { questions: [], success: false };
    }

    // Get user trade data to personalize quiz
    const { trades, tradeMetrics } = await getUserTradeData({ topTradesCount: 10 });
    
    // Construct system prompt with personalization
    const systemPrompt = `
      You are an expert trading educator. Create a quiz of 5 multiple-choice questions about "${topic}".
      Each question should:
      - Be relevant to retail traders in the Indian market
      - Have 4 possible answers with only one correct answer
      - Include a brief explanation for the correct answer
      
      ${trades && trades.length > 0 ? `
      The user trades primarily: ${trades.map(t => t.symbol).slice(0, 5).join(', ')}
      ` : 'No trading history available, provide general questions.'}
      
      Respond with a JSON array of objects with this exact structure:
      [
        {
          "question": "Question text goes here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Explanation of why Option A is correct"
        }
      ]
      
      The correctAnswer should be the index (0-3) of the correct option.
      Make sure the questions test practical knowledge that would help improve trading skills.
    `;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getOpenAIKey()}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate a quiz about "${topic}" that's relevant to my trading history.` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return { questions: [], success: false };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    // Parse the JSON response
    try {
      // Extract JSON array from the response (in case there's additional text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return { questions, success: true };
      } else {
        console.error("Failed to extract JSON from OpenAI response");
        return { questions: [], success: false };
      }
    } catch (e) {
      console.error("Error parsing quiz JSON:", e, "Content:", content);
      return { questions: [], success: false };
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    toast.error("Failed to generate quiz");
    return { questions: [], success: false };
  }
}

/**
 * Generate improvement suggestions based on user's trading history
 */
export async function generateImprovementSuggestions(): Promise<{ suggestions: string[]; success: boolean }> {
  try {
    if (!getOpenAIKey()) {
      toast.error("OpenAI API key is required");
      return { suggestions: ["Please add your OpenAI API key in the settings."], success: false };
    }

    // Get comprehensive trade data for analysis
    const { trades, tradeMetrics, totalCount } = await getUserTradeData({ 
      topTradesCount: 20,
      selectTopTrades: false // Get a mix of trades for better analysis
    });
    
    if (!trades || trades.length === 0) {
      return { 
        suggestions: ["Add some trades to get personalized improvement suggestions."], 
        success: false 
      };
    }

    // Construct system prompt with all available metrics
    const systemPrompt = `
      You are an expert trading coach and mentor. Analyze the user's trading data and provide 5 specific, 
      actionable improvement suggestions. Focus on patterns in their trading behavior, risk management, 
      and potential areas for improvement.
      
      Trading metrics:
      ${JSON.stringify(tradeMetrics, null, 2)}
      
      Provide suggestions that are:
      1. Specific and actionable (not generic advice)
      2. Based on the actual trading data provided
      3. Prioritized by potential impact
      4. Concise and clear
      5. Focused on improving profitability and risk management
      
      Return exactly 5 suggestions as a JSON array of strings, with each suggestion being 1-2 sentences.
      Don't include numbers or bullet points in the suggestions themselves.
    `;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getOpenAIKey()}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Analyze my trading history and provide 5 specific improvement suggestions." }
        ],
        temperature: 0.4, // Lower temperature for more focused suggestions
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return { suggestions: [], success: false };
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    // Parse the JSON response
    try {
      // Extract JSON array from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const suggestions = JSON.parse(jsonMatch[0]);
        return { suggestions, success: true };
      } else {
        // Fallback to text parsing if JSON extraction fails
        const textSuggestions = content
          .split(/\d+\.|\n-|\n\*/)
          .map(s => s.trim())
          .filter(s => s.length > 10)
          .slice(0, 5);
          
        return { suggestions: textSuggestions, success: true };
      }
    } catch (e) {
      console.error("Error parsing suggestions:", e);
      // Fallback to returning raw text
      return { 
        suggestions: [content || "Failed to generate suggestions"], 
        success: false 
      };
    }
  } catch (error) {
    console.error("Error generating improvement suggestions:", error);
    toast.error("Failed to generate improvement suggestions");
    return { suggestions: [], success: false };
  }
}

/**
 * Generate an explanation for a complex market concept
 */
export async function explainMarketConcept(concept: string): Promise<{ explanation: string; success: boolean }> {
  try {
    if (!getOpenAIKey()) {
      toast.error("OpenAI API key is required");
      return { explanation: "Please add your OpenAI API key in the settings.", success: false };
    }
    
    // Construct system prompt for explanation
    const systemPrompt = `
      You are an expert trading educator specializing in explaining complex financial concepts in simple terms.
      Explain "${concept}" in a way that is:
      - Easy to understand for a retail trader in the Indian market
      - Uses simple analogies where appropriate
      - Includes practical examples relevant to Indian markets
      - Avoids unnecessary jargon
      - Contains a brief explanation of when and how to apply this concept
      
      Use markdown formatting (##, *, etc.) for better readability.
      Keep the explanation under 500 words and focus on practical understanding.
    `;

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getOpenAIKey()}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please explain "${concept}" in simple terms.` }
        ],
        temperature: 0.5,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenAI API error:", error);
      return { 
        explanation: "Failed to generate explanation. Please try again later.", 
        success: false 
      };
    }

    const data = await response.json();
    return { 
      explanation: data.choices[0]?.message?.content || "No explanation generated", 
      success: true 
    };
  } catch (error) {
    console.error("Error explaining market concept:", error);
    toast.error("Failed to explain market concept");
    return { 
      explanation: "An error occurred while explaining the concept.", 
      success: false 
    };
  }
}

// Types for education module
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
}

export interface LearningSectionProps {
  onBack?: () => void;
}

