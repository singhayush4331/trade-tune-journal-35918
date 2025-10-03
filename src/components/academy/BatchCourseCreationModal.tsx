
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, BookOpen, Users, Calendar } from 'lucide-react';
import { createCourse, getAllCoursesAdmin, type Course } from '@/services/academy-service';
import { toast } from 'sonner';

interface BatchCourseCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const BatchCourseCreationModal: React.FC<BatchCourseCreationModalProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [nextBatchNumber, setNextBatchNumber] = useState<number>(120);
  const [formData, setFormData] = useState({
    batchNumber: '',
    instructor: '',
    description: '',
    duration: 480, // 8 hours default
    price: 0,
    difficultyLevel: 'intermediate' as 'beginner' | 'intermediate' | 'advanced',
    category: 'trading' as 'trading' | 'technical' | 'options' | 'crypto',
    tags: [] as string[],
    prerequisites: [] as string[]
  });
  const [newTag, setNewTag] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');

  useEffect(() => {
    if (open) {
      loadNextBatchNumber();
      setFormData(prev => ({ ...prev, batchNumber: nextBatchNumber.toString() }));
    }
  }, [open, nextBatchNumber]);

  const loadNextBatchNumber = async () => {
    try {
      const courses = await getAllCoursesAdmin();
      const batchCourses = courses.filter(course => 
        course.title.toLowerCase().includes('master class batch')
      );
      
      if (batchCourses.length === 0) {
        setNextBatchNumber(120);
      } else {
        const batchNumbers = batchCourses
          .map(course => {
            const match = course.title.match(/batch\s+(\d+)/i);
            return match ? parseInt(match[1]) : 0;
          })
          .filter(num => num > 0);
        
        const maxBatch = Math.max(...batchNumbers);
        setNextBatchNumber(maxBatch + 1);
      }
    } catch (error) {
      console.error('Error loading batch numbers:', error);
      setNextBatchNumber(120);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const handleRemovePrerequisite = (prereqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prereq => prereq !== prereqToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        title: `Master Class Batch ${formData.batchNumber}`,
        description: formData.description || `Master Class Batch ${formData.batchNumber} - Comprehensive trading course`,
        instructor: formData.instructor || 'Academy Team',
        difficulty_level: formData.difficultyLevel,
        duration: formData.duration,
        price: formData.price,
        status: 'draft' as const,
        category: formData.category,
        tags: ['master-class', 'batch', `batch-${formData.batchNumber}`, ...formData.tags],
        prerequisites: formData.prerequisites,
        thumbnail_url: null,
        intro_video_url: null
      };

      const result = await createCourse(courseData);
      if (result) {
        toast.success(`Master Class Batch ${formData.batchNumber} created successfully!`);
        onSuccess();
        onOpenChange(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error creating batch course:', error);
      toast.error('Failed to create batch course');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      batchNumber: '',
      instructor: '',
      description: '',
      duration: 480,
      price: 0,
      difficultyLevel: 'intermediate',
      category: 'trading',
      tags: [],
      prerequisites: []
    });
    setNewTag('');
    setNewPrerequisite('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Create New Batch Course
          </DialogTitle>
          <DialogDescription>
            Create a new Master Class batch with auto-generated batch number
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Batch Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Batch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input
                    id="batchNumber"
                    value={formData.batchNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                    placeholder="120"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={(e) => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="Academy Team"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Comprehensive trading course covering all essential topics..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficultyLevel}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                      setFormData(prev => ({ ...prev, difficultyLevel: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'trading' | 'technical' | 'options' | 'crypto') => 
                      setFormData(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trading">Trading</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="options">Options</SelectItem>
                      <SelectItem value="crypto">Crypto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">master-class</Badge>
                <Badge variant="secondary">batch</Badge>
                <Badge variant="secondary">batch-{formData.batchNumber}</Badge>
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prerequisites</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newPrerequisite}
                  onChange={(e) => setNewPrerequisite(e.target.value)}
                  placeholder="Add a prerequisite..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                />
                <Button type="button" onClick={handleAddPrerequisite} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {prereq}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemovePrerequisite(prereq)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">Course Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Title:</strong> Master Class Batch {formData.batchNumber}</p>
                <p><strong>Instructor:</strong> {formData.instructor || 'Academy Team'}</p>
                <p><strong>Duration:</strong> {Math.floor(formData.duration / 60)}h {formData.duration % 60}m</p>
                <p><strong>Price:</strong> {formData.price > 0 ? `₹${formData.price}` : 'Free'}</p>
                <p><strong>Difficulty:</strong> {formData.difficultyLevel}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Batch Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BatchCourseCreationModal;
