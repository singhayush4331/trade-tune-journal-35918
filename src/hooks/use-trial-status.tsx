
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentUserRolesDetailed, getMaxHierarchyLevel } from '@/utils/roles-cache';

interface TrialStatus {
  isTrialActive: boolean;
  trialExpiresAt: Date | null;
  hoursRemaining: number;
}

export const useTrialStatus = (): TrialStatus => {
  const { user } = useAuth();
  const [trialData, setTrialData] = useState<{
    isTrialActive: boolean;
    trialExpiresAt: Date | null;
    hoursRemaining: number;
  }>({
    isTrialActive: false,
    trialExpiresAt: null,
    hoursRemaining: 0,
  });

  useEffect(() => {
    if (!user) {
      setTrialData({
        isTrialActive: false,
        trialExpiresAt: null,
        hoursRemaining: 0,
      });
      return;
    }

    const checkTrialStatus = async () => {
      try {
// Get user roles with expiration info (cached)
const rolesDetailed = await getCurrentUserRolesDetailed();
const userRoles = rolesDetailed.map(r => r.name);
const maxHierarchyLevel = await getMaxHierarchyLevel();
const isAdmin = maxHierarchyLevel >= 90;
const hasAcademyRole = userRoles.includes('academy_student');

const trialUserRole = rolesDetailed.find(r => r.name === 'Trial User' || r.name === 'trial_user');
const hasActiveTrialRole = !!trialUserRole && (
  !trialUserRole.expires_at ||
  new Date(trialUserRole.expires_at) > new Date()
);

        console.log('Trial status check:', {
          userRoles,
          hasAcademyRole,
          hasActiveTrialRole,
          trialUserRole,
          isAdmin
        });

const isAcademyOnly = hasAcademyRole && !hasActiveTrialRole && !isAdmin && !userRoles.some(role => 
  ['premium_user', 'basic_user', 'Free User', 'free_user'].includes(role)
);

        // If user is academy-only (no trial), they don't get trial access
        if (isAcademyOnly) {
          console.log('User is academy-only (no active trial), no trial features');
          setTrialData({
            isTrialActive: false,
            trialExpiresAt: null,
            hoursRemaining: 0,
          });
          return;
        }

        // For users with active Trial User role, calculate trial status
        if (hasActiveTrialRole && trialUserRole?.expires_at) {
          const now = new Date();
          const trialExpiresAt = new Date(trialUserRole.expires_at);
          const timeRemaining = trialExpiresAt.getTime() - now.getTime();
          const hoursRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60)));
          const isTrialActive = timeRemaining > 0;

          console.log('Trial calculation:', {
            trialExpiresAt,
            timeRemaining,
            hoursRemaining,
            isTrialActive
          });

          setTrialData({
            isTrialActive,
            trialExpiresAt: isTrialActive ? trialExpiresAt : null,
            hoursRemaining,
          });
          return;
        }

        // For non-academy users without specific trial role, check account creation date
        if (!hasAcademyRole && !hasActiveTrialRole) {
          const createdAt = user.created_at ? new Date(user.created_at) : null;
          
          if (!createdAt) {
            setTrialData({
              isTrialActive: false,
              trialExpiresAt: null,
              hoursRemaining: 0,
            });
            return;
          }

          const now = new Date();
          const trialExpiresAt = new Date(createdAt.getTime() + (24 * 60 * 60 * 1000)); // 24 hours after signup
          const timeRemaining = trialExpiresAt.getTime() - now.getTime();
          const hoursRemaining = Math.max(0, Math.ceil(timeRemaining / (1000 * 60 * 60)));
          const isTrialActive = timeRemaining > 0;

          setTrialData({
            isTrialActive,
            trialExpiresAt: isTrialActive ? trialExpiresAt : null,
            hoursRemaining,
          });
          return;
        }

        // Default to no trial
        setTrialData({
          isTrialActive: false,
          trialExpiresAt: null,
          hoursRemaining: 0,
        });

      } catch (error) {
        console.error('Error in trial status check:', error);
        setTrialData({
          isTrialActive: false,
          trialExpiresAt: null,
          hoursRemaining: 0,
        });
      }
    };

    checkTrialStatus();
  }, [user?.id, user?.created_at]);

  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => trialData, [trialData.isTrialActive, trialData.trialExpiresAt, trialData.hoursRemaining]);
};
