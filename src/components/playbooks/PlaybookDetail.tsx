
import React, { useState } from 'react';
import { 
  BookOpenCheck, Target, TrendingUp, BarChart3, Calendar, Tag, 
  AlertCircle, CheckCircle
} from 'lucide-react';
import { Playbook } from '@/services/playbooks-service';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import StrategyChecklistDialog from './StrategyChecklistDialog';
import { useIsSmall } from '@/hooks/use-mobile';

interface PlaybookDetailProps {
  playbook: Playbook;
  predefinedTags: Array<{ id: string; label: string; color: string }>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PlaybookDetail: React.FC<PlaybookDetailProps> = ({
  playbook,
  predefinedTags,
  onEdit,
  onDelete
}) => {
  const [showChecklist, setShowChecklist] = useState(false);
  const isSmallScreen = useIsSmall();

  const getTagColorById = (tagId: string) => {
    const tag = predefinedTags.find(tag => tag.id === tagId);
    return tag ? tag.color : "bg-primary/20 text-primary";
  };

  const createdDate = playbook.created_at 
    ? new Date(playbook.created_at) 
    : new Date();

  return (
    <div className="space-y-6">
      {/* Header with new Check Strategy button */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-full bg-primary/10 text-primary">
            <BookOpenCheck className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{playbook.name}</h1>
            {playbook.description && (
              <p className="text-muted-foreground mt-1">{playbook.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="default"
            onClick={() => setShowChecklist(true)}
            className="h-10 px-4 md:h-9 bg-gradient-to-r from-primary to-indigo-600 text-white w-full sm:w-auto"
          >
            <Target className="h-4 w-4 mr-2" />
            Check Strategy
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onEdit(playbook.id)}
            className="h-10 px-4 md:h-9 w-full sm:w-auto"
          >
            <Target className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(playbook.id)}
            className="h-10 px-4 md:h-9 w-full sm:w-auto"
          >
            <AlertCircle className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      {/* Tags */}
      {playbook.tags && playbook.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {playbook.tags.map((tagId) => {
            const tag = predefinedTags.find(t => t.id === tagId);
            return (
              <Badge 
                key={tagId} 
                className={`${getTagColorById(tagId)} text-sm py-1.5`}
              >
                {tag?.label || tagId}
              </Badge>
            );
          })}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entry Rules */}
        {playbook.entry_rules && (
          <Card className="border border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Entry Rules</h3>
              </div>
              <p className="whitespace-pre-line">{playbook.entry_rules}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Exit Rules */}
        {playbook.exit_rules && (
          <Card className="border border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Exit Rules</h3>
              </div>
              <p className="whitespace-pre-line">{playbook.exit_rules}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk/Reward */}
        {playbook.risk_reward && (
          <Card className="border border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-amber-500/10 text-amber-500">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Risk/Reward</h3>
              </div>
              <p className="whitespace-pre-line">{playbook.risk_reward}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Notes */}
        {playbook.notes && (
          <Card className="border border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-indigo-500/10 text-indigo-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">Notes</h3>
              </div>
              <p className="whitespace-pre-line">{playbook.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <StrategyChecklistDialog
        open={showChecklist}
        onOpenChange={setShowChecklist}
        playbook={playbook}
      />
    </div>
  );
};

export default PlaybookDetail;
