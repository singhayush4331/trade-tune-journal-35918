import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  ScanLine, 
  Upload, 
  Brain, 
  CheckCircle, 
  Clock,
  Smartphone,
  Camera,
  Database,
  ArrowRight,
  Monitor,
  Shield,
  Zap,
  Target,
  ChevronRight,
  Star,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import FeatureLayout from '@/components/layout/FeatureLayout';

const SmartTradeImportPage = () => {
  const [activeDemo, setActiveDemo] = useState(0);

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <FeatureLayout title="Smart Trade Import">
      <Helmet>
        <title>Smart Trade Import | From Screenshots to Trades in Seconds | Wiggly</title>
        <meta name="description" content="Upload your broker screenshots and let AI instantly extract all trades. Works with Zerodha, Upstox, Angel One, and all major Indian brokers. 95%+ accuracy, instant import." />
        <meta name="keywords" content="trade import, AI trade extraction, broker screenshot, automated trading, Zerodha import, Upstox import, Angel One import" />
      </Helmet>
      
      {/* Hero Section */}
      <motion.section 
        className="py-16 md:py-28 px-4 bg-gradient-to-b from-background via-background/80 to-background/50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute top-40 -right-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 -left-64 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <motion.div 
              className="md:w-1/2 space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="space-y-5">
                <motion.div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm shadow-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <ScanLine className="h-3.5 w-3.5" />
                  <span>AI-Powered Trade Import</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                  From <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Screenshot</span> to Trades in Seconds
                </h1>
                
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  Stop wasting hours on manual trade entry. Upload your broker's order book screenshot 
                  and watch our AI instantly extract every trade with 95%+ accuracy.
                </motion.p>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.span 
                  className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <Clock className="mr-1.5 h-4 w-4" />
                  Instant Import
                </motion.span>
                <motion.span 
                  className="inline-flex items-center rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1.5 text-sm font-medium text-green-500 shadow-sm backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  95%+ Accuracy
                </motion.span>
                <motion.span 
                  className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-500 shadow-sm backdrop-blur-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <Smartphone className="mr-1.5 h-4 w-4" />
                  All Major Brokers
                </motion.span>
              </div>
              
              <motion.div 
                className="pt-6 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group shadow-lg shadow-primary/10">
                  <Link to="/signup">
                    Start Importing Now
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary backdrop-blur-sm">
                  <Link to="/trade-form">
                    Try Demo Upload
                    <Upload className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Demo Interface */}
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/15 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gradient-to-br from-card/90 via-card/85 to-card/80 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
                  <div className="p-6 border-b bg-background/80 backdrop-blur-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
                        <ScanLine className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Smart Trade Scanner</h3>
                        <div className="flex items-center text-xs text-primary/90">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                          <span>AI Processing Engine Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {/* Upload area */}
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-6 text-center bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors">
                      <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                      <p className="text-sm font-medium text-primary mb-1">Drop your order book screenshot here</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB • Supports all brokers</p>
                    </div>
                    
                    {/* Processing steps */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <Camera className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Screenshot Uploaded</span>
                        <Badge className="ml-auto bg-green-100 text-green-700">✓ Complete</Badge>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">AI Analysis in Progress</span>
                        <div className="ml-auto w-16">
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Trades Imported</span>
                        <Badge variant="outline" className="ml-auto">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section 
        className="py-20 px-4 bg-background/50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-clip-text text-transparent"
              variants={staggerItem}
            >
              How Smart Import Works
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={staggerItem}
            >
              Three simple steps to transform your screenshots into organized trade data
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            {[
              {
                step: "01",
                icon: Upload,
                title: "Upload Screenshot",
                description: "Drag and drop your broker's order book or trade history screenshot. We support all major formats and brokers.",
                color: "primary"
              },
              {
                step: "02", 
                icon: Brain,
                title: "AI Analysis",
                description: "Our advanced AI scans your image, identifies trades, and extracts all relevant data with 95%+ accuracy.",
                color: "blue-500"
              },
              {
                step: "03",
                icon: Database,
                title: "Instant Import",
                description: "Review and confirm the extracted trades, then import them directly into your trading journal.",
                color: "green-500"
              }
            ].map((item, index) => (
              <motion.div key={index} variants={staggerItem}>
                <Card className="relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="relative">
                      <div className={`h-16 w-16 bg-${item.color}/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform`}>
                        <item.icon className={`h-8 w-8 text-${item.color}`} />
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="outline" className="text-xs font-bold">
                          {item.step}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Supported Brokers Section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-background/50 to-background"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              variants={staggerItem}
            >
              Works with All Major Brokers
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              variants={staggerItem}
            >
              Upload screenshots from any Indian broker platform and our AI will intelligently extract your trade data
            </motion.p>
          </div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            variants={staggerContainer}
          >
            {[
              "Zerodha", "Upstox", "Angel One", "ICICI Direct", 
              "HDFC Securities", "Groww", "5Paisa", "Motilal Oswal",
              "Sharekhan", "Kotak Securities", "Axis Direct", "Alice Blue"
            ].map((broker, index) => (
              <motion.div 
                key={index}
                variants={staggerItem}
                className="bg-card/60 backdrop-blur-sm border border-border/40 rounded-lg p-4 text-center hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Monitor className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-sm">{broker}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Benefits Section */}
      <motion.section 
        className="py-20 px-4 bg-background/50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={staggerItem}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose Smart Import?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the fastest and most accurate way to digitize your trading data. 
                Save hours of manual work and reduce errors with our AI-powered solution.
              </p>
              
              <div className="space-y-6">
                {[
                  {
                    icon: Zap,
                    title: "Lightning Fast",
                    description: "Import hundreds of trades in seconds, not hours",
                    color: "yellow-500"
                  },
                  {
                    icon: Target,
                    title: "Precision Accuracy",
                    description: "95%+ accuracy rate with advanced AI recognition",
                    color: "green-500"
                  },
                  {
                    icon: Shield,
                    title: "Secure Processing",
                    description: "Your screenshots are processed securely and never stored",
                    color: "blue-500"
                  }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-4"
                    variants={staggerItem}
                  >
                    <div className={`h-12 w-12 bg-${benefit.color}/10 rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <benefit.icon className={`h-6 w-6 text-${benefit.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div 
              variants={staggerItem}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl blur-xl"></div>
              <Card className="relative bg-card/60 backdrop-blur-sm border border-border/40">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Success Rate</h3>
                        <p className="text-2xl font-bold text-green-500">95.7%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Average Processing Time</h3>
                        <p className="text-2xl font-bold text-blue-500">3.2s</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Database className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">Trades Processed</h3>
                        <p className="text-2xl font-bold text-purple-500">2.1M+</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-background to-background/50"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div variants={staggerItem}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Trade Import?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of traders who've already saved hundreds of hours with Smart Trade Import. 
              Start uploading your screenshots today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                <Link to="/trade-form">
                  Try Demo Upload
                  <Upload className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>50,000+ traders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free to try</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </FeatureLayout>
  );
};

export default SmartTradeImportPage;