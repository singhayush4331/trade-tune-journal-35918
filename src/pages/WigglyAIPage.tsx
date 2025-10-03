import React, { useState, lazy, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { getOpenAIKey } from '@/services/ai-analysis-service';
import AppLayout from '@/components/layout/AppLayout';
import OpenAIKeyForm from '@/components/ai/OpenAIKeyForm';
import WigglyFeatureSelector from '@/components/ai/WigglyFeatureSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Bot, 
  Key,
  BookOpen,
  FileQuestion,
  Lightbulb,
  Sparkles,
  Zap,
  BarChart3
} from 'lucide-react';

// Lazy load components for better code splitting
const TradingChatBot = lazy(() => import('@/components/ai/TradingChatBot'));
const TradingEducationHub = lazy(() => import('@/components/education/TradingEducationHub'));
const TradesAnalysis = lazy(() => import('@/components/ai/TradesAnalysis'));

// Loading fallback components
const ChatBotLoading = () => (
  <div className="flex flex-col h-full p-6 space-y-4">
    <div className="flex-1 space-y-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-3/4" />
      <Skeleton className="h-16 w-5/6" />
    </div>
    <div className="h-14 w-full bg-muted/30 rounded-lg"></div>
  </div>
);

const EducationLoading = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-10 w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  </div>
);

const AnalysisLoading = () => (
  <div className="p-6 space-y-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-64 w-full" />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Skeleton className="h-32" />
      <Skeleton className="h-32" />
    </div>
  </div>
);

const WigglyAIPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [activeEducationTab, setActiveEducationTab] = useState("learning");
  const isMobile = useIsMobile();
  const [hasApiKey, setHasApiKey] = useState<boolean>(!!getOpenAIKey());
  
  // Listen for API key changes
  useEffect(() => {
    const checkApiKey = () => {
      setHasApiKey(!!getOpenAIKey());
    };
    
    window.addEventListener('globalDataRefresh', checkApiKey);
    return () => {
      window.removeEventListener('globalDataRefresh', checkApiKey);
    };
  }, []);

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none" />
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
        <div className="absolute top-1/4 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8 }} 
          className="container py-10 pb-20 space-y-8 max-w-5xl mx-auto relative z-10"
        >
          {/* Header section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div 
                className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg shadow-primary/20" 
                animate={{
                  y: [0, -5, 0],
                  boxShadow: [
                    '0 10px 25px -5px rgba(155, 135, 245, 0.2)',
                    '0 20px 25px -5px rgba(155, 135, 245, 0.4)',
                    '0 10px 25px -5px rgba(155, 135, 245, 0.2)',
                  ]
                }} 
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                <Bot className="h-7 w-7 text-white" />
              </motion.div>
              <motion.h1 
                className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent py-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Wiggly AI
              </motion.h1>
            </div>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="max-w-2xl mx-auto text-muted-foreground text-lg mb-8"
            >
              Unlock powerful AI insights for your trading journey, analyze patterns, and get personalized trading education
            </motion.p>
            
            {/* Feature tags */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-4 mt-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                { name: "Trading Insights", icon: <Sparkles className="h-3.5 w-3.5" />, color: "primary" },
                { name: "Performance Analysis", icon: <BarChart3 className="h-3.5 w-3.5" />, color: "blue-500" },
                { name: "Learning & Growth", icon: <Zap className="h-3.5 w-3.5" />, color: "amber-500" }
              ].map((tag, index) => (
                <motion.div 
                  key={tag.name}
                  initial={{
                    opacity: 0,
                    scale: 0.8
                  }} 
                  animate={{
                    opacity: 1,
                    scale: 1
                  }} 
                  transition={{
                    delay: 0.3 + index * 0.1
                  }} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 ${
                    index === 0 ? "bg-primary/10 text-primary border border-primary/20" :
                    index === 1 ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                    "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  } rounded-full text-sm`}
                >
                  {tag.icon}
                  <span>{tag.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Content section */}
          <AnimatePresence mode="wait">
            {!hasApiKey ? (
              // API Key form
              <motion.div
                key="api-key-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col lg:flex-row gap-8 items-center justify-center max-w-6xl mx-auto"
              >
                {/* Left column: Illustration/Info about Wiggly AI benefits */}
                <motion.div 
                  className="lg:w-1/2 space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-left space-y-4">
                    <h2 className="text-2xl font-bold">Connect your OpenAI API Key</h2>
                    <p className="text-muted-foreground">Unlock the full potential of Wiggly AI with your OpenAI API key to get personalized:</p>
                    
                    <div className="space-y-4 mt-6">
                      {[
                        { 
                          icon: <Bot className="h-5 w-5 text-primary" />,
                          title: "AI Trading Assistant",
                          desc: "Chat with our AI to analyze your trades and get insights"
                        },
                        {
                          icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
                          title: "Pattern Recognition",
                          desc: "Identify your most profitable patterns and setups"
                        },
                        {
                          icon: <BookOpen className="h-5 w-5 text-amber-500" />,
                          title: "Personalized Education",
                          desc: "Get custom learning materials based on your trading history"
                        }
                      ].map((item, i) => (
                        <motion.div 
                          key={item.title}
                          className="flex gap-4 p-4 rounded-xl bg-card/50 border border-primary/10 backdrop-blur-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + (i * 0.2) }}
                          whileHover={{ 
                            scale: 1.02,
                            backgroundColor: "rgba(var(--primary), 0.08)",
                          }}
                        >
                          <div className="h-10 w-10 rounded-full bg-background/80 flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
                
                {/* Right column: API Key form */}
                <div className="lg:w-1/2">
                  <OpenAIKeyForm />
                </div>
              </motion.div>
            ) : !selectedFeature ? (
              // Feature selection
              <motion.div
                key="feature-selection"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <WigglyFeatureSelector 
                  selectedFeature={selectedFeature} 
                  setSelectedFeature={setSelectedFeature}
                />
              </motion.div>
            ) : (
              // Feature content
              <motion.div
                key="feature-content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <WigglyFeatureSelector 
                  selectedFeature={selectedFeature} 
                  setSelectedFeature={setSelectedFeature}
                />
                
                <div className="bg-gradient-to-br from-card/90 via-card/80 to-background/90 border border-primary/10 rounded-2xl overflow-hidden shadow-xl h-[75vh] relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
                  
                  {selectedFeature === "assistant" && (
                    <Suspense fallback={<ChatBotLoading />}>
                      <TradingChatBot />
                    </Suspense>
                  )}
                  
                  {selectedFeature === "education" && (
                    <Suspense fallback={<EducationLoading />}>
                      <div className="p-6 h-full overflow-auto">
                        <Tabs defaultValue="learning" value={activeEducationTab} onValueChange={setActiveEducationTab} className="w-full">
                          <TabsList className="mb-4 grid grid-cols-3 w-full">
                            <TabsTrigger value="learning" className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{isMobile ? "Learn" : "Learning Materials"}</span>
                            </TabsTrigger>
                            <TabsTrigger value="quiz" className="flex items-center gap-1">
                              <FileQuestion className="h-4 w-4" />
                              <span>{isMobile ? "Quiz" : "Quizzes"}</span>
                            </TabsTrigger>
                            <TabsTrigger value="concepts" className="flex items-center gap-1">
                              <Lightbulb className="h-4 w-4" />
                              <span>{isMobile ? "Concepts" : "Market Concepts"}</span>
                            </TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="learning" className="mt-0">
                            <TradingEducationHub />
                          </TabsContent>
                          
                          <TabsContent value="quiz" className="mt-0">
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <h3 className="text-lg font-medium mb-2">Trading Quizzes</h3>
                              <p>Test your knowledge on various trading concepts and strategies.</p>
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="concepts" className="mt-0">
                            <div className="p-4 bg-muted/30 rounded-lg">
                              <h3 className="text-lg font-medium mb-2">Market Concepts</h3>
                              <p>Learn key market concepts and trading strategies to improve your performance.</p>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </Suspense>
                  )}
                  
                  {selectedFeature === "patterns" && (
                    <Suspense fallback={<AnalysisLoading />}>
                      <div className="p-6 h-full overflow-auto">
                        <TradesAnalysis />
                      </div>
                    </Suspense>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default WigglyAIPage;
