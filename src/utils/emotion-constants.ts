
// Constants for emotion data visualization

// Define emotion type for better type safety
export type EmotionType = 
  | "calm" 
  | "confident" 
  | "excited" 
  | "focused" 
  | "nervous" 
  | "stressed" 
  | "anxious" 
  | "tired" 
  | "happy" 
  | "sad" 
  | "angry" 
  | "frustrated" 
  | "disappointed" 
  | "relaxed" 
  | "fearful";

// Emoji lookup for different emotional states - strictly typed
export const MOOD_EMOJIS: Record<EmotionType, string> = {
  "calm": "😌",
  "confident": "🏆",
  "excited": "🤩",
  "focused": "🧐",
  "nervous": "😰",
  "stressed": "😫",
  "anxious": "😟",
  "tired": "😪",
  "happy": "😊",
  "sad": "😔",
  "angry": "😠",
  "frustrated": "🤬",
  "disappointed": "😞",
  "relaxed": "🌴",
  "fearful": "😨"
};

// Color scheme for emotional states - strictly typed
export const MOOD_COLORS: Record<EmotionType, string> = {
  "calm": "#4ade80",
  "confident": "#2563eb",
  "excited": "#f59e0b",
  "focused": "#6366f1",
  "nervous": "#f43f5e",
  "stressed": "#ef4444",
  "anxious": "#f97316",
  "tired": "#9ca3af",
  "happy": "#3b82f6",
  "sad": "#64748b",
  "angry": "#dc2626",
  "frustrated": "#ea580c",
  "disappointed": "#94a3b8",
  "relaxed": "#10b981",
  "fearful": "#ec4899"
};

// Animation variants for emotion-related components
export const emotionAnimationVariants = {
  // For chart elements
  chartElement: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  },
  
  // For tooltip animations
  tooltip: {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.2 }
    }
  },
  
  // For legend items
  legendItem: {
    hidden: { opacity: 0, y: 5 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.3, 
        delay: 0.6 + (i * 0.05), 
        ease: "easeOut" 
      } 
    }),
    hover: { scale: 1.05 }
  },
  
  // For gradient animations
  gradient: {
    initial: { stopOpacity: 0 },
    animate: (i: number) => ({ 
      stopOpacity: i === 0 ? 0.8 : 0.5, 
      transition: { 
        duration: 0.8, 
        delay: 0.2 + (i * 0.05) 
      } 
    })
  },
  
  // For container animations
  container: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  },
  
  // For item animations
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }
};

// Utility function to get emotion color with fallback
export const getEmotionColor = (emotion: string): string => {
  const lowerEmotion = emotion.toLowerCase() as EmotionType;
  return MOOD_COLORS[lowerEmotion] || 
    // Fallback to a predictable color based on the emotion string
    `hsl(${(emotion.charCodeAt(0) + emotion.length * 5) % 360}, 70%, 50%)`;
};

// Utility function to get emotion emoji with fallback
export const getEmotionEmoji = (emotion: string): string => {
  const lowerEmotion = emotion.toLowerCase() as EmotionType;
  return MOOD_EMOJIS[lowerEmotion] || '😐';
};
