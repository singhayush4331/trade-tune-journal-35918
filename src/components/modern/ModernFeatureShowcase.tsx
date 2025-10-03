import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  BarChart3, 
  Shield, 
  Zap, 
  Target, 
  TrendingUp,
  Brain,
  Sparkles,
  ChevronRight,
  Play
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const ModernFeatureShowcase = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const isMobile = useIsMobile();

  const features = [
    {
      id: 0,
      icon: Bot,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms analyze market patterns and predict optimal trading opportunities with 94% accuracy.",
      demo: "Smart pattern recognition identifies profitable setups before they happen",
      color: "from-blue-500 to-cyan-500",
      stats: { accuracy: "94%", speed: "0.3ms", predictions: "12K+" }
    },
    {
      id: 1,
      icon: Shield,
      title: "Advanced Risk Management",
      description: "Intelligent risk assessment tools automatically calculate position sizes and stop-loss levels to protect your capital.",
      demo: "Dynamic risk calculations adjust in real-time based on market volatility",
      color: "from-green-500 to-emerald-500",
      stats: { protection: "99.7%", alerts: "Real-time", saved: "$2.1M+" }
    },
    {
      id: 2,
      icon: BarChart3,
      title: "Real-time Market Insights",
      description: "Live market data streams combined with institutional-grade analytics provide you with professional trading insights.",
      demo: "Access the same data feed used by hedge funds and investment banks",
      color: "from-purple-500 to-pink-500",
      stats: { latency: "<1ms", sources: "50+", updates: "24/7" }
    },
    {
      id: 3,
      icon: Target,
      title: "Precision Entry & Exit",
      description: "Automated signals pinpoint exact entry and exit points using multi-timeframe analysis and momentum indicators.",
      demo: "Our algorithms process 1000+ data points per second for precise timing",
      color: "from-orange-500 to-red-500",
      stats: { precision: "92%", signals: "500+/day", profit: "+284%" }
    }
  ];

  return (
    <div className="relative py-32 px-4 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl opacity-40" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge className="glass-card px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Cutting-Edge Technology
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Trading
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {" "}Reimagined
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of trading with our revolutionary platform that combines 
            artificial intelligence, institutional-grade tools, and real-time analytics.
          </p>
        </motion.div>

        {/* Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Feature List */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.id}
                className={`glass-card p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                  activeFeature === index 
                    ? 'border-primary/50 shadow-floating' 
                    : 'border-transparent hover:border-primary/20'
                }`}
                onClick={() => setActiveFeature(index)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-3">{feature.description}</p>
                    <div className="flex items-center gap-2 text-primary">
                      <span className="text-sm font-medium">Explore Feature</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Column - Active Feature Demo */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                transition={{ duration: 0.5 }}
                className="glass-strong p-8 rounded-3xl shadow-floating transform-3d"
              >
                {/* Feature Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${features[activeFeature].color} shadow-lg`}>
                    {React.createElement(features[activeFeature].icon, {
                      className: "w-8 h-8 text-white"
                    })}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{features[activeFeature].title}</h3>
                    <Badge className="mt-1 bg-success/20 text-success">
                      <Zap className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>

                {/* Demo Description */}
                <p className="text-lg text-muted-foreground mb-6">
                  {features[activeFeature].demo}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {Object.entries(features[activeFeature].stats).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="glass-card p-3 rounded-lg text-center"
                    >
                      <p className="text-lg font-bold text-primary">{value}</p>
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Interactive Demo Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group"
                  size="lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Try Interactive Demo
                  <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </AnimatePresence>

            {/* Floating Elements */}
            <motion.div
              className="absolute -top-4 -right-4 glass-card p-3 rounded-full shadow-floating"
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Brain className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-floating group">
            <Link to="/signup" className="flex items-center gap-2">
              Experience All Features
              <TrendingUp className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernFeatureShowcase;