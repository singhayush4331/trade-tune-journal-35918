
import { useState, useEffect } from 'react';
import { getTrialCourses, getUserEnrolledCourses, type Course } from '@/services/academy-service';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';

export const useSimplifiedAcademyData = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [hasEnrollments, setHasEnrollments] = useState(false);
  const { user } = useAuth();

useEffect(() => {
  const fetchUserRoles = async () => {
    if (!user?.id) return;
    try {
      const { roles } = await getCurrentUserRoles();
      setUserRoles(roles);
      console.log('User roles fetched (cached):', roles);
    } catch (error) {
      console.error('Error getting cached user roles:', error);
      setUserRoles([]);
    }
  };

  fetchUserRoles();
}, [user?.id]);

  // Check for enrollments separately
  useEffect(() => {
    const checkEnrollments = async () => {
      if (!user?.id) {
        setHasEnrollments(false);
        return;
      }

      try {
        const { data: enrollments, error } = await supabase
          .from('user_enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (error) {
          console.error('Error checking enrollments:', error);
          setHasEnrollments(false);
          return;
        }

        const hasActiveEnrollments = enrollments && enrollments.length > 0;
        setHasEnrollments(hasActiveEnrollments);
        console.log('User has active enrollments:', hasActiveEnrollments);
      } catch (error) {
        console.error('Error in checkEnrollments:', error);
        setHasEnrollments(false);
      }
    };

    checkEnrollments();
  }, [user?.id]);

  useEffect(() => {
    const loadCoursesData = async () => {
      setLoading(true);
      
      try {
        console.log('Loading courses - hasEnrollments:', hasEnrollments, 'userId:', user?.id);
        
        if (hasEnrollments && user?.id) {
          // User has active enrollments - show enrolled courses
          console.log('Fetching enrolled courses for user');
          const enrolledCourses = await getUserEnrolledCourses(user.id);
          console.log('Enrolled courses fetched:', enrolledCourses.length, enrolledCourses);
          setCourses(enrolledCourses);
        } else {
          // No enrollments - show trial courses
          console.log('Fetching trial courses');
          const trialCourses = await getTrialCourses();
          console.log('Trial courses fetched:', trialCourses.length, trialCourses);
          setCourses(trialCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
        setCourses([]);
      }
      
      setLoading(false);
    };

    // Only load courses after we've checked both roles and enrollments
    if (userRoles.length > 0 || (!user?.id && userRoles.length === 0) || hasEnrollments) {
      loadCoursesData();
    }
  }, [hasEnrollments, userRoles, user?.id]);

  // Determine if user is academy student based on enrollment status OR role
  const isAcademyStudent = hasEnrollments || (
    userRoles.includes('academy_student') && 
    !userRoles.includes('admin') && 
    !userRoles.includes('moderator')
  );

  console.log('useSimplifiedAcademyData state:', {
    userId: user?.id,
    hasEnrollments,
    userRoles,
    isAcademyStudent,
    coursesCount: courses.length,
    loading
  });

  return {
    courses,
    loading,
    isAcademyStudent,
    userRoles,
    hasEnrollments
  };
};
