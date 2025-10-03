
import { useMemo } from 'react';
import { getEmotionColor, getEmotionEmoji, emotionAnimationVariants } from '@/utils/emotion-constants';

export interface EmotionData {
  name: string;
  value: number;
  pnl?: number;
  avgPnl?: number;
}

export interface ProcessedEmotionData extends EmotionData {
  emoji: string;
  color: string;
}

export const useEmotionUtils = () => {
  // Process emotion data to add emoji and color
  const processEmotionData = useMemo(() => (data: EmotionData[]): ProcessedEmotionData[] => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => ({
      ...item,
      emoji: getEmotionEmoji(item.name.toLowerCase()),
      color: getEmotionColor(item.name.toLowerCase())
    }));
  }, []);

  return {
    processEmotionData,
    animationVariants: emotionAnimationVariants
  };
};

export default useEmotionUtils;
