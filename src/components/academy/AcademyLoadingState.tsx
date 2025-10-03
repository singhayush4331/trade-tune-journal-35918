
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Play, Star, Users, Clock } from 'lucide-react';

const AcademyLoadingState: React.FC = () => {
  const loadingIcons = [
    { icon: BookOpen, delay: 0, color: 'text-blue-500' },
    { icon: Play, delay: 0.2, color: 'text-purple-500' },
    { icon: Star, delay: 0.4, color: 'text-pink-500' },
    { icon: Users, delay: 0.6, color: 'text-green-500' },
    { icon: Clock, delay: 0.8, color: 'text-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900/20 -mx-4 -my-4 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-orange-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-4">
        {/* Main Loading Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          className="flex items-center justify-center mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Loading Trading Academy
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Preparing your premium learning experience...
          </p>
        </motion.div>

        {/* Floating Icons */}
        <div className="flex items-center justify-center gap-4 py-8">
          {loadingIcons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [20, 0, -10, 0],
                scale: [0.8, 1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-lg ${item.color}`}
            >
              <item.icon className="h-5 w-5" />
            </motion.div>
          ))}
        </div>

        {/* Loading Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-2"
        >
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
            />
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Curating your courses...
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AcademyLoadingState;
