
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Eye, 
  Image, 
  Video, 
  Link, 
  Clock, 
  BookOpen,
  Plus,
  Trash2,
  Upload,
  BarChart3
} from 'lucide-react';

export interface ReadingMaterialData {
  title: string;
  content: string;
  structure: {
    headings: Array<{ level: number; text: string; id: string }>;
    sections: Array<{ title: string; content: string; estimatedTime: number }>;
  };
  media: Array<{ type: 'image' | 'video' | 'link'; url: string; caption?: string; position: string }>;
  settings: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedReadTime: number;
    enableComments: boolean;
    downloadable: boolean;
  };
  metadata: {
    wordCount: number;
    characterCount: number;
    lastModified: Date;
  };
}

interface ReadingMaterialBuilderProps {
  data: ReadingMaterialData;
  onChange: (data: ReadingMaterialData) => void;
}

const ReadingMaterialBuilder: React.FC<ReadingMaterialBuilderProps> = ({
  data,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const updateData = (field: string, value: any) => {
    const newData = { ...data };
    const keys = field.split('.');
    let current = newData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onChange(newData);
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const extractHeadings = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/\s+/g, '-')
      });
    }
    
    return headings;
  };

  useEffect(() => {
    const wordCount = data.content.split(/\s+/).length;
    const characterCount = data.content.length;
    const estimatedReadTime = calculateReadingTime(data.content);
    const headings = extractHeadings(data.content);
    
    updateData('metadata', {
      wordCount,
      characterCount,
      lastModified: new Date()
    });
    
    updateData('settings.estimatedReadTime', estimatedReadTime);
    updateData('structure.headings', headings);
  }, [data.content]);

  const addMediaItem = () => {
    const newMedia = {
      type: 'image' as const,
      url: '',
      caption: '',
      position: 'inline'
    };
    
    updateData('media', [...data.media, newMedia]);
  };

  const removeMediaItem = (index: number) => {
    const newMedia = data.media.filter((_, i) => i !== index);
    updateData('media', newMedia);
  };

  const updateMediaItem = (index: number, field: string, value: string) => {
    const newMedia = [...data.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    updateData('media', newMedia);
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Reading Material Builder</CardTitle>
            <CardDescription className="flex items-center gap-4 mt-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {data.settings.estimatedReadTime} min read
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {data.metadata.wordCount} words
              </span>
              <Badge variant="outline" className="text-xs">
                {data.settings.difficulty}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 bg-muted/50">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Media
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Title</label>
                <Input
                  value={data.title}
                  onChange={(e) => updateData('title', e.target.value)}
                  placeholder="Enter reading material title..."
                  className="h-12 text-lg border-2 focus:border-primary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Main Content
                  <Badge variant="secondary" className="text-xs">
                    Markdown supported
                  </Badge>
                </label>
                <Textarea
                  value={data.content}
                  onChange={(e) => updateData('content', e.target.value)}
                  placeholder="Write your reading material content here. Use markdown for formatting:

# Main Heading
## Subheading
### Sub-subheading

**Bold text** and *italic text*

- Bullet points
- Another point

1. Numbered lists
2. Second item

[Links](https://example.com)

> Blockquotes for important notes

```
Code blocks for examples
```"
                  rows={20}
                  className="border-2 focus:border-primary transition-colors resize-none font-mono text-sm leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{data.metadata.wordCount}</div>
                  <div className="text-sm text-muted-foreground">Words</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{data.metadata.characterCount}</div>
                  <div className="text-sm text-muted-foreground">Characters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{data.settings.estimatedReadTime}m</div>
                  <div className="text-sm text-muted-foreground">Read Time</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Media Assets</h3>
              <Button onClick={addMediaItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>

            <div className="space-y-4">
              {data.media.map((item, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <Select
                        value={item.type}
                        onValueChange={(value: 'image' | 'video' | 'link') => 
                          updateMediaItem(index, 'type', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="image">📷 Image</SelectItem>
                          <SelectItem value="video">🎥 Video</SelectItem>
                          <SelectItem value="link">🔗 Link</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-4">
                      <Input
                        value={item.url}
                        onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                        placeholder="Media URL..."
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={item.caption || ''}
                        onChange={(e) => updateMediaItem(index, 'caption', e.target.value)}
                        placeholder="Caption (optional)..."
                      />
                    </div>
                    <div className="col-span-2">
                      <Select
                        value={item.position}
                        onValueChange={(value) => updateMediaItem(index, 'position', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inline">Inline</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMediaItem(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {data.media.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No media added yet</p>
                  <p className="text-sm">Add images, videos, or links to enhance your content</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="structure" className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Structure</h3>
              
              {data.structure.headings.length > 0 ? (
                <Card className="p-4">
                  <h4 className="font-medium mb-3">Table of Contents</h4>
                  <div className="space-y-2">
                    {data.structure.headings.map((heading, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="text-sm text-muted-foreground"
                          style={{ marginLeft: `${(heading.level - 1) * 20}px` }}
                        >
                          H{heading.level}
                        </div>
                        <div className="flex-1 text-sm">{heading.text}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Add headings to your content to see the structure</p>
                  <p className="text-sm">Use # ## ### for markdown headings</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Content Settings</h4>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <Select
                    value={data.settings.difficulty}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      updateData('settings.difficulty', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">🟢 Beginner</SelectItem>
                      <SelectItem value="intermediate">🟡 Intermediate</SelectItem>
                      <SelectItem value="advanced">🔴 Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Access Options</h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Enable Comments</span>
                      <p className="text-xs text-muted-foreground">Allow students to ask questions</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.settings.enableComments}
                      onChange={(e) => updateData('settings.enableComments', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">Downloadable</span>
                      <p className="text-xs text-muted-foreground">Allow PDF download</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={data.settings.downloadable}
                      onChange={(e) => updateData('settings.downloadable', e.target.checked)}
                      className="rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReadingMaterialBuilder;
