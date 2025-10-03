
import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useParallax } from '@/hooks/use-parallax';

interface AnimatedStatsCardProps {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}

const AnimatedStatsCard = ({ value, label, suffix = '', delay = 0 }: AnimatedStatsCardProps) => {
  const [count, setCount] = useState(0);
  const { ref, y } = useParallax({ direction: 'up', speed: 40 });
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Animate the number counting up when card is in view
  React.useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const increment = value / 30;
    const duration = 1500;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const nextValue = Math.min(Math.floor(easedProgress * value), value);
      
      setCount(nextValue);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
    
    return () => {
      startTime = null;
    };
  }, [isInView, value]);
  
  // Easing function for smoother animation
  const easeOutQuart = (x: number): number => {
    return 1 - Math.pow(1 - x, 4);
  };

  const formatValue = (val: number) => {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    } else if (val >= 1000) {
      return (val / 1000).toFixed(0) + 'k';
    }
    return Math.floor(val).toString();
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay
      }
    }
  };
  
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delay: delay + 0.3,
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <Card className="group relative p-6 text-center h-full bg-card/60 backdrop-blur-sm border border-primary/10 hover:shadow-xl transition-all duration-500 overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 overflow-hidden">
          <motion.div
            className="absolute -inset-[100%] h-[250%] w-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
            animate={{
              x: ['0%', '300%'],
            }}
            transition={{
              delay: 0.2,
              duration: 1.5,
              repeat: 0,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <motion.div
          variants={contentVariants}
          className="relative z-10"
        >
          <motion.span 
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-purple to-primary/80 bg-clip-text text-transparent relative z-10 inline-block"
            animate={isInView ? {
              scale: [1, 1.2, 1],
              transition: {
                duration: 0.6,
                delay: delay + 0.5,
                ease: "easeOut"
              }
            } : {}}
          >
            {formatValue(count)}{suffix}
          </motion.span>
          
          <motion.p 
            className="text-muted-foreground mt-2 relative z-10 group-hover:text-foreground/80 transition-colors duration-500"
          >
            {label}
          </motion.p>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default AnimatedStatsCard;
