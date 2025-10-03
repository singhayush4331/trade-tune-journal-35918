import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  TrendingUp, 
  TrendingDown, 
  Monitor, 
  Eye, 
  Users,
  DollarSign,
  Target,
  BarChart3,
  Zap
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const LiveTradingDemo = () => {
  const isMobile = useIsMobile();
  const [currentPrice, setCurrentPrice] = useState(2450.75);
  const [isLive, setIsLive] = useState(true);
  const [pnl, setPnl] = useState(0);
  const [tradeCount, setTradeCount] = useState(0);

  // Simulate live price movements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.5) * 10;
        return Math.max(prev + change, 2400);
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate P&L updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPnl(prev => prev + (Math.random() - 0.3) * 500);
      setTradeCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const orders = [
    { symbol: "RELIANCE", type: "BUY", qty: 100, price: 2450.75, status: "FILLED" },
    { symbol: "TCS", type: "SELL", qty: 50, price: 3820.40, status: "PENDING" },
    { symbol: "HDFC", type: "BUY", qty: 200, price: 1654.30, status: "FILLED" }
  ];

  const watchlist = [
    { symbol: "NIFTY", price: 19825.35, change: +124.75, changePercent: +0.63 },
    { symbol: "SENSEX", price: 66795.14, change: +342.87, changePercent: +0.51 },
    { symbol: "BANKNIFTY", price: 45234.80, change: -156.25, changePercent: -0.34 }
  ];

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-success/10 text-success border-success/20 mb-4">
            <Play className="h-4 w-4 mr-2" />
            Live Trading Sessions
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6`}>
            Watch Live Trading in Action
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            Join our daily live trading sessions and learn from expert traders as they execute real trades
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Live Trading Interface */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <Card className="p-0 overflow-hidden border-primary/10 bg-card/60 backdrop-blur-sm">
              {/* Trading Platform Header */}
              <div className="bg-background/80 border-b border-primary/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold">Haven ARK Trading Platform</h3>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatePresence>
                    {isLive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-500 font-medium">LIVE</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Eye className="h-3 w-3 mr-1" />
                    247 watching
                  </Badge>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Live Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-background/40 border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">NIFTY</span>
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <motion.div 
                      key={currentPrice}
                      initial={{ scale: 1.05, color: "#22c55e" }}
                      animate={{ scale: 1, color: "inherit" }}
                      className="text-lg font-bold"
                    >
                      ₹{currentPrice.toFixed(2)}
                    </motion.div>
                    <span className="text-xs text-success">+124.75 (0.63%)</span>
                  </Card>

                  <Card className="p-4 bg-background/40 border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">P&L</span>
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <motion.div 
                      key={Math.floor(pnl)}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      className={`text-lg font-bold ${pnl >= 0 ? 'text-success' : 'text-destructive'}`}
                    >
                      ₹{pnl.toFixed(0)}
                    </motion.div>
                    <span className="text-xs text-muted-foreground">Today's P&L</span>
                  </Card>

                  <Card className="p-4 bg-background/40 border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Trades</span>
                      <Target className="h-4 w-4 text-primary" />
                    </div>
                    <motion.div 
                      key={tradeCount}
                      initial={{ scale: 1.05 }}
                      animate={{ scale: 1 }}
                      className="text-lg font-bold"
                    >
                      {tradeCount}
                    </motion.div>
                    <span className="text-xs text-muted-foreground">Executed</span>
                  </Card>

                  <Card className="p-4 bg-background/40 border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Win Rate</span>
                      <BarChart3 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-lg font-bold">78%</div>
                    <span className="text-xs text-muted-foreground">This week</span>
                  </Card>
                </div>

                {/* Order Book */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Recent Orders
                  </h4>
                  <div className="space-y-2">
                    {orders.map((order, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-primary/10"
                      >
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={order.type === 'BUY' ? 'default' : 'destructive'}
                            className={order.type === 'BUY' ? 'bg-success/10 text-success border-success/20' : ''}
                          >
                            {order.type}
                          </Badge>
                          <div>
                            <span className="font-medium">{order.symbol}</span>
                            <span className="text-sm text-muted-foreground ml-2">Qty: {order.qty}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">₹{order.price}</div>
                          <Badge 
                            variant={order.status === 'FILLED' ? 'default' : 'outline'}
                            className={order.status === 'FILLED' ? 'bg-success/10 text-success border-success/20 text-xs' : 'text-xs'}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Watchlist */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Monitor className="h-4 w-4 text-primary" />
                    Market Watchlist
                  </h4>
                  <div className="space-y-2">
                    {watchlist.map((stock, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-background/40 rounded-lg border border-primary/10"
                      >
                        <span className="font-medium">{stock.symbol}</span>
                        <div className="text-right">
                          <div className="font-medium">₹{stock.price.toFixed(2)}</div>
                          <div className={`text-sm flex items-center gap-1 ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                            {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Live Session Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6 border-primary/10 bg-gradient-to-br from-primary/5 to-purple-500/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold">Live Session Active</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Join our mentor as they trade live and explain their decision-making process in real-time.
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    247 viewers
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="h-4 w-4" />
                    2h 15m
                  </div>
                </div>
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Join Live Session
                </Button>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-primary/10">
                <h3 className="text-lg font-semibold mb-4">Today's Session Topics</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Market Opening Analysis</span>
                      <p className="text-sm text-muted-foreground">Pre-market analysis and key levels to watch</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Educational Demonstrations</span>
                      <p className="text-sm text-muted-foreground">Trading concepts with educational explanations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Risk Management</span>
                      <p className="text-sm text-muted-foreground">Position sizing and stop-loss strategies</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <span className="font-medium">Q&A Session</span>
                      <p className="text-sm text-muted-foreground">Live questions from community members</p>
                    </div>
                  </li>
                </ul>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 border-primary/10">
                <h3 className="text-lg font-semibold mb-4">Upcoming Sessions</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Options Strategy Deep Dive</span>
                      <p className="text-sm text-muted-foreground">Tomorrow, 9:30 AM</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Scheduled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Weekly Market Review</span>
                      <p className="text-sm text-muted-foreground">Friday, 4:00 PM</p>
                    </div>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Scheduled
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LiveTradingDemo;