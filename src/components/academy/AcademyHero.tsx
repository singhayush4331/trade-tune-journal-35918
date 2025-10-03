
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Clock, Sparkles, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const AcademyHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { icon: BookOpen, label: 'Courses', value: '50+', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Students', value: '2.5K+', color: 'from-purple-500 to-pink-500' },
    { icon: Award, label: 'Certificates', value: '1.2K+', color: 'from-green-500 to-emerald-500' },
    { icon: Clock, label: 'Hours of Content', value: '200+', color: 'from-orange-500 to-red-500' },
  ];

  const floatingElements = [
    { icon: BookOpen, delay: 0, duration: 6 },
    { icon: Award, delay: 1, duration: 8 },
    { icon: Sparkles, delay: 2, duration: 7 },
  ];

  return (
    <div className="relative min-h-[60vh] bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 overflow-hidden pt-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element, index) => (
          <motion.div
            key={index}
            className="absolute opacity-10"
            initial={{ y: 100, opacity: 0 }}
            animate={{ 
              y: [100, -20, 100],
              opacity: [0, 0.3, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${20 + index * 25}%`,
              top: `${10 + index * 15}%`,
            }}
          >
            <element.icon className="h-16 w-16 text-primary" />
          </motion.div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-pink-400/20 to-orange-600/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center space-y-8">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Badge variant="outline" className="px-4 py-2 text-sm border-primary/20 bg-primary/5">
              <Sparkles className="h-4 w-4 mr-2" />
              Premium Trading Education
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Trading Academy
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Master the art of trading with our comprehensive courses, expert insights, and hands-on learning experiences designed for traders of all levels.
            </p>
          </motion.div>

          {/* Action Buttons - Different for authenticated vs non-authenticated users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {user ? (
              // Authenticated user buttons
              <>
                <Button size="lg" className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Continue Learning
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-8 py-4 text-lg border-2"
                  onClick={() => navigate('/subscription')}
                >
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Upgrade to Full Platform
                </Button>
              </>
            ) : (
              // Non-authenticated user buttons
              <>
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-lg"
                  onClick={() => navigate('/academy/signup')}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Learning
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2">
                  Browse Courses
                </Button>
              </>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="group"
              >
                <div className="relative p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AcademyHero;
