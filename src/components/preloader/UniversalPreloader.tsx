import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PreloaderProps {
  progress: number;
  currentStage: string;
  estimatedTime: number;
  tips: string[];
  onComplete: () => void;
}

export const UniversalPreloader: React.FC<PreloaderProps> = ({
  progress,
  currentStage,
  estimatedTime,
  tips,
  onComplete
}) => {
  const [currentTip, setCurrentTip] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const isMobile = useIsMobile();

  // Cycle through tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [tips.length]);

  // Generate floating particles
  useEffect(() => {
    const newParticles = Array.from({ length: isMobile ? 15 : 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, [isMobile]);

  // Auto-complete when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm"
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-wiggly-500/10 rounded-full blur-xl"
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        {/* Logo/Brand Area */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-primary to-wiggly-500 rounded-2xl flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <span className="text-2xl font-bold text-white">W</span>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary to-wiggly-500 rounded-2xl blur-md opacity-50"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-wiggly-500 bg-clip-text text-transparent"
        >
          Loading Your Trading Platform
        </motion.h1>

        {/* Progress Section */}
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Progress Bar */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <div className="relative">
              <Progress value={progress} className="h-3 bg-muted/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-wiggly-500 to-primary rounded-full"
                  style={{ width: `${progress}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </Progress>
              <motion.div
                className="absolute -top-1 bg-primary/80 w-2 h-5 rounded-full blur-sm"
                style={{ left: `${progress}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <motion.span
                key={progress}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="font-semibold text-primary"
              >
                {Math.round(progress)}%
              </motion.span>
              {estimatedTime > 0 && (
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-muted-foreground"
                >
                  ~{formatTime(estimatedTime)} remaining
                </motion.span>
              )}
            </div>
          </motion.div>

          {/* Current Stage */}
          <motion.div
            key={currentStage}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center"
          >
            <p className="text-foreground font-medium">{currentStage}</p>
            <motion.div
              className="flex justify-center mt-2 space-x-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary/60 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Gaming Tips */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card/40 border border-primary/20 rounded-lg p-4 backdrop-blur-sm"
            >
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                💡 <span className="font-medium">Tip:</span> {tips[currentTip]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Gaming-style bottom indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <motion.div
              className="w-2 h-2 bg-primary rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span>Optimizing your experience...</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};