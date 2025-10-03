
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onChange?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep,
  onChange 
}) => {
  return (
    <div className="w-full">
      {/* Mobile view */}
      <div className="flex md:hidden justify-center mb-8 overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-3 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isClickable = currentStep >= step.id;
            
            return (
              <button
                key={step.id}
                className={cn(
                  "flex flex-col items-center relative px-2",
                  isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
                onClick={() => isClickable && onChange?.(step.id)}
                disabled={!isClickable}
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    isActive 
                      ? "bg-gradient-to-br from-primary to-purple-500 text-primary-foreground shadow-lg shadow-primary/20" 
                      : isCompleted 
                      ? "bg-primary/20 text-primary border border-primary/30" 
                      : "bg-muted/60 text-muted-foreground border border-muted"
                  )}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isActive ? [1, 1.05, 1] : 1,
                    transition: { duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className={cn("h-5 w-5", isActive && "animate-pulse")} />
                  )}
                </motion.div>
                
                <motion.div 
                  className="mt-2 text-xs font-medium whitespace-nowrap"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: isActive ? 1 : 0.6 }}
                >
                  {step.title}
                </motion.div>
                
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(100%_-_8px)] w-[calc(100%_-_16px)] h-[2px]">
                    <div className="w-full h-full bg-muted/40"></div>
                    <motion.div 
                      className="absolute top-0 left-0 h-full bg-primary/60"
                      initial={{ width: "0%" }}
                      animate={{ width: isCompleted ? "100%" : "0%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Desktop view - horizontal steps at the top */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Steps with icons and connecting lines */}
          <div className="flex justify-between items-center relative mb-8">
            {/* Connecting line */}
            <div className="absolute top-6 left-0 w-full h-[3px] bg-muted/30 rounded-full"></div>
            
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              const isClickable = currentStep >= step.id;
              
              return (
                <div key={step.id} className="z-10">
                  <button
                    onClick={() => isClickable && onChange?.(step.id)}
                    disabled={!isClickable}
                    className={cn(
                      "group relative flex flex-col items-center focus-visible:outline-none",
                      isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-70"
                    )}
                  >
                    {/* Step icon with animated container */}
                    <motion.div
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center",
                        "transition-all duration-300 shadow-md",
                        isActive 
                          ? "bg-gradient-to-br from-primary via-primary to-purple-500 text-primary-foreground shadow-lg shadow-primary/20 ring-4 ring-primary/20" 
                          : isCompleted 
                          ? "bg-primary/10 text-primary border border-primary/30 group-hover:shadow-primary/10 group-hover:ring-2 group-hover:ring-primary/10" 
                          : "bg-muted/60 text-muted-foreground border border-muted"
                      )}
                      initial={{ y: 0 }}
                      animate={{ 
                        y: isActive ? [0, -3, 0] : 0,
                        scale: isActive ? [1, 1.05, 1] : 1
                      }}
                      transition={{ 
                        y: { duration: 1.5, repeat: isActive ? Infinity : 0, repeatType: "loop", repeatDelay: 0.5 },
                        scale: { duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1.5 }
                      }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Icon className={cn(
                          "h-6 w-6",
                          isActive && "animate-pulse"
                        )} />
                      )}
                      
                      {/* Pulse animation for active step */}
                      {isActive && (
                        <motion.div
                          className="absolute w-full h-full rounded-full bg-primary"
                          initial={{ opacity: 0.3, scale: 1 }}
                          animate={{ opacity: 0, scale: 1.6 }}
                          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
                        />
                      )}
                    </motion.div>
                    
                    {/* Step title and description */}
                    <div className="mt-3 space-y-1 text-center">
                      <motion.div 
                        className={cn(
                          "text-sm font-semibold transition-colors",
                          isActive ? "text-primary" : "text-foreground/80"
                        )}
                        animate={{ 
                          scale: isActive ? [1, 1.03, 1] : 1,
                          opacity: isActive ? 1 : 0.8
                        }}
                        transition={{ 
                          scale: { duration: 1, repeat: isActive ? Infinity : 0, repeatDelay: 1.5 }
                        }}
                      >
                        {step.title}
                      </motion.div>
                      <p className={cn(
                        "text-xs max-w-28 transition-colors",
                        isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                      )}>
                        {step.description}
                      </p>
                    </div>
                    
                    {/* Show arrow for in-between steps */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-full top-6 transform -translate-x-1/2 -translate-y-[2px]">
                        <ArrowRight className={cn(
                          "h-5 w-5 text-muted-foreground/40",
                          isCompleted && "text-primary/60"
                        )} />
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
            
            {/* Animated progress line */}
            <motion.div 
              className="absolute top-6 left-0 h-[3px] bg-gradient-to-r from-primary via-primary/80 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            
            {/* Animated dot that moves along the line */}
            {currentStep < steps.length && (
              <motion.div
                className="absolute top-6 h-3 w-3 rounded-full bg-primary shadow-lg shadow-primary/30"
                style={{
                  translateY: "-50%",
                }}
                animate={{ 
                  left: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            )}
          </div>
          
          {/* Bottom section with additional step visualization */}
          <div className="grid grid-cols-4 gap-1 px-1">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <motion.div
                  key={step.id}
                  className={cn(
                    "h-1.5 rounded-full",
                    isActive
                      ? "bg-primary" 
                      : isCompleted 
                      ? "bg-primary/60" 
                      : "bg-muted/30"
                  )}
                  animate={isActive ? {
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{ duration: 1, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
