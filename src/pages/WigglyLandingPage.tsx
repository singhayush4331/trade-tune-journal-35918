
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, Bot, BookOpen, ChartBar, Clock, Calculator, ScanLine } from 'lucide-react';
import HeroSection from '@/components/landing/HeroSection';
import SmartTradeImportFeature from '@/components/landing/SmartTradeImportFeature';
import WigglyAIFeature from '@/components/landing/WigglyAIFeature';
import PlaybookShowcase from '@/components/landing/PlaybookShowcase';
import EmotionalAnalysisSection from '@/components/landing/EmotionalAnalysisSection';
import TimeDistributionSection from '@/components/landing/TimeDistributionSection';
import Footer from '@/components/landing/Footer';
import TradeRecordingSection from '@/components/landing/TradeRecordingSection';
import PositionSizingCalculator from '@/components/dashboard/PositionSizingCalculator';
import SubscriptionSection from '@/components/landing/SubscriptionSection';
import TestimonialCard from '@/components/landing/TestimonialCard';
import FeatureShowcase from '@/components/landing/FeatureShowcase';
import { useIsMobile, useIsSmall, useIsXSmall } from '@/hooks/use-mobile';

const WigglyLandingPage = () => {
  const isMobile = useIsMobile();
  const isSmall = useIsSmall();
  const isXSmall = useIsXSmall();
  
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Helmet>
        <title>Wiggly | AI-Powered Trading Journal for Better Performance</title>
        <meta name="description" content="Track, analyze, and improve your trading performance with Wiggly Trading Journal. Get AI-powered insights, detailed analytics, and personalized feedback to transform your trading results." />
        <meta name="keywords" content="trading journal, trade tracking, trade analytics, AI trading assistant, stock trading, journal app, emotional analysis, trading playbooks, position sizing, Indian trading" />
        <link rel="canonical" href="https://wiggly.lovable.dev/" />
        
        {/* Schema.org markup for Landing Page */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Wiggly Trading Journal",
              "description": "Track, analyze, and improve your trading performance with AI-powered insights",
              "mainEntity": {
                "@type": "SoftwareApplication",
                "name": "Wiggly Trading Journal",
                "applicationCategory": "FinanceApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              }
            }
          `}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-screen">
        <HeroSection />
      </section>

      {/* Features Tabs Section */}
      <section className="px-4 relative py-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className={`font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent ${isMobile ? "text-3xl" : "text-5xl"}`}>
              Discover Our Features
            </h2>
            <p className={`${isMobile ? "text-base" : "text-xl"} text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0`}>
              Explore how Wiggly can transform your trading experience
            </p>
          </div>

          <Tabs defaultValue="smart-trade-import" className="w-full">
            {/* Fixed: Improved horizontal scrolling for tab list on mobile */}
            <div className="relative w-full pb-2 mb-2">
              <TabsList className="w-full max-w-full flex justify-between space-x-1 p-1 bg-muted/50 rounded-lg shadow-sm border border-border/10 overflow-x-auto scrollbar-hide">
                <TabsTrigger value="smart-trade-import" className="flex-shrink-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-1 p-2">
                  <ScanLine className="h-4 w-4" />
                  <span className={`${isXSmall ? "hidden" : "inline"} text-xs sm:text-sm`}>Smart Import</span>
                </TabsTrigger>
                <TabsTrigger value="ai-assistant" className="flex-shrink-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-1 p-2">
                  <Bot className="h-4 w-4" />
                  <span className={`${isXSmall ? "hidden" : "inline"} text-xs sm:text-sm`}>AI Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="playbooks" className="flex-shrink-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-1 p-2">
                  <BookOpen className="h-4 w-4" />
                  <span className={`${isXSmall ? "hidden" : "inline"} text-xs sm:text-sm`}>Playbooks</span>
                </TabsTrigger>
                <TabsTrigger value="emotions" className="flex-shrink-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-1 p-2">
                  <Bot className="h-4 w-4" />
                  <span className={`${isXSmall ? "hidden" : "inline"} text-xs sm:text-sm`}>Emotions</span>
                </TabsTrigger>
                <TabsTrigger value="time" className="flex-shrink-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-1 p-2">
                  <Clock className="h-4 w-4" />
                  <span className={`${isXSmall ? "hidden" : "inline"} text-xs sm:text-sm`}>Time</span>
                </TabsTrigger>
                <TabsTrigger value="calculator" className="flex-shrink-0 data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-1 p-2">
                  <Calculator className="h-4 w-4" />
                  <span className={`${isXSmall ? "hidden" : "inline"} text-xs sm:text-sm`}>Calculator</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Indicator for horizontal scrolling */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-center mt-1 md:hidden">
                <div className="flex space-x-1">
                  <div className="h-1 w-10 rounded-full bg-primary/30"></div>
                </div>
              </div>
            </div>

            <div className="relative">
              <TabsContent value="smart-trade-import" className="mt-0">
                <SmartTradeImportFeature />
              </TabsContent>

              <TabsContent value="ai-assistant" className="mt-0">
                <WigglyAIFeature />
              </TabsContent>

              <TabsContent value="playbooks" className="mt-0">
                <PlaybookShowcase />
              </TabsContent>

              <TabsContent value="emotions" className="mt-0">
                <EmotionalAnalysisSection />
              </TabsContent>

              <TabsContent value="time" className="mt-0">
                <TimeDistributionSection />
              </TabsContent>

              <TabsContent value="calculator" className="mt-0">
                <section className={`py-12 sm:py-24 px-4 bg-background/90 backdrop-blur-sm relative`}>
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-30"></div>
                  
                  <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                        <div className="space-y-6 sm:space-y-8">
                        <div className="space-y-4 sm:space-y-6">
                          <div className="space-y-2">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                              <Calculator className="mr-2 h-4 w-4" />
                              Position Sizing
                            </span>
                            <h2 className={`${isMobile ? "text-2xl sm:text-3xl" : "text-4xl"} font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent`}>
                              Perfect Your <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">Trading</span> Size
                            </h2>
                          </div>
                          <p className={`${isMobile ? "text-base" : "text-xl"} text-muted-foreground leading-relaxed`}>
                            Calculate optimal position sizes based on your risk tolerance and account balance. Make informed decisions about your trade volumes.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                            <h3 className="font-semibold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Risk Management</h3>
                            <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                              Set your risk percentage and protect your capital with precise position sizing
                            </p>
                            </div>

                          <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                            <h3 className="font-semibold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Stop Loss Integration</h3>
                            <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                              Calculate positions based on your predetermined stop loss levels
                            </p>
                            </div>
                          
                          <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                            <h3 className="font-semibold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Risk-Reward Analysis</h3>
                            <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                              Visualize potential profit versus maximum loss for each trade setup
                            </p>
                            </div>
                          
                          <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                            <h3 className="font-semibold mb-1 sm:mb-2 text-primary text-sm sm:text-base">Long & Short Support</h3>
                            <p className={`${isMobile ? "text-xs" : "text-sm"} text-muted-foreground`}>
                              Calculate positions for both long and short trading strategies
                            </p>
                          </div>
                        </div>
                        
                        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row gap-4">
                          <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                            <Link to="/signup">
                              Try Position Calculator
                              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                            
                          </Button>
                        </div>
                      </div>

                      <div className={`mt-6 lg:mt-0 ${isMobile ? "" : "lg:pl-8"}`}>
                        <PositionSizingCalculator />
                      </div>
                    </div>
                  </div>
                </section>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Trade Recording Section */}
      <TradeRecordingSection />
      
      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 px-4 bg-gradient-to-b from-card/20 to-background relative">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <ChartBar className="mr-1 h-4 w-4" />
              Trader Feedback
            </span>
            <h2 className={`${isMobile ? "text-2xl sm:text-3xl mt-4" : "text-4xl mt-6"} font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent my-[25px] py-[5px]`}>
              What Our Traders Say
            </h2>
            <p className={`${isMobile ? "text-base" : "text-xl"} text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0`}>
              Hear from traders who've transformed their approach with Wiggly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <TestimonialCard quote="Wiggly's position sizing calculator has completely changed how I approach risk management. My win rate has improved by 15% since I started using it." author="Rahul M." title="Day Trader, 5 years" delay={0.1} />
            <TestimonialCard quote="The emotional analysis feature helped me understand my trading psychology. I realized I was making poor decisions when feeling anxious. Game changer!" author="Priya S." title="Swing Trader, 3 years" delay={0.3} />
            <TestimonialCard quote="The AI assistant spotted a pattern in my failed trades that I never noticed myself. I've now developed a strategy to avoid those setups completely." author="Vikram J." title="Futures Trader, 8 years" delay={0.5} />
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <SubscriptionSection />

      {/* Feature Showcase - replacing the simple CTA */}
      <FeatureShowcase />

      <Footer />
    </div>;
};

export default WigglyLandingPage;
