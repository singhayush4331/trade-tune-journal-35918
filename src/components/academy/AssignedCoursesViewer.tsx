
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  User, 
  Trophy,
  ArrowRight,
  GraduationCap,
  Target
} from 'lucide-react';
import { getUserAssignedCourses, Course } from '@/services/academy-service';
import { toast } from 'sonner';

const AssignedCoursesViewer: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignedCourses();
  }, []);

  const loadAssignedCourses = async () => {
    try {
      const assignedCourses = await getUserAssignedCourses();
      setCourses(assignedCourses);
    } catch (error) {
      console.error('Error loading assigned courses:', error);
      toast.error('Failed to load your assigned courses');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = (courseId: string) => {
    navigate(`/academy/course/${courseId}/learn`);
  };

  const handleViewDetails = (courseId: string) => {
    navigate(`/academy/course/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-12 w-12 border-4 border-primary/30 border-t-primary mx-auto mb-4"
            />
            <p className="text-muted-foreground">Loading your assigned courses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-12"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-full blur-xl"></div>
            <div className="relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-full border border-primary/30 backdrop-blur-sm">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">My Learning Journey</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Your Assigned
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent"> Courses</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            These courses have been carefully selected and assigned to you by your administrator. 
            Start learning and track your progress.
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No Courses Assigned Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              You don't have any assigned courses at the moment. Contact your administrator to get access to courses.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/academy')}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Course Catalog
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200/50 dark:border-blue-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Courses</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{courses.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200/50 dark:border-green-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-400">0</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 border-purple-200/50 dark:border-purple-800/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">{courses.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                    <CardHeader className="space-y-4">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg flex items-center justify-center overflow-hidden">
                        {course.thumbnail_url ? (
                          <img 
                            src={course.thumbnail_url} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen className="h-12 w-12 text-primary/60" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
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
                          <span>{course.duration || 0} min</span>
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
                          <Badge variant="secondary" className="text-xs">
                            {course.difficulty_level}
                          </Badge>
                        )}
                        {course.status === 'trial' && (
                          <Badge variant="outline" className="text-xs border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                            Trial
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => handleStartCourse(course.id)}
                          className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                          size="sm"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Learning
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleViewDetails(course.id)}
                          size="sm"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedCoursesViewer;
