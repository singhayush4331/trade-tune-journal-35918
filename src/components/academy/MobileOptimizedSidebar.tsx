
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Award, 
  Target,
  BookOpen,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ModernLessonItem from './ModernLessonItem';
import ProgressAnalytics from './ProgressAnalytics';
import { useSidebarSearch } from '@/hooks/use-sidebar-search';
import { CourseProgress } from '@/hooks/use-course-progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface Lesson {
  id: string;
  title: string;
  description: string;
  lesson_type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: number;
  order_index: number;
  is_free: boolean;
  video_url?: string;
  content?: string;
  content_data?: any;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface MobileOptimizedSidebarProps {
  course: any;
  modules: Module[];
  currentModuleIndex: number;
  currentLessonIndex: number;
  completedLessons: Set<string>;
  showSidebar: boolean;
  onSetCurrentLesson: (moduleIndex: number, lessonIndex: number) => void;
  onToggleSidebar: () => void;
  progressData?: CourseProgress;
  isLessonCompleted?: (lessonId: string) => boolean;
}

const MobileOptimizedSidebar: React.FC<MobileOptimizedSidebarProps> = ({
  course,
  modules,
  currentModuleIndex,
  currentLessonIndex,
  completedLessons,
  showSidebar,
  onSetCurrentLesson,
  onToggleSidebar,
  progressData,
  isLessonCompleted
}) => {
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([currentModuleIndex])
  );
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { searchQuery, setSearchQuery, filteredModules } = useSidebarSearch(modules);
  const isMobile = useIsMobile();

  // Debug lesson types for mobile sidebar too
  React.useEffect(() => {
    console.log('Mobile Sidebar - Debug lesson types:');
    modules.forEach((module, moduleIndex) => {
      console.log(`Module ${moduleIndex + 1} (${module.title}):`);
      module.lessons.forEach((lesson, lessonIndex) => {
        console.log(`  Lesson ${lessonIndex + 1}: ${lesson.title} - Type: ${lesson.lesson_type || 'undefined'}`);
      });
    });
  }, [modules]);

  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const totalDuration = modules.reduce((total, module) => 
    total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + (lesson.duration || 0), 0), 0
  );

  const estimatedTimeRemaining = totalDuration - (completedLessons.size * (totalDuration / totalLessons));
  const averageTimePerLesson = totalDuration / totalLessons;
  const completionStreak = 3;

  const toggleModuleExpanded = (moduleIndex: number) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleIndex)) {
        newSet.delete(moduleIndex);
      } else {
        newSet.add(moduleIndex);
      }
      return newSet;
    });
  };

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    console.log('Mobile sidebar lesson clicked:', { moduleIndex, lessonIndex });
    onSetCurrentLesson(moduleIndex, lessonIndex);
    // Auto-close sidebar on mobile after lesson selection
    if (isMobile) {
      onToggleSidebar();
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getModuleProgress = (module: Module) => {
    const moduleLessons = module.lessons;
    const completedInModule = moduleLessons.filter(lesson => completedLessons.has(lesson.id)).length;
    return {
      completed: completedInModule,
      total: moduleLessons.length,
      percentage: (completedInModule / moduleLessons.length) * 100
    };
  };

  if (!showSidebar) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onToggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -300 }}
        className={`${
          isMobile 
            ? 'fixed left-0 top-0 bottom-0 w-80 z-50' 
            : 'w-80 relative'
        } bg-card border-r flex-shrink-0 h-full overflow-hidden flex flex-col shadow-lg`}
      >
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-green-500/5 to-emerald-500/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-lg">Course Content</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="h-8 w-8 p-0"
                title="Toggle Analytics"
              >
                <Award className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search lessons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9"
            />
          </div>

          {/* Course Progress Overview */}
          {progressData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progressData.overallProgress.toFixed(0)}%</span>
              </div>
              <Progress value={progressData.overallProgress} className="h-2" />
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span>{progressData.completedLessons} Completed</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span>{formatDuration(totalDuration)} Total</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Analytics Panel */}
        <AnimatePresence>
          {showAnalytics && progressData && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b bg-muted/20"
            >
              <div className="p-4">
                <ProgressAnalytics
                  progress={progressData}
                  estimatedTimeRemaining={estimatedTimeRemaining}
                  averageTimePerLesson={averageTimePerLesson}
                  completionStreak={completionStreak}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Module and Lesson List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3">
              {filteredModules.length === 0 && searchQuery ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No lessons found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              ) : (
                filteredModules.map((module, moduleIndex) => {
                  const originalModuleIndex = modules.findIndex(m => m.id === module.id);
                  const moduleProgress = getModuleProgress(module);
                  const isExpanded = expandedModules.has(originalModuleIndex) || searchQuery.trim() !== '';
                  
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.1 }}
                    >
                      <Collapsible open={isExpanded} onOpenChange={() => toggleModuleExpanded(originalModuleIndex)}>
                        <Card className="overflow-hidden">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full p-0 h-auto">
                              <CardContent className="p-4 w-full">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                      {originalModuleIndex + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                      <h4 className="font-semibold text-sm truncate">{module.title}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {moduleProgress.completed}/{moduleProgress.total}
                                        </Badge>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3" />
                                          {module.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0)}m
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <motion.div
                                    animate={{ rotate: isExpanded ? 90 : 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  </motion.div>
                                </div>
                                
                                <div className="mt-3">
                                  <Progress value={moduleProgress.percentage} className="h-1.5" />
                                </div>
                              </CardContent>
                            </Button>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="border-t bg-muted/20">
                              {module.lessons.map((lesson, lessonIndex) => {
                                const isCurrentLesson = originalModuleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                                const isCompleted = isLessonCompleted ? isLessonCompleted(lesson.id) : completedLessons.has(lesson.id);
                                
                                // Ensure lesson has a valid lesson_type, default to 'video' if missing
                                const normalizedLesson = {
                                  ...lesson,
                                  lesson_type: lesson.lesson_type || 'video'
                                };
                                
                                console.log(`Mobile - Rendering lesson: ${lesson.title}, Type: ${normalizedLesson.lesson_type}`);
                                
                                return (
                                  <ModernLessonItem
                                    key={lesson.id}
                                    lesson={normalizedLesson}
                                    lessonIndex={lessonIndex}
                                    isCurrentLesson={isCurrentLesson}
                                    isCompleted={isCompleted}
                                    onClick={() => handleLessonClick(originalModuleIndex, lessonIndex)}
                                  />
                                );
                              })}
                            </div>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    </motion.div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Course Stats Footer */}
        <div className="p-4 border-t bg-gradient-to-r from-muted/50 to-muted/30">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{modules.length}</div>
              <div className="text-xs text-muted-foreground">Modules</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{totalLessons}</div>
              <div className="text-xs text-muted-foreground">Lessons</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{formatDuration(totalDuration)}</div>
              <div className="text-xs text-muted-foreground">Duration</div>
            </div>
          </div>
          
          {progressData && progressData.overallProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30"
            >
              <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">Course Completed!</span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default MobileOptimizedSidebar;
