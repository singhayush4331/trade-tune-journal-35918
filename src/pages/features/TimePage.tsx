import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Clock, ArrowRight, CalendarDays, BarChart3, LineChart, Timer, TrendingUp, ChevronRight, Zap, CheckCircle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import TimeDistributionChart from '@/components/dashboard/TimeDistributionChart';
import CustomPieTooltip from '@/components/dashboard/CustomPieTooltip';
import FeatureLayout from '@/components/layout/FeatureLayout';

// Mock data
const weekdayData = [{
  name: 'Mon',
  value: -2.1
}, {
  name: 'Tue',
  value: 1.2
}, {
  name: 'Wed',
  value: 0.5
}, {
  name: 'Thu',
  value: 1.5
}, {
  name: 'Fri',
  value: 7.2
}];
const hourlyData = [{
  name: '9:15',
  pnl: 0.8,
  avgPnl: 0.4,
  count: 12
}, {
  name: '10:00',
  pnl: 2.1,
  avgPnl: 0.7,
  count: 18
}, {
  name: '11:00',
  pnl: -1.2,
  avgPnl: -0.4,
  count: 15
}, {
  name: '12:00',
  pnl: -0.5,
  avgPnl: -0.1,
  count: 10
}, {
  name: '13:00',
  pnl: 0.3,
  avgPnl: 0.1,
  count: 8
}, {
  name: '14:00',
  pnl: 1.8,
  avgPnl: 0.6,
  count: 12
}, {
  name: '15:00',
  pnl: 4.2,
  avgPnl: 1.4,
  count: 16
}, {
  name: '15:30',
  pnl: 2.5,
  avgPnl: 0.8,
  count: 14
}];
const TimePage = () => {
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
  return <FeatureLayout title="Time-Based Analysis">
      <Helmet>
        <title>Time Analysis for Trading | Wiggly</title>
        <meta name="description" content="Discover your optimal trading hours and performance patterns. Analyze how time of day affects your trading results and optimize your schedule." />
        <meta name="keywords" content="trading time analysis, optimal trading hours, trading schedule, trading performance" />
      </Helmet>
      
      {/* Hero Section */}
      <motion.section className="py-20 md:py-32 px-4 bg-gradient-to-b from-background via-background/80 to-background relative overflow-hidden" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.6
    }}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <motion.div className="md:w-1/2 space-y-6" initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.5
            }} className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Time Analysis
                </h1>
              </motion.div>
              
              <p className="text-lg text-muted-foreground">
                Discover your optimal trading hours and performance patterns. Analyze how time of day, day of week, and seasonal trends affect your trading results to maximize your profitability.
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <Clock className="mr-1 h-4 w-4" />
                  Hourly Analysis
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-500">
                  <CalendarDays className="mr-1 h-4 w-4" />
                  Day Performance
                </span>
                <span className="inline-flex items-center rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500">
                  <BarChart3 className="mr-1 h-4 w-4" />
                  Performance Windows
                </span>
              </div>
              
              <div className="pt-6">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                  <Link to="/signup">
                    Optimize Your Trading Schedule
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            
            <motion.div className="md:w-1/2" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.6,
            delay: 0.4
          }}>
              <div className="bg-gradient-to-br from-card/90 via-card/80 to-background/90 border border-primary/10 rounded-xl p-6 shadow-xl">
                <div className="space-y-6">
                  <h3 className="font-semibold text-lg flex items-center">
                    <Timer className="mr-2 h-5 w-5 text-primary" />
                    Your Time Performance Analysis
                  </h3>
                  
                  {/* Time Distribution Chart */}
                  <TimeDistributionChart weekdayData={weekdayData} hourlyData={hourlyData} />
                  
                  <div className="pt-2">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Best Trading Window: <span className="font-medium text-primary">3:00 PM - 3:30 PM</span></span>
                      </div>
                      <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-lg">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Best Day: <span className="font-medium text-primary">Friday</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Key Metrics Cards */}
      <motion.section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/95 to-background/90 relative" initial={{
      opacity: 0,
      y: 20
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container max-w-7xl mx-auto">
          <motion.div className="text-center mb-12 max-w-3xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Time Intelligence</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Optimize Your <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Trading Windows</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover which days and times consistently deliver your best results and schedule your trading for maximum profitability.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Best Day Card */}
            <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }} className="group">
              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card/95 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-70"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Best Trading Day</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Friday
                      </h3>
                      <p className="text-base text-muted-foreground">+7.2 lakhs avg. P&L</p>
                      <p className="text-sm text-muted-foreground">73% win rate, 24 trades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Best Time Card */}
            <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }} className="group">
              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card/95 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-70"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Best Trading Time</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        15:00 - 16:00
                      </h3>
                      <p className="text-base text-muted-foreground">+1.4 lakhs per trade</p>
                      <p className="text-sm text-muted-foreground">82% win rate, 16 trades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Average Duration Card */}
            <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{
            once: true
          }} className="group">
              <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-card/95 to-background backdrop-blur-sm hover:border-primary/40 transition-all duration-300 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-transparent opacity-70"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex flex-col gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Timer className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Average Holding Time</p>
                      <h3 className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        74 minutes
                      </h3>
                      <p className="text-base text-muted-foreground">Most profitable: 45-90 min</p>
                      <p className="text-sm text-muted-foreground">Based on last 30 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Pattern Analysis */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/90 to-background/95 relative">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7
          }}>
              <Card className="overflow-hidden backdrop-blur-sm bg-card/30 border border-primary/20">
                <CardContent className="p-6 md:p-8">
                  <Tabs defaultValue="weekday" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 mb-8">
                      <TabsTrigger value="weekday" className="data-[state=active]:bg-primary/20 dark:data-[state=active]:bg-primary/30">
                        <CalendarDays className="mr-2 h-4 w-4" /> Day of Week
                      </TabsTrigger>
                      <TabsTrigger value="hourly" className="data-[state=active]:bg-primary/20 dark:data-[state=active]:bg-primary/30">
                        <Clock className="mr-2 h-4 w-4" /> Hour of Day
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="weekday" className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>Monday</span>
                          </span>
                          <span className="text-red-500">-₹2.1L</span>
                        </div>
                        <Progress value={30} className="h-2" indicatorClassName="bg-red-500" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>Tuesday</span>
                          </span>
                          <span className="text-green-500">+₹1.2L</span>
                        </div>
                        <Progress value={45} className="h-2" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>Wednesday</span>
                          </span>
                          <span className="text-green-500">+₹0.5L</span>
                        </div>
                        <Progress value={38} className="h-2" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>Thursday</span>
                          </span>
                          <span className="text-green-500">+₹1.5L</span>
                        </div>
                        <Progress value={48} className="h-2" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                            <span>Friday</span>
                          </span>
                          <span className="text-green-500">+₹7.2L</span>
                        </div>
                        <Progress value={72} className="h-2" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="pt-4 text-sm text-center text-muted-foreground">
                        Friday shows consistently higher returns across all market conditions
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="hourly" className="space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        {hourlyData.map(item => <div key={item.name} className="text-center p-3 rounded-lg bg-card/30 border border-border/50">
                            <div className="font-medium">{item.name}</div>
                            <div className={item.avgPnl >= 0 ? "text-green-500" : "text-red-500"}>
                              {item.avgPnl >= 0 ? "+" : ""}{item.avgPnl}L
                            </div>
                            <div className="text-xs text-muted-foreground">{item.count} trades</div>
                          </div>)}
                      </div>
                      
                      <div className="pt-4 flex justify-center">
                        <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                          <Clock className="mr-2 h-4 w-4" /> 
                          Best Hour: 15:00 (3PM)
                        </Badge>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div className="space-y-8" initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7
          }}>
              <div>
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Pattern Recognition</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Identify Your <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Optimal Times</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Our advanced time analysis finds patterns in your trading history to determine when you perform best.
                </p>
              </div>
              
              <div className="space-y-6">
                <motion.div className="flex gap-4 items-start" initial={{
                opacity: 0,
                y: 10
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: 0.1
              }}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Track Performance by Time</h3>
                    <p className="text-muted-foreground">
                      See how your win rate, average P&L, and other key metrics vary by time of day and day of week.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div className="flex gap-4 items-start" initial={{
                opacity: 0,
                y: 10
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: 0.2
              }}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Discover Peak Hours</h3>
                    <p className="text-muted-foreground">
                      Identify the specific hours of the day when you tend to make the most profitable trades.
                    </p>
                  </div>
                </motion.div>
                
                <motion.div className="flex gap-4 items-start" initial={{
                opacity: 0,
                y: 10
              }} whileInView={{
                opacity: 1,
                y: 0
              }} viewport={{
                once: true
              }} transition={{
                duration: 0.5,
                delay: 0.3
              }}>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">Optimize Your Schedule</h3>
                    <p className="text-muted-foreground">
                      Plan your trading sessions based on data-driven insights about your personal performance patterns.
                    </p>
                  </div>
                </motion.div>
              </div>
              
              <div className="pt-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
                  <Link to="/signup">
                    Analyze Your Trading Times
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Benefits Grid */}
      <motion.section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/95 via-background/90 to-background/80 relative" initial={{
      opacity: 0
    }} whileInView={{
      opacity: 1
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="container max-w-7xl mx-auto">
          <motion.div className="text-center mb-12 max-w-3xl mx-auto" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          duration: 0.5
        }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Key <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">Benefits</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Analyzing your trading performance by time unlocks powerful insights
            </p>
          </motion.div>
          
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true
        }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
            title: "Optimal Time Windows",
            description: "Identify the specific times of day when your trading performance peaks",
            icon: <Clock className="h-5 w-5 text-white" />,
            color: "from-primary to-blue-500"
          }, {
            title: "Day Pattern Recognition",
            description: "Discover which days of the week consistently provide better trading opportunities",
            icon: <CalendarDays className="h-5 w-5 text-white" />,
            color: "from-blue-500 to-indigo-500"
          }, {
            title: "Performance Correlation",
            description: "See how time factors correlate with your win rate and profit/loss ratio",
            icon: <LineChart className="h-5 w-5 text-white" />,
            color: "from-indigo-500 to-purple-500"
          }, {
            title: "Holding Time Analysis",
            description: "Learn the optimal duration to hold your positions based on entry time",
            icon: <Timer className="h-5 w-5 text-white" />,
            color: "from-purple-500 to-primary"
          }, {
            title: "Historical Patterns",
            description: "Identify recurring time-based patterns in your trading history",
            icon: <BarChart3 className="h-5 w-5 text-white" />,
            color: "from-primary to-blue-500"
          }, {
            title: "Schedule Optimization",
            description: "Create a personalized trading schedule based on your historical performance",
            icon: <Lightbulb className="h-5 w-5 text-white" />,
            color: "from-blue-500 to-purple-500"
          }].map((feature, idx) => <motion.div key={idx} variants={itemVariants} className="backdrop-blur-sm bg-card/30 border border-primary/10 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20 group">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md transition-transform group-hover:scale-110 duration-200`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>)}
          </motion.div>
        </div>
      </motion.section>
      
      {/* Testimonial */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-background/80 to-background/95 relative">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container max-w-5xl mx-auto">
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
        }}>
            <Card className="border-primary/20 overflow-hidden backdrop-blur-sm bg-card/30">
              <CardContent className="p-8 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3">
                    <div className="mb-6 flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-2 border-primary/20">
                        <AvatarImage src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=256&h=256&fit=crop&crop=faces&q=80" />
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-lg">Rajesh Kumar</h4>
                        <p className="text-sm text-muted-foreground">Futures Trader, 6 years exp.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Win rate before</span>
                          <span className="font-medium">38%</span>
                        </div>
                        <Progress value={38} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Win rate after</span>
                          <span className="font-medium text-green-500">64%</span>
                        </div>
                        <Progress value={64} className="h-1.5" indicatorClassName="bg-green-500" />
                      </div>
                      
                      <div className="pt-2">
                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 text-center">
                          <p className="text-xs text-muted-foreground mb-1">Monthly P&L improvement</p>
                          <p className="text-2xl font-bold text-green-500">+176%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-2/3 lg:border-l border-primary/10 lg:pl-8">
                    <h3 className="text-xl font-semibold mb-4">How Time Analysis Changed My Trading</h3>
                    
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        "I was constantly feeling like I was missing opportunities or entering trades at the wrong time. The time analysis feature showed me that I was actually trading against my own strengths."
                      </p>
                      
                      <p className="text-muted-foreground">
                        "I discovered that my performance peaked between 2:30 PM and 3:30 PM, especially on Fridays, but I was losing money consistently in the first hour of trading. I was shocked to see such a clear pattern."
                      </p>
                      
                      <p>
                        "After adjusting my schedule to focus on my optimal trading windows, my win rate jumped from 38% to 64%, and my monthly profits nearly tripled. I now trade with much more confidence knowing I'm operating during my best hours."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-background to-background/90">
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
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Ready to Find Your </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">Perfect Trading Hours?</span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of traders who have optimized their schedules and improved their performance through data-driven time analysis.
            </p>
            
            <div className="pt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group text-lg px-8 py-6 h-auto">
                <Link to="/signup" className="px-[11px]">
                  Start Analyzing Your Trading Times
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </FeatureLayout>;
};
export default TimePage;