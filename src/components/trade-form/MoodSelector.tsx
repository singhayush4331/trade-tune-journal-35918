
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

interface MoodOption {
  value: string;
  label: string;
  emoji: string;
  color: string;
}

// Define mood options with emojis and colors that match the EmotionalAnalysisChart
const moodOptions: MoodOption[] = [
  { value: 'calm', label: 'Calm', emoji: '😌', color: 'bg-blue-500/10 border-blue-500/30 text-blue-500' },
  { value: 'focused', label: 'Focused', emoji: '🧠', color: 'bg-purple-500/10 border-purple-500/30 text-purple-500' },
  { value: 'excited', label: 'Excited', emoji: '🤩', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' },
  { value: 'confident', label: 'Confident', emoji: '😎', color: 'bg-green-500/10 border-green-500/30 text-green-500' },
  { value: 'anxious', label: 'Anxious', emoji: '😰', color: 'bg-orange-500/10 border-orange-500/30 text-orange-500' },
  { value: 'frustrated', label: 'Frustrated', emoji: '😤', color: 'bg-red-500/10 border-red-500/30 text-red-500' },
];

interface MoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({ value, onChange }) => {
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  // Adjust grid columns based on screen size
  const gridCols = isXSmall ? 'grid-cols-2' : isMobile ? 'grid-cols-3' : 'grid-cols-3';
  
  return (
    <div className={`grid ${gridCols} gap-2`}>
      {moodOptions.map((mood) => (
        <Button
          key={mood.value}
          type="button"
          variant="outline"
          className={cn(
            "flex flex-col items-center gap-1",
            isXSmall ? "h-auto py-2 px-2" : "h-auto py-3", 
            "border",
            value === mood.value
              ? `${mood.color} border-2`
              : "hover:bg-muted/60"
          )}
          onClick={() => onChange(mood.value)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ 
              scale: value === mood.value ? [1, 1.2, 1] : 1,
              rotate: value === mood.value ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.5 }}
            className={isXSmall ? "text-xl" : "text-2xl"}
            role="img"
            aria-label={mood.label}
          >
            {mood.emoji}
          </motion.div>
          <span className={`${isXSmall ? 'text-xs' : 'text-xs'} font-medium`}>{mood.label}</span>
        </Button>
      ))}
    </div>
  );
};
