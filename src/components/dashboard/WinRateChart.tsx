
import React, { useMemo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchUserTrades } from '@/services/trades-service';
import WinRateDonutChart from '../landing/WinRateDonutChart';
import { PieChart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemoizedData } from '@/hooks/use-memoized-data';
import { Trade } from '@/utils/trade-form-types';

interface WinRateChartProps {
  dateRange?: DateRange | undefined;
}

const WinRateChart: React.FC<WinRateChartProps> = ({ dateRange }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Generate a unique key for the chart that changes whenever the date range changes
  const chartKey = useMemo(() => {
    return `winrate-${dateRange?.from?.getTime()}-${dateRange?.to?.getTime()}-${Date.now()}`;
  }, [dateRange]);
  
  const loadTrades = async () => {
    setIsLoading(true);
    try {
      const { data } = await fetchUserTrades();
      if (data) {
        setTrades(data);
        console.log(`Loaded ${data.length} trades`);
      }
    } catch (err) {
      console.error("Error loading trades:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadTrades();
    console.log("Date range changed:", dateRange?.from, dateRange?.to);
    
    const handleTradeUpdate = () => {
      loadTrades();
    };
    
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('dashboardDataUpdated', handleTradeUpdate);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('dashboardDataUpdated', handleTradeUpdate);
    };
  }, [dateRange]); // React to dateRange changes

  // Use memoized data processing for better performance with dateRange dependency
  const filteredTrades = useMemoizedData(
    trades,
    (allTrades: Trade[]) => {
      if (!dateRange || !dateRange.from) {
        return allTrades;
      }
      
      const rangeStart = startOfDay(dateRange.from);
      const rangeEnd = dateRange.to ? endOfDay(dateRange.to) : endOfDay(new Date());
      
      const filtered = allTrades.filter(trade => {
        const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date);
        return isWithinInterval(tradeDate, { start: rangeStart, end: rangeEnd });
      });
      
      console.log(`Filtered trades: ${filtered.length} out of ${allTrades.length} for range:`, 
        dateRange.from, dateRange.to);
      
      return filtered;
    },
    [dateRange] // Add dateRange as explicit dependency to force recalculation
  );
  
  const winLossData = useMemoizedData(
    filteredTrades,
    (tradesToProcess: Trade[]) => {
      if (!tradesToProcess || tradesToProcess.length === 0) {
        console.log("No trades to process for win/loss ratio");
        return { winRate: 0, lossRate: 0, breakEvenRate: 0 };
      }
      
      const wins = tradesToProcess.filter(trade => trade.pnl > 0).length;
      const losses = tradesToProcess.filter(trade => trade.pnl < 0).length;
      const breakEven = tradesToProcess.filter(trade => trade.pnl === 0).length;
      
      const total = tradesToProcess.length;
      
      const result = {
        winRate: Math.round((wins / total) * 100),
        lossRate: Math.round((losses / total) * 100),
        breakEvenRate: Math.round((breakEven / total) * 100)
      };
      
      console.log("Win/Loss data calculated:", result, 
        `(wins: ${wins}, losses: ${losses}, breakEven: ${breakEven}, total: ${total})`);
      
      return result;
    },
    [filteredTrades, dateRange] // Also depend on dateRange to ensure recalculation
  );

  if (isLoading) {
    return <Card className="h-full overflow-hidden border-2 border-primary/10 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-2">
          <CardTitle className="text-sm sm:text-md font-medium">Win/Loss Ratio</CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex items-center justify-center">
          <Skeleton className="h-32 w-32 rounded-full" />
        </CardContent>
      </Card>;
  }

  return (
    <Card className="h-full overflow-hidden border-2 border-primary/10 shadow-lg flex flex-col">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/20 flex items-center justify-center">
            <PieChart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <CardTitle className="text-sm sm:text-md font-medium">Win/Loss Ratio</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex items-center justify-center">
        {filteredTrades.length === 0 ? (
          <div className="text-center text-muted-foreground text-sm py-8">
            No trade data available
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center p-0 sm:p-4">
            <WinRateDonutChart 
              data={winLossData} 
              size={isMobile ? 'medium' : 'medium'}
              key={chartKey} // Force re-render when date range changes
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(WinRateChart);
