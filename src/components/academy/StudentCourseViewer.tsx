import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, BookOpen, ArrowLeft, Crown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentUserRoles } from '@/utils/roles-cache';
import EnhancedCoursePreview from './EnhancedCoursePreview';
const StudentCourseViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);

// Fetch user roles (cached)
useEffect(() => {
  let mounted = true;
  (async () => {
    if (!user) return;
    try {
      const { roles } = await getCurrentUserRoles();
      if (mounted) {
        console.log('StudentCourseViewer: User roles (cached):', roles);
        setUserRoles(roles);
      }
    } catch (error) {
      console.error('Error getting cached user roles:', error);
    }
  })();
  return () => { mounted = false };
}, [user]);

  // Fetch course and modules data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id || !user) return;

      try {
        setLoading(true);
        console.log('StudentCourseViewer: Fetching course data for:', id);

        // Fetch course details
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', id)
          .single();

        if (courseError) {
          console.error('StudentCourseViewer: Error fetching course:', courseError);
          setError('Course not found');
          return;
        }

        console.log('StudentCourseViewer: Course data:', courseData);
        setCourse(courseData);

        // Fetch modules with lessons
        const { data: modulesData, error: modulesError } = await supabase
          .from('course_modules')
          .select(`
            *,
            lessons!lessons_module_id_fkey (
              id,
              title,
              description,
              lesson_type,
              duration,
              video_url,
              content,
              content_data,
              order_index,
              is_free
            )
          `)
          .eq('course_id', id)
          .order('order_index');

        if (modulesError) {
          console.error('StudentCourseViewer: Error fetching modules:', modulesError);
          setError('Error loading course content');
          return;
        }

        // Sort lessons within each module by order_index
        const sortedModules = modulesData?.map(module => ({
          ...module,
          lessons: (module.lessons || []).sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
        })) || [];

        console.log('StudentCourseViewer: Modules with lessons:', sortedModules);
        setModules(sortedModules);

        // Check if we have any lessons
        const totalLessons = sortedModules.reduce((total, module) => total + (module.lessons?.length || 0), 0);
        
        if (totalLessons === 0) {
          console.warn('StudentCourseViewer: No lessons found for course');
          setError('No lessons available in this course');
        }

      } catch (error) {
        console.error('StudentCourseViewer: Unexpected error:', error);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id, user]);

  // Check access permissions
  const hasAccess = () => {
    if (!course || !userRoles.length) return false;

    // Admins have access to everything
    if (userRoles.some(role => ['admin', 'super_admin'].includes(role))) {
      return true;
    }

    // Academy students have access to trial and flagship courses
    if (userRoles.includes('academy_student') && ['trial', 'flagship'].includes(course.status)) {
      return true;
    }

    // Free access to trial courses for everyone
    if (course.status === 'trial') {
      return true;
    }

    return false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Loading Course</h3>
            <p className="text-muted-foreground">Please wait while we prepare your learning experience...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md mx-auto p-6"
        >
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-destructive mb-2">Course Access Issue</h3>
                <p className="text-muted-foreground">
                  {error || 'We encountered an issue loading this course. This might be because:'}
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• The course doesn't exist</li>
                  <li>• You don't have access to this course</li>
                  <li>• The course content is still being prepared</li>
                </ul>
              </div>
              <Button onClick={() => navigate('/academy')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Academy
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Check if user has access to the course
  if (!hasAccess()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md mx-auto p-6"
        >
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                {course.status === 'flagship' ? (
                  <Crown className="h-8 w-8 text-white" />
                ) : (
                  <Sparkles className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-2">
                  Premium Course Access Required
                </h3>
                <p className="text-muted-foreground">
                  This {course.status} course requires special access. Contact your administrator to get enrolled.
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/academy')} 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Academy
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => toast.info('Please contact your administrator for course access')}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-green-500/5">
      <EnhancedCoursePreview course={course} modules={modules} />
    </div>
  );
};

export default StudentCourseViewer;
