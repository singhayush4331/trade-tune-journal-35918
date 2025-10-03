
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, Play } from 'lucide-react';
import { getCourses, enrollUserInCourse, isUserEnrolled, type Course } from '@/services/academy-service';
import { useNavigate } from 'react-router-dom';

// Keep the original component for backward compatibility
const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentStatus, setEnrollmentStatus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const coursesData = await getCourses();
    setCourses(coursesData);
    
    // Check enrollment status for each course
    const enrollmentPromises = coursesData.map(async (course) => {
      const enrolled = await isUserEnrolled(course.id);
      return { courseId: course.id, enrolled };
    });
    
    const enrollmentResults = await Promise.all(enrollmentPromises);
    const enrollmentMap = enrollmentResults.reduce((acc, { courseId, enrolled }) => {
      acc[courseId] = enrolled;
      return acc;
    }, {} as Record<string, boolean>);
    
    setEnrollmentStatus(enrollmentMap);
    setLoading(false);
  };

  const handleEnroll = async (userId: string, courseId: string) => {
    const success = await enrollUserInCourse(userId, courseId);
    if (success) {
      setEnrollmentStatus(prev => ({ ...prev, [courseId]: true }));
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Courses</h2>
        <p className="text-muted-foreground">Enhance your trading skills with our comprehensive courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {course.thumbnail_url && (
              <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <img
                  src={course.thumbnail_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80" />
                </div>
              </div>
            )}
            
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className={getDifficultyColor(course.difficulty_level)}>
                  {course.difficulty_level}
                </Badge>
                {course.price > 0 && (
                  <span className="font-bold text-lg">₹{course.price}</span>
                )}
                {course.price === 0 && (
                  <Badge variant="secondary">Free</Badge>
                )}
              </div>
              
              <CardTitle className="line-clamp-2">{course.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatDuration(course.duration)}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {course.instructor}
                </div>
              </div>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {enrollmentStatus[course.id] ? (
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(`/academy/course/${course.id}`)}
                  >
                    Continue Learning
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => handleEnroll('current-user', course.id)}
                  >
                    {course.price > 0 ? `Enroll for ₹${course.price}` : 'Enroll Free'}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => navigate(`/academy/course/${course.id}/preview`)}
                >
                  Preview Course
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No courses available</h3>
          <p className="text-muted-foreground">Check back soon for new courses!</p>
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
