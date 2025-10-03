import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Bot, ArrowRight, Sparkles, BarChart3, BookOpen, MessageSquare, ChevronRight, Clock, CheckCircle, MonitorPlay, Star, User, Brain, Zap, Cpu, LineChart, LayoutDashboard, Award, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import FeatureLayout from '@/components/layout/FeatureLayout';
import CustomEducationSection from '@/components/education/CustomEducationSection';
const AIAssistantPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showQuickNav, setShowQuickNav] = useState(false);

  // Function to handle smooth scrolling to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };
  return <FeatureLayout title="AI Trading Assistant">
      <Helmet>
        <title>AI Trading Assistant | Wiggly</title>
        <meta name="description" content="Get personalized trading insights with our advanced AI assistant. Analyze patterns, improve strategies, and receive custom education for better trading performance." />
        <meta name="keywords" content="AI trading assistant, trading insights, pattern recognition, trading education, trading AI" />
      </Helmet>
      
      {/* Hero Section */}
      <motion.section className="py-16 md:py-28 px-4 bg-gradient-to-b from-background via-background/80 to-background/50 relative overflow-hidden" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.6
    }}>
        {/* Enhanced decorative background elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute top-40 -right-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 -left-64 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl opacity-50 animate-pulse" style={{
        animationDelay: "1s"
      }}></div>
        
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <motion.div className="md:w-1/2 space-y-8" initial={{
            opacity: 0,
            x: -30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <div className="space-y-5">
                <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm shadow-sm" initial={{
                opacity: 0,
                y: -20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.4,
                delay: 0.3
              }}>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Trading Intelligence</span>
                </motion.div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                  Your Trading <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AI</span> Assistant
                </h1>
                
                <motion.p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                duration: 0.6,
                delay: 0.4
              }}>
                  Leverage advanced artificial intelligence to analyze your trading patterns,
                  get personalized insights, and transform your trading strategies for consistent profitability.
                </motion.p>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <motion.span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.4,
                delay: 0.5
              }}>
                  <Brain className="mr-1.5 h-4 w-4" />
                  Smart Pattern Recognition
                </motion.span>
                <motion.span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 text-sm font-medium text-blue-500 shadow-sm backdrop-blur-sm" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.4,
                delay: 0.6
              }}>
                  <LineChart className="mr-1.5 h-4 w-4" />
                  Advanced Performance Analysis
                </motion.span>
                <motion.span className="inline-flex items-center rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-sm font-medium text-purple-500 shadow-sm backdrop-blur-sm" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.4,
                delay: 0.7
              }}>
                  <BookOpen className="mr-1.5 h-4 w-4" />
                  Personalized Education
                </motion.span>
                <motion.span className="inline-flex items-center rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-sm font-medium text-amber-500 shadow-sm backdrop-blur-sm" initial={{
                opacity: 0,
                scale: 0.8
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                duration: 0.4,
                delay: 0.8
              }}>
                  <MessageSquare className="mr-1.5 h-4 w-4" />
                  Real-time Trading Chat
                </motion.span>
              </div>
              
              <motion.div className="pt-6 flex flex-wrap gap-4" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.9
            }}>
                <Button asChild size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 group shadow-lg shadow-primary/10">
                  <Link to="/signup">
                    Try AI Assistant Now
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary backdrop-blur-sm">
                  <Link to="/features/playbooks">
                    Explore Playbooks
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            
            <motion.div className="md:w-1/2" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.7,
            delay: 0.4
          }}>
              <div className="relative">
                {/* Enhanced glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-blue-500/15 to-purple-500/20 rounded-2xl blur-xl"></div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-2xl opacity-50 blur-md"></div>
                
                {/* Main card with glass morphism effect */}
                <div className="relative bg-gradient-to-br from-card/90 via-card/85 to-card/80 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/10">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Wiggly AI Assistant</h3>
                        <div className="flex items-center text-xs text-primary/90">
                          <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                          <span>Analyzing your trading patterns</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs px-3 py-1 text-primary bg-primary/10 border-primary/20 shadow-sm">Premium</Badge>
                  </div>
                  
                  <div className="space-y-5 mb-6">
                    <div className="flex gap-4 items-start">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </Avatar>
                      <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 relative max-w-[80%] shadow-md border border-white/5">
                        <div className="text-sm">
                          I've analyzed your recent trading performance. Your win rate has improved to 68% this month, up from 52% last month. Would you like me to explain the patterns I've identified?
                        </div>
                        <div className="absolute h-3 w-3 bg-background/60 border-l border-t border-white/5 rotate-45" style={{
                        left: "-6px",
                        top: "16px"
                      }} />
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start justify-end">
                      <div className="bg-primary/15 text-primary rounded-2xl p-4 relative max-w-[80%] shadow-md border border-primary/10">
                        <div className="text-sm">
                          Yes, please show me the patterns and what I can improve.
                        </div>
                        <div className="absolute h-3 w-3 bg-primary/15 border-r border-b border-primary/10 rotate-45" style={{
                        right: "-6px",
                        top: "16px"
                      }} />
                      </div>
                      <Avatar className="h-10 w-10 ring-2 ring-background bg-card/80 flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </Avatar>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" />
                      </Avatar>
                      <div className="bg-background/60 backdrop-blur-sm rounded-2xl p-4 relative max-w-[80%] shadow-md border border-white/5">
                        <div className="text-sm">
                          I've identified 3 key patterns in your profitable trades:
                          
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-green-500"></span>
                                <span className="font-medium">Morning breakouts</span>
                              </span>
                              <span className="text-green-500 font-medium">82% win rate</span>
                            </div>
                            <div className="h-2 bg-background/50 rounded-full w-full overflow-hidden">
                              <motion.div className="h-2 rounded-full bg-green-500" initial={{
                              width: "0%"
                            }} animate={{
                              width: "82%"
                            }} transition={{
                              duration: 1,
                              delay: 1.3
                            }} />
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-blue-500"></span>
                                <span className="font-medium">EMA pullbacks</span>
                              </span>
                              <span className="text-blue-500 font-medium">76% win rate</span>
                            </div>
                            <div className="h-2 bg-background/50 rounded-full w-full overflow-hidden">
                              <motion.div className="h-2 rounded-full bg-blue-500" initial={{
                              width: "0%"
                            }} animate={{
                              width: "76%"
                            }} transition={{
                              duration: 1,
                              delay: 1.5
                            }} />
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 pt-1">
                              <span className="flex items-center gap-1.5">
                                <span className="h-3 w-3 rounded-full bg-purple-500"></span>
                                <span className="font-medium">VWAP rejections</span>
                              </span>
                              <span className="text-purple-500 font-medium">71% win rate</span>
                            </div>
                            <div className="h-2 bg-background/50 rounded-full w-full overflow-hidden">
                              <motion.div className="h-2 rounded-full bg-purple-500" initial={{
                              width: "0%"
                            }} animate={{
                              width: "71%"
                            }} transition={{
                              duration: 1,
                              delay: 1.7
                            }} />
                            </div>
                          </div>
                          
                          <div className="mt-4">Would you like me to create a playbook for your highest win-rate setup?</div>
                        </div>
                        <div className="absolute h-3 w-3 bg-background/60 border-l border-t border-white/5 rotate-45" style={{
                        left: "-6px",
                        top: "16px"
                      }} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative mt-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input type="text" placeholder="Ask anything about your trading..." className="w-full pl-12 pr-16 py-3.5 bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-inner" />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Button size="sm" className="h-9 w-9 rounded-full p-0 bg-gradient-to-r from-primary to-purple-500 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Quick Navigation Button (Mobile) */}
      <div className="fixed bottom-8 right-8 z-50 md:hidden">
        <Button variant="outline" size="icon" onClick={() => setShowQuickNav(!showQuickNav)} className="h-12 w-12 rounded-full bg-card/80 backdrop-blur-md border border-white/10 shadow-lg">
          {showQuickNav ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </Button>
        
        {showQuickNav && <motion.div initial={{
        opacity: 0,
        scale: 0.9,
        y: 10
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} className="absolute bottom-16 right-0 bg-card/90 backdrop-blur-md border border-white/10 rounded-lg shadow-xl p-2 w-48">
            <div className="flex flex-col space-y-1">
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('pattern-analysis')} className="justify-start text-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Pattern Analysis
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('ai-chat')} className="justify-start text-sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                AI Chat Assistant
              </Button>
              <Button variant="ghost" size="sm" onClick={() => scrollToSection('education')} className="justify-start text-sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Custom Education
              </Button>
              <Separator className="my-1" />
              <Button variant="ghost" size="sm" onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="justify-start text-sm">
                <ArrowUp className="h-4 w-4 mr-2" />
                Back to Top
              </Button>
            </div>
          </motion.div>}
      </div>

      {/* Side Navigation (Desktop) */}
      <div className="fixed top-1/3 right-8 z-40 hidden md:flex flex-col gap-3">
        <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        delay: 1.2
      }} className="bg-card/60 backdrop-blur-md border border-white/10 rounded-full p-2 shadow-lg">
          <div className="flex flex-col gap-2">
            <Button variant={activeSection === 'pattern-analysis' ? 'secondary' : 'ghost'} size="icon" onClick={() => scrollToSection('pattern-analysis')} className="h-10 w-10 rounded-full" title="Pattern Analysis">
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button variant={activeSection === 'ai-chat' ? 'secondary' : 'ghost'} size="icon" onClick={() => scrollToSection('ai-chat')} className="h-10 w-10 rounded-full" title="AI Chat Assistant">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button variant={activeSection === 'education' ? 'secondary' : 'ghost'} size="icon" onClick={() => scrollToSection('education')} className="h-10 w-10 rounded-full" title="Custom Education">
              <BookOpen className="h-5 w-5" />
            </Button>
            <Separator className="mx-auto w-2/3" />
            <Button variant="ghost" size="icon" onClick={() => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })} className="h-10 w-10 rounded-full" title="Back to Top">
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Pattern Analysis Section */}
      <motion.section id="pattern-analysis" className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background/70 to-background/90" initial="hidden" whileInView="visible" viewport={{
      once: true,
      margin: "-100px"
    }} variants={sectionVariants} onViewportEnter={() => setActiveSection('pattern-analysis')}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/20 bg-primary/5 text-primary">
              <BarChart3 className="mr-2 h-4 w-4" /> Pattern Analysis
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent mb-5">
              Discover Your Trading Edge
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Identify your most profitable setups with our AI-powered pattern recognition technology
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div className="space-y-8" initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <div className="space-y-5">
                <h3 className="text-3xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">Pattern Recognition</h3>
                <p className="text-lg text-muted-foreground">
                  Identify your most profitable setups and understand the patterns behind your successful trades with advanced AI analysis.
                </p>
                
                <ul className="space-y-5 mt-8">
                  {[{
                  icon: <BarChart3 className="h-5 w-5 text-green-500" />,
                  title: "Win Rate Analysis",
                  desc: "Automatically discover your highest win-rate trading setups across multiple timeframes"
                }, {
                  icon: <Clock className="h-5 w-5 text-blue-500" />,
                  title: "Time Pattern Detection",
                  desc: "Uncover optimal trading hours and performance patterns for your trading style"
                }, {
                  icon: <MonitorPlay className="h-5 w-5 text-purple-500" />,
                  title: "Visual Setups Recognition",
                  desc: "Analyze chart patterns from your trading screenshots with advanced computer vision"
                }].map((item, i) => <motion.li key={i} className="flex gap-5 p-5 rounded-xl bg-card/40 backdrop-blur-md border border-white/5 shadow-lg" initial={{
                  opacity: 0,
                  y: 15
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.1 * i
                }} whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(var(--primary), 0.08)",
                  transition: {
                    duration: 0.2
                  }
                }}>
                      <div className="h-12 w-12 rounded-full bg-card/80 flex items-center justify-center shrink-0 shadow-lg border border-white/5">
                        {item.icon}
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>)}
                </ul>
              </div>
            </motion.div>
            
            <motion.div className="bg-gradient-to-br from-card/80 via-card/75 to-background/70 backdrop-blur-md border border-white/10 rounded-xl p-7 shadow-xl" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Your Trading Patterns
                  </h4>
                  <Badge variant="outline" className="text-xs bg-primary/5 border-primary/10 text-primary px-3 py-1">Last 30 days</Badge>
                </div>
                
                <div className="space-y-6">
                  {[{
                  label: "Morning Breakouts",
                  winRate: 82,
                  profit: "+₹32,450",
                  color: "bg-green-500",
                  textColor: "text-green-500"
                }, {
                  label: "Pullbacks to 20 EMA",
                  winRate: 76,
                  profit: "+₹24,780",
                  color: "bg-blue-500",
                  textColor: "text-blue-500"
                }, {
                  label: "VWAP Rejections",
                  winRate: 71,
                  profit: "+₹19,340",
                  color: "bg-purple-500",
                  textColor: "text-purple-500"
                }, {
                  label: "Afternoon Reversals",
                  winRate: 42,
                  profit: "-₹12,670",
                  color: "bg-red-500",
                  textColor: "text-red-500"
                }].map((item, i) => <motion.div key={i} className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-5">
                          <span className="font-semibold">{item.winRate}%</span>
                          <span className={`${item.textColor} font-semibold text-sm`}>{item.profit}</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-background/40 rounded-full w-full overflow-hidden shadow-inner">
                        <motion.div className={`h-2.5 rounded-full ${item.color}`} initial={{
                      width: "0%"
                    }} whileInView={{
                      width: `${item.winRate}%`
                    }} viewport={{
                      once: true
                    }} transition={{
                      duration: 1.2,
                      delay: 0.3 + i * 0.1
                    }} />
                      </div>
                    </motion.div>)}
                </div>
                
                <div className="pt-6">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Top Trading Hours
                  </h4>
                  <div className="grid grid-cols-8 gap-1.5">
                    {Array.from({
                    length: 8
                  }).map((_, i) => <div key={i} className="space-y-1.5">
                        <div className={`h-20 rounded-md ${i === 0 ? "bg-background/30" : i === 1 ? "bg-primary/20" : i === 2 ? "bg-primary/40" : i === 3 ? "bg-primary/70" : i === 4 ? "bg-primary" : i === 5 ? "bg-primary/60" : i === 6 ? "bg-primary/30" : "bg-background/30"} shadow-lg border border-white/5`}></div>
                        <div className="text-xs text-center text-muted-foreground font-medium">
                          {9 + i}:00
                        </div>
                      </div>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Decorative Separator */}
      <div className="relative px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-white/10"></div>
            <div className="mx-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-card flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
        </div>
      </div>

      {/* AI Chat Assistant Section */}
      <motion.section id="ai-chat" className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background/80 to-background/60" initial="hidden" whileInView="visible" viewport={{
      once: true,
      margin: "-100px"
    }} variants={sectionVariants} onViewportEnter={() => setActiveSection('ai-chat')}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-blue-500/20 bg-blue-500/5 text-blue-500">
              <MessageSquare className="mr-2 h-4 w-4" /> AI Chat Assistant
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 via-primary to-blue-600 bg-clip-text text-transparent mb-5">
              Smart Conversations for Smart Trading
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get actionable insights and guidance from your AI trading mentor
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div className="order-2 lg:order-1 bg-gradient-to-br from-card/90 via-card/85 to-background/80 backdrop-blur-md border border-white/10 rounded-xl p-7 shadow-xl" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <div className="flex flex-col space-y-5 h-full">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-primary/10">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Wiggly AI</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <span className="inline-block h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                        <span>Chat Assistant</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs px-3 py-1 bg-green-500/10 text-green-500 border-green-500/20 shadow-sm">Online</Badge>
                </div>
                
                <div className="flex gap-4 items-start">
                  <Avatar className="h-9 w-9 ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </Avatar>
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 relative shadow-md border border-white/5">
                    <div className="text-sm">
                      I've analyzed your recent trades. You're taking profits too early on winning trades (averaging 0.6R) while letting losses run too far (averaging -1.2R). This creates a negative risk-reward ratio despite your 65% win rate.
                    </div>
                    <div className="absolute h-3 w-3 bg-background/60 border-l border-t border-white/5 rotate-45" style={{
                    left: "-6px",
                    top: "16px"
                  }} />
                  </div>
                </div>
                
                <div className="flex gap-4 items-start justify-end">
                  <div className="bg-primary/15 text-primary rounded-xl p-4 relative shadow-md border border-primary/10">
                    <div className="text-sm">
                      What would you recommend I do to improve this?
                    </div>
                    <div className="absolute h-3 w-3 bg-primary/15 border-r border-b border-primary/10 rotate-45" style={{
                    right: "-6px",
                    top: "16px"
                  }} />
                  </div>
                  <Avatar className="h-9 w-9 ring-2 ring-background bg-card/80">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </Avatar>
                </div>
                
                <div className="flex gap-4 items-start">
                  <Avatar className="h-9 w-9 ring-2 ring-blue-500/20 bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </Avatar>
                  <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 relative shadow-md border border-white/5">
                    <div className="text-sm">
                      I recommend implementing a 1:2 risk-reward ratio on all trades. Based on your trading history, you should:
                      <ul className="list-disc pl-5 mt-3 space-y-1.5 text-sm">
                        <li>Set profit targets at 2x your risk amount</li>
                        <li>Use trailing stops when a trade moves 1.5x in your favor</li>
                        <li>Stick strictly to your predetermined stop losses</li>
                      </ul>
                      <p className="mt-3">I've created a custom playbook for this strategy. Would you like to see it?</p>
                    </div>
                    <div className="absolute h-3 w-3 bg-background/60 border-l border-t border-white/5 rotate-45" style={{
                    left: "-6px",
                    top: "16px"
                  }} />
                  </div>
                </div>
                
                <div className="mt-4 pb-2 flex">
                  <div className="relative flex-1">
                    <input type="text" placeholder="Type your message..." className="w-full pl-4 pr-12 py-3.5 bg-background/50 backdrop-blur-sm border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all shadow-inner" />
                    <Button size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full p-0 bg-gradient-to-r from-primary to-purple-500 shadow-lg shadow-primary/10">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div className="order-1 lg:order-2 space-y-8" initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6,
            delay: 0.2
          }}>
              <div className="space-y-5">
                <h3 className="text-3xl font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">AI Chat Assistant</h3>
                <p className="text-lg text-muted-foreground">
                  Get actionable insights and personalized recommendations based on your trading history and performance metrics.
                </p>
                
                <ul className="space-y-5 mt-8">
                  {[{
                  icon: <MessageSquare className="h-5 w-5 text-primary" />,
                  title: "Personalized Trading Guidance",
                  desc: "Get specific advice tailored to your trading style and history with context-aware AI"
                }, {
                  icon: <CheckCircle className="h-5 w-5 text-green-500" />,
                  title: "Real-time Performance Feedback",
                  desc: "Receive immediate feedback on your trading decisions to optimize your strategy"
                }, {
                  icon: <Cpu className="h-5 w-5 text-blue-500" />,
                  title: "Custom Strategy Development",
                  desc: "Get help building strategies based on your strengths with AI-powered insights"
                }].map((item, i) => <motion.li key={i} className="flex gap-5 p-5 rounded-xl bg-card/40 backdrop-blur-md border border-white/5 shadow-lg" initial={{
                  opacity: 0,
                  y: 15
                }} whileInView={{
                  opacity: 1,
                  y: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.1 * i
                }} whileHover={{
                  scale: 1.02,
                  backgroundColor: "rgba(var(--primary), 0.08)",
                  transition: {
                    duration: 0.2
                  }
                }}>
                      <div className="h-12 w-12 rounded-full bg-card/80 flex items-center justify-center shrink-0 shadow-lg border border-white/5">
                        {item.icon}
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-semibold text-lg">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </motion.li>)}
                </ul>
                
                <div className="pt-6">
                  <Button asChild variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary group shadow-md backdrop-blur-sm">
                    <Link to="/signup">
                      Chat with Wiggly AI Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Decorative Separator */}
      <div className="relative px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="relative flex items-center py-8">
            <div className="flex-grow border-t border-white/10"></div>
            <div className="mx-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500/20 to-primary/20 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-card flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-purple-500" />
                </div>
              </div>
            </div>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <motion.section id="education" className="relative py-20 md:py-28 px-4 bg-gradient-to-b from-background/70 to-background/90" initial="hidden" whileInView="visible" viewport={{
      once: true,
      margin: "-100px"
    }} variants={sectionVariants} onViewportEnter={() => setActiveSection('education')}>
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 px-4 py-1.5 border-purple-500/20 bg-purple-500/5 text-purple-500">
              <BookOpen className="mr-2 h-4 w-4" /> Personalized Trading Education
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-primary to-blue-500 bg-clip-text text-transparent mb-5">
              Learn to Trade Like a Pro
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get personalized trading education based on your unique trading style and areas for improvement
            </p>
          </div>
          
          <CustomEducationSection />
        </div>
      </motion.section>
      
      {/* Enhanced Testimonials Section */}
      
    </FeatureLayout>;
};
export default AIAssistantPage;