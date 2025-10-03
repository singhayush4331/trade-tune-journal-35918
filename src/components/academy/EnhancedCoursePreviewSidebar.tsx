
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { X, Menu, PlayCircle, CheckCircle2, Clock, Award, Sparkles, ChevronDown, ChevronRight, ArrowLeft, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: any[];
}

interface EnhancedCoursePreviewSidebarProps {
  course: any;
  modules: Module[];
  currentModuleIndex: number;
  currentLessonIndex: number;
  completedLessons: Set<string>;
  showSidebar: boolean;
  onSetCurrentLesson: (moduleIndex: number, lessonIndex: number) => void;
  onToggleSidebar: () => void;
}

const EnhancedCoursePreviewSidebar: React.FC<EnhancedCoursePreviewSidebarProps> = ({
  course,
  modules,
  currentModuleIndex,
  currentLessonIndex,
  completedLessons,
  showSidebar,
  onSetCurrentLesson,
  onToggleSidebar
}) => {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([currentModuleIndex])
  );

  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const progressPercentage = (completedLessons.size / totalLessons) * 100;

  const navigateToAcademy = () => {
    navigate('/academy');
  };

  const toggleModuleExpand = (moduleIndex: number) => {
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

  const getLessonIcon = (lesson: any, isCompleted: boolean, isCurrent: boolean) => {
    if (isCompleted) return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (isCurrent) return <PlayCircle className="h-4 w-4 text-primary" />;
    
    switch (lesson.lesson_type) {
      case 'video': return <PlayCircle className="h-4 w-4 text-muted-foreground" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getModuleProgress = (module: Module, moduleIndex: number) => {
    const moduleLessons = module.lessons;
    const completedInModule = moduleLessons.filter(lesson => completedLessons.has(lesson.id)).length;
    return {
      completed: completedInModule,
      total: moduleLessons.length,
      percentage: (completedInModule / moduleLessons.length) * 100
    };
  };

  return (
    <AnimatePresence>
      {showSidebar && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="w-96 bg-gradient-to-b from-background to-muted/20 border-r border-border/50 shadow-2xl h-screen flex flex-col overflow-hidden backdrop-blur-xl"
        >
          {/* Back to Academy Button - At the very top */}
          <div className="flex-shrink-0 p-4 border-b border-border/30 bg-gradient-to-r from-card/90 to-muted/40 backdrop-blur-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={navigateToAcademy}
              className="w-full flex items-center justify-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200 py-3"
            >
              <ArrowLeft className="h-4 w-4" />
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium">Back to Academy</span>
            </Button>
          </div>

          {/* Enhanced Header */}
          <div className="flex-shrink-0 p-6 border-b border-border/50 bg-gradient-to-r from-card/80 to-muted/30 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground truncate">
                      {course?.title}
                    </h2>
                    <p className="text-xs text-muted-foreground">Course Preview</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="lg:hidden h-8 w-8 p-0 hover:bg-muted/50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Enhanced Progress Overview */}
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Overall Progress</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {completedLessons.size}/{totalLessons}
                  </Badge>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="mb-2 h-2 bg-muted/30" 
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {Math.round(progressPercentage)}% complete
                  </p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Sparkles className="h-3 w-3" />
                    <span>{completedLessons.size} lessons done</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Course Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full w-full">
              <div className="space-y-2 p-4 pb-24">
                {modules.map((module, moduleIndex) => {
                  const moduleProgress = getModuleProgress(module, moduleIndex);
                  const isExpanded = expandedModules.has(moduleIndex);
                  const isCurrentModule = moduleIndex === currentModuleIndex;
                  
                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: moduleIndex * 0.1 }}
                    >
                      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                        isCurrentModule 
                          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30 shadow-md' 
                          : 'bg-card/50 hover:bg-card/80 border-border/50'
                      }`}>
                        <CardContent className="p-0">
                          {/* Module Header */}
                          <button
                            onClick={() => toggleModuleExpand(moduleIndex)}
                            className="w-full p-4 text-left hover:bg-muted/10 transition-colors duration-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                  isCurrentModule 
                                    ? 'bg-gradient-to-br from-primary to-primary/80 text-white' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  <span className="text-xs font-bold">{moduleIndex + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-sm truncate">{module.title}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      <span>{module.lessons.length} lessons</span>
                                    </div>
                                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                                      {moduleProgress.completed}/{moduleProgress.total}
                                    </Badge>
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
                            
                            {/* Module Progress Bar */}
                            <div className="mt-3">
                              <Progress 
                                value={moduleProgress.percentage} 
                                className="h-1.5 bg-muted/30" 
                              />
                            </div>
                          </button>

                          {/* Module Lessons */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="border-t border-border/30"
                              >
                                <div className="p-2 space-y-1">
                                  {module.lessons.map((lesson, lessonIndex) => {
                                    const isCurrentLesson = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                                    const isCompleted = completedLessons.has(lesson.id);
                                    
                                    return (
                                      <motion.button
                                        key={lesson.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: lessonIndex * 0.05 }}
                                        onClick={() => onSetCurrentLesson(moduleIndex, lessonIndex)}
                                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 group ${
                                          isCurrentLesson
                                            ? 'bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 shadow-sm'
                                            : 'hover:bg-muted/30 hover:shadow-sm'
                                        }`}
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0">
                                            {getLessonIcon(lesson, isCompleted, isCurrentLesson)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${
                                              isCurrentLesson ? 'text-primary' : 'text-foreground'
                                            }`}>
                                              {lesson.title}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{lesson.duration}m</span>
                                              </div>
                                              {isCompleted && (
                                                <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                                                  Done
                                                </Badge>
                                              )}
                                              {isCurrentLesson && !isCompleted && (
                                                <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-primary/10 text-primary">
                                                  Current
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </motion.button>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedCoursePreviewSidebar;
