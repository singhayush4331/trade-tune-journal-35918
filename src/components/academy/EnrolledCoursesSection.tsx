
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  User, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { Course } from '@/services/academy-service';

interface EnrolledCoursesSectionProps {
  enrolledCourses: Course[];
  onStartCourse: (courseId: string) => void;
}

const EnrolledCoursesSection: React.FC<EnrolledCoursesSectionProps> = ({
  enrolledCourses,
  onStartCourse
}) => {
  if (enrolledCourses.length === 0) {
    return null;
  }

  const formatDuration = (minutes: number) => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 sm:space-y-8"
    >
      <div className="text-center space-y-3 sm:space-y-4">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 to-indigo-500/40 rounded-full blur-xl"></div>
          <div className="relative inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full border border-blue-500/40 backdrop-blur-sm">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-blue-700 dark:text-blue-400 text-sm sm:text-base">My Enrolled Courses</span>
          </div>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent px-2 sm:px-0">
          Continue Your Learning Journey
        </h3>
        <p className="text-muted-foreground max-w-2xl mx-auto px-2 sm:px-0 text-sm sm:text-base">
          Pick up where you left off with your enrolled courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {enrolledCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-lg flex items-center justify-center overflow-hidden relative">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-blue-500/60" />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-500/90 text-white border-0">
                      Enrolled
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
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
                    <span>{course.duration ? formatDuration(course.duration) : 'TBD'}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <div className="flex items-center gap-2">
                  {course.difficulty_level && (
                    <Badge variant="secondary" className={getDifficultyColor(course.difficulty_level)}>
                      {course.difficulty_level}
                    </Badge>
                  )}
                  {course.status && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {course.status}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => onStartCourse(course.id)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-3"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EnrolledCoursesSection;
