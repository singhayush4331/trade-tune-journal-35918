import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Save, TrendingUp, TrendingDown, IndianRupee, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TradeFormData, TradeType } from '@/utils/trade-form-types';
import { calculateTradeMetrics, formatTimeForInput } from '@/utils/trade-form-utils';
import TradeFormFields from './TradeFormFields';
import { TradeResultCard } from './TradeResultCard';
import TradePsychologyCard from './TradePsychologyCard';
import { createTrade } from '@/services/trades-service';
import { toast } from 'sonner';
import { detectOptionFromSymbol, calculateOptionsTradeDirection } from '@/utils/options-utils';

interface CollapsibleTradeSectionProps {
  trade: any;
  tradeNumber: number;
  strategies: string[];
  isMultipleTradesMode?: boolean;
  processedFormData?: any;
  onTradeSaved?: (tradeData: any) => void;
  onPsychologyChange?: (tradeNumber: number, data: { mood?: string; strategy?: string }) => void;
  onToggle?: (tradeNumber: number, isOpen: boolean) => void;
  onFormDataChange?: (tradeNumber: number, formData: any) => void;
  saveMode?: 'individual' | 'save-next' | 'save-finish';
}

const CollapsibleTradeSection: React.FC<CollapsibleTradeSectionProps> = ({
  trade,
  tradeNumber,
  strategies,
  isMultipleTradesMode = false,
  processedFormData,
  onTradeSaved,
  onPsychologyChange,
  onToggle,
  onFormDataChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Use processed form data if available, otherwise initialize from trade
  const initializeFormData = () => {
    if (processedFormData) {
      console.log('🔄 Using processed form data:', processedFormData);
      return {
        ...processedFormData,
        date: new Date(),
        strategy: '',
        notes: '',
        mood: 'focused',
        entryScreenshot: null,
        exitScreenshot: null,
        riskToReward: ''
      };
    }
    
    // Fallback to original detection logic
    console.log('🔍 CollapsibleTradeSection initializing for trade:', trade.symbol);
    
    const optionDetection = detectOptionFromSymbol(trade.symbol);
    console.log('🎯 Options detection in CollapsibleTradeSection:', optionDetection);
    
    let finalTradeType = trade.type || 'long';
    let finalMarketSegment = 'equity-delivery';
    let finalSymbol = trade.symbol || '';
    
    // Auto-configure options fields if detected
    if (optionDetection.isOption) {
      finalMarketSegment = 'options';
      console.log('✅ Options detected in CollapsibleTradeSection! Setting market segment to:', finalMarketSegment);
      
      // Use simplified underlying symbol instead of full contract
      if (optionDetection.underlyingSymbol) {
        finalSymbol = optionDetection.underlyingSymbol;
        console.log('📝 Simplified symbol:', finalSymbol);
      }
      
      // If we have position type information from extraction, calculate correct direction
      if (trade.positionType && optionDetection.optionType) {
        const calculatedDirection = calculateOptionsTradeDirection(
          optionDetection.optionType as 'CE' | 'PE',
          trade.positionType as 'buy' | 'sell'
        );
        finalTradeType = calculatedDirection;
        console.log('📊 Trade direction calculated in CollapsibleTradeSection:', {
          optionType: optionDetection.optionType,
          positionType: trade.positionType,
          calculatedDirection
        });
      }
    }
    
    return {
      symbol: finalSymbol,
      entryPrice: trade.entryPrice?.toString() || '',
      exitPrice: trade.exitPrice?.toString() || '',
      quantity: trade.quantity?.toString() || '',
      date: new Date(),
      tradeType: finalTradeType,
      marketSegment: finalMarketSegment,
      exchange: 'NSE',
      strategy: '',
      notes: '',
      mood: 'focused',
      entryScreenshot: null,
      exitScreenshot: null,
      entryTime: formatTimeForInput(trade.entryTime || ''),
      exitTime: formatTimeForInput(trade.exitTime || ''),
      riskToReward: '',
      // Add options-specific fields if detected
      ...(optionDetection.isOption && {
        optionType: optionDetection.optionType,
        positionType: trade.positionType || '',
        strikePrice: optionDetection.strikePrice || ''
      })
    };
  };
  
  const [formData, setFormData] = useState<TradeFormData>(initializeFormData());

  const handleFormDataChange = (data: Partial<TradeFormData>) => {
    const updatedFormData = {
      ...formData,
      ...data
    };
    setFormData(updatedFormData);
    
    // Notify parent component of form data changes
    if (onFormDataChange) {
      onFormDataChange(tradeNumber, updatedFormData);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleMoodChange = (mood: string) => {
    setFormData(prev => ({
      ...prev,
      mood
    }));
    if (onPsychologyChange) {
      onPsychologyChange(tradeNumber, { mood });
    }
  };

  const handleSegmentChange = (segment: string) => {
    setFormData(prev => ({
      ...prev,
      marketSegment: segment
    }));
  };

  const handleTradeTypeChange = (type: 'long' | 'short') => {
    setFormData(prev => ({
      ...prev,
      tradeType: type
    }));
  };

  const handleTimeChange = (type: 'entry' | 'exit', value: string) => {
    if (type === 'entry') {
      setFormData(prev => ({
        ...prev,
        entryTime: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        exitTime: value
      }));
    }
  };

  const handleRiskRewardChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      riskToReward: value
    }));
  };

  const validateForm = () => {
    if (!formData.symbol) {
      setValidationError("Please select a stock symbol");
      toast.error("Missing stock symbol");
      return false;
    }
    
    const entryPrice = parseFloat(formData.entryPrice);
    const exitPrice = parseFloat(formData.exitPrice);
    const quantity = parseInt(formData.quantity);
    
    if (isNaN(entryPrice) || entryPrice <= 0) {
      setValidationError("Please enter a valid entry price");
      toast.error("Invalid entry price");
      return false;
    }
    
    if (isNaN(exitPrice) || exitPrice <= 0) {
      setValidationError("Please enter a valid exit price");
      toast.error("Invalid exit price");
      return false;
    }
    
    if (isNaN(quantity) || quantity <= 0) {
      setValidationError("Please enter a valid quantity");
      toast.error("Invalid quantity");
      return false;
    }
    
    setValidationError(null);
    return true;
  };

  const handleSaveTrade = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const tradeParams = {
        entryPrice: parseFloat(formData.entryPrice),
        exitPrice: parseFloat(formData.exitPrice),
        quantity: parseInt(formData.quantity),
        tradeType: formData.tradeType as TradeType,
        marketSegment: formData.marketSegment,
        exchange: formData.exchange
      };

      const { pl, brokerage } = calculateTradeMetrics(tradeParams);

      const response = await createTrade(formData, pl, brokerage);
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to create trade");
      }

      setIsSaved(true);
      toast.success(`Trade ${tradeNumber} saved successfully!`, {
        description: `${formData.symbol} trade has been recorded`,
      });

      // Don't navigate automatically on individual trade save
      // Let the parent handle navigation logic

      if (onTradeSaved) {
        onTradeSaved(response.data);
      }
    } catch (error: any) {
      console.error("Error saving trade:", error);
      toast.error(error.message || "Failed to save trade");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate metrics for display
  const tradeParams = {
    entryPrice: parseFloat(formData.entryPrice) || 0,
    exitPrice: parseFloat(formData.exitPrice) || 0,
    quantity: parseInt(formData.quantity) || 0,
    tradeType: formData.tradeType as TradeType,
    marketSegment: formData.marketSegment,
    exchange: formData.exchange
  };

  const { pl, brokerage, roi } = calculateTradeMetrics(tradeParams);
  const pnlColor = pl >= 0 ? 'text-green-500' : 'text-red-500';
  const showResults = formData.entryPrice && formData.exitPrice && formData.quantity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: tradeNumber * 0.1 }}
      data-trade-number={tradeNumber}
    >
      <Collapsible open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (onToggle) {
          onToggle(tradeNumber, open);
        }
      }}>
        <Card className={cn(
          "border-primary/20 shadow-lg shadow-primary/5 overflow-hidden bg-card/90 backdrop-blur-md transition-all duration-200",
          isOpen && "border-primary/30",
          isSaved && "border-green-500/30 bg-green-500/5"
        )}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                      Trade #{tradeNumber}
                    </h3>
                    {isSaved && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formData.symbol || trade.symbol}
                    </Badge>
                    {formData.tradeType === 'long' ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Long
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-600 border-red-500/30">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        Short
                      </Badge>
                    )}
                    {showResults && (
                      <Badge variant="outline" className={cn("text-xs", pnlColor)}>
                        <IndianRupee className="h-3 w-3 mr-1" />
                        {pl >= 0 ? '+' : ''}{pl.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {validationError && (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isOpen && "transform rotate-180"
                  )} />
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <Separator className="mb-6" />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Trade Form - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <TradeFormFields
                    formData={formData}
                    strategies={strategies}
                    validationError={validationError}
                    hidePsychologySection={true}
                    onFormDataChange={(data) => {
                      handleFormDataChange(data);
                      if (onPsychologyChange && data.strategy) {
                        onPsychologyChange(tradeNumber, { strategy: data.strategy });
                      }
                    }}
                    onDateChange={handleDateChange}
                    onMoodChange={handleMoodChange}
                    onSegmentChange={handleSegmentChange}
                    onTradeTypeChange={handleTradeTypeChange}
                    onTimeChange={handleTimeChange}
                    onRiskRewardChange={handleRiskRewardChange}
                  />
                </div>
                
                {/* Individual Psychology & Result Cards - Takes 1 column */}
                <div className="space-y-4">
                  <TradePsychologyCard
                    tradeNumber={tradeNumber}
                    symbol={formData.symbol || 'Symbol'}
                    mood={formData.mood}
                    strategy={formData.strategy}
                    strategies={strategies}
                    onMoodChange={handleMoodChange}
                    onStrategyChange={(strategy) => handleFormDataChange({ strategy })}
                    showTradeNumber={true}
                  />
                  
                  {showResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TradeResultCard pl={pl} brokerage={brokerage} roi={roi} />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-primary/20 hover:border-primary/40"
                >
                  Collapse
                </Button>
                <Button
                  onClick={handleSaveTrade}
                  disabled={isSaving || isSaved}
                  className={cn(
                    "min-w-[120px]",
                    isSaved 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white mr-2" />
                      Saving...
                    </>
                  ) : isSaved ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Trade
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </motion.div>
  );
};

export default CollapsibleTradeSection;