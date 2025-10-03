
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, PlayCircle, Video, FileText, HelpCircle } from 'lucide-react';
import { getCourseDetails, isUserEnrolled, type Course, type CourseModule, type Lesson } from '@/services/academy-service';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface CourseDetailProps {
  courseId?: string;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<(CourseModule & { lessons: Lesson[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!courseId || !user?.id) return;
      const isEnrolledResult = await isUserEnrolled(courseId, user.id);
      setEnrolled(isEnrolledResult);
    };

    checkEnrollment();
  }, [courseId, user?.id]);

  useEffect(() => {
    const loadCourseData = async () => {
      if (!courseId) return;
      
      setLoading(true);
      const courseDetails = await getCourseDetails(courseId);
      
      if (courseDetails) {
        setCourse(courseDetails.course);
        setModules(courseDetails.modules);
      }
      
      setLoading(false);
    };

    loadCourseData();
  }, [courseId]);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'reading_material': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      default: return <PlayCircle className="h-4 w-4" />;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return <p>Loading course details...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Instructor: {course.instructor}</span>
              <span>Duration: {formatDuration(course.duration || 0)}</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Course Modules</h3>
              {modules.map((module) => (
                <div key={module.id} className="mb-4 p-4 border rounded-md">
                  <h4 className="text-lg font-medium">{module.title}</h4>
                  <p className="text-gray-600">{module.description}</p>
                  <ul className="list-disc pl-5 mt-2">
                    {module.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-2">
                        {getLessonIcon(lesson.lesson_type)}
                        {lesson.title}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div>
              {enrolled ? (
                <Badge variant="outline">Enrolled</Badge>
              ) : (
                <Button>Enroll Now</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;
