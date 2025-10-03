import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Users, 
  Volume2, 
  Hash, 
  CheckCircle, 
  ArrowRight,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const DiscordCommunityShowcase = () => {
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

  const channels = [
    { name: "general", type: "text", members: 1247, description: "General discussions and introductions" },
    { name: "live-trading", type: "text", members: 892, description: "Real-time trading discussions" },
    { name: "strategies", type: "text", members: 756, description: "Share and discuss trading strategies" },
    { name: "market-news", type: "text", members: 634, description: "Latest market updates and news" },
    { name: "Live Trading Session", type: "voice", members: 23, description: "Join live trading sessions" },
    { name: "Q&A with Mentors", type: "voice", members: 15, description: "Ask questions to expert mentors" }
  ];

  const recentMessages = [
    { 
      user: "TraderRaj", 
      message: "Just booked 15% profit on HDFC Bank using the breakout strategy!", 
      time: "2m ago",
      reactions: 12
    },
    { 
      user: "MarketMaven", 
      message: "Great analysis on Nifty levels for tomorrow 📈", 
      time: "5m ago",
      reactions: 8
    },
    { 
      user: "TechAnalyst", 
      message: "Shared my daily watchlist in #strategies channel", 
      time: "8m ago",
      reactions: 15
    }
  ];

  return (
    <section className="py-24 px-4 bg-card/20 relative overflow-hidden">
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
            <Users className="h-4 w-4 mr-2" />
            Discord Community
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6`}>
            Join Our Thriving Trading Community
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            Connect with 5000+ active traders, share strategies, and learn from the best in our exclusive Discord server
          </p>
        </motion.div>

        {/* Real Discord Screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          <div className="group">
            <Card className="p-0 overflow-hidden border-primary/10 hover:shadow-xl transition-all duration-300">
              <img 
                src="/lovable-uploads/aeac1e19-f3dd-4ef7-8755-0c8bc2fe0b7f.png" 
                alt="Discord Community - Live Trading Discussions"
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Card>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Live Trading Analysis</h3>
              <p className="text-muted-foreground">Real-time chart analysis and trade discussions with community members</p>
            </div>
          </div>
          
          <div className="group">
            <Card className="p-0 overflow-hidden border-primary/10 hover:shadow-xl transition-all duration-300">
              <img 
                src="/lovable-uploads/990e60b1-9a6f-45a0-b5e6-9bb5109d373a.png" 
                alt="Discord Community - Options Trading"
                className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
              />
            </Card>
            <div className="mt-4 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Options & Strategies</h3>
              <p className="text-muted-foreground">Expert mentors sharing profitable setups and trading strategies</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 items-start">
          {/* Community Benefits */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Real-Time Trading Discussions</h3>
                    <p className="text-muted-foreground">
                      Share your trades, get instant feedback, and learn from experienced traders in real-time.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Volume2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Live Voice Sessions</h3>
                    <p className="text-muted-foreground">
                      Join daily live trading sessions, Q&A with mentors, and strategy discussions via voice chat.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Daily Market Updates</h3>
                    <p className="text-muted-foreground">
                      Get exclusive market analysis, trade setups, and economic news updates every trading day.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Mentorship</h3>
                    <p className="text-muted-foreground">
                      Direct access to professional traders and mentors for personalized guidance and support.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group"
            >
              Join Discord Community
              <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DiscordCommunityShowcase;