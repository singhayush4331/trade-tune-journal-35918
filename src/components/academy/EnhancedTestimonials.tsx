import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Star, 
  TrendingUp, 
  Play, 
  Quote,
  BarChart3,
  DollarSign,
  Award,
  Calendar
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EnhancedTestimonials = () => {
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

  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Software Engineer → Full-time Trader",
      location: "Mumbai",
      content: "Haven ARK's masterclass completely transformed my approach to trading. I went from losing ₹50k in my first year to making ₹2.5L monthly profit. The live sessions and community support were game-changers.",
      rating: 5,
      beforeAfter: {
        before: { profit: -50000, winRate: 35, trades: 120 },
        after: { profit: 250000, winRate: 78, trades: 85 }
      },
      achievement: "Turned ₹3L account into ₹15L in 8 months",
      courseDuration: "Completed in 6 weeks",
      videoThumbnail: "/placeholder-video-1.jpg",
      tradingScreenshot: "/placeholder-trading-1.jpg"
    },
    {
      name: "Priya Sharma",
      role: "Business Owner",
      location: "Bangalore", 
      content: "The personalized mentorship made all the difference. My mentor helped me develop a strategy that fits my risk tolerance perfectly. Now I consistently make ₹1.8L per month while managing my business.",
      rating: 5,
      beforeAfter: {
        before: { profit: 15000, winRate: 52, trades: 200 },
        after: { profit: 180000, winRate: 82, trades: 95 }
      },
      achievement: "Achieved 82% win rate with systematic approach",
      courseDuration: "Completed in 5 weeks",
      videoThumbnail: "/placeholder-video-2.jpg",
      tradingScreenshot: "/placeholder-trading-2.jpg"
    },
    {
      name: "Amit Patel",
      role: "Financial Analyst",
      location: "Delhi",
      content: "Best investment I've made in my career. The Wiggly tools included with the course help me track and improve my performance daily. The Discord community is incredibly supportive and knowledgeable.",
      rating: 5,
      beforeAfter: {
        before: { profit: 85000, winRate: 58, trades: 180 },
        after: { profit: 320000, winRate: 85, trades: 120 }
      },
      achievement: "Scaled from ₹5L to ₹25L portfolio value",
      courseDuration: "Completed in 7 weeks",
      videoThumbnail: "/placeholder-video-3.jpg",
      tradingScreenshot: "/placeholder-trading-3.jpg"
    },
    {
      name: "Sneha Reddy",
      role: "Marketing Executive → Pro Trader",
      location: "Hyderabad",
      content: "The live trading sessions are pure gold. Watching experienced traders make decisions in real-time taught me more than any book ever could. I now trade with confidence and clear strategy.",
      rating: 5,
      beforeAfter: {
        before: { profit: -25000, winRate: 42, trades: 150 },
        after: { profit: 150000, winRate: 75, trades: 90 }
      },
      achievement: "From losses to ₹1.5L monthly profits",
      courseDuration: "Completed in 6 weeks",
      videoThumbnail: "/placeholder-video-4.jpg",
      tradingScreenshot: "/placeholder-trading-4.jpg"
    }
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

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
            <Award className="h-4 w-4 mr-2" />
            Success Stories
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6`}>
            Real Results from Real Students
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto`}>
            See how our students transformed their trading results with systematic learning and expert mentorship
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 bg-card/60 backdrop-blur-sm">
                {/* Header with Rating and Video */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="bg-primary/10 border-primary/20 hover:bg-primary/20">
                    <Play className="h-3 w-3 mr-1" />
                    Video
                  </Button>
                </div>

                {/* Quote */}
                <div className="relative mb-6">
                  <Quote className="h-6 w-6 text-primary/30 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground italic pl-4">"{testimonial.content}"</p>
                </div>

                {/* Before/After Performance */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Performance Transformation
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-destructive/5 rounded-lg p-3 border border-destructive/20">
                      <div className="text-center mb-2">
                        <span className="text-xs font-medium text-destructive">Before</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Monthly P&L</span>
                          <span className={testimonial.beforeAfter.before.profit < 0 ? 'text-destructive' : 'text-muted-foreground'}>
                            {formatCurrency(testimonial.beforeAfter.before.profit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Win Rate</span>
                          <span>{testimonial.beforeAfter.before.winRate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Trades/Month</span>
                          <span>{testimonial.beforeAfter.before.trades}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-success/5 rounded-lg p-3 border border-success/20">
                      <div className="text-center mb-2">
                        <span className="text-xs font-medium text-success">After</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Monthly P&L</span>
                          <span className="text-success font-semibold">
                            {formatCurrency(testimonial.beforeAfter.after.profit)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Win Rate</span>
                          <span className="text-success font-semibold">{testimonial.beforeAfter.after.winRate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Trades/Month</span>
                          <span className="text-success font-semibold">{testimonial.beforeAfter.after.trades}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badge */}
                <div className="mb-6">
                  <Badge className="bg-primary/10 text-primary border-primary/20 w-full justify-center py-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {testimonial.achievement}
                  </Badge>
                </div>

                {/* User Info and Course Duration */}
                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                      <Calendar className="h-3 w-3" />
                      {testimonial.courseDuration}
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                      Certified Trader
                    </Badge>
                  </div>
                </div>

                {/* Trading Screenshot Preview */}
                <div className="mt-4 p-3 bg-background/40 rounded-lg border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">Live Trading Screenshot</span>
                    <Badge variant="outline" className="text-xs">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Real Results
                    </Badge>
                  </div>
                  <div className="aspect-video bg-muted rounded flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Trading Platform Screenshot</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <h3 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4`}>
              Ready to Write Your Success Story?
            </h3>
            <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground mb-6 max-w-2xl mx-auto`}>
              Join thousands of successful traders who transformed their financial future with Haven ARK's masterclass
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                Start Your Trading Journey - ₹35,000
              </Button>
              <Button size="lg" variant="outline" className="border-primary/30 hover:border-primary hover:bg-primary/5">
                View More Success Stories
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedTestimonials;