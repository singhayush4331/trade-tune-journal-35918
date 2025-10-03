import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { checkOnboardingStatus, refreshUserSession } from '@/services/auth-service';
import { getSessionUser } from '@/utils/auth-cache';
import { getCurrentUserRoles } from '@/utils/roles-cache';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  refreshData: () => void;
}

// Create a context for global refresh events
export const DataRefreshContext = createContext<() => void>(() => {});

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  refreshData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const navigate = useNavigate();

  const refreshData = (() => {
    let last = 0;
    return () => {
      const now = Date.now();
      if (now - last < 2000) {
        // Throttled: avoid event storms
        return;
      }
      last = now;
      console.log("Triggering global data refresh");
const refreshEvent = new CustomEvent('globalDataRefresh', { detail: { timestamp: Date.now() } });
window.dispatchEvent(refreshEvent);
window.dispatchEvent(new Event('clearUserDataCache'));
window.dispatchEvent(new Event('tradeDataUpdated'));
window.dispatchEvent(new Event('dashboardDataUpdated'));
window.dispatchEvent(new Event('calendarDataUpdated'));
window.dispatchEvent(new Event('playbookDataUpdated'));
window.dispatchEvent(new Event('fundsDataUpdated'));
window.dispatchEvent(new Event('analyticsDataUpdated'));
    };
  })();

  // Check if user is currently in password reset flow with custom token
  const isInPasswordResetFlow = () => {
    const currentPath = window.location.pathname;
    const hasCustomResetToken = new URLSearchParams(window.location.search).has('token');
    
    return currentPath === '/reset-password' && hasCustomResetToken;
  };

// Debounced role check to prevent multiple rapid API calls
const debouncedRoleCheck = (() => {
  let timeout: NodeJS.Timeout;
  return (userId: string, callback: (result: any) => void) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        const { roles } = await getCurrentUserRoles();
        const hasAcademyRole = roles.includes('academy_student');
        const hasOtherRoles = roles.some(role => 
          ['premium_user', 'admin', 'Free User', 'Trial User', 'basic_user', 'moderator', 'free_user'].includes(role)
        );
        const isAcademyOnly = hasAcademyRole && !hasOtherRoles;
        callback({ isAcademyOnly, roleNames: roles });
      } catch (error) {
        console.error('Error in debouncedRoleCheck:', error);
        callback({ isAcademyOnly: false, roleNames: [] });
      }
    }, 300);
  };
})();

  // Consolidated redirect logic with debouncing - UPDATED to handle signup types
  const handleUserRedirect = (() => {
    let timeout: NodeJS.Timeout;
    return (userId: string, isNewUser: boolean = false) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (redirectAttempted) {
          console.log('Redirect already attempted, skipping');
          return;
        }

        try {
          // Skip automated redirects for email verification flow
          const isEmailVerificationFlow = window.location.pathname === '/email-verification';
          if (isEmailVerificationFlow) {
            console.log('Detected email verification flow, skipping redirect check');
            return;
          }

          // Skip redirects if user is in password reset flow with custom token
          if (isInPasswordResetFlow()) {
            // Skip automatic redirects for password reset flow
            return;
          }

          // Get user data to check signup type
          const userData = await getSessionUser();
          const signupType = userData?.user_metadata?.signup_type;
          
          // Check signup type for routing
          
          // Handle Academy/Haven Ark signups differently
          if (signupType === 'haven_ark' || signupType === 'academy') {
            console.log(`${signupType} user detected - redirecting to academy`);
            // Skip Wiggly onboarding for Academy/Haven Ark users
            if (window.location.pathname === '/login' || window.location.pathname === '/signup' || window.location.pathname === '/') {
              setRedirectAttempted(true);
              navigate('/academy', { replace: true });
            }
            return;
          }
          
          // For Wiggly users, check onboarding status
          const { completed } = await checkOnboardingStatus();
          
          if (isNewUser || !completed) {
            if (window.location.pathname !== '/onboarding') {
              console.log('Redirecting to onboarding page');
              setRedirectAttempted(true);
              navigate('/onboarding', { replace: true });
            }
          } else {
            // Use debounced role check for existing Wiggly users
            debouncedRoleCheck(userId, ({ isAcademyOnly }) => {
              if (isAcademyOnly) {
                // Define allowed paths for academy users
                const allowedPaths = [
                  '/academy',
                  '/subscription', 
                  '/profile',
                  '/account-settings',
                  '/onboarding'
                ];
                
                const currentPath = window.location.pathname;
                const isOnAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
                
                // Only redirect academy users from login/signup pages or root
                if (currentPath === '/login' || currentPath === '/signup' || currentPath === '/') {
                  console.log('Academy-only user detected - redirecting to academy from:', currentPath);
                  setRedirectAttempted(true);
                  navigate('/academy', { replace: true });
                } else if (!isOnAllowedPath) {
                  // If they're trying to access other platform pages they don't have access to
                  console.log('Academy-only user trying to access restricted page:', currentPath, '- redirecting to academy');
                  setRedirectAttempted(true);
                  navigate('/academy', { replace: true });
                } else {
                  console.log('Academy-only user on allowed path:', currentPath, '- no redirect needed');
                }
              } else {
                // Regular users - only redirect from login/signup pages
                if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
                  console.log('Redirecting regular user to dashboard from login/signup');
                  setRedirectAttempted(true);
                  navigate('/dashboard', { replace: true });
                } else {
                  console.log('Regular user - staying on current page:', window.location.pathname);
                }
              }
            });
          }
        } catch (err) {
          console.error('Error in handleUserRedirect:', err);
        }
      }, 500);
    };
  })();

  const handleSandboxReload = () => {
    console.log("Sandbox reload detected, refreshing session and data");
    setTimeout(async () => {
      try {
        const { data, error } = await refreshUserSession();
        if (error) throw error;
        
        console.log("Session refreshed after sandbox reload:", data ? "Success" : "No active session");
      } catch (err) {
        console.error("Error refreshing after sandbox reload:", err);
      }
    }, 0);
  };

  useEffect(() => {
    let unloaded = false;
    
    window.addEventListener('beforeunload', () => {
      unloaded = true;
      sessionStorage.setItem('last_unload', Date.now().toString());
    });
    
    const lastUnload = sessionStorage.getItem('last_unload');
    const now = Date.now();
    
    if (lastUnload) {
      const timeSinceUnload = now - parseInt(lastUnload);
      if (timeSinceUnload < 5000) {
        handleSandboxReload();
      }
    }
    
    const getInitialSession = async () => {
      try {
        // Clear the redirect attempt flag to prevent navigation loops
        sessionStorage.removeItem('authRedirectAttempt');
        
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          setPreviousUserId(data.session.user.id);
          
          // Only redirect if not in custom token password reset flow
          if (!isInPasswordResetFlow()) {
            setTimeout(() => handleUserRedirect(data.session.user.id), 0);
          }
          
          setTimeout(() => refreshData(), 100);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Auth state changed - removed sensitive logging
        
        const currentUserId = session?.user?.id || null;
        const userChanged = currentUserId !== previousUserId;
        const isEmailVerificationFlow = window.location.pathname === '/email-verification';
        
        if (userChanged && currentUserId && previousUserId) {
          console.log('User switched from', previousUserId, 'to', currentUserId);
          
          // Clear any cached data specifically on user change
          window.dispatchEvent(new CustomEvent('clearUserDataCache'));
          
          // Then refresh data for the new user
          setTimeout(() => refreshData(), 100);
        }
        
        if (currentUserId) {
          setPreviousUserId(currentUserId);
        }
        
        // Always update the auth state to reflect current reality
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // For SIGNED_OUT event, we don't want to trigger redirects
        if (event === 'SIGNED_OUT') {
          console.log('User signed out, clearing data cache');
          
          // Clear redirect attempt flag
          sessionStorage.removeItem('authRedirectAttempt');
          setRedirectAttempted(false);
          
          // Clear data on sign out
          window.dispatchEvent(new CustomEvent('clearUserDataCache'));
          
          if (window.caches) {
            try {
              caches.keys().then(names => {
                names.forEach(name => {
                  caches.delete(name);
                });
              });
            } catch (e) {
              console.error('Error clearing cache:', e);
            }
          }
          
          return; // Exit early to avoid redirect loops
        }
        
        if (event === 'SIGNED_IN') {
          // Mark that authentication happened
          sessionStorage.setItem('authenticated', 'true');
          setRedirectAttempted(false);
          
          setTimeout(() => refreshData(), 100);
          
          // Skip automatic redirects for email verification flow or custom token password reset flow
          if (isEmailVerificationFlow || isInPasswordResetFlow()) {
            // Skip automatic redirects for verification flows
            return;
          }
          
          setTimeout(async () => {
            const isNewUser = session?.user && !session.user.last_sign_in_at;
            // Handle user authentication event
            
            // Use the consolidated redirect logic
            await handleUserRedirect(session.user.id, isNewUser);
          }, 0);
        }
      }
    );

    const handleDataRefresh = (event: Event) => {
      console.log("Global data refresh event received");
      const customEvent = event as CustomEvent;
      
      if (customEvent.detail?.isLogout) {
        console.log("Logout refresh event detected");
      }
      
      if (customEvent.detail?.newLogin) {
        console.log("New login refresh event detected - ensuring fresh data");
        // Force a data refresh on components
        window.dispatchEvent(new Event('tradeDataUpdated'));
        window.dispatchEvent(new Event('dashboardDataUpdated'));
        window.dispatchEvent(new Event('calendarDataUpdated'));
        window.dispatchEvent(new Event('playbookDataUpdated'));
      }
    };

    window.addEventListener('globalDataRefresh', handleDataRefresh);
    
    window.addEventListener('focus', () => {
      if (!unloaded) {
        console.log("Window focus detected, refreshing data");
        setTimeout(() => refreshData(), 100);
      }
      unloaded = false;
    });

    return () => {
      authListener?.subscription.unsubscribe();
      window.removeEventListener('globalDataRefresh', handleDataRefresh);
      window.removeEventListener('focus', () => {});
      window.removeEventListener('beforeunload', () => {});
    };
  }, [navigate, previousUserId]);

  const value = {
    user,
    session,
    isLoading,
    refreshData,
  };

  return (
    <AuthContext.Provider value={value}>
      <DataRefreshContext.Provider value={refreshData}>
        {children}
      </DataRefreshContext.Provider>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const useDataRefresh = () => {
  return useContext(DataRefreshContext);
};

export default useAuth;
