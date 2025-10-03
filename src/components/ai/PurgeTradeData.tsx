
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';
import { invalidateAIChatCache } from '@/services/ai-chat-service';
import { clearTradesCache } from '@/services/trades-service';
import { Trash2 } from 'lucide-react';

const PurgeTradeData: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const handlePurgeData = async () => {
    if (confirm("Are you sure you want to purge all trade data? This action cannot be undone.")) {
      try {
        setIsLoading(true);
        // Delete all trades for the current user
        const user = await getSessionUser();
        if (user) {
          const { error } = await supabase
            .from('trades')
            .delete()
            .eq('user_id', user.id);
          
          if (error) throw error;
          
          // Clear all caches
          invalidateAIChatCache();
          clearTradesCache();
          
          // Dispatch events to update all components
          window.dispatchEvent(new CustomEvent('tradeDataUpdated'));
          window.dispatchEvent(new CustomEvent('calendarDataUpdated'));
          window.dispatchEvent(new CustomEvent('dashboardDataUpdated'));
          window.dispatchEvent(new CustomEvent('analyticsDataUpdated'));
          window.dispatchEvent(new CustomEvent('fundsDataUpdated'));
          window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
          
          toast.success("All trade data has been purged successfully");
        } else {
          toast.error("User not authenticated");
        }
      } catch (error) {
        console.error("Error purging trade data:", error);
        toast.error("Failed to purge data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  return (
    <Button 
      variant="destructive" 
      onClick={handlePurgeData} 
      disabled={isLoading} 
      className="mt-4 flex gap-2 items-center"
    >
      <Trash2 className="h-4 w-4" />
      {isLoading ? "Purging data..." : "Purge All Trade Data"}
    </Button>
  );
};

export default PurgeTradeData;
