
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Brain, Lightbulb, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { useEmotionUtils } from '@/hooks/use-emotion-utils';

const emotionData = [{
  name: 'focused',
  value: 8,
  pnl: 127000
}, {
  name: 'calm',
  value: 3,
  pnl: -35500
}, {
  name: 'confident',
  value: 1,
  pnl: 14000
}, {
  name: 'anxious',
  value: 1,
  pnl: 88700
}, {
  name: 'frustrated',
  value: 1,
  pnl: 12000
}, {
  name: 'excited',
  value: 1,
  pnl: -11000
}];

// Emotion Pie Chart Component to isolate rendering logic
const EmotionPieChart = ({ animatedData }) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const { processEmotionData } = useEmotionUtils();
  
  // Process the data to get colors and emojis
  const processedData = processEmotionData(animatedData);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const renderPieLabel = ({
    name,
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius
  }) => {
    const emoji = processedData.find(item => item.name === name)?.emoji || '😐';
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <motion.text 
        x={x} 
        y={y} 
        textAnchor="middle" 
        dominantBaseline="middle" 
        style={{ fontSize: '1rem' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: 0
        }}
        transition={{ 
          duration: 0.5,
          delay: 1.5 + (midAngle / 360) * 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
      >
        {emoji}
      </motion.text>
    );
  };

  if (!mounted || !animatedData?.length) {
    return <div className="h-[300px] flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  // Mobile-specific chart rendering
  if (isMobile) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <PieChart width={280} height={280}>
          <Pie 
            data={processedData} 
            cx={140} 
            cy={140} 
            innerRadius={60} 
            outerRadius={90} 
            paddingAngle={3} 
            dataKey="value" 
            labelLine={false}
            label={({name}) => processedData.find(item => item.name === name)?.emoji || '😐'}
            isAnimationActive={false}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={entry.color} 
                strokeWidth={2} 
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background/95 p-3 rounded-lg border border-border shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{data.emoji}</span>
                      <span className="font-medium capitalize">{data.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {data.value} trades
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      P&L: {data.pnl >= 0 ? '+' : ''}{data.pnl.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            }} 
          />
        </PieChart>
      </div>
    );
  }

  return (
    <div className="h-[300px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={processedData} 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={90} 
            paddingAngle={3} 
            dataKey="value" 
            labelLine={false} 
            label={renderPieLabel}
            isAnimationActive={false}
          >
            {processedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                stroke={entry.color} 
                strokeWidth={2} 
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background/95 p-3 rounded-lg border border-border shadow-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{data.emoji}</span>
                      <span className="font-medium capitalize">{data.name}</span>
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {data.value} trades
                    </div>
                    <div className="mt-1 text-sm font-medium">
                      P&L: {data.pnl >= 0 ? '+' : ''}{data.pnl.toLocaleString('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      })}
                    </div>
                  </div>
                );
              }
              return null;
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const EmotionalAnalysisSection = () => {
  const [animatedData, setAnimatedData] = useState(
    emotionData.map(item => ({ ...item, value: 0 }))
  );
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const animationDuration = 1500;
    const stepTime = 20;
    const steps = animationDuration / stepTime;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      const newData = emotionData.map(item => ({
        ...item,
        value: Math.floor(item.value * Math.min(1, progress * 1.2))
      }));
      
      setAnimatedData(newData);
      
      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedData(emotionData);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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

  return (
    <section className="py-24 px-4 bg-background/90 backdrop-blur-sm relative overflow-hidden">
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Emotional Intelligence
                </motion.span>
                <h2 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent py-[6px]">
                  Track Your <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">Trading</span> Psychology
                </h2>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Monitor how your emotions affect your trading decisions and learn to maintain consistency through data-driven insights.
              </p>
            </div>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              {emotionData.map(emotion => (
                <motion.div 
                  key={emotion.name}
                  variants={itemVariants}
                  className="p-3 rounded-lg bg-primary/5 border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-all duration-300 flex items-center gap-2"
                >
                  <span className="text-xl">{useEmotionUtils().processEmotionData([emotion])[0].emoji}</span>
                  <div>
                    <span className="text-sm font-medium capitalize">{emotion.name}</span>
                    <p className="text-xs text-muted-foreground">{emotion.value} trades</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <div className="bg-gradient-to-r from-primary/10 to-purple/10 p-4 rounded-lg border border-primary/10">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Lightbulb className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Trading Insight</h3>
                  <p className="text-sm text-muted-foreground">
                    Our analysis shows that you're 62% more profitable when trading in a focused state. Consider techniques to maintain this emotional state.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary group shadow-sm">
                <Link to="/features/emotions" className="flex items-center gap-2">
                  Explore Emotion Tracking
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <Card className="border-primary/20 bg-card/90 hover:border-primary/40 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-primary/5">
              <CardContent className="pt-6">
                <motion.div 
                  className="flex justify-between items-center mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="font-semibold text-lg">Emotional Distribution</h3>
                  <motion.span 
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Last 30 days
                  </motion.span>
                </motion.div>
                
                <EmotionPieChart animatedData={animatedData} />
                
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    <div>
                      <p className="text-sm text-muted-foreground">Most profitable emotion</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl">🧠</span>
                        <span className="font-medium">Focused</span>
                        <span className="text-success text-sm">+₹127,000</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Least profitable emotion</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xl">😌</span>
                        <span className="font-medium">Calm</span>
                        <span className="text-destructive text-sm">-₹35,500</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalAnalysisSection;
