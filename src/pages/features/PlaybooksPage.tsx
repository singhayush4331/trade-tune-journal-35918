
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  BookOpen, ArrowRight, CheckCircle, Layers, FileText, 
  Target, BarChart3, ChevronRight, PlusCircle, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeatureLayout from '@/components/layout/FeatureLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const PlaybooksPage = () => {
  return (
    <FeatureLayout title="Trading Playbooks">
      <Helmet>
        <title>Trading Playbooks | Wiggly</title>
        <meta name="description" content="Create and follow structured trading strategies with custom playbooks. Build, share, and execute your trading plans with precision." />
        <meta name="keywords" content="trading playbooks, trading strategies, trading plan, trade execution" />
      </Helmet>
      
      {/* Hero Section */}
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
        
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <motion.div 
              className="md:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Trading Playbooks
                </h1>
              </div>
              
              <p className="text-lg text-muted-foreground">
                Create structured trading plans that you can follow consistently. Build, save, and execute your strategies with precision using custom playbooks.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Strategy Templates
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
                  <Layers className="mr-1 h-4 w-4" />
                  Custom Checklists
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500">
                  <FileText className="mr-1 h-4 w-4" />
                  Performance Tracking
                </span>
              </div>
              
              <div className="pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                  <Link to="/signup">
                    Create Your Playbook
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
              <div className="bg-gradient-to-br from-card/90 via-card/80 to-background/90 border border-primary/10 rounded-xl p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">Breakout Strategy Playbook</h3>
                    <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">Active</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Setup Criteria</h4>
                      <ul className="space-y-2">
                        {["Stock consolidating in tight range", "Volume decreasing during consolidation", "Support/resistance clearly defined", "Overall market in uptrend"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Entry Rules</h4>
                      <ul className="space-y-2">
                        {["Price breaks above resistance with volume", "Entry on first pullback to broken resistance", "Confirm with technical indicator (RSI > 50)"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Exit Strategy</h4>
                      <ul className="space-y-2">
                        {["Stop loss below breakout candle low", "Take profit at 2:1 risk-reward ratio", "Trail stop after 1.5R move in favor"].map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 text-sm text-muted-foreground">
                    <span>Win Rate: 68%</span>
                    <span>Avg. R:R: 1.8</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Strategy Showcase Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background to-background/90 relative">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Track Strategy <span className="text-primary">Performance</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Monitor how your trading strategies perform over time with detailed analytics and visual reports.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                name: "Fair Value Gap Strategy",
                description: "Trade price returning to fill fair value gaps",
                tags: ["Fair Value Gap", "Supply & Demand", "Technical"],
                winRate: 85,
                trades: "17/20",
                profitable: true
              },
              {
                name: "Order Block Strategy",
                description: "Trade from institutional order blocks and mitigation",
                tags: ["Smart Money", "Order Blocks", "Mitigation"],
                winRate: 62,
                trades: "8/13",
                profitable: true
              },
              {
                name: "Liquidity Grab Strategy",
                description: "Capture momentum after smart money grabs liquidity",
                tags: ["Liquidity", "Stop Hunts", "Reversal"],
                winRate: 42,
                trades: "5/12",
                profitable: false
              }
            ].map((strategy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-full"
              >
                <Card className="h-full group border border-primary/10 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{strategy.name}</h3>
                        <p className="text-sm text-muted-foreground">{strategy.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {strategy.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Win Rate</span>
                          <span className={`text-base font-medium ${strategy.winRate > 60 ? 'text-green-500' : 'text-amber-500'}`}>
                            {strategy.winRate}% ({strategy.trades})
                          </span>
                        </div>
                        <Progress value={strategy.winRate} className="h-2" />
                      </div>
                      
                      <div className={`flex items-center justify-between p-3 rounded-lg ${strategy.profitable ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                        <span className="text-sm">R:R 1:2</span>
                        <span className={`text-sm font-medium ${strategy.profitable ? 'text-green-500' : 'text-red-500'}`}>
                          {strategy.profitable ? 'Profitable' : 'Loss-making'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-primary/10 flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="h-8 px-3 bg-primary/5 hover:bg-primary/10 border-primary/20">
                        <Target className="h-3.5 w-3.5 mr-1.5" />
                        Check
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 px-3">
                        <FileText className="h-3.5 w-3.5 mr-1.5" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Create Playbook Preview Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/90 to-background relative overflow-hidden">
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-64 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div
              className="lg:w-1/2 space-y-6"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                <PlusCircle className="mr-2 h-4 w-4" />
                Easy Strategy Creation
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Create Your Trading <span className="text-primary">Playbooks</span> in Minutes
              </h2>
              
              <p className="text-lg text-muted-foreground">
                Build custom trading strategies with our intuitive interface. Define entry and exit rules, set risk parameters, and track performance—all in one place.
              </p>
              
              <ul className="space-y-3">
                {[
                  "Document your proven strategies", 
                  "Build checklists to follow before each trade", 
                  "Track success rates and performance metrics",
                  "Review and improve your approach over time"
                ].map((item, i) => (
                  <motion.li 
                    key={i} 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  >
                    <div className="h-6 w-6 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              
              <div className="pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                  <Link to="/signup">
                    Start Creating Playbooks
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-gradient-to-br from-card/80 via-card/60 to-background/40 rounded-xl border border-primary/10 shadow-xl p-6 max-w-lg mx-auto">
                <h3 className="text-xl font-bold mb-6">New Trading Playbook</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Strategy Name</Label>
                    <Input
                      id="name"
                      placeholder="MACD Crossover Strategy"
                      className="mt-1.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {["Technical", "Momentum", "Intraday", "+ Add Tag"].map((tag, i) => (
                        <Badge
                          key={i}
                          className={`${
                            i === 3
                              ? "bg-primary/10 text-primary cursor-pointer hover:bg-primary/20"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {tag}
                          {i < 3 && (
                            <span className="ml-1 text-blue-300/70">×</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="riskReward">Risk:Reward</Label>
                      <Input
                        id="riskReward"
                        placeholder="1:2"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeframe">Timeframe</Label>
                      <Input
                        id="timeframe"
                        placeholder="Daily"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Setup & Entry Rules</Label>
                    <div className="mt-1.5 p-3 border border-dashed border-primary/20 rounded-md bg-primary/5">
                      <div className="flex items-start gap-2 mb-3">
                        <div className="p-1 rounded-full bg-primary/10 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm">Wait for MACD histogram to cross zero line</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="p-1 rounded-full bg-primary/10 mt-0.5">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-sm">Confirm with bullish candle pattern</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
                      Create Playbook
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Grid Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/80 to-background/70 relative">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Powerful <span className="text-primary">Features</span> for Traders
            </h2>
            <p className="text-lg text-muted-foreground">
              Enhance your trading approach with our comprehensive playbook tools designed to help you develop and maintain consistent trading strategies.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Strategy Templates",
                description: "Choose from pre-built strategy templates or create custom ones tailored to your trading style.",
                color: "primary"
              },
              {
                icon: CheckCircle,
                title: "Trade Checklists",
                description: "Follow your pre-defined checklist before each trade to maintain discipline and consistency.",
                color: "green-500"
              },
              {
                icon: Target,
                title: "Risk Management",
                description: "Define risk parameters and position sizing rules for each strategy to protect your capital.",
                color: "blue-500"
              },
              {
                icon: Clock,
                title: "Timeframe Analysis",
                description: "Apply strategies across different timeframes and track performance by time period.",
                color: "amber-500"
              },
              {
                icon: BarChart3,
                title: "Performance Tracking",
                description: "Monitor win rates and profitability for each strategy, seeing what works best.",
                color: "purple-500"
              },
              {
                icon: FileText,
                title: "Trade Journals",
                description: "Take notes and journal your thoughts for each strategy execution for future review.",
                color: "indigo-500"
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full border border-primary/10 hover:border-primary/30 bg-card/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`p-3 mb-4 rounded-full bg-${feature.color}/10 w-12 h-12 flex items-center justify-center`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/70 to-background/80 relative">
        <div className="container max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              What Our <span className="text-primary">Traders</span> Say
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "Trading playbooks have completely transformed my approach to the markets. My win rate improved from 40% to 68% after implementing structured strategies.",
                name: "Rajesh K.",
                role: "Day Trader",
                imgSrc: ""
              },
              {
                quote: "The ability to create checklists for my entries and exits has eliminated my impulsive trades. The performance tracking is invaluable for refining my approach.",
                name: "Sara T.",
                role: "Swing Trader",
                imgSrc: ""
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
              >
                <Card className="h-full border border-primary/10 hover:border-primary/20 bg-card/50 backdrop-blur-sm transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
                      </div>
                      
                      <div className="flex items-center mt-auto pt-4">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-primary/10 to-purple-500/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="container max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent">
              Start Trading With Confidence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Create your personalized trading playbooks today and transform your trading results with structured strategies.
            </p>
            <div className="pt-6">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Create Your First Playbook
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default PlaybooksPage;
