import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BarChart3, LineChart, TrendingUp, Heart, BrainCircuit, ArrowRight, Lightbulb, Target, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import FeatureLayout from '@/components/layout/FeatureLayout';
import { useEmotionUtils } from '@/hooks/use-emotion-utils';
import { MOOD_EMOJIS, MOOD_COLORS } from '@/utils/emotion-constants';
const EmotionsPage = () => {
  const {
    processEmotionData
  } = useEmotionUtils();

  // Sample data for emotion distribution
  const emotionData = [{
    name: 'focused',
    value: 45,
    avgPnl: 2100
  }, {
    name: 'confident',
    value: 25,
    avgPnl: 1200
  }, {
    name: 'calm',
    value: 15,
    avgPnl: 800
  }, {
    name: 'nervous',
    value: 10,
    avgPnl: -300
  }, {
    name: 'anxious',
    value: 5,
    avgPnl: -900
  }];

  // Process the data to get emoji and colors
  const processedEmotions = processEmotionData(emotionData);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
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
  return <FeatureLayout title="Emotional Trading Analysis">
      <Helmet>
        <title>Emotional Trading Analysis | Wiggly</title>
        <meta name="description" content="Track and analyze how emotions affect your trading decisions. Identify patterns in your emotional responses and learn to make more rational trading decisions." />
      </Helmet>
      
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Hero Content */}
            <motion.div className="lg:w-1/2 space-y-6" initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6
          }}>
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Emotion Analytics</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Master Your </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-500">Trading Psychology</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Track and analyze how emotions affect your trading decisions. Identify patterns in your emotional responses and make more rational trading decisions.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Heart className="mr-1 h-4 w-4" />
                  Emotion Tracking
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
                  <LineChart className="mr-1 h-4 w-4" />
                  Performance Correlation
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500">
                  <TrendingUp className="mr-1 h-4 w-4" />
                  Behavior Patterns
                </span>
              </div>
              
              <div className="pt-6">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                  <Link to="/signup">
                    Start Tracking Your Emotions
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            {/* Hero Visual */}
            <motion.div className="lg:w-1/2" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.3
          }}>
              <Card className="backdrop-blur-sm bg-card/80 border border-primary/10 shadow-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Your Emotional Analysis</h3>
                      <Badge variant="outline" className="bg-primary/5 text-primary">Last 30 days</Badge>
                    </div>
                    
                    <div className="grid grid-cols-5 gap-3">
                      {processedEmotions.map((emotion, index) => <motion.div key={index} className="flex flex-col items-center" initial={{
                      opacity: 0,
                      scale: 0.8
                    }} animate={{
                      opacity: 1,
                      scale: 1
                    }} transition={{
                      delay: 0.5 + index * 0.1
                    }}>
                          <div className="h-24 w-full bg-muted/30 rounded-md relative overflow-hidden">
                            <motion.div className="absolute bottom-0 left-0 right-0" style={{
                          height: `${emotion.value}%`,
                          backgroundColor: emotion.color
                        }} initial={{
                          height: "0%"
                        }} animate={{
                          height: `${emotion.value}%`
                        }} transition={{
                          duration: 1,
                          delay: 0.8 + index * 0.1
                        }} />
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-xl">{emotion.emoji}</span>
                            <p className="text-xs font-medium mt-1 capitalize">{emotion.name}</p>
                            <p className="text-xs text-muted-foreground">{emotion.value}%</p>
                          </div>
                        </motion.div>)}
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-3">Emotion Impact on Performance</h4>
                      <div className="space-y-4">
                        {processedEmotions.slice(0, 3).map((emotion, index) => <div key={index} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{emotion.emoji}</span>
                                <span className="text-sm font-medium capitalize">{emotion.name}</span>
                              </div>
                              <span className={`text-sm ${emotion.avgPnl > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {emotion.avgPnl > 0 ? '+' : ''}{emotion.avgPnl} avg PnL
                              </span>
                            </div>
                            <Progress value={emotion.avgPnl > 0 ? 70 : 30} indicatorClassName={emotion.avgPnl > 0 ? 'bg-green-500' : 'bg-red-500'} />
                          </div>)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Emotional Intelligence Section - Reuse existing component */}
      <section className="py-20 bg-gradient-to-b from-background/90 to-background/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Emotional Intelligence</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Visualize How </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Emotions Impact Trading</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              See the connection between your emotional states and trading performance. Identify which emotions lead to better decisions and higher profits.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-40"></div>
              
              <h3 className="text-xl font-semibold mb-6 relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                Select Emotions During Trading
              </h3>
              
              <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
              once: true
            }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                {Object.entries(MOOD_EMOJIS).slice(0, 9).map(([name, emoji], idx) => <motion.div key={name} variants={itemVariants} className="group relative">
                    <motion.div whileHover={{
                  scale: 1.05
                }} whileTap={{
                  scale: 0.98
                }} className={`flex flex-col items-center justify-center p-3 rounded-lg cursor-pointer border transition-all`} style={{
                  borderColor: MOOD_COLORS[name] + "40",
                  backgroundColor: MOOD_COLORS[name] + "10"
                }}>
                      <span className="text-2xl mb-1">{emoji}</span>
                      <span className="text-xs capitalize font-medium">{name}</span>
                    </motion.div>
                  </motion.div>)}
              </motion.div>
              
              <div className="mt-6 bg-primary/5 p-4 rounded-lg border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Lightbulb className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      Log your emotions for each trade to build patterns that reveal your optimal trading mindset.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="bg-card/30 backdrop-blur-sm border border-primary/10 rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-40"></div>
              
              <h3 className="text-xl font-semibold mb-6 relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BarChart className="h-5 w-5 text-primary" />
                </div>
                Receive Data-Driven Insights
              </h3>
              
              <div className="space-y-5">
                <div className="bg-muted/20 rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-blue-500/20">
                      <Target className="h-4 w-4 text-blue-500" />
                    </div>
                    <h4 className="font-medium">Performance by Emotional State</h4>
                  </div>
                  
                  <div className="space-y-3 mt-3">
                    {processedEmotions.slice(0, 4).map((emotion, idx) => <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span>{emotion.emoji}</span>
                          <span className="capitalize">{emotion.name}</span>
                        </div>
                        <div>
                          <span className={emotion.avgPnl > 0 ? 'text-green-500' : 'text-red-500'}>
                            {emotion.avgPnl > 0 ? '+' : ''}{emotion.avgPnl} PnL
                          </span>
                        </div>
                      </div>)}
                  </div>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-4 border border-primary/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <Lightbulb className="h-4 w-4 text-purple-500" />
                    </div>
                    <h4 className="font-medium">AI-Generated Recommendations</h4>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Based on your data, your most profitable emotion is <span className="font-medium text-foreground">Focused</span> with 73% win rate.</p>
                    <p>Consider meditation or pre-trading routines that help you achieve this emotional state regularly.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-5 flex justify-center">
                <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                  Explore Your Emotional Patterns
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-b from-background/80 via-background/90 to-background relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container mx-auto px-4">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Key </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Features</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our emotional analytics tools provide unprecedented insights into your trading psychology
            </p>
          </motion.div>
          
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true
        }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            title: "Emotion Tracking",
            description: "Log emotional states during trading sessions to identify patterns in your decision making",
            icon: <Heart className="h-5 w-5 text-white" />,
            color: "from-primary to-blue-500"
          }, {
            title: "Performance Correlation",
            description: "See how different emotions affect your win rate and profit/loss across different markets",
            icon: <LineChart className="h-5 w-5 text-white" />,
            color: "from-blue-500 to-indigo-500"
          }, {
            title: "Behavioral Patterns",
            description: "Identify recurring emotional triggers that lead to poor trading decisions",
            icon: <TrendingUp className="h-5 w-5 text-white" />,
            color: "from-indigo-500 to-purple-500"
          }, {
            title: "AI Insights",
            description: "Receive personalized recommendations to optimize your emotional state for better trading",
            icon: <BrainCircuit className="h-5 w-5 text-white" />,
            color: "from-purple-500 to-primary"
          }, {
            title: "Trend Analysis",
            description: "Track how your emotional control improves over time along with your trading performance",
            icon: <BarChart3 className="h-5 w-5 text-white" />,
            color: "from-primary to-blue-500"
          }, {
            title: "Custom Reports",
            description: "Generate detailed reports showing the relationship between emotions and trading outcomes",
            icon: <Lightbulb className="h-5 w-5 text-white" />,
            color: "from-blue-500 to-purple-500"
          }].map((feature, idx) => <motion.div key={idx} variants={itemVariants} className="backdrop-blur-sm bg-card/30 border border-primary/10 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>)}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      
      
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-background/95">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30"></div>
        
        <div className="container max-w-5xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }} className="space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Ready to Master Your </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Trading Psychology?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of traders who have improved their performance through emotional intelligence and data-driven insights.
            </p>
            
            <div className="pt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group text-lg px-8 py-6 h-auto">
                <Link to="/signup">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              
            </div>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>;
};
export default EmotionsPage;