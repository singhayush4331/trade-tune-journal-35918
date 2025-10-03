
import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Bot, LineChart, Clock, BadgePercent, Layers, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the feature card component for better initial loading
const FeatureCard = lazy(() => 
  import('./FeatureCard').then(module => ({
    default: module.default
  }))
);

// Skeleton placeholder for the feature card while loading
const FeatureCardSkeleton = () => (
  <div className="rounded-xl border border-primary/10 bg-card p-6 transition-all duration-300">
    <Skeleton className="h-10 w-10 rounded-full mb-4" />
    <Skeleton className="h-6 w-2/3 mb-2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6 mt-1" />
  </div>
);

const FeatureShowcase = () => {
  const isMobile = useIsMobile();
  
  const features = [
    {
      icon: Bot, 
      title: "AI Trading Assistant", 
      description: "Get personalized insights and advice from our AI trading assistant.",
      delay: 0.1,
      color: "from-primary to-blue-500",
      link: "/features/ai-assistant"
    },
    {
      icon: LineChart, 
      title: "Advanced Analytics", 
      description: "Visualize your trading performance with interactive charts and metrics.", 
      delay: 0.2,
      color: "from-purple-600 to-pink-500",
      link: "/features/playbooks"
    },
    {
      icon: Clock, 
      title: "Time Analysis", 
      description: "Identify your most profitable trading hours and optimize your schedule.", 
      delay: 0.3,
      color: "from-blue-500 to-cyan-400",
      link: "/features/time"
    },
    {
      icon: BadgePercent, 
      title: "Risk Management", 
      description: "Calculate optimal position sizes based on your risk tolerance.", 
      delay: 0.4,
      color: "from-amber-500 to-orange-500",
      link: "/features/calculator"
    },
    {
      icon: FileText, 
      title: "Trade Journal", 
      description: "Document your trades with screenshots, notes and detailed analytics.", 
      delay: 0.5,
      color: "from-green-500 to-emerald-400",
      link: "/features/trade-entry"
    },
    {
      icon: Layers, 
      title: "Pattern Recognition", 
      description: "Identify recurring patterns in your trading behavior and results.", 
      delay: 0.6,
      color: "from-rose-500 to-red-500",
      link: "/features/emotions"
    }
  ];
  
  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-background/50 to-background">
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            viewport={{ once: true }}
            className={`font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent mb-4 ${isMobile ? "text-3xl" : "text-4xl sm:text-5xl"}`}
          >
            Ready to Elevate Your Trading?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }} 
            viewport={{ once: true }}
            className={`text-muted-foreground mx-auto max-w-3xl ${isMobile ? "text-base" : "text-lg sm:text-xl"}`}
          >
            Join thousands of traders who are using our platform to achieve consistent results.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {features.map((feature, index) => (
            <Link 
              key={index} 
              to={feature.link} 
              className="block transform transition-transform hover:scale-[1.02]"
            >
              <Suspense fallback={<FeatureCardSkeleton />}>
                <FeatureCard 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description} 
                  delay={0}  // Remove delay for faster initial load
                  color={feature.color}
                />
              </Suspense>
            </Link>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
            <Link to="/features">
              Explore All Features
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
