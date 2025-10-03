
import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';
import { invalidateAIChatCache } from '@/services/ai-chat-service';
import { clearTradesCache } from '@/services/trades-service';
import { removeMockData } from '@/services/mock-data-service';
import { toast } from 'sonner';

export const resetMockData = async () => {
  try {
    // Get current user
    const user = await getSessionUser();
    if (!user) {
      toast.error("User not authenticated");
      return false;
    }
    
    // Remove mock data first
    removeMockData();
    
    // Forcefully clear any potential mock data from various sources
    console.log("Clearing potential mock data sources");
    
    // Clear all caches
    invalidateAIChatCache();
    clearTradesCache();
    
    // Dispatch events to reset all data-dependent components
    window.dispatchEvent(new CustomEvent('tradeDataUpdated'));
    window.dispatchEvent(new CustomEvent('calendarDataUpdated'));
    window.dispatchEvent(new CustomEvent('dashboardDataUpdated'));
    window.dispatchEvent(new CustomEvent('analyticsDataUpdated'));
    window.dispatchEvent(new CustomEvent('fundsDataUpdated'));
    window.dispatchEvent(new CustomEvent('playbookDataUpdated'));
    
    toast.success("All potential mock data sources have been reset");
    return true;
  } catch (error) {
    console.error("Error resetting mock data:", error);
    toast.error("Failed to reset data sources");
    return false;
  }
};
