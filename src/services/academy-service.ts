import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';
import { getUserId } from '@/utils/auth-cache';

// Type for upgrade function result
interface UpgradeResult {
  success: boolean;
  message: string;
  actions?: string[];
}

export interface Course {
  id: string;
  created_at: string;
  title: string;
  description: string | null;
  instructor: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration: number | null;
  price: number | null;
  status: 'draft' | 'published' | 'archived' | 'trial' | 'flagship';
  category: 'trading' | 'technical' | 'options' | 'crypto';
  tags: string[] | null;
  prerequisites: string[] | null;
  thumbnail_url: string | null;
  intro_video_url: string | null;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  content: string | null;
  lesson_type: 'video' | 'text' | 'reading_material' | 'quiz' | 'assignment';
  duration: number | null;
  order_index: number;
  is_free: boolean | null;
  created_at: string;
  updated_at: string;
  content_data: Record<string, any> | null;
}

// Helper function to cast course data from database
const castCourseData = (data: any): Course => ({
  ...data,
  difficulty_level: data.difficulty_level as 'beginner' | 'intermediate' | 'advanced',
  status: data.status as 'draft' | 'published' | 'archived' | 'trial' | 'flagship',
  category: data.category as 'trading' | 'technical' | 'options' | 'crypto'
});

// Helper function to cast lesson data from database
const castLessonData = (data: any): Lesson => ({
  ...data,
  lesson_type: data.lesson_type as 'video' | 'text' | 'reading_material' | 'quiz' | 'assignment'
});

// Enhanced course fetching that respects user roles and permissions
export const getAllCourses = async (userId?: string): Promise<Course[]> => {
  try {
    let courseStatuses: readonly ('draft' | 'published' | 'archived' | 'trial' | 'flagship')[] = ['published', 'trial']; // Default for regular users
    
    // Check if user has academy_student role for flagship course access
    if (userId) {
      try {
        const currentId = await getUserId();
        let roleNames: string[] = [];
        if (currentId && currentId === userId) {
          const { roles } = await getCurrentUserRoles();
          roleNames = roles;
        } else {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select(`
              roles!inner(name)
            `)
            .eq('user_id', userId)
            .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
          roleNames = userRoles?.map((r: any) => r.roles.name) || [];
        }
        // Academy students can see flagship courses
        if (roleNames.includes('academy_student') || roleNames.includes('admin') || roleNames.includes('moderator')) {
          courseStatuses = ['published', 'trial', 'flagship'] as const;
        }
      } catch (e) {
        // fallback: keep default statuses
      }
    }

    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .in('status', courseStatuses)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return courses?.map(castCourseData) || [];
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    return [];
  }
};

// New function to get trial courses only (for regular users)
export const getTrialCourses = async (): Promise<Course[]> => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'trial')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trial courses:', error);
      return [];
    }

    return courses?.map(castCourseData) || [];
  } catch (error) {
    console.error('Error in getTrialCourses:', error);
    return [];
  }
};

// Alias for backward compatibility
export const getCourses = getAllCourses;

export const getAllCoursesAdmin = async (): Promise<Course[]> => {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return courses?.map(castCourseData) || [];
  } catch (error) {
    console.error('Error in getAllCoursesAdmin:', error);
    return [];
  }
};

export const getCourseById = async (courseId: string): Promise<Course | null> => {
  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) {
      console.error('Error fetching course by ID:', error);
      return null;
    }

    return course ? castCourseData(course) : null;
  } catch (error) {
    console.error('Error in getCourseById:', error);
    return null;
  }
};

export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at'>): Promise<Course | null> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating course:', error);
      return null;
    }

    return data ? castCourseData(data) : null;
  } catch (error) {
    console.error('Error in createCourse:', error);
    return null;
  }
};

export const updateCourse = async (courseId: string, courseData: Partial<Course>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', courseId);

    if (error) {
      console.error('Error updating course:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateCourse:', error);
    return false;
  }
};

export const deleteCourse = async (courseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (error) {
      console.error('Error deleting course:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    return false;
  }
};

// Module management functions
export const getCourseModules = async (courseId: string): Promise<CourseModule[]> => {
  try {
    const { data, error } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching course modules:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCourseModules:', error);
    return [];
  }
};

export const getModuleLessons = async (moduleId: string): Promise<Lesson[]> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('module_id', moduleId)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching module lessons:', error);
      return [];
    }

    return data?.map(castLessonData) || [];
  } catch (error) {
    console.error('Error in getModuleLessons:', error);
    return [];
  }
};

export const createModule = async (courseId: string, moduleData: Omit<CourseModule, 'id' | 'created_at' | 'updated_at' | 'course_id'>): Promise<CourseModule | null> => {
  try {
    const { data, error } = await supabase
      .from('course_modules')
      .insert([{ ...moduleData, course_id: courseId }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating module:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in createModule:', error);
    return null;
  }
};

export const updateModule = async (moduleId: string, moduleData: Partial<CourseModule>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('course_modules')
      .update(moduleData)
      .eq('id', moduleId);

    if (error) {
      console.error('Error updating module:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateModule:', error);
    return false;
  }
};

export const deleteModule = async (moduleId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('course_modules')
      .delete()
      .eq('id', moduleId);

    if (error) {
      console.error('Error deleting module:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteModule:', error);
    return false;
  }
};

export const createLesson = async (moduleId: string, lessonData: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'module_id'>): Promise<Lesson | null> => {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .insert([{ ...lessonData, module_id: moduleId }])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      return null;
    }

    return data ? castLessonData(data) : null;
  } catch (error) {
    console.error('Error in createLesson:', error);
    return null;
  }
};

export const updateLesson = async (lessonId: string, lessonData: Partial<Lesson>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lessons')
      .update(lessonData)
      .eq('id', lessonId);

    if (error) {
      console.error('Error updating lesson:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateLesson:', error);
    return false;
  }
};

export const deleteLesson = async (lessonId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (error) {
      console.error('Error deleting lesson:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteLesson:', error);
    return false;
  }
};

// User enrollment functions
export const getUserEnrollmentsAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_enrollments')
      .select(`
        *,
        courses (
          id,
          title,
          instructor,
          status
        )
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching user enrollments:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserEnrollmentsAdmin:', error);
    return [];
  }
};

// Enhanced atomic enrollment function that uses the new database function
export const enrollUserInCourseAtomic = async (userId: string, courseId: string): Promise<{
  success: boolean;
  message: string;
  enrollmentCreated: boolean;
  upgradeAttempted: boolean;
  actions: string[];
}> => {
  try {
    // First try the legacy approach for backward compatibility
    const { data: existing, error: checkError } = await supabase
      .from('user_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing enrollment:', checkError);
    }

    if (existing) {
      console.log('User already enrolled in this course');
      return {
        success: true,
        message: 'User already enrolled',
        enrollmentCreated: false,
        upgradeAttempted: false,
        actions: ['already_enrolled']
      };
    }

    // Enroll the user
    const { error: enrollError } = await supabase
      .from('user_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active'
      });

    if (enrollError) {
      console.error('Error enrolling user:', enrollError);
      return {
        success: false,
        message: enrollError.message,
        enrollmentCreated: false,
        upgradeAttempted: false,
        actions: []
      };
    }

    // Check if this is a published course that should trigger upgrade
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('status')
      .eq('id', courseId)
      .single();

    let upgradeAttempted = false;
    let upgradeActions: string[] = [];

    if (!courseError && courseData?.status === 'published') {
      // Attempt upgrade using the existing function
      try {
        const { data: upgradeResult, error: upgradeError } = await supabase
          .rpc('upgrade_academy_user_to_premium', {
            user_uuid: userId,
            course_uuid: courseId,
            upgraded_by: null
          });

        upgradeAttempted = true;

        if (!upgradeError && upgradeResult) {
          const result = upgradeResult as any;
          if (result.success) {
            upgradeActions = result.actions || ['upgraded_to_premium'];
          }
        }
      } catch (upgradeErr) {
        console.error('Error during upgrade attempt:', upgradeErr);
      }
    }

    return {
      success: true,
      message: 'Enrollment completed successfully',
      enrollmentCreated: true,
      upgradeAttempted,
      actions: ['created_enrollment', ...upgradeActions]
    };
  } catch (error) {
    console.error('Error in enrollUserInCourseAtomic:', error);
    return {
      success: false,
      message: 'Failed to enroll user',
      enrollmentCreated: false,
      upgradeAttempted: false,
      actions: []
    };
  }
};

// Legacy enrollment function for backward compatibility
export const enrollUserInCourse = async (userId: string, courseId: string): Promise<boolean> => {
  const result = await enrollUserInCourseAtomic(userId, courseId);
  return result.success;
};

// Add alias for backward compatibility
export const enrollUserInCourseAdmin = enrollUserInCourse;

export const revokeUserCourseAccess = async (userId: string, courseId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_enrollments')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) {
      console.error('Error revoking course access:', error);
      throw error;
    }

    console.log('Course access revoked successfully');
    return true;
  } catch (error) {
    console.error('Error in revokeUserCourseAccess:', error);
    return false;
  }
};

// Add alias for backward compatibility
export const revokeUserAccessAdmin = revokeUserCourseAccess;

export const getUserCourseAccess = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_enrollments')
      .select('course_id, status, enrolled_at')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user course access:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserCourseAccess:', error);
    return [];
  }
};

// Enhanced enrollment checking with better error handling
export const isUserEnrolled = async (courseId: string, userId?: string): Promise<boolean> => {
  try {
    if (!userId) return false;

    const { data, error } = await supabase
      .from('user_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .eq('status', 'active')
      .maybeSingle(); // Use maybeSingle to avoid errors when no data

    if (error) {
      console.error('Error checking enrollment:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isUserEnrolled:', error);
    return false;
  }
};

export const getUserAssignedCourses = async (userId?: string): Promise<Course[]> => {
  try {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_enrollments')
      .select(`
        courses (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching assigned courses:', error);
      return [];
    }

    return data?.map(enrollment => castCourseData(enrollment.courses)).filter(Boolean) || [];
  } catch (error) {
    console.error('Error in getUserAssignedCourses:', error);
    return [];
  }
};

export const getCoursesForUser = async (userId?: string): Promise<Course[]> => {
  return getUserAssignedCourses(userId);
};

export const getCourseDetails = async (courseId: string) => {
  try {
    const course = await getCourseById(courseId);
    if (!course) return null;

    const modules = await getCourseModules(courseId);
    const modulesWithLessons = await Promise.all(
      modules.map(async (module) => {
        const lessons = await getModuleLessons(module.id);
        return { ...module, lessons };
      })
    );

    return {
      course,
      modules: modulesWithLessons
    };
  } catch (error) {
    console.error('Error in getCourseDetails:', error);
    return null;
  }
};

// Validation functions
export const validateContent = (lessonData: any): string[] => {
  const errors: string[] = [];
  
  if (!lessonData.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (lessonData.lesson_type === 'video' && lessonData.video_url && !validateVideoUrl(lessonData.video_url)) {
    errors.push('Invalid video URL format');
  }
  
  return errors;
};

export const validateVideoUrl = (url: string): boolean => {
  const videoUrlPatterns = [
    /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)/i,
    /^https?:\/\/(www\.)?.*\.(mp4|webm|ogg)$/i
  ];
  
  return videoUrlPatterns.some(pattern => pattern.test(url));
};

// Bulk operations
export const bulkEnrollUsersByEmail = async (emails: string[], courseId: string): Promise<{ success: number; failed: number }> => {
  let success = 0;
  let failed = 0;

  // First, check if this is a published course that should trigger upgrades
  const { data: courseData, error: courseError } = await supabase
    .from('courses')
    .select('status, title')
    .eq('id', courseId)
    .single();

  if (courseError) {
    console.error('Error fetching course status:', courseError);
    return { success: 0, failed: emails.length };
  }

  const shouldTriggerUpgrade = courseData?.status === 'published';
  console.log('Course status check (bulk by email):', { courseId, status: courseData?.status, shouldTriggerUpgrade });

  const enrolledUserIds: string[] = [];

  for (const email of emails) {
    try {
      // Get user by email
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (error || !profile) {
        failed++;
        continue;
      }

      // Enroll user
      const enrolled = await enrollUserInCourse(profile.id, courseId);
      if (enrolled) {
        success++;
        enrolledUserIds.push(profile.id);
      } else {
        failed++;
      }
    } catch (error) {
      console.error('Error in bulk enrollment for', email, ':', error);
      failed++;
    }
  }

  // If this is a published course, attempt to upgrade Academy users to Premium
  if (shouldTriggerUpgrade && enrolledUserIds.length > 0) {
    console.log('Attempting auto-upgrades for published course assignment (bulk by email)');
    
    const upgradePromises = enrolledUserIds.map(async (userId) => {
      try {
        const { data: upgradeResult, error: upgradeError } = await supabase
          .rpc('upgrade_academy_user_to_premium', {
            user_uuid: userId,
            course_uuid: courseId,
            upgraded_by: null
          });

        if (upgradeError) {
          console.error(`Upgrade error for user ${userId}:`, upgradeError);
          return { userId, success: false, error: upgradeError.message };
        }

        const result = upgradeResult as unknown as UpgradeResult;
        if (result?.success) {
          console.log(`Successfully upgraded user ${userId} to Premium:`, result);
          return { userId, success: true, actions: result.actions };
        } else {
          console.log(`User ${userId} did not qualify for upgrade:`, result?.message);
          return { userId, success: false, message: result?.message };
        }
      } catch (error) {
        console.error(`Exception during upgrade for user ${userId}:`, error);
        return { userId, success: false, error: error.message };
      }
    });

    // Process all upgrades and log results
    const upgradeResults = await Promise.allSettled(upgradePromises);
    const successfulUpgrades = upgradeResults.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    console.log(`Auto-upgrade summary (bulk by email): ${successfulUpgrades}/${enrolledUserIds.length} users upgraded to Premium`);
  }

  return { success, failed };
};

export const bulkEnrollUsers = async (userIds: string[], courseId: string): Promise<boolean> => {
  try {
    console.log('Bulk enrolling users:', { userIds, courseId });
    
    // First, check if this is a published course that should trigger upgrades
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('status, title')
      .eq('id', courseId)
      .single();

    if (courseError) {
      console.error('Error fetching course status:', courseError);
      return false;
    }

    const shouldTriggerUpgrade = courseData?.status === 'published';
    console.log('Course status check:', { courseId, status: courseData?.status, shouldTriggerUpgrade });

    // Enroll all users
    const enrollmentPromises = userIds.map(userId => enrollUserInCourse(userId, courseId));
    const enrollmentResults = await Promise.allSettled(enrollmentPromises);
    
    const successfulEnrollments = enrollmentResults.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;

    if (successfulEnrollments === 0) {
      console.error('No users were successfully enrolled');
      return false;
    }

    console.log(`Bulk enrollment successful: ${successfulEnrollments}/${userIds.length} users enrolled`);

    // If this is a published course, attempt to upgrade Academy users to Premium
    if (shouldTriggerUpgrade) {
      console.log('Attempting auto-upgrades for published course assignment');
      
      const upgradePromises = userIds.map(async (userId) => {
        try {
          const { data: upgradeResult, error: upgradeError } = await supabase
            .rpc('upgrade_academy_user_to_premium', {
              user_uuid: userId,
              course_uuid: courseId,
              upgraded_by: null // Will use the user's own ID as default
            });

          if (upgradeError) {
            console.error(`Upgrade error for user ${userId}:`, upgradeError);
            return { userId, success: false, error: upgradeError.message };
          }

          const result = upgradeResult as unknown as UpgradeResult;
          if (result?.success) {
            console.log(`Successfully upgraded user ${userId} to Premium:`, result);
            return { userId, success: true, actions: result.actions };
          } else {
            console.log(`User ${userId} did not qualify for upgrade:`, result?.message);
            return { userId, success: false, message: result?.message };
          }
        } catch (error) {
          console.error(`Exception during upgrade for user ${userId}:`, error);
          return { userId, success: false, error: error.message };
        }
      });

      // Process all upgrades and log results
      const upgradeResults = await Promise.allSettled(upgradePromises);
      const successful = upgradeResults.filter(result => 
        result.status === 'fulfilled' && result.value.success
      ).length;
      
      console.log(`Auto-upgrade summary: ${successful}/${userIds.length} users upgraded to Premium`);
    }

    return true;
  } catch (error) {
    console.error('Error in bulkEnrollUsers:', error);
    return false;
  }
};

export const getAllUsersAdmin = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all users:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllUsersAdmin:', error);
    return [];
  }
};

export const getUserRoles = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles!inner(name)
      `)
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (error) {
      console.error('Error fetching user roles:', error);
      return [];
    }

    return data?.map(ur => ur.roles?.name).filter(Boolean) || [];
  } catch (error) {
    console.error('Error in getUserRoles:', error);
    return [];
  }
};

export const updateUserRoleAdmin = async (userId: string, roleId: string): Promise<boolean> => {
  // This would be implemented when role management is needed
  console.log('Role management functionality coming soon');
  return false;
};

// Enhanced role management functions - simplified versions for now
export const validateUpgradeEligibility = async (userId: string, courseId: string): Promise<{
  eligible: boolean;
  reasons: string[];
  userStatus: {
    hasAcademyRole: boolean;
    hasPremiumRole: boolean;
  };
  courseStatus: string;
}> => {
  try {
    // Manual implementation since RPC is not available in types yet
    const reasons: string[] = [];
    
    // Check course status
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('status')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return {
        eligible: false,
        reasons: ['Course not found'],
        userStatus: { hasAcademyRole: false, hasPremiumRole: false },
        courseStatus: 'unknown'
      };
    }

    if (course.status !== 'published') {
      reasons.push('Course is not published');
    }

    // Check user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        roles!inner(name, hierarchy_level)
      `)
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (rolesError) {
      return {
        eligible: false,
        reasons: ['Error checking user roles'],
        userStatus: { hasAcademyRole: false, hasPremiumRole: false },
        courseStatus: course.status
      };
    }

    const roleNames = userRoles?.map(r => r.roles.name) || [];
    const hasAcademyRole = roleNames.includes('academy_student');
    const hasPremiumRole = userRoles?.some(r => r.roles.hierarchy_level >= 40) || false;

    if (!hasAcademyRole) {
      reasons.push('User does not have academy_student role');
    }

    if (hasPremiumRole) {
      reasons.push('User already has premium access');
    }

    const eligible = course.status === 'published' && hasAcademyRole && !hasPremiumRole;

    return {
      eligible,
      reasons: eligible ? [] : reasons,
      userStatus: { hasAcademyRole, hasPremiumRole },
      courseStatus: course.status
    };
  } catch (error) {
    console.error('Error in validateUpgradeEligibility:', error);
    return {
      eligible: false,
      reasons: ['Failed to check eligibility'],
      userStatus: { hasAcademyRole: false, hasPremiumRole: false },
      courseStatus: 'unknown'
    };
  }
};

export const detectRoleConflicts = async (): Promise<Array<{
  userId: string;
  email: string;
  conflictingRoles: string[];
  conflictType: string;
}>> => {
  try {
    // Manual implementation to detect role conflicts
    // First get user roles with role details
    const { data: userRolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        roles!inner(name, hierarchy_level)
      `)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (rolesError) {
      console.error('Error fetching user roles:', rolesError);
      return [];
    }

    // Get unique user IDs
    const userIds = [...new Set(userRolesData?.map(item => item.user_id) || [])];
    
    // Get profiles for these users
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return [];
    }

    // Create profiles map
    const profilesMap = new Map<string, string>();
    profilesData?.forEach(profile => {
      profilesMap.set(profile.id, profile.email);
    });

    // Group by user
    const userRolesMap = new Map<string, {
      email: string;
      roles: Array<{ name: string; hierarchy_level: number }>;
    }>();

    userRolesData?.forEach(item => {
      const userId = item.user_id;
      const email = profilesMap.get(userId) || 'Unknown';
      const role = { name: item.roles.name, hierarchy_level: item.roles.hierarchy_level };

      if (!userRolesMap.has(userId)) {
        userRolesMap.set(userId, { email, roles: [] });
      }
      userRolesMap.get(userId)?.roles.push(role);
    });

    // Check for conflicts
    const conflicts: Array<{
      userId: string;
      email: string;
      conflictingRoles: string[];
      conflictType: string;
    }> = [];

    userRolesMap.forEach(({ email, roles }, userId) => {
      const roleNames = roles.map(r => r.name);
      
      // Check for Premium + Trial conflict
      if (roleNames.includes('Premium User') && roleNames.includes('Trial User')) {
        conflicts.push({
          userId,
          email,
          conflictingRoles: roleNames,
          conflictType: 'premium_trial_conflict'
        });
      }
      // Check for Premium + Free conflict
      else if (roleNames.includes('Premium User') && roleNames.includes('Free User')) {
        conflicts.push({
          userId,
          email,
          conflictingRoles: roleNames,
          conflictType: 'premium_free_conflict'
        });
      }
      // Check for hierarchy conflicts
      else if (roles.length > 1) {
        const levels = roles.map(r => r.hierarchy_level).sort((a, b) => b - a);
        if (levels[0] >= 40 && levels[1] < 40) {
          conflicts.push({
            userId,
            email,
            conflictingRoles: roleNames,
            conflictType: 'hierarchy_conflict'
          });
        }
      }
    });

    return conflicts;
  } catch (error) {
    console.error('Error in detectRoleConflicts:', error);
    return [];
  }
};

export const resolveUserRoleConflicts = async (userId: string): Promise<boolean> => {
  try {
    // Manual implementation to resolve conflicts
    const { data: userRoles, error } = await supabase
      .from('user_roles')
      .select(`
        id,
        role_id,
        roles!inner(name, hierarchy_level)
      `)
      .eq('user_id', userId)
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (error || !userRoles) {
      return false;
    }

    const rolesByHierarchy = userRoles.sort((a, b) => b.roles.hierarchy_level - a.roles.hierarchy_level);
    
    // If user has premium role, remove trial and free roles
    const hasPremiumRole = rolesByHierarchy.some(r => r.roles.hierarchy_level >= 40);
    
    if (hasPremiumRole) {
      const rolesToRemove = rolesByHierarchy.filter(r => 
        r.roles.hierarchy_level < 40 && 
        (r.roles.name === 'Trial User' || r.roles.name === 'Free User')
      );

      if (rolesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .in('id', rolesToRemove.map(r => r.id));

        if (deleteError) {
          console.error('Error removing conflicting roles:', deleteError);
          return false;
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error in resolveUserRoleConflicts:', error);
    return false;
  }
};

export const cleanupExpiredRoles = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString());

    if (error) {
      console.error('Error cleaning up expired roles:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in cleanupExpiredRoles:', error);
    return false;
  }
};

export const scheduleRoleCleanup = async (): Promise<boolean> => {
  try {
    // Clean up expired roles
    await cleanupExpiredRoles();
    
    // Get all users and resolve conflicts
    const { data: users, error } = await supabase
      .from('user_roles')
      .select('user_id')
      .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

    if (error) {
      return false;
    }

    const uniqueUserIds = [...new Set(users?.map(u => u.user_id) || [])];
    
    // Resolve conflicts for each user
    const results = await Promise.allSettled(
      uniqueUserIds.map(userId => resolveUserRoleConflicts(userId))
    );

    const successful = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    console.log(`Role cleanup completed: ${successful}/${uniqueUserIds.length} users processed`);

    return true;
  } catch (error) {
    console.error('Error in scheduleRoleCleanup:', error);
    return false;
  }
};

// New function to get user's enrolled courses with details
export const getUserEnrolledCourses = async (userId?: string): Promise<Course[]> => {
  try {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('user_enrollments')
      .select(`
        courses (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }

    return data?.map(enrollment => castCourseData(enrollment.courses)).filter(Boolean) || [];
  } catch (error) {
    console.error('Error in getUserEnrolledCourses:', error);
    return [];
  }
};
