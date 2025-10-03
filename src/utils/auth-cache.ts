import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

// Lightweight cached access to session user to avoid repeated network calls
// Uses supabase.auth.getSession (no network) instead of getUser (network)
let cachedUser: User | null = null;
let cachedAt = 0;
let inFlight: Promise<User | null> | null = null;
const TTL = 60 * 1000; // 60s is enough; refreshed on auth events anyway

export async function getSessionUser(): Promise<User | null> {
  const now = Date.now();
  if (cachedUser && now - cachedAt < TTL) return cachedUser;
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      cachedUser = data.session?.user ?? null;
      cachedAt = Date.now();
      return cachedUser;
    } catch (e) {
      cachedUser = null;
      cachedAt = Date.now();
      return null;
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

export async function getUserId(): Promise<string | null> {
  const user = await getSessionUser();
  return user?.id ?? null;
}

export function clearAuthCache() {
  cachedUser = null;
  cachedAt = 0;
  inFlight = null;
}

// Optional: clear cache on visibility change or custom events
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    // So next call will refresh quickly
    cachedAt = 0;
  });
  window.addEventListener('clearUserDataCache', () => {
    clearAuthCache();
  });
}
