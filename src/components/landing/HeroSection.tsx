
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, BarChart3, Bot, ArrowRight, ChartPie, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatIndianCurrency } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import PerformanceChart from './PerformanceChart';
import WinRateDonutChart from './WinRateDonutChart';

const chartData = [
  { date: '01 Apr', value: 25000 },
  { date: '07 Apr', value: 42000 },
  { date: '14 Apr', value: 58000 },
  { date: '18 Apr', value: 75000 }
];

const HeroSection = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`relative min-h-screen w-full ${isMobile ? 'py-4' : 'py-8 sm:py-16 md:py-24'} px-4 overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 -z-10"></div>
      <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 items-start py-4 sm:py-8 md:py-12 lg:py-20 px-1 sm:px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }} 
          className="text-center lg:text-left flex flex-col justify-start h-full"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.2 }} 
            className="flex flex-col items-center lg:items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6"
          >
            <div className={`${isMobile ? 'w-12 h-12' : 'w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20'} relative`}>
              {mounted && <img 
                src={resolvedTheme === 'dark' ? 
                  "/lovable-uploads/6120e2e2-296a-403d-a2a3-7cae3e7241fa.png" : 
                  "/lovable-uploads/9b3d413e-651f-4c3f-b921-f44bff49f09c.png"
                } 
                alt="Wiggly Logo" 
                className="w-full h-full object-contain" 
              />}
            </div>
            <span className={`inline-flex items-center rounded-full bg-primary/10 ${isMobile ? 'px-2 py-1 text-xs' : 'px-2 sm:px-3 py-1 text-xs sm:text-sm'} font-medium text-primary backdrop-blur-sm`}>
              <TrendingUp className={`${isMobile ? 'mr-1 h-3 w-3' : 'mr-1 h-3 w-3 sm:h-4 sm:w-4'}`} />
              AI-Powered Trading Journal
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.3 }}
            className={`${isMobile ? 'text-3xl sm:text-4xl md:text-5xl' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl'} font-extrabold mb-3 sm:mb-4 md:mb-6 tracking-tight leading-tight`}
          >
            <span className="block">Make Every</span>
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">Trade Count</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.7, delay: 0.5 }}
            className={`${isMobile ? 'text-sm sm:text-base' : 'text-base sm:text-lg md:text-xl'} mb-4 sm:mb-6 md:mb-10 max-w-xl mx-auto lg:mx-0 text-muted-foreground`}
          >
            Track, analyze, and improve your trading with our AI-powered analytics platform that reveals hidden patterns and predicts future performance.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.7, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <Button asChild size={isMobile ? "default" : "lg"} className={`${isMobile ? 'text-sm px-4 py-2' : 'text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-6'} bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group`}>
              <Link to="/signup" className="flex items-center gap-2">
                Start Free 24-Hour Trial
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size={isMobile ? "default" : "lg"} className={`${isMobile ? 'text-sm px-4 py-2' : 'text-sm sm:text-base py-2 sm:py-6'} border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary group shadow-sm`}>
              <Link to="/login" className="flex items-center gap-2">
                Login
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 sm:mt-12 pt-6 sm:pt-12 border-t border-border/20 hidden lg:block"
          >
            <div className="flex items-center gap-4 sm:gap-8 justify-between">
              <div className="text-center">
                <h4 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">15K+</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Users</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">98%</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Satisfaction</p>
              </div>
              <div className="text-center">
                <h4 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">24/7</h4>
                <p className="text-xs sm:text-sm text-muted-foreground">Support</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mt-6 lg:mt-0"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-30 blur-xl animate-pulse"></div>
          <div className="relative rounded-xl border border-primary/10 bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden w-full">
            <div className="bg-background/80 backdrop-blur-md border-b border-primary/10 p-2 sm:p-3 md:p-4 flex justify-between items-center">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="h-2 w-2 sm:h-3 sm:w-3 bg-red-500 rounded-full"></div>
                <div className="h-2 w-2 sm:h-3 sm:w-3 bg-yellow-500 rounded-full"></div>
                <div className="h-2 w-2 sm:h-3 sm:w-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Wiggly Trading Dashboard</span>
              </div>
            </div>

            <div className="p-2 sm:p-3 md:p-6">
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                {[{
                label: "Total P&L",
                value: "₹2.8L",
                trend: "+8.5%",
                icon: Target
               }, {
                 label: "Monthly Growth",
                 value: "12%",
                 trend: "+4.2%",
                 icon: TrendingUp
              }, {
                label: "Total Trades",
                value: "32",
                trend: "+6.1%",
                icon: BarChart3
              }, {
                label: "Avg. Profit/Trade",
                value: "₹8.7K",
                trend: "+2.8%",
                icon: ChartPie
              }].map((stat, index) => <Card key={index} className="bg-card/30 backdrop-blur-sm border border-primary/5 p-2 sm:p-3 md:p-4 hover:border-primary/20 transition-all duration-300">
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <span className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>{stat.label}</span>
                      <stat.icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary/60" />
                    </div>
                    <div className={`${isXSmall ? 'text-base' : 'text-lg'} font-bold`}>{stat.value}</div>
                    <div className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-success mt-1 flex items-center`}>
                      <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      {stat.trend}
                    </div>
                  </Card>)}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <Card className="bg-card/30 backdrop-blur-sm border border-primary/5 p-2 sm:p-3 md:p-6 mb-3 sm:mb-4 md:mb-6 hover:border-primary/20 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2 sm:mb-4">
                    <div>
                      <h3 className={`${isXSmall ? 'text-xs' : 'text-sm'} font-semibold`}>Performance</h3>
                      <p className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Trading performance</p>
                    </div>
                    <span className="text-success text-xs font-medium bg-success/10 px-2 py-1 rounded-full">
                      +19%
                    </span>
                  </div>
                  
                  <div className={`w-full ${isXSmall ? 'h-[120px]' : 'h-[150px] sm:h-[200px]'} my-0 py-[10px] sm:py-[20px] flex items-center justify-center`}>
                    {mounted && <PerformanceChart data={chartData} />}
                  </div>
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  <Card className="col-span-1 bg-card/30 backdrop-blur-sm border border-primary/5 p-2 sm:p-3 md:p-4 hover:border-primary/20 transition-all duration-300 my-0 py-[20px]">
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2.5">
                      <h4 className={`${isXSmall ? 'text-xs' : 'text-sm'} font-medium flex items-center gap-1 sm:gap-2`}>
                        <Bot className={`${isXSmall ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
                        Win/Loss Ratio
                      </h4>
                    </div>
                    
                    <div className={`relative ${isXSmall ? 'h-[110px]' : 'h-[130px] sm:h-[140px]'} flex items-center justify-center`}>
                      <WinRateDonutChart data={{
                      winRate: 76,
                      lossRate: 24
                    }} size={isMobile ? "small" : "medium"} />
                    </div>
                  </Card>

                  <Card className="col-span-2 bg-card/30 backdrop-blur-sm border border-primary/5 p-2 sm:p-3 md:p-4 hover:border-primary/20 transition-all duration-300">
                    <h4 className={`${isXSmall ? 'text-xs' : 'text-sm'} font-medium mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2`}>
                      <TrendingUp className={`${isXSmall ? 'h-3 w-3' : 'h-4 w-4'} text-primary`} />
                      Recent Trades
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      {[{
                      symbol: "HDFC",
                      type: "long",
                      profit: "₹12,635"
                    }, {
                      symbol: "TCS",
                      type: "short",
                      profit: "₹8,777"
                    }, {
                      symbol: "INFY",
                      type: "long",
                      profit: "₹9,952"
                    }].map((trade, index) => <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <div className={`${isXSmall ? 'w-6 h-6' : 'w-7 h-7 sm:w-8 sm:h-8'} rounded-full bg-success/20 flex items-center justify-center`}>
                              <TrendingUp className={`${isXSmall ? 'h-3 w-3' : 'h-3 w-3 sm:h-4 sm:w-4'} text-success`} />
                            </div>
                            <div>
                              <p className={`${isXSmall ? 'text-xs' : 'text-xs sm:text-sm'} font-medium`}>{trade.symbol}</p>
                              <span className={`${isXSmall ? 'text-[10px] px-1' : 'text-xs px-1.5'} py-0.5 rounded-full bg-success/10 text-success border border-success/20`}>
                                {trade.type}
                              </span>
                            </div>
                          </div>
                          <span className={`${isXSmall ? 'text-xs' : 'text-xs sm:text-sm'} text-success font-medium`}>+{trade.profit}</span>
                        </div>)}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1, delay: 1 }}
        className="mt-6 sm:mt-8 md:mt-12 pt-4 sm:pt-6 border-t border-border/20 lg:hidden"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-md mx-auto px-4">
          <div className="text-center">
            <h4 className={`${isXSmall ? 'text-base' : 'text-lg sm:text-xl'} font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent`}>15K+</h4>
            <p className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Active Users</p>
          </div>
          <div className="text-center">
            <h4 className={`${isXSmall ? 'text-base' : 'text-lg sm:text-xl'} font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent`}>98%</h4>
            <p className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Satisfaction</p>
          </div>
          <div className="text-center">
            <h4 className={`${isXSmall ? 'text-base' : 'text-lg sm:text-xl'} font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent`}>24/7</h4>
            <p className={`${isXSmall ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>Support</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
