
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';

export interface LessonProgress {
  lesson_id: string;
  completion_percentage: number;
  watch_time: number;
  completed_at: string | null;
}

export interface CourseProgress {
  totalLessons: number;
  completedLessons: number;
  overallProgress: number;
  lessonProgress: Record<string, LessonProgress>;
}

export const useCourseProgress = (courseId: string, allLessons: any[]) => {
  const [progress, setProgress] = useState<CourseProgress>({
    totalLessons: 0,
    completedLessons: 0,
    overallProgress: 0,
    lessonProgress: {}
  });
  const [loading, setLoading] = useState(true);
  const loadingRef = useRef(false);
  const prevLessonsRef = useRef<string>('');

  // Create a stable key to detect when lessons actually change
  const lessonsKey = allLessons.map(l => l.id).sort().join(',');

  const loadProgress = useCallback(async () => {
    if (!courseId || allLessons.length === 0 || loadingRef.current) {
      return;
    }

    try {
      loadingRef.current = true;
      setLoading(true);
      
      console.log('Loading progress for course:', courseId, 'lessons:', allLessons.length);
      
      const user = await getSessionUser();
      if (!user) {
        setProgress({
          totalLessons: allLessons.length,
          completedLessons: 0,
          overallProgress: 0,
          lessonProgress: {}
        });
        return;
      }

      // Get all lesson IDs for this course
      const lessonIds = allLessons.map(lesson => lesson.id);
      
      if (lessonIds.length === 0) {
        setProgress({
          totalLessons: 0,
          completedLessons: 0,
          overallProgress: 0,
          lessonProgress: {}
        });
        return;
      }

      // Get user progress for all lessons in this course
      const { data: progressData, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('lesson_id', lessonIds);

      if (error) {
        console.error('Error fetching progress:', error);
        return;
      }

      // Create progress map
      const lessonProgressMap: Record<string, LessonProgress> = {};
      let completedCount = 0;

      progressData?.forEach(progress => {
        lessonProgressMap[progress.lesson_id] = {
          lesson_id: progress.lesson_id,
          completion_percentage: progress.completion_percentage || 0,
          watch_time: progress.watch_time || 0,
          completed_at: progress.completed_at
        };

        // Consider lesson completed if completion percentage >= 90%
        if (progress.completion_percentage >= 90) {
          completedCount++;
        }
      });

      const totalLessons = allLessons.length;
      const overallProgress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

      setProgress({
        totalLessons,
        completedLessons: completedCount,
        overallProgress,
        lessonProgress: lessonProgressMap
      });

      // Update enrollment progress
      await updateEnrollmentProgress(courseId, overallProgress);

    } catch (error) {
      console.error('Error loading course progress:', error);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [courseId, lessonsKey]); // Use lessonsKey instead of allLessons to prevent unnecessary calls

  useEffect(() => {
    // Only load if the lessons key has actually changed
    if (courseId && lessonsKey && lessonsKey !== prevLessonsRef.current) {
      console.log('Lessons changed, loading progress');
      prevLessonsRef.current = lessonsKey;
      loadProgress();
    }
  }, [loadProgress, courseId, lessonsKey]);

  const updateEnrollmentProgress = async (courseId: string, progressPercentage: number) => {
    try {
      const user = await getSessionUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_enrollments')
        .update({ 
          progress: progressPercentage,
          completion_date: progressPercentage >= 100 ? new Date().toISOString() : null
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error updating enrollment progress:', error);
      }
    } catch (error) {
      console.error('Error updating enrollment progress:', error);
    }
  };

  const markLessonProgress = useCallback(async (lessonId: string, completionPercentage: number, watchTime: number) => {
    try {
      const user = await getSessionUser();
      if (!user) return;

      console.log('Marking lesson progress:', { lessonId, completionPercentage, watchTime });

      // Use upsert to handle existing records
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completion_percentage: completionPercentage,
          watch_time: watchTime,
          completed_at: completionPercentage >= 90 ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) {
        console.error('Error updating lesson progress:', error);
        return;
      }
      
      // Reload progress to get updated data, but with a small delay to prevent spam
      setTimeout(() => {
        loadProgress();
      }, 100);
    } catch (error) {
      console.error('Error marking lesson progress:', error);
    }
  }, [loadProgress]);

  const getLessonProgress = useCallback((lessonId: string): LessonProgress | null => {
    return progress.lessonProgress[lessonId] || null;
  }, [progress.lessonProgress]);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    const lessonProg = getLessonProgress(lessonId);
    return lessonProg ? lessonProg.completion_percentage >= 90 : false;
  }, [getLessonProgress]);

  const toggleLessonCompletion = useCallback(async (lessonId: string, lessonDuration: number = 0) => {
    try {
      const user = await getSessionUser();
      if (!user) return;

      const currentProgress = getLessonProgress(lessonId);
      const isCurrentlyCompleted = isLessonCompleted(lessonId);
      
      console.log('Toggling lesson completion:', { lessonId, isCurrentlyCompleted });

      // If currently completed, mark as incomplete (0%), otherwise mark as complete (100%)
      const newCompletionPercentage = isCurrentlyCompleted ? 0 : 100;
      const watchTime = currentProgress?.watch_time || lessonDuration;

      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completion_percentage: newCompletionPercentage,
          watch_time: watchTime,
          completed_at: newCompletionPercentage >= 90 ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) {
        console.error('Error toggling lesson completion:', error);
        return;
      }
      
      // Reload progress to get updated data
      setTimeout(() => {
        loadProgress();
      }, 100);
    } catch (error) {
      console.error('Error toggling lesson completion:', error);
    }
  }, [loadProgress, getLessonProgress, isLessonCompleted]);

  return {
    progress,
    loading,
    markLessonProgress,
    toggleLessonCompletion,
    getLessonProgress,
    isLessonCompleted,
    refreshProgress: loadProgress
  };
};
