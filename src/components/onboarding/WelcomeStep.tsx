
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <div className="flex-grow flex flex-col justify-between">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center px-4 flex-grow flex flex-col justify-center items-center"
      >
        <motion.div 
          variants={itemVariants}
          className="w-48 h-48 mb-8 relative"
        >
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
          <div className="absolute inset-4 bg-gradient-to-br from-primary to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/lovable-uploads/2780255e-6d53-44a4-8fcf-7fa8a4a25bc1.png" 
              alt="Wiggly Logo" 
              className="w-36 h-36 object-contain p-2"
            />
          </div>
        </motion.div>
        
        <motion.h2 
          variants={itemVariants}
          className="text-4xl font-bold mb-4 relative"
        >
          Welcome to{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-primary via-purple-400 to-blue-500 bg-clip-text text-transparent">
              Wiggly
            </span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary to-blue-500 rounded-full"></span>
          </span>
          !
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl text-muted-foreground mb-8 max-w-md"
        >
          Your personal trading journal that helps you track, analyze, and improve your trading performance.
        </motion.p>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 mt-2 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">Track Trades</h3>
              <p className="text-sm text-muted-foreground">Log and analyze all your trading activity</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3 mt-2 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M21 7L15.5657 12.4343C15.3677 12.6323 15.2687 12.7313 15.1545 12.7684C15.0541 12.8011 14.9459 12.8011 14.8455 12.7684C14.7313 12.7313 14.6323 12.6323 14.4343 12.4343L12.5657 10.5657C12.3677 10.3677 12.2687 10.2687 12.1545 10.2316C12.0541 10.1989 11.9459 10.1989 11.8455 10.2316C11.7313 10.2687 11.6323 10.3677 11.4343 10.5657L7 15M21 7H17M21 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-medium mb-1">Get Insights</h3>
              <p className="text-sm text-muted-foreground">Visualize performance with powerful analytics</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 duration-300 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardContent className="p-4 flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3 mt-2 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4V16.2C16 17.8802 16 18.7202 15.673 19.362C15.3854 19.9265 14.9265 20.3854 14.362 20.673C13.7202 21 12.8802 21 11.2 21H10.8C9.11984 21 8.27976 21 7.63803 20.673C7.07354 20.3854 6.6146 19.9265 6.32698 19.362C6 18.7202 6 17.8802 6 16.2V4M16 4H17.4C18.1234 4 18.4851 4 18.7681 4.10899C19.0146 4.20487 19.2261 4.35785 19.381 4.55279C19.5547 4.77393 19.6457 5.07926 19.8278 5.68992L20.5722 7.93008C20.7543 8.54074 20.8453 8.84607 20.619 9.06721C20.4631 9.22736 20.2559 9.33795 20.0312 9.38189C19.7672 9.43252 19.4651 9.33946 18.861 9.15334C17.812 8.83157 16.6984 8.82452 15.6455 9.1333C14.3394 9.5153 13.2013 10.3337 12.4455 11.4523C12.1857 11.8146 11.8143 11.8146 11.5545 11.4523C10.7987 10.3337 9.66055 9.5153 8.35451 9.1333C7.30155 8.82452 6.18802 8.83157 5.13899 9.15334C4.53486 9.33946 4.2328 9.43252 3.96879 9.38189C3.74414 9.33795 3.53695 9.22736 3.38105 9.06721C3.15472 8.84607 3.24569 8.54074 3.42761 7.93008L4.17239 5.68992C4.35431 5.07926 4.44527 4.77393 4.619 4.55279C4.77389 4.35785 4.98542 4.20487 5.23196 4.10899C5.51491 4 5.87656 4 6.6 4H16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-medium mb-1">Improve Skills</h3>
              <p className="text-sm text-muted-foreground">Learn from your history to enhance results</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-auto flex justify-center"
      >
        <Button 
          size="lg" 
          onClick={onNext} 
          className="group mt-8 relative overflow-hidden bg-gradient-to-r from-primary to-blue-500 hover:shadow-lg hover:shadow-primary/20"
        >
          <span className="relative z-10 flex items-center">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </Button>
      </motion.div>
    </div>
  );
};
