import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Trophy, BookOpen, MessageSquare, Zap, TrendingUp, Star, PlayCircle, Target, Award, Globe, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedCounter } from '@/components/modern/AnimatedCounter';
const ModernHeroSection = () => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [{
    icon: BookOpen,
    title: "Masterclass",
    description: "50+ comprehensive modules with live sessions",
    color: "from-blue-500/80 to-indigo-600/80",
    glowColor: "shadow-blue-500/30",
    stats: "2.5K+ graduates",
    particles: 8
  }, {
    icon: Users,
    title: "Elite Community",
    description: "Connect with 10,000+ active traders",
    color: "from-green-500/80 to-emerald-600/80",
    glowColor: "shadow-green-500/30",
    stats: "30K+ trained",
    particles: 12
  }, {
    icon: Target,
    title: "Live Mentorship",
    description: "1-on-1 guidance from expert traders",
    color: "from-purple-500/80 to-pink-600/80",
    glowColor: "shadow-purple-500/30",
    stats: "24/7 support",
    particles: 10
  }];
  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  if (!mounted) return null;
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted/30">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_50%)]" />
      </div>

      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 border border-primary/10 rounded-full" />
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-secondary/10 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-lg rotate-45" />
      </div>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent [mask-image:radial-gradient(white,transparent_80%)]" />

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-4 ${isMobile ? 'py-12' : 'py-20'}`}>
        <div className={`text-center ${isMobile ? 'space-y-8' : 'space-y-16'}`}>
          
          {/* Clean Badge */}
          <motion.div initial={{
          opacity: 0,
          y: 50,
          scale: 0.8
        }} animate={{
          opacity: 1,
          y: 0,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 0.2,
          type: "spring",
          bounce: 0.4
        }} className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-xl" />
          </motion.div>

          {/* 3D Text Effect */}
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 0.4
        }} className="space-y-8">
            <h1 className={`${isMobile ? 'text-3xl' : 'text-6xl lg:text-8xl'} font-black leading-normal tracking-tight pb-4`}>
              <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70" initial={{
              rotateX: -90,
              opacity: 0
            }} animate={{
              rotateX: 0,
              opacity: 1
            }} transition={{
              duration: 0.8,
              delay: 0.6
            }}>
                India's #1 Stock
              </motion.span>
              <motion.span className="block text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 to-foreground/60" initial={{
              rotateX: -90,
              opacity: 0
            }} animate={{
              rotateX: 0,
              opacity: 1
            }} transition={{
              duration: 0.8,
              delay: 0.8
            }}>
                Trading Community
              </motion.span>
            </h1>
            
            <motion.p className={`${isMobile ? 'text-base' : 'text-xl lg:text-2xl'} text-muted-foreground leading-relaxed max-w-4xl mx-auto font-medium ${isMobile ? 'px-2' : ''}`} initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8,
            delay: 1.2
          }}>
              {isMobile ? "Join thousands of successful traders with our comprehensive program, live mentorship, and proven strategies." : "Join thousands of successful traders who've mastered the markets with our comprehensive program, live mentorship, and proven strategies."}
            </motion.p>
          </motion.div>

          {/* Glassmorphism Feature Cards */}
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 1.4
        }} className="max-w-6xl mx-auto">
            <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-8'}`}>
              {features.map((feature, index) => <motion.div key={index} animate={{
              scale: activeFeature === index ? 1.05 : 1,
              y: activeFeature === index ? -20 : 0
            }} whileHover={{
              scale: 1.02,
              y: -10
            }} transition={{
              duration: 0.5,
              type: "spring"
            }} className="cursor-pointer group" onClick={() => setActiveFeature(index)}>
                  <div className={`relative ${isMobile ? 'p-6' : 'p-8'} backdrop-blur-xl bg-card/40 border border-white/20 ${isMobile ? 'rounded-2xl' : 'rounded-3xl'} transition-all duration-700 ${activeFeature === index ? `ring-2 ring-primary/40 ${feature.glowColor} shadow-2xl` : 'hover:bg-card/60'}`}>
                    
                    <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-gradient-to-br ${feature.color} ${isMobile ? 'rounded-xl' : 'rounded-2xl'} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <feature.icon className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'} text-white`} />
                    </div>
                    
                    <h3 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold mb-3 group-hover:text-primary transition-colors`}>
                      {feature.title}
                    </h3>
                    <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-lg'} mb-4 leading-relaxed`}>
                      {feature.description}
                    </p>
                    <Badge className="bg-gradient-to-r from-primary/80 to-primary/60 text-white border-0 px-4 py-2 shadow-lg">
                      {feature.stats}
                    </Badge>
                  </div>
                </motion.div>)}
            </div>
          </motion.div>

          {/* Next-Gen CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 50
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 1,
          delay: 1.8
        }} className={`flex flex-col ${isMobile ? 'gap-3' : 'sm:flex-row gap-6'} justify-center items-center ${isMobile ? 'px-4' : ''}`}>
            <motion.div whileHover={!isMobile ? {
            scale: 1.05
          } : {}} whileTap={{
            scale: 0.95
          }} className="relative w-full sm:w-auto">
              <div className={`absolute -inset-2 bg-gradient-to-r from-primary to-primary/80 ${isMobile ? 'rounded-xl' : 'rounded-2xl'} blur-xl opacity-50 group-hover:opacity-75 transition-opacity`} />
              <Button asChild size={isMobile ? "lg" : "lg"} className={`relative bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 border-0 text-white shadow-2xl ${isMobile ? 'px-6 py-4 text-base w-full' : 'px-10 py-6 text-xl'} font-semibold ${isMobile ? 'rounded-xl' : 'rounded-2xl'} transition-all duration-500`}>
                <Link to="/haven-ark/signup" className="group flex items-center justify-center">
                  {isMobile ? 'Get Pricing' : 'Get Pricing & Register'}
                  <ArrowRight className={`${isMobile ? 'h-5 w-5 ml-2' : 'h-6 w-6 ml-3'} transition-transform group-hover:translate-x-1`} />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={!isMobile ? {
            scale: 1.05
          } : {}} whileTap={{
            scale: 0.95
          }} className="w-full sm:w-auto">
              <Button asChild variant="outline" size={isMobile ? "lg" : "lg"} className={`backdrop-blur-xl bg-card/40 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 ${isMobile ? 'px-6 py-4 text-base w-full' : 'px-10 py-6 text-xl'} font-semibold ${isMobile ? 'rounded-xl' : 'rounded-2xl'} transition-all duration-500`}>
                <Link to="/academy/signup" className="group flex items-center justify-center">
                  Join Community
                  <MessageSquare className={`${isMobile ? 'h-5 w-5 ml-2' : 'h-6 w-6 ml-3'} transition-transform group-hover:rotate-12`} />
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators with Animation */}
          

          {/* Scroll Indicator */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 1,
          delay: 2.4
        }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            
          </motion.div>
        </div>
      </div>
    </section>;
};
export default ModernHeroSection;