import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  MapPin,
  Video,
  Users, 
  Clock, 
  Star,
  Award,
  CheckCircle,
  ArrowRight,
  Calendar,
  Trophy,
  Zap,
  Globe,
  Building,
  Wifi,
  Coffee,
  PersonStanding,
  Monitor,
  Handshake,
  Target
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedCounter } from '@/components/modern/AnimatedCounter';

const DualMasterclassShowcase = () => {
  const isMobile = useIsMobile();
  const [activeFormat, setActiveFormat] = useState<'online' | 'offline'>('online');

  const masterclassData = {
    online: {
      title: "Live Online Masterclass",
      subtitle: "Learn from anywhere with real-time interaction",
      priceText: "Contact for pricing",
      duration: "12 weeks • 3 months",
      participants: "50+ students per batch",
      nextBatch: "15th Jan 2025",
      rating: 4.9,
      reviews: 1247,
      features: [
        "Live interactive sessions with Q&A",
        "Screen sharing and real-time charts",
        "Recorded sessions for replay",
        "Digital resources and PDFs",
        "Online community access",
        "1-on-1 doubt clearing sessions"
      ],
      benefits: [
        { icon: Globe, text: "Join from anywhere", color: "blue" },
        { icon: Video, text: "HD live streaming", color: "green" },
        { icon: Users, text: "Interactive Q&A", color: "purple" },
        { icon: Monitor, text: "Screen sharing", color: "orange" }
      ],
      highlights: {
        flexibility: "Study at your own pace",
        interaction: "Live doubt resolution", 
        resources: "Lifetime access to recordings",
        community: "Exclusive online group"
      }
    },
    offline: {
      title: "In-Person Masterclass",
      subtitle: "Immersive learning experience with direct mentorship",
      priceText: "Contact for pricing",
      duration: "4 weeks • 1 month",
      participants: "Limited to 25 students",
      nextBatch: "25th Jan 2025",
      location: "Mumbai • Bangalore • Delhi",
      rating: 4.95,
      reviews: 892,
      features: [
        "Face-to-face interaction with mentors",
        "Hands-on trading simulation",
        "Networking with fellow traders",
        "Physical workbooks and materials",
        "Lunch and refreshments included",
        "Certificate of completion"
      ],
      benefits: [
        { icon: PersonStanding, text: "Personal attention", color: "blue" },
        { icon: Handshake, text: "Networking opportunities", color: "green" },
        { icon: Coffee, text: "Refreshments included", color: "orange" },
        { icon: Building, text: "Premium venue", color: "purple" }
      ],
      highlights: {
        interaction: "Direct mentor guidance",
        networking: "Meet like-minded traders",
        experience: "Immersive 2-day program",
        materials: "Physical resources included"
      }
    }
  };

  const formatToggle = (format: 'online' | 'offline') => (
    <button
      onClick={() => setActiveFormat(format)}
      className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${
        activeFormat === format
          ? format === 'online' 
            ? 'bg-primary text-white shadow-lg' 
            : 'bg-accent text-accent-foreground shadow-lg'
          : 'bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/40'
      }`}
    >
      {format === 'online' ? (
        <>
          <Video className="h-4 w-4 inline mr-2" />
          Online Program
        </>
      ) : (
        <>
          <MapPin className="h-4 w-4 inline mr-2" />
          Offline Program
        </>
      )}
    </button>
  );

  const currentData = masterclassData[activeFormat];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background to-muted/10 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-primary/5 to-primary/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/3 to-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-600/30 mb-6 px-4 py-2 shadow-md">
            <BookOpen className="h-4 w-4 mr-2" />
            Masterclass in Strategic Trading and Investment
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6 leading-tight`}>
            Choose Your Learning
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Experience
            </span>
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}>
            Master strategic trading and investment with our comprehensive program. Choose between interactive online sessions or immersive in-person workshops.
          </p>
        </motion.div>

        {/* Format Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex bg-muted/30 rounded-xl p-2 max-w-lg mx-auto mb-12"
        >
          {formatToggle('online')}
          {formatToggle('offline')}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFormat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Hero Card - Mobile Optimized */}
            <Card className={`p-6 lg:p-8 bg-gradient-to-br ${
              activeFormat === 'online' 
                ? 'from-primary/10 to-primary/5 border-primary/20' 
                : 'from-accent/10 to-accent/5 border-accent/20'
            }`}>
              {/* Mobile-First Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                      activeFormat === 'online' 
                        ? 'bg-primary' 
                        : 'bg-accent'
                    }`}>
                      {activeFormat === 'online' ? (
                        <Video className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      ) : (
                        <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">{currentData.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{currentData.subtitle}</p>
                    </div>
                  </div>

                  {/* Rating and Badge - Mobile Stack */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">{currentData.rating}</span>
                      <span className="text-sm text-muted-foreground">({currentData.reviews} reviews)</span>
                    </div>
                    <Badge className={`self-start sm:self-auto ${
                      activeFormat === 'online' 
                        ? 'bg-blue-500/20 text-blue-600' 
                        : 'bg-orange-500/20 text-orange-600'
                    }`}>
                      Next: {currentData.nextBatch}
                    </Badge>
                  </div>
                </div>

                {/* Pricing - Mobile Friendly */}
                <div className="text-center sm:text-right bg-background/80 rounded-lg p-4 sm:bg-transparent sm:p-0">
                  <div className={`text-xl sm:text-2xl font-bold ${
                    activeFormat === 'online' ? 'text-blue-600' : 'text-orange-600'
                  }`}>
                    {currentData.priceText}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Call for details</div>
                </div>
              </div>

              {/* Program Details - Mobile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
                <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{currentData.duration}</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg">
                  <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm">{currentData.participants}</span>
                </div>
                {activeFormat === 'offline' && 'location' in currentData && (
                  <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg sm:col-span-2">
                    <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm">{(currentData as typeof masterclassData.offline).location}</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Button 
                size={isMobile ? "default" : "lg"}
                className={`w-full ${
                  activeFormat === 'online'
                     ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
                     : 'bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70'
                } text-white shadow-lg group h-12 sm:h-auto`}
              >
                Get Pricing & Register
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Card>

            {/* Features and Benefits - Mobile Optimized Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Features List - Full Width on Mobile */}
              <Card className="lg:col-span-2 p-4 sm:p-6 bg-card/95 backdrop-blur-sm border-primary/30 shadow-sm">
                <h4 className="text-lg sm:text-xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  What's Included
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {currentData.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      className="flex items-start gap-3 p-2 sm:p-3 bg-background/30 rounded-lg"
                    >
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Stats - Sidebar on Desktop, Full Width on Mobile */}
              <div className="space-y-4">
                <Card className="p-4 text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
                  <Trophy className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    <AnimatedCounter value={activeFormat === 'online' ? 2500 : 890} suffix="+" />
                  </div>
                  <p className="text-xs text-muted-foreground">Graduates</p>
                </Card>
                <Card className="p-4 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                  <Award className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    <AnimatedCounter value={activeFormat === 'online' ? 92 : 96} suffix="%" />
                  </div>
                  <p className="text-xs text-muted-foreground">Success Rate</p>
                </Card>
              </div>
            </div>

            {/* Key Benefits - Mobile Optimized Grid */}
            <Card className="p-4 sm:p-6 bg-card/95 backdrop-blur-sm border-primary/30 shadow-sm">
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Key Benefits
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {currentData.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                     className={`p-3 sm:p-4 rounded-lg bg-gradient-to-br ${
                       benefit.color === 'blue' ? 'from-primary/10 to-primary/5 border border-primary/20' :
                       benefit.color === 'green' ? 'from-primary/10 to-primary/5 border border-primary/20' :
                       benefit.color === 'orange' ? 'from-accent/10 to-accent/5 border border-accent/20' :
                       'from-primary/10 to-primary/5 border border-primary/20'
                     } text-center`}
                  >
                     <benefit.icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 ${
                       benefit.color === 'blue' ? 'text-primary' :
                       benefit.color === 'green' ? 'text-primary' :
                       benefit.color === 'orange' ? 'text-accent-foreground' :
                       'text-primary'
                     }`} />
                    <p className="text-xs sm:text-sm font-medium leading-tight">{benefit.text}</p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Highlights - Mobile Friendly */}
            <Card className="p-4 sm:p-6 bg-card/95 backdrop-blur-sm border-primary/30 shadow-sm">
              <h4 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Why Choose {activeFormat === 'online' ? 'Online' : 'Offline'}?
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(currentData.highlights).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg"
                  >
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activeFormat === 'online' ? 'bg-blue-500/20' : 'bg-orange-500/20'
                    }`}>
                      <Target className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        activeFormat === 'online' ? 'text-blue-500' : 'text-orange-500'
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-semibold text-sm sm:text-base capitalize">{key.replace(/([A-Z])/g, ' $1')}</h5>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Comparison Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Quick Comparison</h3>
          <Card className="p-6 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border-primary/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center p-6 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Video className="h-8 w-8 text-blue-500 mx-auto mb-4" />
                <h4 className="font-semibold text-blue-600 mb-2">Online Masterclass</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Learn from anywhere</li>
                  <li>• Flexible timing</li>
                  <li>• Recorded sessions</li>
                  <li>• Contact for pricing</li>
                </ul>
                <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  Get Pricing Info
                </Button>
              </div>
              
              <div className="text-center p-6 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-4" />
                <h4 className="font-semibold text-orange-600 mb-2">Offline Masterclass</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Face-to-face learning</li>
                  <li>• Hands-on practice</li>
                  <li>• Networking opportunities</li>
                  <li>• Contact for pricing</li>
                </ul>
                <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white">
                  Get Pricing Info
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default DualMasterclassShowcase;