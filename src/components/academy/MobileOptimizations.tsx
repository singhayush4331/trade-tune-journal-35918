
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
  Play
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MobileNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  onToggleSidebar: () => void;
  onToggleNotes: () => void;
  onMarkComplete: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isCompleted: boolean;
  currentLesson: string;
  progress: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  onPrevious,
  onNext,
  onToggleSidebar,
  onToggleNotes,
  onMarkComplete,
  canGoPrevious,
  canGoNext,
  isCompleted,
  currentLesson,
  progress
}) => {
  return (
    <Card className="fixed bottom-4 left-4 right-4 z-40 shadow-2xl bg-background/95 backdrop-blur-sm border-2">
      <CardContent className="p-3">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium truncate flex-1 mr-2">{currentLesson}</span>
          <Badge variant="secondary" className="text-xs">{progress}</Badge>
        </div>
        
        {/* Navigation controls */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="flex-1 mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          {!isCompleted ? (
            <Button
              variant="default"
              size="sm"
              onClick={onMarkComplete}
              className="bg-gradient-to-r from-green-500 to-emerald-500 flex-1 mr-2"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!canGoNext}
              className="flex-1 mr-2"
            >
              <Play className="h-4 w-4 mr-1" />
              Continue
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-10 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={onToggleSidebar}>
                <Menu className="h-4 w-4 mr-2" />
                Course Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleNotes}>
                <NotebookPen className="h-4 w-4 mr-2" />
                Notes
              </DropdownMenuItem>
              {!isCompleted && (
                <DropdownMenuItem onClick={onMarkComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export const MobileLessonHeader: React.FC<{
  title: string;
  moduleInfo: string;
  duration: number;
  onBack: () => void;
}> = ({ title, moduleInfo, duration, onBack }) => {
  return (
    <div className="p-4 border-b bg-background sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-base truncate">{title}</h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{moduleInfo}</span>
            <span>•</span>
            <span>{duration}m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
