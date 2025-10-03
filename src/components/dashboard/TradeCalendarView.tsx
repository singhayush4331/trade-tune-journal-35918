import React, { useState, useMemo, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DayClickEventHandler } from 'react-day-picker';
import { format, formatISO } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { TrendingDown, TrendingUp, CalendarDays, DollarSign, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { mockTrades } from '@/data/mockTradeData';
import DayDetailDialog from '@/components/calendar/DayDetailDialog';

interface TradeCalendarViewProps {
  dateRange?: DateRange | undefined;
}

const TradeCalendarView: React.FC<TradeCalendarViewProps> = ({ dateRange }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tradeDays, setTradeDays] = useState<any[]>([]);
  const [dailyTrades, setDailyTrades] = useState<any[]>([]);
  
  useEffect(() => {
    const loadTradeData = () => {
      const allMockTrades = mockTrades;
      const localStorageTrades = JSON.parse(localStorage.getItem('trades') || '[]');
      const allTrades = [...allMockTrades, ...localStorageTrades];
      
      const tradeDayMap = new Map();
      
      allTrades.forEach(trade => {
        const dateKey = formatISO(new Date(trade.date), { representation: 'date' });
        
        if (!tradeDayMap.has(dateKey)) {
          tradeDayMap.set(dateKey, {
            date: new Date(trade.date),
            profit: 0,
            trades: 0
          });
        }
        
        const day = tradeDayMap.get(dateKey);
        day.profit += trade.pnl || 0;
        day.trades += 1;
      });
      
      setTradeDays(Array.from(tradeDayMap.values()));
      
      if (selectedDate) {
        updateDailyTrades(selectedDate, allTrades);
      }
    };
    
    loadTradeData();
    
    window.addEventListener('tradeDataUpdated', loadTradeData);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', loadTradeData);
    };
  }, [selectedDate]);
  
  const updateDailyTrades = (date: Date, allTrades: any[]) => {
    const selectedDateStr = formatISO(date, { representation: 'date' });
    
    const tradesOnSelectedDay = allTrades.filter(trade => {
      const tradeDate = formatISO(new Date(trade.date), { representation: 'date' });
      return tradeDate === selectedDateStr;
    });
    
    setDailyTrades(tradesOnSelectedDay);
  };
  
  const handleDayClick: DayClickEventHandler = (day) => {
    setSelectedDate(day);
    
    const allMockTrades = mockTrades;
    const localStorageTrades = JSON.parse(localStorage.getItem('trades') || '[]');
    const allTrades = [...allMockTrades, ...localStorageTrades];
    
    updateDailyTrades(day, allTrades);
    
    setIsDialogOpen(true);
  };
  
  const modifiers = useMemo(() => {
    return {
      hasTrades: tradeDays.map((day) => day.date),
      profitHigh: tradeDays
        .filter(day => day.profit >= 500)
        .map(day => day.date),
      profitMedium: tradeDays
        .filter(day => day.profit >= 200 && day.profit < 500)
        .map(day => day.date),
      profitLow: tradeDays
        .filter(day => day.profit > 0 && day.profit < 200)
        .map(day => day.date),
      lossHigh: tradeDays
        .filter(day => day.profit <= -500)
        .map(day => day.date),
      lossMedium: tradeDays
        .filter(day => day.profit <= -200 && day.profit > -500)
        .map(day => day.date),
      lossLow: tradeDays
        .filter(day => day.profit < 0 && day.profit > -200)
        .map(day => day.date)
    };
  }, [tradeDays]);
  
  const getDayClassName = (date: Date): string => {
    const tradeDay = tradeDays.find(
      (day) => format(day.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
    
    if (!tradeDay) return "";
    
    if (tradeDay.profit >= 500) {
      return "bg-gradient-to-b from-success/90 to-success/70 text-white font-semibold flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_10px_rgba(34,197,94,0.5)] hover:shadow-[0_0_15px_rgba(34,197,94,0.7)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit >= 200) {
      return "bg-gradient-to-b from-success/70 to-success/50 text-white font-medium flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_6px_rgba(34,197,94,0.4)] hover:shadow-[0_0_10px_rgba(34,197,94,0.6)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit > 0) {
      return "bg-gradient-to-b from-success/50 to-success/30 text-white flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_4px_rgba(34,197,94,0.3)] hover:shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit <= -500) {
      return "bg-gradient-to-b from-destructive/90 to-destructive/70 text-white font-semibold flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all transform hover:scale-105 mx-auto";
    } else if (tradeDay.profit <= -200) {
      return "bg-gradient-to-b from-destructive/70 to-destructive/50 text-white font-medium flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_6px_rgba(239,68,68,0.4)] hover:shadow-[0_0_10px_rgba(239,68,68,0.6)] transition-all transform hover:scale-105 mx-auto";
    } else {
      return "bg-gradient-to-b from-destructive/50 to-destructive/30 text-white flex items-center justify-center min-w-8 min-h-8 w-8 h-8 text-center rounded-lg shadow-[0_0_4px_rgba(239,68,68,0.3)] hover:shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105 mx-auto";
    }
  };
  
  const CustomDayComponent = (props: any) => {
    if (!props.date) return <button {...props}>--</button>;
    
    const customClassName = getDayClassName(props.date);
    const dayNumber = props.date.getDate();
    
    if (customClassName) {
      return (
        <button 
          {...props} 
          className={cn(props.className || "", "flex items-center justify-center p-0 h-9 w-9")}
        >
          <div className={cn(customClassName)}>
            {dayNumber}
          </div>
        </button>
      );
    }
    
    return (
      <button 
        {...props} 
        className={cn(
          props.className || "",
          "flex items-center justify-center min-w-8 min-h-8 w-8 h-8 rounded-lg hover:bg-muted/30 hover:scale-105 transition-all mx-auto"
        )}
      >
        {dayNumber}
      </button>
    );
  };
  
  const monthStats = useMemo(() => {
    return {
      totalProfit: tradeDays.reduce((sum, day) => sum + day.profit, 0),
      totalTrades: tradeDays.reduce((sum, day) => sum + day.trades, 0),
      profitDays: tradeDays.filter(day => day.profit > 0).length,
      lossDays: tradeDays.filter(day => day.profit < 0).length
    };
  }, [tradeDays]);
  
  const dailyTotalPnl = useMemo(() => {
    return dailyTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
  }, [dailyTrades]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Card className="overflow-hidden border-2 border-primary/20 shadow-lg rounded-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/0 opacity-70 pointer-events-none"></div>
            <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 pb-2 relative z-10">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-primary animate-pulse" />
                <CardTitle className="text-md font-medium">Trade Calendar</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-3 md:p-5 relative z-10 transform group-hover:scale-[1.01] transition-transform duration-300">
              <Calendar
                mode="single"
                selected={selectedDate}
                onDayClick={handleDayClick}
                modifiers={modifiers}
                modifiersStyles={{
                  profitHigh: { 
                    background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.9), rgba(34, 197, 94, 0.7))', 
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '1rem',
                    transform: 'scale(0.9)',
                  },
                  profitMedium: { 
                    background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.6), rgba(34, 197, 94, 0.4))', 
                    color: 'white',
                    borderRadius: '1rem',
                  },
                  profitLow: { 
                    background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.4), rgba(34, 197, 94, 0.2))', 
                    color: 'white',
                    borderRadius: '1rem',
                  },
                  lossHigh: { 
                    background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.9), rgba(239, 68, 68, 0.7))', 
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '1rem',
                    transform: 'scale(0.9)',
                  },
                  lossMedium: { 
                    background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.6), rgba(239, 68, 68, 0.4))', 
                    color: 'white',
                    borderRadius: '1rem',
                  },
                  lossLow: { 
                    background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.4), rgba(239, 68, 68, 0.2))', 
                    color: 'white',
                    borderRadius: '1rem',
                  }
                }}
                components={{
                  Day: CustomDayComponent
                }}
                classNames={{
                  day_today: "bg-accent text-accent-foreground font-bold rounded-2xl shadow-sm",
                  day_selected: "bg-primary text-primary-foreground rounded-2xl shadow-md",
                  day: cn(
                    "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-2xl transition-all hover:scale-105"
                  ),
                }}
                className={cn("p-3 pointer-events-auto")}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card className="border-2 border-primary/20 shadow-lg overflow-hidden rounded-xl bg-gradient-to-b from-card to-card/95 relative group transform hover:-translate-y-1 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-background/0 opacity-80 pointer-events-none"></div>
            <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 pb-2 relative z-10">
              <div className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-md font-medium">Month Stats</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-sm font-medium">Total Profit:</span>
                  <span className={cn(
                    "font-bold",
                    monthStats.totalProfit >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {monthStats.totalProfit >= 0 ? '+' : ''}₹{monthStats.totalProfit.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="text-sm font-medium">Total Trades:</span>
                  <span className="font-bold">{monthStats.totalTrades}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Win/Loss Ratio:</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-success/20 text-success border-success">
                      {monthStats.profitDays} W
                    </Badge>
                    <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">
                      {monthStats.lossDays} L
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-primary/20 shadow-lg overflow-hidden rounded-xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-background/0 opacity-70 pointer-events-none"></div>
            <CardHeader className="bg-gradient-to-r from-primary/15 to-primary/5 pb-2 relative z-10">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                <CardTitle className="text-md font-medium">Legend</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 relative z-10">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xl bg-gradient-to-b from-success/90 to-success/70 shadow-sm"></div>
                  <span className="text-sm">High profit (≥₹500)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xl bg-gradient-to-b from-success/60 to-success/40"></div>
                  <span className="text-sm">Medium profit (₹200-₹499)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xl bg-gradient-to-b from-success/40 to-success/20"></div>
                  <span className="text-sm">Low profit (₹1-₹199)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xl bg-gradient-to-b from-destructive/40 to-destructive/20"></div>
                  <span className="text-sm">Low loss (₹1-₹199)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xl bg-gradient-to-b from-destructive/60 to-destructive/40"></div>
                  <span className="text-sm">Medium loss (₹200-₹499)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-2xl bg-gradient-to-b from-destructive/90 to-destructive/70 shadow-sm"></div>
                  <span className="text-sm">High loss (≥₹500)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <DayDetailDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        selectedDate={selectedDate} 
        tradeDays={tradeDays} 
      />
    </div>
  );
};

export default TradeCalendarView;
