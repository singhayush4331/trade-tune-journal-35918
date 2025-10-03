
import { useState, useEffect } from 'react';
import { getAllCourses, getUserEnrolledCourses, isUserEnrolled, type Course } from '@/services/academy-service';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentUserRoles } from '@/utils/roles-cache';

interface EnrollmentMap {
  [courseId: string]: boolean;
}

export const useOptimizedAcademyData = (userId?: string) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<EnrollmentMap>({});
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { user } = useAuth();

  // Use the provided userId or fallback to the authenticated user
  const effectiveUserId = userId || user?.id;

  useEffect(() => {
    const loadCoursesData = async () => {
      setLoading(true);
      
      // Fetch all available courses with role-based filtering
      const coursesData = await getAllCourses(effectiveUserId);
      setCourses(coursesData);
      
      // Fetch user's enrolled courses separately
      if (effectiveUserId) {
        const enrolledCoursesData = await getUserEnrolledCourses(effectiveUserId);
        setEnrolledCourses(enrolledCoursesData);
      }
      
      setLoading(false);
    };

    loadCoursesData();
  }, [effectiveUserId]);

  useEffect(() => {
    const checkEnrollments = async () => {
      if (!effectiveUserId || !courses.length) return;
      
      setEnrollmentLoading(true);
      const enrollmentPromises = courses.map(course => 
        isUserEnrolled(course.id, effectiveUserId)
      );
      
      const enrollmentResults = await Promise.all(enrollmentPromises);
      const enrollmentMap = courses.reduce((acc, course, index) => {
        acc[course.id] = enrollmentResults[index];
        return acc;
      }, {} as Record<string, boolean>);
      
      setEnrollments(enrollmentMap);
      setEnrollmentLoading(false);
    };

    checkEnrollments();
  }, [courses, effectiveUserId]);

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!effectiveUserId) return;
      try {
        const { roles } = await getCurrentUserRoles();
        setUserRoles(roles);
      } catch (error) {
        console.error('Error getting cached user roles:', error);
        setUserRoles([]);
      }
    };

    fetchUserRoles();
  }, [effectiveUserId]);

  // Check if user is academy-only (has academy_student role but not admin/moderator)
  const isAcademyOnlyUser = userRoles.includes('academy_student') && 
    !userRoles.includes('admin') && 
    !userRoles.includes('moderator');

  const refetch = async () => {
    setLoading(true);
    const coursesData = await getAllCourses(effectiveUserId);
    setCourses(coursesData);
    
    if (effectiveUserId) {
      const enrolledCoursesData = await getUserEnrolledCourses(effectiveUserId);
      setEnrolledCourses(enrolledCoursesData);
    }
    
    setLoading(false);
  };

  return {
    courses,
    enrolledCourses, // New: explicitly enrolled courses
    loading,
    enrollments,
    enrollmentLoading,
    enrollmentStatus: enrollments, // Alias for backwards compatibility
    isAcademyOnlyUser,
    userRoles,
    refetch
  };
};
