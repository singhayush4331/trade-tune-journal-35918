import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Mail,
  User,
  Download,
  UserPlus,
  GraduationCap,
  UserCheck,
  UserX
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ParsedUser {
  name?: string;
  email: string;
  phone?: string;
  isValid: boolean;
  error?: string;
}

interface Course {
  id: string;
  title: string;
  status: string;
}

interface BatchResult {
  email: string;
  status: 'created' | 'already_exists_enrolled' | 'already_exists_now_enrolled' | 'failed';
  message: string;
  userId?: string;
}

interface ExcelUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersUploaded: (users: ParsedUser[]) => void;
  courses?: Course[];
  selectedCourse?: Course | null;
}

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  open,
  onOpenChange,
  onUsersUploaded,
  courses = [],
  selectedCourse
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedUsers, setParsedUsers] = useState<ParsedUser[]>([]);
  const [fileName, setFileName] = useState('');
  const [selectedBatchCourse, setSelectedBatchCourse] = useState<string>(selectedCourse?.id || '');
  const [creatingBatch, setCreatingBatch] = useState(false);
  const [batchResults, setBatchResults] = useState<any>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const parseExcelFile = async (file: File): Promise<ParsedUser[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Skip header row and process data
          const rows = jsonData.slice(1) as any[][];
          const users: ParsedUser[] = [];

          rows.forEach((row, index) => {
            if (row.length === 0 || !row.some(cell => cell)) return; // Skip empty rows

            // Updated column order: Name, Email, Phone (to match Razorpay format)
            const name = String(row[0] || '').trim();
            const email = String(row[1] || '').trim();
            const phone = String(row[2] || '').trim();

            if (!email) {
              users.push({
                email: `Row ${index + 2}`,
                name: name || undefined,
                phone: phone || undefined,
                isValid: false,
                error: 'Email is required'
              });
              return;
            }

            if (!validateEmail(email)) {
              users.push({
                email,
                name: name || undefined,
                phone: phone || undefined,
                isValid: false,
                error: 'Invalid email format'
              });
              return;
            }

            users.push({
              email,
              name: name || undefined,
              phone: phone || undefined,
              isValid: true
            });
          });

          resolve(users);
        } catch (error) {
          console.error('Error parsing Excel file:', error);
          reject(new Error('Failed to parse Excel file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFile(files[0]);
    }
  }, []);

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    setLoading(true);
    setFileName(file.name);

    try {
      const users = await parseExcelFile(file);
      setParsedUsers(users);
      setBatchResults(null);
      toast.success(`Parsed ${users.length} rows from Excel file`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process Excel file');
      setParsedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const getValidUsers = () => parsedUsers.filter(user => user.isValid);
  const getInvalidUsers = () => parsedUsers.filter(user => !user.isValid);

  const handleCreateBatchUsers = async () => {
    const validUsers = getValidUsers();
    if (validUsers.length === 0) {
      toast.error('No valid users found. Please fix the errors and try again.');
      return;
    }

    if (!selectedBatchCourse) {
      toast.error('Please select a course for the batch users.');
      return;
    }

    const course = courses.find(c => c.id === selectedBatchCourse);
    if (!course) {
      toast.error('Selected course not found.');
      return;
    }

    setCreatingBatch(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-batch-users', {
        body: {
          users: validUsers,
          courseId: selectedBatchCourse,
          courseName: course.title
        }
      });

      if (error) {
        console.error('Error creating batch users:', error);
        toast.error(`Failed to create batch users: ${error.message}`);
        return;
      }

      setBatchResults(data);
      
      const summary = data.results || [];
      const created = summary.filter((r: BatchResult) => r.status === 'created').length;
      const enrolled = summary.filter((r: BatchResult) => r.status === 'already_exists_now_enrolled').length;
      const alreadyEnrolled = summary.filter((r: BatchResult) => r.status === 'already_exists_enrolled').length;
      const failed = summary.filter((r: BatchResult) => r.status === 'failed').length;

      let successMessage = '';
      if (created > 0) successMessage += `${created} new accounts created. `;
      if (enrolled > 0) successMessage += `${enrolled} existing users enrolled. `;
      if (alreadyEnrolled > 0) successMessage += `${alreadyEnrolled} users already enrolled. `;
      
      if (successMessage) {
        toast.success(successMessage + 'Welcome emails sent where applicable.');
      }
      
      if (failed > 0) {
        toast.warning(`${failed} users failed to process. Check the results below.`);
      }

    } catch (error) {
      console.error('Error creating batch users:', error);
      toast.error('Failed to create batch users. Please try again.');
    } finally {
      setCreatingBatch(false);
    }
  };

  const handleProceed = () => {
    const validUsers = getValidUsers();
    if (validUsers.length === 0) {
      toast.error('No valid users found. Please fix the errors and try again.');
      return;
    }
    onUsersUploaded(validUsers);
  };

  const downloadTemplate = () => {
    // Updated template with new column order: Name, Email, Phone
    const templateData = [
      ['Name', 'Email', 'Phone'],
      ['John Doe', 'user1@example.com', '+91 9876543210'],
      ['Jane Smith', 'user2@example.com', '+91 9876543211']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');
    
    XLSX.writeFile(workbook, 'razorpay_users_template.xlsx');
    toast.success('Razorpay-compatible template downloaded successfully!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'already_exists_now_enrolled':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'already_exists_enrolled':
        return <Users className="h-4 w-4 text-gray-600" />;
      case 'failed':
        return <UserX className="h-4 w-4 text-red-600" />;
      default:
        return <User className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'already_exists_now_enrolled':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'already_exists_enrolled':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload User Data
          </DialogTitle>
          <DialogDescription>
            Upload an Excel file with user data from Razorpay or create batch user accounts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Selection for Batch Creation */}
          {courses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Smart Batch User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Select a course to intelligently manage batch users. The system will automatically:
                    • Create new accounts for users who don't exist
                    • Enroll existing users in the selected course
                    • Skip users already enrolled in the course
                  </p>
                  <Select value={selectedBatchCourse} onValueChange={setSelectedBatchCourse}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select course for batch creation..." />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium">{course.title}</span>
                            <Badge variant={course.status === 'published' ? 'default' : 'secondary'} className="ml-2">
                              {course.status}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Template Download */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Excel Template (Razorpay Compatible)
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Your Excel file should have the following columns in order (matches Razorpay export format):
              </p>
              <div className="flex gap-2">
                <Badge variant="secondary">Name (Optional)</Badge>
                <Badge variant="outline">Email (Required)</Badge>
                <Badge variant="outline">Phone (Optional)</Badge>
              </div>
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardContent className="p-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  {loading ? 'Processing file...' : 'Drop your Excel file here'}
                </p>
                <p className="text-muted-foreground mb-4">
                  or click to browse (.xlsx, .xls, .csv) - Razorpay format supported
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="excel-upload"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileInput}
                  disabled={loading}
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('excel-upload')?.click()}
                  disabled={loading}
                >
                  Choose File
                </Button>
                {fileName && (
                  <p className="mt-2 text-sm text-blue-600">Selected: {fileName}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {parsedUsers.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Valid Users */}
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    Valid Users ({getValidUsers().length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {getValidUsers().map((user, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded">
                          <User className="h-4 w-4 text-green-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.name || 'No Name'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Invalid Users */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    Invalid Users ({getInvalidUsers().length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-2">
                      {getInvalidUsers().map((user, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 border rounded">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.name || user.email}</p>
                            <p className="text-xs text-red-600">{user.error}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Enhanced Batch Creation Results */}
          {batchResults && (
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <UserPlus className="h-5 w-5" />
                  Batch Processing Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {batchResults.results?.filter((r: BatchResult) => r.status === 'created').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">New Accounts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {batchResults.results?.filter((r: BatchResult) => r.status === 'already_exists_now_enrolled').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Newly Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {batchResults.results?.filter((r: BatchResult) => r.status === 'already_exists_enrolled').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Already Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {batchResults.results?.filter((r: BatchResult) => r.status === 'failed').length || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                </div>
                
                {batchResults.results && batchResults.results.length > 0 && (
                  <ScrollArea className="h-32">
                    <div className="space-y-1">
                      {batchResults.results.map((result: BatchResult, index: number) => (
                        <div key={index} className={`flex items-center gap-2 p-2 border rounded ${getStatusColor(result.status)}`}>
                          {getStatusIcon(result.status)}
                          <span className="font-medium text-xs">{result.email}</span>
                          <span className="text-xs opacity-75">- {result.message}</span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          )}

          {/* Action Summary */}
          {parsedUsers.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Ready for Processing</p>
                      <p className="text-sm text-blue-600">
                        {getValidUsers().length} valid users ready
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {selectedBatchCourse && (
                      <Button
                        onClick={handleCreateBatchUsers}
                        disabled={getValidUsers().length === 0 || creatingBatch}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {creatingBatch ? 'Processing...' : `Smart Process ${getValidUsers().length} Users`}
                      </Button>
                    )}
                    <Button
                      onClick={handleProceed}
                      disabled={getValidUsers().length === 0}
                      variant="outline"
                    >
                      Bulk Assign Only
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExcelUploadModal;
