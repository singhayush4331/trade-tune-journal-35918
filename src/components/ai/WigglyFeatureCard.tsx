
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
  onClick?: () => void;
}

const WigglyFeatureCard: React.FC<FeatureCardProps> = ({ 
  icon, 
  title, 
  description, 
  comingSoon = false, 
  onClick 
}) => {
  return (
    <motion.div
      whileHover={!comingSoon ? { 
        scale: 1.02,
        y: -5,
      } : {}}
      whileTap={!comingSoon ? { scale: 0.98 } : {}}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card 
        className={`h-full transition-all duration-300 border-2 relative overflow-hidden backdrop-blur-sm
          ${!comingSoon 
            ? 'border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer' 
            : 'opacity-75 border-muted'}`
        }
        onClick={!comingSoon ? onClick : undefined}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-60 z-0"></div>
        
        {/* Inner glow effect on hover */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/5 opacity-0 z-0"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center gap-4 mb-3">
            <motion.div 
              className={`h-12 w-12 rounded-xl ${!comingSoon ? 'bg-gradient-to-br from-primary/80 to-purple-500/80' : 'bg-muted'} flex items-center justify-center shadow-md ring-1 ring-white/10`}
              whileHover={!comingSoon ? { scale: 1.05, rotate: 5 } : {}}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {icon}
            </motion.div>
            <CardTitle className="text-xl flex items-center gap-2">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {title}
              </span>
              {comingSoon && (
                <span className="ml-2 text-xs bg-muted text-muted-foreground py-1 px-2 rounded-full">
                  Coming Soon
                </span>
              )}
            </CardTitle>
          </div>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
      </Card>
    </motion.div>
  );
};

export default WigglyFeatureCard;
