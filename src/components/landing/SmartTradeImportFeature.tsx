import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ScanLine, Upload, Brain, Clock, CheckCircle, Smartphone, ArrowRight, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SmartTradeImportFeature = () => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-background via-background/95 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center justify-center lg:justify-start mb-6">
              <span className="relative inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                <ScanLine className="mr-2 h-4 w-4" />
                Smart Trade Import
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mt-6 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground my-[25px] py-[5px]">
              From Screenshot to <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Trades</span> in Seconds
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Upload your order book screenshot and let our AI instantly extract and import all your trades. Works with all major Indian brokers - no more manual data entry.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
              >
                <Clock className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1 text-primary">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Save hours of manual entry with instant AI extraction</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
              >
                <CheckCircle className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1 text-primary">95%+ Accurate</h3>
                <p className="text-sm text-muted-foreground">Advanced AI ensures precise data extraction</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
              >
                <Smartphone className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1 text-primary">All Brokers</h3>
                <p className="text-sm text-muted-foreground">Zerodha, Upstox, Angel, ICICI, and more</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300"
              >
                <Brain className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-semibold mb-1 text-primary">Smart Analysis</h3>
                <p className="text-sm text-muted-foreground">Automatically calculates P&L and trade metrics</p>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Try Smart Import
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                <Link to="/trade-form" className="flex items-center gap-2">
                  Start Importing
                  <ScanLine className="h-4 w-4 text-primary" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                <Link to="/features/smart-trade-import" className="flex items-center gap-2">
                  Learn More
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right demo interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl opacity-30 blur-xl animate-pulse"></div>
            <div className="relative rounded-xl border border-primary/10 bg-card/60 backdrop-blur-md shadow-2xl overflow-hidden">
              <div className="p-6 border-b bg-background/80 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                    <ScanLine className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-lg">Order Book Scanner</h3>
                </div>
                <p className="text-sm text-muted-foreground">Upload your broker's order book screenshot</p>
              </div>

              {/* Upload area */}
              <div className="p-6 bg-background/50">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-colors cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-sm font-medium text-primary mb-1">Drop your screenshot here</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </motion.div>

                {/* Processing steps */}
                <div className="mt-6 space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20"
                  >
                    <Camera className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">1. Upload Screenshot</span>
                    <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">Ready</Badge>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <Brain className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">2. AI Analysis</span>
                    <Badge variant="outline" className="ml-auto">Waiting</Badge>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">3. Import Trades</span>
                    <Badge variant="outline" className="ml-auto">Waiting</Badge>
                  </motion.div>
                </div>

                {/* Supported brokers */}
                <div className="mt-6 p-4 bg-card/50 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Supported Brokers:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Zerodha', 'Upstox', 'Angel One', 'ICICI Direct', 'HDFC Securities', 'Groww'].map((broker, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-background">
                        {broker}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SmartTradeImportFeature;