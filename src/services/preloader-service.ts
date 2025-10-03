import { QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { fetchUserTrades } from '@/services/trades-service';
import { getCurrentUserRoles } from '@/utils/roles-cache';

export interface PreloadTask {
  name: string;
  weight: number;
  task: () => Promise<void>;
}

export interface PreloadProgress {
  progress: number;
  currentStage: string;
  estimatedTime: number;
}

export class PreloaderService {
  private queryClient: QueryClient;
  private componentCache = new Map<string, any>();
  private startTime: number = 0;
  private totalWeight: number = 0;
  private completedWeight: number = 0;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  async preloadEverything(
    onProgress: (progress: PreloadProgress) => void
  ): Promise<void> {
    this.startTime = Date.now();
    const maxLoadTime = 30000; // 30 seconds max
    
    const tasks: PreloadTask[] = [
      { name: 'Authenticating...', weight: 15, task: this.preloadAuthData },
      { name: 'Loading your trades...', weight: 25, task: this.preloadTradingData },
      { name: 'Preparing academy content...', weight: 20, task: this.preloadAcademyData },
      { name: 'Loading components...', weight: 25, task: this.preloadRouteComponents },
      { name: 'Optimizing assets...', weight: 15, task: this.preloadCriticalAssets }
    ];

    this.totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
    this.completedWeight = 0;

    // Create a timeout promise to prevent infinite loading
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error('Preload timeout after 30 seconds')), maxLoadTime);
    });

    try {
      // Race between all tasks and timeout
      await Promise.race([
        this.executeTasksWithTimeout(tasks, onProgress),
        timeoutPromise
      ]);
    } catch (error) {
      console.error('Preload failed or timed out:', error);
      // Force completion even on timeout/error
      this.completedWeight = this.totalWeight;
      throw error;
    }

    // Final optimization pass
    onProgress(this.getProgress('Finalizing...'));
    await this.finalizePreload();
    this.completedWeight = this.totalWeight;
    
    onProgress(this.getProgress('Ready!'));
  }

  private async executeTasksWithTimeout(
    tasks: PreloadTask[],
    onProgress: (progress: PreloadProgress) => void
  ): Promise<void> {
    for (const task of tasks) {
      try {
        console.log(`Starting preload task: ${task.name}`);
        onProgress(this.getProgress(task.name));
        
        // Add 10 second timeout per task
        const taskPromise = task.task();
        const taskTimeout = new Promise<void>((_, reject) => {
          setTimeout(() => reject(new Error(`Task timeout: ${task.name}`)), 10000);
        });
        
        await Promise.race([taskPromise, taskTimeout]);
        
        this.completedWeight += task.weight;
        console.log(`Completed preload task: ${task.name}`);
      } catch (error) {
        console.error(`Preload task failed: ${task.name}`, error);
        // Continue with other tasks even if one fails
        this.completedWeight += task.weight;
      }
    }
  }

  private preloadAuthData = async (): Promise<void> => {
    try {
      console.log('Starting auth data preload...');
      
      // Fetch and cache user session with timeout
      const sessionPromise = supabase.auth.getSession();
      const { data: { session } } = await Promise.race([
        sessionPromise,
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), 5000)
        )
      ]);
      
      if (!session?.user) {
        console.log('No user session found');
        return;
      }

      console.log('User session found, loading roles...');
      
      // Preload user roles with error handling and timeout
      try {
        await Promise.race([
          getCurrentUserRoles(),
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Roles fetch timeout')), 5000)
          )
        ]);
        console.log('User roles loaded successfully');
      } catch (roleError) {
        console.warn('Failed to load user roles, continuing:', roleError);
        // Don't block preloader for role errors
      }

      // Cache user profile data with timeout
      try {
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle(); // Use maybeSingle to prevent errors when no profile exists

        const { data: profile } = await Promise.race([
          profilePromise,
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
          )
        ]);

        if (profile) {
          this.queryClient.setQueryData(['profile', session.user.id], profile);
          console.log('Profile data cached');
        }
      } catch (profileError) {
        console.warn('Failed to load profile, continuing:', profileError);
      }

      // Cache trial status (optional, don't block on errors)
      try {
        await this.queryClient.prefetchQuery({
          queryKey: ['trial-status'],
          queryFn: async () => {
            const { data } = await supabase
              .from('user_roles')
              .select('*')
              .eq('user_id', session.user.id);
            return data || [];
          },
          retry: 1,
          staleTime: 5 * 60 * 1000
        });
        console.log('Trial status cached');
      } catch (trialError) {
        console.warn('Failed to load trial status, continuing:', trialError);
      }
      
      console.log('Auth data preload completed');
    } catch (error) {
      console.error('Auth preload failed:', error);
      throw error; // Re-throw to trigger timeout handling
    }
  };

  private preloadTradingData = async (): Promise<void> => {
    try {
      // Preload first 200 trades
      await this.queryClient.prefetchQuery({
        queryKey: ['trades'],
        queryFn: () => fetchUserTrades(),
        staleTime: 10 * 60 * 1000 // 10 minutes
      });

      // Preload analytics data
      await this.queryClient.prefetchQuery({
        queryKey: ['analytics-summary'],
        queryFn: async () => {
          const { data } = await supabase
            .from('trades')
            .select('pnl, outcome, entry_date')
            .order('entry_date', { ascending: false })
            .limit(100);
          return data;
        }
      });

      // Preload basic account info
      await this.queryClient.prefetchQuery({
        queryKey: ['user-profile'],
        queryFn: async () => {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', (await supabase.auth.getUser()).data.user?.id)
            .single();
          return data;
        }
      });
    } catch (error) {
      console.error('Trading data preload failed:', error);
    }
  };

  private preloadAcademyData = async (): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Preload academy-related data if available
      await this.queryClient.prefetchQuery({
        queryKey: ['academy-courses'],
        queryFn: async () => {
          const { data } = await supabase
            .from('courses')
            .select('*')
            .limit(10);
          return data;
        }
      });

      // Preload user assignments if available
      await this.queryClient.prefetchQuery({
        queryKey: ['user-assignments'],
        queryFn: async () => {
          const { data } = await supabase
            .from('assignments')
            .select('*')
            .limit(10);
          return data;
        }
      });
    } catch (error) {
      console.error('Academy data preload failed:', error);
    }
  };

  private preloadRouteComponents = async (): Promise<void> => {
    try {
      // Preload critical route components
      const componentImports = [
        () => import('@/pages/IndexPage'),
        () => import('@/pages/TradesPage'),
        () => import('@/pages/CalendarViewPage'),
        () => import('@/pages/WigglyAIPage'),
        () => import('@/pages/AcademyPage'),
        () => import('@/pages/NotebookPage'),
        () => import('@/pages/PlaybooksPage'),
        () => import('@/pages/AnalyticsPage'),
        () => import('@/pages/FundsPage'),
        () => import('@/pages/ProfilePage')
      ];

      // Load components in parallel
      const componentPromises = componentImports.map(async (importFn, index) => {
        try {
          const component = await importFn();
          this.componentCache.set(`component-${index}`, component.default);
          return component;
        } catch (error) {
          console.error(`Failed to preload component ${index}:`, error);
          return null;
        }
      });

      await Promise.allSettled(componentPromises);
    } catch (error) {
      console.error('Component preload failed:', error);
    }
  };

  private preloadCriticalAssets = async (): Promise<void> => {
    try {
      // Preload critical images
      const criticalImages = [
        '/placeholder.svg',
        // Add more critical assets here
      ];

      const imagePromises = criticalImages.map(src => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Continue even if image fails
          img.src = src;
        });
      });

      await Promise.allSettled(imagePromises);

      // Preload chart libraries (warmup)
      await import('recharts');
    } catch (error) {
      console.error('Asset preload failed:', error);
    }
  };

  private finalizePreload = async (): Promise<void> => {
    try {
      // Warm up the cache with some queries
      await this.queryClient.invalidateQueries({ queryKey: ['cache-warmup'] });
      
      // Set preload completion flag
      sessionStorage.setItem('wiggly-preload-complete', 'true');
      sessionStorage.setItem('wiggly-preload-timestamp', Date.now().toString());
    } catch (error) {
      console.error('Finalize preload failed:', error);
    }
  };

  private getProgress(currentStage: string): PreloadProgress {
    const progress = Math.min((this.completedWeight / this.totalWeight) * 100, 100);
    const elapsed = (Date.now() - this.startTime) / 1000;
    const estimatedTotal = elapsed > 0 ? (elapsed / progress) * 100 : 30;
    const estimatedTime = Math.max(estimatedTotal - elapsed, 0);

    return {
      progress,
      currentStage,
      estimatedTime
    };
  }

  getComponentFromCache(key: string): any {
    return this.componentCache.get(key);
  }

  static isPreloadComplete(): boolean {
    const completed = sessionStorage.getItem('wiggly-preload-complete');
    const timestamp = sessionStorage.getItem('wiggly-preload-timestamp');
    
    if (!completed || !timestamp) return false;
    
    // Check if preload is less than 1 hour old
    const preloadTime = parseInt(timestamp);
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - preloadTime) < oneHour;
  }

  static markPreloadExpired(): void {
    sessionStorage.removeItem('wiggly-preload-complete');
    sessionStorage.removeItem('wiggly-preload-timestamp');
  }
}