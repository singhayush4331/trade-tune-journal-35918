import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import { 
  getAllCourses,
  isUserEnrolled,
  type Course
} from '@/services/academy-service';
import { useAuth } from '@/hooks/use-auth';

interface NextGenCourseCatalogProps {
  courses: Course[];
  loading: boolean;
}

const NextGenCourseCatalog: React.FC<NextGenCourseCatalogProps> = ({
  courses,
  loading
}) => {
  const { user } = useAuth();
  const [userEnrollments, setUserEnrollments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const checkEnrollments = async () => {
      if (!user?.id || courses.length === 0) return;
      
      const enrollmentPromises = courses.map(course => 
        isUserEnrolled(course.id, user.id)
      );
      
      const enrollmentResults = await Promise.all(enrollmentPromises);
      const enrollmentMap = courses.reduce((acc, course, index) => {
        acc[course.id] = enrollmentResults[index];
        return acc;
      }, {} as Record<string, boolean>);
      
      setUserEnrollments(enrollmentMap);
    };

    checkEnrollments();
  }, [courses, user?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'trial': return 'bg-purple-100 text-purple-800';
      case 'flagship': return 'bg-amber-100 text-amber-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading ? (
        // Skeleton loading state
        <>
          {Array.from({ length: 6 }).map((_, i) => (
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
        </>
      ) : courses.length > 0 ? (
        // Course list
        <>
          {courses.map((course) => (
            <Card key={course.id}>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status}
                  </Badge>
                  {user && userEnrollments[course.id] && (
                    <Badge variant="outline">Enrolled</Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Instructor:</span>
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>{course.price > 0 ? `₹${course.price}` : 'Free'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className="capitalize">{course.difficulty_level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      ) : (
        // Empty state
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any courses matching your criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NextGenCourseCatalog;
