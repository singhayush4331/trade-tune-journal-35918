
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Users, Star, Play, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ModernAcademyHero = () => {
  const stats = [
    { icon: BookOpen, label: 'Courses', value: '50+', gradient: 'from-green-500/30 to-emerald-500/30' },
    { icon: Users, label: 'Students', value: '2K+', gradient: 'from-green-600/30 to-teal-500/30' },
    { icon: Star, label: 'Rating', value: '4.9', gradient: 'from-green-500/30 to-emerald-600/30' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%', gradient: 'from-emerald-500/30 to-green-600/30' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-green-500/10">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-r from-green-400/20 to-teal-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Floating Icons - Hidden on mobile for cleaner look */}
        {[BookOpen, Star, TrendingUp].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute opacity-10 dark:opacity-5 hidden md:block"
            initial={{ y: 0, rotate: 0 }}
            animate={{ 
              y: [-20, 20, -20],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${15 + index * 30}%`,
              top: `${20 + index * 15}%`,
            }}
          >
            <Icon className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 sm:space-y-10 max-w-4xl mx-auto"
        >
          {/* Haven Ark Logo and Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center space-y-3 sm:space-y-4"
          >
            {/* Haven Ark Logo */}
            <div className="flex items-center justify-center mb-1 sm:mb-2">
              <img 
                src="/lovable-uploads/9ea240e5-b9e3-4cda-a9f3-829b0695c636.png" 
                alt="Haven Ark Logo" 
                className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 object-contain"
              />
            </div>
            
            <Badge 
              variant="outline" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border-green-500/40 backdrop-blur-sm hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-300 text-green-700 dark:text-green-300 font-medium text-xs sm:text-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
              Powered by Haven Ark
            </Badge>
          </motion.div>
          
          {/* Main Heading */}
          <div className="space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight pb-2 sm:pb-4">
              Haven Ark
              <span className="block bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent leading-relaxed pb-1 sm:pb-2">
                Trading Academy
              </span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
              Master professional trading with Haven Ark's expertly designed curriculum and proven methodologies
            </p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4 sm:px-0"
          >
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 group text-white text-sm sm:text-base"
              asChild
            >
              <Link to="#courses">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:scale-110 transition-transform" />
                Start Learning
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-green-500/30 hover:bg-green-500/10 dark:hover:bg-green-500/5 backdrop-blur-sm transition-all duration-300 group text-sm sm:text-base"
              asChild
            >
              <Link to="/subscription">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Upgrade Plan
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Grid - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-12 sm:mt-16 md:mt-20 max-w-4xl mx-auto px-2 sm:px-0"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                y: -5
              }}
              className="group cursor-pointer"
            >
              <div className={`relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-border/50 bg-card backdrop-blur-sm hover:bg-card/90 hover:border-green-500/40 transition-all duration-300 group-hover:shadow-lg bg-gradient-to-br ${stat.gradient}`}>
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
                
                <div className="relative">
                  <div className="inline-flex p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-green-500/30 to-emerald-600/30 mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernAcademyHero;
