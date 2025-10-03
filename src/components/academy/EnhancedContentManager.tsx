import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  GripVertical,
  Video,
  FileText,
  HelpCircle,
  BookOpen,
  PlayCircle
} from 'lucide-react';
import { 
  getCourseModules, 
  getModuleLessons,
  createModule,
  updateModule,
  deleteModule,
  createLesson,
  updateLesson,
  deleteLesson,
  validateContent,
  validateVideoUrl,
  type Course,
  type CourseModule,
  type Lesson 
} from '@/services/academy-service';

interface EnhancedContentManagerProps {
  selectedCourse: Course | null;
}

interface ModuleWithLessons extends CourseModule {
  lessons: Lesson[];
  isExpanded?: boolean;
}

const EnhancedContentManager: React.FC<EnhancedContentManagerProps> = ({ selectedCourse }) => {
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModuleDialog, setShowModuleDialog] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: '',
    duration: 0
  });

  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    video_url: '',
    content: '',
    duration: 0,
    lesson_type: 'video' as Lesson['lesson_type'],
    is_free: false
  });

  useEffect(() => {
    if (selectedCourse) {
      loadCourseContent();
    }
  }, [selectedCourse]);

  const loadCourseContent = async () => {
    if (!selectedCourse) return;
    
    setLoading(true);
    const moduleData = await getCourseModules(selectedCourse.id);
    
    const modulesWithLessons: ModuleWithLessons[] = await Promise.all(
      moduleData.map(async (module) => {
        const lessons = await getModuleLessons(module.id);
        return { ...module, lessons, isExpanded: false };
      })
    );
    
    setModules(modulesWithLessons);
    setLoading(false);
  };

  const resetModuleForm = () => {
    setModuleForm({ title: '', description: '', duration: 0 });
    setEditingModule(null);
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: '',
      description: '',
      video_url: '',
      content: '',
      duration: 0,
      lesson_type: 'video',
      is_free: false
    });
    setEditingLesson(null);
    setSelectedModuleId('');
  };

  const handleModuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    const moduleData = {
      ...moduleForm,
      order_index: editingModule ? editingModule.order_index : modules.length
    };

    let success = false;
    if (editingModule) {
      success = await updateModule(editingModule.id, moduleData);
    } else {
      const newModule = await createModule(selectedCourse.id, moduleData);
      success = !!newModule;
    }

    if (success) {
      await loadCourseContent();
      setShowModuleDialog(false);
      resetModuleForm();
    }
  };

  const handleLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModuleId) return;

    const errors = validateContent(lessonForm);
    if (errors.length > 0) {
      errors.forEach(error => console.error(error));
      return;
    }

    const currentModule = modules.find(m => m.id === selectedModuleId);
    const lessonData = {
      ...lessonForm,
      order_index: editingLesson ? editingLesson.order_index : (currentModule?.lessons.length || 0),
      content_data: {}
    };

    let success = false;
    if (editingLesson) {
      success = await updateLesson(editingLesson.id, lessonData);
    } else {
      const newLesson = await createLesson(selectedModuleId, lessonData);
      success = !!newLesson;
    }

    if (success) {
      await loadCourseContent();
      setShowLessonDialog(false);
      resetLessonForm();
    }
  };

  const handleEditModule = (module: CourseModule) => {
    setEditingModule(module);
    setModuleForm({
      title: module.title,
      description: module.description || '',
      duration: module.duration || 0
    });
    setShowModuleDialog(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setSelectedModuleId(lesson.module_id);
    setLessonForm({
      title: lesson.title,
      description: lesson.description || '',
      video_url: lesson.video_url || '',
      content: lesson.content || '',
      duration: lesson.duration || 0,
      lesson_type: lesson.lesson_type,
      is_free: lesson.is_free || false
    });
    setShowLessonDialog(true);
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (window.confirm('Are you sure you want to delete this module? All lessons within it will also be deleted.')) {
      const success = await deleteModule(moduleId);
      if (success) {
        await loadCourseContent();
      }
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      const success = await deleteLesson(lessonId);
      if (success) {
        await loadCourseContent();
      }
    }
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, isExpanded: !module.isExpanded }
        : module
    ));
  };

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

  if (!selectedCourse) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Course Selected</h3>
          <p className="text-muted-foreground">Please select a course to manage its content</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">Managing: {selectedCourse.title}</p>
        </div>
        <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetModuleForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingModule ? 'Edit Module' : 'Create New Module'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleModuleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={moduleForm.duration}
                  onChange={(e) => setModuleForm({ ...moduleForm, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowModuleDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingModule ? 'Update Module' : 'Create Module'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-20 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module) => (
            <Card key={module.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <Collapsible>
                      <CollapsibleTrigger
                        onClick={() => toggleModuleExpansion(module.id)}
                        className="flex items-center gap-2"
                      >
                        {module.isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                    </Collapsible>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>
                        {module.lessons.length} lessons • {formatDuration(module.duration || 0)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedModuleId(module.id);
                        resetLessonForm();
                        setShowLessonDialog(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Lesson
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditModule(module)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteModule(module.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <Collapsible open={module.isExpanded}>
                <CollapsibleContent>
                  <CardContent>
                    {module.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <PlayCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No lessons yet. Add your first lesson!</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, index) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                              {getLessonIcon(lesson.lesson_type)}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{lesson.title}</span>
                                  {lesson.is_free && (
                                    <Badge variant="secondary" className="text-xs">Free</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {lesson.lesson_type} • {formatDuration(lesson.duration || 0)}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleEditLesson(lesson)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeleteLesson(lesson.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}

          {modules.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No modules created yet</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first module</p>
                <Button onClick={() => setShowModuleDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Module
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Lesson Dialog */}
      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLessonSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={lessonForm.lesson_type}
                  onValueChange={(value: Lesson['lesson_type']) => 
                    setLessonForm({ ...lessonForm, lesson_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="text">Text/Reading</SelectItem>
                    <SelectItem value="reading_material">Reading Material</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                rows={2}
              />
            </div>

            {lessonForm.lesson_type === 'video' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Video URL</label>
                <Input
                  value={lessonForm.video_url}
                  onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                />
                {lessonForm.video_url && !validateVideoUrl(lessonForm.video_url) && (
                  <p className="text-sm text-red-500">Invalid video URL format</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                value={lessonForm.content}
                onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                rows={4}
                placeholder="Lesson content, notes, or instructions..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input
                  type="number"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Free Lesson</label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={lessonForm.is_free}
                    onCheckedChange={(checked) => setLessonForm({ ...lessonForm, is_free: checked })}
                  />
                  <span className="text-sm text-muted-foreground">
                    Allow non-enrolled users to access
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowLessonDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingLesson ? 'Update Lesson' : 'Create Lesson'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedContentManager;
