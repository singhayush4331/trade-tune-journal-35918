
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, IndianRupee, BadgeIndianRupee } from 'lucide-react';
import { OnboardingData } from '@/pages/OnboardingPage';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface FundingStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const FundingStep: React.FC<FundingStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const presetAmounts = [5000, 10000, 25000, 50000, 100000];

  const handleSliderChange = (value: number[]) => {
    updateData({ initialFund: value[0] });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
    updateData({ initialFund: value });
  };

  const handlePresetClick = (amount: number) => {
    updateData({ initialFund: amount });
  };

  return (
    <div className="flex-grow flex flex-col">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-20 h-20 bg-gradient-to-br from-green-500/30 via-primary/20 to-blue-500/30 rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-lg"
      >
        <div className="w-14 h-14 backdrop-blur-sm bg-background/50 rounded-xl flex items-center justify-center">
          <BadgeIndianRupee className="h-8 w-8 text-primary" />
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-muted-foreground text-center mb-8 max-w-lg mx-auto"
      >
        What's your starting trading capital? This helps us recommend appropriate position sizes and risk management.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-primary/5 via-blue-500/5 to-green-500/5 border border-primary/10 rounded-xl p-6 mb-8 shadow-lg shadow-primary/5"
      >
        <div className="flex flex-col items-center justify-center mb-6">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.3
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20 flex items-center justify-center mb-3"
          >
            <IndianRupee className="h-8 w-8 text-primary" />
          </motion.div>
          <motion.h3 
            key={data.initialFund} // This forces re-animation when amount changes
            initial={{ scale: 0.8, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            className="text-3xl font-bold bg-gradient-to-r from-primary via-green-500 to-blue-500 bg-clip-text text-transparent"
          >
            {formatCurrency(data.initialFund)}
          </motion.h3>
        </div>
        
        <div className="mb-8">
          <div className="relative pt-1 mb-6">
            <Slider 
              defaultValue={[data.initialFund]} 
              max={500000} 
              min={1000} 
              step={1000} 
              value={[data.initialFund]}
              onValueChange={handleSliderChange}
              className="mb-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹1,000</span>
              <span>₹250,000</span>
              <span>₹500,000</span>
            </div>
            <div className="absolute -bottom-3 left-0 w-full flex justify-between px-2">
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <div className="h-1 w-1 rounded-full bg-primary"></div>
              <div className="h-1 w-1 rounded-full bg-primary"></div>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <label className="text-sm font-medium mb-2 block">Or enter a specific amount:</label>
          <Input
            type="text"
            value={formatCurrency(data.initialFund)}
            onChange={handleInputChange}
            className="bg-card/50 backdrop-blur-sm border-primary/10 focus:border-primary/30 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        
        <div>
          <div className="text-sm font-medium mb-2">Quick select:</div>
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map(amount => (
              <Button
                key={amount}
                type="button"
                variant={data.initialFund === amount ? "default" : "outline"}
                size="sm"
                onClick={() => handlePresetClick(amount)}
                className={`transition-all duration-300 ${
                  data.initialFund === amount 
                    ? "bg-gradient-to-r from-primary to-blue-500 text-white" 
                    : "hover:bg-primary/10 border-primary/20"
                }`}
              >
                {formatCurrency(amount)}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card className="border-blue-500/20 bg-blue-500/5 shadow-lg shadow-blue-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="mt-1 text-blue-500">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="text-sm">
              <p className="text-muted-foreground">
                This information is stored locally on your device and helps us suggest appropriate position sizes based on your capital. You can always change this later in your profile settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        className="flex justify-between mt-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Button 
          variant="outline" 
          onClick={onBack}
          className="group relative overflow-hidden border-primary/20 hover:border-primary/40"
        >
          <span className="relative z-10 flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </span>
          <span className="absolute inset-0 bg-primary/5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </Button>
        
        <Button 
          onClick={onNext} 
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-green-500 hover:shadow-lg hover:shadow-primary/20"
        >
          <span className="relative z-10 flex items-center">
            Complete Setup
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
          <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
        </Button>
      </motion.div>
    </div>
  );
};
