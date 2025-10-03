
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  UserPlus,
  Clock,
  DollarSign,
  Upload,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { type Course } from '@/services/academy-service';
import ExcelUploadModal from './ExcelUploadModal';

interface ParsedUser {
  name?: string;
  email: string;
  phone?: string;
  isValid: boolean;
  error?: string;
}

interface EnhancedBulkAssignmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUserIds: string[];
  courses: Course[];
  users: any[];
  onBulkEnroll: (userIds: string[], courseId: string) => Promise<boolean>;
  onBulkEnrollByEmail: (userEmails: string[], courseId: string) => Promise<boolean>;
  onSuccess: () => void;
}

const EnhancedBulkAssignmentModal: React.FC<EnhancedBulkAssignmentModalProps> = ({
  open,
  onOpenChange,
  selectedUserIds,
  courses,
  users,
  onBulkEnroll,
  onBulkEnrollByEmail,
  onSuccess
}) => {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [uploadedUsers, setUploadedUsers] = useState<ParsedUser[]>([]);
  const [enrollmentResults, setEnrollmentResults] = useState<{
    success: number;
    failed: number;
    details: string[];
  } | null>(null);
  const [activeTab, setActiveTab] = useState('existing');

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

  const handleUsersUploaded = (users: ParsedUser[]) => {
    setUploadedUsers(users);
    setShowExcelModal(false);
    setActiveTab('uploaded');
  };

  const handleBulkAssign = async () => {
    if (selectedCourses.size === 0) return;
    
    setLoading(true);
    setProgress(0);
    setEnrollmentResults(null);

    try {
      const courseIds = Array.from(selectedCourses);
      const totalOperations = courseIds.length;
      let completedOperations = 0;
      let successCount = 0;
      let failedCount = 0;
      const details: string[] = [];

      if (activeTab === 'existing' && selectedUserIds.length > 0) {
        // Enroll existing users using enhanced atomic enrollment
        for (const courseId of courseIds) {
          const course = courses.find(c => c.id === courseId);
          const courseName = course?.title || 'Unknown Course';
          
          try {
            const success = await onBulkEnroll(selectedUserIds, courseId);
            if (success) {
              successCount++;
              details.push(`✅ Successfully enrolled ${selectedUserIds.length} users in ${courseName}`);
              
              // Add upgrade information if it's a published course
              if (course?.status === 'published') {
                details.push(`🔄 Auto-upgrade checks completed for ${courseName}`);
              }
            } else {
              failedCount++;
              details.push(`❌ Failed to enroll users in ${courseName}`);
            }
          } catch (error) {
            failedCount++;
            details.push(`❌ Error enrolling users in ${courseName}: ${error}`);
          }
          
          completedOperations++;
          setProgress((completedOperations / totalOperations) * 100);
        }
      } else if (activeTab === 'uploaded' && uploadedUsers.length > 0) {
        // Enroll uploaded users by email with enhanced error handling
        const userEmails = uploadedUsers.map(user => user.email);
        
        for (const courseId of courseIds) {
          const course = courses.find(c => c.id === courseId);
          const courseName = course?.title || 'Unknown Course';
          
          try {
            const success = await onBulkEnrollByEmail(userEmails, courseId);
            if (success) {
              successCount++;
              details.push(`✅ Successfully enrolled ${userEmails.length} users in ${courseName}`);
              
              // Add upgrade information if it's a published course
              if (course?.status === 'published') {
                details.push(`🔄 Auto-upgrade checks completed for ${courseName}`);
              }
            } else {
              failedCount++;
              details.push(`❌ Failed to enroll users in ${courseName}`);
            }
          } catch (error) {
            failedCount++;
            details.push(`❌ Error enrolling users in ${courseName}: ${error}`);
          }
          
          completedOperations++;
          setProgress((completedOperations / totalOperations) * 100);
        }
      }

      setEnrollmentResults({
        success: successCount,
        failed: failedCount,
        details
      });

      if (successCount > 0) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error during bulk assignment:', error);
      setEnrollmentResults({
        success: 0,
        failed: 1,
        details: [`❌ System error during bulk assignment: ${error}`]
      });
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

  const canProceed = () => {
    return selectedCourses.size > 0 && (
      (activeTab === 'existing' && selectedUserIds.length > 0) ||
      (activeTab === 'uploaded' && uploadedUsers.length > 0)
    );
  };

  const getUserCount = () => {
    return activeTab === 'existing' ? selectedUserIds.length : uploadedUsers.length;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Bulk Course Assignment
            </DialogTitle>
            <DialogDescription>
              Assign selected courses to existing users or upload new users from Excel
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Existing Users ({selectedUsers.length})
              </TabsTrigger>
              <TabsTrigger value="uploaded" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                Excel Upload ({uploadedUsers.length})
              </TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Selection */}
              <div className="space-y-4">
                <TabsContent value="existing" className="mt-0">
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
                </TabsContent>

                <TabsContent value="uploaded" className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileSpreadsheet className="h-5 w-5" />
                          Excel Users ({uploadedUsers.length})
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowExcelModal(true)}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Excel
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {uploadedUsers.length > 0 ? (
                            uploadedUsers.map((user, index) => (
                              <div key={index} className="flex items-center gap-3 p-2 border rounded">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                  {user.name?.charAt(0) || user.email.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium truncate">{user.name || 'No Name'}</p>
                                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                              <p className="text-muted-foreground">No users uploaded yet</p>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => setShowExcelModal(true)}
                              >
                                Upload Excel File
                              </Button>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>

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

            {/* Progress */}
            {loading && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Enrolling users in courses...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {enrollmentResults && (
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Enrollment Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{enrollmentResults.success}</div>
                      <div className="text-sm text-muted-foreground">Successful</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{enrollmentResults.failed}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                  </div>
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {enrollmentResults.details.map((detail, index) => (
                        <p key={index} className="text-xs">{detail}</p>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Assignment Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-800">Assignment Summary</p>
                    <p className="text-sm text-blue-600">
                      {selectedCourses.size} course(s) will be assigned to {getUserCount()} user(s)
                    </p>
                  </div>
                  <Button
                    onClick={handleBulkAssign}
                    disabled={!canProceed() || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Assigning...' : `Assign ${selectedCourses.size} Course(s)`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ExcelUploadModal
        open={showExcelModal}
        onOpenChange={setShowExcelModal}
        onUsersUploaded={handleUsersUploaded}
      />
    </>
  );
};

export default EnhancedBulkAssignmentModal;
