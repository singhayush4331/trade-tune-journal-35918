import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  BookOpen, 
  Video, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Play, 
  Award, 
  TrendingUp,
  MessageSquare,
  DollarSign,
  Target,
  Zap,
  Brain,
  Eye,
  Crown,
  Sparkles,
  Lock,
  Globe2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnlineProgramPage = () => {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(189);
  const [enrollmentCount, setEnrollmentCount] = useState(3247);

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnrollmentCount(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const institutionalSecrets = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Market Maker Psychology",
      description: "Understand how institutions move markets and create opportunities",
      secret: "Level 2 order flow analysis that 99% of retail traders miss"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Smart Money Concepts", 
      description: "Identify where the big money is positioning before price moves",
      secret: "Institutional order blocks and imbalance detection"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Volume Profile Mastery",
      description: "Read institutional footprints in every price movement",
      secret: "Hidden volume signatures that predict major reversals"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Risk Management Matrix",
      description: "Professional position sizing used by prop trading firms",
      secret: "Kelly Criterion variations that maximize edge"
    }
  ];

  const courseBenefits = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Exclusive Discord Community",
      description: "24/7 access to 3000+ serious traders sharing educational insights",
      highlight: "Educational discussions and learning resources"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Funding Program Access",
      description: "Direct pathway to trading with institutional capital up to ₹50L",
      highlight: "80% profit split on funded accounts"
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "Learn From Anywhere",
      description: "Complete the 3-month intensive program at your own pace",
      highlight: "Mobile-optimized platform for learning on the go"
    },
    {
      icon: <Crown className="h-6 w-6" />,
      title: "Elite Mentorship",
      description: "Direct access to traders managing 8-figure portfolios",
      highlight: "Weekly 1-on-1 sessions with proven track records"
    }
  ];

  const curriculum = [
    { 
      week: "Weeks 1-2", 
      title: "Foundation & Market Structure", 
      lessons: 18,
      highlights: ["Order flow basics", "Institutional vs retail", "Market microstructure"]
    },
    { 
      week: "Weeks 3-4", 
      title: "Smart Money Concepts", 
      lessons: 22,
      highlights: ["Order blocks", "Fair value gaps", "Liquidity sweeps"]
    },
    { 
      week: "Weeks 5-6", 
      title: "Advanced Technical Analysis", 
      lessons: 20,
      highlights: ["Volume profile", "Market profile", "Footprint charts"]
    },
    { 
      week: "Weeks 7-8", 
      title: "Risk & Psychology", 
      lessons: 16,
      highlights: ["Position sizing", "Drawdown management", "Trading psychology"]
    },
    { 
      week: "Weeks 9-10", 
      title: "Strategy Development", 
      lessons: 24,
      highlights: ["Backtesting", "Strategy optimization", "Edge identification"]
    },
    { 
      week: "Weeks 11-12", 
      title: "Live Trading & Funding", 
      lessons: 30,
      highlights: ["Live market execution", "Funding evaluation prep", "Career planning"]
    }
  ];

  const stats = [
    { value: "3247+", label: "Students Enrolled", icon: Users, color: "from-primary to-primary/60" },
    { value: "89%", label: "Funding Success Rate", icon: Award, color: "from-warning to-warning/60" },
    { value: "₹2.4Cr+", label: "Student Profits", icon: TrendingUp, color: "from-success to-success/60" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Helmet>
        <title>3-Month Institutional Trading Mastery | Haven Ark Academy</title>
        <meta name="description" content="Master institutional trading secrets in our intensive 3-month program. Discord community, funding opportunities, and elite mentorship included." />
        <meta name="keywords" content="institutional trading, smart money concepts, order flow, trading funding, discord community, prop trading" />
        <link rel="canonical" href="https://wiggly.lovable.dev/online-program" />
      </Helmet>

      {/* Navigation */}
      <nav className="relative border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Button 
                variant="ghost" 
                onClick={() => navigate('/')}
                className="text-lg font-bold text-primary hover:text-primary/80"
              >
                Haven Ark
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button 
                variant="outline" 
                onClick={() => navigate('/haven-ark/signup')}
                className="hover:bg-primary hover:text-primary-foreground border-primary/30"
              >
                Join Now
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-wiggly-500/5"></div>
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-wiggly-500/10 rounded-full blur-3xl"
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              {/* Live Activity Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <Badge className="bg-success/20 text-success border-success/30 animate-pulse">
                  <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
                  {liveViewers} traders learning live now
                </Badge>
              </motion.div>

              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-7xl font-bold mb-6"
              >
                <span className="bg-gradient-to-r from-primary via-wiggly-500 to-primary bg-clip-text text-transparent">
                  Master Institutional 
                </span>
                <br />
                <span className="text-foreground">Trading Secrets</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                Learn the <span className="text-primary font-semibold">exact strategies</span> used by prop firms and hedge funds. 
                Get <span className="text-success font-semibold">funded with ₹50L+</span> and join our elite Discord community.
              </motion.p>

              {/* Key Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur">
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
                      <CardContent className="relative p-6 text-center">
                        <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                        <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  size="lg"
                  onClick={() => navigate('/haven-ark/signup')}
                  className="bg-gradient-to-r from-primary to-wiggly-500 hover:from-primary/90 hover:to-wiggly-500/90 text-primary-foreground px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all group"
                >
                  Start 3-Month Program
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline" 
                  className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-lg group"
                >
                  <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Preview
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Secrets Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-warning/20 text-warning border-warning/30">
              <Lock className="w-4 h-4 mr-2" />
              Exclusive Insider Knowledge
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Institutional Trading <span className="text-primary">Secrets</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              What they don't teach in retail courses - the real edge that separates profitable traders
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {institutionalSecrets.map((secret, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative group hover:shadow-2xl transition-all duration-300 border-border/50 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <CardContent className="relative p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                        {secret.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{secret.title}</h3>
                        <p className="text-muted-foreground mb-4">{secret.description}</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-primary">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-warning" />
                        <span className="text-sm font-semibold text-warning">Insider Secret:</span>
                      </div>
                      <p className="text-sm text-muted-foreground italic">{secret.secret}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Our <span className="text-primary">Program</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete ecosystem designed to fast-track your journey from beginner to funded trader
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {courseBenefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 h-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-wiggly-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                        <p className="text-muted-foreground mb-4">{benefit.description}</p>
                        <div className="bg-success/10 rounded-lg p-3 border border-success/20">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-success">{benefit.highlight}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Timeline */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-info/20 text-info border-info/30">
              <Clock className="w-4 h-4 mr-2" />
              3-Month Intensive Journey
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Your Learning <span className="text-primary">Roadmap</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Structured curriculum designed to take you from zero to funded trader in 12 weeks
            </p>
          </motion.div>

          <div className="grid gap-6 max-w-4xl mx-auto">
            {curriculum.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-primary to-wiggly-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-primary border-primary/30 px-3 py-1">
                          {module.week}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {module.highlights.map((highlight, idx) => (
                            <span 
                              key={idx} 
                              className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          <span>{module.lessons} lessons</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Transform Your Trading in <span className="text-primary">3 Months</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              One investment. Lifetime of profitable trading knowledge.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="relative overflow-hidden border-primary/30 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-wiggly-500/10" />
              <Badge className="absolute top-4 right-4 bg-warning text-warning-foreground">
                <Crown className="w-4 h-4 mr-1" />
                Premium Program
              </Badge>
              <CardContent className="relative p-12 text-center">
                <h3 className="text-3xl font-bold mb-4">Institutional Trading Mastery</h3>
                <div className="text-6xl font-bold mb-2">
                  <span className="bg-gradient-to-r from-primary to-wiggly-500 bg-clip-text text-transparent">
                    ₹39,999
                  </span>
                </div>
                <p className="text-muted-foreground mb-8">3-month intensive program</p>
                
                <div className="grid gap-4 mb-8 text-left">
                  {[
                    "Complete institutional trading curriculum",
                    "Exclusive Discord community (3000+ traders)",
                    "Direct pathway to ₹50L+ funding",
                    "Weekly 1-on-1 mentorship sessions",
                    "Live trading room access",
                    "Professional certification",
                    "Lifetime course updates",
                    "80% profit split on funded accounts"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg"
                  onClick={() => navigate('/haven-ark/signup')}
                  className="w-full bg-gradient-to-r from-primary to-wiggly-500 hover:from-primary/90 hover:to-wiggly-500/90 text-primary-foreground py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all group"
                >
                  Secure Your Spot Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Limited to 50 students per batch • Next batch starts in 7 days
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-wiggly-500 to-primary">
          <div className="absolute inset-0 bg-background/95" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Trade Like an <span className="text-primary">Institution</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join {enrollmentCount}+ traders who've transformed their trading with our proven system
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => navigate('/haven-ark/signup')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold group"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-primary/30 text-primary hover:bg-primary/10 px-8 py-6 text-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Sample Lessons
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default OnlineProgramPage;