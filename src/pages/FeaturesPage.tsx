
import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Bot, LineChart, Clock, Calculator, FileText, Layers } from 'lucide-react';
import FeatureLayout from '@/components/layout/FeatureLayout';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load non-critical component
const FeatureCard = lazy(() => import('@/components/landing/FeatureCard'));

// Loading placeholder for lazy-loaded components
const FeatureCardSkeleton = () => (
  <div className="rounded-xl border border-primary/10 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
    <Skeleton className="h-10 w-10 rounded-full mb-4" />
    <Skeleton className="h-6 w-2/3 mb-2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6 mt-1" />
  </div>
);

const FeaturesPage = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: Bot, 
      title: "AI Trading Assistant", 
      description: "Get personalized insights and advice from our AI trading assistant that analyzes your trades and provides actionable recommendations.",
      delay: 0.1,
      color: "from-primary to-blue-500",
      link: "/features/ai-assistant"
    },
    {
      icon: Layers, 
      title: "Trading Playbooks", 
      description: "Create and follow structured trading strategies with custom playbooks to maintain consistency in your trading approach.",
      delay: 0.2,
      color: "from-purple-600 to-pink-500",
      link: "/features/playbooks"
    },
    {
      icon: LineChart, 
      title: "Emotional Analysis", 
      description: "Track and analyze how emotions affect your trading decisions to improve your mental approach to the markets.",
      delay: 0.3,
      color: "from-rose-500 to-red-500",
      link: "/features/emotions"
    },
    {
      icon: Clock, 
      title: "Time Analysis", 
      description: "Identify your most profitable trading hours and optimize your schedule for better performance and work-life balance.",
      delay: 0.4,
      color: "from-blue-500 to-cyan-400",
      link: "/features/time"
    },
    {
      icon: FileText, 
      title: "Trade Journal", 
      description: "Document your trades with screenshots, notes and detailed analytics to build a comprehensive trading history.",
      delay: 0.5,
      color: "from-green-500 to-emerald-400",
      link: "/features/trade-entry"
    },
    {
      icon: Calculator, 
      title: "Position Sizing", 
      description: "Calculate optimal position sizes based on your risk tolerance to protect your capital and maximize returns.",
      delay: 0.6,
      color: "from-amber-500 to-orange-500",
      link: "/features/calculator"
    }
  ];

  // Improved responsiveness checks
  const gridCols = isMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3";
  const textSize = isMobile ? "text-3xl sm:text-4xl" : "text-5xl sm:text-6xl";
  const descSize = isMobile ? "text-base" : "text-xl";

  return (
    <FeatureLayout title="Features">
      <Helmet>
        <title>Wiggly Features | Complete Trading Journal Toolkit</title>
        <meta 
          name="description" 
          content="Explore the full suite of Wiggly trading journal features - AI assistant, playbooks, emotional analysis, time optimization, detailed journaling and risk management." 
        />
        <meta 
          name="keywords" 
          content="trading journal features, AI trading assistant, trading playbooks, emotional analysis, time analysis, position sizing, trade journal" 
        />
      </Helmet>

      {/* Optimized Hero Section - No 3D elements */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }}
              className={`font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 ${textSize}`}
            >
              Powerful Features for Serious Traders
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-muted-foreground leading-relaxed mb-8 ${descSize}`}
            >
              Wiggly combines AI-powered insights with comprehensive tracking tools to help you become a more consistent and profitable trader.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                <Link to="/signup">
                  Start Your Trading Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid - With lazy loading */}
      <section className="pb-20 sm:pb-28 relative overflow-hidden bg-gradient-to-b from-background/50 to-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }} 
              viewport={{ once: true }}
              className={`font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-6 ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
            >
              Everything You Need to Succeed
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1 }} 
              viewport={{ once: true }}
              className="text-muted-foreground mx-auto max-w-3xl"
            >
              Explore our complete suite of tools designed to transform your trading performance
            </motion.p>
          </div>
          
          <div className={`grid ${gridCols} gap-6 sm:gap-8`}>
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="block transform transition-transform">
                <Suspense fallback={<FeatureCardSkeleton />}>
                  <FeatureCard 
                    icon={feature.icon} 
                    title={feature.title} 
                    description={feature.description} 
                    delay={feature.delay}
                    color={feature.color}
                  />
                </Suspense>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Simplified for better performance */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-muted/30 to-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }} 
              viewport={{ once: true }}
              className={`font-bold mb-6 ${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"}`}
            >
              Ready to Transform Your Trading?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1 }} 
              viewport={{ once: true }}
              className={`text-muted-foreground mb-8 ${isMobile ? "text-base" : "text-lg"}`}
            >
              Join thousands of traders who have improved their results with Wiggly's comprehensive trading journal platform.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }} 
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                <Link to="/signup">
                  Start Free Trial
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/">
                  Explore Demo
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default FeaturesPage;
