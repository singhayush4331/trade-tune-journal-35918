import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import NoteEditor from '@/components/notebook/NoteEditor';
import NotesList from '@/components/notebook/NotesList';
import { PlusCircle, Search, X, BookOpen, Tag, ArrowLeft, ListFilter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AppLayout from '@/components/layout/AppLayout';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
export interface Note {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
  color_tag: string | null;
  tags: string[];
}
const NotebookPage: React.FC = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const isXSmall = useIsXSmall();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("notes");
  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const {
          data,
          error
        } = await supabase.from('notes').select('*').order('updated_at', {
          ascending: false
        });
        if (error) throw error;
        setNotes(data as Note[]);
        if (data.length > 0 && !activeNote) {
          setActiveNote(data[0] as Note);
        }
      } catch (error) {
        console.error('Error fetching notes:', error);
        toast({
          title: 'Error fetching notes',
          description: 'There was a problem loading your notes.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, [user, toast]);

  // Effect to switch to editor tab when a note is selected on mobile
  useEffect(() => {
    if (isMobile && activeNote) {
      setActiveTab("editor");
    }
  }, [activeNote, isMobile]);
  const createNote = async () => {
    if (!user) return;
    try {
      const {
        data,
        error
      } = await supabase.from('notes').insert([{
        user_id: user.id,
        title: 'Untitled Note',
        content: '',
        tags: []
      }]).select().single();
      if (error) throw error;
      const newNote = data as Note;
      setNotes([newNote, ...notes]);
      setActiveNote(newNote);
      toast({
        title: 'Note created',
        description: 'Your new note has been created.'
      });

      // Switch to editor tab on mobile when creating a new note
      if (isMobile) {
        setActiveTab("editor");
      }
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error creating note',
        description: 'There was a problem creating your note.',
        variant: 'destructive'
      });
    }
  };
  const saveNote = async (updatedNote: Note) => {
    try {
      const {
        error
      } = await supabase.from('notes').update({
        title: updatedNote.title,
        content: updatedNote.content,
        updated_at: new Date().toISOString(),
        color_tag: updatedNote.color_tag,
        tags: updatedNote.tags
      }).eq('id', updatedNote.id);
      if (error) throw error;
      setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
      toast({
        title: 'Note saved',
        description: 'Your note has been saved.'
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: 'Error saving note',
        description: 'There was a problem saving your note.',
        variant: 'destructive'
      });
    }
  };
  const deleteNote = async (noteId: string) => {
    try {
      const {
        error
      } = await supabase.from('notes').delete().eq('id', noteId);
      if (error) throw error;
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      if (activeNote && activeNote.id === noteId) {
        setActiveNote(updatedNotes[0] || null);
        // If on mobile and we deleted the active note, go back to notes list
        if (isMobile && updatedNotes.length > 0) {
          setActiveTab("notes");
        }
      }
      toast({
        title: 'Note deleted',
        description: 'Your note has been deleted.'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error deleting note',
        description: 'There was a problem deleting your note.',
        variant: 'destructive'
      });
    }
  };
  const allTags = React.useMemo(() => {
    const tagsSet = new Set<string>();
    notes.forEach(note => {
      if (note.tags) {
        note.tags.forEach(tag => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet);
  }, [notes]);
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()) || note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = !selectedTag || note.tags && note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });
  const clearFilter = () => {
    setSearchQuery('');
    setSelectedTag(null);
  };

  // Function to handle note selection on mobile
  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
    if (isMobile) {
      setActiveTab("editor");
    }
  };

  // Function to go back to notes list on mobile
  const handleBackToList = () => {
    setActiveTab("notes");
  };

  // Render function for desktop layout
  const renderDesktopLayout = () => <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-primary/5 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg">
      <div className="lg:col-span-3 xl:col-span-3 space-y-4">
        <Card className="glass-card border-primary/10 shadow-sm transition-all duration-300 hover:shadow-md animate-scale-in">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Notes</span>
              <Badge variant="outline" className="ml-2 bg-primary/10">
                {notes.length}
              </Badge>
            </CardTitle>
            
            <div className="relative mt-3">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground opacity-70" />
              <Input placeholder="Search notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 pr-8 bg-background/50 border-primary/10 focus:border-primary/30 transition-all" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5">
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>}
            </div>
          </CardHeader>
          
          <CardContent className="p-3">
            {allTags.length > 0 && <>
                <div className="flex items-center mb-2 text-sm text-muted-foreground">
                  <Tag className="h-3 w-3 mr-1" />
                  <span>Filter by tag</span>
                  {selectedTag && <Button onClick={clearFilter} variant="ghost" size="sm" className="ml-auto h-6 px-1 text-xs">
                      Clear
                    </Button>}
                </div>
                <div className="flex flex-wrap gap-1 mb-3 max-h-24 overflow-y-auto scrollbar-none">
                  {allTags.map(tag => <Badge key={tag} variant={selectedTag === tag ? "default" : "outline"} className={`cursor-pointer transition-all hover:bg-primary/10 ${selectedTag === tag ? "bg-primary text-white" : "bg-background/50"}`} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}>
                      {tag}
                    </Badge>)}
                </div>
                <Separator className="my-3" />
              </>}
            
            <NotesList notes={filteredNotes} activeNoteId={activeNote?.id} isLoading={isLoading} onNoteSelect={setActiveNote} onNoteDelete={deleteNote} />
            
            {filteredNotes.length === 0 && !isLoading && <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-3">
                  <Search className="h-5 w-5 text-primary/70" />
                </div>
                <p className="text-muted-foreground mb-1">No notes found</p>
                <p className="text-xs text-muted-foreground mb-3">Try a different search term or tag</p>
                <Button onClick={clearFilter} variant="outline" size="sm" className="text-xs">
                  Clear filters
                </Button>
              </div>}
          </CardContent>
        </Card>
      </div>
      
      <div className="lg:col-span-9 xl:col-span-9">
        <Card className="glass-card border-primary/10 shadow-sm overflow-hidden min-h-[70vh] flex flex-col animate-fade-in">
          {activeNote ? <NoteEditor note={activeNote} onSave={saveNote} /> : <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="mb-4 p-6 rounded-full bg-primary/5">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50">
                  <path d="M12 3v12"></path>
                  <path d="M8 11l4 4 4-4"></path>
                  <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-primary via-blue-500 to-primary/80 bg-clip-text text-transparent">No Note Selected</h3>
              <p className="text-muted-foreground mb-4">Select a note from the list or create a new one.</p>
              <Button onClick={createNote} variant="gradient" className="shadow-lg hover:shadow-primary/20">
                <PlusCircle className="h-4 w-4 mr-2" /> Create a new note
              </Button>
            </div>}
        </Card>
      </div>
    </div>;

  // Render function for mobile tabbed layout
  const renderMobileLayout = () => <div className="bg-primary/5 backdrop-blur-sm rounded-xl p-3 xs:p-4 shadow-lg">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {activeTab === "editor" && activeNote && <Button variant="ghost" size="icon" className="h-9 w-9 mr-1" onClick={handleBackToList}>
                <ArrowLeft className="h-4 w-4" />
              </Button>}
            <BookOpen className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-gradient">
              {activeTab === "editor" && activeNote ? activeNote.title.length > 20 ? activeNote.title.substring(0, 20) + '...' : activeNote.title : "Notebook"}
            </h1>
          </div>

          {activeTab === "notes" ? <Button onClick={createNote} size="sm" className="h-9 w-9 rounded-full shadow-lg hover:shadow-primary/20 p-0" variant="gradient">
              <PlusCircle className="h-4 w-4" />
            </Button> : <TabsList className="grid grid-cols-2 h-9 bg-primary/10">
              <TabsTrigger value="notes" className="text-xs px-3">List</TabsTrigger>
              <TabsTrigger value="editor" className="text-xs px-3">Editor</TabsTrigger>
            </TabsList>}
        </div>

        <TabsContent value="notes" className="mt-0">
          <Card className="glass-card border-primary/10 shadow-sm transition-all animate-scale-in">
            <CardContent className="p-3 pt-4">
              <div className="flex flex-col gap-3 mb-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground opacity-70" />
                  <Input placeholder="Search notes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 pr-8 bg-background/50 border-primary/10 focus:border-primary/30 transition-all" />
                  {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5">
                      <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </button>}
                </div>

                {allTags.length > 0 && <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-xs flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>Tags</span>
                      <Badge variant="outline" className="ml-1 bg-primary/10 h-5 min-w-5 text-xs">
                        {allTags.length}
                      </Badge>
                    </Button>
                    
                    <Button variant="outline" size="sm" className="h-8 px-2 text-xs flex items-center gap-1" onClick={() => {
                  // Toggle dropdown or dialog for tags in a future enhancement
                }}>
                      <ListFilter className="h-3 w-3" />
                      <span>Filter</span>
                      {selectedTag && <Badge className="ml-1 h-5 min-w-5 text-xs">{selectedTag}</Badge>}
                    </Button>
                    
                    {(searchQuery || selectedTag) && <Button onClick={clearFilter} variant="ghost" size="sm" className="h-8 px-2 text-xs">
                        Clear
                      </Button>}
                  </div>}
                
                {allTags.length > 0 && selectedTag && <div className="flex flex-wrap gap-1 mb-1 max-h-16 overflow-y-auto scrollbar-none">
                    {allTags.map(tag => <Badge key={tag} variant={selectedTag === tag ? "default" : "outline"} className={`cursor-pointer transition-all hover:bg-primary/10 ${selectedTag === tag ? "bg-primary text-white" : "bg-background/50"}`} onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}>
                        {tag}
                      </Badge>)}
                  </div>}
              </div>
              
              <div className="max-h-[calc(100vh-260px)] overflow-y-auto pb-20">
                <NotesList notes={filteredNotes} activeNoteId={activeNote?.id} isLoading={isLoading} onNoteSelect={handleNoteSelect} onNoteDelete={deleteNote} />
              </div>
              
              {filteredNotes.length === 0 && !isLoading && <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Search className="h-5 w-5 text-primary/70" />
                  </div>
                  <p className="text-muted-foreground mb-1">No notes found</p>
                  <p className="text-xs text-muted-foreground mb-3">Try a different search term or tag</p>
                  <Button onClick={clearFilter} variant="outline" size="sm" className="text-xs">
                    Clear filters
                  </Button>
                </div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="editor" className="mt-0 min-h-[calc(100vh-160px)]">
          <Card className="glass-card border-primary/10 shadow-sm overflow-hidden">
            {activeNote ? <NoteEditor note={activeNote} onSave={saveNote} isMobile={true} /> : <div className="flex flex-col items-center justify-center p-8 text-center h-64">
                <div className="mb-4 p-4 rounded-full bg-primary/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-primary/50">
                    <path d="M12 3v12"></path>
                    <path d="M8 11l4 4 4-4"></path>
                    <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2 bg-gradient-to-r from-primary via-blue-500 to-primary/80 bg-clip-text text-transparent">No Note Selected</h3>
                <p className="text-sm text-muted-foreground mb-4">Select a note from the list or create a new one.</p>
                <Button onClick={createNote} variant="gradient" size="sm" className="shadow-lg hover:shadow-primary/20">
                  <PlusCircle className="h-4 w-4 mr-2" /> Create a note
                </Button>
              </div>}
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Floating Action Button for quick note creation on the "notes" tab */}
      {activeTab === "notes"}
    </div>;
  return <AppLayout>
      <Helmet>
        <title>Notebook | Wiggly</title>
      </Helmet>
      
      <div className={cn("container py-4 px-4 mx-auto", isMobile ? "max-w-full" : "max-w-full")}>
        {!isMobile && <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-gradient">Your Notebook</h1>
            </div>
            
            <Button onClick={createNote} size="sm" className="rounded-full shadow-lg hover:shadow-primary/20" variant="gradient">
              <PlusCircle className="h-4 w-4 mr-1" /> New Note
            </Button>
          </div>}
        
        {isMobile ? renderMobileLayout() : renderDesktopLayout()}
      </div>
    </AppLayout>;
};
export default NotebookPage;