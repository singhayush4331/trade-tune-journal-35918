
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, Search, Star, ChevronRight, FileText, BarChart3, 
  TrendingUp, GraduationCap, Zap, CheckCircle, Brain,
  Trophy, Target, PlayCircle, Lightbulb, Clock, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const CustomEducationSection = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState('recommended');
  
  return (
    <div className="space-y-16 py-10">
      {/* Header Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Learn to Trade Like a Pro
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Get personalized education that adapts to your trading style 
            and helps you overcome your specific challenges.
          </motion.p>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-primary/10 shadow-sm backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold text-base">250+ Trading Lessons</div>
                <div className="text-sm text-muted-foreground">Curated by professional traders</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-blue-500/10 shadow-sm backdrop-blur-sm">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="font-semibold text-base">Personalized Path</div>
                <div className="text-sm text-muted-foreground">Based on your trading data</div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* AI Course Generator */}
        <motion.div 
          className="bg-gradient-to-br from-card/90 via-card/80 to-background/80 backdrop-blur-md border border-white/10 rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{
            boxShadow: "0 8px 30px rgba(155, 135, 245, 0.15)"
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              AI Course Generator
            </h3>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Premium
            </Badge>
          </div>
          
          <div className="relative mb-6">
            <Input 
              type="text" 
              value={searchValue} 
              onChange={e => setSearchValue(e.target.value)} 
              placeholder="Ask for a custom course or search topics..." 
              className="bg-background/50 backdrop-blur-sm border border-white/10 pr-10 shadow-inner"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground">Popular topics:</span>
              {[
                {name: "Price Action", color: "primary"},
                {name: "Risk Management", color: "blue-500"},
                {name: "Chart Patterns", color: "purple-500"},
                {name: "Trading Psychology", color: "amber-500"}
              ].map((topic, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`cursor-pointer bg-${topic.color}/10 text-${topic.color} border-${topic.color}/20 hover:bg-${topic.color}/20 transition-colors`}
                >
                  {topic.name}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background/40 border border-white/5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm">Trading Psychology</div>
                  <div className="text-xs text-muted-foreground">12 lessons</div>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-background/40 border border-white/5 flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Target className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium text-sm">Entry Strategies</div>
                  <div className="text-xs text-muted-foreground">8 lessons</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group">
              Generate Custom Course
              <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Learning Paths Section */}
      <div className="space-y-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="text-2xl font-semibold">Your Learning Journey</h3>
            <p className="text-muted-foreground">Track your progress through personalized learning paths</p>
          </div>
          
          <div className="flex items-center bg-card/50 rounded-lg p-1 border border-white/10">
            <Button 
              variant={activeTab === 'recommended' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('recommended')}
              className="text-sm"
            >
              Recommended
            </Button>
            <Button 
              variant={activeTab === 'progress' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('progress')}
              className="text-sm"
            >
              In Progress
            </Button>
            <Button 
              variant={activeTab === 'completed' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('completed')}
              className="text-sm"
            >
              Completed
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              title: "Technical Analysis Mastery",
              icon: <BarChart3 className="h-5 w-5 text-white" />,
              iconColor: "from-primary to-blue-500",
              progress: 68,
              lessons: 24,
              completed: 16,
              lastLesson: "Fibonacci Retracement",
              difficulty: "Intermediate"
            },
            {
              title: "Risk Management Fundamentals",
              icon: <TrendingUp className="h-5 w-5 text-white" />,
              iconColor: "from-blue-500 to-cyan-500",
              progress: 42,
              lessons: 18,
              completed: 8,
              lastLesson: "Position Sizing",
              difficulty: "Beginner" 
            },
            {
              title: "Trading Psychology",
              icon: <FileText className="h-5 w-5 text-white" />,
              iconColor: "from-purple-500 to-pink-500",
              progress: 23,
              lessons: 15,
              completed: 3,
              lastLesson: "Managing Emotions",
              difficulty: "Advanced"
            }
          ].map((path, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
              }}
              className="h-full"
            >
              <Card className="h-full border border-white/10 overflow-hidden bg-gradient-to-br from-card/90 via-card/80 to-background/80 backdrop-blur-md">
                <CardContent className="p-0">
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${path.iconColor} flex items-center justify-center shadow-lg shadow-primary/10`}>
                        {path.icon}
                      </div>
                      <div>
                        <Badge 
                          variant="outline" 
                          className={`mb-1 px-2 py-0 text-xs ${
                            path.difficulty === "Beginner" 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : path.difficulty === "Intermediate"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              : "bg-purple-500/10 text-purple-500 border-purple-500/20"
                          }`}
                        >
                          {path.difficulty}
                        </Badge>
                        <h4 className="font-semibold text-lg">{path.title}</h4>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{path.progress}%</span>
                      </div>
                      
                      <Progress 
                        value={path.progress} 
                        className="h-2.5 bg-background/40" 
                        indicatorClassName={`bg-gradient-to-r ${path.iconColor}`} 
                      />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          <span className="font-medium">{path.completed}</span>
                          <span className="text-muted-foreground"> / {path.lessons} lessons</span>
                        </span>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-3.5 w-3.5 ${
                                i < Math.ceil(path.progress / 20) 
                                  ? "text-amber-500 fill-amber-500" 
                                  : "text-muted"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/5 p-4 bg-background/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">Last lesson:</div>
                      <div className="font-medium text-sm">{path.lastLesson}</div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                    >
                      Continue
                      <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Featured Content */}
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div>
          <h3 className="text-2xl font-semibold mb-2">Featured Content</h3>
          <p className="text-muted-foreground">Explore our curated lessons and tutorials</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Mastering Candlestick Patterns",
              icon: <LayoutGrid className="h-5 w-5 text-white" />,
              color: "from-primary to-purple-600",
              length: "45 min",
              level: "Intermediate"
            },
            {
              title: "Risk-to-Reward Ratios",
              icon: <Target className="h-5 w-5 text-white" />,
              color: "from-blue-500 to-cyan-500",
              length: "32 min",
              level: "Beginner"
            },
            {
              title: "Trading Journal Masterclass",
              icon: <FileText className="h-5 w-5 text-white" />,
              color: "from-amber-500 to-orange-500",
              length: "58 min",
              level: "All levels"
            },
            {
              title: "Advanced Price Action",
              icon: <TrendingUp className="h-5 w-5 text-white" />,
              color: "from-green-500 to-emerald-500",
              length: "65 min",
              level: "Advanced"
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)"
              }}
            >
              <Card className="border border-white/10 bg-gradient-to-br from-card/90 via-card/80 to-background/80 backdrop-blur-md overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-36 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-90`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm">
                          {item.level}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-white text-xs">
                          <Clock className="h-3.5 w-3.5" />
                          {item.length}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <h4 className="font-medium">{item.title}</h4>
                    </div>
                    <Button 
                      className="w-full bg-card hover:bg-primary/10 border border-primary/20 text-sm text-primary hover:text-primary"
                      variant="outline"
                      size="sm"
                    >
                      Watch Lesson
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Achievements and Progress */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-5 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="lg:col-span-2 space-y-5">
          <div>
            <h3 className="text-2xl font-semibold mb-1">Your Achievements</h3>
            <p className="text-muted-foreground">
              Track your progress and earn recognition for mastering trading concepts
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 mt-6">
            <Card className="border border-white/10 bg-card/90 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-lg">
                  <Trophy className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <div className="font-semibold">Courses Completed</div>
                  <div className="text-2xl font-bold">3 <span className="text-muted-foreground text-sm font-normal">/ 8</span></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-card/90 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">Lessons Completed</div>
                  <div className="text-2xl font-bold">27 <span className="text-muted-foreground text-sm font-normal">/ 57</span></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-white/10 bg-card/90 backdrop-blur-md">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Learning Streak
                </h4>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-8 w-8 rounded-md flex items-center justify-center ${
                        i < 5 
                          ? "bg-primary/20 text-primary" 
                          : "bg-background/50 text-muted-foreground"
                      }`}
                    >
                      {i < 5 && <CheckCircle className="h-4 w-4" />}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">5 day streak! Keep going!</div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Card className="h-full border border-white/10 bg-gradient-to-br from-card/90 via-card/90 to-background/80 backdrop-blur-md overflow-hidden">
            <CardContent className="p-5 h-full flex flex-col">
              <h4 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Learning Achievements
              </h4>
              
              <div className="space-y-5 flex-1">
                {[
                  {
                    title: "Trading Psychology Master",
                    description: "Complete all psychology-related courses",
                    progress: 35,
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Technical Analyst",
                    description: "Master all technical indicators",
                    progress: 62,
                    color: "from-primary to-blue-500"
                  },
                  {
                    title: "Risk Manager",
                    description: "Complete risk management curriculum",
                    progress: 78,
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Chart Pattern Expert",
                    description: "Identify and trade all major patterns",
                    progress: 45,
                    color: "from-blue-500 to-cyan-500"
                  }
                ].map((achievement, index) => (
                  <div key={index} className="space-y-2.5 bg-background/20 p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <div className="font-medium">{achievement.title}</div>
                        <div className="text-xs text-muted-foreground">{achievement.description}</div>
                      </div>
                      <div className="text-sm font-medium bg-background/50 py-1 px-2 rounded-md">
                        {achievement.progress}%
                      </div>
                    </div>
                    
                    <Progress 
                      value={achievement.progress} 
                      className="h-2.5 bg-background/40" 
                      indicatorClassName={`bg-gradient-to-r ${achievement.color}`} 
                    />
                    
                    <div className="flex items-center justify-end text-xs text-muted-foreground">
                      {achievement.progress < 100 
                        ? `${100 - achievement.progress}% remaining to unlock` 
                        : "Completed"}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-primary/20 hover:bg-primary/10 hover:text-primary"
                >
                  View All Achievements
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomEducationSection;
