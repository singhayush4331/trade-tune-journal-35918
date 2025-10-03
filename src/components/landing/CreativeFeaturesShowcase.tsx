import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  Video,
  MessageSquare,
  Target,
  Award,
  TrendingUp,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Globe,
  Clock,
  Trophy
} from 'lucide-react';

const CreativeFeaturesShowcase = () => {
  const [activeTab, setActiveTab] = useState('masterclass');

  const features = {
    masterclass: {
      title: "Masterclass in Strategic Trading and Investment",
      description: "Comprehensive trading education with expert mentorship",
      color: "from-blue-500 to-indigo-600",
      items: [
        {
          icon: BookOpen,
          title: "50+ Video Modules",
          description: "Comprehensive curriculum covering all aspects of trading",
          highlight: "Complete Syllabus"
        },
        {
          icon: Users,
          title: "1-on-1 Mentorship",
          description: "Personal guidance from expert traders",
          highlight: "Expert Support"
        },
        {
          icon: Video,
          title: "Live Trading Sessions",
          description: "Watch professionals trade in real-time",
          highlight: "Real Experience"
        },
        {
          icon: Target,
          title: "Proven Strategies",
          description: "Battle-tested trading methodologies",
          highlight: "89% Success Rate"
        }
      ]
    },
    community: {
      title: "Elite Trading Community",
      description: "Connect with profitable traders and industry experts",
      color: "from-green-500 to-emerald-600",
      items: [
        {
          icon: MessageSquare,
          title: "5000+ Active Traders",
          description: "Vibrant community of successful traders",
          highlight: "Live Discussions"
        },
        {
          icon: TrendingUp,
          title: "Market Analysis",
          description: "Educational market insights and analysis",
          highlight: "Learning Resources"
        },
        {
          icon: Award,
          title: "Expert Mentors",
          description: "Learn from industry professionals",
          highlight: "24/7 Guidance"
        },
        {
          icon: Star,
          title: "Success Stories",
          description: "Proven track record of member success",
          highlight: "2500+ Graduates"
        }
      ]
    },
    support: {
      title: "Comprehensive Support System",
      description: "Complete ecosystem for your trading journey",
      color: "from-purple-500 to-pink-600",
      items: [
        {
          icon: Clock,
          title: "24/7 Support",
          description: "Round-the-clock assistance whenever you need",
          highlight: "Always Available"
        },
        {
          icon: Globe,
          title: "Global Access",
          description: "Learn from anywhere in the world",
          highlight: "Worldwide Community"
        },
        {
          icon: Trophy,
          title: "Certification",
          description: "Industry-recognized trading certification",
          highlight: "Career Boost"
        },
        {
          icon: Zap,
          title: "Lifetime Access",
          description: "One-time payment, lifetime benefits",
          highlight: "Forever Yours"
        }
      ]
    }
  };

  const tabs = [
    { key: 'masterclass', label: 'Masterclass', icon: BookOpen },
    { key: 'community', label: 'Community', icon: Users },
    { key: 'support', label: 'Support', icon: Award }
  ];

  return (
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600/30 mb-6 px-4 py-2 shadow-md">
            <Star className="h-4 w-4 mr-2" />
            Complete Trading Ecosystem
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Master Trading
            </span>
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From comprehensive education to live mentorship and community support - we've built the complete ecosystem for your trading success.
          </p>
        </motion.div>

        {/* Always Horizontal Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex justify-center mb-12"
        >
          <div className="flex bg-muted/30 rounded-xl p-1 sm:p-2 w-full max-w-md overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-1 flex items-center justify-center gap-1.5 sm:gap-2 
                  px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg 
                  text-xs sm:text-sm font-medium transition-all duration-300 
                  whitespace-nowrap min-w-0
                  ${activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                  }
                `}
              >
                <tab.icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{features[activeTab].title}</h3>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                {features[activeTab].description}
              </p>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-6 md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8 md:overflow-visible md:pb-0 scroll-smooth snap-x snap-mandatory">
              {features[activeTab].items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50, rotateY: 10 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className="group flex-shrink-0 w-72 md:w-auto snap-center perspective-1000"
                >
                  <Card className="relative p-6 h-full bg-gradient-to-br from-card to-card/80 border-2 border-border/40 hover:border-primary/60 transition-all duration-700 shadow-lg hover:shadow-2xl transform-gpu group-hover:scale-[1.02] group-hover:-rotate-1 overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                    
                    {/* Subtle glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg blur opacity-0 group-hover:opacity-30 transition-all duration-700 -z-10"></div>
                    
                    <div className="relative z-10">
                      <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${features[activeTab].color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                        <motion.div
                          whileHover={{ rotate: 15, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <item.icon className="h-8 w-8 md:h-10 md:w-10 text-white" />
                        </motion.div>
                      </div>
                      
                      <motion.h4 
                        className="text-xl md:text-2xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-500"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        {item.title}
                      </motion.h4>
                      
                      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6 text-center group-hover:text-foreground/90 transition-colors duration-500">
                        {item.description}
                      </p>
                      
                      <div className="flex justify-center">
                        <Badge className={`bg-gradient-to-r ${features[activeTab].color} text-white text-xs md:text-sm px-3 py-1.5 shadow-md group-hover:shadow-lg transform group-hover:scale-105 transition-all duration-500 font-medium`}>
                          {item.highlight}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Animated corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-x-5 -translate-y-5 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 max-w-3xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl md:text-2xl font-bold">Ready to Transform Your Trading?</h3>
                <p className="text-muted-foreground">Join thousands of successful traders today</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="font-bold text-2xl text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="font-bold text-2xl text-green-600">30K+</div>
                <div className="text-sm text-muted-foreground">Students Trained</div>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg">
                <div className="font-bold text-2xl text-purple-600">200+</div>
                <div className="text-sm text-muted-foreground">Traders Funded</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group px-8"
              >
                Get Started Today
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="border-primary/30 hover:border-primary hover:bg-primary/20 hover:text-primary px-8 shadow-sm">
                Learn More
                <Play className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CreativeFeaturesShowcase;