import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Clock, 
  DollarSign, 
  User, 
  Tag, 
  FileText, 
  Eye, 
  Archive, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  Plus,
  X,
  Crown
} from 'lucide-react';
import { Course } from '@/services/academy-service';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';

interface CourseCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCourse: (courseData: any) => void;
  editingCourse?: Course | null;
}

const CourseCreationWizard: React.FC<CourseCreationWizardProps> = ({
  open,
  onOpenChange,
  onCreateCourse,
  editingCourse
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: 0,
    price: 0,
    status: 'draft' as 'draft' | 'published' | 'trial' | 'archived' | 'flagship',
    category: 'trading',
    thumbnail_url: '',
    intro_video_url: '',
    tags: [] as string[],
    prerequisites: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');

  useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || '',
        description: editingCourse.description || '',
        instructor: editingCourse.instructor || '',
        difficulty_level: (editingCourse.difficulty_level as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
        duration: editingCourse.duration || 0,
        price: editingCourse.price || 0,
        status: editingCourse.status,
        category: editingCourse.category || 'trading',
        thumbnail_url: editingCourse.thumbnail_url || '',
        intro_video_url: editingCourse.intro_video_url || '',
        tags: editingCourse.tags || [],
        prerequisites: editingCourse.prerequisites || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        instructor: '',
        difficulty_level: 'beginner',
        duration: 0,
        price: 0,
        status: 'draft',
        category: 'trading',
        thumbnail_url: '',
        intro_video_url: '',
        tags: [],
        prerequisites: []
      });
    }
    setCurrentStep(0);
  }, [editingCourse, open]);

  const statusOptions = [
    {
      value: 'draft',
      label: 'Draft',
      icon: FileText,
      description: 'Course is being developed and not visible to students',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    },
    {
      value: 'published',
      label: 'Published',
      icon: CheckCircle,
      description: 'Course is live and available to enrolled students',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      value: 'trial',
      label: 'Trial',
      icon: Sparkles,
      description: 'Course is available as a preview for academy students',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      value: 'flagship',
      label: 'Flagship',
      icon: Crown,
      description: 'Premium course with exclusive content and features',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      value: 'archived',
      label: 'Archived',
      icon: Archive,
      description: 'Course is no longer active but preserved for reference',
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'No prior experience required' },
    { value: 'intermediate', label: 'Intermediate', description: 'Some experience recommended' },
    { value: 'advanced', label: 'Advanced', description: 'Significant experience required' }
  ];

  const categoryOptions = [
    { value: 'trading', label: 'Trading Fundamentals' },
    { value: 'technical', label: 'Technical Analysis' },
    { value: 'options', label: 'Options Trading' },
    { value: 'crypto', label: 'Cryptocurrency' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      handleInputChange('prerequisites', [...formData.prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite('');
    }
  };

  const removePrerequisite = (prereqToRemove: string) => {
    handleInputChange('prerequisites', formData.prerequisites.filter(prereq => prereq !== prereqToRemove));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.title.trim() !== '' && formData.description.trim() !== '';
      case 1:
        return formData.instructor.trim() !== '' && formData.duration > 0;
      case 2:
        return true; // Optional fields
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error('Please fill in all required fields before proceeding');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please complete all required fields');
      return;
    }

    onCreateCourse(formData);
  };

  const selectedStatus = statusOptions.find(option => option.value === formData.status);

  const steps = [
    {
      title: 'Basic Information',
      description: 'Course title, description, and overview'
    },
    {
      title: 'Course Details',
      description: 'Instructor, duration, pricing, and settings'
    },
    {
      title: 'Media & Metadata',
      description: 'Thumbnails, videos, tags, and prerequisites'
    },
    {
      title: 'Review & Publish',
      description: 'Final review and publication settings'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${index < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
        </div>

        {/* Step Content */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                placeholder="Enter course title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Course Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what students will learn in this course..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={formData.difficulty_level} onValueChange={(value) => handleInputChange('difficulty_level', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor Name *</Label>
              <Input
                id="instructor"
                placeholder="Enter instructor name..."
                value={formData.instructor}
                onChange={(e) => handleInputChange('instructor', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="120"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Course Status</Label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = formData.status === option.value;
                  
                  return (
                    <Card 
                      key={option.value}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-blue-500 border-blue-200' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('status', option.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${option.color}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold">{option.label}</h4>
                              {isSelected && <CheckCircle className="h-4 w-4 text-blue-600" />}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <ImageUpload
              value={formData.thumbnail_url}
              onChange={(url) => handleInputChange('thumbnail_url', url)}
              label="Course Thumbnail"
            />

            <div className="space-y-2">
              <Label htmlFor="intro_video_url">Intro Video URL</Label>
              <Input
                id="intro_video_url"
                placeholder="https://youtube.com/watch?v=..."
                value={formData.intro_video_url}
                onChange={(e) => handleInputChange('intro_video_url', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-2 py-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prerequisites</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Add a prerequisite..."
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                />
                <Button type="button" onClick={addPrerequisite} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prereq) => (
                  <Badge key={prereq} variant="outline" className="px-2 py-1">
                    {prereq}
                    <button
                      onClick={() => removePrerequisite(prereq)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Summary</CardTitle>
                <CardDescription>Review your course details before publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Title</Label>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Instructor</Label>
                    <p className="font-medium">{formData.instructor}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Duration</Label>
                    <p className="font-medium">{formData.duration} minutes</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Price</Label>
                    <p className="font-medium">₹{formData.price}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status</Label>
                    <div className="flex items-center gap-2">
                      {selectedStatus && (
                        <>
                          <selectedStatus.icon className="h-4 w-4" />
                          <span className="font-medium">{selectedStatus.label}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Category</Label>
                    <p className="font-medium capitalize">{formData.category}</p>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <p className="text-sm">{formData.description}</p>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Tags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.thumbnail_url && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Thumbnail</Label>
                    <img
                      src={formData.thumbnail_url}
                      alt="Course thumbnail"
                      className="w-32 h-20 object-cover rounded-lg border mt-1"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit}>
                {editingCourse ? 'Update Course' : 'Create Course'}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCreationWizard;
