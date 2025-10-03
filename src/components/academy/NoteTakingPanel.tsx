
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  NotebookPen, 
  Save, 
  Plus, 
  Trash2, 
  Clock,
  Tag,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface Note {
  id: string;
  lessonId: string;
  content: string;
  timestamp: number;
  tags: string[];
}

interface NoteTakingPanelProps {
  currentLessonId: string;
  currentLessonTitle: string;
  isVisible: boolean;
  onToggle: () => void;
}

const NoteTakingPanel: React.FC<NoteTakingPanelProps> = ({
  currentLessonId,
  currentLessonTitle,
  isVisible,
  onToggle
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`course-notes-${currentLessonId}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [currentLessonId]);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem(`course-notes-${currentLessonId}`, JSON.stringify(notes));
  }, [notes, currentLessonId]);

  const handleSaveNote = () => {
    if (!currentNote.trim()) return;

    const newNote: Note = {
      id: Date.now().toString(),
      lessonId: currentLessonId,
      content: currentNote,
      timestamp: Date.now(),
      tags: selectedTags
    };

    setNotes(prev => [newNote, ...prev]);
    setCurrentNote('');
    setSelectedTags([]);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={onToggle}
        className="fixed bottom-4 right-4 z-50 shadow-lg bg-background border-2"
        title="Open Notes"
      >
        <NotebookPen className="h-4 w-4" />
        {!isMobile && <span className="ml-2">Notes</span>}
      </Button>
    );
  }

  return (
    <Card className={`fixed ${isMobile ? 'inset-x-4 bottom-4 top-20' : 'bottom-4 right-4 w-80 max-h-96'} z-50 shadow-2xl bg-background/95 backdrop-blur-sm border-2`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <NotebookPen className="h-4 w-4" />
            Notes
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-6 w-6 p-0">
            ×
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{currentLessonTitle}</p>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4 max-h-80 overflow-y-auto">
        {/* Note Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Take notes about this lesson..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="min-h-20 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleSaveNote();
              }
            }}
          />
          
          {/* Tags Input */}
          <div className="flex flex-wrap gap-2 items-center">
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs cursor-pointer" onClick={() => removeTag(tag)}>
                <Tag className="h-3 w-3 mr-1" />
                {tag} ×
              </Badge>
            ))}
            <Input
              placeholder="Add tags..."
              className="flex-1 h-8 text-xs"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
          </div>
          
          <Button onClick={handleSaveNote} size="sm" className="w-full" disabled={!currentNote.trim()}>
            <Save className="h-3 w-3 mr-2" />
            Save Note (Ctrl+Enter)
          </Button>
        </div>

        {/* Search Notes */}
        {notes.length > 0 && (
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-8 text-xs"
            />
          </div>
        )}

        {/* Notes List */}
        <div className="space-y-2">
          {filteredNotes.map(note => (
            <Card key={note.id} className="bg-muted/30">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimestamp(note.timestamp)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm leading-relaxed mb-2">{note.content}</p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <NotebookPen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs">Start taking notes to remember key points</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NoteTakingPanel;
