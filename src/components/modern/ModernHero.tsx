import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  TrendingUp, 
  Sparkles, 
  Zap,
  BarChart3,
  Target,
  Bot,
  Play,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedCounter } from './AnimatedCounter';
import { ParticleSystem } from './ParticleSystem';
import { FloatingDashboard } from './FloatingDashboard';

const ModernHero = () => {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isMobile = useIsMobile();
  const { scrollY } = useScroll();
  
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMobile) {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    }
  };

  const stats = [
    { value: 15000, label: "Active Traders", suffix: "+" },
    { value: 98, label: "Success Rate", suffix: "%" },
    { value: 2.8, label: "Avg Monthly ROI", suffix: "x" },
    { value: 24, label: "Support", suffix: "/7" }
  ];

  const features = [
    { icon: Bot, label: "AI-Powered Analytics" },
    { icon: Shield, label: "Risk Management" },
    { icon: BarChart3, label: "Real-time Insights" },
    { icon: Target, label: "Precision Trading" }
  ];

  return (
    <div 
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-background/95 to-background/90"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl morphing-blob opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl morphing-blob opacity-40" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/15 rounded-full blur-3xl morphing-blob opacity-30" 
             style={{ animationDelay: '4s' }} />
      </div>

      {/* Particle System */}
      <ParticleSystem />

      {/* Main Content */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 min-h-screen flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-flex"
              >
                <Badge className="glass-card px-4 py-2 text-sm font-medium border-primary/20 hover:border-primary/40 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Next-Gen Trading Platform
                </Badge>
              </motion.div>

              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                  <span className="block">Trade</span>
                  <span className="block bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
                    Smarter
                  </span>
                  <span className="block">Not Harder</span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  Harness the power of AI-driven analytics and institutional-grade tools to 
                  transform your trading journey. Join thousands of traders already winning with our platform.
                </p>
              </motion.div>

              {/* Feature Pills */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-3"
              >
                {features.map((feature, index) => (
                  <div key={index} className="glass-card px-4 py-2 rounded-full flex items-center gap-2 hover-lift">
                    <feature.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white shadow-elegant group">
                  <Link to="/signup" className="flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Start Free Trial
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="glass-card border-primary/30 hover:border-primary hover:bg-primary/5 group">
                  <Link to="/demo" className="flex items-center gap-2">
                    Watch Demo
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-border/20"
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      <AnimatedCounter 
                        value={stat.value} 
                        suffix={stat.suffix}
                        delay={1.4 + (index * 0.1)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Column - Floating Dashboard */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative lg:block hidden"
            >
              <FloatingDashboard mousePosition={mousePosition} />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Dashboard */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative px-4 pb-20"
        >
          <Card className="glass-card p-6 mx-auto max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Live Dashboard</h3>
              <Badge variant="secondary" className="bg-success/20 text-success">
                <Zap className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-success" />
                  <span className="text-xs text-muted-foreground">P&L</span>
                </div>
                <p className="font-semibold text-success">+₹2.8L</p>
              </div>
              
              <div className="glass-card p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground">Win Rate</span>
                </div>
                <p className="font-semibold">68%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ModernHero;