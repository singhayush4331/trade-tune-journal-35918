
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { Module } from '@/hooks/use-course-editor';

interface ModuleManagerProps {
  modules: Module[];
  onCreateModule: (title: string, description?: string) => Promise<Module | null>;
  onUpdateModule: (moduleId: string, updates: { title?: string; description?: string }) => Promise<boolean>;
  onDeleteModule: (moduleId: string) => Promise<boolean>;
  editingModule?: Module | null;
  onEditingModuleChange?: (module: Module | null) => void;
}

const ModuleManager: React.FC<ModuleManagerProps> = ({
  modules,
  onCreateModule,
  onUpdateModule,
  onDeleteModule,
  editingModule,
  onEditingModuleChange
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  // Effect to open edit dialog when editingModule changes
  useEffect(() => {
    if (editingModule) {
      setFormData({ 
        title: editingModule.title, 
        description: editingModule.description 
      });
    }
  }, [editingModule]);

  const handleCreateModule = async () => {
    if (!formData.title.trim()) return;
    
    const newModule = await onCreateModule(formData.title, formData.description);
    if (newModule) {
      setIsCreateDialogOpen(false);
      setFormData({ title: '', description: '' });
    }
  };

  const handleUpdateModule = async () => {
    if (!editingModule || !formData.title.trim()) return;
    
    const success = await onUpdateModule(editingModule.id, {
      title: formData.title,
      description: formData.description
    });
    
    if (success && onEditingModuleChange) {
      onEditingModuleChange(null);
      setFormData({ title: '', description: '' });
    }
  };

  const handleCloseEditDialog = () => {
    if (onEditingModuleChange) {
      onEditingModuleChange(null);
    }
    setFormData({ title: '', description: '' });
  };

  return (
    <div className="space-y-3">
      {/* Create Module Button */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start gap-2 border-dashed border-primary/50 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4" />
            Add New Module
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Module</DialogTitle>
            <DialogDescription>
              Add a new module to organize your course content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Module Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter module title..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description (Optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this module covers..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateModule} disabled={!formData.title.trim()}>
              Create Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Module Dialog */}
      <Dialog open={!!editingModule} onOpenChange={(open) => !open && handleCloseEditDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Module</DialogTitle>
            <DialogDescription>
              Update the module title and description
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Module Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter module title..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this module covers..."
                rows={3}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog}>
              Cancel
            </Button>
            <Button onClick={handleUpdateModule} disabled={!formData.title.trim()}>
              Update Module
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModuleManager;
