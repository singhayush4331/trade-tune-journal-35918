
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
  Play,
  Gift
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrialBenefitsShowcaseProps {
  className?: string;
}

const TrialBenefitsShowcase: React.FC<TrialBenefitsShowcaseProps> = ({ className = "" }) => {
  const benefits = [
    {
      icon: Play,
      title: "Full Course Preview",
      description: "Access complete lessons and materials"
    },
    {
      icon: Award,
      title: "Certificate Ready",
      description: "Earn completion certificates"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Direct access to trading mentors"
    },
    {
      icon: BookOpen,
      title: "Premium Resources",
      description: "Exclusive trading tools & guides"
    }
  ];

  const stats = [
    { label: "Active Students", value: "2,500+", icon: Users },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Avg. Rating", value: "4.9/5", icon: Star }
  ];

  const testimonials = [
    {
      name: "Rajesh K.",
      role: "Day Trader",
      comment: "The trial gave me confidence to upgrade. Best decision ever!",
      rating: 5
    },
    {
      name: "Priya S.",
      role: "Swing Trader", 
      comment: "Incredible insights in just the trial period. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Premium Trial Header */}
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
            <span className="font-bold text-green-700 dark:text-green-400">Why Choose Our Trial?</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-foreground">
          Experience Premium Trading Education
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Get full access to our flagship content and see why thousands of traders trust our platform.
        </p>
      </motion.div>

      {/* Benefits Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="group"
          >
            <Card className="h-full border border-green-500/20 bg-gradient-to-br from-card/90 to-green-50/10 dark:to-green-900/10 hover:border-green-500/40 transition-all duration-300">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-2 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    <p className="text-xs text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border border-green-500/20 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              Platform Success Metrics
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

      {/* Testimonials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="space-y-4"
      >
        <h4 className="font-semibold text-center flex items-center justify-center gap-2">
          <Users className="h-4 w-4 text-green-600" />
          What Trial Users Say
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
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 text-green-500 fill-current" />
                      ))}
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

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center space-y-4"
      >
        <div className="rounded-lg bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 backdrop-blur-sm p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-700 dark:text-green-400">
                Ready for Full Access?
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Unlock all courses, advanced tools, and premium features
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              asChild
            >
              <Link to="/subscription">
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TrialBenefitsShowcase;
