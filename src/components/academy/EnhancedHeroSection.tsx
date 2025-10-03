import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ArrowRight, 
  Award, 
  Users, 
  TrendingUp, 
  Play,
  Eye,
  Calendar,
  CheckCircle,
  Star,
  Timer,
  Target
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedHeroSection = () => {
  const isMobile = useIsMobile();
  const [liveViewers, setLiveViewers] = useState(247);
  const [enrollmentCount, setEnrollmentCount] = useState(1832);

  // Simulate live viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Simulate enrollment updates
  useEffect(() => {
    const interval = setInterval(() => {
      setEnrollmentCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: "5000+", label: "Students Trained", icon: Users },
    { value: "95%", label: "Success Rate", icon: Target },
    { value: "24/7", label: "Mentor Support", icon: CheckCircle }
  ];

  const highlights = [
    "Live trading sessions daily",
    "1-on-1 mentorship included",
    "Professional certification",
    "Exclusive Discord community",
    "Lifetime course access"
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-card/50"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-primary/5 rounded-full blur-2xl opacity-20 animate-bounce"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column - Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          {/* Live Session Indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-red-500">LIVE SESSION ACTIVE</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={liveViewers}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex items-center gap-1 text-sm text-muted-foreground"
              >
                <Eye className="h-4 w-4" />
                {liveViewers} watching
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Main Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-2">
              <Award className="h-4 w-4 mr-2" />
              India's #1 Trading Masterclass
            </Badge>
          </motion.div>
          
          {/* Main Headlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl lg:text-7xl'} font-bold tracking-tight leading-tight`}>
              <span className="block">Master Stock Trading</span>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-purple-500 bg-clip-text text-transparent">
                A-to-Z Masterclass
              </span>
            </h1>
            
            <p className={`${isMobile ? 'text-lg' : 'text-xl lg:text-2xl'} text-muted-foreground leading-relaxed max-w-2xl`}>
              Transform your trading journey with India's most comprehensive stock market course. 
              Learn from live trading sessions, get personal mentorship, and join our thriving community.
            </p>
          </motion.div>

          {/* Key Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="space-y-3"
          >
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">{highlight}</span>
              </motion.div>
            ))}
          </motion.div>
          
          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6 group shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => {
                window.open('https://typeform.com/placeholder', '_blank');
              }}
            >
              Join the Masterclass
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            
            <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5 text-lg px-8 py-6 group">
              <Play className="h-5 w-5 mr-2" />
              Watch Free Preview
            </Button>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="pt-8 border-t border-border/20"
          >
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-2xl font-bold text-primary">{stat.value}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Interactive Elements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="space-y-6"
        >
          {/* Live Session Preview */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Live Trading Session</h3>
              <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></div>
                LIVE
              </Badge>
            </div>
            
            <div className="aspect-video bg-background/40 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10"></div>
              <div className="relative z-10 text-center">
                <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2">Join Live Session</p>
                <p className="text-sm text-muted-foreground">Watch expert traders in action</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>247 viewers</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="h-4 w-4 text-primary" />
                <span>2h 15m active</span>
              </div>
            </div>
          </Card>

          {/* Community Activity */}
          <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Community Activity</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Users className="h-3 w-3 mr-1" />
                5000+ members
              </Badge>
            </div>
            
            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">R</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">RajTrader</span>
                    <span className="text-xs text-muted-foreground">2m ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Just booked 15% profit using today's strategy! 🚀</p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
                className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-primary">P</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">PriyaInvestor</span>
                    <span className="text-xs text-muted-foreground">5m ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">The mentorship call was amazing! Thanks team ✨</p>
                </div>
              </motion.div>
            </div>
          </Card>

          {/* Enrollment Counter */}
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Enrollment Update</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={enrollmentCount}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  className="text-3xl font-bold text-primary mb-2"
                >
                  {enrollmentCount.toLocaleString()}
                </motion.div>
              </AnimatePresence>
              <p className="text-sm text-muted-foreground">Students enrolled this month</p>
              
              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>Next batch: Jan 27</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;