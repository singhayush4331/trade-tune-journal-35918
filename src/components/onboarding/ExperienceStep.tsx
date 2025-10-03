
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Award, Star, Zap, Trophy } from 'lucide-react';
import { OnboardingData } from '@/pages/OnboardingPage';
import { Card, CardContent } from '@/components/ui/card';

interface ExperienceStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const experienceOptions = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'New to trading or have been trading for less than a year',
      icon: <Star className="h-6 w-6" />,
      color: 'bg-green-500/80',
      gradient: 'from-green-500/10 to-green-400/5',
      glow: 'shadow-green-500/20'
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Have been trading for 1-3 years with some successful strategies',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-blue-500/80',
      gradient: 'from-blue-500/10 to-blue-400/5',
      glow: 'shadow-blue-500/20'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      description: 'Experienced trader with 3+ years and consistent performance',
      icon: <Trophy className="h-6 w-6" />,
      color: 'bg-purple-500/80',
      gradient: 'from-purple-500/10 to-purple-400/5',
      glow: 'shadow-purple-500/20'
    },
    {
      id: 'professional',
      title: 'Professional',
      description: 'Full-time trader with extensive market knowledge',
      icon: <Award className="h-6 w-6" />,
      color: 'bg-primary/80',
      gradient: 'from-primary/10 to-blue-500/5',
      glow: 'shadow-primary/20'
    }
  ];

  const handleSelectExperience = (experience: string) => {
    updateData({ experience });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="flex-grow flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 bg-gradient-to-br from-primary/30 via-purple-500/20 to-blue-500/30 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg"
      >
        <div className="w-14 h-14 backdrop-blur-sm bg-background/50 rounded-xl flex items-center justify-center">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-center mb-8 max-w-lg mx-auto"
      >
        Select your trading experience level to help us customize your dashboard and features.
      </motion.p>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
      >
        {experienceOptions.map((option) => (
          <motion.div 
            key={option.id}
            variants={itemVariants}
            onClick={() => handleSelectExperience(option.id)}
            className="cursor-pointer"
          >
            <Card 
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                data.experience === option.id 
                  ? `ring-2 ring-primary border-primary/30 shadow-lg ${option.glow}` 
                  : 'hover:border-primary/30 border-border/40'
              }`}
            >
              {data.experience === option.id && (
                <motion.div 
                  className="absolute top-0 right-0 w-10 h-10 bg-primary rounded-bl-lg flex items-center justify-center"
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
              
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} ${data.experience === option.id ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></div>
              
              <CardContent className="p-6 flex items-start gap-4 z-10 relative">
                <div className={`p-3 rounded-full ${option.color} text-white shadow-lg flex-shrink-0 transition-transform duration-300 ${data.experience === option.id ? 'scale-110' : ''}`}>
                  {option.icon}
                </div>
                
                <div>
                  <h3 className={`text-lg font-semibold mb-1 transition-colors duration-300 ${data.experience === option.id ? 'text-primary' : ''}`}>{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                
                {data.experience === option.id && (
                  <motion.div 
                    className="absolute inset-0 border-2 border-primary/20 rounded-lg pointer-events-none"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      <motion.div 
        className="flex justify-between mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Button 
          variant="outline" 
          onClick={onBack}
          className="group relative overflow-hidden border-primary/20 hover:border-primary/40"
        >
          <span className="relative z-10 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </span>
          <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </Button>
        
        <Button 
          onClick={onNext} 
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-blue-500 hover:shadow-lg hover:shadow-primary/20"
        >
          <span className="relative z-10 flex items-center">
            Continue
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </Button>
      </motion.div>
    </div>
  );
};
