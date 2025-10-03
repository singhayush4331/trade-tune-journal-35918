
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="relative flex items-center justify-between">
        {/* Progress line background */}
        <div className="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-muted/50"></div>
        
        {/* Animated progress line */}
        <motion.div 
          className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-primary via-blue-500 to-primary/70"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {/* Step indicators */}
        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center">
            <motion.div 
              className={`relative w-10 h-10 rounded-full flex items-center justify-center
                ${index < currentStep 
                  ? 'bg-primary text-white' 
                  : index === currentStep 
                    ? 'bg-primary/90 text-white border-4 border-primary/20' 
                    : 'bg-muted text-muted-foreground'
                }`}
              initial={false}
              animate={{ 
                scale: index === currentStep ? [1, 1.1, 1] : 1,
                transition: { 
                  duration: 0.5, 
                  repeat: index === currentStep ? Infinity : 0, 
                  repeatDelay: 3
                } 
              }}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
              
              {/* Subtle pulse animation only for current step */}
              {index === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
            </motion.div>
            
            <motion.span 
              className={`mt-2 text-xs font-medium ${
                index === currentStep 
                  ? 'text-primary' 
                  : 'text-muted-foreground'
              }`}
              initial={false}
              animate={{ 
                opacity: index === currentStep ? 1 : 0.7
              }}
            >
              {step}
            </motion.span>
          </div>
        ))}
      </div>
    </div>
  );
};
