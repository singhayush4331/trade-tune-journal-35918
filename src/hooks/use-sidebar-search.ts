
import { useState, useMemo } from 'react';

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

export const useSidebarSearch = (modules: Module[]) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return modules;

    return modules.map(module => {
      const filteredLessons = module.lessons.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const moduleMatches = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchQuery.toLowerCase());

      if (moduleMatches || filteredLessons.length > 0) {
        return {
          ...module,
          lessons: moduleMatches ? module.lessons : filteredLessons
        };
      }
      return null;
    }).filter(Boolean) as Module[];
  }, [modules, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredModules
  };
};
