import React, { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  FileText, 
  HelpCircle, 
  BookOpen,
  Play,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Eye,
  Clock,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration?: number;
  lesson_type: 'video' | 'reading' | 'quiz' | 'assignment';
  video_url?: string;
  content?: string;
  order_index: number;
  is_free: boolean;
}

interface ModernLessonItemProps {
  lesson: Lesson;
  lessonIndex: number;
  isCurrentLesson: boolean;
  isCompleted: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
  onToggleComplete?: () => void;
}

const ModernLessonItem: React.FC<ModernLessonItemProps> = memo(({
  lesson,
  lessonIndex,
  isCurrentLesson,
  isCompleted,
  onClick,
  onEdit,
  onDelete,
  onPreview,
  onToggleComplete
}) => {
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'reading': return FileText;
      case 'quiz': return HelpCircle;
      case 'assignment': return BookOpen;
      default: return Video;
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'from-blue-500 to-blue-600';
      case 'reading': return 'from-green-500 to-green-600';
      case 'quiz': return 'from-purple-500 to-purple-600';
      case 'assignment': return 'from-orange-500 to-orange-600';
      default: return 'from-blue-500 to-blue-600';
    }
  };

  const LessonIcon = getLessonTypeIcon(lesson.lesson_type);
  const colorGradient = getLessonTypeColor(lesson.lesson_type);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Edit clicked for lesson:', lesson.id);
    onEdit?.();
  }, [onEdit, lesson.id]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Delete clicked for lesson:', lesson.id);
    onDelete?.();
  }, [onDelete, lesson.id]);

  const handlePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Preview clicked for lesson:', lesson.id);
    onPreview?.();
  }, [onPreview, lesson.id]);

  const handleToggleComplete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Toggle complete clicked for lesson:', lesson.id);
    onToggleComplete?.();
  }, [onToggleComplete, lesson.id]);

  const handleLessonClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Lesson clicked:', lesson.id, lesson.title);
    onClick();
  }, [onClick, lesson.id, lesson.title]);

  return (
    <div
      className={cn(
        "group flex items-center gap-3 p-4 hover:bg-muted/50 transition-all duration-200 border-b border-border/30 last:border-b-0 cursor-pointer",
        isCurrentLesson && "bg-primary/5 border-l-4 border-l-primary"
      )}
      onClick={handleLessonClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleLessonClick(e as any);
        }
      }}
    >
      {/* Completion Status - Only show green checkmark when completed */}
      {isCompleted && (
        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
      )}

      {/* Lesson Icon */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${colorGradient} shadow-sm flex-shrink-0`}>
        <LessonIcon className="h-4 w-4 text-white" />
      </div>

      {/* Lesson Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={cn(
            "font-medium text-sm truncate",
            isCurrentLesson ? "text-primary" : "text-foreground"
          )}>
            {lesson.title}
          </h4>
          {lesson.is_free && (
            <Badge variant="secondary" className="text-xs px-2 py-0">
              Free
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="capitalize">{lesson.lesson_type}</span>
          {lesson.duration && (
            <>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{lesson.duration} min</span>
              </div>
            </>
          )}
          {lesson.description && (
            <>
              <span>•</span>
              <span className="truncate max-w-32">{lesson.description}</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete || onPreview) && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              className="h-8 w-8 p-0 hover:bg-primary/10"
              title="Preview lesson"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-primary/10"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {onEdit && (
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Lesson
                </DropdownMenuItem>
              )}
              {onPreview && (
                <DropdownMenuItem onClick={handlePreview}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </DropdownMenuItem>
              )}
              {onToggleComplete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleToggleComplete}>
                    {isCompleted ? (
                      <>
                        <Circle className="h-4 w-4 mr-2" />
                        Mark Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </>
                    )}
                  </DropdownMenuItem>
                </>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem 
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Lesson
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{lesson.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete Lesson
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
});

ModernLessonItem.displayName = 'ModernLessonItem';

export default ModernLessonItem;
