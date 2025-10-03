import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, BookTemplate, Check, Star, TrendingUp, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Define strategy template categories
const strategyTemplates = [
  {
    category: 'Smart Money Concepts',
    icon: <Target className="h-5 w-5 text-purple-400" />,
    description: 'Strategies based on institutional order flow and liquidity',
    strategies: [
      {
        id: 'smc-1',
        name: 'Liquidity Grab Strategy',
        description: 'Trade institutional stop hunts and liquidity grabs',
        tags: ['smart money', 'liquidity', 'institutional'],
        entryRules: '1. Identify significant swing high/low where stop losses are clustered\n2. Wait for price to sweep the level (take out stops)\n3. Look for rejection candle pattern (e.g., pinbar, engulfing)\n4. Enter when price reverses back above/below the swept level\n5. Use narrow stops below/above the rejection candle',
        exitRules: '1. Take partial profit at previous support/resistance\n2. Take remaining profit at fair value gap (FVG) or imbalance\n3. Use trailing stop after 1.5R profit\n4. Exit if order flow shows weakening momentum',
        riskReward: '1:3',
        notes: 'Works best in ranging markets at significant levels. Look for previous rejection at the level for added confluence.'
      },
      {
        id: 'smc-2',
        name: 'Order Block Strategy',
        description: 'Trade from institutional order blocks and mitigation',
        tags: ['smart money', 'order blocks', 'mitigation'],
        entryRules: '1. Identify strong impulsive move creating a break of structure\n2. Find the last candle before the impulse (order block)\n3. Wait for price to retrace to the order block\n4. Confirm entry with rejection candle pattern\n5. Enter at the first sign of reversal from the order block',
        exitRules: '1. Target previous equal highs/lows\n2. Target untapped liquidity (stop clusters)\n3. Use 1:3 minimum risk-reward ratio\n4. Trail stop once price moves 2R in profit',
        riskReward: '1:3 to 1:5',
        notes: 'Higher timeframe order blocks take precedence. Look for confirming candle patterns at the order block level.'
      },
      {
        id: 'smc-3',
        name: 'Fair Value Gap Strategy',
        description: 'Trade price returning to fill fair value gaps',
        tags: ['smart money', 'fair value gap', 'imbalance'],
        entryRules: '1. Identify a fair value gap (area skipped during strong impulsive move)\n2. Wait for price to retrace to the FVG level\n3. Look for rejection (if countertrend) or continuation (if with trend) at FVG\n4. Enter with limit order at FVG boundary\n5. Place stop beyond the opposite FVG boundary',
        exitRules: '1. Take profit at the next significant support/resistance level\n2. Target previous swing points\n3. Use 1:2 minimum risk-reward\n4. Exit if price closes beyond FVG in wrong direction',
        riskReward: '1:2 to 1:4',
        notes: 'Higher timeframe FVGs are more significant. Unfilled FVGs act as magnets for price to return to.'
      },
      {
        id: 'smc-4',
        name: 'Breaker Block Strategy',
        description: 'Trade from key breaker blocks after structure shifts',
        tags: ['smart money', 'breaker', 'structure'],
        entryRules: '1. Identify a strong break of market structure (BMS)\n2. Locate the last opposing candle before the BMS (breaker block)\n3. Wait for price to return to the breaker block area\n4. Look for a rejection and momentum shift at the breaker\n5. Enter after confirmation candle forms at the breaker',
        exitRules: '1. Target the origin of the breaker block\n2. Take profit at equal highs/lows beyond breaker\n3. Use 1:3 risk-reward as minimum\n4. Trail stop after price moves 2R in your favor',
        riskReward: '1:3 to 1:5',
        notes: 'Breakers work best when combined with additional SMC concepts like liquidity and order blocks. Higher timeframe breakers have priority.'
      },
      {
        id: 'smc-5',
        name: 'Inducement Strategy',
        description: 'Trade from engineered moves designed to induce retail traders',
        tags: ['smart money', 'inducement', 'manipulation'],
        entryRules: '1. Identify a potential manipulation area (significant S/R, round numbers)\n2. Look for aggressive price move that appears to break the level\n3. Wait for quick rejection back into range (manipulation)\n4. Enter in direction of the rejection after confirmation\n5. Place stop beyond the inducement wick',
        exitRules: '1. First target at previous significant swing high/low\n2. Final target at opposite range extreme\n3. Implement trailing stop after 1:1 is achieved\n4. Exit full position if price action shows signs of reversal',
        riskReward: '1:2 to 1:4',
        notes: 'Manipulation occurs most frequently around high-impact news events and at significant psychological levels. Look for unusually aggressive moves.'
      },
      {
        id: 'smc-6',
        name: 'Equal Highs/Lows Strategy',
        description: 'Trade institutional stop hunts at equal swing points',
        tags: ['smart money', 'equal levels', 'swing'],
        entryRules: '1. Identify a series of equal highs or lows on the chart\n2. Wait for price to sweep these equal levels (taking out stops)\n3. Look for immediate rejection from the level (indicating stop hunt)\n4. Enter after confirmation candle (engulfing, pin bar)\n5. Place tight stop beyond the sweep wick',
        exitRules: '1. Target first take profit at nearest support/resistance\n2. Final target at opposite side equal levels\n3. Move stop to break-even after 1:1 is achieved\n4. Trail stop beneath/above new swing formations',
        riskReward: '1:2 minimum',
        notes: 'Equal highs/lows often represent institutional stop hunt locations. The more equal levels that align, the stronger the setup.'
      }
    ]
  },
  {
    category: 'Price Action',
    icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
    description: 'Patterns and structures based on pure price movement',
    strategies: [
      {
        id: 'pa-1',
        name: 'Inside Bar Strategy',
        description: 'Trade breakouts from inside bar formations',
        tags: ['price action', 'inside bar', 'volatility'],
        entryRules: '1. Identify an inside bar (bar completely within range of prior bar)\n2. Preferably look for inside bars after strong moves\n3. Enter on break of inside bar high (bullish) or low (bearish)\n4. Confirm entry with volume increase\n5. Place stop loss beyond opposite side of inside bar',
        exitRules: '1. Take profit at previous significant support/resistance\n2. Use trailing stop once profit exceeds 1.5R\n3. Exit if momentum wanes (indicated by volume decrease)\n4. Partial profit at 2R, let remainder run',
        riskReward: '1:2 to 1:3',
        notes: 'Works best in trending markets. Multiple consecutive inside bars increase pattern strength.'
      },
      {
        id: 'pa-2',
        name: 'Pin Bar Reversal',
        description: 'Trade reversals using pin bar candle patterns',
        tags: ['price action', 'pin bar', 'reversal'],
        entryRules: '1. Identify a pin bar (long wick, small body) at support/resistance\n2. Ensure pin bar is rejecting a key level\n3. Look for volume expansion on the pin bar\n4. Enter on close of pin bar or break of pin bar 50% level\n5. Stop loss beyond the end of the pin bar wick',
        exitRules: '1. Take profit at previous swing high/low\n2. Use 2:1 minimum reward:risk ratio\n3. Trail stop once 1.5R profit is achieved\n4. Exit if consecutive candles close against your position',
        riskReward: '1:2 minimum',
        notes: 'Pin bars at key support/resistance or trend lines are more reliable. Look for confirmation candles after pin bar.'
      },
      {
        id: 'pa-3',
        name: 'Break and Retest',
        description: 'Trade retests of broken support/resistance levels',
        tags: ['price action', 'break and retest', 'support resistance'],
        entryRules: '1. Identify clear support/resistance level\n2. Wait for decisive break of the level (close beyond)\n3. Look for price to return to retest the broken level\n4. Enter when price shows rejection from retested level\n5. Place stop beyond the retest swing point',
        exitRules: '1. Target next major support/resistance level\n2. Use at least 1:2 risk-reward ratio\n3. Trail stop as price makes new highs/lows\n4. Exit on first sign of trend exhaustion',
        riskReward: '1:2 to 1:4',
        notes: 'Higher timeframe levels provide more reliable retests. Look for volume contraction during retest and expansion after.'
      },
      {
        id: 'pa-4',
        name: 'Bullish/Bearish Engulfing Pattern',
        description: 'Trade reversals with engulfing candle patterns',
        tags: ['price action', 'engulfing', 'reversal'],
        entryRules: '1. Identify an engulfing candle (completely engulfs previous candle)\n2. Ensure the engulfing candle forms at key support/resistance\n3. Look for increased volume on the engulfing candle\n4. Enter at close of engulfing candle or open of following candle\n5. Place stop beyond the opposite side of the engulfing pattern',
        exitRules: '1. Target prior swing high/low\n2. Use minimum 1:2 risk-reward ratio\n3. Move stop to break-even after 1R gained\n4. Exit if price closes beyond midpoint of engulfing candle',
        riskReward: '1:2 to 1:3',
        notes: 'Engulfing patterns are stronger when they engulf multiple previous candles. Works best at the end of extended trends.'
      },
      {
        id: 'pa-5',
        name: 'Triple Tap Pattern',
        description: 'Trade reversals after triple tests of key levels',
        tags: ['price action', 'triple tap', 'reversal'],
        entryRules: '1. Identify three consecutive tests of the same support/resistance level\n2. Look for decreasing momentum on each test (smaller candles)\n3. Watch for reversal signal on the third tap (pin bar, engulfing)\n4. Enter after confirmation of reversal (close beyond previous candle high/low)\n5. Place stop beyond the extreme of the third tap',
        exitRules: '1. Target first profit at previous swing high/low\n2. Final target at the source of the move before the triple tap\n3. Trail stop after 2R profit is achieved\n4. Exit if price action indicates trend resumption',
        riskReward: '1:2 to 1:4',
        notes: 'Triple taps often indicate exhaustion at key levels. Can also be used with double tops/bottoms with slightly modified rules.'
      },
      {
        id: 'pa-6',
        name: 'Momentum Continuation Strategy',
        description: 'Trade continuation after strong trend impulses',
        tags: ['price action', 'momentum', 'continuation'],
        entryRules: '1. Identify a strong impulse move in the direction of the trend\n2. Wait for a shallow pullback (30-50% retracement)\n3. Look for a consolidation pattern (flag, pennant, etc.)\n4. Enter on break of consolidation in trend direction\n5. Place stop below/above the consolidation pattern',
        exitRules: '1. Target measured move (height of impulse projected from breakout)\n2. Take partial profits at 1:1 and 2:1\n3. Trail stop for remainder of position\n4. Exit if price makes lower low (uptrend) or higher high (downtrend)',
        riskReward: '1:2 to 1:4',
        notes: 'Works best in strong trending markets. The shallower the retracement, the stronger the trend continuation signal.'
      }
    ]
  },
  {
    category: 'Institutional Trading',
    icon: <Zap className="h-5 w-5 text-amber-400" />,
    description: 'Strategies focused on institutional order flow and market structure',
    strategies: [
      {
        id: 'inst-1',
        name: 'Wyckoff Accumulation',
        description: 'Trade institutional accumulation phases using Wyckoff method',
        tags: ['institutional', 'wyckoff', 'accumulation'],
        entryRules: '1. Identify accumulation range after downtrend\n2. Look for signs of selling climax, automatic rally, secondary test\n3. Wait for spring or shakeout (false breakout below range)\n4. Enter after sign of strength (strong up move) post-spring\n5. Place stop below the spring low',
        exitRules: '1. First target at top of accumulation range\n2. Second target at measured move (range height projected upward)\n3. Trail stops as new higher lows form\n4. Exit fully when distribution signs appear',
        riskReward: '1:3 minimum',
        notes: 'Requires patience as accumulation phases can take time. Volume analysis critical for confirmation.'
      },
      {
        id: 'inst-2',
        name: 'Wyckoff Distribution',
        description: 'Trade institutional distribution phases using Wyckoff method',
        tags: ['institutional', 'wyckoff', 'distribution'],
        entryRules: '1. Identify distribution range after uptrend\n2. Look for buying climax, automatic reaction, secondary test\n3. Wait for upthrust (false breakout above range)\n4. Enter short after sign of weakness post-upthrust\n5. Place stop above the upthrust high',
        exitRules: '1. First target at bottom of distribution range\n2. Second target at measured move (range height projected downward)\n3. Trail stops as new lower highs form\n4. Exit fully when accumulation signs appear',
        riskReward: '1:3 minimum',
        notes: 'Most effective in high-volume liquid markets. Compare relative volume on up vs down moves.'
      },
      {
        id: 'inst-3',
        name: 'Market Structure Shift',
        description: 'Trade changes in market structure with break of market structure (BMS)',
        tags: ['institutional', 'structure', 'BMS'],
        entryRules: '1. Identify series of higher highs/lows (uptrend) or lower highs/lows (downtrend)\n2. Wait for break of structure (lower low in uptrend or higher high in downtrend)\n3. Look for retest of broken structure\n4. Enter after confirmation of new trend direction\n5. Stop loss above/below the swing that created the BMS',
        exitRules: '1. Target previous opposite structure points\n2. Use minimum 1:2 risk-reward\n3. Trail stop using new market structure points\n4. Exit full position when opposing BMS occurs',
        riskReward: '1:2.5 typical',
        notes: 'Higher timeframe BMS takes priority. Multiple timeframe BMS alignment increases probability.'
      }
    ]
  }
];

interface StrategyTemplatesProps {
  onSelectTemplate: (template: any) => void;
}

const StrategyTemplates: React.FC<StrategyTemplatesProps> = ({ onSelectTemplate }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredStrategy, setHoveredStrategy] = useState<string | null>(null);
  
  // Animation variants
  const cardVariants = {
    initial: { scale: 0.98, opacity: 0.8 },
    hover: { 
      scale: 1.02, 
      opacity: 1,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98, opacity: 0.9 }
  };
  
  const accordionVariants = {
    initial: { opacity: 0.95 },
    hover: { 
      opacity: 1,
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transition: { duration: 0.3 }
    }
  };
  
  const badgeVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  };
  
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 templates-container">
      <motion.div 
        className="bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 backdrop-blur-md rounded-lg p-5 border border-primary/20 shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-full bg-primary/20 animate-pulse">
            <BookTemplate className="h-5 w-5 text-primary" />
          </div>
          <h3 className="text-lg font-medium bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
            Strategy Templates
          </h3>
        </div>
        <p className="text-sm text-foreground/80">
          Select a pre-built strategy template to use as a foundation for your playbook.
          Each template includes recommended entry/exit rules and best practices.
        </p>
      </motion.div>
      
      <Accordion type="single" collapsible className="w-full">
        {strategyTemplates.map((category, categoryIndex) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.1, duration: 0.5 }}
          >
            <AccordionItem 
              value={category.category}
              className="border border-primary/20 bg-card/30 backdrop-blur-lg rounded-lg mb-6 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              onMouseEnter={() => setHoveredCategory(category.category)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <motion.div
                variants={accordionVariants}
                initial="initial"
                whileHover="hover"
                animate={hoveredCategory === category.category ? "hover" : "initial"}
              >
                <AccordionTrigger className="px-4 py-3 transition-all group">
                  <div className="flex items-center text-left">
                    <div className="mr-3 p-2 rounded-full bg-gradient-to-br from-background/80 to-muted group-hover:from-primary/20 group-hover:to-muted/40 transition-all duration-500">
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors duration-300">{category.category}</h3>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">{category.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
              </motion.div>
              
              <AccordionContent className="px-4 pb-6 pt-2">
                <div className="grid grid-cols-1 gap-4">
                  {category.strategies.map((strategy, strategyIndex) => (
                    <motion.div
                      key={strategy.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: strategyIndex * 0.1, duration: 0.4 }}
                    >
                      <motion.div
                        variants={cardVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                        onMouseEnter={() => setHoveredStrategy(strategy.id)}
                        onMouseLeave={() => setHoveredStrategy(null)}
                      >
                        <Card className={`border-primary/10 overflow-hidden ${
                          hoveredStrategy === strategy.id 
                            ? 'bg-gradient-to-br from-card via-card/80 to-background backdrop-blur-md shine-effect'
                            : 'bg-card/60 backdrop-blur-sm'
                          } transition-all duration-500`}>
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center">
                                  <h4 className="font-medium text-lg">{strategy.name}</h4>
                                  <Star className="h-4 w-4 text-amber-400 ml-2 animate-pulse" />
                                </div>
                                <p className="text-sm text-muted-foreground">{strategy.description}</p>
                              </div>
                              
                              <HoverCard>
                                <HoverCardTrigger asChild>
                                  <Button 
                                    size="sm" 
                                    className="bg-gradient-to-r from-primary/80 to-primary text-primary-foreground hover:from-primary hover:to-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                                    onClick={() => onSelectTemplate(strategy)}
                                  >
                                    <PlusCircle className="h-4 w-4 mr-1.5" />
                                    Use
                                  </Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="bg-card/95 backdrop-blur-lg border border-primary/20 shadow-xl">
                                  <div className="text-xs space-y-1">
                                    <p className="font-medium text-primary">Click to use this template</p>
                                    <p>This will pre-populate your strategy form with recommended settings.</p>
                                  </div>
                                </HoverCardContent>
                              </HoverCard>
                            </div>
                            
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {strategy.tags.map((tag) => (
                                <motion.div key={tag} variants={badgeVariants} initial="initial" whileHover="hover">
                                  <Badge 
                                    variant="outline" 
                                    className="text-xs bg-muted/30 hover:bg-primary/10 transition-colors duration-300"
                                  >
                                    {tag}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                            
                            <div className="text-xs text-muted-foreground flex items-center border-t border-border/40 pt-3">
                              <span className="font-medium text-foreground">Risk/Reward:</span>
                              <span className="ml-1">{strategy.riskReward}</span>
                              <div className="ml-auto flex items-center bg-success/10 px-2 py-0.5 rounded-full">
                                <Check className="h-3.5 w-3.5 mr-1 text-success" />
                                <span className="text-success font-medium">Compatible</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </div>
  );
};

export default StrategyTemplates;
