import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { TradeFormData } from '@/utils/trade-form-types';
import { MoodSelector } from './MoodSelector';
import { ScreenshotUploader } from './ScreenshotUploader';
import IndianStockSearch from '@/components/trades/IndianStockSearch';
import { 
  Calendar as CalendarIcon, 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  BarChart2, 
  BookOpen, 
  Image, 
  Clock, 
  Ratio 
} from 'lucide-react';
import { useIsMobile, useIsSmall, useIsXSmall } from '@/hooks/use-mobile';

interface TradeFormFieldsProps {
  formData: TradeFormData;
  strategies: string[];
  validationError?: string | null;
  hidePsychologySection?: boolean;
  onFormDataChange: (data: Partial<TradeFormData>) => void;
  onDateChange: (date: Date | undefined) => void;
  onMoodChange: (mood: string) => void;
  onSegmentChange: (segment: string) => void;
  onTradeTypeChange: (type: 'long' | 'short') => void;
  onTimeChange: (type: 'entry' | 'exit', value: string) => void;
  onRiskRewardChange: (value: string) => void;
}

const TradeFormFields: React.FC<TradeFormFieldsProps> = ({
  formData,
  strategies,
  validationError,
  hidePsychologySection = false,
  onFormDataChange,
  onDateChange,
  onMoodChange,
  onSegmentChange,
  onTradeTypeChange,
  onTimeChange,
  onRiskRewardChange
}) => {
  const isMobile = useIsMobile();
  const isSmall = useIsSmall();
  const isXSmall = useIsXSmall();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="space-y-6">
      {/* Trade Setup */}
      <Card className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden bg-card/90 backdrop-blur-md">
        <CardContent className={`p-${isMobile ? '4' : '6'}`}>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500 mb-4`}>
            Trade Setup
          </h3>
          
          <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-${isMobile ? '4' : '6'}`}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="symbol" className="text-base font-medium">Stock Symbol <span className="text-destructive">*</span></Label>
                <IndianStockSearch 
                  value={formData.symbol} 
                  onChange={value => onFormDataChange({ symbol: value })} 
                  hideLabel={true}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-base font-medium">Trade Date <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "lg"} 
                      className={cn(
                        "w-full pl-3 justify-start text-left font-normal border-primary/20 shadow-sm", 
                        "hover:shadow-md hover:border-primary/30 transition-all duration-200", 
                        "bg-gradient-to-r hover:from-background/90 hover:to-primary/5"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-primary/70" />
                      {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar 
                      mode="single" 
                      selected={formData.date} 
                      onSelect={onDateChange} 
                      initialFocus 
                      className={cn("rounded-md border border-primary/20 shadow-xl shadow-primary/5 bg-card/95 backdrop-blur-sm pointer-events-auto")} 
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">Trade Direction <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <Button 
                    type="button"
                    variant={formData.tradeType === 'long' ? "default" : "outline"} 
                    onClick={() => onTradeTypeChange('long')} 
                    className={formData.tradeType === 'long' 
                      ? "bg-green-600 hover:bg-green-700 text-white border-green-600" 
                      : "border-green-500/30 hover:border-green-500 hover:bg-green-500/10 hover:text-green-600"
                    }
                  >
                     <TrendingUp className="mr-1 h-4 w-4" />
                     Long
                  </Button>
                  <Button 
                    type="button"
                    variant={formData.tradeType === 'short' ? "default" : "outline"} 
                    onClick={() => onTradeTypeChange('short')} 
                    className={formData.tradeType === 'short' 
                      ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                      : "border-red-500/30 hover:border-red-500 hover:bg-red-500/10 hover:text-red-600"
                    }
                  >
                     <TrendingDown className="mr-1 h-4 w-4" />
                     Short
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-base font-medium">Market Segment <span className="text-destructive">*</span></Label>
                <div className={`grid ${isXSmall ? 'grid-cols-1' : isSmall ? 'grid-cols-2' : 'grid-cols-2'} gap-2`}>
                  {['equity-delivery', 'equity-intraday', 'futures', 'options'].map(segment => (
                    <Button 
                      key={segment} 
                      type="button" 
                      size="sm" 
                      variant={formData.marketSegment === segment ? "default" : "outline"} 
                      onClick={() => onSegmentChange(segment)} 
                      className={`justify-start ${formData.marketSegment === segment 
                        ? 'bg-blue-500/20 border-blue-500/30 text-blue-600' 
                        : 'bg-background/80 hover:bg-blue-500/10'}`
                      }
                    >
                      {segment.replace('-', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase())}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Position Details */}
      <Card className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden bg-card/90 backdrop-blur-md">
        <CardContent className={`p-${isMobile ? '4' : '6'}`}>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-green-400 to-blue-500 mb-4`}>
            Position Details
          </h3>
          
          <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
            <div className="space-y-2">
              <Label htmlFor="entryPrice" className="text-base font-medium">
                Entry Price (₹) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="entryPrice" 
                  name="entryPrice" 
                  type="number" 
                  value={formData.entryPrice} 
                  onChange={handleChange} 
                  placeholder="0.00" 
                  className={cn(
                    "w-full pl-10 bg-background/50 backdrop-blur-sm", 
                    validationError && !formData.entryPrice 
                      ? "border-destructive ring-destructive/30" 
                      : "border-primary/20 focus-visible:ring-primary/30"
                  )} 
                />
                <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-primary/70" />
              </div>
              
              <div className="mt-3">
                <Label htmlFor="entryTime" className="text-base font-medium">Entry Time</Label>
                <div className="relative mt-1">
                  <Input 
                    id="entryTime" 
                    name="entryTime" 
                    type="time" 
                    value={formData.entryTime} 
                    onChange={e => onTimeChange('entry', e.target.value)} 
                    className="w-full pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30" 
                  />
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-primary/70" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="exitPrice" className="text-base font-medium">
                Exit Price (₹) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="exitPrice" 
                  name="exitPrice" 
                  type="number" 
                  value={formData.exitPrice} 
                  onChange={handleChange} 
                  placeholder="0.00" 
                  className={cn(
                    "w-full pl-10 bg-background/50 backdrop-blur-sm", 
                    validationError && !formData.exitPrice 
                      ? "border-destructive ring-destructive/30" 
                      : "border-primary/20 focus-visible:ring-primary/30"
                  )} 
                />
                <IndianRupee className="absolute left-3 top-2.5 h-5 w-5 text-primary/70" />
              </div>
              
              <div className="mt-3">
                <Label htmlFor="exitTime" className="text-base font-medium">Exit Time</Label>
                <div className="relative mt-1">
                  <Input 
                    id="exitTime" 
                    name="exitTime" 
                    type="time" 
                    value={formData.exitTime} 
                    onChange={e => onTimeChange('exit', e.target.value)} 
                    className="w-full pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30" 
                  />
                  <Clock className="absolute left-3 top-2.5 h-5 w-5 text-primary/70" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-base font-medium">
                Quantity <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input 
                  id="quantity" 
                  name="quantity" 
                  type="number" 
                  value={formData.quantity} 
                  onChange={handleChange} 
                  placeholder="0" 
                  className={cn(
                    "w-full pl-10 bg-background/50 backdrop-blur-sm", 
                    validationError && !formData.quantity 
                      ? "border-destructive ring-destructive/30" 
                      : "border-primary/20 focus-visible:ring-primary/30"
                  )} 
                />
                <BarChart2 className="absolute left-3 top-2.5 h-5 w-5 text-primary/70" />
              </div>
              
              <div className="mt-3">
                <Label htmlFor="exchange" className="text-base font-medium">Exchange</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant={formData.exchange === 'NSE' ? "default" : "outline"} 
                    onClick={() => onFormDataChange({ exchange: 'NSE' })} 
                    className={formData.exchange === 'NSE' 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-600" 
                      : "bg-background/50"
                    }
                  >
                    NSE
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant={formData.exchange === 'BSE' ? "default" : "outline"} 
                    onClick={() => onFormDataChange({ exchange: 'BSE' })} 
                    className={formData.exchange === 'BSE' 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-600" 
                      : "bg-background/50"
                    }
                  >
                    BSE
                  </Button>
                  <Button 
                    type="button" 
                    size="sm" 
                    variant={formData.exchange === 'MCX' ? "default" : "outline"} 
                    onClick={() => onFormDataChange({ exchange: 'MCX' })} 
                    className={formData.exchange === 'MCX' 
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-600" 
                      : "bg-background/50"
                    }
                  >
                    MCX
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Label htmlFor="riskToReward" className="text-base font-medium">Risk to Reward Ratio</Label>
            <div className="relative mt-1">
              <Input 
                id="riskToReward" 
                name="riskToReward" 
                value={formData.riskToReward} 
                onChange={e => onRiskRewardChange(e.target.value)} 
                placeholder="e.g., 1:2" 
                className="w-full pl-10 bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30" 
              />
              <Ratio className="absolute left-3 top-2.5 h-5 w-5 text-primary/70" />
            </div>
          </div>

          {formData.marketSegment === 'options' && (
            <div className="mt-6 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <h4 className="text-base font-semibold text-primary mb-3">Options Details</h4>
              <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-4`}>
                <div>
                  <Label className="text-sm font-medium">Option Type</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={formData.optionType === 'CE' ? 'default' : 'outline'}
                      onClick={() => onFormDataChange({ optionType: 'CE' })}
                      className={formData.optionType === 'CE' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-background/50'}
                    >
                      CE (Call)
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={formData.optionType === 'PE' ? 'default' : 'outline'}
                      onClick={() => onFormDataChange({ optionType: 'PE' })}
                      className={formData.optionType === 'PE' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-background/50'}
                    >
                      PE (Put)
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={formData.positionType === 'buy' ? 'default' : 'outline'}
                      onClick={() => onFormDataChange({ positionType: 'buy' })}
                      className={formData.positionType === 'buy' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-background/50'}
                    >
                      Buy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={formData.positionType === 'sell' ? 'default' : 'outline'}
                      onClick={() => onFormDataChange({ positionType: 'sell' })}
                      className={formData.positionType === 'sell' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-background/50'}
                    >
                      Sell
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Psychology & Strategy */}
      {!hidePsychologySection && (
        <Card className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden bg-card/90 backdrop-blur-md">
          <CardContent className={`p-${isMobile ? '4' : '6'}`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500 mb-4`}>
              Psychology & Strategy
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-2 block">Trading Mood</Label>
                <MoodSelector value={formData.mood} onChange={onMoodChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategy" className="text-base font-medium">Strategy Used</Label>
                <div className="relative">
                  <Select 
                    value={formData.strategy} 
                    onValueChange={value => onFormDataChange({ strategy: value })}
                  >
                    <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30 pl-10">
                      <SelectValue placeholder="Select strategy from your playbooks" />
                    </SelectTrigger>
                    <SelectContent>
                      {strategies.length > 0 
                        ? strategies.map(strategy => (
                            <SelectItem key={strategy} value={strategy}>
                              {strategy}
                            </SelectItem>
                          )) 
                        : (
                            <SelectItem value="no-strategies-found" disabled>
                              No strategies found in playbooks
                            </SelectItem>
                          )
                      }
                    </SelectContent>
                  </Select>
                  <BookOpen className="absolute left-3 top-2.5 h-5 w-5 text-primary/70 z-10 pointer-events-none" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes & Screenshots */}
      <Card className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden bg-card/90 backdrop-blur-md">
        <CardContent className={`p-${isMobile ? '4' : '6'}`}>
          <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-400 to-purple-500 mb-4`}>
            Notes & Screenshots
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">Trading Notes</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                placeholder="Add your observations, reflections, and learnings from this trade..." 
                className="min-h-[120px] bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30" 
              />
            </div>
            
            <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-2'} gap-6`}>
              <ScreenshotUploader 
                value={formData.entryScreenshot} 
                onChange={(value) => onFormDataChange({ entryScreenshot: value })} 
                label="Entry Screenshot" 
                icon={<Image className="h-6 w-6 text-primary/70" />} 
              />
              
              <ScreenshotUploader 
                value={formData.exitScreenshot} 
                onChange={(value) => onFormDataChange({ exitScreenshot: value })} 
                label="Exit Screenshot" 
                icon={<Image className="h-6 w-6 text-primary/70" />} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeFormFields;