
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type LessonRow = Database['public']['Tables']['lessons']['Row'];
type ModuleRow = Database['public']['Tables']['course_modules']['Row'];

export interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
  progress?: number; // Add optional progress property
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  lesson_type: 'video' | 'reading' | 'quiz' | 'assignment';
  duration: number;
  order_index: number;
  video_url: string;
  content: string;
  content_data: any;
  is_free: boolean; // Add the missing is_free property
  completed?: boolean;
}

export const useCourseEditor = (courseId?: string) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const transformLessonFromDB = (lessonRow: LessonRow): Lesson => {
    // Map database lesson_type to component lesson_type
    let lessonType: 'video' | 'reading' | 'quiz' | 'assignment' = 'video';
    if (lessonRow.lesson_type === 'text') {
      lessonType = 'reading';
    } else if (lessonRow.lesson_type && ['video', 'quiz', 'assignment'].includes(lessonRow.lesson_type)) {
      lessonType = lessonRow.lesson_type as 'video' | 'quiz' | 'assignment';
    }

    return {
      id: lessonRow.id,
      module_id: lessonRow.module_id,
      title: lessonRow.title,
      description: lessonRow.description || '',
      lesson_type: lessonType,
      duration: lessonRow.duration || 0,
      order_index: lessonRow.order_index,
      video_url: lessonRow.video_url || '',
      content: lessonRow.content || '',
      content_data: lessonRow.content_data || {},
      is_free: lessonRow.is_free || false,
      completed: false
    };
  };

  const transformModuleFromDB = (moduleRow: ModuleRow, lessons: Lesson[]): Module => {
    return {
      id: moduleRow.id,
      title: moduleRow.title,
      description: moduleRow.description || '',
      order_index: moduleRow.order_index,
      lessons: lessons
    };
  };

  const fetchCourseData = async () => {
    if (!courseId) return;
    
    setLoading(true);
    try {
      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (modulesError) throw modulesError;

      // Fetch lessons for all modules
      const moduleIds = modulesData?.map(m => m.id) || [];
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .in('module_id', moduleIds)
        .order('order_index');

      if (lessonsError) throw lessonsError;

      // Group lessons by module and transform data
      const transformedModules = modulesData?.map(module => {
        const moduleLessons = lessonsData?.filter(lesson => lesson.module_id === module.id) || [];
        const transformedLessons = moduleLessons.map(transformLessonFromDB);
        return transformModuleFromDB(module, transformedLessons);
      }) || [];

      setModules(transformedModules);
    } catch (error) {
      console.error('Error fetching course data:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  };

  const createModule = async (title: string, description?: string) => {
    if (!courseId) return null;
    
    try {
      const { data, error } = await supabase.rpc('create_course_module', {
        p_course_id: courseId,
        p_title: title,
        p_description: description || ''
      });

      if (error) throw error;

      const newModule: Module = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        order_index: data.order_index,
        lessons: []
      };

      setModules(prev => [...prev, newModule]);
      toast.success('Module created successfully');
      return newModule;
    } catch (error) {
      console.error('Error creating module:', error);
      toast.error('Failed to create module');
      return null;
    }
  };

  const updateModule = async (moduleId: string, updates: { title?: string; description?: string }) => {
    try {
      const { error } = await supabase
        .from('course_modules')
        .update(updates)
        .eq('id', moduleId);

      if (error) throw error;

      setModules(prev => prev.map(module => 
        module.id === moduleId ? { ...module, ...updates } : module
      ));

      toast.success('Module updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating module:', error);
      toast.error('Failed to update module');
      return false;
    }
  };

  const deleteModule = async (moduleId: string) => {
    try {
      const { error } = await supabase.rpc('delete_module_cascade', {
        p_module_id: moduleId
      });

      if (error) throw error;

      setModules(prev => prev.filter(module => module.id !== moduleId));
      toast.success('Module deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting module:', error);
      toast.error('Failed to delete module');
      return false;
    }
  };

  const updateLesson = async (lessonId: string, updates: Partial<Lesson>) => {
    try {
      // Transform lesson_type back to database format
      const dbUpdates: Partial<LessonRow> = {
        title: updates.title,
        description: updates.description,
        video_url: updates.video_url,
        content: updates.content,
        duration: updates.duration,
        lesson_type: updates.lesson_type === 'reading' ? 'text' : updates.lesson_type,
        content_data: updates.content_data
      };

      const { error } = await supabase
        .from('lessons')
        .update(dbUpdates)
        .eq('id', lessonId);

      if (error) throw error;

      // Update local state
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, ...updates } : lesson
        )
      })));

      toast.success('Lesson updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson');
      return false;
    }
  };

  const deleteLesson = async (lessonId: string) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId);

      if (error) throw error;

      // Update local state
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons.filter(lesson => lesson.id !== lessonId)
      })));

      toast.success('Lesson deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
      return false;
    }
  };

  const createLesson = async (moduleId: string, lessonData: Partial<Lesson>) => {
    try {
      // Get the next order index
      const module = modules.find(m => m.id === moduleId);
      const nextOrderIndex = (module?.lessons.length || 0);

      // Transform lesson_type to database format
      const dbLessonType = lessonData.lesson_type === 'reading' ? 'text' : lessonData.lesson_type;

      // Ensure required fields have defaults
      const dbInsert = {
        module_id: moduleId,
        title: lessonData.title || 'New Lesson',
        description: lessonData.description || '',
        lesson_type: dbLessonType || 'video',
        duration: lessonData.duration || 0,
        order_index: nextOrderIndex,
        video_url: lessonData.video_url || '',
        content: lessonData.content || '',
        content_data: lessonData.content_data || {}
      };

      const { data, error } = await supabase
        .from('lessons')
        .insert(dbInsert)
        .select()
        .single();

      if (error) throw error;

      const newLesson = transformLessonFromDB(data);

      // Update local state
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      ));

      toast.success('Lesson created successfully');
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error('Failed to create lesson');
      return null;
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  return {
    modules,
    loading,
    selectedLesson,
    setSelectedLesson,
    createModule,
    updateModule,
    deleteModule,
    updateLesson,
    deleteLesson,
    createLesson,
    refetch: fetchCourseData
  };
};
