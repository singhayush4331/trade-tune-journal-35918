import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, BookOpen } from 'lucide-react';
import { MoodSelector } from './MoodSelector';
import { cn } from '@/lib/utils';

interface TradePsychologyCardProps {
  tradeNumber: number;
  symbol: string;
  mood?: string;
  strategy?: string;
  strategies: string[];
  onMoodChange: (mood: string) => void;
  onStrategyChange: (strategy: string) => void;
  showTradeNumber?: boolean;
}

const TradePsychologyCard: React.FC<TradePsychologyCardProps> = ({
  tradeNumber,
  symbol,
  mood,
  strategy,
  strategies,
  onMoodChange,
  onStrategyChange,
  showTradeNumber = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: tradeNumber * 0.1 }}
    >
      <Card className="border-primary/20 shadow-lg shadow-primary/5 overflow-hidden bg-card/90 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-purple-400 to-blue-500">
              {showTradeNumber ? `Trade #${tradeNumber} Psychology` : 'Trade Psychology'}
            </h3>
          </div>
          
          <div className="mb-3">
            <Badge variant="outline" className="text-xs">
              {symbol}
            </Badge>
          </div>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">Trading Mood</Label>
              <MoodSelector value={mood} onChange={onMoodChange} />
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <h4 className="text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-blue-400 to-purple-500">
                  Strategy Used
                </h4>
              </div>
              <div className="space-y-2">
                <div className="relative">
                <Select 
                  value={strategy} 
                  onValueChange={onStrategyChange}
                >
                  <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/30 pl-10">
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    {strategies.length > 0 
                      ? strategies.map(strat => (
                          <SelectItem key={strat} value={strat}>
                            {strat}
                          </SelectItem>
                        )) 
                      : (
                          <SelectItem value="no-strategies-found" disabled>
                            No strategies found
                          </SelectItem>
                        )
                    }
                  </SelectContent>
                </Select>
                <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-primary/70 z-10 pointer-events-none" />
              </div>
            </div>
          </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TradePsychologyCard;