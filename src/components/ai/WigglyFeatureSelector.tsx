
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Bot, BarChart3, GraduationCap, ChevronLeft, Sparkles, Zap, BookOpen } from 'lucide-react';
import WigglyFeatureCard from './WigglyFeatureCard';
import { motion } from 'framer-motion';

interface WigglyFeatureSelectorProps {
  selectedFeature: string | null;
  setSelectedFeature: (feature: string | null) => void;
}

const WigglyFeatureSelector: React.FC<WigglyFeatureSelectorProps> = ({
  selectedFeature,
  setSelectedFeature
}) => {
  // Handle back button click
  const handleBackClick = () => {
    setSelectedFeature(null);
  };

  // Animation variants for feature cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  // If a feature is selected, show the feature header with back button
  if (selectedFeature) {
    return (
      <div className="flex justify-between items-center">
        <motion.h2 
          className="text-2xl font-bold flex items-center gap-3"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedFeature === "assistant" ? (
            <>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              Wiggly Assistant
            </>
          ) : selectedFeature === "education" ? (
            <>
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-purple-500" />
              </div>
              Custom Trading Education
            </>
          ) : selectedFeature === "patterns" ? (
            <>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              Advanced Pattern Recognition
            </>
          ) : null}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="outline" 
            size="sm"
            className="border-primary/20 hover:border-primary/40 hover:bg-primary/5" 
            onClick={handleBackClick}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Features
          </Button>
        </motion.div>
      </div>
    );
  }

  // If no feature is selected, show all feature cards
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Assistant Feature Card */}
      <motion.div variants={itemVariants}>
        <WigglyFeatureCard 
          icon={<Bot className="h-6 w-6 text-white" />}
          title="AI Assistant"
          description="Chat with your AI trading mentor and get insights about your trades, patterns, and performance."
          onClick={() => setSelectedFeature("assistant")}
        />
      </motion.div>
      
      {/* Education Feature Card */}
      <motion.div variants={itemVariants}>
        <WigglyFeatureCard 
          icon={<GraduationCap className="h-6 w-6 text-white" />}
          title="Custom Education"
          description="Get personalized learning materials, quizzes, and targeted improvement suggestions based on your trading history."
          onClick={() => setSelectedFeature("education")}
        />
      </motion.div>
      
      {/* Pattern Analysis Feature Card */}
      <motion.div variants={itemVariants}>
        <WigglyFeatureCard 
          icon={<BarChart3 className="h-6 w-6 text-white" />}
          title="Pattern Recognition"
          description="Analyze your trading patterns using AI to identify successful strategies and areas for improvement."
          onClick={() => setSelectedFeature("patterns")}
        />
      </motion.div>
    </motion.div>
  );
};

export default React.memo(WigglyFeatureSelector);
