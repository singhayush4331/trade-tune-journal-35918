
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  Crown, 
  UserPlus, 
  UserMinus,
  TrendingUp,
  Clock
} from 'lucide-react';
import { getUserEnrollmentsAdmin, getUserCourseAccess, type Course } from '@/services/academy-service';

interface UserDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any | null;
  courses: Course[];
  userRoles: string[];
  onUpdateRole: (userId: string, roleId: string) => Promise<boolean>;
  onEnrollCourse: (userId: string, courseId: string) => Promise<boolean>;
  onRevokeAccess: (userId: string, courseId: string) => Promise<boolean>;
  onRefresh: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  open,
  onOpenChange,
  user,
  courses,
  userRoles,
  onUpdateRole,
  onEnrollCourse,
  onRevokeAccess,
  onRefresh
}) => {
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    if (user && open) {
      loadUserEnrollments();
    }
  }, [user, open]);

  const loadUserEnrollments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const enrollments = await getUserEnrollmentsAdmin(user.id);
      setUserEnrollments(enrollments);
    } catch (error) {
      console.error('Error loading user enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnrollCourse = async () => {
    if (!user || !selectedCourse) return;
    
    const success = await onEnrollCourse(user.id, selectedCourse);
    if (success) {
      setSelectedCourse('');
      loadUserEnrollments();
      onRefresh();
    }
  };

  const handleRevokeAccess = async (courseId: string) => {
    if (!user) return;
    
    const success = await onRevokeAccess(user.id, courseId);
    if (success) {
      loadUserEnrollments();
      onRefresh();
    }
  };

  const handleRoleUpdate = async (role: string, action: 'add' | 'remove') => {
    if (!user) return;
    
    const success = await onUpdateRole(user.id, role);
    if (success) {
      onRefresh();
    }
  };

  const getAvailableCourses = () => {
    const enrolledCourseIds = userEnrollments.map(enrollment => enrollment.course_id);
    return courses.filter(course => !enrolledCourseIds.includes(course.id));
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'free_user': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user.full_name?.charAt(0) || user.email.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.full_name || 'No Name'}</h2>
              <p className="text-sm text-muted-foreground font-normal">{user.email}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            Manage user roles, course access, and view enrollment details
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Information */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
                {user.experience_level && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>Experience: {user.experience_level}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Role Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">Current Roles:</span>
                    {userRoles.length > 0 ? (
                      userRoles.map(role => (
                        <div key={role} className="flex items-center gap-1">
                          <Badge className={getRoleBadgeColor(role)}>
                            {role}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => handleRoleUpdate(role, 'remove')}
                          >
                            ×
                          </Button>
                        </div>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No roles assigned</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {!userRoles.includes('admin') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleUpdate('admin', 'add')}
                      >
                        Add Admin
                      </Button>
                    )}
                    {!userRoles.includes('free_user') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRoleUpdate('free_user', 'add')}
                      >
                        Add Free User
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Assign Course
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableCourses().map(course => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleEnrollCourse}
                    disabled={!selectedCourse}
                    className="w-full"
                  >
                    Enroll User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Enrollments */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Enrollments ({userEnrollments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-200 h-20 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : userEnrollments.length > 0 ? (
                    <div className="space-y-4">
                      {userEnrollments.map((enrollment) => (
                        <div key={enrollment.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{enrollment.courses?.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                by {enrollment.courses?.instructor}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRevokeAccess(enrollment.course_id)}
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progress:</span>
                              <span className={getProgressColor(enrollment.progress)}>
                                {enrollment.progress || 0}%
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Enrolled {new Date(enrollment.enrolled_at).toLocaleDateString()}
                              </div>
                              <Badge variant={enrollment.status === 'active' ? 'default' : 'secondary'}>
                                {enrollment.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No course enrollments yet</p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
