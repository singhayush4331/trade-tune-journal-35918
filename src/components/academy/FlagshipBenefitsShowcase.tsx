
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Star, 
  Clock, 
  Users, 
  Award, 
  Sparkles, 
  CheckCircle, 
  TrendingUp,
  BookOpen,
  Target,
  Gift,
  Zap,
  Trophy,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FlagshipBenefitsShowcaseProps {
  className?: string;
}

const FlagshipBenefitsShowcase: React.FC<FlagshipBenefitsShowcaseProps> = ({ className = "" }) => {
  const premiumFeatures = [
    {
      icon: Crown,
      title: "260+ Hours Content",
      description: "Comprehensive trading education"
    },
    {
      icon: Target,
      title: "Advanced Strategies",
      description: "Professional trading techniques"
    },
    {
      icon: Users,
      title: "1-on-1 Mentorship",
      description: "Direct access to expert traders"
    },
    {
      icon: Trophy,
      title: "Live Trading Sessions",
      description: "Real-time market analysis"
    }
  ];

  const stats = [
    { label: "Course Hours", value: "260+", icon: Clock },
    { label: "Success Rate", value: "96%", icon: TrendingUp },
    { label: "Average ROI", value: "340%", icon: Target }
  ];

  const testimonials = [
    {
      name: "Arjun M.",
      role: "Professional Trader",
      comment: "This masterclass transformed my trading career. The strategies are gold!",
      rating: 5,
      achievement: "₹50L+ Monthly"
    },
    {
      name: "Kavya R.",
      role: "Investment Banker",
      comment: "Most comprehensive trading education I've ever seen. Worth every penny!",
      rating: 5,
      achievement: "Portfolio Manager"
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 to-emerald-500/30 rounded-full blur-xl"></div>
          <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-500/30 backdrop-blur-sm">
            <Crown className="h-5 w-5 text-green-600" />
            <span className="font-bold text-green-700 dark:text-green-400">Why Choose Premium?</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground">
          Master Professional Trading
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Join thousands of successful traders who've transformed their careers with our flagship masterclass.
        </p>
      </motion.div>

      {/* Premium Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        {premiumFeatures.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <Card className="h-full border border-green-500/20 bg-gradient-to-br from-card/90 to-green-50/10 dark:to-green-900/10 hover:border-green-500/40 transition-all duration-300">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-2 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Success Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-green-500/20 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Student Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="text-center space-y-2"
                >
                  <div className="rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-2 w-fit mx-auto">
                    <stat.icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="font-bold text-lg text-green-700 dark:text-green-400">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Success Stories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <h4 className="font-semibold text-center flex items-center justify-center gap-2">
          <Trophy className="h-4 w-4 text-green-600" />
          Success Stories
        </h4>
        <div className="space-y-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
            >
              <Card className="border border-green-500/20 bg-gradient-to-r from-card/90 to-green-50/5 dark:to-green-900/5">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-green-500 fill-current" />
                        ))}
                      </div>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30 text-xs">
                        {testimonial.achievement}
                      </Badge>
                    </div>
                    <p className="text-sm italic">"{testimonial.comment}"</p>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">{testimonial.name}</span> • {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="rounded-lg bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 backdrop-blur-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Zap className="h-6 w-6 text-green-600" />
              <span className="font-bold text-xl text-green-700 dark:text-green-400">
                Transform Your Trading Today
              </span>
            </div>
            <p className="text-muted-foreground">
              Join the elite group of professional traders and unlock your full potential
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                size="lg"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <Link to="/subscription">
                  <Crown className="h-5 w-5 mr-2" />
                  Upgrade to Premium
                </Link>
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Gift className="h-4 w-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FlagshipBenefitsShowcase;
