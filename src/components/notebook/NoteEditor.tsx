
import React, { useState, useEffect, useRef } from 'react';
import { Note } from '@/pages/NotebookPage';
import { Save, Tag, Palette, Bold, Italic, List, ListOrdered, Link, AlignLeft, AlignCenter, AlignRight, X, Image, Underline, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useIsMobile, useIsXSmall } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Note) => void;
  isMobile?: boolean;
}

const colorOptions = [
  { value: 'green', label: 'Green', class: 'bg-green-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-500' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  { value: 'red', label: 'Red', class: 'bg-red-500' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
  { value: null, label: 'No Color', class: 'bg-gray-300 dark:bg-gray-700' },
];

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave, isMobile: forceMobile }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content || '');
  const [colorTag, setColorTag] = useState<string | null>(note.color_tag);
  const [tags, setTags] = useState<string[]>(note.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const contentEditableRef = useRef<HTMLDivElement>(null);
  
  // Use the hook or forced value (useful for overriding in parent components)
  const isMobileDevice = useIsMobile();
  const isXSmall = useIsXSmall();
  const isMobile = forceMobile !== undefined ? forceMobile : isMobileDevice;
  
  // Update local state when note prop changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content || '');
    setColorTag(note.color_tag);
    setTags(note.tags || []);
    
    // Set content to the contentEditable div - sanitize for security
    if (contentEditableRef.current) {
      // Don't use innerHTML directly for user content - this is a controlled editor
      contentEditableRef.current.textContent = note.content || '';
    }
  }, [note]);

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      // Use textContent instead of innerHTML for security
      setContent(contentEditableRef.current.textContent || '');
    }
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleManualSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...note,
        title,
        content,
        color_tag: colorTag,
        tags,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Improved formatText function to handle lists better
  const formatText = (command: string, value?: string) => {
    // First ensure the editor has focus
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
    
    // Special handling for lists to ensure proper creation
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      // Save the current selection
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      
      // Execute the command
      document.execCommand(command, false, value);
      
      // Force a re-render of the editor content to apply proper styling
      handleContentChange();
      
      // Restore focus to the editor
      if (contentEditableRef.current) {
        contentEditableRef.current.focus();
        
        // Try to restore selection if possible
        if (selection && range) {
          try {
            selection.removeAllRanges();
            selection.addRange(range);
          } catch (e) {
            console.log('Could not restore selection');
          }
        }
      }
    } else {
      // For other formatting, use the standard approach
      document.execCommand(command, false, value);
      handleContentChange();
    }
  };

  // Get color class for the selected color tag
  const selectedColorClass = colorTag ? 
    colorOptions.find(c => c.value === colorTag)?.class || '' :
    '';

  // Render the editor header for mobile views  
  const renderMobileEditorHeader = () => (
    <div className="border-b p-3 flex flex-wrap gap-2 items-center bg-card/50 backdrop-blur-sm">
      <div className="flex items-center flex-1 min-w-0">
        {colorTag && (
          <div className={cn("w-3 h-3 rounded-full mr-2", selectedColorClass)} />
        )}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-medium text-base flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 h-auto bg-transparent max-w-full"
          placeholder="Note title"
        />
      </div>
      
      <div className="flex items-center gap-1">
        <Button
          onClick={handleManualSave} 
          size="sm"
          className="h-9 px-3"
          variant="gradient"
        >
          <Save className="h-4 w-4 mr-1" />
          <span className="text-xs">{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
      </div>
    </div>
  );

  // Render the mobile toolbar with formatting options
  const renderMobileToolbar = () => (
    <div className="border-b bg-muted/30">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 h-8 bg-transparent border-b">
          <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
          <TabsTrigger value="format" className="text-xs">Format</TabsTrigger>
          <TabsTrigger value="options" className="text-xs">Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="pt-1 pb-1 px-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('bold')}
            >
              <Bold className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('italic')}
            >
              <Italic className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('underline')}
            >
              <Underline className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 my-auto mx-1" />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('insertUnorderedList')}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('insertOrderedList')}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="format" className="pt-1 pb-1 px-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('justifyLeft')}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('justifyCenter')}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('justifyRight')}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
            
            <Separator orientation="vertical" className="h-6 my-auto mx-1" />
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) formatText('createLink', url);
              }}
            >
              <Link className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => {
                const url = prompt('Enter image URL:');
                if (url) formatText('insertImage', url);
              }}
            >
              <Image className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="options" className="pt-1 pb-1 px-2">
          <div className="flex gap-1 overflow-x-auto pb-1">
            {/* Color selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs hover:bg-muted">
                  <div 
                    className={cn(
                      "w-3 h-3 rounded-full mr-1",
                      colorTag 
                        ? colorOptions.find(c => c.value === colorTag)?.class 
                        : 'bg-gray-300 dark:bg-gray-700'
                    )}
                  /> 
                  <span className="text-xs">Color</span>
                  <ChevronRight className="h-3 w-3 ml-0.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-card/95 backdrop-blur-sm">
                {colorOptions.map((color) => (
                  <DropdownMenuItem 
                    key={color.label}
                    onClick={() => setColorTag(color.value)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className={cn("w-3 h-3 rounded-full", color.class)} />
                    {color.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Tags management */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs hover:bg-muted">
                  <Tag className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Tags</span>
                  {tags.length > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center px-1 text-xs">
                      {tags.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-card/95 backdrop-blur-sm">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Manage Tags</h4>
                  
                  <form onSubmit={addTag} className="flex gap-2">
                    <Input
                      placeholder="Add a tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-grow text-sm"
                    />
                    <Button type="submit" size="sm" variant="outline">Add</Button>
                  </form>
                  
                  <ScrollArea className="h-32 w-full rounded-md border p-2">
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="pl-2 pr-1 py-1 cursor-pointer hover:bg-muted-foreground/10 flex items-center"
                        >
                          {tag}
                          <button 
                            className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {tags.length === 0 && (
                        <p className="text-sm text-muted-foreground p-2">No tags added yet</p>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render the standard desktop toolbar
  const renderDesktopToolbar = () => (
    <div className="flex gap-1 px-4 py-2 border-b bg-muted/30 overflow-x-auto">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('bold')}
            >
              <Bold className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('italic')}
            >
              <Italic className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('underline')}
            >
              <Underline className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6 my-auto mx-1" />
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('insertUnorderedList')}
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('insertOrderedList')}
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numbered List</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6 my-auto mx-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) formatText('createLink', url);
              }}
            >
              <Link className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Link</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => {
                const url = prompt('Enter image URL:');
                if (url) formatText('insertImage', url);
              }}
            >
              <Image className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert Image</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6 my-auto mx-1" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('justifyLeft')}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Left</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('justifyCenter')}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Center</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => formatText('justifyRight')}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align Right</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  // Render the desktop editor header with all options
  const renderDesktopEditorHeader = () => (
    <div className="border-b p-4 flex flex-wrap gap-2 items-center bg-card/50 backdrop-blur-sm">
      <div className="flex items-center flex-1">
        {colorTag && (
          <div className={cn("w-3 h-3 rounded-full mr-2", selectedColorClass)} />
        )}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-medium text-lg flex-grow border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-0 h-auto bg-transparent"
          placeholder="Note title"
        />
      </div>
      
      <div className="flex items-center gap-2">
        {/* Color selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 hover:bg-muted">
              <div 
                className={cn(
                  "w-3 h-3 rounded-full mr-1",
                  colorTag 
                    ? colorOptions.find(c => c.value === colorTag)?.class 
                    : 'bg-gray-300 dark:bg-gray-700'
                )}
              /> 
              <Palette className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Color</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-card/95 backdrop-blur-sm">
            {colorOptions.map((color) => (
              <DropdownMenuItem 
                key={color.label}
                onClick={() => setColorTag(color.value)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <div className={cn("w-3 h-3 rounded-full", color.class)} />
                {color.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Tags management */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 hover:bg-muted">
              <Tag className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Tags</span>
              {tags.length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 flex items-center justify-center px-1 text-xs">
                  {tags.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-card/95 backdrop-blur-sm">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Manage Tags</h4>
              
              <form onSubmit={addTag} className="flex gap-2">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="flex-grow text-sm"
                />
                <Button type="submit" size="sm" variant="outline">Add</Button>
              </form>
              
              <ScrollArea className="h-32 w-full rounded-md border p-2">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="pl-2 pr-1 py-1 cursor-pointer hover:bg-muted-foreground/10 flex items-center"
                    >
                      {tag}
                      <button 
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {tags.length === 0 && (
                    <p className="text-sm text-muted-foreground p-2">No tags added yet</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Save button */}
        <Button 
          onClick={handleManualSave} 
          size="sm"
          className="h-8"
          variant="gradient"
        >
          <Save className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">{isSaving ? 'Saving...' : 'Save'}</span>
        </Button>
      </div>
    </div>
  );

  // Content for mobile view with tabs
  const renderMobileContent = () => (
    <>
      {/* Mobile header */}
      {renderMobileEditorHeader()}
      
      {/* Mobile formatting toolbar */}
      {renderMobileToolbar()}
      
      {/* Mobile content area */}
      <ScrollArea className="flex-grow">
        <div 
          className="p-4 outline-none whitespace-pre-wrap prose dark:prose-invert prose-sm max-w-none min-h-[300px] note-editor-content"
          ref={contentEditableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          dir="ltr"
          style={{
            fontFamily: 'system-ui, sans-serif',
            lineHeight: '1.6',
          }}
        />
      </ScrollArea>
      
      {/* Mobile tags footer */}
      {tags.length > 0 && (
        <div className="border-t px-3 py-2 text-xs text-muted-foreground flex justify-end items-center bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <Tag className="h-3 w-3 mr-0.5" />
            <div className="flex flex-wrap gap-1.5 max-w-56 overflow-hidden">
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className="truncate max-w-20">{tag}</span>
              ))}
              {tags.length > 3 && <span>+{tags.length - 3}</span>}
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Content for desktop view
  const renderDesktopContent = () => (
    <>
      {/* Desktop header */}
      {renderDesktopEditorHeader()}

      {/* Desktop formatting toolbar */}
      {renderDesktopToolbar()}
      
      {/* Desktop content area */}
      <ScrollArea className="flex-grow">
        <div 
          className="p-6 outline-none whitespace-pre-wrap prose dark:prose-invert prose-sm max-w-none min-h-[300px] note-editor-content"
          ref={contentEditableRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          dir="ltr"
          style={{
            fontFamily: 'system-ui, sans-serif',
            lineHeight: '1.6',
          }}
        />
      </ScrollArea>

      {/* Tags display at the bottom */}
      {tags.length > 0 && (
        <div className="border-t px-4 py-2 text-xs text-muted-foreground flex justify-end items-center bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              <span className="truncate max-w-[150px]">{tags.join(', ')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <motion.div 
      className={cn(
        "flex flex-col h-full",
        isFullscreen && "fixed inset-0 z-50 bg-background"
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {isMobile ? renderMobileContent() : renderDesktopContent()}
    </motion.div>
  );
};

export default NoteEditor;
