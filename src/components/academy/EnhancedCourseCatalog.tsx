import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, CheckCircle, Lock, PlayCircle } from 'lucide-react';
import { Course } from '@/services/academy-service';
import { isUserEnrolled } from '@/services/academy-service';
import { useAuth } from '@/hooks/use-auth';

interface EnhancedCourseCatalogProps {
  courses: Course[];
}

const EnhancedCourseCatalog: React.FC<EnhancedCourseCatalogProps> = ({
  courses
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
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Badge className={getStatusColor(course.status)}>
                {course.status}
              </Badge>
              {userEnrollments[course.id] ? (
                <Badge variant="outline" className="text-green-600 border-green-500">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Enrolled
                </Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500 border-gray-400">
                  <Lock className="h-4 w-4 mr-1" />
                  Locked
                </Badge>
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
            <Button className="w-full mt-4">
              {userEnrollments[course.id] ? (
                <>
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Continue Learning
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Course Details
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedCourseCatalog;
