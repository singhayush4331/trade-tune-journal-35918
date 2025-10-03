
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Target, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

interface CourseCreationWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseCreated?: (course: any) => void;
}

const LightThemeOptimizedCourseCreationWizard: React.FC<CourseCreationWizardProps> = ({
  open,
  onOpenChange,
  onCourseCreated
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    difficulty_level: 'beginner',
    duration: 60,
    status: 'trial',
    instructor: '',
    tags: [] as string[],
    price: 0
  });

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: BookOpen },
    { id: 'details', title: 'Course Details', icon: Target },
    { id: 'status', title: 'Course Status', icon: Trophy },
    { id: 'review', title: 'Review', icon: CheckCircle }
  ];

  const statusOptions = [
    {
      value: 'trial',
      label: 'Trial Course',
      description: 'Free preview content for all users',
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      value: 'flagship',
      label: 'Flagship Course',
      description: 'Premium paid course content',
      icon: Trophy,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-800'
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Simulate course creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Course created successfully!');
      onCourseCreated?.(courseData);
      onOpenChange(false);
      
      // Reset form
      setCourseData({
        title: '',
        description: '',
        difficulty_level: 'beginner',
        duration: 60,
        status: 'trial',
        instructor: '',
        tags: [],
        price: 0
      });
      setCurrentStep(0);
    } catch (error) {
      toast.error('Failed to create course');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-foreground">Course Title</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                placeholder="Enter course title"
                className="border-2 border-border/50 focus:border-primary/50 bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">Description</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                placeholder="Describe what students will learn"
                rows={4}
                className="border-2 border-border/50 focus:border-primary/50 bg-background"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-medium text-foreground">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={courseData.duration}
                  onChange={(e) => setCourseData({ ...courseData, duration: parseInt(e.target.value) || 0 })}
                  className="border-2 border-border/50 focus:border-primary/50 bg-background"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructor" className="text-sm font-medium text-foreground">Instructor</Label>
                <Input
                  id="instructor"
                  value={courseData.instructor}
                  onChange={(e) => setCourseData({ ...courseData, instructor: e.target.value })}
                  placeholder="Instructor name"
                  className="border-2 border-border/50 focus:border-primary/50 bg-background"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">Difficulty Level</Label>
              <div className="grid grid-cols-3 gap-3">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <Button
                    key={level}
                    type="button"
                    variant={courseData.difficulty_level === level ? 'default' : 'outline'}
                    onClick={() => setCourseData({ ...courseData, difficulty_level: level })}
                    className={`capitalize ${
                      courseData.difficulty_level === level 
                        ? 'bg-primary text-primary-foreground' 
                        : 'border-2 border-border/50 hover:border-primary/50 bg-background'
                    }`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-foreground mb-4 block">Course Status</Label>
              <div className="grid grid-cols-1 gap-4">
                {statusOptions.map((option) => (
                  <Card
                    key={option.value}
                    className={`cursor-pointer transition-all duration-200 ${
                      courseData.status === option.value 
                        ? `${option.borderColor} border-2 ${option.bgColor}` 
                        : 'border-2 border-border/30 hover:border-primary/30 bg-card'
                    }`}
                    onClick={() => setCourseData({ ...courseData, status: option.value })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${option.color} flex-shrink-0`}>
                          <option.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{option.label}</h3>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {courseData.status === option.value && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Course Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title:</span>
                  <span className="font-medium text-foreground">{courseData.title || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant={courseData.status === 'flagship' ? 'default' : 'secondary'}>
                    {courseData.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <span className="font-medium text-foreground capitalize">{courseData.difficulty_level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{courseData.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Instructor:</span>
                  <span className="font-medium text-foreground">{courseData.instructor || 'Not specified'}</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background border border-border">
        <DialogHeader className="border-b border-border/50 pb-4">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Create New Course
          </DialogTitle>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-white' 
                  : 'border-border/50 text-muted-foreground bg-background'
              }`}>
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 ml-4 transition-all ${
                  index < currentStep ? 'bg-primary' : 'bg-border/50'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[300px]"
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between border-t border-border/50 pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="border-2 border-border/50 hover:border-primary/50 bg-background"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Create Course
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LightThemeOptimizedCourseCreationWizard;
