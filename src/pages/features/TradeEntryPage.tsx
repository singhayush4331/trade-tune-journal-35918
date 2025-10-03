
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  FileText, ArrowRight, Clock, BarChart3, TrendingUp, 
  PieChart, Image, AlertCircle, Smile, Calendar, Ratio, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeatureLayout from '@/components/layout/FeatureLayout';
import { cn } from '@/lib/utils';
import { stockNames } from '@/utils/stockNames';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

// Custom pill component for better reuse
const FeaturePill = ({ icon: Icon, text, className }) => (
  <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-sm font-medium", className)}>
    <Icon className="mr-1 h-4 w-4" />
    {text}
  </span>
);

const TradeEntryPage = () => {
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  return (
    <FeatureLayout title="Trade Recording | Wiggly">
      <Helmet>
        <title>Trade Recording | Wiggly</title>
        <meta name="description" content="Document every aspect of your trades with our comprehensive trade recording system tailored for the Indian market. Track emotions, strategies, screenshots, and more." />
        <meta name="keywords" content="trade journal, trade recording, trading documentation, trade tracking, NSE, BSE, Indian market" />
      </Helmet>
      
      {/* Hero Section with Indian market focus */}
      <motion.section 
        className="py-16 md:py-24 px-4 bg-gradient-to-b from-background via-background/80 to-background relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <motion.div 
              className="md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Trade Recording
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground">
                Capture every detail of your NSE & BSE trades with our comprehensive recording system. Track entry and exit points, emotions, strategies, time patterns, and attach screenshots to build a complete trading history.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <FeaturePill 
                  icon={Calendar} 
                  text="Trade Journal" 
                  className="bg-primary/10 text-primary"
                />
                <FeaturePill 
                  icon={TrendingUp} 
                  text="Indian Markets" 
                  className="bg-blue-500/10 text-blue-500"
                />
                <FeaturePill 
                  icon={Smile} 
                  text="Emotion Tracking" 
                  className="bg-purple-500/10 text-purple-500"
                />
              </div>
              
              <div className="pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                  <Link to="/signup">
                    Start Recording Trades
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Improved trade recording card with better mobile responsiveness */}
              <div className="bg-gradient-to-br from-card/90 via-card/80 to-background/90 border border-primary/10 rounded-xl p-4 sm:p-6 shadow-xl">
                <div className="space-y-5">
                  <h3 className="font-semibold text-lg sm:text-xl mb-2">Record Your Trade</h3>
                  
                  <div className="space-y-5">
                    {/* Symbol and Date - Stack on extra small screens */}
                    <div className={`grid ${isXSmall ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-3'}`}>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Symbol</label>
                        <div className="h-11 bg-background/50 rounded-md border border-input/50 flex items-center px-3 shadow-sm">
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-base">RELIANCE</span>
                            <span className="text-xs text-muted-foreground">NSE</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Trade Date</label>
                        <div className="h-11 bg-background/50 rounded-md border border-input/50 flex items-center px-3 gap-2 shadow-sm">
                          <Calendar className="h-4 w-4 text-primary/70" />
                          <span>Today</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Trade Type and Market Segment - Stack on extra small screens */}
                    <div className={`grid ${isXSmall ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-3'}`}>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">Trade Type</label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="h-11 bg-green-600/20 border border-green-600/30 rounded-md flex items-center justify-center text-green-600 font-medium shadow-sm">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Long
                          </div>
                          <div className="h-11 bg-background/50 border border-input/30 rounded-md flex items-center justify-center text-muted-foreground shadow-sm">
                            Short
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground block">Market Segment</label>
                        <div className="h-11 bg-background/50 rounded-md border border-input/50 flex items-center px-3 shadow-sm">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-primary/90">Equity Intraday</span>
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Entry, Exit, Quantity - Stack vertically on mobile */}
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-muted-foreground block">Trade Details</label>
                      <div className={`grid ${isXSmall ? 'grid-cols-1 gap-3' : 'grid-cols-3 gap-2'}`}>
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Entry Price</label>
                          <div className="h-10 bg-background/50 rounded-md border border-input/50 flex items-center px-3 shadow-sm">
                            <span className="font-medium">₹2,458.75</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Exit Price</label>
                          <div className="h-10 bg-background/50 rounded-md border border-input/50 flex items-center px-3 shadow-sm">
                            <span className="font-medium">₹2,482.25</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-xs text-muted-foreground">Quantity</label>
                          <div className="h-10 bg-background/50 rounded-md border border-input/50 flex items-center px-3 shadow-sm">
                            <span className="font-medium">10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  
                    {/* Highlight the P&L section for better visibility */}
                    <div className="flex items-center justify-between py-3 px-4 bg-green-600/10 border border-green-600/20 rounded-md shadow-sm">
                      <span className="text-sm font-medium">Profit/Loss</span>
                      <span className="text-green-600 font-bold text-lg">+₹235.00</span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex flex-wrap justify-between gap-2">
                      <span className="px-2 py-1 bg-background/50 rounded-md">Brokerage: ₹18.35</span>
                      <span className="px-2 py-1 bg-background/50 rounded-md">STT: ₹12.40</span>
                      <span className="px-2 py-1 bg-background/50 rounded-md font-medium">Net P&L: ₹204.25</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Indian Stock Search Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-background/95 relative">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 items-center">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center lg:text-left bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Indian Stock Search
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Quickly find and record trades for popular Indian stocks and indices on NSE and BSE. Our intelligent search helps you locate the right symbol instantly.
              </p>
              
              <div className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-md">
                <div className="relative mb-4">
                  <input 
                    type="text" 
                    className="w-full h-10 rounded-md border border-input/50 bg-background/50 px-3 pl-9"
                    placeholder="Search for NSE/BSE stocks..."
                    defaultValue="REL"
                  />
                  <div className="absolute left-2.5 top-2.5">
                    <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                
                <ul className="space-y-1 max-h-[250px] overflow-y-auto pr-1">
                  {stockNames.slice(0, 6).map((stock, i) => (
                    <motion.li
                      key={stock.symbol}
                      className={`flex items-center justify-between py-2 px-3 rounded-md hover:bg-primary/5 cursor-pointer ${i === 0 ? 'bg-primary/10' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i, duration: 0.3 }}
                    >
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-muted-foreground">{stock.name}</div>
                      </div>
                      <div className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded">
                        {stock.type}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
            
            <motion.div
              className="lg:w-1/2 space-y-4"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="rounded-2xl overflow-hidden border border-border/50 shadow-lg">
                <div className="bg-card/90 p-4 border-b border-border/30">
                  <h3 className="font-medium">Popular NSE & BSE Instruments</h3>
                </div>
                <div className="bg-background/50 p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-md p-3 flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold text-primary">NIFTY50</div>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.64%
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-md p-3 flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold text-primary">BANKNIFTY</div>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.32%
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-md p-3 flex flex-col items-center justify-center">
                      <div className="text-xl font-semibold text-primary">SENSEX</div>
                      <div className="text-xs text-green-500 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.58%
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold">R</span>
                        </div>
                        <div>
                          <div className="font-medium">RELIANCE</div>
                          <div className="text-xs text-muted-foreground">Reliance Industries</div>
                        </div>
                      </div>
                      <div className="text-green-500 font-medium">₹2,482</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold">H</span>
                        </div>
                        <div>
                          <div className="font-medium">HDFCBANK</div>
                          <div className="text-xs text-muted-foreground">HDFC Bank</div>
                        </div>
                      </div>
                      <div className="text-red-500 font-medium">₹1,632</div>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-border/30">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-semibold">T</span>
                        </div>
                        <div>
                          <div className="font-medium">TCS</div>
                          <div className="text-xs text-muted-foreground">Tata Consultancy Services</div>
                        </div>
                      </div>
                      <div className="text-green-500 font-medium">₹3,856</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Key Features Section with Indian context */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/95 to-background/90">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Comprehensive Trade Documentation
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Capture every detail of your trades to gain deeper insights into your performance on Indian markets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Card 1 */}
            <motion.div 
              className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Indian Markets</h3>
              <p className="text-muted-foreground mb-4">
                Support for NSE and BSE with automatic brokerage calculation for equity, F&O, and commodity markets.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                  NSE & BSE stock tracking
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                  Automatic STT & brokerage
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                  F&O segment support
                </li>
              </ul>
            </motion.div>
            
            {/* Feature Card 2 */}
            <motion.div 
              className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Time Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Track your performance across different market sessions (pre-open, normal, post-close) to find your edge.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Morning/Afternoon analysis
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Entry/exit time tracking
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-2"></span>
                  Market session performance
                </li>
              </ul>
            </motion.div>
            
            {/* Feature Card 3 */}
            <motion.div 
              className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <PieChart className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Strategy Tagging</h3>
              <p className="text-muted-foreground mb-4">
                Tag trades with popular Indian trading strategies like Gap & Go, VWAP breakout, and more.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Custom strategy creation
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Performance by strategy
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  Strategy refinement insights
                </li>
              </ul>
            </motion.div>
            
            {/* Feature Card 4 */}
            <motion.div 
              className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <Ratio className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Risk/Reward Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Calculate and track your risk-to-reward ratios to improve discipline and consistency in the volatile Indian markets.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                  Risk:reward ratio input
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                  Stop-loss management
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2"></span>
                  Position sizing calculator
                </li>
              </ul>
            </motion.div>
            
            {/* Feature Card 5 */}
            <motion.div 
              className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-amber-500/10 flex items-center justify-center mb-4">
                <Smile className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emotion Tracking</h3>
              <p className="text-muted-foreground mb-4">
                Record your emotional state during trades to understand how feelings influence your decisions in fast-moving Indian markets.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                  Mood selection for trades
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                  Emotional pattern analysis
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2"></span>
                  Trading psychology insights
                </li>
              </ul>
            </motion.div>
            
            {/* Feature Card 6 */}
            <motion.div 
              className="bg-card/80 border border-border/50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="h-12 w-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                <Image className="h-6 w-6 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Screenshot Capture</h3>
              <p className="text-muted-foreground mb-4">
                Upload charts from TradingView, Zerodha, Angel Broking, and other popular Indian platforms to document your setups.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                  Entry/exit visuals
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                  Chart pattern documentation
                </li>
                <li className="flex items-center text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></span>
                  Visual trading journal
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Emotion Tracking Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/90 to-background/85 relative">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-amber-600/5 p-1 rounded-2xl">
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Smile className="mr-2 h-5 w-5 text-amber-500" />
                    <span>Emotional Impact Tracking</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2">
                      <div className="aspect-square bg-background/60 rounded-lg flex flex-col items-center justify-center p-2 border border-amber-500/30">
                        <div className="text-2xl mb-1">😌</div>
                        <div className="text-xs text-center">Calm</div>
                      </div>
                      <div className="aspect-square bg-background/60 rounded-lg flex flex-col items-center justify-center p-2 border border-primary/30">
                        <div className="text-2xl mb-1">😊</div>
                        <div className="text-xs text-center">Focused</div>
                      </div>
                      <div className="aspect-square bg-background/60 rounded-lg flex flex-col items-center justify-center p-2 border border-amber-500/30">
                        <div className="text-2xl mb-1">😬</div>
                        <div className="text-xs text-center">Anxious</div>
                      </div>
                      <div className="aspect-square bg-background/60 rounded-lg flex flex-col items-center justify-center p-2 border border-red-500/30">
                        <div className="text-2xl mb-1">😠</div>
                        <div className="text-xs text-center">Frustrated</div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 p-4 rounded-lg border border-green-500/20">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-sm">Emotional Pattern Discovered</h4>
                        <span className="text-xs bg-green-600/20 text-green-500 px-2 py-0.5 rounded">Insight</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Your calm trades during morning sessions have a 78% higher success rate than trades made during high-volatility market hours.
                      </p>
                    </div>
                    
                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <div className="flex justify-between mb-2">
                        <h4 className="text-sm font-medium">Trade Success by Emotion</h4>
                        <span className="text-xs text-muted-foreground">Last 30 days</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Calm</span>
                            <span className="text-green-500">87%</span>
                          </div>
                          <div className="h-2 bg-background rounded-full">
                            <div className="h-2 bg-green-500 rounded-full" style={{width: '87%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Focused</span>
                            <span className="text-green-500">72%</span>
                          </div>
                          <div className="h-2 bg-background rounded-full">
                            <div className="h-2 bg-primary rounded-full" style={{width: '72%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Anxious</span>
                            <span className="text-amber-500">45%</span>
                          </div>
                          <div className="h-2 bg-background rounded-full">
                            <div className="h-2 bg-amber-500 rounded-full" style={{width: '45%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span>Frustrated</span>
                            <span className="text-red-500">23%</span>
                          </div>
                          <div className="h-2 bg-background rounded-full">
                            <div className="h-2 bg-red-500 rounded-full" style={{width: '23%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Mastering Trading Psychology
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                Our emotion tracking feature helps identify how different emotional states impact your trading in the fast-paced Indian markets.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Handle Market Volatility</h4>
                    <p className="text-sm text-muted-foreground">
                      Identify how your emotions respond to high-volatility events like RBI announcements, quarterly results, or global market movements.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Track Success Patterns</h4>
                    <p className="text-sm text-muted-foreground">
                      See which emotional states lead to your most profitable trades in different market segments - Equity, F&O, Commodities or Currency.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Improve Trading Psychology</h4>
                    <p className="text-sm text-muted-foreground">
                      Develop greater self-awareness and emotional discipline to thrive in the highly emotional world of Indian stock markets.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">
                  <Link to="/signup">
                    Start Tracking Your Emotions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Screenshot Feature Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/85 to-background/80">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gradient-to-br from-blue-400/20 via-blue-500/10 to-blue-600/5 p-1 rounded-2xl">
                <div className="bg-card/80 backdrop-blur-sm rounded-xl overflow-hidden border border-blue-500/20">
                  <div className="p-4 border-b border-border/50">
                    <h4 className="font-medium flex items-center">
                      <Image className="mr-2 h-5 w-5 text-blue-500" />
                      Trade Screenshots
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4">
                    <div>
                      <div className="aspect-video bg-background/60 rounded-md overflow-hidden border border-blue-500/20 mb-2">
                        <div className="h-full w-full bg-gradient-to-br from-blue-800/30 to-blue-900/30 flex items-center justify-center">
                          <Image className="h-8 w-8 text-blue-400/50" />
                        </div>
                      </div>
                      <div className="text-xs text-center text-muted-foreground">Entry Screenshot</div>
                    </div>
                    
                    <div>
                      <div className="aspect-video bg-background/60 rounded-md overflow-hidden border border-blue-500/20 mb-2">
                        <div className="h-full w-full bg-gradient-to-br from-blue-800/30 to-blue-900/30 flex items-center justify-center">
                          <Image className="h-8 w-8 text-blue-400/50" />
                        </div>
                      </div>
                      <div className="text-xs text-center text-muted-foreground">Exit Screenshot</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-background/50 border-t border-border/50">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm flex items-center">
                        <FileText className="mr-1 h-4 w-4 text-muted-foreground" />
                        Notes
                      </h4>
                      <span className="text-xs bg-blue-600/20 text-blue-500 px-2 py-0.5 rounded">Important</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      RELIANCE breakout from consolidation with increasing volume. Followed the VWAP strategy and exited at resistance after RIL announced positive quarterly results.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Visual Trade Documentation
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                Upload entry and exit screenshots from popular Indian trading platforms to create a visual record of your trades for better analysis.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Image className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Compatible with Indian Platforms</h4>
                    <p className="text-sm text-muted-foreground">
                      Easily upload screenshots from Zerodha Kite, Upstox, Angel One, ICICI Direct, and other popular Indian trading platforms.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Detailed Trade Notes</h4>
                    <p className="text-sm text-muted-foreground">
                      Add context to your trades with notes about market events like budget announcements, RBI decisions, or corporate actions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Visual Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Build a visual library of successful trade setups in Indian markets to improve pattern recognition and decision making.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                  <Link to="/signup">
                    Start Your Visual Journal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background/80 to-background">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <motion.div 
          className="container max-w-4xl mx-auto px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent leading-tight">
            Ready to Elevate Your Trading Journal?
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Join thousands of Indian traders who are documenting their trades comprehensively and unlocking insights to transform their trading performance.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white px-8 py-6 text-lg h-auto">
              <Link to="/signup">
                Start Recording Trades
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-primary/30 hover:border-primary/60 px-8 py-6 text-lg h-auto">
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </FeatureLayout>
  );
};

export default TradeEntryPage;
