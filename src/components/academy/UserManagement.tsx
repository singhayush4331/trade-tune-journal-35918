import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  UserMinus,
  Crown,
  BookOpen,
  Mail,
  Eye,
  Plus,
  Upload,
  Target,
  CheckCircle,
  XCircle,
  GraduationCap,
  MoreVertical,
  Settings,
  FileSpreadsheet,
  UserCheck,
  Loader2
} from 'lucide-react';
import { 
  getAllUsersAdmin,
  getAllCoursesAdmin,
  getUserEnrollmentsAdmin,
  enrollUserInCourseAdmin,
  revokeUserAccessAdmin,
  getUserRoles,
  updateUserRoleAdmin,
  bulkEnrollUsers,
  bulkEnrollUsersByEmail,
  type Course
} from '@/services/academy-service';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserDetailModal from './UserDetailModal';
import EnhancedBulkAssignmentModal from './EnhancedBulkAssignmentModal';
import BatchCourseCreationModal from './BatchCourseCreationModal';
import ExcelUploadModal from './ExcelUploadModal';
import SelectedUsersPreview from './SelectedUsersPreview';
import ManualUserCreationModal from './ManualUserCreationModal';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  experience_level?: string;
  trading_style?: string;
  created_at: string;
}

interface UserEnrollment {
  course_id: string;
  status: string;
  enrolled_at: string;
  progress: number;
}

const UserManagement: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [enrolledUsers, setEnrolledUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrollments, setEnrollments] = useState<Record<string, UserEnrollment[]>>({});
  const [loading, setLoading] = useState(true);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [enrollmentFilter, setEnrollmentFilter] = useState('enrolled');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showBulkAssignment, setShowBulkAssignment] = useState(false);
  const [showBatchCreation, setShowBatchCreation] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [showManualCreation, setShowManualCreation] = useState(false);
  const [userRoles, setUserRoles] = useState<Record<string, string[]>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadInitialData();
  }, []);

  // Separate effect for enrollments when course changes
  useEffect(() => {
    if (selectedCourse && allUsers.length > 0) {
      loadEnrollments();
    }
  }, [selectedCourse?.id]); // Only depend on course ID, not allUsers or enrollments

  // Separate effect for filtering users
  useEffect(() => {
    filterUsers();
  }, [allUsers, enrolledUsers, searchQuery, enrollmentFilter, selectedCourse]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading initial data...');
      
      const [usersData, coursesData] = await Promise.all([
        getAllUsersAdmin(),
        getAllCoursesAdmin()
      ]);
      
      console.log('✅ Loaded users:', usersData.length);
      console.log('✅ Loaded courses:', coursesData.length);
      
      setAllUsers(usersData);
      setCourses(coursesData);
      
      // Load user roles
      const rolesPromises = usersData.map(async (user: User) => {
        const roles = await getUserRoles(user.id);
        return { userId: user.id, roles };
      });
      
      const rolesResults = await Promise.all(rolesPromises);
      const rolesMap = rolesResults.reduce((acc, { userId, roles }) => {
        acc[userId] = roles;
        return acc;
      }, {} as Record<string, string[]>);
      
      setUserRoles(rolesMap);

      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0]);
      }
    } catch (error) {
      console.error('❌ Error loading initial data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollments = async () => {
    if (!selectedCourse || allUsers.length === 0) return;
    
    try {
      setLoadingEnrollments(true);
      console.log('🔄 Loading enrollments for course:', selectedCourse.title);
      
      const enrollmentPromises = allUsers.map(async (user) => {
        const userEnrollments = await getUserEnrollmentsAdmin(user.id);
        return { userId: user.id, enrollments: userEnrollments };
      });
      
      const enrollmentResults = await Promise.all(enrollmentPromises);
      const enrollmentMap = enrollmentResults.reduce((acc, { userId, enrollments }) => {
        acc[userId] = enrollments;
        return acc;
      }, {} as Record<string, UserEnrollment[]>);
      
      setEnrollments(enrollmentMap);

      const enrolled = allUsers.filter(user => {
        const userEnrollments = enrollmentMap[user.id] || [];
        return userEnrollments.some(e => e.course_id === selectedCourse.id && e.status !== 'revoked');
      });
      
      setEnrolledUsers(enrolled);
      console.log('✅ Loaded enrollments. Enrolled users:', enrolled.length);
    } catch (error) {
      console.error('❌ Error loading enrollments:', error);
      toast.error('Failed to load enrollment data');
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const filterUsers = () => {
    if (!selectedCourse) {
      setFilteredUsers([]);
      return;
    }

    let baseUsers: User[] = [];
    
    if (enrollmentFilter === 'enrolled') {
      baseUsers = enrolledUsers;
    } else if (enrollmentFilter === 'not-enrolled') {
      baseUsers = allUsers.filter(user => {
        const userEnrollments = enrollments[user.id] || [];
        return !userEnrollments.some(e => e.course_id === selectedCourse.id && e.status !== 'revoked');
      });
    } else {
      baseUsers = allUsers;
    }
    
    let filtered = baseUsers;
    if (searchQuery) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  };

  const getEnrollmentStatus = (user: User) => {
    if (!selectedCourse) return null;
    const userEnrollments = enrollments[user.id] || [];
    return userEnrollments.find(e => e.course_id === selectedCourse.id && e.status !== 'revoked');
  };

  const setUserActionLoading = (userId: string, isLoading: boolean) => {
    setActionLoading(prev => ({
      ...prev,
      [userId]: isLoading
    }));
  };

  const handleEnrollUser = async (userId: string) => {
    if (!selectedCourse) return;
    
    try {
      setUserActionLoading(userId, true);
      console.log('🔄 Enrolling user:', userId, 'in course:', selectedCourse.id);
      
      await enrollUserInCourseAdmin(userId, selectedCourse.id);
      toast.success('User enrolled successfully');
      
      // Reload enrollments to get fresh data
      await loadEnrollments();
    } catch (error) {
      console.error('❌ Error enrolling user:', error);
      toast.error('Failed to enroll user');
    } finally {
      setUserActionLoading(userId, false);
    }
  };

  const handleRevokeAccess = async (userId: string) => {
    if (!selectedCourse) return;
    
    try {
      setUserActionLoading(userId, true);
      console.log('🔄 Revoking access for user:', userId, 'from course:', selectedCourse.id);
      
      // Optimistic update - remove user from enrolled users immediately
      setEnrolledUsers(prev => prev.filter(user => user.id !== userId));
      
      const success = await revokeUserAccessAdmin(userId, selectedCourse.id);
      
      if (success) {
        console.log('✅ Access revoked successfully');
        toast.success('User access revoked successfully');
        
        // Update enrollments state to reflect the change
        setEnrollments(prev => {
          const updated = { ...prev };
          if (updated[userId]) {
            updated[userId] = updated[userId].map(enrollment => 
              enrollment.course_id === selectedCourse.id 
                ? { ...enrollment, status: 'revoked' }
                : enrollment
            );
          }
          return updated;
        });
      } else {
        console.error('❌ Failed to revoke access');
        toast.error('Failed to revoke user access');
        // Revert optimistic update
        await loadEnrollments();
      }
    } catch (error) {
      console.error('❌ Error revoking access:', error);
      toast.error('Failed to revoke user access');
      // Revert optimistic update
      await loadEnrollments();
    } finally {
      setUserActionLoading(userId, false);
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    const newSelected = new Set(selectedUsers);
    if (checked) {
      newSelected.add(userId);
    } else {
      newSelected.delete(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(new Set(filteredUsers.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  };

  const handleRemoveUserFromSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    newSelected.delete(userId);
    setSelectedUsers(newSelected);
  };

  const handleClearAllSelection = () => {
    setSelectedUsers(new Set());
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowUserDetail(true);
  };

  const handleExcelUpload = (parsedUsers: any[]) => {
    if (!selectedCourse) return;
    
    setShowExcelUpload(false);
    setShowBulkAssignment(true);
  };

  const getEnrollmentStats = () => {
    if (!selectedCourse) return { enrolled: 0, total: allUsers.length };
    
    const enrolled = enrolledUsers.length;
    
    return { enrolled, total: allUsers.length };
  };

  const stats = getEnrollmentStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header Section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-background dark:via-background dark:to-background border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                User Management
              </h1>
              <p className="text-muted-foreground">
                Manage student enrollments and access permissions
              </p>
            </div>
            
            {/* Secondary Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Actions
                  <MoreVertical className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => setShowManualCreation(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create User Manually
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowExcelUpload(true)} disabled={!selectedCourse}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Upload from Excel
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowBatchCreation(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Create Batch Course
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Course Selection Card */}
          <Card className="bg-white/70 dark:bg-card/50 backdrop-blur-sm border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-3 block">
                    Select Course to Manage
                  </label>
                  <Select
                    value={selectedCourse?.id || ''}
                    onValueChange={(value) => {
                      const course = courses.find(c => c.id === value);
                      setSelectedCourse(course || null);
                      setSelectedUsers(new Set());
                    }}
                  >
                    <SelectTrigger className="h-12 text-base bg-background border-border">
                      <SelectValue placeholder="Choose a course..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{course.title}</span>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedCourse && (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.enrolled}</div>
                      <div className="text-xs text-muted-foreground">Enrolled</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-500">{stats.total - stats.enrolled}</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedCourse ? (
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* Search and Filter Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10"
                  />
                </div>
                
                <Select value={enrollmentFilter} onValueChange={setEnrollmentFilter}>
                  <SelectTrigger className="w-48 h-10">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enrolled">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-600" />
                        Enrolled Users
                      </div>
                    </SelectItem>
                    <SelectItem value="not-enrolled">
                      <div className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-orange-600" />
                        Not Enrolled
                      </div>
                    </SelectItem>
                    <SelectItem value="all">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        All Users
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
                  <Checkbox
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>

                <Button
                  onClick={() => setShowBulkAssignment(true)}
                  disabled={selectedUsers.size === 0}
                  variant="default"
                  className="h-10"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Bulk Actions ({selectedUsers.size})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Course Info */}
          {selectedCourse && (
            <Card className="bg-gradient-to-r from-primary/5 via-blue-50/50 to-purple-50/50 dark:from-primary/5 dark:to-primary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-primary-foreground text-xl font-bold">
                    {selectedCourse.title.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-foreground">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-muted-foreground">
                      Managing {filteredUsers.length} users • {stats.enrolled} currently enrolled
                      {loadingEnrollments && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Loading...
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Enrollment Rate</div>
                    <div className="text-xl font-bold text-primary">
                      {Math.round((stats.enrolled / stats.total) * 100)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Grid */}
          {loading || loadingEnrollments ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="w-20 h-8" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => {
                const enrollment = getEnrollmentStatus(user);
                const isEnrolled = !!enrollment;
                const isSelected = selectedUsers.has(user.id);
                const isActionLoading = actionLoading[user.id] || false;
                
                return (
                  <Card 
                    key={user.id} 
                    className={`group relative transition-all duration-200 hover:shadow-md cursor-pointer ${
                      isSelected 
                        ? 'ring-2 ring-primary shadow-lg' 
                        : isEnrolled 
                          ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/10' 
                          : 'hover:border-border/60'
                    }`}
                    onClick={() => handleUserSelect(user.id, !isSelected)}
                  >
                    <CardContent className="p-5">
                      {/* Selection Checkbox */}
                      <div className="absolute top-4 right-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => handleUserSelect(user.id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>

                      <div className="flex items-start gap-4">
                        {/* Avatar with Status */}
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className={`font-semibold ${
                              isEnrolled 
                                ? 'bg-green-500 text-white' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {user.full_name?.charAt(0) || user.email.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${
                            isEnrolled ? 'bg-green-500' : 'bg-gray-400'
                          }`}>
                            {isEnrolled ? (
                              <CheckCircle className="h-3 w-3 text-white" />
                            ) : (
                              <XCircle className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground truncate">
                              {user.full_name || 'No Name'}
                            </h3>
                            {userRoles[user.id]?.includes('admin') && (
                              <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                            )}
                          </div>
                          
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3 flex-shrink-0" />
                            <span className="text-sm truncate">{user.email}</span>
                          </div>
                          
                          {/* Status and Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Badge variant={isEnrolled ? "default" : "secondary"} className="text-xs">
                                {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
                              </Badge>
                              
                              {/* Role Badge */}
                              {userRoles[user.id]?.includes('admin') && (
                                <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700 bg-yellow-50">
                                  Admin
                                </Badge>
                              )}
                            </div>

                            {/* Progress Bar */}
                            {enrollment && (
                              <div>
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progress</span>
                                  <span>{Math.round(enrollment.progress || 0)}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${Math.round(enrollment.progress || 0)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            {isEnrolled ? (
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRevokeAccess(user.id);
                                }}
                                disabled={isActionLoading}
                                className="h-8 text-xs flex-1"
                              >
                                {isActionLoading ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <UserMinus className="h-3 w-3 mr-1" />
                                )}
                                Remove
                              </Button>
                            ) : (
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEnrollUser(user.id);
                                }}
                                disabled={isActionLoading}
                                className="h-8 text-xs flex-1"
                              >
                                {isActionLoading ? (
                                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <UserPlus className="h-3 w-3 mr-1" />
                                )}
                                Enroll
                              </Button>
                            )}
                            
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewUser(user);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredUsers.length === 0 && !loading && !loadingEnrollments && (
            <Card className="border-dashed">
              <CardContent className="text-center py-16">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  {searchQuery || enrollmentFilter !== 'enrolled' ? 'No users found' : 'No enrolled users yet'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {searchQuery || enrollmentFilter !== 'enrolled' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'No users are currently enrolled in this course.'
                  }
                </p>
                {!searchQuery && enrollmentFilter === 'enrolled' && (
                  <div className="flex gap-3 justify-center">
                    <Button onClick={() => setShowExcelUpload(true)}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload from Excel
                    </Button>
                    <Button variant="outline" onClick={() => setShowManualCreation(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        // Course Selection Empty State
        <div className="max-w-4xl mx-auto px-6 pt-16">
          <Card className="border-dashed">
            <CardContent className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
              <h3 className="text-2xl font-medium mb-3">Select a Course to Get Started</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Choose a course from the selector above to view and manage user enrollments for that course.
              </p>
              <Button 
                onClick={() => setShowBatchCreation(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Course
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Users Preview */}
      <SelectedUsersPreview
        selectedUsers={selectedUsers}
        users={allUsers}
        selectedCourse={selectedCourse}
        onRemoveUser={handleRemoveUserFromSelection}
        onClearAll={handleClearAllSelection}
        onBulkAssign={() => setShowBulkAssignment(true)}
      />

      {/* Modals */}
      <UserDetailModal
        open={showUserDetail}
        onOpenChange={setShowUserDetail}
        user={selectedUser}
        courses={courses}
        userRoles={selectedUser ? userRoles[selectedUser.id] || [] : []}
        onUpdateRole={updateUserRoleAdmin}
        onEnrollCourse={enrollUserInCourseAdmin}
        onRevokeAccess={revokeUserAccessAdmin}
        onRefresh={loadInitialData}
      />

      <EnhancedBulkAssignmentModal
        open={showBulkAssignment}
        onOpenChange={setShowBulkAssignment}
        selectedUserIds={Array.from(selectedUsers)}
        courses={courses}
        users={allUsers}
        onBulkEnroll={bulkEnrollUsers}
        onBulkEnrollByEmail={(emails: string[], courseId: string) => {
          return bulkEnrollUsersByEmail(emails, courseId).then(result => result.success > 0);
        }}
        onSuccess={() => {
          setSelectedUsers(new Set());
          loadInitialData();
          loadEnrollments();
        }}
      />

      <BatchCourseCreationModal
        open={showBatchCreation}
        onOpenChange={setShowBatchCreation}
        onSuccess={() => {
          loadInitialData();
        }}
      />

      <ManualUserCreationModal
        open={showManualCreation}
        onOpenChange={setShowManualCreation}
        courses={courses}
        onSuccess={() => {
          loadInitialData();
          loadEnrollments();
        }}
      />

      <ExcelUploadModal
        open={showExcelUpload}
        onOpenChange={setShowExcelUpload}
        onUsersUploaded={handleExcelUpload}
        courses={courses}
        selectedCourse={selectedCourse}
      />
    </div>
  );
};

export default UserManagement;
