
export interface RiskRewardStats {
  totalTrades: number;
  avgRatio: number;
  profitableRatios: { ratio: string; count: number; winRate: number }[];
}

export const parseRiskRewardRatio = (ratio: string): number => {
  if (!ratio) return 0;
  
  try {
    // Support both : and / delimiters for flexibility
    const [risk, reward] = ratio.split(/[:\/]/).map(num => parseFloat(num.trim()));
    
    if (isNaN(risk) || isNaN(reward) || risk === 0) return 0;
    return reward / risk;
  } catch (error) {
    console.error('Error parsing risk/reward ratio:', error);
    return 0;
  }
};

export const calculateRiskRewardStats = (trades: any[]): RiskRewardStats => {
  // Filter trades to only include those with a risk to reward ratio
  const tradesWithRatio = trades.filter(trade => trade.riskToReward);
  
  if (tradesWithRatio.length === 0) {
    return {
      totalTrades: 0,
      avgRatio: 0,
      profitableRatios: []
    };
  }

  // Parse the ratio for each trade and check if it's profitable
  const ratios = tradesWithRatio.map(trade => ({
    ratio: trade.riskToReward,
    profitable: trade.pnl > 0,
    value: parseRiskRewardRatio(trade.riskToReward)
  }));

  // Calculate the average ratio
  const validRatios = ratios.filter(r => r.value > 0);
  const avgRatio = validRatios.length > 0
    ? validRatios.reduce((sum, { value }) => sum + value, 0) / validRatios.length
    : 0;

  // Group ratios by their string representation and calculate win rates
  const ratioGroups = ratios.reduce((acc, { ratio, profitable }) => {
    if (!acc[ratio]) {
      acc[ratio] = { total: 0, wins: 0 };
    }
    acc[ratio].total++;
    if (profitable) acc[ratio].wins++;
    return acc;
  }, {} as Record<string, { total: number; wins: number }>);

  // Convert to array, sort by win rate, and limit to top 5
  const profitableRatios = Object.entries(ratioGroups)
    .map(([ratio, stats]) => ({
      ratio,
      count: stats.total,
      winRate: (stats.wins / stats.total) * 100
    }))
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 5);

  return {
    totalTrades: tradesWithRatio.length,
    avgRatio,
    profitableRatios
  };
};

export const getRRRatioClass = (ratio: number): string => {
  if (ratio <= 0) return '';
  if (ratio >= 2) return 'text-success';
  if (ratio >= 1) return 'text-warning';
  return 'text-destructive';
};
