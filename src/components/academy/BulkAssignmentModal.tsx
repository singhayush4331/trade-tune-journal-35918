
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  BookOpen, 
  UserPlus,
  Clock,
  DollarSign
} from 'lucide-react';
import { type Course } from '@/services/academy-service';

interface BulkAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserIds: string[];
  courses: Course[];
  users: any[];
  onBulkEnroll: (userIds: string[], courseId: string) => Promise<boolean>;
  onSuccess: () => void;
}

const BulkAssignmentModal: React.FC<BulkAssignmentModalProps> = ({
  open,
  onOpenChange,
  selectedUserIds,
  courses,
  users,
  onBulkEnroll,
  onSuccess
}) => {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const selectedUsers = users.filter(user => selectedUserIds.includes(user.id));

  const handleCourseSelect = (courseId: string, checked: boolean) => {
    const newSelected = new Set(selectedCourses);
    if (checked) {
      newSelected.add(courseId);
    } else {
      newSelected.delete(courseId);
    }
    setSelectedCourses(newSelected);
  };

  const handleSelectAllCourses = (checked: boolean) => {
    if (checked) {
      setSelectedCourses(new Set(courses.map(course => course.id)));
    } else {
      setSelectedCourses(new Set());
    }
  };

  const handleBulkAssign = async () => {
    if (selectedCourses.size === 0) return;
    
    setLoading(true);
    try {
      const promises = Array.from(selectedCourses).map(courseId =>
        onBulkEnroll(selectedUserIds, courseId)
      );
      
      await Promise.all(promises);
      onSuccess();
      onOpenChange(false);
      setSelectedCourses(new Set());
    } catch (error) {
      console.error('Error during bulk assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Bulk Course Assignment
          </DialogTitle>
          <DialogDescription>
            Assign selected courses to {selectedUserIds.length} users
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Users */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Selected Users ({selectedUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {selectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 border rounded">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.full_name?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.full_name || 'No Name'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Course Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Available Courses
                </span>
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedCourses.size === courses.length && courses.length > 0}
                    onCheckedChange={handleSelectAllCourses}
                  />
                  <span className="text-sm text-muted-foreground">Select All</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
                      <Checkbox
                        checked={selectedCourses.has(course.id)}
                        onCheckedChange={(checked) => handleCourseSelect(course.id, checked as boolean)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-2">{course.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                          by {course.instructor}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <Badge className={getDifficultyColor(course.difficulty_level || 'beginner')}>
                            {course.difficulty_level}
                          </Badge>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDuration(course.duration)}
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            {course.price > 0 ? `₹${course.price}` : 'Free'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Assignment Summary */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">Assignment Summary</p>
                <p className="text-sm text-blue-600">
                  {selectedCourses.size} course(s) will be assigned to {selectedUsers.length} user(s)
                </p>
              </div>
              <Button
                onClick={handleBulkAssign}
                disabled={selectedCourses.size === 0 || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Assigning...' : `Assign ${selectedCourses.size} Course(s)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAssignmentModal;
