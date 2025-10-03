import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, FileQuestion, Lightbulb, ArrowLeft, ChevronRight, Search, BookCheck, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import LearningMaterialsSection from './LearningMaterialsSection';
import QuizSection from './QuizSection';
import MarketConceptsSection from './MarketConceptsSection';
import { LearningSectionProps } from '@/services/education-service';
import { useIsMobile } from '@/hooks/use-mobile';
const TradingEducationHub: React.FC<LearningSectionProps> = ({
  onBack
}) => {
  const [activeTab, setActiveTab] = useState('learning');
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    setMounted(true);
  }, []);
  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };
  if (!mounted) return null;
  return <div className="flex flex-col h-full my-0 py-[26px]">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {onBack && <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5 hover:text-primary" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-md shadow-primary/10">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Trading Education
                </h1>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5 ml-11">
                Personalized learning materials & assessments
              </p>
            </div>
          </div>
        </div>
        <div>
          <Button variant="outline" size="sm" className="border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Find Topics</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        {/* Enhanced Tab Bar */}
        <div className="px-1">
          <Card className="border-primary/10 overflow-hidden p-1 mb-6">
            <TabsList className="w-full grid grid-cols-3 bg-background/50">
              <TabsTrigger value="learning" className="flex items-center gap-2 py-2.5 px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <BookCheck className="h-4 w-4" />
                <span>{isMobile ? "Learn" : "Learning Materials"}</span>
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2 py-2.5 px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <FileQuestion className="h-4 w-4" />
                <span>{isMobile ? "Quiz" : "Quizzes"}</span>
              </TabsTrigger>
              <TabsTrigger value="concepts" className="flex items-center gap-2 py-2.5 px-3 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Lightbulb className="h-4 w-4" />
                <span>{isMobile ? "Concepts" : "Market Concepts"}</span>
              </TabsTrigger>
            </TabsList>
          </Card>
        </div>

        <div className="flex-1 overflow-hidden px-1">
          <motion.div key={activeTab} initial="hidden" animate="visible" exit="exit" variants={tabVariants} className="h-full overflow-y-auto">
            <TabsContent value="learning" className="h-full overflow-y-auto mt-0">
              <LearningMaterialsSection />
            </TabsContent>

            <TabsContent value="quiz" className="h-full overflow-y-auto mt-0">
              <QuizSection />
            </TabsContent>
            
            <TabsContent value="concepts" className="h-full overflow-y-auto mt-0">
              <MarketConceptsSection />
            </TabsContent>
          </motion.div>
        </div>
      </Tabs>
    </div>;
};
export default TradingEducationHub;