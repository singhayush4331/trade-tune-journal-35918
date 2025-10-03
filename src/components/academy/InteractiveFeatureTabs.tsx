import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Users, 
  BookOpen, 
  Award, 
  Target, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Star,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const InteractiveFeatureTabs = () => {
  const isMobile = useIsMobile();

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

  const mentorshipFeatures = [
    "One-on-one video sessions",
    "Personalized trading plan",
    "Portfolio review and optimization",
    "Custom strategy development",
    "24/7 chat support"
  ];

  const certificationSteps = [
    { step: 1, title: "Complete Course Modules", status: "completed" },
    { step: 2, title: "Pass Module Quizzes", status: "completed" },
    { step: 3, title: "Submit Trading Journal", status: "current" },
    { step: 4, title: "Final Assessment", status: "pending" },
    { step: 5, title: "Receive Certification", status: "pending" }
  ];

  const portfolioData = {
    before: {
      trades: 150,
      winRate: 45,
      avgProfit: 2500,
      maxDrawdown: 15
    },
    after: {
      trades: 200,
      winRate: 78,
      avgProfit: 8750,
      maxDrawdown: 8
    }
  };

  return (
    <section className="py-24 px-4 bg-background relative">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            <Target className="h-4 w-4 mr-2" />
            Complete Learning Experience
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6`}>
            Everything You Need to Succeed
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            Explore our comprehensive features designed to transform you into a profitable trader
          </p>
        </motion.div>

        <Tabs defaultValue="live-trading" className="w-full">
          <div className="relative w-full pb-2 mb-8">
            <TabsList className="w-full max-w-full grid grid-cols-2 lg:grid-cols-5 gap-1 p-1 bg-muted/50 rounded-lg shadow-sm border border-border/10">
              <TabsTrigger 
                value="live-trading" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 p-3"
              >
                <Play className="h-4 w-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Live Trading</span>
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 p-3"
              >
                <Users className="h-4 w-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Community</span>
              </TabsTrigger>
              <TabsTrigger 
                value="mentorship" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 p-3"
              >
                <BookOpen className="h-4 w-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Mentorship</span>
              </TabsTrigger>
              <TabsTrigger 
                value="certification" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 p-3"
              >
                <Award className="h-4 w-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Certification</span>
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary flex items-center gap-2 p-3"
              >
                <BarChart3 className="h-4 w-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>Portfolio</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="relative">
            <TabsContent value="live-trading" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
                      Educational Trading Sessions
                    </h3>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-6`}>
                      Join daily educational sessions where expert mentors demonstrate trading concepts and explain their analysis process for learning purposes.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="p-4 border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="font-semibold">Daily Sessions</span>
                      </div>
                      <p className="text-sm text-muted-foreground">2-3 hours of live trading every market day</p>
                    </Card>
                    
                    <Card className="p-4 border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span className="font-semibold">Interactive Chat</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Ask questions and get instant answers</p>
                    </Card>
                    
                    <Card className="p-4 border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        <span className="font-semibold">Screen Sharing</span>
                      </div>
                      <p className="text-sm text-muted-foreground">See every click and chart analysis</p>
                    </Card>
                    
                    <Card className="p-4 border-primary/10 hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="h-4 w-4 text-primary" />
                        <span className="font-semibold">Trade Breakdown</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Detailed explanation of each trade</p>
                    </Card>
                  </div>

                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                    Join Next Live Session
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
                    <div className="aspect-video bg-background/40 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Play className="h-16 w-16 text-primary mx-auto mb-4" />
                        <p className="text-lg font-semibold">Live Trading Preview</p>
                        <p className="text-sm text-muted-foreground">Watch mentor execute live trades</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-red-500">LIVE</span>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        <Users className="h-3 w-3 mr-1" />
                        342 viewers
                      </Badge>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="community" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
                    <div className="bg-background/40 rounded-lg p-4 mb-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">Haven ARK Discord</h4>
                          <p className="text-sm text-muted-foreground">5,247 members online</p>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-primary/5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">TraderPro</span>
                            <span className="text-xs text-muted-foreground">2m ago</span>
                          </div>
                          <p className="text-sm">Just closed RELIANCE long for +8.5% profit! 🚀</p>
                        </div>
                        
                        <div className="bg-primary/5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">AnalysisGuru</span>
                            <span className="text-xs text-muted-foreground">5m ago</span>
                          </div>
                          <p className="text-sm">Market looking bullish for next week. Check my analysis in #strategies</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
                      Connect with 5000+ Traders
                    </h3>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-6`}>
                      Join our exclusive Discord community where traders share insights, strategies, and support each other's journey.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Daily Market Discussions</span>
                        <p className="text-sm text-muted-foreground">Share and discuss market views with fellow traders</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Strategy Sharing</span>
                        <p className="text-sm text-muted-foreground">Learn new strategies from successful community members</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <span className="font-semibold">Live Voice Chats</span>
                        <p className="text-sm text-muted-foreground">Join daily voice sessions for deeper discussions</p>
                      </div>
                    </div>
                  </div>

                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                    Join Discord Community
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="mentorship" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
                      Personal 1-on-1 Mentorship
                    </h3>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-6`}>
                      Get personalized guidance from experienced mentors who will help you develop your unique trading style and overcome challenges.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {mentorshipFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                    Schedule Mentorship Call
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-10 w-10 text-primary" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Mentor Session Preview</h4>
                      <p className="text-sm text-muted-foreground">One-on-one video session with expert mentor</p>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-background/40 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Next Available Session</span>
                          <Badge className="bg-success/10 text-success border-success/20">Available</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Tomorrow, 2:00 PM - 3:00 PM</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">50+</div>
                          <div className="text-xs text-muted-foreground">Sessions Completed</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">4.9</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                            <Star className="h-3 w-3 fill-primary text-primary" />
                            Rating
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="certification" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
                    <div className="text-center mb-6">
                      <Award className="h-16 w-16 text-primary mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">Professional Trading Certificate</h4>
                      <p className="text-sm text-muted-foreground">Recognized by industry professionals</p>
                    </div>
                    
                    <div className="space-y-3">
                      {certificationSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            step.status === 'completed' ? 'bg-success text-white' :
                            step.status === 'current' ? 'bg-primary text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {step.status === 'completed' ? <CheckCircle className="h-4 w-4" /> : step.step}
                          </div>
                          <span className={step.status === 'current' ? 'font-semibold text-primary' : ''}>{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
                      Get Professionally Certified
                    </h3>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-6`}>
                      Earn a professional trading certification that validates your skills and knowledge in stock market trading.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="p-4 text-center border-primary/10">
                      <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">6-8 Weeks</h4>
                      <p className="text-sm text-muted-foreground">Completion Time</p>
                    </Card>
                    
                    <Card className="p-4 text-center border-primary/10">
                      <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">Industry Recognized</h4>
                      <p className="text-sm text-muted-foreground">Certificate</p>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Complete all course modules and assessments</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Submit a comprehensive trading journal</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Pass the final practical assessment</span>
                    </div>
                  </div>

                  <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                    Start Certification Path
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <motion.div variants={itemVariants} className="space-y-6">
                  <div>
                    <h3 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
                      Transform Your Trading Results
                    </h3>
                    <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground mb-6`}>
                      See how our students improve their trading performance with systematic learning and mentorship.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-center">Before</h4>
                      <Card className="p-4 bg-destructive/5 border-destructive/20">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Win Rate</span>
                            <span className="font-semibold">{portfolioData.before.winRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Avg Profit</span>
                            <span className="font-semibold">₹{portfolioData.before.avgProfit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Max Drawdown</span>
                            <span className="font-semibold text-destructive">{portfolioData.before.maxDrawdown}%</span>
                          </div>
                        </div>
                      </Card>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold mb-4 text-center">After</h4>
                      <Card className="p-4 bg-success/5 border-success/20">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Win Rate</span>
                            <span className="font-semibold text-success">{portfolioData.after.winRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Avg Profit</span>
                            <span className="font-semibold text-success">₹{portfolioData.after.avgProfit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Max Drawdown</span>
                            <span className="font-semibold text-success">{portfolioData.after.maxDrawdown}%</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Button size="lg" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group">
                    See Your Potential Growth
                    <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-card/60 backdrop-blur-sm border-primary/10">
                    <h4 className="text-lg font-semibold mb-4">Performance Improvement</h4>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Win Rate Improvement</span>
                          <span className="text-sm font-semibold text-success">+33%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div 
                            className="bg-success h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "73%" }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Profit Increase</span>
                          <span className="text-sm font-semibold text-success">+250%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div 
                            className="bg-success h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1, delay: 0.7 }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Risk Reduction</span>
                          <span className="text-sm font-semibold text-success">-47%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <motion.div 
                            className="bg-success h-2 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "47%" }}
                            transition={{ duration: 1, delay: 0.9 }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm text-center">
                        <span className="font-semibold">Average student improvement</span> within 6 months of completing the masterclass
                      </p>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export default InteractiveFeatureTabs;