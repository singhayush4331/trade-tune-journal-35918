import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, BookOpen, Pencil, Trash2, BarChart3, ListFilter, Target, BookOpenCheck, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { fetchPlaybookAnalytics } from '@/utils/playbook-utils';
import PlaybookAnalyticsChart from './PlaybookAnalyticsChart';
import { fetchUserPlaybooks, deletePlaybook } from '@/services/playbooks-service';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';
import StrategyChecklistDialog from './StrategyChecklistDialog';

interface Strategy {
  name: string;
  description: string;
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  strategies?: Strategy[];
  strategy?: string;
  createdAt?: string;
  tags?: string[];
  entryRules?: string;
  exitRules?: string;
  riskReward?: string;
  notes?: string;
  winRate?: number;
}

interface PlaybookAnalytics {
  winRate: number;
  totalTrades: number;
  profitLoss: number;
  avgRiskReward: string;
  winningTrades: number;
  losingTrades: number;
}

const PlaybooksManager: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [playbookAnalytics, setPlaybookAnalytics] = useState<Record<string, PlaybookAnalytics>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const { user } = useAuth();
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [playbookToDelete, setPlaybookToDelete] = useState<string | null>(null);

  const loadPlaybooks = async (forceRefresh = false) => {
    if (!user) {
      setPlaybooks([]);
      setPlaybookAnalytics({});
      return;
    }
    
    setIsLoading(true);
    try {
      const { data, error } = await fetchUserPlaybooks();
      
      if (error) {
        console.error("Error fetching playbooks:", error);
        uiToast({
          title: "Error fetching playbooks",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      if (data) {
        setPlaybooks(data);
        
        const analytics = await fetchPlaybookAnalytics(data);
        setPlaybookAnalytics(analytics);
      }
    } catch (err) {
      console.error("Error in loadPlaybooks:", err);
      uiToast({
        title: "Error loading playbooks",
        description: "Failed to load playbooks data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlaybooks();
    
    const handlePlaybookUpdate = () => {
      console.log("PlaybooksManager detected playbook update event");
      loadPlaybooks(true);
    };
    
    const handleTradeUpdate = () => {
      console.log("PlaybooksManager detected trade update event");
      if (playbooks.length > 0) {
        (async () => {
          try {
            const analytics = await fetchPlaybookAnalytics(playbooks);
            setPlaybookAnalytics(analytics);
          } catch (err) {
            console.error("Error updating playbook analytics:", err);
          }
        })();
      }
    };
    
    const handleGlobalRefresh = (event: Event) => {
      console.log("PlaybooksManager detected global refresh event");
      const customEvent = event as CustomEvent;
      
      if (customEvent.detail?.isLogout || customEvent.detail?.newLogin) {
        console.log("Logout or new login detected in playbooks, forcing refresh");
        loadPlaybooks(true);
      } else {
        loadPlaybooks();
      }
    };
    
    const handleCacheClear = () => {
      console.log("PlaybooksManager detected cache clear event");
      setPlaybooks([]);
      setPlaybookAnalytics({});
    };
    
    window.addEventListener('playbookDataUpdated', handlePlaybookUpdate);
    window.addEventListener('tradeDataUpdated', handleTradeUpdate);
    window.addEventListener('globalDataRefresh', handleGlobalRefresh);
    window.addEventListener('clearUserDataCache', handleCacheClear);
    
    return () => {
      window.removeEventListener('playbookDataUpdated', handlePlaybookUpdate);
      window.removeEventListener('tradeDataUpdated', handleTradeUpdate);
      window.removeEventListener('globalDataRefresh', handleGlobalRefresh);
      window.removeEventListener('clearUserDataCache', handleCacheClear);
    };
  }, [user, playbooks.length]);

  const handleCreatePlaybook = () => {
    console.log("Create playbook button clicked");
    navigate('/playbook/create');
  };

  const handleEditPlaybook = (id: string) => {
    navigate(`/playbook/edit/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setPlaybookToDelete(id);
  };

  const confirmDelete = async () => {
    if (!playbookToDelete) return;
    
    try {
      const { error } = await deletePlaybook(playbookToDelete);
      
      if (error) {
        toast.error("Failed to delete playbook");
        return;
      }
      
      setPlaybooks(prevPlaybooks => prevPlaybooks.filter(playbook => playbook.id !== playbookToDelete));
      window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
      toast.success("Playbook deleted successfully");
    } catch (err) {
      console.error("Error deleting playbook:", err);
      toast.error("An error occurred while deleting the playbook");
    } finally {
      setPlaybookToDelete(null);
    }
  };

  const handleCheckStrategy = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setShowChecklist(true);
  };

  const getPlaybookAnalytics = (playbookId: string): PlaybookAnalytics => {
    return playbookAnalytics[playbookId] || {
      winRate: 0,
      totalTrades: 0,
      profitLoss: 0,
      avgRiskReward: "0:0",
      winningTrades: 0,
      losingTrades: 0
    };
  };

  const renderAnalyticsContent = (analytics: PlaybookAnalytics) => {
    if (analytics.totalTrades === 0) {
      return (
        <div className="p-3 bg-card/40 rounded-lg border border-border/20 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 opacity-70" />
            <span>No trade data available</span>
          </div>
        </div>
      );
    }

    return <PlaybookAnalyticsChart {...analytics} />;
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-semibold">My Trading Playbooks</h2>
        <Button onClick={handleCreatePlaybook} variant="gradient" className="shadow-md shadow-primary/10">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create Playbook
        </Button>
      </div>

      {playbooks.length === 0 ? (
        <Card className="border-dashed border-2 bg-gradient-to-br from-muted/20 to-background backdrop-blur-sm">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/5 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary/70" />
            </div>
            <h3 className="text-lg font-medium mb-2">No playbooks yet</h3>
            <p className="text-muted-foreground mb-4">Create your first trading playbook to document your strategies</p>
            <Button onClick={handleCreatePlaybook} variant="gradient" className="shadow-md shadow-primary/10">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Playbook
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {playbooks.map((playbook) => (
            <motion.div key={playbook.id} variants={item} className="h-full">
              <Card className="h-full flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-card/95 border-border/70 hover:border-primary/30">
                <CardHeader className="pb-2 relative">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl flex-shrink-0 shadow-sm">
                      <BookOpenCheck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground relative z-10 group flex items-center">
                        <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent font-bold">
                          {playbook.name}
                        </span>
                        <motion.div 
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Sparkles size={16} className="text-primary animate-pulse-subtle" />
                        </motion.div>
                      </CardTitle>
                      <CardDescription className="relative z-10 mt-1.5 line-clamp-2 text-muted-foreground/90">
                        {playbook.description || "No description provided"}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow px-6">
                  <div className="flex flex-col h-full">
                    {playbook.strategy && (
                      <div className="h-16 overflow-hidden">
                        <p className="text-sm text-muted-foreground/90 line-clamp-2">
                          {playbook.strategy}
                        </p>
                      </div>
                    )}
                    
                    {playbook.tags && playbook.tags.length > 0 && (
                      <div className="h-10 flex items-center my-2">
                        <div className="flex flex-wrap gap-1.5 overflow-hidden">
                          {playbook.tags.slice(0, 3).map((tag, idx) => (
                            <motion.span 
                              key={idx} 
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium"
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.1 * idx, duration: 0.2 }}
                            >
                              {tag}
                            </motion.span>
                          ))}
                          {playbook.tags.length > 3 && (
                            <span className="text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded-full font-medium">
                              +{playbook.tags.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <BarChart3 className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="text-sm font-medium">Performance</h4>
                      </div>
                      {renderAnalyticsContent(getPlaybookAnalytics(playbook.id))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="justify-between border-t pt-4 mt-4 px-6">
                  <div className="flex gap-2">
                    <Button 
                      variant="default"
                      size="sm"
                      onClick={() => handleCheckStrategy(playbook)}
                      className="h-8 bg-gradient-to-r from-primary to-indigo-600 text-white"
                    >
                      <Check className="h-3.5 w-3.5 mr-1.5" />
                      Check
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPlaybook(playbook.id)}
                      className="border-primary/20 hover:bg-primary/10 h-8"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDeleteClick(playbook.id)}
                      className="h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
      
      <AlertDialog open={!!playbookToDelete} onOpenChange={() => setPlaybookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this playbook?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your playbook and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {selectedPlaybook && (
        <StrategyChecklistDialog
          open={showChecklist}
          onOpenChange={setShowChecklist}
          playbook={selectedPlaybook}
        />
      )}
    </div>
  );
};

export default PlaybooksManager;
