
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen } from 'lucide-react';

interface SimpleAcademyHeroProps {
  isAcademyStudent: boolean;
}

const SimpleAcademyHero: React.FC<SimpleAcademyHeroProps> = ({ isAcademyStudent }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/40 dark:via-emerald-950/30 dark:to-teal-950/40">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />
      
      {/* Content */}
      <div className="relative container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 sm:space-y-8"
        >
          {/* Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-600/30 rounded-full blur-2xl"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
              {isAcademyStudent ? (
                <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              ) : (
                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {isAcademyStudent ? 'Welcome Back' : 'Haven Ark Academy'}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              {isAcademyStudent 
                ? 'Continue your trading education journey with your assigned courses'
                : 'Experience our comprehensive trading education with full trial access'
              }
            </p>
          </div>

          {/* Subtitle */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base text-muted-foreground/80 max-w-2xl mx-auto">
              {isAcademyStudent 
                ? 'Access your learning materials, track your progress, and master professional trading strategies.'
                : 'Get complete access to our trial courses and discover why thousands trust Haven Ark for trading education.'
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SimpleAcademyHero;
