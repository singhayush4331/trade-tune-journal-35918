
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Video,
  FileText,
  HelpCircle,
  BookOpen,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MobileOptimizedLessonContentProps {
  currentLesson: any;
  currentModuleIndex: number;
  currentLessonIndex: number;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  children: React.ReactNode;
}

const MobileOptimizedLessonContent: React.FC<MobileOptimizedLessonContentProps> = ({
  currentLesson,
  currentModuleIndex,
  currentLessonIndex,
  isCompleted,
  onMarkComplete,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  children
}) => {
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'reading': return <FileText className="h-5 w-5" />;
      case 'quiz': return <HelpCircle className="h-5 w-5" />;
      case 'assignment': return <BookOpen className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Desktop Lesson Header */}
      <div className="hidden md:block border-b bg-background p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              {getLessonTypeIcon(currentLesson.lesson_type)}
            </div>
            <div>
              <h1 className="text-xl font-bold">{currentLesson.title}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Module {currentModuleIndex + 1}, Lesson {currentLessonIndex + 1}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{currentLesson.duration} min</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrevious}
              disabled={!canGoPrevious}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!canGoNext}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>

            {/* Toggle Completion Button */}
            <Button
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              onClick={onMarkComplete}
              className={isCompleted 
                ? "border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20" 
                : "bg-gradient-to-r from-green-500 to-emerald-500"
              }
            >
              {isCompleted ? (
                <>
                  <X className="h-4 w-4 mr-1" />
                  Mark Incomplete
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Complete
                </>
              )}
            </Button>

            {isCompleted && (
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Lesson Header - Updated with better spacing */}
      <div className="md:hidden mt-20 pt-4 p-4 border-b bg-background">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
            {getLessonTypeIcon(currentLesson.lesson_type)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold leading-tight">{currentLesson.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                Module {currentModuleIndex + 1}, Lesson {currentLessonIndex + 1}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{currentLesson.duration}m</span>
              </div>
            </div>
            {isCompleted && (
              <Badge className="mt-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Lesson Content - Scrollable with proper bottom spacing for mobile navigation */}
      <div className="flex-1 overflow-y-auto pb-6 md:pb-6" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 320px)' }}>
        <div className="p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            {/* Lesson Description */}
            <Card className="mb-6">
              <CardContent className="p-4 md:p-6">
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                  {currentLesson.description}
                </p>
              </CardContent>
            </Card>

            {/* Dynamic Lesson Content */}
            {children}

            {/* Additional bottom spacing to ensure content is always visible */}
            <div className="h-8 md:h-0"></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedLessonContent;
