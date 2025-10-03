import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Target, Zap, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FloatingDashboardProps {
  mousePosition: { x: number; y: number };
}

export const FloatingDashboard: React.FC<FloatingDashboardProps> = ({ mousePosition }) => {
  const tradingData = [
    { symbol: 'AAPL', change: '+2.45%', profit: '+$1,240', trend: 'up' },
    { symbol: 'TSLA', change: '+5.67%', profit: '+$2,180', trend: 'up' },
    { symbol: 'NVDA', change: '-1.23%', profit: '-$340', trend: 'down' },
  ];

  return (
    <motion.div 
      className="relative w-full max-w-lg mx-auto transform-3d"
      style={{
        transform: `rotateY(${mousePosition.x * 0.1}deg) rotateX(${-mousePosition.y * 0.1}deg)`
      }}
    >
      {/* Main Dashboard Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="glass-strong rounded-3xl p-8 shadow-floating hover-lift"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Trading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Real-time Analytics</p>
          </div>
          <Badge className="bg-success/20 text-success animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div 
            className="glass-card p-4 rounded-xl hover-lift"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total P&L</span>
            </div>
            <p className="text-2xl font-bold text-success">+₹2.8L</p>
            <span className="text-xs text-success flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +18.5%
            </span>
          </motion.div>

          <motion.div 
            className="glass-card p-4 rounded-xl hover-lift"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Win Rate</span>
            </div>
            <p className="text-2xl font-bold">74%</p>
            <span className="text-xs text-success flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              +4.2%
            </span>
          </motion.div>
        </div>

        {/* Recent Trades */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground">Recent Trades</h4>
          {tradingData.map((trade, index) => (
            <motion.div
              key={trade.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
              className="glass-card p-3 rounded-lg flex items-center justify-between hover-lift"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  trade.trend === 'up' ? 'bg-success/20' : 'bg-destructive/20'
                }`}>
                  {trade.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-destructive" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{trade.symbol}</p>
                  <p className={`text-xs ${
                    trade.trend === 'up' ? 'text-success' : 'text-destructive'
                  }`}>
                    {trade.change}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${
                  trade.trend === 'up' ? 'text-success' : 'text-destructive'
                }`}>
                  {trade.profit}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        className="absolute -top-6 -right-6 glass-card p-3 rounded-full shadow-floating"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <TrendingUp className="w-6 h-6 text-success" />
      </motion.div>

      <motion.div
        className="absolute -bottom-4 -left-4 glass-card p-3 rounded-full shadow-floating"
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      >
        <BarChart3 className="w-6 h-6 text-primary" />
      </motion.div>
    </motion.div>
  );
};