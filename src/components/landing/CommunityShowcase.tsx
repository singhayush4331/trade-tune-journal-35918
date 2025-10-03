import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Volume2, TrendingUp, Activity, Clock, ArrowRight, Zap, Target, BookOpen, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedCounter } from '@/components/modern/AnimatedCounter';
const CommunityShowcase = () => {
  const isMobile = useIsMobile();
  const [activeMessage, setActiveMessage] = useState(0);
  const liveMessages = [{
    user: "TraderPro_Mumbai",
    message: "Learned great risk management from today's session! 📚",
    profit: "Knowledge +",
    time: "2m ago",
    avatar: "TP"
  }, {
    user: "OptionsExpert", 
    message: "Understanding options Greeks better thanks to the course",
    profit: "Learning +",
    time: "5m ago",
    avatar: "OE"
  }, {
    user: "SwingMaster",
    message: "Chart analysis skills improving with practice sessions",
    profit: "Progress +",
    time: "8m ago",
    avatar: "SM"
  }];
  const channels = [{
    name: "📚 learning-hub",
    description: "Educational resources & discussions",
    members: "2,847 online",
    status: "very-active"
  }, {
    name: "📈 technical-analysis",
    description: "Chart setups & market analysis",
    members: "1,923 online",
    status: "active"
  }, {
    name: "🎓 education",
    description: "Learning resources & Q&A",
    members: "1,456 online",
    status: "active"
  }, {
    name: "💼 portfolio-review",
    description: "Get your trades reviewed",
    members: "892 online",
    status: "moderate"
  }];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMessage(prev => (prev + 1) % liveMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="py-20">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Join Our Trading Community</h2>
        <p className="text-muted-foreground">Connect with thousands of active traders</p>
      </div>
    </div>
  );
};
export default CommunityShowcase;