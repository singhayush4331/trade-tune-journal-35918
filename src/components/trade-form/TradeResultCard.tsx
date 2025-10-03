
import React from 'react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/trade-form-utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface TradeResultCardProps {
  pl: number;
  brokerage: number;
  roi: number;
  animate?: boolean;
}

export const TradeResultCard: React.FC<TradeResultCardProps> = ({ 
  pl, 
  brokerage, 
  roi,
  animate = true
}) => {
  const isProfitable = pl > 0;
  
  const Container = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Container 
      className={cn(
        "rounded-lg border p-4",
        isProfitable 
          ? "bg-green-500/5 border-green-500/20" 
          : "bg-red-500/5 border-red-500/20"
      )}
      {...animationProps}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">Trade Result</h3>
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
          isProfitable ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
        )}>
          {isProfitable ? (
            <>
              <TrendingUp className="h-3 w-3" />
              <span>Profit</span>
            </>
          ) : (
            <>
              <TrendingDown className="h-3 w-3" />
              <span>Loss</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Net P&L</p>
          <p className={cn(
            "text-lg font-bold",
            isProfitable ? "text-green-500" : "text-red-500"
          )}>
            {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
          </p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Charges</p>
          <p className="font-medium">{formatCurrency(brokerage)}</p>
        </div>
        
        <div>
          <p className="text-xs text-muted-foreground mb-1">ROI</p>
          <p className={cn(
            "font-medium",
            roi >= 0 ? "text-green-500" : "text-red-500"
          )}>
            {roi.toFixed(2)}%
          </p>
        </div>
      </div>
    </Container>
  );
};
