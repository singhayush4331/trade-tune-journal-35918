
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  NotebookPen,
  MoreVertical,
  CheckCircle,
  Play,
  Home,
  BookOpen,
  User,
  X
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileOptimizedNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onToggleSidebar: () => void;
  onToggleNotes: () => void;
  onMarkComplete: () => void;
  onBackToAcademy: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
  currentLesson: string;
  progress: string;
  courseTitle: string;
}

export const MobileOptimizedNavigation: React.FC<MobileOptimizedNavigationProps> = ({
  onPrevious,
  onNext,
  onToggleSidebar,
  onToggleNotes,
  onMarkComplete,
  onBackToAcademy,
  canGoPrevious,
  canGoNext,
  isCompleted,
  currentLesson,
  progress,
  courseTitle
}) => {
  return (
    <>
      {/* Top Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onBackToAcademy} className="p-2">
            <Home className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0 mx-3">
            <h1 className="font-semibold text-sm truncate">{courseTitle}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{progress}</Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Mobile Navigation - More compact design */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-t shadow-2xl">
        <div className="safe-area-bottom">
          {/* Current Lesson Info - More compact */}
          <div className="px-4 py-2 border-b bg-muted/30">
            <p className="text-sm font-medium truncate">{currentLesson}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Progress</span>
              <Badge variant={isCompleted ? "default" : "secondary"} className="text-xs">
                {isCompleted ? "Completed" : "In Progress"}
              </Badge>
            </div>
          </div>
          
          {/* Navigation Controls - More compact */}
          <div className="p-3">
            <div className="grid grid-cols-4 gap-2 mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={!canGoPrevious}
                className="h-12 flex flex-col gap-1 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
              
              {/* Toggle Completion Button */}
              <Button
                variant={isCompleted ? "outline" : "default"}
                size="sm"
                onClick={onMarkComplete}
                className={`h-12 flex flex-col gap-1 col-span-2 text-xs ${
                  isCompleted 
                    ? "border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/20" 
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
              >
                {isCompleted ? (
                  <>
                    <X className="h-4 w-4" />
                    <span>Incomplete</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Complete</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleNotes}
                className="h-12 flex flex-col gap-1 text-xs"
              >
                <NotebookPen className="h-4 w-4" />
                <span>Notes</span>
              </Button>
            </div>
            
            {/* Additional Actions - More compact */}
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleSidebar}
                className="flex-1 h-10 flex items-center justify-center gap-2 text-xs"
              >
                <BookOpen className="h-4 w-4" />
                <span>Course Content</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileOptimizedNavigation;
