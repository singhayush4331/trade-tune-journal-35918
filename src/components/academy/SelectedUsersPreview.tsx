
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Users, 
  Target, 
  Trash2
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}

interface Course {
  id: string;
  title: string;
}

interface SelectedUsersPreviewProps {
  selectedUsers: Set<string>;
  users: User[];
  selectedCourse: Course | null;
  onRemoveUser: (userId: string) => void;
  onClearAll: () => void;
  onBulkAssign: () => void;
}

const SelectedUsersPreview: React.FC<SelectedUsersPreviewProps> = ({
  selectedUsers,
  users,
  selectedCourse,
  onRemoveUser,
  onClearAll,
  onBulkAssign
}) => {
  const selectedUsersList = users.filter(user => selectedUsers.has(user.id));

  if (selectedUsers.size === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-4xl bg-card dark:bg-card border border-border rounded-xl shadow-lg z-50 animate-in slide-in-from-bottom-2">
      <div className="p-4">
        {/* Header with selection info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm text-foreground">
              {selectedUsers.size} user{selectedUsers.size > 1 ? 's' : ''} selected
            </span>
            {selectedCourse && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">
                  for <span className="font-medium text-primary">{selectedCourse.title}</span>
                </span>
              </>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Horizontal scrolling user chips */}
        <div className="mb-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
            {selectedUsersList.map((user) => (
              <div
                key={user.id}
                className="flex-shrink-0 flex items-center gap-2 bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 rounded-lg px-3 py-2 min-w-fit"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-primary/80 to-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                  {user.full_name?.charAt(0) || user.email.charAt(0)}
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {user.full_name || user.email.split('@')[0]}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveUser(user.id)}
                  className="h-4 w-4 p-0 hover:bg-destructive/20 hover:text-destructive ml-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClearAll}
            className="flex items-center gap-2 text-xs"
          >
            <Trash2 className="h-3 w-3" />
            Clear All
          </Button>
          
          <Button 
            onClick={onBulkAssign}
            disabled={!selectedCourse}
            size="sm"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-xs"
          >
            <Target className="h-3 w-3" />
            Bulk Assign ({selectedUsers.size})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectedUsersPreview;
