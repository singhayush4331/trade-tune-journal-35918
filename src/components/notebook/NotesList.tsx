
import React from 'react';
import { Note } from '@/pages/NotebookPage';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';

interface NotesListProps {
  notes: Note[];
  activeNoteId?: string;
  isLoading: boolean;
  onNoteSelect: (note: Note) => void;
  onNoteDelete: (noteId: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ 
  notes, 
  activeNoteId, 
  isLoading, 
  onNoteSelect, 
  onNoteDelete 
}) => {
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-primary/10 rounded-lg p-3 space-y-2 bg-card/30 backdrop-blur-sm">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="mb-2">No notes found</p>
        <p className="text-sm">Create a new note to get started</p>
      </div>
    );
  }

  // Updated color map to use standard Tailwind color classes
  const colorMap: Record<string, string> = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    purple: "bg-purple-500",
    yellow: "bg-amber-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500"
  };

  // Text color map for better contrast
  const textColorMap: Record<string, string> = {
    red: "text-red-500",
    green: "text-green-500",
    blue: "text-blue-500",
    purple: "text-purple-500",
    yellow: "text-amber-500",
    orange: "text-orange-500",
    pink: "text-pink-500"
  };

  // Animation variants for list items
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {notes.map((note) => (
        <motion.div
          key={note.id}
          variants={item}
          layoutId={note.id}
          className={cn(
            'relative border p-3 cursor-pointer transition-all rounded-md hover:shadow-md',
            activeNoteId === note.id 
              ? 'border-primary bg-primary/5 shadow-sm' 
              : 'border-primary/10 bg-card/30 hover:bg-accent/30'
          )}
          onClick={() => onNoteSelect(note)}
        >
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {note.color_tag && (
                <div 
                  className={cn(
                    "h-4 w-4 rounded-full flex-shrink-0", 
                    colorMap[note.color_tag] || "bg-gray-400"
                  )} 
                />
              )}
              <h3 className="font-medium text-base truncate">{note.title}</h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 text-muted-foreground opacity-60 hover:opacity-100 hover:text-destructive hover:bg-destructive/10 absolute right-1 top-2",
                isMobile && "h-10 w-10" // Larger tap target on mobile
              )}
              onClick={(e) => {
                e.stopPropagation();
                onNoteDelete(note.id);
              }}
            >
              <Trash2 className={cn("h-3.5 w-3.5", isMobile && "h-4 w-4")} />
            </Button>
          </div>
          
          {note.content && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 pr-5">
              {note.content?.replace(/<[^>]*>/g, '') || 'No content'}
            </p>
          )}
          
          <div className="flex justify-between items-center mt-2.5 pt-1.5 border-t border-border/40">
            <div className="flex gap-1 flex-wrap">
              {note.tags && note.tags.slice(0, isXSmall ? 1 : 2).map((tag, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className={cn(
                    "text-xs px-1.5 py-0 bg-primary/5 border-primary/10",
                    note.color_tag ? textColorMap[note.color_tag] : "",
                    isMobile && "text-xs px-2 py-0.5" // Slightly larger on mobile
                  )}
                >
                  {tag}
                </Badge>
              ))}
              {note.tags && note.tags.length > (isXSmall ? 1 : 2) && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 bg-primary/5 border-primary/10">
                  +{note.tags.length - (isXSmall ? 1 : 2)}
                </Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NotesList;
