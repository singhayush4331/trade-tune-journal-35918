
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, FileQuestion, ArrowRight, Award, Brain, CheckCheck } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample quiz data
const SAMPLE_QUIZZES = [
  {
    title: "Candlestick Patterns",
    description: "Test your knowledge of Japanese candlestick patterns and their signals",
    questions: 10,
    difficulty: "Intermediate",
    category: "Technical Analysis",
    completed: true,
    score: 8
  },
  {
    title: "Support & Resistance",
    description: "Understand the concepts of support and resistance levels",
    questions: 8,
    difficulty: "Beginner",
    category: "Technical Analysis",
    completed: false
  },
  {
    title: "Risk Management",
    description: "Best practices for managing risk in your trading",
    questions: 12,
    difficulty: "Advanced",
    category: "Trading Psychology",
    completed: false
  },
  {
    title: "Options Basics",
    description: "Fundamentals of options trading and strategies",
    questions: 15,
    difficulty: "Intermediate",
    category: "Derivatives",
    completed: true,
    score: 13
  }
];

const QuizSection: React.FC = () => {
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const isMobile = useIsMobile();
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "Intermediate": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Advanced": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
      default: return "text-primary bg-primary/10 border-primary/20";
    }
  };
  
  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            Trading Quizzes
          </h2>
          <p className="text-sm text-muted-foreground">
            Test your knowledge and track your progress
          </p>
        </div>
        <Button 
          size="sm"
          variant="outline"
          className="bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
        >
          <Brain className="h-4 w-4 mr-2" />
          Generate Quiz
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SAMPLE_QUIZZES.map((quiz, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card 
              className={`overflow-hidden border ${
                quiz.completed ? "border-primary/10" : "border-muted/40"
              } bg-gradient-to-br from-card/90 via-card to-card/80 hover:shadow-md transition-all duration-200 shadow-sm backdrop-blur-sm group`}
            >
              <CardHeader className="pb-3 border-b border-primary/5">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium flex items-center gap-1">
                      {quiz.title}
                      {quiz.completed && (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      )}
                    </CardTitle>
                    <CardDescription className="text-xs line-clamp-2">
                      {quiz.description}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${getDifficultyColor(quiz.difficulty)} text-xs px-2`}
                  >
                    {quiz.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="py-3 px-4">
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                    <FileQuestion className="h-3.5 w-3.5" />
                    {quiz.questions} Questions
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {quiz.category}
                  </span>
                </div>
                
                {quiz.completed && (
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="flex-1">
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-2 bg-primary rounded-full" 
                          style={{ width: `${(quiz.score / quiz.questions) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">
                      {quiz.score}/{quiz.questions}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="py-2 px-4 bg-muted/10 border-t border-primary/5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto text-xs h-7 px-2 hover:bg-primary/10 hover:text-primary flex items-center gap-1"
                >
                  {quiz.completed ? "Review" : "Start Quiz"}
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Quiz Progress Section */}
      <Card className="border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background shadow-sm backdrop-blur-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-primary/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Your Quiz Progress
            </CardTitle>
            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
              2/4 Completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-green-500/10 text-green-500 border border-green-500/20">
                <CheckCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Beginner Level</h4>
                  <span className="text-xs text-muted-foreground">1/1</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full mt-1 overflow-hidden">
                  <div className="h-2 bg-green-500 rounded-full w-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <CheckCheck className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Intermediate Level</h4>
                  <span className="text-xs text-muted-foreground">1/2</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full mt-1 overflow-hidden">
                  <div className="h-2 bg-blue-500 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-purple-500/10 text-purple-500 border border-purple-500/20">
                <CheckCheck className="h-5 w-5 opacity-20" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Advanced Level</h4>
                  <span className="text-xs text-muted-foreground">0/1</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full mt-1 overflow-hidden">
                  <div className="h-2 bg-purple-500 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizSection;
