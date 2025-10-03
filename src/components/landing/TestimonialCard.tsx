
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';
import { useParallax } from '@/hooks/use-parallax';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

interface TestimonialCardProps {
  quote: string;
  author: string;
  title: string;
  delay?: number;
}

const TestimonialCard = ({
  quote,
  author,
  title,
  delay = 0
}: TestimonialCardProps) => {
  const { ref, y } = useParallax({ direction: 'up', speed: 30 });
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay 
      } 
    }
  };
  
  const quoteIconVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: delay + 0.3
      } 
    }
  };
  
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: delay + 0.4
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
        scale: 1.03,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
    >
      <Card 
        className={`group relative ${isMobile ? 'p-4' : 'p-6'} h-full border-primary/10 bg-card/60 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:border-primary/20`}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
        
        {/* Quote icon with animation */}
        <motion.div
          variants={quoteIconVariants}
          className="relative z-10"
        >
          <motion.div
            whileHover={{ 
              rotate: [-5, 5, 0],
              scale: 1.1,
              transition: { duration: 0.5 }
            }}
            className="w-fit"
          >
            <Quote className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-primary/40 mb-3 sm:mb-4 transition-colors duration-500 group-hover:text-primary`} />
          </motion.div>
        </motion.div>
        
        {/* Quote text with animation */}
        <motion.p 
          variants={textVariants}
          className={`${isXSmall ? 'text-sm' : 'text-base'} mb-4 sm:mb-6 italic text-muted-foreground relative z-10 group-hover:text-foreground/90 transition-colors duration-500`}
        >
          {quote}
        </motion.p>
        
        {/* Author info with animation */}
        <motion.div 
          className="flex items-center relative z-10"
          variants={textVariants}
          whileHover={{ x: 5, transition: { duration: 0.2 } }}
        >
          <motion.div 
            className={`${isXSmall ? 'h-8 w-8' : 'h-10 w-10'} rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center text-white font-semibold overflow-hidden`}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.2 }
            }}
          >
            <motion.span
              animate={{ 
                y: [0, -2, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              {author.charAt(0)}
            </motion.span>
          </motion.div>
          
          <div className="ml-3">
            <motion.p 
              className={`${isXSmall ? 'text-sm' : 'text-base'} font-semibold group-hover:text-primary transition-colors duration-500`}
            >
              {author}
            </motion.p>
            <motion.p 
              className={`${isXSmall ? 'text-xs' : 'text-sm'} text-muted-foreground`}
            >
              {title}
            </motion.p>
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default TestimonialCard;
