
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Plus,
  BookOpen,
  CheckCircle,
  Edit,
  Trash2
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
import { motion, AnimatePresence } from 'framer-motion';

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: any[];
  progress?: number;
}

interface ModernModuleCardProps {
  module: Module;
  moduleIndex: number;
  isExpanded: boolean;
  completedLessons: Set<string>;
  onToggleExpand: () => void;
  onEditModule?: () => void;
  onDeleteModule?: () => void;
  onAddLesson?: () => void;
  children?: React.ReactNode;
}

const ModernModuleCard: React.FC<ModernModuleCardProps> = ({
  module,
  moduleIndex,
  isExpanded,
  completedLessons,
  onToggleExpand,
  onEditModule,
  onDeleteModule,
  onAddLesson,
  children
}) => {
  const totalLessons = module.lessons.length;
  const completedCount = module.lessons.filter(lesson => 
    completedLessons.has(lesson.id)
  ).length;
  const progressPercentage = module.progress !== undefined ? module.progress : 
    (totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0);

  const handleAddLesson = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddLesson?.();
  };

  const handleEditModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditModule?.();
  };

  const handleDeleteModule = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteModule?.();
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-card/80 border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center text-primary-foreground text-sm font-bold shadow-sm">
              {moduleIndex + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">
                {module.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs px-2 py-0">
                  {totalLessons} lesson{totalLessons !== 1 ? 's' : ''}
                </Badge>
                {completedCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {completedCount}/{totalLessons}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAddLesson}
              className="h-8 w-8 p-0 hover:bg-primary/10 opacity-70 hover:opacity-100"
              title="Add lesson"
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/10 opacity-70 hover:opacity-100"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onEditModule && (
                  <DropdownMenuItem onClick={handleEditModule}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Module
                  </DropdownMenuItem>
                )}
                {onAddLesson && (
                  <DropdownMenuItem onClick={handleAddLesson}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson
                  </DropdownMenuItem>
                )}
                {onDeleteModule && (
                  <>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          onSelect={(e) => e.preventDefault()}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Module
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Module</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{module.title}"? This will permanently remove the module and all its lessons. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleDeleteModule}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Module
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Bar */}
        {totalLessons > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-primary/10" 
            />
          </div>
        )}
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent className="p-0">
              {children}
              
              {/* Empty state for modules with no lessons */}
              {totalLessons === 0 && (
                <div className="p-6 text-center border-b border-border/30">
                  <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">No lessons in this module yet</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddLesson}
                    className="border-dashed"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Lesson
                  </Button>
                </div>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ModernModuleCard;
