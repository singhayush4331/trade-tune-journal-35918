
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { signInUser, checkOnboardingStatus } from '@/services/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from 'next-themes';
import AuthLayout from '@/components/auth/AuthLayout';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

const loginFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshData } = useAuth();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  
  // Check for verification status parameter in URL
  useEffect(() => {
    const verified = searchParams.get('verified') === 'true';
    if (verified) {
      toast.success('Email verified successfully! You can now log in with your credentials.');
    }
  }, [searchParams]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    // Detect if this is likely auto-fill (rapid submission after page load)
    const pageLoadTime = window.performance?.timing?.loadEventEnd || Date.now();
    const timeSincePageLoad = Date.now() - pageLoadTime;
    const isLikelyAutoFill = timeSincePageLoad < 2000; // Less than 2 seconds
    
    // Add delay for auto-fill to prevent preloader race condition
    if (isLikelyAutoFill) {
      console.log('Auto-fill detected, adding delay to prevent race condition');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    try {
      console.log("Attempting to sign in user:", values.email);
      
      // Clear any existing session data before login attempt
      sessionStorage.removeItem('authRedirectAttempt');
      
      const { data, error } = await signInUser(values.email, values.password);
      
      if (error) throw error;
      
      console.log("User signed in successfully, waiting for session to stabilize");
      
      // Give the session time to properly initialize
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify we have a valid session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Error getting session after login:", sessionError);
        throw new Error("Failed to establish session. Please try again.");
      }
      
      if (!sessionData?.session) {
        console.error("No session found after login");
        throw new Error("Session not established. Please try again.");
      }
      
      console.log("Session established successfully:", !!sessionData.session);
      
      // Refresh global app state
      refreshData();
      
      // Only show success toast for successful login - remove redundant toasts
      console.log('Login successful - redirecting user');
      
      try {
        const { completed } = await checkOnboardingStatus();
        
        if (!completed) {
          console.log('Redirecting to onboarding page');
          navigate('/onboarding', { replace: true });
        } else {
          console.log('Redirecting to dashboard page');
          // Use replace: true to prevent back navigation issues
          navigate('/dashboard', { replace: true });
        }
      } catch (error: any) {
        console.error('Error checking onboarding status:', error);
        // Default to dashboard if we can't check onboarding status
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to log in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue to Wiggly"
      footerText={
        <div className="flex flex-col xxs:flex-row items-center justify-center gap-1">
          <span>Don't have an account?</span>
          <Link to="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </div>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : ""}>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      className="pl-10" 
                      placeholder="Enter your email address" 
                      {...field} 
                      autoComplete="email"
                      inputMode={isMobile ? "email" : undefined}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : ""}>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password" 
                      {...field} 
                      autoComplete="current-password"
                      className="pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary h-8 w-8 flex items-center justify-center"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-gradient-to-r from-primary via-blue-500 to-green-500 hover:shadow-md transition-all py-2 h-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default LoginPage;
