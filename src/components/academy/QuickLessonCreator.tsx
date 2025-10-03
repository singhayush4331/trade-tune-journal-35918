
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, FileText, HelpCircle, BookOpen, X } from 'lucide-react';
import { Lesson } from '@/hooks/use-course-editor';

interface QuickLessonCreatorProps {
  moduleId: string;
  onCreateLesson: (moduleId: string, lessonData: Partial<Lesson>) => Promise<Lesson | null>;
  onLessonCreated?: (lesson: Lesson) => void;
  onClose?: () => void;
}

const QuickLessonCreator: React.FC<QuickLessonCreatorProps> = ({
  moduleId,
  onCreateLesson,
  onLessonCreated,
  onClose
}) => {
  const [selectedType, setSelectedType] = useState<'video' | 'reading' | 'quiz' | 'assignment'>('video');
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const lessonTypes = [
    { 
      id: 'video' as const, 
      name: 'Video', 
      icon: Video,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      id: 'reading' as const, 
      name: 'Reading', 
      icon: FileText,
      color: 'from-green-500 to-green-600'
    },
    { 
      id: 'quiz' as const, 
      name: 'Quiz', 
      icon: HelpCircle,
      color: 'from-purple-500 to-purple-600'
    },
    { 
      id: 'assignment' as const, 
      name: 'Assignment', 
      icon: BookOpen,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleCreateLesson = async () => {
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      const lessonData: Partial<Lesson> = {
        title: title.trim(),
        description: `New ${lessonTypes.find(t => t.id === selectedType)?.name}`,
        lesson_type: selectedType,
        duration: 0,
        video_url: '',
        content: '',
        content_data: {}
      };

      const newLesson = await onCreateLesson(moduleId, lessonData);
      if (newLesson) {
        setTitle('');
        setSelectedType('video');
        onLessonCreated?.(newLesson);
        handleClose();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setSelectedType('video');
    onClose?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Enter' && title.trim()) {
      handleCreateLesson();
    }
  };

  return (
    <div className="space-y-4" onKeyDown={handleKeyDown}>
      {/* Header with close button */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Create New Lesson</h4>
          <p className="text-sm text-muted-foreground">Choose the type of lesson you want to create</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Lesson Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lesson title..."
            className="w-full"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && title.trim()) {
                handleCreateLesson();
              }
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Type</label>
          <div className="flex gap-1">
            {lessonTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              
              return (
                <button
                  key={type.id}
                  className={`w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 ${
                    isSelected 
                      ? `bg-gradient-to-br ${type.color} shadow-sm ring-2 ring-primary/20` 
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                  onClick={() => setSelectedType(type.id)}
                  title={type.name}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-muted-foreground'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={handleClose} className="flex-1">
          Cancel
        </Button>
        <Button 
          onClick={handleCreateLesson} 
          disabled={!title.trim() || isCreating}
          className="flex-1"
        >
          {isCreating ? 'Creating...' : 'Create Lesson'}
        </Button>
      </div>
    </div>
  );
};

export default QuickLessonCreator;
