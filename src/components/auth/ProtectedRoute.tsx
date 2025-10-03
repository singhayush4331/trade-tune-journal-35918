
import React, { useState, useEffect, useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';
import { PreloaderService } from '@/services/preloader-service';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
  allowAcademyOnlyUsers?: boolean;
  title?: string;
  description?: string;
}

interface AccessState {
  hasAccess: boolean;
  loading: boolean;
  checked: boolean;
  error?: string;
  isAcademyOnly?: boolean;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireSubscription = true,
  allowAcademyOnlyUsers = false,
  title,
  description
}) => {
  const { user, isLoading } = useAuth();
  const [accessState, setAccessState] = useState<AccessState>({
    hasAccess: false,
    loading: true,
    checked: false
  });
  const location = useLocation();
  const { toast } = useToast();

  // Memoize the check key to prevent unnecessary re-checks
  const checkKey = useMemo(() => {
    if (!user?.id) return null;
    return `${user.id}-${requireSubscription}-${allowAcademyOnlyUsers}-${location.pathname}`;
  }, [user?.id, requireSubscription, allowAcademyOnlyUsers, location.pathname]);

  // Reset access state when user changes or key changes
  useEffect(() => {
    if (checkKey && !accessState.checked) {
      console.log('ProtectedRoute: Resetting access state for new check:', checkKey);
      setAccessState({
        hasAccess: false,
        loading: true,
        checked: false
      });
    }
  }, [checkKey, accessState.checked]);

  // Main access check effect
  useEffect(() => {
    const checkAccess = async () => {
      if (!user || accessState.checked || isLoading) {
        console.log('ProtectedRoute: Skipping access check', {
          hasUser: !!user,
          checked: accessState.checked,
          isLoading
        });
        return;
      }

      console.log('ProtectedRoute: Starting access check for user:', user.id, {
        requireSubscription,
        allowAcademyOnlyUsers,
        pathname: location.pathname
      });

      try {
        // Fetch user roles via cache
        const { roles: userRoles, maxHierarchyLevel } = await getCurrentUserRoles();
        const isAdmin = maxHierarchyLevel >= 90;
        const hasAcademyRole = userRoles.includes('academy_student');
        
        // Academy-only users are those who have academy_student role and no significant platform roles
        const isAcademyOnly = hasAcademyRole && !isAdmin && !userRoles.some(role => 
          ['premium_user', 'basic_user', 'Trial User', 'Free User'].includes(role)
        );
        
        const hasSubscription = userRoles.some(role => 
          ['premium_user', 'admin', 'basic_user', 'Trial User', 'Free User'].includes(role)
        );

        console.log('ProtectedRoute: User role analysis:', {
          userRoles,
          maxHierarchyLevel,
          isAdmin,
          hasAcademyRole,
          isAcademyOnly,
          hasSubscription,
          rolesCount: userRoles.length,
          currentPath: location.pathname
        });

        // CRITICAL: Academy-only users should NEVER access non-academy routes
        if (isAcademyOnly && !allowAcademyOnlyUsers) {
          console.log('ProtectedRoute: BLOCKING academy-only user from platform route:', location.pathname);
          setAccessState({
            hasAccess: false,
            loading: false,
            checked: true,
            isAcademyOnly: true,
            redirectPath: '/academy'
          });
          return;
        }

        // Admin access check for specific routes
        if (location.pathname === '/academy/admin') {
          if (!isAdmin) {
            console.log('ProtectedRoute: Access denied - admin required for academy admin panel');
            setAccessState({
              hasAccess: false,
              loading: false,
              checked: true,
              redirectPath: '/academy'
            });
            return;
          }
        }

        // Early exit for admin users - they have access to everything
        if (isAdmin) {
          console.log('ProtectedRoute: Access granted - user is admin');
          setAccessState({
            hasAccess: true,
            loading: false,
            checked: true
          });
          return;
        }

        // Handle academy routes specifically
        if (allowAcademyOnlyUsers) {
          console.log('ProtectedRoute: Checking academy access...');
          
          // Grant access if user is academy-only OR has subscription
          if (isAcademyOnly || hasSubscription) {
            console.log('ProtectedRoute: Academy access granted -', isAcademyOnly ? 'academy-only user' : 'subscription user');
            setAccessState({
              hasAccess: true,
              loading: false,
              checked: true
            });
            return;
          }
          
          console.log('ProtectedRoute: Academy access denied - no valid role found');
          setAccessState({
            hasAccess: false,
            loading: false,
            checked: true,
            redirectPath: '/subscription'
          });
          return;
        }

        // Handle platform routes with subscription requirement
        if (requireSubscription) {
          // STRICT CHECK: Academy-only users should never reach here, but double-check
          if (isAcademyOnly) {
            console.log('ProtectedRoute: CRITICAL - Academy-only user attempted platform access, redirecting');
            setAccessState({
              hasAccess: false,
              loading: false,
              checked: true,
              isAcademyOnly: true,
              redirectPath: '/academy'
            });
            return;
          }

          if (hasSubscription) {
            console.log('ProtectedRoute: Subscription access granted');
            setAccessState({
              hasAccess: true,
              loading: false,
              checked: true
            });
          } else {
            console.log('ProtectedRoute: Subscription access denied - no valid subscription role');
            setAccessState({
              hasAccess: false,
              loading: false,
              checked: true,
              redirectPath: '/subscription'
            });
          }
        } else {
          // If no subscription required, grant access to authenticated users (except academy-only)
          if (!isAcademyOnly) {
            console.log('ProtectedRoute: No subscription required - access granted');
            setAccessState({
              hasAccess: true,
              loading: false,
              checked: true
            });
          } else {
            console.log('ProtectedRoute: Academy-only user denied access to non-academy page');
            setAccessState({
              hasAccess: false,
              loading: false,
              checked: true,
              isAcademyOnly: true,
              redirectPath: '/academy'
            });
          }
        }
        
      } catch (error) {
        console.error('ProtectedRoute: Error during access check:', error);
        setAccessState({
          hasAccess: false,
          loading: false,
          checked: true,
          error: 'Access check failed',
          redirectPath: '/academy'
        });
      }
    };

    if (user && !accessState.checked && !isLoading) {
      console.log('ProtectedRoute: Triggering access check...');
      checkAccess();
    }
  }, [user, accessState.checked, isLoading, requireSubscription, allowAcademyOnlyUsers, location.pathname]);

  // Handle redirects and toasts in a separate effect to avoid render loops
  useEffect(() => {
    if (!accessState.loading && accessState.checked && !accessState.hasAccess && accessState.redirectPath) {
      console.log('ProtectedRoute: Preparing redirect to:', accessState.redirectPath);
      
      if (accessState.isAcademyOnly && accessState.redirectPath === '/academy') {
        // Silent redirect for academy users trying to access platform
        console.log('ProtectedRoute: Silent redirect for academy-only user');
      } else if (accessState.redirectPath === '/subscription') {
        toast({
          title: "Subscription Required",
          description: "You need an active subscription to access this page.",
        });
      } else {
        toast({
          title: "Access Denied",
          description: "You do not have permission to access this page.",
        });
      }
    }
  }, [accessState.loading, accessState.checked, accessState.hasAccess, accessState.redirectPath, accessState.isAcademyOnly, toast]);

  // Show loading while auth is loading or access check is in progress
  // Use minimal loading if preload is complete for instant feel
  if (isLoading || accessState.loading) {
    console.log('ProtectedRoute: Showing loading state - isLoading:', isLoading, 'accessLoading:', accessState.loading);
    
    const isPreloadComplete = PreloaderService.isPreloadComplete();
    
    if (isPreloadComplete && !isLoading) {
      // Minimal loading for already preloaded content
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      );
    }
    
    return (
      <div className="grid h-screen place-items-center">
        <span className="loader"></span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('ProtectedRoute: No user found, redirecting to login');
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  // Handle access denial with redirect
  if (!accessState.hasAccess && accessState.redirectPath) {
    console.log('ProtectedRoute: Redirecting to:', accessState.redirectPath);
    return <Navigate to={accessState.redirectPath} replace />;
  }

  // Render children if access is granted
  console.log('ProtectedRoute: Rendering children - access granted');
  return (
    <>
      {title && (
        <Helmet>
          <title>{title}</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
      )}
      {children}
    </>
  );
};

export default ProtectedRoute;
