
import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { ChartBarIcon } from 'lucide-react';
import { calculateRiskRewardStats } from '@/utils/risk-reward-utils';
import { Trade } from '@/utils/trade-form-types';
import { formatIndianCurrency } from '@/lib/utils';

interface RiskRewardStatCardProps {
  trades: Trade[];
  className?: string;
}

const RiskRewardStatCard: React.FC<RiskRewardStatCardProps> = ({ trades, className }) => {
  const [stats, setStats] = useState({
    avgRatio: 0,
    mostProfitableRatio: '',
    winRate: 0,
    totalPnl: 0
  });

  useEffect(() => {
    if (trades && trades.length > 0) {
      const riskRewardStats = calculateRiskRewardStats(trades);
      
      // Get the most profitable ratio
      const mostProfitable = riskRewardStats.profitableRatios[0];
      
      // Calculate total PnL for trades with this ratio
      const totalPnl = trades
        .filter(t => t.riskToReward === mostProfitable?.ratio)
        .reduce((sum, t) => sum + t.pnl, 0);
      
      setStats({
        avgRatio: riskRewardStats.avgRatio,
        mostProfitableRatio: mostProfitable?.ratio || 'N/A',
        winRate: mostProfitable?.winRate || 0,
        totalPnl
      });
    }
  }, [trades]);

  // Only show this subtitle if there's a profitable ratio available
  const subtitle = stats.mostProfitableRatio !== 'N/A' 
    ? `Best: ${stats.mostProfitableRatio} (${stats.winRate.toFixed(1)}% win)`
    : 'Add trades with R:R';

  return (
    <StatCard
      title="Risk/Reward"
      value={stats.avgRatio === 0 ? 'N/A' : stats.avgRatio.toFixed(2)}
      icon={<ChartBarIcon className="h-4 w-4 text-primary" />}
      className={className}
      subtitle={subtitle}
      trend={stats.totalPnl !== 0 ? {
        value: parseFloat(Math.abs(stats.totalPnl).toFixed(1)),
        isPositive: stats.totalPnl > 0
      } : undefined}
    />
  );
};

export default React.memo(RiskRewardStatCard);
