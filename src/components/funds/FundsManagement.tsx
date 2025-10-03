import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, TrendingUp, TrendingDown, BarChart, Info, IndianRupee, Pencil, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn, formatIndianCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { calculateZerodhaCharges } from '@/utils/zerodhaCharges';
import { fetchUserTrades } from '@/services/trades-service';
import { fetchUserFunds, getTotalFunds, createFundsTransaction, setInitialCapital as setInitialCapitalService } from '@/services/funds-service';
import { useIsMobile, useIsSmall } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'profit' | 'loss';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
}

const FundsManagement: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [isDeposit, setIsDeposit] = useState(true);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editFundDialog, setEditFundDialog] = useState(false);
  const [initialCapital, setInitialCapital] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentCapital, setCurrentCapital] = useState(0);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [trades, setTrades] = useState<any[]>([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [totalTradesPnL, setTotalTradesPnL] = useState(0);
  const [openDepositDialog, setOpenDepositDialog] = useState(false);

  const netDeposits = totalDeposits - totalWithdrawals;
  const profitLoss = currentCapital - netDeposits;
  const profitLossPercent = netDeposits === 0 ? 0 : profitLoss / netDeposits * 100;

  const isMobile = useIsMobile();
  const isSmall = useIsSmall();

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const fundsResponse = await fetchUserFunds();
      if (fundsResponse.error) {
        console.error("Error fetching funds:", fundsResponse.error);
        return;
      }
      if (fundsResponse.data) {
        let deposits = 0;
        let withdrawals = 0;
        fundsResponse.data.forEach(fund => {
          if (fund.transaction_type === 'deposit') {
            deposits += Number(fund.amount);
          } else if (fund.transaction_type === 'withdrawal') {
            withdrawals += Number(fund.amount);
          }
        });
        
        setTotalDeposits(deposits);
        setTotalWithdrawals(withdrawals);
        
        const netDeposits = deposits - withdrawals;
        
        const tradesResponse = await fetchUserTrades();
        let totalPnL = 0;
        
        if (!tradesResponse.error && tradesResponse.data) {
          totalPnL = tradesResponse.data.reduce((sum, trade) => sum + Number(trade.pnl || 0), 0);
          setTotalTradesPnL(totalPnL);
        }
        
        setCurrentCapital(netDeposits + totalPnL);
        
        const profitLoss = totalPnL;
        const profitLossPercent = netDeposits === 0 ? 0 : profitLoss / netDeposits * 100;
        
        console.log("Net Deposits (Initial Capital):", netDeposits);
        console.log("Total P&L:", totalPnL);
        console.log("Current Capital:", netDeposits + totalPnL);
        console.log("Profit/Loss Percentage:", profitLossPercent);
        
        const processedTransactions: Transaction[] = fundsResponse.data.map(fund => ({
          id: fund.id,
          type: fund.transaction_type === 'deposit' ? 'deposit' : fund.transaction_type === 'withdrawal' ? 'withdrawal' : fund.transaction_type === 'profit' ? 'profit' : 'loss',
          amount: fund.amount,
          date: new Date(fund.date).toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          description: fund.notes || (fund.transaction_type === 'deposit' ? 'Deposit' : 'Withdrawal'),
          status: 'completed'
        }));
        
        setTransactions(processedTransactions);
      }
      
      const tradesResponse = await fetchUserTrades();
      if (tradesResponse.error) {
        console.error("Error fetching trades:", tradesResponse.error);
      } else if (tradesResponse.data) {
        setTrades(tradesResponse.data);
      }
    } catch (err) {
      console.error("Error loading funds data:", err);
      toast.error("Failed to load funds data");
    } finally {
      setIsDataLoading(false);
    }
  };

  const calculateTradingPerformance = () => {
    if (!trades || trades.length === 0) {
      return {
        netProfitLoss: 0,
        winRate: 0,
        totalBrokerage: 0
      };
    }
    
    const profitTrades = trades.filter(trade => trade.pnl > 0);
    const lossTrades = trades.filter(trade => trade.pnl < 0);
    
    const totalProfit = profitTrades.reduce((sum, trade) => sum + Number(trade.pnl), 0);
    const totalLoss = lossTrades.reduce((sum, trade) => sum + Math.abs(Number(trade.pnl)), 0);
    
    const totalBrokerage = trades.reduce((sum, trade) => {
      const tradeBrokerage = calculateZerodhaCharges({
        segment: trade.market_segment || 'equity-delivery',
        exchange: trade.exchange || 'NSE',
        entryPrice: trade.entry_price,
        exitPrice: trade.exit_price,
        quantity: trade.quantity,
        tradeType: trade.type || 'long'
      });
      return sum + tradeBrokerage;
    }, 0);
    
    const netProfitLoss = totalProfit - totalLoss - totalBrokerage;
    const totalTrades = trades.length;
    const winRate = totalTrades === 0 ? 0 : profitTrades.length / totalTrades * 100;
    
    return {
      netProfitLoss,
      winRate,
      totalBrokerage
    };
  };

  const {
    netProfitLoss,
    winRate,
    totalBrokerage
  } = calculateTradingPerformance();

  useEffect(() => {
    loadData();
    
    const handleDataUpdate = () => {
      console.log("FundsManagement detected data update event");
      loadData();
    };
    
    window.addEventListener('tradeDataUpdated', handleDataUpdate);
    window.addEventListener('fundsDataUpdated', handleDataUpdate);
    window.addEventListener('dashboardDataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('tradeDataUpdated', handleDataUpdate);
      window.removeEventListener('fundsDataUpdated', handleDataUpdate);
      window.removeEventListener('dashboardDataUpdated', handleDataUpdate);
    };
  }, []);

  const handleSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await createFundsTransaction(Number(amount), isDeposit ? 'deposit' : 'withdrawal', notes);
      
      if (error) throw error;
      
      toast.success(`Successfully ${isDeposit ? 'deposited' : 'withdrew'} ${formatIndianCurrency(Number(amount))}`);
      setAmount('');
      setNotes('');
      setOpenDialog(false);
      setOpenDepositDialog(false);
      loadData();
      
      const fundsUpdateEvent = new CustomEvent('fundsDataUpdated');
      window.dispatchEvent(fundsUpdateEvent);
    } catch (err: any) {
      console.error("Error processing funds transaction:", err);
      toast.error(err.message || `Failed to ${isDeposit ? 'deposit' : 'withdraw'} funds`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetInitialCapital = async () => {
    if (!initialCapital || isNaN(Number(initialCapital)) || Number(initialCapital) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await setInitialCapitalService(Number(initialCapital));
      
      if (response.error) {
        throw response.error;
      }
      
      setInitialCapital('');
      setEditFundDialog(false);
      loadData();
      
      const fundsUpdateEvent = new CustomEvent('fundsDataUpdated');
      window.dispatchEvent(fundsUpdateEvent);
    } catch (err: any) {
      console.error("Error setting initial capital:", err);
      toast.error(err.message || 'Failed to set initial capital');
    } finally {
      setIsLoading(false);
    }
  };

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => (
    <Card className="mb-3 border-0 shadow-sm hover:shadow transition-all">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mr-2", 
              transaction.type === 'deposit' ? "bg-success/10 text-success" : 
              transaction.type === 'withdrawal' ? "bg-destructive/10 text-destructive" : 
              transaction.type === 'profit' ? "bg-blue-500/10 text-blue-500" : 
              "bg-orange-500/10 text-orange-500"
            )}>
              {transaction.type === 'deposit' && <ArrowUpRight className="w-4 h-4" />}
              {transaction.type === 'withdrawal' && <ArrowDownRight className="w-4 h-4" />}
              {transaction.type === 'profit' && <TrendingUp className="w-4 h-4" />}
              {transaction.type === 'loss' && <TrendingDown className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-medium capitalize">{transaction.type}</div>
              <div className="text-xs text-muted-foreground">{transaction.date}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={cn("font-semibold", 
              transaction.type === 'deposit' || transaction.type === 'profit' ? "text-success" : "text-destructive"
            )}>
              {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}
              {formatIndianCurrency(transaction.amount)}
            </div>
            <div className={cn("text-xs rounded-full px-2 py-0.5 inline-block", 
              transaction.status === 'completed' ? "bg-success/10 text-success" : 
              transaction.status === 'pending' ? "bg-orange-500/10 text-orange-500" : 
              "bg-destructive/10 text-destructive"
            )}>
              {transaction.status}
            </div>
          </div>
        </div>
        {transaction.description && (
          <div className="text-xs text-muted-foreground mt-2 truncate">
            {transaction.description}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 md:space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="h-full overflow-hidden border-0 shadow-md bg-gradient-to-br from-card/80 to-background backdrop-blur-sm relative">
            <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 bg-primary/10 rounded-full blur-xl"></div>
            <CardHeader className={cn("pb-2", isMobile && "p-4")}>
              <CardTitle className={cn("text-xl font-semibold flex items-center gap-2", isMobile && "text-lg")}>
                <IndianRupee className={cn("text-primary", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                Current Capital
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(isMobile && "p-4 pt-0")}>
              {isDataLoading ? (
                <Skeleton className="h-12 w-3/4 mt-2" />
              ) : (
                <div className="mt-2">
                  <div className="flex flex-col">
                    <span className={cn("text-3xl font-bold tracking-tight text-foreground py-[12px]", isMobile && "text-2xl py-[8px]")}>
                      {formatIndianCurrency(currentCapital)}
                    </span>
                    <div className={cn(
                      "mt-1 text-sm flex flex-wrap items-center gap-2",
                      totalTradesPnL >= 0 ? "text-success" : "text-destructive",
                      isMobile && "text-xs"
                    )}>
                      {totalTradesPnL >= 0 ? (
                        <TrendingUp className={cn("mr-1 text-success", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                      ) : (
                        <TrendingDown className={cn("mr-1 text-destructive", isMobile ? "h-3 w-3" : "h-4 w-4")} />
                      )}
                      <span className={cn(
                        "font-semibold",
                        totalTradesPnL >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {totalTradesPnL >= 0 ? '+' : ''} {formatIndianCurrency(Math.abs(totalTradesPnL))}
                      </span>
                      {netDeposits > 0 && (
                        <span className={cn(
                          "ml-1 text-sm font-medium rounded-full px-2 py-0.5",
                          totalTradesPnL >= 0
                            ? "bg-success/10 text-success border border-success/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20",
                          isMobile && "text-xs px-1.5 py-0.5"
                        )}>
                          {(totalTradesPnL / netDeposits * 100).toFixed(2)}%
                        </span>
                      )}
                      <span className="text-muted-foreground ml-1">profit/loss</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="h-full overflow-hidden border-0 shadow-md bg-gradient-to-br from-card/80 to-background backdrop-blur-sm relative">
            <div className="absolute top-0 left-0 w-32 h-32 -ml-12 -mt-12 bg-success/10 rounded-full blur-xl"></div>
            <CardHeader className={cn("pb-2", isMobile && "p-4")}>
              <CardTitle className={cn("text-xl font-semibold flex items-center gap-2", isMobile && "text-lg")}>
                <BarChart className={cn("text-success", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                Trading Performance
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(isMobile && "p-4 pt-0")}>
              {isDataLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Net P&L</span>
                    </div>
                    <span className={cn(
                      "font-semibold", 
                      netProfitLoss >= 0 ? "text-success" : "text-destructive",
                      isMobile ? "text-base" : "text-lg"
                    )}>
                      {netProfitLoss >= 0 ? "+" : ""}
                      {formatIndianCurrency(netProfitLoss)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Win Rate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn("font-semibold", isMobile ? "text-base" : "text-lg")}>{Math.round(winRate)}%</span>
                      <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${winRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span className={cn("text-muted-foreground", isMobile ? "text-xs" : "text-sm")}>Total Fees</span>
                    </div>
                    <span className={cn("font-semibold text-destructive", isMobile ? "text-base" : "text-lg")}>
                      -{formatIndianCurrency(totalBrokerage)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full overflow-hidden border-0 shadow-md bg-gradient-to-br from-card/80 to-background backdrop-blur-sm relative">
            <div className="absolute bottom-0 right-0 w-32 h-32 -mr-12 -mb-12 bg-purple-500/10 rounded-full blur-xl"></div>
            <CardHeader className={cn("pb-2", isMobile && "p-4")}>
              <CardTitle className={cn("text-xl font-semibold flex items-center gap-2", isMobile && "text-lg")}>
                <IndianRupee className={cn("text-primary", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                Capital Management
              </CardTitle>
            </CardHeader>
            <CardContent className={cn("flex flex-col gap-3", isMobile && "p-4 pt-0")}>
              <Dialog open={editFundDialog} onOpenChange={setEditFundDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full rounded-lg font-medium bg-gradient-to-r from-primary/90 to-purple-500/90 text-primary-foreground hover:from-primary hover:to-purple-500 transition-all duration-300 border-0" 
                    size={isMobile ? "default" : "lg"}
                  >
                    <Pencil className={cn("mr-2", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                    Edit Fund
                  </Button>
                </DialogTrigger>
                <DialogContent className={cn("sm:max-w-[425px]", isMobile && "w-[95%] p-4")}>
                  <DialogHeader>
                    <DialogTitle className={cn("text-2xl font-bold", isMobile && "text-xl")}>Edit Fund</DialogTitle>
                    <DialogDescription>
                      Set your starting capital for trading
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="initialCapital" className={cn("text-base", isMobile && "text-sm")}>Initial Capital</Label>
                      <div className="relative">
                        <IndianRupee className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="initialCapital"
                          type="number"
                          className="pl-10"
                          value={initialCapital}
                          onChange={e => setInitialCapital(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleSetInitialCapital}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Processing..." : "Set Initial Capital"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={openDepositDialog} onOpenChange={open => {
                setOpenDepositDialog(open);
                if (open) setIsDeposit(true);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline"
                    className={cn(
                      "w-full rounded-lg font-medium bg-success/5 hover:bg-success/10 text-success border border-success/30",
                      isMobile && "text-sm"
                    )}
                    size={isMobile ? "default" : "lg"}
                    onClick={() => {
                      setIsDeposit(true);
                      setOpenDepositDialog(true);
                    }}
                  >
                    <ArrowUpRight className={cn("mr-2", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                    Deposit Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className={cn("sm:max-w-[425px]", isMobile && "w-[95%] p-4")}>
                  <DialogHeader>
                    <DialogTitle className={cn("text-2xl font-bold", isMobile && "text-xl")}>Deposit Funds</DialogTitle>
                    <DialogDescription>
                      Add capital to your trading account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="depositAmount" className={cn("text-base", isMobile && "text-sm")}>Amount</Label>
                      <div className="relative">
                        <IndianRupee className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="depositAmount"
                          type="number"
                          className="pl-10"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className={cn("text-base", isMobile && "text-sm")}>Notes (Optional)</Label>
                      <Input 
                        id="notes"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Source of funds"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? "Processing..." : "Confirm Deposit"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={openDialog && !isDeposit} onOpenChange={open => {
                setOpenDialog(open);
                if (open) setIsDeposit(false);
              }}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "w-full rounded-lg font-medium bg-destructive/5 hover:bg-destructive/10 text-destructive border border-destructive/30",
                      isMobile && "text-sm"
                    )} 
                    size={isMobile ? "default" : "lg"}
                    onClick={() => {
                      setIsDeposit(false);
                      setOpenDialog(true);
                    }}
                  >
                    <ArrowDownRight className={cn("mr-2", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                    Withdraw Funds
                  </Button>
                </DialogTrigger>
                <DialogContent className={cn("sm:max-w-[425px]", isMobile && "w-[95%] p-4")}>
                  <DialogHeader>
                    <DialogTitle className={cn("text-2xl font-bold", isMobile && "text-xl")}>Withdraw Funds</DialogTitle>
                    <DialogDescription>
                      Remove capital from your trading account
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className={cn("text-base", isMobile && "text-sm")}>Amount</Label>
                      <div className="relative">
                        <IndianRupee className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="amount" 
                          type="number" 
                          className="pl-10" 
                          value={amount} 
                          onChange={e => setAmount(e.target.value)} 
                          placeholder="0.00" 
                          max={currentCapital} 
                        />
                      </div>
                      {Number(amount) > currentCapital && (
                        <p className="text-xs text-destructive mt-1">
                          Withdrawal amount cannot exceed current capital of {formatIndianCurrency(currentCapital)}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className={cn("text-base", isMobile && "text-sm")}>Notes (Optional)</Label>
                      <Input 
                        id="notes" 
                        value={notes} 
                        onChange={e => setNotes(e.target.value)} 
                        placeholder="Reason for this withdrawal" 
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={isLoading || Number(amount) > currentCapital} 
                      className="w-full" 
                      variant="outline"
                    >
                      {isLoading ? "Processing..." : "Confirm Withdrawal"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {transactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-md bg-card/90 backdrop-blur-sm">
            <CardHeader className={cn(isMobile && "px-4 py-3")}>
              <CardTitle className={cn("text-xl font-medium", isMobile && "text-lg")}>
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <div className={cn("px-6 pb-6", isMobile && "px-4 pb-4")}>
              {isMobile ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map(transaction => (
                    <TransactionCard key={transaction.id} transaction={transaction} />
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="hidden md:table-cell">Description</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.slice(0, 5).map(transaction => (
                        <TableRow key={transaction.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div className="flex items-center">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center mr-2",
                                transaction.type === 'deposit' ? "bg-success/10 text-success" : 
                                transaction.type === 'withdrawal' ? "bg-destructive/10 text-destructive" : 
                                transaction.type === 'profit' ? "bg-blue-500/10 text-blue-500" : 
                                "bg-orange-500/10 text-orange-500"
                              )}>
                                {transaction.type === 'deposit' && <ArrowUpRight className="w-4 h-4" />}
                                {transaction.type === 'withdrawal' && <ArrowDownRight className="w-4 h-4" />}
                                {transaction.type === 'profit' && <TrendingUp className="w-4 h-4" />}
                                {transaction.type === 'loss' && <TrendingDown className="w-4 h-4" />}
                              </div>
                              <span className="capitalize">{transaction.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "font-medium",
                              transaction.type === 'deposit' || transaction.type === 'profit' ? "text-success" : "text-destructive"
                            )}>
                              {transaction.type === 'deposit' || transaction.type === 'profit' ? '+' : '-'}
                              {formatIndianCurrency(transaction.amount)}
                            </span>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {transaction.date}
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-muted-foreground">
                            {transaction.description}
                          </TableCell>
                          <TableCell>
                            <span className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                              transaction.status === 'completed' ? "bg-success/10 text-success" : 
                              transaction.status === 'pending' ? "bg-orange-500/10 text-orange-500" : 
                              "bg-destructive/10 text-destructive"
                            )}>
                              {transaction.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default FundsManagement;
