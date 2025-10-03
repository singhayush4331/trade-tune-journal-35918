
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Sparkles, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';
import EmotionImpactCard from './EmotionImpactCard';
import EmotionDistributionPie from './EmotionDistributionPie';
import { useIsMobile } from '@/hooks/use-mobile';

interface EmotionData {
  name: string;
  value: number;
  pnl: number;
  avgPnl: number;
}

interface EmotionalAnalysisChartProps {
  emotions: EmotionData[];
}

// Main optimized component
const EmotionalAnalysisChart: React.FC<EmotionalAnalysisChartProps> = ({ emotions }) => {
  // Performance monitoring
  const perfMonitor = usePerformanceMonitor('EmotionalAnalysisChart');
  const isMobile = useIsMobile();
  
  // Mark important rendering events
  useEffect(() => {
    perfMonitor.markEvent('mounted');
    return () => {
      perfMonitor.markEvent('unmounted');
    };
  }, []);

  // Measure component render performance when emotions data changes
  useEffect(() => {
    if (emotions?.length) {
      perfMonitor.markEvent('data_received');
    }
  }, [emotions]);

  if (!emotions?.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-1 border-primary/20 bg-card/90 shadow-sm backdrop-blur-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <span className="bg-primary/10 p-1.5 rounded-md inline-flex">
                <Brain className="h-4 w-4 text-primary" />
              </span>
              <span>Emotional Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <p>No emotional data recorded</p>
              <p className="text-xs mt-1">Log your mood when adding trades</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 border-primary/20 bg-card/90 shadow-sm h-full backdrop-blur-sm">
          <CardHeader className="pb-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <span className="bg-primary/10 p-1.5 rounded-md inline-flex">
                <Lightbulb className="h-4 w-4 text-primary" />
              </span>
              <span>Emotion Impact on Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
              Start logging your emotional state during trades
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onAnimationComplete={() => perfMonitor.markEvent('animation_complete')}
    >
      <Card className="md:col-span-1 border border-primary/20 bg-card/90 shadow-lg overflow-hidden backdrop-blur-sm">
        <CardHeader className={`pb-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent ${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <span className="bg-primary/10 p-1.5 rounded-md inline-flex">
              <Brain className="h-4 w-4 text-primary" />
            </span>
            <span>Emotional Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-2' : 'pt-0 p-6'}`}>
          <div className={`${isMobile ? 'py-2' : ''} h-full`}>
            <EmotionDistributionPie emotions={emotions} />
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 border border-primary/20 bg-card/90 shadow-lg overflow-hidden backdrop-blur-sm h-full">
        <CardHeader className={`pb-2 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent ${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <span className="bg-primary/10 p-1.5 rounded-md inline-flex">
              <Lightbulb className="h-4 w-4 text-primary" />
            </span>
            <span>Emotion Impact on Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4' : 'pt-4 p-6'}`}>
          <AnimatePresence>
            <div className="space-y-4">
              {emotions.slice(0, 6).map((emotion, index) => (
                <EmotionImpactCard key={emotion.name} emotion={emotion} index={index} />
              ))}
              
              {emotions.length > 6 && (
                <motion.div 
                  className="text-xs text-muted-foreground text-center mt-2 pt-2 border-t border-border"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  + {emotions.length - 6} more emotions tracked
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default React.memo(EmotionalAnalysisChart);
