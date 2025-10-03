
import React from 'react';
import { formatIndianCurrency } from '@/lib/utils';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  tooltipTitle?: string;
  showEmoji?: boolean;
}

const CustomPieTooltip: React.FC<TooltipProps> = ({ 
  active, 
  payload, 
  tooltipTitle = 'Performance',
  showEmoji = true
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  const data = payload[0].payload;
  
  return (
    <div className="bg-background/95 p-3 rounded-lg border border-border shadow-xl">
      <div className="flex items-center gap-2">
        {showEmoji && data.emoji && <span className="text-xl">{data.emoji}</span>}
        <span className="font-medium capitalize">{data.name}</span>
      </div>
      
      {data.value !== undefined && (
        <div className="mt-1 text-sm text-muted-foreground">
          {data.value} {tooltipTitle === 'Trades' ? 'trades' : tooltipTitle}
        </div>
      )}
      
      {typeof data.pnl === 'number' && (
        <div className="mt-1 text-sm font-medium">
          P&L: {data.pnl >= 0 ? '+' : ''}
          {formatIndianCurrency(data.pnl)}
        </div>
      )}
      
      {typeof data.avgPnl === 'number' && (
        <div className="mt-1 text-sm text-muted-foreground">
          Avg: {data.avgPnl >= 0 ? '+' : ''}
          {formatIndianCurrency(data.avgPnl)} per trade
        </div>
      )}
      
      {data.percentage !== undefined && (
        <div className="mt-1 text-sm text-muted-foreground">
          {data.percentage}% of total
        </div>
      )}
    </div>
  );
};

export default CustomPieTooltip;
