import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PreloaderService, PreloadProgress } from '@/services/preloader-service';

const TRADING_TIPS = [
  "Risk management is the key to long-term success. Never risk more than 2-3% per trade.",
  "Keep a trading journal to track your emotions and decision-making patterns.",
  "The market rewards patience and discipline, not frequent trading.",
  "Your biggest enemy in trading is often your own emotions.",
  "Plan your trades and trade your plan. Never deviate from your strategy.",
  "Successful traders focus on process, not just profits.",
  "Use stop losses to protect your capital from major losses.",
  "The trend is your friend - trade with the market, not against it.",
  "Master your psychology before you master the markets.",
  "Paper trading is a great way to test strategies without risking real money."
];

export const useUniversalPreloader = () => {
  const [progress, setProgress] = useState<PreloadProgress>({
    progress: 0,
    currentStage: 'Initializing...',
    estimatedTime: 30
  });
  const [isPreloading, setIsPreloading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const startPreload = useCallback(async () => {
    if (isPreloading || isComplete) return;

    // Check if preload was recently completed
    if (PreloaderService.isPreloadComplete()) {
      console.log('Preload recently completed, skipping...');
      setIsComplete(true);
      return;
    }

    setIsPreloading(true);
    setError(null);
    
    const preloader = new PreloaderService(queryClient);
    
    try {
      await preloader.preloadEverything((progressUpdate) => {
        setProgress(progressUpdate);
      });
      
      setIsComplete(true);
    } catch (err) {
      console.error('Preload failed:', err);
      setError(err instanceof Error ? err.message : 'Preload failed');
      
      // For rapid authentication or timeouts, fail fast
      const errorMessage = err instanceof Error ? err.message : 'Preload failed';
      const isTimeout = errorMessage.includes('timeout');
      const fastFailTimeout = isTimeout ? 500 : 2000;
      
      setTimeout(() => {
        setIsComplete(true);
      }, fastFailTimeout);
    } finally {
      setIsPreloading(false);
    }
  }, [queryClient, isPreloading, isComplete]);

  const resetPreload = useCallback(() => {
    PreloaderService.markPreloadExpired();
    setIsComplete(false);
    setIsPreloading(false);
    setError(null);
    setProgress({
      progress: 0,
      currentStage: 'Initializing...',
      estimatedTime: 30
    });
  }, []);

  // Auto-start preload if needed
  useEffect(() => {
    const shouldPreload = !PreloaderService.isPreloadComplete() && !isComplete && !isPreloading;
    
    if (shouldPreload) {
      // Small delay to allow React to render the preloader component
      const timer = setTimeout(startPreload, 100);
      return () => clearTimeout(timer);
    }
  }, [startPreload, isComplete, isPreloading]);

  return {
    progress: progress.progress,
    currentStage: progress.currentStage,
    estimatedTime: progress.estimatedTime,
    tips: TRADING_TIPS,
    isPreloading,
    isComplete,
    error,
    startPreload,
    resetPreload
  };
};