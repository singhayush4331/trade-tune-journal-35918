import { supabase } from "@/integrations/supabase/client";
import { getSessionUser } from "@/utils/auth-cache";
import { toast } from "sonner";

// Get the current base URL (will work in both development and production)
const getBaseUrl = () => {
  // For production, hardcode the URL to ensure consistency
  if (process.env.NODE_ENV === 'production') {
    return 'https://wiggly.co.in';
  }
  
  if (typeof window !== 'undefined') {
    // Get the full origin including protocol and host for development
    return window.location.origin;
  }
  return '';
};

// Debounce utility to prevent rapid successive calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Check if current URL is for password reset
const isPasswordResetContext = () => {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/reset-password';
};

// Sign up user with email and password - UPDATED to use branded email with signup type
export const signUpUser = async (email: string, password: string, fullName: string, signupType: 'wiggly' | 'haven_ark' | 'academy' = 'wiggly') => {
  try {
    // Get the redirect URL for email verification
    const appOrigin = process.env.NODE_ENV === 'production' 
      ? 'https://wiggly.co.in'
      : getBaseUrl();
    
    const redirectUrl = `${appOrigin}/email-verification?source=signup`;
    
    console.log("Using signup redirect URL:", redirectUrl);
    console.log("Using signup type:", signupType);
    
    // Store signup data for later use
    localStorage.setItem('signup_email', email);
    sessionStorage.setItem('signup_email', email);
    localStorage.setItem('signup_full_name', fullName);
    sessionStorage.setItem('signup_full_name', fullName);
    localStorage.setItem('signup_type', signupType);
    sessionStorage.setItem('signup_type', signupType);
    
    // Different onboarding status based on signup type
    const onboardingCompleted = signupType === 'haven_ark' || signupType === 'academy';
    
    // First, create the user account with Supabase (without sending default email)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          onboarding_completed: onboardingCompleted,
          signup_type: signupType
        },
        emailRedirectTo: redirectUrl,
        // Disable default email by using a custom data field
        // We'll send our branded email separately
      },
    });
    
    if (error) throw error;
    
    // If user was created successfully, send our custom branded email
    if (data.user) {
      console.log(`User created, sending branded ${signupType} signup email`);
      
      try {
        // Call our custom branded email function with signup type
        const emailResult = await supabase.functions.invoke('send-signup-email', {
          body: {
            email: email,
            redirectUrl: redirectUrl,
            fullName: fullName,
            signupType: signupType
          }
        });

        if (emailResult.error) {
          console.error("Branded signup email error:", emailResult.error);
          // Don't throw here - user is created, just log the email issue
          console.warn("User created but branded email failed, they can still verify manually");
        } else {
          console.log(`Branded ${signupType} signup email sent successfully:`, emailResult.data);
        }
      } catch (emailError) {
        console.error("Error sending branded signup email:", emailError);
        // Don't throw here - user is created, just log the email issue
      }
    }
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing up:", error);
    toast.error(error.message || "Failed to sign up");
    return { data: null, error };
  }
};

// Sign in user with email and password
export const signInUser = async (email: string, password: string) => {
  try {
    // Clear any previous user data from cache before signing in
    window.dispatchEvent(new CustomEvent('clearUserDataCache'));
    
    // Clear only auth-related sessionStorage items, preserve preloader flags
    const keysToPreserve = ['preload_completed', 'preload_completed_at', 'preload_user_id'];
    const preservedData: Record<string, string | null> = {};
    
    keysToPreserve.forEach(key => {
      preservedData[key] = sessionStorage.getItem(key);
    });
    
    sessionStorage.clear();
    
    // Restore preserved data
    Object.entries(preservedData).forEach(([key, value]) => {
      if (value !== null) {
        sessionStorage.setItem(key, value);
      }
    });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Store a flag to help prevent redirect loops
    sessionStorage.setItem('authenticated', 'true');
    
    // Debounced data refresh to prevent multiple rapid calls
    const debouncedRefresh = debounce(() => {
      window.dispatchEvent(new CustomEvent('globalDataRefresh', { 
        detail: { 
          timestamp: Date.now(),
          newLogin: true
        } 
      }));
    }, 500);
    
    debouncedRefresh();
    
    return { data, error: null };
  } catch (error: any) {
    console.error("Error signing in:", error);
    toast.error(error.message || "Failed to sign in");
    return { data: null, error };
  }
};

// Check if user has completed onboarding - UPDATED to handle different signup types
export const checkOnboardingStatus = async () => {
  try {
    const userData = await getSessionUser();
    
    if (!userData) {
      return { completed: false };
    }
    
    // Get signup type from user metadata
    const signupType = userData.user_metadata?.signup_type;
    
    // Haven Ark and Academy users don't need Wiggly onboarding
    if (signupType === 'haven_ark' || signupType === 'academy') {
      console.log(`User has signup type: ${signupType}, skipping Wiggly onboarding`);
      return { completed: true };
    }
    
    // Check if onboarding is already marked as completed in user metadata
    const onboardingCompleted = userData.user_metadata?.onboarding_completed === true;
    
    if (onboardingCompleted) {
      return { completed: true };
    }
    
    // Check localStorage as fallback
    const localOnboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';
    
    if (localOnboardingCompleted) {
      // If it's completed in localStorage but not in metadata, update metadata
      // Use a non-blocking pattern to prevent UI interruption
      setTimeout(() => {
        updateOnboardingStatus(true).catch(err => 
          console.error("Error updating onboarding status:", err)
        );
      }, 0);
      
      return { completed: true };
    }
    
    return { completed: false };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    // Default to not preventing access in case of errors
    return { completed: true };
  }
};

// Update onboarding status
export const updateOnboardingStatus = async (completed: boolean) => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: { onboarding_completed: completed }
    });
    
    if (error) throw error;
    
    // Also update localStorage for backup
    localStorage.setItem('onboarding_completed', completed.toString());
    
    return { error: null };
  } catch (error: any) {
    console.error("Error updating onboarding status:", error);
    return { error };
  }
};

// Sign out user
export const signOutUser = async () => {
  try {
    console.log("Beginning signout process...");
    
    // Clear all cached data before signing out
    window.dispatchEvent(new CustomEvent('clearUserDataCache'));
    
    // Dispatch global data refresh event with logout flag
    window.dispatchEvent(new CustomEvent('globalDataRefresh', { 
      detail: { 
        isLogout: true, 
        timestamp: Date.now() 
      } 
    }));
    
    // Clear session data to prevent auth loops
    sessionStorage.clear();
    
    // Remove the authenticated flag
    sessionStorage.removeItem('authenticated');
    
    // Clear any local storage items that might be keeping user state
    // but don't clear onboarding_completed to remember status between sessions
    const onboardingStatus = localStorage.getItem('onboarding_completed');
    localStorage.clear();
    if (onboardingStatus) {
      localStorage.setItem('onboarding_completed', onboardingStatus);
    }
    
    // Ensure we're logged out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    // Wait for signout to complete
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log("Signout completed successfully");
    
    // Dispatch storage event to notify other components about the logout
    window.dispatchEvent(new Event('storage'));
    
    return { error: null };
  } catch (error: any) {
    console.error("Error signing out:", error);
    toast.error(error.message || "Failed to sign out");
    return { error };
  }
};

// UPDATED: Reset password request - now uses our branded email function with improved error handling
export const resetPassword = async (email: string) => {
  try {
    // Request password reset
    
    // Get the redirect URL for the reset page
    const appOrigin = process.env.NODE_ENV === 'production' 
      ? 'https://wiggly.co.in'
      : getBaseUrl();
    
    const redirectUrl = `${appOrigin}/reset-password`;
    
    // Store the email for later use
    localStorage.setItem('reset_password_email', email);
    sessionStorage.setItem('reset_password_email', email);
    localStorage.setItem('reset_password_request_time', new Date().toISOString());
    sessionStorage.setItem('reset_password_request_time', new Date().toISOString());
    localStorage.setItem('reset_password_redirect_url', redirectUrl);
    sessionStorage.setItem('reset_password_redirect_url', redirectUrl);
    
    // Call our custom branded email function
    const { data, error } = await supabase.functions.invoke('send-password-reset', {
      body: {
        email: email,
        redirectUrl: redirectUrl
      }
    });

    if (error) {
      throw error;
    }

    if (data?.error) {
      throw new Error(data.error);
    }
    
    // Show success message regardless of whether user exists (security)
    toast.success("If the email exists in our system, a reset link has been sent to your inbox");
    
    return { data, error: null };
  } catch (error: any) {
    // Show user-friendly error message
    const userMessage = error.message?.includes('Email service not configured') 
      ? "Password reset is temporarily unavailable. Please try again later."
      : "Failed to send password reset email. Please check your email address and try again.";
    
    toast.error(userMessage);
    
    return { data: null, error };
  }
};

// Verify reset token function
export const verifyResetToken = async (token: string) => {
  try {
    const { data, error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .is('used_at', null)
      .single();

    if (error || !data) {
      return { valid: false, error: "Invalid or expired reset token" };
    }

    return { valid: true, error: null };
  } catch (error: any) {
    return { valid: false, error: "Failed to verify reset token" };
  }
};

// Extract token from URL 
export const extractTokenFromURL = async () => {
  if (typeof window === 'undefined') return null;
  try {
    // For custom token system, check query parameters
    const searchParams = new URLSearchParams(window.location.search);
    const customToken = searchParams.get('token');
    
    if (customToken) {
      return customToken;
    }

    return null;
  } catch (error) {
    return null;
  }
};

// Update password with token
export const updateUserPasswordWithToken = async (newPassword: string, token: string) => {
  try {
    if (!token) {
      return { 
        success: false, 
        error: new Error("No reset token provided") 
      };
    }
    
    // Call the edge function to handle password reset
    const { data, error } = await supabase.functions.invoke('reset-user-password', {
      body: {
        token: token,
        newPassword: newPassword
      }
    });

    if (error) {
      return { 
        success: false, 
        error: new Error(error.message || "Failed to reset password") 
      };
    }

    if (data?.success) {
      return { success: true, error: null };
    } else {
      return { 
        success: false, 
        error: new Error(data?.error || "Failed to update password") 
      };
    }
    
  } catch (error: any) {
    return { 
      success: false, 
      error: new Error(error.message || "An unexpected error occurred during password reset") 
    };
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const user = await getSessionUser();
    
    return { data: user, error: null };
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return { data: null, error };
  }
};

// Force refresh session and data
export const refreshUserSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) throw error;
    
    // Trigger data refresh with new session
    if (data.session) {
      window.dispatchEvent(new CustomEvent('globalDataRefresh', { detail: { timestamp: Date.now() } }));
    }
    
    return { data: data.session, error: null };
  } catch (error: any) {
    console.error("Error refreshing session:", error);
    return { data: null, error };
  }
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw error;
    
    return { authenticated: !!data.session, error: null };
  } catch (error: any) {
    console.error("Error checking authentication:", error);
    return { authenticated: false, error };
  }
};
