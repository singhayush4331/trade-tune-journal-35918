import { supabase } from '@/integrations/supabase/client';
import { getSessionUser } from '@/utils/auth-cache';

// Lightweight cached roles for current user to avoid repeated network calls
// Also dedupes concurrent requests and auto-clears on auth changes
let cachedRoles: string[] | null = null;
let cachedMaxHierarchy = 0;
let cachedAt = 0;
let inFlight: Promise<{ roles: string[]; maxHierarchyLevel: number }> | null = null;

// Detailed roles cache
export type UserRoleDetailed = { name: string; hierarchy_level: number; expires_at: string | null };
let cachedDetailed: UserRoleDetailed[] | null = null;
let detailedAt = 0;
let inFlightDetailed: Promise<UserRoleDetailed[]> | null = null;

const TTL = 5 * 60 * 1000; // 5 minutes

export function clearRolesCache() {
  cachedRoles = null;
  cachedMaxHierarchy = 0;
  cachedAt = 0;
  inFlight = null;
  cachedDetailed = null;
  detailedAt = 0;
  inFlightDetailed = null;
  if (typeof window !== 'undefined') {
    console.debug('[roles-cache] Cleared caches');
  }
}

export async function getCurrentUserRoles(): Promise<{ roles: string[]; maxHierarchyLevel: number }> {
  const now = Date.now();
  if (cachedRoles && now - cachedAt < TTL) {
    return { roles: cachedRoles, maxHierarchyLevel: cachedMaxHierarchy };
  }
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const user = await getSessionUser();
      if (!user) {
        cachedRoles = [];
        cachedMaxHierarchy = 0;
        cachedAt = Date.now();
        return { roles: [], maxHierarchyLevel: 0 };
      }

      const { data, error } = await supabase
        .from('user_roles')
        .select(`roles!inner(name, hierarchy_level)`, { count: 'exact' })
        .eq('user_id', user.id)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

      if (error) {
        console.warn('Failed to fetch user roles:', error);
        // Return empty roles instead of throwing to prevent blocking
        cachedRoles = [];
        cachedMaxHierarchy = 0;
        cachedAt = Date.now();
        return { roles: [], maxHierarchyLevel: 0 };
      }

      const roles = (data || []).map((r: any) => r.roles.name as string);
      const levels = (data || []).map((r: any) => r.roles.hierarchy_level as number);
      const maxHierarchyLevel = levels.length ? Math.max(...levels) : 0;

      cachedRoles = roles;
      cachedMaxHierarchy = maxHierarchyLevel;
      cachedAt = Date.now();
      return { roles, maxHierarchyLevel };
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

export async function hasRole(roleName: string): Promise<boolean> {
  const { roles } = await getCurrentUserRoles();
  return roles.includes(roleName);
}

// Optional helpers
export async function getMaxHierarchyLevel(): Promise<number> {
  const { maxHierarchyLevel } = await getCurrentUserRoles();
  return maxHierarchyLevel;
}

// Detailed roles with expires_at (cached)
export async function getCurrentUserRolesDetailed(): Promise<UserRoleDetailed[]> {
  const now = Date.now();
  if (cachedDetailed && now - detailedAt < TTL) return cachedDetailed;
  if (inFlightDetailed) return inFlightDetailed;

  inFlightDetailed = (async () => {
    try {
      const user = await getSessionUser();
      if (!user) {
        cachedDetailed = [];
        detailedAt = Date.now();
        return [];
      }
      const { data, error } = await supabase
        .from('user_roles')
        .select(`roles!inner(name, hierarchy_level), expires_at`)
        .eq('user_id', user.id)
        .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());
      if (error) throw error;
      const detailed: UserRoleDetailed[] = (data || []).map((r: any) => ({
        name: r.roles.name as string,
        hierarchy_level: r.roles.hierarchy_level as number,
        expires_at: r.expires_at as string | null,
      }));
      cachedDetailed = detailed;
      detailedAt = Date.now();
      return detailed;
    } finally {
      inFlightDetailed = null;
    }
  })();

  return inFlightDetailed;
}

// Clear cache on global events
if (typeof window !== 'undefined') {
  window.addEventListener('clearUserDataCache', clearRolesCache);
  window.addEventListener('focus', () => {
    // expire quickly on focus
    cachedAt = 0;
    detailedAt = 0;
  });
}
