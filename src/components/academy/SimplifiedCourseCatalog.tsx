
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Play, 
  Clock, 
  User, 
  GraduationCap,
  MessageCircle
} from 'lucide-react';
import { Course } from '@/services/academy-service';
import { useNavigate } from 'react-router-dom';

interface SimplifiedCourseCatalogProps {
  courses: Course[];
  loading: boolean;
  isAcademyStudent: boolean;
  hasEnrollments?: boolean;
}

const SimplifiedCourseCatalog: React.FC<SimplifiedCourseCatalogProps> = ({
  courses,
  loading,
  isAcademyStudent,
  hasEnrollments = false
}) => {
  const navigate = useNavigate();

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'TBD';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/academy/course/${courseId}`);
  };

  const handleContactAdmin = () => {
    // Will be replaced with TypeForm link later
    console.log('Contact admin clicked');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-md mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 sm:py-20"
        >
          <MessageCircle className="h-16 sm:h-20 w-16 sm:w-20 text-muted-foreground mx-auto mb-4 sm:mb-6" />
          <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            {hasEnrollments ? 'No Courses Found' : 'No Trial Courses Available'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-sm sm:text-base">
            {hasEnrollments 
              ? 'There was an issue loading your enrolled courses. Please contact support.'
              : 'There are no trial courses available at the moment. Contact admin for access to our courses.'
            }
          </p>
          <Button onClick={handleContactAdmin} size="lg">
            Contact Admin for Access
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-12"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-600/40 rounded-full blur-xl"></div>
          <div className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-full border border-green-500/40 backdrop-blur-sm">
            {hasEnrollments ? (
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
            ) : (
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
            )}
            <span className="font-bold text-green-700 dark:text-green-400 text-sm sm:text-base">
              {hasEnrollments ? 'My Courses' : 'Trial Courses'}
            </span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          {hasEnrollments ? 'Your Enrolled Courses' : 'Explore Our Trial Content'}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {hasEnrollments 
            ? "Continue your learning journey with your enrolled courses"
            : "Get full access to our trial courses and experience our teaching quality"
          }
        </p>
      </motion.div>

      {/* Course Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-500/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm h-full">
              <CardHeader className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-green-500/60" />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className={hasEnrollments ? "bg-blue-500/90 text-white border-0" : "bg-green-500/90 text-white border-0"}>
                      {hasEnrollments ? 'Enrolled' : 'Trial Access'}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-green-600 transition-colors">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.description || 'No description available'}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{course.instructor || 'Instructor'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {course.difficulty_level && (
                    <Badge variant="secondary" className={getDifficultyColor(course.difficulty_level)}>
                      {course.difficulty_level}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs capitalize">
                    {course.status}
                  </Badge>
                </div>

                <Button
                  onClick={() => handleCourseClick(course.id)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {hasEnrollments ? 'Continue Learning' : 'Start Course'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimplifiedCourseCatalog;
