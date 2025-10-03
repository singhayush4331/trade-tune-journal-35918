
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  X, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target,
  Play,
  Trophy
} from 'lucide-react';
import { motion } from 'framer-motion';
import ModernLessonItem from './ModernLessonItem';
import { CourseProgress } from '@/hooks/use-course-progress';

interface Lesson {
  id: string;
  title: string;
  description: string;
  lesson_type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: number;
  video_url?: string;
  content?: string;
  content_data?: any;
  order_index: number;
  is_free: boolean;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface CoursePreviewSidebarProps {
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

const CoursePreviewSidebar: React.FC<CoursePreviewSidebarProps> = memo(({
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
  if (!showSidebar) return null;

  const totalDuration = modules.reduce((total, module) => 
    total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + (lesson.duration || 0), 0), 0
  );

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleLessonClick = (moduleIndex: number, lessonIndex: number) => {
    console.log('Sidebar lesson clicked:', { moduleIndex, lessonIndex });
    onSetCurrentLesson(moduleIndex, lessonIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-80 bg-card border-r flex-shrink-0 h-full overflow-hidden flex flex-col"
    >
      {/* Sidebar Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Course Content</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleSidebar}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
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
                <CheckCircle className="h-3 w-3 text-green-500" />
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

      {/* Module and Lesson List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {modules.map((module, moduleIndex) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: moduleIndex * 0.1 }}
            className="space-y-2"
          >
            {/* Module Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-purple-600 rounded-full"></div>
              <h4 className="font-semibold text-sm text-foreground">{module.title}</h4>
              {module.description && (
                <Badge variant="outline" className="text-xs">
                  {module.lessons.length} lessons
                </Badge>
              )}
            </div>

            {/* Module Description */}
            {module.description && (
              <p className="text-xs text-muted-foreground mb-3 ml-4 leading-relaxed">
                {module.description}
              </p>
            )}

            {/* Lessons */}
            <div className="space-y-1 ml-4">
              {module.lessons.map((lesson, lessonIndex) => {
                const isCurrentLesson = moduleIndex === currentModuleIndex && lessonIndex === currentLessonIndex;
                const isCompleted = isLessonCompleted ? isLessonCompleted(lesson.id) : completedLessons.has(lesson.id);
                
                return (
                  <ModernLessonItem
                    key={lesson.id}
                    lesson={lesson}
                    lessonIndex={lessonIndex}
                    isCurrentLesson={isCurrentLesson}
                    isCompleted={isCompleted}
                    onClick={() => handleLessonClick(moduleIndex, lessonIndex)}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Course Stats Footer */}
      <div className="p-4 border-t bg-gradient-to-r from-muted/50 to-muted/30">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-primary">{modules.length}</div>
            <div className="text-xs text-muted-foreground">Modules</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">
              {modules.reduce((total, module) => total + module.lessons.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Lessons</div>
          </div>
        </div>
        
        {progressData && progressData.overallProgress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-3 p-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30"
          >
            <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">Course Completed!</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

CoursePreviewSidebar.displayName = 'CoursePreviewSidebar';

export default CoursePreviewSidebar;
