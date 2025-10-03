
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Crown, MessageCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TrialCourseAccess from './TrialCourseAccess';
import TrialBenefitsShowcase from './TrialBenefitsShowcase';
import FlagshipCourseShowcase from './FlagshipCourseShowcase';
import EnrolledCoursesSection from './EnrolledCoursesSection';
import { useOptimizedAcademyData } from '@/hooks/use-optimized-academy-data';
import { CourseCardSkeleton } from './AcademyLoadingSkeletons';
import { toast } from 'sonner';

const OptimizedCourseCatalog: React.FC = () => {
  const {
    courses,
    enrolledCourses,
    loading,
    enrollmentStatus,
    isAcademyOnlyUser,
    userRoles,
    refetch
  } = useOptimizedAcademyData();

  const navigate = useNavigate();

  console.log('OptimizedCourseCatalog: Rendering with data:', {
    coursesCount: courses.length,
    enrolledCoursesCount: enrolledCourses.length,
    loading,
    isAcademyOnlyUser,
    userRoles,
    courses: courses.map(c => ({ id: c.id, title: c.title, status: c.status })),
    enrolledCourses: enrolledCourses.map(c => ({ id: c.id, title: c.title, status: c.status }))
  });

  const handleContactAdmin = useCallback(() => {
    toast.info('Please contact your administrator to get access to this premium course', {
      description: 'Our flagship course offers comprehensive trading education with expert guidance.',
      duration: 4000,
    });
  }, []);

  const handlePreview = useCallback((courseId: string) => {
    console.log('OptimizedCourseCatalog: Navigating to course preview:', courseId);
    navigate(`/academy/course/${courseId}/preview`);
  }, [navigate]);

  const handleTrialAccess = useCallback((courseId: string) => {
    console.log('OptimizedCourseCatalog: Navigating to trial course directly:', courseId);
    navigate(`/academy/course/${courseId}`);
  }, [navigate]);

  const handleFlagshipAccess = useCallback((courseId: string) => {
    console.log('OptimizedCourseCatalog: Academy student accessing flagship course:', courseId);
    navigate(`/academy/course/${courseId}`);
  }, [navigate]);

  const handleStartEnrolledCourse = useCallback((courseId: string) => {
    console.log('OptimizedCourseCatalog: Starting enrolled course:', courseId);
    navigate(`/academy/course/${courseId}`);
  }, [navigate]);

  const { trialCourses, flagshipCourses } = useMemo(() => {
    console.log('OptimizedCourseCatalog: Filtering courses by status...');
    console.log('OptimizedCourseCatalog: All courses received:', courses.map(c => ({ 
      id: c.id, 
      title: c.title, 
      status: c.status,
      rawStatus: JSON.stringify(c.status)
    })));
    
    // Filter out enrolled courses from the discovery sections
    const enrolledCourseIds = new Set(enrolledCourses.map(c => c.id));
    const nonEnrolledCourses = courses.filter(course => !enrolledCourseIds.has(course.id));
    
    const trial = nonEnrolledCourses.filter(course => {
      const isTrialCourse = course.status === 'trial';
      console.log(`OptimizedCourseCatalog: Course ${course.title} - status: "${course.status}", isTrial: ${isTrialCourse}`);
      return isTrialCourse;
    });
    
    const flagship = nonEnrolledCourses.filter(course => {
      const isFlagshipCourse = course.status === 'flagship';
      console.log(`OptimizedCourseCatalog: Course ${course.title} - status: "${course.status}", isFlagship: ${isFlagshipCourse}`);
      return isFlagshipCourse;
    });
    
    console.log('OptimizedCourseCatalog: Filtered courses:', {
      trialCount: trial.length,
      flagshipCount: flagship.length,
      enrolledCount: enrolledCourses.length,
      trialCourses: trial.map(c => ({ id: c.id, title: c.title })),
      flagshipCourses: flagship.map(c => ({ id: c.id, title: c.title })),
      enrolledCourses: enrolledCourses.map(c => ({ id: c.id, title: c.title }))
    });
    
    return { trialCourses: trial, flagshipCourses: flagship };
  }, [courses, enrolledCourses]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-12">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="w-20 sm:w-24 h-6 sm:h-8 bg-muted/50 rounded-full mx-auto animate-pulse"></div>
          <div className="w-80 sm:w-96 h-8 sm:h-10 bg-muted/50 rounded mx-auto animate-pulse"></div>
          <div className="w-56 sm:w-64 h-5 sm:h-6 bg-muted/50 rounded mx-auto animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  console.log('OptimizedCourseCatalog: About to render sections:', {
    enrolledCoursesLength: enrolledCourses.length,
    trialCoursesLength: trialCourses.length,
    flagshipCoursesLength: flagshipCourses.length,
    isAcademyOnlyUser,
    userRoles
  });

  return (
    <div id="courses" className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 sm:space-y-6"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-600/40 rounded-full blur-xl"></div>
          <div className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full border border-green-500/40 backdrop-blur-sm">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
            <span className="font-bold text-green-700 dark:text-green-400 text-sm sm:text-base">Academy Courses</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent px-2 sm:px-0">
          Your Learning Journey
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
          {isAcademyOnlyUser 
            ? "As an academy student, you have access to both trial content and our flagship trading masterclass"
            : "Explore our trial content and discover our flagship trading masterclass"
          }
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        <div className="space-y-12 sm:space-y-16">
          {/* Enrolled Courses Section - Shows first and most prominently */}
          <EnrolledCoursesSection 
            enrolledCourses={enrolledCourses}
            onStartCourse={handleStartEnrolledCourse}
          />

          {/* Trial Courses Section */}
          {trialCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-emerald-500/40 rounded-full blur-xl"></div>
                  <div className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/40 backdrop-blur-sm">
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-700 dark:text-green-400 text-sm sm:text-base">Trial Content</span>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent px-2 sm:px-0">
                  {isAcademyOnlyUser ? "Additional Trial Access" : "Explore Course Previews"}
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0 text-sm sm:text-base">
                  {isAcademyOnlyUser 
                    ? "Explore additional trial courses as part of your academy enrollment"
                    : "Get a taste of our educational content with these preview courses"
                  }
                </p>
              </div>
              
              {/* Mobile-first responsive layout */}
              <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-start">
                {/* Course Cards - Full width on mobile, left column on desktop */}
                <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
                  {trialCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <TrialCourseAccess
                        course={course}
                        isEnrolled={enrollmentStatus[course.id] || false}
                        onEnroll={handleTrialAccess}
                        onPreview={isAcademyOnlyUser ? handleTrialAccess : handlePreview}
                        variant="featured"
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Benefits Showcase - Below courses on mobile, right column on desktop */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="w-full lg:w-1/2 lg:sticky lg:top-8"
                >
                  <TrialBenefitsShowcase />
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Flagship Courses Section */}
          {flagshipCourses.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 sm:space-y-8"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/40 to-emerald-500/40 rounded-full blur-xl"></div>
                  <div className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-500/40 backdrop-blur-sm">
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-700 dark:text-green-400 text-sm sm:text-base">Flagship Course</span>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent px-2 sm:px-0">
                  Premium Trading Masterclass
                </h3>
                <p className="text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0 text-sm sm:text-base">
                  {isAcademyOnlyUser 
                    ? "Your academy enrollment includes full access to our flagship course content. Start learning from our comprehensive trading masterclass." 
                    : "Our comprehensive flagship course designed to transform your trading journey"
                  }
                </p>
              </div>
              
              {/* Flagship Course Cards */}
              {flagshipCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <FlagshipCourseShowcase
                    course={course}
                    onContactAdmin={isAcademyOnlyUser ? () => handleFlagshipAccess(course.id) : handleContactAdmin}
                    isAcademyUser={isAcademyOnlyUser}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Debug/No Content Information */}
          {enrolledCourses.length === 0 && trialCourses.length === 0 && flagshipCourses.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 sm:py-20"
            >
              <BookOpen className="h-16 sm:h-20 w-16 sm:w-20 text-muted-foreground mx-auto mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 px-2 sm:px-0">No courses available</h3>
              <p className="text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto px-2 sm:px-0 text-sm sm:text-base">
                Check back soon for new learning content and course offerings.
              </p>
              <div className="text-xs sm:text-sm text-muted-foreground bg-muted/20 p-3 sm:p-4 rounded-lg max-w-2xl mx-auto mx-2 sm:mx-auto">
                <p className="font-semibold mb-2">Debug Information:</p>
                <div className="space-y-1 text-left">
                  <p>User roles: {userRoles.join(', ')}</p>
                  <p>Is academy only: {isAcademyOnlyUser ? 'Yes' : 'No'}</p>
                  <p>Total courses loaded: {courses.length}</p>
                  <p>Enrolled courses: {enrolledCourses.length}</p>
                  <p>Course statuses: {courses.map(c => `${c.title}: "${c.status}"`).join(', ')}</p>
                  <p>Trial courses found: {trialCourses.length}</p>
                  <p>Flagship courses found: {flagshipCourses.length}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* General Admin Contact Notice - only show for non-academy users */}
          {!isAcademyOnlyUser && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-500/20 mx-2 sm:mx-0"
            >
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 sm:h-8 w-6 sm:w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-green-900 dark:text-green-100 mb-2">
                    Need More Access?
                  </h3>
                  <p className="text-green-700 dark:text-green-300 max-w-2xl mx-auto text-sm sm:text-base">
                    Our courses are carefully curated and assigned by administrators. Contact your admin to request access to additional courses or upgrade your learning experience.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default OptimizedCourseCatalog;
