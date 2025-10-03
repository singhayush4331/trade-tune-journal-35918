
import React from 'react';
import { motion } from 'framer-motion';
import { formatIndianCurrency } from '@/lib/utils';
import { MOOD_EMOJIS, MOOD_COLORS } from '@/utils/emotion-constants';

interface EmotionData {
  name: string;
  value: number;
  pnl: number;
  avgPnl: number;
}

interface EmotionImpactCardProps {
  emotion: EmotionData;
  index: number;
}

const EmotionImpactCard = React.memo(({ emotion, index }: EmotionImpactCardProps) => {
  const getEmoji = (name: string): string => {
    const lowerName = name.toLowerCase();
    return MOOD_EMOJIS[lowerName] || '😐';
  };

  return (
    <motion.div 
      key={emotion.name}
      className="flex flex-col space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.1 + index * 0.05,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.span 
            className="text-xl"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2 + index * 0.05,
              duration: 0.4,
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            {getEmoji(emotion.name)}
          </motion.span>
          <span className="text-sm font-medium">{emotion.name}</span>
        </div>
        <span className={`text-sm ${emotion.avgPnl >= 0 ? 'text-success' : 'text-destructive'}`}>
          {formatIndianCurrency(emotion.avgPnl)} avg
        </span>
      </div>
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
        <motion.div 
          className={`h-full transition-all ${emotion.avgPnl >= 0 ? 'bg-success' : 'bg-destructive'}`}
          style={{ 
            opacity: 0.6 + (0.4 * (1 - index / Math.max(1, emotion.value)))
          }}
          initial={{ width: 0 }}
          animate={{ 
            width: `${Math.min(100, Math.max(5, (Math.abs(emotion.avgPnl) / 1000) * 100))}%` 
          }}
          transition={{ 
            duration: 0.7, 
            delay: 0.3 + index * 0.05,
            ease: [0.34, 0.82, 0.6, 1]
          }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        {emotion.value} trades, {formatIndianCurrency(emotion.pnl)} total
      </div>
    </motion.div>
  );
});

export default EmotionImpactCard;
