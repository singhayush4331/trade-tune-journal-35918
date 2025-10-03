import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  PlayCircle, 
  Users, 
  Clock, 
  Star,
  Award,
  TrendingUp,
  Target,
  CheckCircle,
  ArrowRight,
  Video,
  FileText,
  Headphones,
  Trophy,
  Zap
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { AnimatedCounter } from '@/components/modern/AnimatedCounter';

const MasterclassShowcase = () => {
  const isMobile = useIsMobile();
  const [selectedModule, setSelectedModule] = useState(0);

  const modules = [
    {
      title: "Technical Analysis Mastery",
      duration: "8 hours",
      lessons: 24,
      progress: 100,
      difficulty: "Intermediate",
      description: "Master chart patterns, indicators, and market structure analysis",
      highlights: ["Support & Resistance", "Candlestick Patterns", "Trend Analysis", "Volume Studies"]
    },
    {
      title: "Options Trading Strategies", 
      duration: "12 hours",
      lessons: 36,
      progress: 75,
      difficulty: "Advanced",
      description: "Learn profitable options strategies for all market conditions",
      highlights: ["Iron Condor", "Butterfly Spreads", "Straddles & Strangles", "Greeks Mastery"]
    },
    {
      title: "Risk Management & Psychology",
      duration: "6 hours", 
      lessons: 18,
      progress: 45,
      difficulty: "Beginner",
      description: "Develop discipline and proper risk management techniques",
      highlights: ["Position Sizing", "Stop Loss Strategies", "Trading Psychology", "Money Management"]
    }
  ];

  const instructors = [
    {
      name: "Rajesh Kumar",
      title: "Head Trading Mentor",
      experience: "15+ Years",
      specialization: "Technical Analysis",
      students: "2,500+",
      rating: 4.9,
      image: "RK"
    },
    {
      name: "Priya Sharma", 
      title: "Options Specialist",
      experience: "12+ Years",
      specialization: "Options Strategies",
      students: "1,800+",
      rating: 4.8,
      image: "PS"
    },
    {
      name: "Amit Patel",
      title: "Risk Management Expert", 
      experience: "10+ Years",
      specialization: "Psychology & Risk",
      students: "2,200+",
      rating: 4.9,
      image: "AP"
    }
  ];

  const studentResults = [
    {
      name: "Vikram S.",
      achievement: "Generated ₹2.5L profit in 3 months",
      improvement: "+180% ROI",
      timeframe: "3 months"
    },
    {
      name: "Sneha M.",
      achievement: "Improved win rate from 45% to 78%",
      improvement: "+33% Win Rate",
      timeframe: "6 months"
    },
    {
      name: "Rohit K.",
      achievement: "Reduced max drawdown from 15% to 4%",
      improvement: "-73% Risk",
      timeframe: "4 months"
    }
  ];

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-muted/20 to-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="bg-gradient-to-r from-orange-500/20 to-pink-500/20 text-orange-600 border-orange-500/30 mb-6 px-4 py-2">
            <BookOpen className="h-4 w-4 mr-2" />
            Diploma Program
          </Badge>
          <h2 className={`${isMobile ? 'text-3xl' : 'text-5xl'} font-bold mb-6 leading-tight`}>
            Transform Your Trading with
            <br />
            <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Strategic Trading Masterclass
            </span>
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-xl'} text-muted-foreground max-w-3xl mx-auto leading-relaxed`}>
            Learn from India's top trading mentors with our comprehensive masterclass. 50+ hours of premium content, live sessions, and personal mentorship.
          </p>
        </motion.div>

        {/* Course Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="p-6 text-center bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-orange-600">
              <AnimatedCounter value={2500} suffix="+" />
            </div>
            <p className="text-sm text-muted-foreground">Students Trained</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <Star className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-green-600">
              <AnimatedCounter value={4.9} />
            </div>
            <p className="text-sm text-muted-foreground">Average Rating</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-600">
              <AnimatedCounter value={50} suffix="+" />
            </div>
            <p className="text-sm text-muted-foreground">Hours Content</p>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-600">
              <AnimatedCounter value={200} suffix="+" />
            </div>
            <p className="text-sm text-muted-foreground">Traders Funded</p>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Course Modules */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Masterclass Modules</h3>
              <div className="space-y-4">
                {modules.map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card 
                      className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                        selectedModule === index 
                          ? 'border-primary/40 bg-primary/5' 
                          : 'border-muted/30 hover:border-primary/20'
                      }`}
                      onClick={() => setSelectedModule(index)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{module.title}</h4>
                            <Badge className={`text-xs ${
                              module.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-600' :
                              module.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-red-500/20 text-red-600'
                            }`}>
                              {module.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                          <div className="flex items-center gap-4 mb-3">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {module.duration}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <PlayCircle className="h-3 w-3" />
                              {module.lessons} lessons
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={module.progress} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground">{module.progress}%</span>
                          </div>
                        </div>
                      </div>
                      
                      {selectedModule === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-muted/20"
                        >
                          <h5 className="font-medium mb-2">Key Topics Covered:</h5>
                          <div className="grid grid-cols-2 gap-2">
                            {module.highlights.map((highlight, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {highlight}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Instructors & Results */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Expert Instructors */}
            <Card className="p-6 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Expert Instructors</h3>
                  <p className="text-muted-foreground">Learn from the best in the industry</p>
                </div>
              </div>

              <div className="space-y-4">
                {instructors.map((instructor, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {instructor.image}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{instructor.name}</h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-yellow-600">{instructor.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-primary font-medium">{instructor.title}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">{instructor.experience} Experience</span>
                        <span className="text-xs text-muted-foreground">{instructor.students} Students</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Student Success Stories */}
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Student Success Stories</h3>
                  <p className="text-muted-foreground">Real results from our graduates</p>
                </div>
              </div>

              <div className="space-y-4">
                {studentResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="p-4 bg-white/50 dark:bg-muted/20 rounded-lg border border-green-200/30"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{result.name}</h4>
                      <Badge className="bg-green-500/20 text-green-600 border-green-500/30">
                        {result.improvement}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{result.achievement}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Achieved in {result.timeframe}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Course Features */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <h3 className="text-xl font-semibold mb-4">What You Get</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">HD Video Lectures</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">PDF Resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <Headphones className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Live Q&A Sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">Lifetime Access</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-pink-500/10 border-orange-500/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Master Trading?</h3>
            <p className="text-muted-foreground mb-6">
              Join our masterclass and learn from India's top trading mentors. Limited seats available!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 group text-white shadow-lg"
              >
                Enroll Now - ₹9,999
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/5">
                View Curriculum
                <BookOpen className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default MasterclassShowcase;