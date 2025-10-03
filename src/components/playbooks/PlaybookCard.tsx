
import React from 'react';
import { 
  BookOpenCheck, Target, TrendingUp, Trash2, Edit, Tag 
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Playbook } from '@/services/playbooks-service';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlaybookCardProps {
  playbook: Playbook;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  predefinedTags: Array<{ id: string; label: string; color: string }>;
}

const PlaybookCard: React.FC<PlaybookCardProps> = ({ 
  playbook, 
  onEdit, 
  onDelete,
  predefinedTags 
}) => {
  const isMobile = useIsMobile();
  
  const getTagColorById = (tagId: string) => {
    const tag = predefinedTags.find(tag => tag.id === tagId);
    return tag ? tag.color : "bg-primary/20 text-primary";
  };

  const createdDate = playbook.created_at 
    ? new Date(playbook.created_at) 
    : new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border border-primary/10 bg-card overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary">
              <BookOpenCheck className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold line-clamp-1">{playbook.name}</h3>
              {playbook.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                  {playbook.description}
                </p>
              )}
            </div>
          </div>

          {/* Tags */}
          {playbook.tags && playbook.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
              {playbook.tags.slice(0, isMobile ? 2 : 3).map((tagId) => {
                const tag = predefinedTags.find(t => t.id === tagId);
                return (
                  <Badge 
                    key={tagId} 
                    className={`${getTagColorById(tagId)} text-xs`}
                  >
                    {tag?.label || tagId}
                  </Badge>
                );
              })}
              {playbook.tags.length > (isMobile ? 2 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{playbook.tags.length - (isMobile ? 2 : 3)} more
                </Badge>
              )}
            </div>
          )}

          {/* Performance Section */}
          <div className="mt-4 sm:mt-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 text-primary">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <h4 className="text-sm font-semibold">Performance</h4>
            </div>
            
            {/* Performance metrics would go here */}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
            <div className="flex gap-1.5 sm:gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2.5 sm:px-3 text-xs sm:text-sm"
                onClick={() => onEdit(playbook.id)}
              >
                <Edit className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8 px-2.5 sm:px-3 text-xs sm:text-sm"
                onClick={() => onDelete(playbook.id)}
              >
                <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PlaybookCard;
