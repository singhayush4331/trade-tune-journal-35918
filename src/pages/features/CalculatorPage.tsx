
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calculator } from 'lucide-react';
import FeatureLayout from '@/components/layout/FeatureLayout';
import PositionSizingCalculator from '@/components/dashboard/PositionSizingCalculator';
import { useIsMobile } from '@/hooks/use-mobile';

const CalculatorPage = () => {
  const isMobile = useIsMobile();
  
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

  return (
    <FeatureLayout title="Position Sizing Calculator">
      <Helmet>
        <title>Position Sizing Calculator | Wiggly Trading Journal</title>
        <meta 
          name="description" 
          content="Calculate optimal position sizes based on your risk tolerance. Make informed decisions about your trade volumes with Wiggly's powerful position sizing calculator." 
        />
        <meta 
          name="keywords" 
          content="position sizing calculator, risk management, trading calculator, position size, risk per trade, stop loss calculator" 
        />
      </Helmet>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6"
            >
              <Calculator className="mr-2 h-4 w-4" />
              Risk Management
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }}
              className={`font-bold bg-gradient-to-r from-primary via-amber-500 to-orange-500 bg-clip-text text-transparent mb-6 ${isMobile ? "text-3xl sm:text-4xl" : "text-5xl sm:text-6xl"}`}
            >
              Position Sizing Calculator
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }}
              className={`text-muted-foreground leading-relaxed mb-8 ${isMobile ? "text-base" : "text-xl"}`}
            >
              Calculate the perfect position size for each trade based on your account balance, risk tolerance, and stop loss level. Protect your capital and optimize your risk management.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Calculator Demo Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-background/80 to-muted/20 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <h2 className={`${isMobile ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"} font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent`}>
                  Perfect Your <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Risk Management</span>
                </h2>
                <p className={`${isMobile ? "text-base" : "text-lg"} text-muted-foreground leading-relaxed`}>
                  Set your risk percentage and stop loss levels to get precise position sizes that protect your trading capital and ensure consistency in your risk management approach.
                </p>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <motion.div variants={itemVariants} className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <h3 className="font-semibold mb-2 text-primary">Account Protection</h3>
                  <p className={`${isMobile ? "text-sm" : "text-base"} text-muted-foreground`}>
                    Set risk percentages to ensure no single trade can significantly damage your account
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <h3 className="font-semibold mb-2 text-primary">Stop Loss Integration</h3>
                  <p className={`${isMobile ? "text-sm" : "text-base"} text-muted-foreground`}>
                    Calculate positions based on your predetermined stop loss levels
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <h3 className="font-semibold mb-2 text-primary">Risk-Reward Analysis</h3>
                  <p className={`${isMobile ? "text-sm" : "text-base"} text-muted-foreground`}>
                    See potential profit versus maximum loss for each trade setup
                  </p>
                </motion.div>
                
                <motion.div variants={itemVariants} className="p-4 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300">
                  <h3 className="font-semibold mb-2 text-primary">Long & Short Support</h3>
                  <p className={`${isMobile ? "text-sm" : "text-base"} text-muted-foreground`}>
                    Calculate positions for both long and short trading strategies
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 shadow-xl p-6"
            >
              <PositionSizingCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7 }} 
              viewport={{ once: true }}
              className={`font-bold mb-6 ${isMobile ? "text-2xl" : "text-3xl"}`}
            >
              Ready to Trade with Confidence?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.1 }} 
              viewport={{ once: true }}
              className="text-muted-foreground mb-8"
            >
              Start using all of Wiggly's powerful trading tools, including the Position Sizing Calculator.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.7, delay: 0.2 }} 
              viewport={{ once: true }}
            >
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default CalculatorPage;
