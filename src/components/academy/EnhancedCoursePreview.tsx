import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Clock, 
  CheckCircle, 
  BookOpen, 
  Video, 
  FileText, 
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  User,
  Trophy,
  Target,
  ArrowLeft,
  NotebookPen,
  Keyboard,
  PanelLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCourseProgress } from '@/hooks/use-course-progress';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import StudentVideoRenderer from './StudentVideoRenderer';
import StudentQuizRenderer from './StudentQuizRenderer';
import StudentAssignmentRenderer from './StudentAssignmentRenderer';
import StudentReadingRenderer from './StudentReadingRenderer';
import MobileOptimizedSidebar from './MobileOptimizedSidebar';
import MobileOptimizedNavigation from './MobileOptimizedNavigation';
import MobileOptimizedLessonContent from './MobileOptimizedLessonContent';
import NoteTakingPanel from './NoteTakingPanel';
import { toast } from 'sonner';

interface Lesson {
  id: string;
  title: string;
  description: string;
  lesson_type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: number;
  video_url?: string;
  content?: string;
  content_data?: any;
  order_index?: number;
  is_free?: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface EnhancedCoursePreviewProps {
  course: any;
  modules: Module[];
}

const EnhancedCoursePreview: React.FC<EnhancedCoursePreviewProps> = ({ course, modules }) => {
  const navigate = useNavigate();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const isMobile = useIsMobile();

  // Automatically hide sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setShowSidebar(false);
    }
  }, [isMobile]);

  // Memoize normalized modules to prevent unnecessary recalculations
  const normalizedModules = useMemo(() => {
    console.log('Normalizing modules:', modules.length);
    return modules.map(module => ({
      ...module,
      lessons: module.lessons.map((lesson, index) => ({
        ...lesson,
        order_index: lesson.order_index ?? index,
        is_free: lesson.is_free ?? true
      }))
    }));
  }, [modules]);

  // Get all lessons for progress tracking - memoized to prevent recalculations
  const allLessons = useMemo(() => {
    const lessons = normalizedModules.flatMap(module => module.lessons);
    console.log('All lessons calculated:', lessons.length);
    return lessons;
  }, [normalizedModules]);
  
  // Use the robust progress tracking hook with proper dependencies
  const {
    progress,
    loading: progressLoading,
    markLessonProgress,
    toggleLessonCompletion,
    getLessonProgress,
    isLessonCompleted,
    refreshProgress
  } = useCourseProgress(course?.id, allLessons);

  const currentModule = normalizedModules[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  // Memoize the lesson selection function to prevent unnecessary re-renders
  const setCurrentLesson = useCallback((moduleIndex: number, lessonIndex: number) => {
    console.log('Setting current lesson:', { moduleIndex, lessonIndex });
    setCurrentModuleIndex(moduleIndex);
    setCurrentLessonIndex(lessonIndex);
  }, []);

  // Initialize first lesson only once and with proper dependencies
  useEffect(() => {
    if (normalizedModules.length > 0 && currentModuleIndex === 0 && currentLessonIndex === 0) {
      const firstModuleWithLessons = normalizedModules.find(module => module.lessons && module.lessons.length > 0);
      if (firstModuleWithLessons) {
        const moduleIndex = normalizedModules.indexOf(firstModuleWithLessons);
        console.log('Auto-selecting first lesson:', { moduleIndex });
        setCurrentModuleIndex(moduleIndex);
        setCurrentLessonIndex(0);
      }
    }
  }, [normalizedModules.length]); // Only depend on length to avoid infinite loops

  const navigateToNextLesson = useCallback(() => {
    if (!currentModule) return;
    
    console.log('Navigating to next lesson');
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < normalizedModules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  }, [currentModule, currentLessonIndex, currentModuleIndex, normalizedModules.length]);

  const navigateToPreviousLesson = useCallback(() => {
    console.log('Navigating to previous lesson');
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      const prevModule = normalizedModules[currentModuleIndex - 1];
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  }, [currentLessonIndex, currentModuleIndex, normalizedModules]);

  const handleLessonComplete = useCallback(async () => {
    if (currentLesson) {
      console.log('Marking lesson complete:', currentLesson.id);
      await markLessonProgress(currentLesson.id, 100, currentLesson.duration || 0);
      toast.success('Lesson completed! Great job! 🎉');
      
      // Auto-progress to next lesson after a short delay
      setTimeout(() => {
        navigateToNextLesson();
      }, 1500);
    }
  }, [currentLesson, markLessonProgress, navigateToNextLesson]);

  const handleToggleCompletion = useCallback(async () => {
    if (currentLesson) {
      const wasCompleted = isLessonCompleted(currentLesson.id);
      console.log('Toggling lesson completion:', currentLesson.id, 'wasCompleted:', wasCompleted);
      
      await toggleLessonCompletion(currentLesson.id, currentLesson.duration || 0);
      
      if (wasCompleted) {
        toast.info('Lesson marked as incomplete');
      } else {
        toast.success('Lesson completed! Great job! 🎉');
        // Auto-progress to next lesson after a short delay if marking as complete
        setTimeout(() => {
          navigateToNextLesson();
        }, 1500);
      }
    }
  }, [currentLesson, isLessonCompleted, toggleLessonCompletion, navigateToNextLesson]);

  const handleProgressUpdate = useCallback(async (completionPercentage: number, watchTime: number) => {
    if (currentLesson) {
      await markLessonProgress(currentLesson.id, completionPercentage, watchTime);
    }
  }, [currentLesson, markLessonProgress]);

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      default: return null;
    }
  };

  const renderLessonContent = () => {
    if (!currentLesson) return null;

    const commonProps = {
      lesson: currentLesson,
      onComplete: handleLessonComplete,
      onNext: navigateToNextLesson,
      onProgressUpdate: handleProgressUpdate,
    };

    switch (currentLesson.lesson_type) {
      case 'video':
        return <StudentVideoRenderer {...commonProps} />;
      case 'reading':
        return <StudentReadingRenderer {...commonProps} />;
      case 'quiz':
        return <StudentQuizRenderer {...commonProps} />;
      case 'assignment':
        return <StudentAssignmentRenderer {...commonProps} />;
      default:
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Content type not supported</p>
            </CardContent>
          </Card>
        );
    }
  };

  // Memoize completed lessons set to prevent recalculations
  const completedLessons = useMemo(() => {
    const completed = new Set(
      Object.keys(progress.lessonProgress).filter(lessonId => 
        isLessonCompleted(lessonId)
      )
    );
    console.log('Completed lessons calculated:', completed.size);
    return completed;
  }, [progress.lessonProgress, isLessonCompleted]);

  // Keyboard navigation
  useKeyboardNavigation({
    onPrevious: navigateToPreviousLesson,
    onNext: navigateToNextLesson,
    onToggleSidebar: () => setShowSidebar(!showSidebar),
    onMarkComplete: handleToggleCompletion, // Use toggle instead of just complete
    disabled: showNotes || showKeyboardShortcuts
  });

  // Show keyboard shortcuts helper on first visit
  useEffect(() => {
    const hasSeenShortcuts = localStorage.getItem('keyboard-shortcuts-seen');
    if (!hasSeenShortcuts && !isMobile) {
      setTimeout(() => {
        setShowKeyboardShortcuts(true);
        localStorage.setItem('keyboard-shortcuts-seen', 'true');
      }, 3000);
    }
  }, [isMobile]);

  if (!currentModule || !currentLesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Card className="glass-card border-0 shadow-2xl bg-gradient-to-br from-card to-card/50">
            <CardContent className="py-16 px-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">No Content Available</h3>
              <p className="text-muted-foreground text-lg">This course doesn't have any modules or lessons yet.</p>
              <Button onClick={() => navigate('/academy')} className="mt-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Academy
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-green-500/5">
      {/* Enhanced Desktop Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block border-b bg-gradient-to-r from-card/95 via-card to-card/95 backdrop-blur-xl sticky top-0 z-40 shadow-lg border-border/40"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Sidebar trigger when closed */}
              {!showSidebar && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSidebar(true)}
                    className="hover:bg-green-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-200"
                    title="Open Sidebar"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              
              {/* Back to Academy Button */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/academy')}
                className="hover:bg-green-500/10 transition-all duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Academy</span>
              </Button>
              
              {/* Course Info Section */}
              <div className="flex items-center gap-4">
                {/* Course Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg ring-2 ring-green-500/20">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                
                {/* Course Details */}
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {course.title}
                  </h1>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <Clock className="h-3 w-3 text-white" />
                      </div>
                      <span className="font-medium">{course.duration} minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Keyboard Shortcuts Button */}
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKeyboardShortcuts(true)}
                  className="hover:bg-green-500/10 transition-all duration-200"
                  title="Keyboard Shortcuts"
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              )}
              
              {/* Progress Section */}
              <div className="flex items-center gap-4">
                <div className="text-right space-y-1">
                  <div className="text-sm font-semibold text-foreground">
                    {progress.overallProgress.toFixed(0)}% Complete
                  </div>
                  <Progress 
                    value={progress.overallProgress} 
                    className="w-40 h-2 bg-muted"
                    indicatorClassName="bg-gradient-to-r from-green-500 to-emerald-500"
                  />
                </div>
                
                {/* Achievement Badge */}
                <Badge 
                  variant="secondary" 
                  className="bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20 border-green-500/30 text-green-700 dark:text-green-400 px-3 py-1 shadow-sm"
                >
                  <Trophy className="h-3 w-3 mr-1.5 text-green-600" />
                  <span className="font-semibold">{progress.completedLessons}</span>
                  <span className="text-muted-foreground mx-1">/</span>
                  <span className="font-semibold">{progress.totalLessons}</span>
                  <span className="ml-1 text-xs">Completed</span>
                </Badge>
              </div>
            </div>
          </div>
          
          {/* Optional: Add a subtle animated background pattern */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-teal-500/5 to-green-500/5 rounded-full blur-3xl"></div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Navigation */}
      <MobileOptimizedNavigation
        onPrevious={navigateToPreviousLesson}
        onNext={navigateToNextLesson}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onToggleNotes={() => setShowNotes(!showNotes)}
        onMarkComplete={handleToggleCompletion}
        onBackToAcademy={() => navigate('/academy')}
        canGoPrevious={currentModuleIndex > 0 || currentLessonIndex > 0}
        canGoNext={
          currentModuleIndex < normalizedModules.length - 1 || 
          currentLessonIndex < currentModule.lessons.length - 1
        }
        isCompleted={isLessonCompleted(currentLesson.id)}
        currentLesson={currentLesson.title}
        progress={`${progress.completedLessons}/${progress.totalLessons}`}
        courseTitle={course.title}
      />

      <div className="h-full flex bg-background relative">
        {/* Mobile and Desktop Sidebar */}
        <MobileOptimizedSidebar
          course={course}
          modules={normalizedModules}
          currentModuleIndex={currentModuleIndex}
          currentLessonIndex={currentLessonIndex}
          completedLessons={completedLessons}
          showSidebar={showSidebar}
          onSetCurrentLesson={setCurrentLesson}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          progressData={progress}
          isLessonCompleted={isLessonCompleted}
        />

        {/* Main Content Area */}
        <MobileOptimizedLessonContent
          currentLesson={currentLesson}
          currentModuleIndex={currentModuleIndex}
          currentLessonIndex={currentLessonIndex}
          isCompleted={isLessonCompleted(currentLesson.id)}
          onMarkComplete={handleToggleCompletion}
          onPrevious={navigateToPreviousLesson}
          onNext={navigateToNextLesson}
          canGoPrevious={currentModuleIndex > 0 || currentLessonIndex > 0}
          canGoNext={
            currentModuleIndex < normalizedModules.length - 1 || 
            currentLessonIndex < currentModule.lessons.length - 1
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentModuleIndex}-${currentLessonIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderLessonContent()}
            </motion.div>
          </AnimatePresence>
        </MobileOptimizedLessonContent>
      </div>

      {/* Note Taking Panel */}
      <NoteTakingPanel
        currentLessonId={currentLesson.id}
        currentLessonTitle={currentLesson.title}
        isVisible={showNotes}
        onToggle={() => setShowNotes(!showNotes)}
      />

      {/* Keyboard Shortcuts Modal - Desktop Only */}
      <AnimatePresence>
        {showKeyboardShortcuts && !isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-6 max-w-md w-full border shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Shortcuts
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowKeyboardShortcuts(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Previous lesson</span>
                  <Badge variant="outline">←</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Next lesson</span>
                  <Badge variant="outline">→</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Toggle completion</span>
                  <Badge variant="outline">Space</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Toggle sidebar</span>
                  <Badge variant="outline">Ctrl+B</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Close panels</span>
                  <Badge variant="outline">Esc</Badge>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                Press any key to dismiss this dialog
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedCoursePreview;
