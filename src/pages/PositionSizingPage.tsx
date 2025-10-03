
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PositionSizingCalculator from '@/components/dashboard/PositionSizingCalculator';
import { motion } from 'framer-motion';
import { Calculator } from 'lucide-react';

const PositionSizingPage = () => {
  return <AppLayout>
      <div className="space-y-6">
        <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.3
      }} className="bg-gradient-to-r from-purple-600/10 to-purple/10 p-6 rounded-lg border border-purple-600/20 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-600/20">
              <Calculator className="h-5 w-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">Position Sizing</h1>
          </div>
          <p className="text-sm text-muted-foreground max-w-3xl">
            Calculate your optimal position size based on your risk tolerance and account size. 
            Proper position sizing is one of the most crucial aspects of risk management and can 
            significantly improve your trading consistency.
          </p>
        </motion.div>
        
        <PositionSizingCalculator />
        
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.5,
        delay: 0.6
      }} className="text-sm text-muted-foreground text-center mt-8 pt-4 border-t border-border">
          
        </motion.div>
      </div>
    </AppLayout>;
};
export default PositionSizingPage;
