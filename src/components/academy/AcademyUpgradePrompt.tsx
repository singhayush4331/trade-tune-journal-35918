
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, TrendingUp, BarChart3, Calendar, BookOpen } from 'lucide-react';

const AcademyUpgradePrompt = () => {
  const navigate = useNavigate();

  const platformFeatures = [
    {
      icon: TrendingUp,
      title: 'Trade Journaling',
      description: 'Record and analyze all your trades with detailed insights'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Performance metrics, win rates, and profit/loss analysis'
    },
    {
      icon: Calendar,
      title: 'Trading Calendar',
      description: 'Visualize your trading performance over time'
    },
    {
      icon: BookOpen,
      title: 'Strategy Playbooks',
      description: 'Create and manage your trading strategies'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-primary/30 text-primary">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Academy Member
                </Badge>
              </div>
              <CardTitle className="text-2xl">Ready for the Full Trading Experience?</CardTitle>
              <CardDescription className="text-base mt-2">
                You're doing great with academy courses! Upgrade to unlock our complete trading platform with journaling, analytics, and more.
              </CardDescription>
            </div>
            <Button 
              onClick={() => navigate('/subscription')}
              size="lg"
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shrink-0"
            >
              Upgrade Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-3 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="inline-flex p-2 rounded-lg bg-primary/10 mb-2">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Keep your academy access forever • Get 30-day money-back guarantee
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademyUpgradePrompt;
