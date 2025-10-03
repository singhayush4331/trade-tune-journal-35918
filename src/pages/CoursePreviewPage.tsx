
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import EnhancedCoursePreview from '@/components/academy/EnhancedCoursePreview';
import { getCourseDetails, getCourseModules, getModuleLessons } from '@/services/academy-service';

const CoursePreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    if (!id) {
      setError('No course ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Load course details
      const courseDetails = await getCourseDetails(id);
      if (!courseDetails) {
        setError('Course not found');
        setLoading(false);
        return;
      }

      setCourse(courseDetails);

      // Load modules
      const courseModules = await getCourseModules(id);
      
      // Load lessons for each module
      const modulesWithLessons = await Promise.all(
        courseModules.map(async (module) => {
          const lessons = await getModuleLessons(module.id);
          return {
            ...module,
            lessons: lessons
          };
        })
      );

      setModules(modulesWithLessons);
    } catch (err) {
      console.error('Error loading course data:', err);
      setError('Failed to load course content');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="glass-card border-0 shadow-2xl bg-gradient-to-br from-card to-card/50">
            <CardContent className="py-16 px-8 text-center">
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <BookOpen className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Loading Course...
              </h3>
              <p className="text-muted-foreground text-lg">
                Preparing your amazing learning experience
              </p>
              <div className="mt-6 flex items-center justify-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-3 h-3 bg-primary rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 bg-primary rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-3 h-3 bg-primary rounded-full"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="glass-card border-0 shadow-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/10">
            <CardContent className="py-16 px-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <AlertTriangle className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-800 dark:text-red-200">
                {error}
              </h3>
              <p className="text-red-700 dark:text-red-300 text-lg">
                Please check the course URL or try again later.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto"
        >
          <Card className="glass-card border-0 shadow-2xl bg-gradient-to-br from-card to-card/50">
            <CardContent className="py-16 px-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Course Not Found</h3>
              <p className="text-muted-foreground text-lg">
                The requested course could not be found.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <EnhancedCoursePreview course={course} modules={modules} />
    </div>
  );
};

export default CoursePreviewPage;
