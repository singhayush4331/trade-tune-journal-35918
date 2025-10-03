import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Quote,
  Star,
  ArrowLeft,
  ArrowRight,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const SuccessStories = () => {
  const isMobile = useIsMobile();
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      name: "Rahul Sharma",
      title: "Software Engineer turned Full-time Trader",
      location: "Mumbai",
      avatar: "RS",
      rating: 5,
      quote: "The Discord community and masterclass completely transformed my trading approach. The structured learning and mentorship provided were invaluable for my growth as a trader!",
      highlights: ["Structured learning approach", "Strong community support", "Excellent mentorship"]
    },
    {
      name: "Priya Patel", 
      title: "Homemaker & Part-time Trader",
      location: "Bangalore",
      avatar: "PP",
      rating: 5,
      quote: "As a complete beginner, I was intimidated by trading. The community support and structured masterclass made learning easy and fun. The education quality is outstanding!",
      highlights: ["Beginner-friendly content", "Supportive community", "Flexible learning schedule"]
    },
    {
      name: "Vikram Joshi",
      title: "Business Owner & Options Trader",
      location: "Delhi", 
      avatar: "VJ",
      rating: 5,
      quote: "The advanced options strategies taught in the masterclass are pure gold. I've never seen such detailed and practical trading education anywhere else. Worth every penny!",
      highlights: ["Advanced strategies", "Detailed curriculum", "Practical education"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const nextStory = () => {
    setActiveStory((prev) => (prev + 1) % stories.length);
  };

  const prevStory = () => {
    setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/10 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-green-600/30 mb-6 px-4 py-2 shadow-md">
            <Trophy className="h-4 w-4 mr-2" />
            Success Stories
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6 leading-tight`}>
            Real Reviews from
            <br />
            <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Real Students
            </span>
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}>
            Discover what our community members and masterclass graduates have to say about their learning experience and educational journey.
          </p>
        </motion.div>

        {/* Main Story Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/20">
            {/* Story Content - Single Column */}
            <motion.div
              key={activeStory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Story Header */}
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {stories[activeStory].avatar}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">{stories[activeStory].name}</h3>
                  <p className="text-lg text-muted-foreground mb-3">{stories[activeStory].title}</p>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-blue-500/20 text-blue-600">
                      {stories[activeStory].location}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {[...Array(stories[activeStory].rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative">
                <Quote className="h-12 w-12 text-primary/30 absolute -top-4 -left-4" />
                <blockquote className="text-xl italic pl-8 leading-relaxed text-center">
                  "{stories[activeStory].quote}"
                </blockquote>
              </div>

              {/* Key Highlights */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-center">Key Highlights:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stories[activeStory].highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 justify-center md:justify-start">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-muted/20">
              <Button 
                variant="outline" 
                size="sm"
                onClick={prevStory}
                className="group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Previous
              </Button>

              {/* Clean Line Navigation */}
              <div className="flex items-center justify-center gap-3">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStory(index)}
                    className="group"
                  >
                    <div className={`transition-all duration-400 ease-out ${
                      index === activeStory 
                        ? 'w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full' 
                        : 'w-2 h-2 bg-muted-foreground/40 rounded-full group-hover:bg-muted-foreground/60 group-hover:scale-110'
                    }`} />
                  </button>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm"
                onClick={nextStory}
                className="group"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Your Learning Journey?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of students who have enhanced their trading knowledge with our comprehensive education program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 group text-white shadow-lg"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary shadow-sm">
                Learn More
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default SuccessStories;