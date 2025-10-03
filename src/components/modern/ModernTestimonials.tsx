import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

const ModernTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const isMobile = useIsMobile();

  const testimonials = [
    {
      id: 1,
      name: "Alex Chen",
      role: "Quantitative Trader",
      company: "Goldman Sachs",
      image: "/lovable-uploads/testimonial-1.jpg",
      rating: 5,
      content: "This platform transformed my trading completely. The AI insights are incredibly accurate, and I've seen a 340% increase in my monthly returns. The risk management tools alone are worth the investment.",
      profit: "+₹15.2L",
      winRate: "89%",
      timeframe: "6 months"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Day Trader",
      company: "Independent",
      image: "/lovable-uploads/testimonial-2.jpg",
      rating: 5,
      content: "I was skeptical about AI trading tools, but this platform proved me wrong. The precision of entry and exit signals is remarkable. My win rate improved from 55% to 82% in just 3 months.",
      profit: "+₹8.7L",
      winRate: "82%",
      timeframe: "3 months"
    },
    {
      id: 3,
      name: "Michael Rodriguez",
      role: "Portfolio Manager",
      company: "Morgan Stanley",
      image: "/lovable-uploads/testimonial-3.jpg",
      rating: 5,
      content: "The institutional-grade analytics combined with real-time insights give me the edge I need. This platform provides the same quality of data and analysis that we use at major investment banks.",
      profit: "+₹22.5L",
      winRate: "91%",
      timeframe: "8 months"
    },
    {
      id: 4,
      name: "Emily Wang",
      role: "Crypto Trader",
      company: "Binance",
      image: "/lovable-uploads/testimonial-4.jpg",
      rating: 5,
      content: "The 24/7 market monitoring and instant alerts have been game-changing for crypto trading. I never miss important price movements, and the AI predictions have been incredibly accurate.",
      profit: "+₹11.3L",
      winRate: "86%",
      timeframe: "4 months"
    }
  ];

  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlay(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlay(false);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative py-32 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="glass-card px-4 py-2 mb-6">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            Trusted by Professionals
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-black mb-6">
            Success
            <span className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              {" "}Stories
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of traders who have transformed their trading journey with our platform.
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <motion.div
          className="relative max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              exit={{ opacity: 0, x: -50, rotateY: 10 }}
              transition={{ duration: 0.5 }}
              className="glass-strong p-8 lg:p-12 rounded-3xl shadow-floating"
            >
              {/* Quote Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-8 mx-auto"
              >
                <Quote className="w-8 h-8 text-white" />
              </motion.div>

              {/* Rating */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex justify-center mb-6"
              >
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                ))}
              </motion.div>

              {/* Testimonial Content */}
              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-2xl lg:text-3xl font-medium text-center mb-8 leading-relaxed"
              >
                "{currentTestimonial.content}"
              </motion.blockquote>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-3 gap-6 mb-8"
              >
                <div className="glass-card p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-success">{currentTestimonial.profit}</p>
                  <p className="text-sm text-muted-foreground">Total Profit</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold text-primary">{currentTestimonial.winRate}</p>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                </div>
                <div className="glass-card p-4 rounded-xl text-center">
                  <p className="text-2xl font-bold">{currentTestimonial.timeframe}</p>
                  <p className="text-sm text-muted-foreground">Time Period</p>
                </div>
              </motion.div>

              {/* Author Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center justify-center gap-4"
              >
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <div className="w-full h-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {currentTestimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </Avatar>
                <div className="text-center">
                  <h4 className="text-xl font-bold">{currentTestimonial.name}</h4>
                  <p className="text-primary font-medium">{currentTestimonial.role}</p>
                  <p className="text-sm text-muted-foreground">{currentTestimonial.company}</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={prevTestimonial}
              className="glass-card hover:bg-primary/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlay(false);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextTestimonial}
              className="glass-card hover:bg-primary/5"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-muted-foreground mb-6">
            Ready to join thousands of successful traders?
          </p>
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 shadow-floating group"
          >
            Start Your Success Story
            <TrendingUp className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ModernTestimonials;