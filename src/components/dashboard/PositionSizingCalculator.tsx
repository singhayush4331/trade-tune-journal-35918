
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { IndianRupee, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const PositionSizingCalculator: React.FC = () => {
  const [accountValue, setAccountValue] = useState(100000);
  const [riskPercentage, setRiskPercentage] = useState(1);
  const [entryPrice, setEntryPrice] = useState<number | string>("");
  const [stopLossPrice, setStopLossPrice] = useState<number | string>("");
  const [positionSize, setPositionSize] = useState(0);
  const [riskAmount, setRiskAmount] = useState(0);
  const [stopLossPercentage, setStopLossPercentage] = useState(0);
  const [targetPrice, setTargetPrice] = useState<number | string>("");
  const [targetPercentage, setTargetPercentage] = useState(0);
  const [riskRewardRatio, setRiskRewardRatio] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [direction, setDirection] = useState('long');
  const isMobile = useIsMobile();

  useEffect(() => {
    calculatePosition();
  }, [accountValue, riskPercentage, entryPrice, stopLossPrice, targetPrice, direction]);

  const calculatePosition = () => {
    const entry = Number(entryPrice) || 0;
    const stopLoss = Number(stopLossPrice) || 0;
    const target = Number(targetPrice) || 0;
    
    if (!entry || !stopLoss) {
      setPositionSize(0);
      setRiskAmount(0);
      setStopLossPercentage(0);
      return;
    }
    
    const risk = accountValue * riskPercentage / 100;
    setRiskAmount(risk);
    
    let stopPercentage = 0;
    if (direction === 'long') {
      stopPercentage = (entry - stopLoss) / entry * 100;
    } else {
      stopPercentage = (stopLoss - entry) / entry * 100;
    }
    
    setStopLossPercentage(Math.abs(stopPercentage));
    
    if (stopPercentage) {
      const shares = risk / (entry * (Math.abs(stopPercentage) / 100));
      setPositionSize(shares);
    }
    
    if (target) {
      let targetPct = 0;
      if (direction === 'long') {
        targetPct = (target - entry) / entry * 100;
      } else {
        targetPct = (entry - target) / entry * 100;
      }
      
      setTargetPercentage(Math.abs(targetPct));
      
      if (stopPercentage) {
        const ratio = Math.abs(targetPct / stopPercentage);
        setRiskRewardRatio(ratio);
      }
    }
  };

  const formatIndianRupee = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(value);
  };

  const handleInputFocus = (setter: React.Dispatch<React.SetStateAction<number | string>>) => {
    return () => {
      setter("");
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-purple/10 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-lg font-medium text-gradient">
                <Calculator className="h-5 w-5 text-primary" />
                Position Sizing Calculator
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="accountValue" className="flex items-center gap-1 text-sm">
                    <IndianRupee className="h-3.5 w-3.5 text-primary" />
                    Account Value
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                    </span>
                    <Input 
                      id="accountValue"
                      type="number"
                      className="pl-8 bg-background/50"
                      value={accountValue}
                      onChange={e => setAccountValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center justify-between text-sm">
                    Risk Per Trade
                    <span className="text-primary font-medium">{riskPercentage}%</span>
                  </Label>
                  <Slider
                    value={[riskPercentage]}
                    min={0.1}
                    max={5}
                    step={0.1}
                    onValueChange={value => setRiskPercentage(value[0])}
                    className="py-2"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trade Direction</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={direction === 'long' ? 'default' : 'outline'}
                    className={`flex items-center justify-center gap-2 ${
                      direction === 'long' ? 'bg-success-green text-white' : ''
                    }`}
                    onClick={() => setDirection('long')}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Long
                  </Button>
                  <Button
                    type="button"
                    variant={direction === 'short' ? 'default' : 'outline'}
                    className={`flex items-center justify-center gap-2 ${
                      direction === 'short' ? 'bg-destructive-red text-white' : ''
                    }`}
                    onClick={() => setDirection('short')}
                  >
                    <TrendingDown className="h-4 w-4" />
                    Short
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="entryPrice" className="text-sm">
                    Entry Price (₹)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                    </span>
                    <Input
                      id="entryPrice"
                      type="number"
                      value={entryPrice === "" ? "" : entryPrice}
                      onChange={e => setEntryPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      onFocus={handleInputFocus(setEntryPrice)}
                      placeholder="0"
                      className="pl-8 bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stopLoss" className="text-sm">
                    Stop Loss (₹)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                    </span>
                    <Input
                      id="stopLoss"
                      type="number"
                      value={stopLossPrice === "" ? "" : stopLossPrice}
                      onChange={e => setStopLossPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      onFocus={handleInputFocus(setStopLossPrice)}
                      placeholder="0"
                      className="pl-8 bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target" className="text-sm">
                    Target (₹)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                    </span>
                    <Input
                      id="target"
                      type="number"
                      value={targetPrice === "" ? "" : targetPrice}
                      onChange={e => setTargetPrice(e.target.value === "" ? "" : Number(e.target.value))}
                      onFocus={handleInputFocus(setTargetPrice)}
                      placeholder="0"
                      className="pl-8 bg-background/50"
                    />
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700" 
                onClick={calculatePosition}
              >
                Calculate
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card/60 backdrop-blur-sm border-2 border-primary/20 shadow-lg h-full">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-purple/10 border-b border-border/50">
              <CardTitle className="text-lg font-medium text-gradient">Results</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Risk Amount</p>
                  <div className="flex items-center gap-1 text-lg font-semibold">
                    <IndianRupee className="h-4 w-4" />
                    {formatIndianRupee(riskAmount)}
                  </div>
                </div>
                <div className="bg-primary/5 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Stop Loss</p>
                  <p className="text-lg font-semibold">{stopLossPercentage.toFixed(2)}%</p>
                </div>
              </div>

              {Number(targetPrice) > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-lg font-semibold">{targetPercentage.toFixed(2)}%</p>
                  </div>
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Risk/Reward</p>
                    <p className="text-lg font-semibold">1:{riskRewardRatio.toFixed(2)}</p>
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-light/20 to-primary/20 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-gradient">Position Details</h3>
                <div className="grid grid-cols-2 gap-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Size:</p>
                    <p className="font-medium">{positionSize.toFixed(0)} shares</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Value:</p>
                    <div className="flex items-center gap-1 font-medium">
                      <IndianRupee className="h-3.5 w-3.5" />
                      {formatIndianRupee(positionSize * Number(entryPrice))}
                    </div>
                  </div>

                  {direction === 'long' && Number(targetPrice) > 0 && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Gain:</p>
                        <div className="flex items-center gap-1 font-medium text-success-green">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {formatIndianRupee(positionSize * (Number(targetPrice) - Number(entryPrice)))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Loss:</p>
                        <div className="flex items-center gap-1 font-medium text-destructive-red">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {formatIndianRupee(positionSize * (Number(entryPrice) - Number(stopLossPrice)))}
                        </div>
                      </div>
                    </>
                  )}

                  {direction === 'short' && Number(targetPrice) > 0 && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground">Potential Gain:</p>
                        <div className="flex items-center gap-1 font-medium text-success-green">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {formatIndianRupee(positionSize * (Number(entryPrice) - Number(targetPrice)))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max Loss:</p>
                        <div className="flex items-center gap-1 font-medium text-destructive-red">
                          <IndianRupee className="h-3.5 w-3.5" />
                          {formatIndianRupee(positionSize * (Number(stopLossPrice) - Number(entryPrice)))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="text-center text-muted-foreground text-sm">
                <p>Adjust your position size based on your risk tolerance and market conditions.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PositionSizingCalculator;
