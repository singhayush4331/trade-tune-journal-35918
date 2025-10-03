
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useParallax } from '@/hooks/use-parallax';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  color?: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
  color = "from-primary to-primary/60"
}: FeatureCardProps) => {
  const { ref, y } = useParallax({ direction: 'up', speed: 20 });
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay 
      }
    }
  };

  const iconContainerVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: delay + 0.2
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, delay: delay + 0.3 }
    }
  };
  
  const descriptionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, delay: delay + 0.4 }
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
        y: -5,
        transition: { 
          type: "spring",
          stiffness: 400,
          damping: 10
        }
      }}
    >
      <Card className="group overflow-hidden relative border-primary/10 p-6 h-full bg-card/60 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-primary/3 to-transparent opacity-0"
          animate={{ 
            opacity: [0, 0.05, 0],
            transition: { 
              duration: 3, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }
          }}
        />
        
        {/* Icon with animation */}
        <motion.div
          variants={iconContainerVariants}
          className={cn(
            "w-12 h-12 mb-4 rounded-lg flex items-center justify-center relative",
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br",
            "before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500",
            color
          )}
        >
          <motion.div
            whileHover={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
              transition: { duration: 0.6 }
            }}
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <Icon className="h-6 w-6 text-primary relative z-10 group-hover:text-white transition-colors duration-500" />
          </motion.div>
        </motion.div>
        
        {/* Title with animation */}
        <motion.h3 
          variants={titleVariants}
          className="text-xl font-semibold mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
        >
          {title}
        </motion.h3>
        
        {/* Description with animation */}
        <motion.p 
          variants={descriptionVariants}
          className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-500"
        >
          {description}
        </motion.p>
        
        {/* Animated glow effect on hover */}
        <div className="absolute -inset-px rounded-lg opacity-0 group-hover:opacity-30 bg-primary/20 blur-lg transition-opacity duration-500 -z-10" />
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
