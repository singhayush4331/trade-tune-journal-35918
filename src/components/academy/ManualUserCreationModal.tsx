
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  UserPlus, 
  Mail, 
  User, 
  Phone, 
  GraduationCap,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Course {
  id: string;
  title: string;
  status: string;
}

interface ManualUserCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  onSuccess: () => void;
}

interface BatchResult {
  email: string;
  status: 'created' | 'already_exists_enrolled' | 'already_exists_now_enrolled' | 'failed';
  message: string;
  userId?: string;
}

const ManualUserCreationModal: React.FC<ManualUserCreationModalProps> = ({
  open,
  onOpenChange,
  courses,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: ''
  });
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleCreateUser = async () => {
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!formData.courseId) {
      toast.error('Please select a course');
      return;
    }

    const course = courses.find(c => c.id === formData.courseId);
    if (!course) {
      toast.error('Selected course not found');
      return;
    }

    setCreating(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('create-batch-users', {
        body: {
          users: [{
            name: formData.name || undefined,
            email: formData.email,
            phone: formData.phone || undefined
          }],
          courseId: formData.courseId,
          courseName: course.title
        }
      });

      if (error) {
        console.error('Error creating user:', error);
        toast.error(`Failed to create user: ${error.message}`);
        return;
      }

      const userResult = data.results?.[0] as BatchResult;
      setResult(userResult);

      if (userResult) {
        switch (userResult.status) {
          case 'created':
            toast.success('New user account created successfully! Welcome email sent.');
            break;
          case 'already_exists_now_enrolled':
            toast.success('Existing user enrolled in the course successfully!');
            break;
          case 'already_exists_enrolled':
            toast.info('User is already enrolled in this course.');
            break;
          case 'failed':
            toast.error(`Failed to create user: ${userResult.message}`);
            break;
        }
      }

      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateAnother = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      courseId: formData.courseId // Keep the same course selected
    });
    setResult(null);
    setEmailError('');
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      courseId: ''
    });
    setResult(null);
    setEmailError('');
    onOpenChange(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'already_exists_now_enrolled':
        return <CheckCircle className="h-5 w-5 text-blue-600" />;
      case 'already_exists_enrolled':
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <User className="h-5 w-5 text-gray-600" />;
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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'created':
        return 'New account created & enrolled';
      case 'already_exists_now_enrolled':
        return 'Existing user enrolled in course';
      case 'already_exists_enrolled':
        return 'User already enrolled in course';
      case 'failed':
        return 'Failed to process user';
      default:
        return 'Unknown status';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Manual User Creation
          </DialogTitle>
          <DialogDescription>
            Create a single user account manually and enroll them in a course
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name (Optional)
                </Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email (Required) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={creating}
                  className={emailError ? 'border-red-300 focus:border-red-500' : ''}
                />
                {emailError && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone (Optional)
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={creating}
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Course Selection <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.courseId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, courseId: value }))}
                  disabled={creating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course..." />
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

          {/* Result Display */}
          {result && (
            <Card className={`border-2 ${getStatusColor(result.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <p className="font-medium">{formData.email}</p>
                    <p className="text-sm opacity-75">
                      {getStatusMessage(result.status)}
                    </p>
                    {result.message && (
                      <p className="text-xs opacity-60 mt-1">{result.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {result ? (
              <>
                <Button
                  onClick={handleCreateAnother}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another
                </Button>
                <Button
                  onClick={handleClose}
                  className="flex-1"
                >
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  disabled={creating}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateUser}
                  disabled={creating || !!emailError || !formData.email || !formData.courseId}
                  className="flex-1"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Create User
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualUserCreationModal;
