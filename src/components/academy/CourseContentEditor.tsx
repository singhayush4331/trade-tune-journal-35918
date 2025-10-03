import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Eye, 
  Edit, 
  Save, 
  X, 
  Plus,
  BookOpen,
  Video,
  FileText,
  HelpCircle,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Hammer,
  Info,
  Target,
  Settings,
  Sparkles,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ModuleManager from './ModuleManager';
import EnhancedCoursePreview from './EnhancedCoursePreview';
import ModernModuleCard from './ModernModuleCard';
import ModernLessonItem from './ModernLessonItem';
import QuickLessonCreator from './QuickLessonCreator';
import ReadingMaterialBuilder, { type ReadingMaterialData } from './ReadingMaterialBuilder';
import QuizBuilder from './QuizBuilder';
import AssignmentBuilder, { type AssignmentData } from './AssignmentBuilder';
import { useCourseEditor, type Module, type Lesson } from '@/hooks/use-course-editor';
import { useCourseProgress } from '@/hooks/use-course-progress';

// Type definitions for content data
interface QuizData {
  title: string;
  description: string;
  passing_score: number;
  time_limit?: number;
  questions: any[];
}

interface CourseContentEditorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: any;
}

const CourseContentEditor: React.FC<CourseContentEditorProps> = ({
  isOpen,
  onClose,
  selectedCourse
}) => {
  const [currentView, setCurrentView] = useState<'builder' | 'preview'>('builder');
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [showQuickCreator, setShowQuickCreator] = useState<Record<string, boolean>>({});
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  
  const {
    modules,
    loading,
    selectedLesson,
    setSelectedLesson,
    createModule,
    updateModule,
    deleteModule,
    updateLesson,
    deleteLesson,
    createLesson
  } = useCourseEditor(selectedCourse?.id);

  // Get all lessons for progress tracking
  const allLessons = modules.flatMap(module => module.lessons);
  
  // Use course progress hook for real progress data
  const {
    progress,
    loading: progressLoading,
    markLessonProgress,
    getLessonProgress,
    isLessonCompleted
  } = useCourseProgress(selectedCourse?.id, allLessons);

  // Create completed lessons set from progress data
  const completedLessons = new Set(
    Object.keys(progress.lessonProgress).filter(lessonId => 
      isLessonCompleted(lessonId)
    )
  );
  
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    video_url: '',
    content: '',
    duration: 0,
    lesson_type: 'video' as 'video' | 'reading' | 'quiz' | 'assignment',
    is_free: false
  });

  const [quizData, setQuizData] = useState<QuizData>({
    title: '',
    description: '',
    passing_score: 70,
    time_limit: undefined,
    questions: []
  });

  const [readingMaterialData, setReadingMaterialData] = useState<ReadingMaterialData>({
    title: '',
    content: '',
    structure: {
      headings: [],
      sections: []
    },
    media: [],
    settings: {
      difficulty: 'beginner',
      estimatedReadTime: 0,
      enableComments: true,
      downloadable: false
    },
    metadata: {
      wordCount: 0,
      characterCount: 0,
      lastModified: new Date()
    }
  });

  const [assignmentData, setAssignmentData] = useState<AssignmentData>({
    title: '',
    instructions: '',
    learningObjectives: [],
    rubric: {
      criteria: [],
      totalPoints: 0
    },
    submission: {
      allowedFormats: ['PDF', 'DOC'],
      maxFileSize: 10,
      maxFiles: 1,
      submissionType: 'individual',
      allowLateSubmission: false,
      latePenalty: 0
    },
    resources: [],
    settings: {
      estimatedTime: 2,
      difficulty: 'beginner',
      autoGrading: false,
      peerReview: false,
      showRubricToStudents: true
    }
  });

  if (!isOpen) return null;

  // Fixed handler functions
  const handleEditModule = (module: Module) => {
    setEditingModule(module);
  };

  const handleDeleteModule = async (moduleId: string) => {
    const success = await deleteModule(moduleId);
    if (success) {
      toast.success('Module deleted successfully');
      // Clear any related state
      if (editingLesson && modules.find(m => m.id === moduleId)?.lessons.find(l => l.id === editingLesson.id)) {
        setEditingLesson(null);
        setSelectedLesson(null);
        resetForm();
      }
    }
  };

  const handleAddLessonToModule = (moduleId: string) => {
    // Expand the module and show quick creator
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
    setShowQuickCreator(prev => ({ ...prev, [moduleId]: true }));
  };

  const handleCloseQuickCreator = (moduleId: string) => {
    setShowQuickCreator(prev => ({ ...prev, [moduleId]: false }));
  };

  const handlePreviewLesson = (lesson: Lesson) => {
    // Set the lesson for preview
    setSelectedLesson(lesson);
    setCurrentView('preview');
  };

  // Helper function to validate lesson content based on type
  const validateLessonContent = () => {
    if (!lessonForm.title.trim()) {
      toast.error('Please enter a lesson title');
      return false;
    }

    if (!lessonForm.description.trim()) {
      toast.error('Please enter a lesson description');
      return false;
    }

    switch (lessonForm.lesson_type) {
      case 'video':
        if (!lessonForm.video_url.trim()) {
          toast.error('Please enter a video URL for video lessons');
          return false;
        }
        break;
      
      case 'quiz':
        if (!quizData.questions || quizData.questions.length === 0) {
          toast.error('Please add at least one question to save this quiz lesson');
          return false;
        }
        break;
      
      case 'reading':
        if (!readingMaterialData.content.trim()) {
          toast.error('Please add reading content to save this lesson');
          return false;
        }
        break;
      
      case 'assignment':
        if (!assignmentData.instructions.trim()) {
          toast.error('Please add assignment instructions to save this lesson');
          return false;
        }
        if (!assignmentData.learningObjectives || assignmentData.learningObjectives.length === 0) {
          toast.error('Please add at least one learning objective to save this assignment');
          return false;
        }
        break;
    }

    return true;
  };

  // Helper function to calculate module progress from real progress data
  const calculateModuleProgress = (moduleId: string, lessons: Lesson[]) => {
    if (lessons.length === 0) return 0;
    const completedCount = lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
    return (completedCount / lessons.length) * 100;
  };

  // Helper function to calculate module duration from lessons
  const calculateModuleDuration = (lessons: Lesson[]) => {
    return lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedLesson(lesson);
    
    setLessonForm({
      title: lesson.title,
      description: lesson.description,
      video_url: lesson.video_url,
      content: lesson.content,
      duration: lesson.duration,
      lesson_type: lesson.lesson_type,
      is_free: lesson.is_free || false
    });

    if (lesson.lesson_type === 'quiz' && lesson.content_data) {
      setQuizData({
        title: lesson.title,
        description: lesson.description,
        passing_score: lesson.content_data.passing_score || 70,
        time_limit: lesson.content_data.time_limit,
        questions: lesson.content_data.questions || []
      });
    } else if (lesson.lesson_type === 'reading' && lesson.content_data) {
      setReadingMaterialData({
        title: lesson.title,
        content: lesson.content,
        structure: lesson.content_data.structure || { headings: [], sections: [] },
        media: lesson.content_data.media || [],
        settings: lesson.content_data.settings || {
          difficulty: 'beginner',
          estimatedReadTime: 0,
          enableComments: true,
          downloadable: false
        },
        metadata: lesson.content_data.metadata || {
          wordCount: 0,
          characterCount: 0,
          lastModified: new Date()
        }
      });
    } else if (lesson.lesson_type === 'assignment' && lesson.content_data) {
      setAssignmentData({
        title: lesson.title,
        instructions: lesson.description,
        learningObjectives: lesson.content_data.learningObjectives || [],
        rubric: lesson.content_data.rubric || { criteria: [], totalPoints: 0 },
        submission: lesson.content_data.submission || {
          allowedFormats: ['PDF', 'DOC'],
          maxFileSize: 10,
          maxFiles: 1,
          submissionType: 'individual',
          allowLateSubmission: false,
          latePenalty: 0
        },
        resources: lesson.content_data.resources || [],
        settings: lesson.content_data.settings || {
          estimatedTime: 2,
          difficulty: 'beginner',
          autoGrading: false,
          peerReview: false,
          showRubricToStudents: true
        }
      });
    }

    setIsDirty(false);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    const success = await deleteLesson(lessonId);
    if (success && editingLesson?.id === lessonId) {
      setEditingLesson(null);
      setSelectedLesson(null);
      resetForm();
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson) {
      toast.error('No lesson selected for editing');
      return;
    }

    if (!validateLessonContent()) {
      return;
    }

    let contentData = {};
    
    if (lessonForm.lesson_type === 'quiz') {
      contentData = {
        passing_score: quizData.passing_score,
        time_limit: quizData.time_limit,
        questions: quizData.questions
      };
    } else if (lessonForm.lesson_type === 'reading') {
      contentData = {
        structure: readingMaterialData.structure,
        media: readingMaterialData.media,
        settings: readingMaterialData.settings,
        metadata: readingMaterialData.metadata
      };
    } else if (lessonForm.lesson_type === 'assignment') {
      contentData = {
        learningObjectives: assignmentData.learningObjectives,
        rubric: assignmentData.rubric,
        submission: assignmentData.submission,
        resources: assignmentData.resources,
        settings: assignmentData.settings
      };
    }

    const updates: Partial<Lesson> = {
      title: lessonForm.title,
      description: lessonForm.description,
      video_url: lessonForm.video_url,
      content: lessonForm.content,
      duration: lessonForm.duration,
      lesson_type: lessonForm.lesson_type,
      content_data: contentData
    };

    const success = await updateLesson(editingLesson.id, updates);
    if (success) {
      setIsDirty(false);
    }
  };

  const resetForm = () => {
    setLessonForm({
      title: '',
      description: '',
      video_url: '',
      content: '',
      duration: 0,
      lesson_type: 'video',
      is_free: false
    });
    setQuizData({
      title: '',
      description: '',
      passing_score: 70,
      time_limit: undefined,
      questions: []
    });
  };

  const handleLessonCreated = (lesson: Lesson) => {
    handleEditLesson(lesson);
    // Hide the quick creator after lesson is created
    setShowQuickCreator(prev => ({ ...prev, [lesson.module_id]: false }));
  };

  const handleLessonTypeSelect = (type: 'video' | 'reading' | 'quiz' | 'assignment') => {
    setLessonForm(prev => ({ ...prev, lesson_type: type }));
    setIsDirty(true);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const updateLessonForm = (field: string, value: any) => {
    setLessonForm(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  // Mock function to toggle lesson completion (for testing purposes)
  const handleToggleLessonCompletion = async (lessonId: string) => {
    const currentProgress = getLessonProgress(lessonId);
    const newCompletionPercentage = currentProgress && currentProgress.completion_percentage >= 90 ? 0 : 100;
    
    await markLessonProgress(lessonId, newCompletionPercentage, 0);
    toast.success(`Lesson marked as ${newCompletionPercentage >= 90 ? 'completed' : 'incomplete'}`);
  };

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'reading': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      case 'assignment': return <BookOpen className="h-4 w-4" />;
      default: return null;
    }
  };

  const getLessonTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'reading': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'quiz': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'assignment': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const lessonTypes = [
    { 
      id: 'video', 
      name: 'Video Lesson', 
      description: 'Upload or embed video content with interactive elements',
      icon: Video,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    { 
      id: 'reading', 
      name: 'Reading Material', 
      description: 'Rich text content with formatting and media',
      icon: FileText,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    { 
      id: 'quiz', 
      name: 'Interactive Quiz', 
      description: 'Engage learners with questions and instant feedback',
      icon: HelpCircle,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    { 
      id: 'assignment', 
      name: 'Practical Assignment', 
      description: 'Hands-on exercises and real-world applications',
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800'
    }
  ];

  const getFormCompletionStatus = () => {
    const requiredFields = ['title', 'description', 'lesson_type'];
    const completedFields = requiredFields.filter(field => lessonForm[field]);
    return {
      completed: completedFields.length,
      total: requiredFields.length,
      percentage: Math.round((completedFields.length / requiredFields.length) * 100)
    };
  };

  const formStatus = getFormCompletionStatus();

  // Function to check if lesson is complete based on type
  const isLessonComplete = () => {
    if (!lessonForm.title.trim() || !lessonForm.description.trim()) return false;
    
    switch (lessonForm.lesson_type) {
      case 'video':
        return lessonForm.video_url.trim() !== '';
      case 'quiz':
        return quizData.questions && quizData.questions.length > 0;
      case 'reading':
        return readingMaterialData.content.trim() !== '';
      case 'assignment':
        return assignmentData.instructions.trim() !== '' && 
               assignmentData.learningObjectives && 
               assignmentData.learningObjectives.length > 0;
      default:
        return true;
    }
  };

  if (currentView === 'preview') {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-background rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col border"
        >
          <div className="h-16 border-b bg-gradient-to-r from-background to-muted/30 flex items-center justify-between px-6 flex-shrink-0 rounded-t-xl">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedCourse?.title || 'Course Preview'}
                  </h2>
                  <p className="text-sm text-muted-foreground">Student Experience</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView('builder')}
                  className="hover:bg-background"
                >
                  <Hammer className="h-4 w-4 mr-2" />
                  Builder
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-primary text-primary-foreground"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
              <Button variant="default" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save Course
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            <EnhancedCoursePreview
              modules={modules}
              course={selectedCourse}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-background rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex border overflow-hidden"
      >
        {/* MODERN SIDEBAR */}
        <div className="w-80 border-r bg-background flex flex-col">
          {/* Enhanced Header - Fixed height */}
          <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-background to-muted/30">
            <div className="flex items-center gap-3 mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-muted rounded-lg"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-foreground">Course Builder</h2>
                <p className="text-sm text-muted-foreground truncate">{selectedCourse?.title}</p>
              </div>
            </div>

            {/* Progress Overview */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Course Progress</span>
                  <span className="text-sm font-medium text-primary">
                    {progress.completedLessons}/{progress.totalLessons}
                  </span>
                </div>
                <Progress 
                  value={progress.overallProgress} 
                  className="mb-2 h-2 bg-primary/20" 
                />
                <p className="text-xs text-muted-foreground">
                  {Math.round(progress.overallProgress)}% complete
                </p>
              </CardContent>
            </Card>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentView('preview')}
                className="flex-1 h-9"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button 
                variant={isDirty && isLessonComplete() ? "default" : "outline"}
                size="sm"
                className="flex-1 h-9"
                onClick={handleSaveLesson}
                disabled={!editingLesson || !isLessonComplete()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>

            {editingLesson && !isLessonComplete() && (
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Lesson incomplete</span>
                </div>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  {lessonForm.lesson_type === 'quiz' && 'Add questions to save this quiz lesson'}
                  {lessonForm.lesson_type === 'video' && 'Add a video URL to save this lesson'}
                  {lessonForm.lesson_type === 'reading' && 'Add reading content to save this lesson'}
                  {lessonForm.lesson_type === 'assignment' && 'Add instructions and objectives to save this assignment'}
                </p>
              </div>
            )}
          </div>

          {/* Course Structure - Scrollable content */}
          <div className="flex flex-col flex-1 min-h-0">
            <div className="flex-shrink-0 px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Course Structure</h3>
                    <p className="text-xs text-muted-foreground">
                      {progress.totalLessons} lessons across {modules.length} modules
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <ModuleManager
                  modules={modules}
                  onCreateModule={createModule}
                  onUpdateModule={updateModule}
                  onDeleteModule={deleteModule}
                  editingModule={editingModule}
                  onEditingModuleChange={setEditingModule}
                />
              </div>
            </div>

            {/* Scrollable modules area */}
            <div className="flex-1 px-6 pb-6 min-h-0">
              <ScrollArea className="h-full">
                {loading || progressLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Loading modules...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pr-4">
                    {modules.map((module, moduleIndex) => {
                      const moduleProgress = calculateModuleProgress(module.id, module.lessons);
                      
                      return (
                        <ModernModuleCard
                          key={module.id}
                          module={{
                            ...module,
                            progress: moduleProgress
                          } as Module & { progress: number }}
                          moduleIndex={moduleIndex}
                          isExpanded={expandedModules[module.id] || false}
                          completedLessons={completedLessons}
                          onToggleExpand={() => toggleModule(module.id)}
                          onEditModule={() => handleEditModule(module)}
                          onDeleteModule={() => handleDeleteModule(module.id)}
                          onAddLesson={() => handleAddLessonToModule(module.id)}
                        >
                          {/* Quick Lesson Creator */}
                          <AnimatePresence>
                            {showQuickCreator[module.id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="border-b border-border/30 p-4 bg-muted/20"
                              >
                                <QuickLessonCreator
                                  moduleId={module.id}
                                  onCreateLesson={createLesson}
                                  onLessonCreated={handleLessonCreated}
                                  onClose={() => handleCloseQuickCreator(module.id)}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Modern Lesson Items */}
                          {module.lessons.map((lesson, lessonIndex) => (
                            <ModernLessonItem
                              key={lesson.id}
                              lesson={lesson}
                              lessonIndex={lessonIndex}
                              isCurrentLesson={editingLesson?.id === lesson.id}
                              isCompleted={completedLessons.has(lesson.id)}
                              onClick={() => handleEditLesson(lesson)}
                              onEdit={() => handleEditLesson(lesson)}
                              onDelete={() => handleDeleteLesson(lesson.id)}
                              onPreview={() => handlePreviewLesson(lesson)}
                              onToggleComplete={() => handleToggleLessonCompletion(lesson.id)}
                            />
                          ))}
                        </ModernModuleCard>
                      );
                    })}

                    {modules.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold mb-2">No modules created yet</h3>
                        <p className="text-sm text-muted-foreground mb-4">Start building your course by creating your first module</p>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b bg-background p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">
                    {editingLesson ? `Edit: ${editingLesson.title}` : 'Create Amazing Content'}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {editingLesson ? 'Modify your lesson content' : 'Design engaging lessons that inspire learning'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Progress:</div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${formStatus.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{formStatus.percentage}%</span>
                  </div>
                </div>
                
                <div className="flex bg-muted rounded-lg p-1">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary text-primary-foreground h-8"
                  >
                    <Hammer className="h-4 w-4 mr-2" />
                    Builder
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentView('preview')}
                    className="hover:bg-background h-8"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
                <Button 
                  variant="default" 
                  size="sm"
                  className="h-8"
                  onClick={handleSaveLesson}
                  disabled={!editingLesson || !isDirty || !isLessonComplete()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Lesson
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {!editingLesson ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Edit className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a Lesson to Edit</h3>
                <p className="text-muted-foreground mb-6">Choose a lesson from the sidebar to start editing, or create a new one.</p>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                  <TabsTrigger value="basic" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="type" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Content Type
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Info className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle>Lesson Foundation</CardTitle>
                          <CardDescription>Set up the essential details for your lesson</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              Lesson Title
                              <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={lessonForm.title}
                              onChange={(e) => updateLessonForm('title', e.target.value)}
                              placeholder="Enter an engaging lesson title..."
                              className="h-12 text-lg border-2 focus:border-primary transition-colors"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              Description
                              <span className="text-destructive">*</span>
                            </label>
                            <Textarea
                              value={lessonForm.description}
                              onChange={(e) => updateLessonForm('description', e.target.value)}
                              placeholder="Describe what students will learn and achieve..."
                              rows={4}
                              className="border-2 focus:border-primary transition-colors resize-none"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Duration (minutes)</label>
                            <div className="relative">
                              <Input
                                type="number"
                                value={lessonForm.duration}
                                onChange={(e) => updateLessonForm('duration', parseInt(e.target.value) || 0)}
                                placeholder="15"
                                className="h-12 border-2 focus:border-primary transition-colors"
                              />
                              <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <Card className="bg-muted/50 border-0">
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Estimated read time:</span>
                                  <span className="font-medium">
                                    {Math.max(1, Math.ceil(lessonForm.content.length / 200))} min
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Content length:</span>
                                  <span className="font-medium">{lessonForm.content.length} chars</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="type" className="space-y-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                          <Target className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle>Choose Your Content Format</CardTitle>
                          <CardDescription>Select the best format to deliver your lesson content</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {lessonTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = lessonForm.lesson_type === type.id;
                          
                          return (
                            <Card 
                              key={type.id}
                              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                                isSelected 
                                  ? `border-2 border-primary shadow-lg ${type.bgColor} ring-2 ring-primary/20` 
                                  : `border-2 ${type.borderColor} hover:border-primary/50 ${type.bgColor}`
                              }`}
                              onClick={() => handleLessonTypeSelect(type.id as 'video' | 'reading' | 'quiz' | 'assignment')}
                            >
                              <CardContent className="p-6">
                                <div className="flex flex-col items-center text-center space-y-4">
                                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${type.color} shadow-lg`}>
                                    <Icon className="h-8 w-8 text-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <h4 className="font-semibold text-lg">{type.name}</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{type.description}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="flex items-center gap-2 text-primary font-medium">
                                      <CheckCircle className="h-4 w-4" />
                                      <span className="text-sm">Selected</span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="content" className="space-y-6">
                  {lessonForm.lesson_type === 'video' && (
                    <>
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-blue-50/30 dark:to-blue-950/30">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Video className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle>Video Configuration</CardTitle>
                              <CardDescription>Add your video content and settings</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              Video URL
                              <span className="text-destructive">*</span>
                            </label>
                            <Input
                              value={lessonForm.video_url}
                              onChange={(e) => updateLessonForm('video_url', e.target.value)}
                              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                              className="h-12 border-2 focus:border-primary transition-colors"
                            />
                            <p className="text-xs text-muted-foreground">
                              Supports YouTube, Vimeo, and direct video links
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle>Additional Notes</CardTitle>
                              <CardDescription>Optional supporting content for your video lesson</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Textarea
                              value={lessonForm.content}
                              onChange={(e) => updateLessonForm('content', e.target.value)}
                              placeholder="Add supplementary notes, key points, or resources that complement your video..."
                              rows={8}
                              className="border-2 focus:border-primary transition-colors resize-none"
                            />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Supporting materials and notes</span>
                              <span>{lessonForm.content.length} characters</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {lessonForm.lesson_type === 'reading' && (
                    <div className="animate-fade-in">
                      <ReadingMaterialBuilder
                        data={readingMaterialData}
                        onChange={setReadingMaterialData}
                      />
                    </div>
                  )}

                  {lessonForm.lesson_type === 'quiz' && (
                    <div className="animate-fade-in">
                      <QuizBuilder
                        quizData={quizData}
                        onQuizDataChange={setQuizData}
                      />
                    </div>
                  )}

                  {lessonForm.lesson_type === 'assignment' && (
                    <div className="animate-fade-in">
                      <AssignmentBuilder
                        data={assignmentData}
                        onChange={setAssignmentData}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/30">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Settings className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle>Lesson Settings</CardTitle>
                          <CardDescription>Configure access and completion settings</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <Card className="bg-muted/50 border-0">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold">Free Preview</h4>
                                <p className="text-sm text-muted-foreground">
                                  Allow users to access this lesson without enrollment
                                </p>
                              </div>
                            </div>
                            <Switch
                              checked={lessonForm.is_free}
                              onCheckedChange={(checked) => updateLessonForm('is_free', checked)}
                            />
                          </div>
                        </CardContent>
                      </Card>

                      {lessonForm.is_free && (
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">This lesson will be available as a free preview</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseContentEditor;
