
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';
import { getUserAssignedCourses } from '@/services/academy-service';

const SmartRedirect: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const determineRedirectPath = async () => {
      if (!user || isLoading) {
        return;
      }

      console.log('SmartRedirect: Determining redirect path for user:', user.id);

      try {
        const { roles: userRoles, maxHierarchyLevel } = await getCurrentUserRoles();
        const isAdmin = maxHierarchyLevel >= 90;
        
        // Simplified role checking - unified academy system
        const hasWigglyOnlyRole = userRoles.includes('wiggly_only');
        const hasAcademyRole = userRoles.includes('academy_student');
        
        // Check if user should be restricted to academy only
        const isAcademyOnly = hasAcademyRole && !isAdmin && !userRoles.some(role => 
          ['premium_user', 'basic_user', 'Trial User', 'Free User', 'wiggly_only'].includes(role)
        );
        
        const hasSubscription = userRoles.some(role => 
          ['premium_user', 'admin', 'basic_user', 'Trial User', 'Free User', 'wiggly_only'].includes(role)
        );

        console.log('SmartRedirect: User role analysis:', {
          userRoles,
          maxHierarchyLevel,
          isAdmin,
          hasWigglyOnlyRole,
          hasAcademyRole,
          isAcademyOnly,
          hasSubscription
        });

        // Simplified routing logic
        if (hasWigglyOnlyRole) {
          console.log('SmartRedirect: Wiggly-only user detected, redirecting to dashboard');
          setRedirectPath('/dashboard');
        } else if (isAcademyOnly) {
          console.log('SmartRedirect: Academy user detected, checking for assigned courses...');
          
          try {
            const assignedCourses = await getUserAssignedCourses();
            console.log('SmartRedirect: Assigned courses check result:', assignedCourses.length);
            
            if (assignedCourses.length > 0) {
              console.log('SmartRedirect: Academy user has assigned courses, redirecting to my-courses');
              setRedirectPath('/academy/my-courses');
            } else {
              console.log('SmartRedirect: Academy user has no assigned courses, redirecting to academy');
              setRedirectPath('/academy');
            }
          } catch (courseError) {
            console.error('SmartRedirect: Error checking assigned courses:', courseError);
            // Default to academy page if there's an error
            setRedirectPath('/academy');
          }
        } else if (isAdmin || hasSubscription) {
          console.log('SmartRedirect: Redirecting to dashboard (admin or subscription user)');
          setRedirectPath('/dashboard');
        } else {
          console.log('SmartRedirect: No specific access, redirecting to dashboard');
          setRedirectPath('/dashboard');
        }

        setChecking(false);
      } catch (error) {
        console.error('SmartRedirect: Error during role check:', error);
        setRedirectPath('/dashboard'); // Default fallback
        setChecking(false);
      }
    };

    if (user && !isLoading) {
      determineRedirectPath();
    } else if (!isLoading && !user) {
      // If no user, redirect to landing page instead of login
      setRedirectPath('/');
      setChecking(false);
    }
  }, [user, isLoading]);

  // Show loading while checking or auth is loading
  if (isLoading || checking) {
    return (
      <div className="grid h-screen place-items-center">
        <span className="loader"></span>
      </div>
    );
  }

  // Redirect to landing if no user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to determined path
  if (redirectPath) {
    console.log('SmartRedirect: Final redirect to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  // Fallback
  return <Navigate to="/dashboard" replace />;
};

export default SmartRedirect;
