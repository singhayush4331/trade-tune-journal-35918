import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle, CheckCircle, Bug } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResetPasswordDebugDialog from "@/components/auth/ResetPasswordDebugDialog";

// Services
import { extractTokenFromURL, updateUserPasswordWithToken, verifyResetToken } from '@/services/auth-service';

// Form schema
const resetPasswordSchema = z.object({
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(72, 'Password must not exceed 72 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'verifying' | 'ready' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const [debug, setDebug] = useState<any>({});
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const isMobile = useIsMobile();
  
  // Store current URL and related data for better debugging
  const [urlDebugInfo, setUrlDebugInfo] = useState<any>({});

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  // Check for token in URL on page load
  useEffect(() => {
    const urlInfo = {
      fullUrl: window.location.href,
      pathname: location.pathname,
      search: location.search,
      hasToken: !!new URLSearchParams(location.search).get('token'),
      tokenPreview: new URLSearchParams(location.search).get('token')?.substring(0, 8) + "..." || "None",
      timestamp: new Date().toISOString(),
      eventType: "Custom Token System - Page Load"
    };
    
    setUrlDebugInfo(urlInfo);
    setDebug(prev => ({ ...prev, urlInfo }));
    
    console.log('Reset password page loaded with custom token system:', window.location.href);
    
    const verifyToken = async () => {
      try {
        const extractedToken = await extractTokenFromURL();
        
        if (extractedToken) {
          console.log('Custom token found, verifying...');
          
          const { valid, error: verifyError } = await verifyResetToken(extractedToken);
          
          if (valid) {
            console.log('Custom token verified successfully');
            setToken(extractedToken);
            setStatus('ready');
          } else {
            console.error('Custom token verification failed:', verifyError);
            setStatus('error');
            setErrorMessage(verifyError || 'Reset link is invalid or expired. Please request a new one.');
          }
        } else {
          console.error('No custom token found in URL');
          setStatus('error');
          setErrorMessage('Reset link is invalid or expired. Please request a new one.');
        }
      } catch (error: any) {
        console.error('Error during token verification:', error);
        setStatus('error');
        setErrorMessage('An error occurred while verifying the reset link.');
      }
    };
    
    verifyToken();
  }, [location]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setErrorMessage('No reset token found. Please request a new password reset link.');
      setStatus('error');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Submitting password reset with custom token');
      const { success, error } = await updateUserPasswordWithToken(values.password, token);
      
      if (success) {
        console.log('Password reset successful');
        setStatus('success');
        toast.success('Password has been reset successfully!');
        
        // Clean up stored data
        localStorage.removeItem('reset_password_email');
        sessionStorage.removeItem('reset_password_email');
        
        // Redirect to login after a short delay
        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { message: 'Password reset successful. Please log in with your new password.' }
          });
        }, 2000);
      } else {
        console.error('Password reset failed:', error);
        setStatus('error');
        setErrorMessage(error?.message || 'Failed to reset password. The link may have expired.');
        toast.error('Password reset failed');
      }
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred');
      toast.error('Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewLink = () => {
    navigate('/forgot-password');
  };

  // Show verifying state
  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-6 sm:p-8 space-y-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Verifying Reset Link</h1>
          <p className="text-muted-foreground text-sm">Please wait while we verify your password reset link...</p>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Verifying custom token...</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 text-xs text-muted-foreground"
            onClick={() => setShowDebugDialog(true)}
          >
            <Bug className="h-3 w-3 mr-1" />
            Show Debug Info
          </Button>
          
          <ResetPasswordDebugDialog
            isOpen={showDebugDialog}
            onClose={() => setShowDebugDialog(false)}
            urlDebugInfo={urlDebugInfo}
            token={token}
            status={status}
            debug={debug}
          />
        </div>
      </div>
    );
  }

  // Show error state
  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-6 sm:p-8 space-y-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Reset Link Invalid</h1>
          <p className="text-muted-foreground text-sm">{errorMessage}</p>
          <div className="space-y-4">
            <Button onClick={handleRequestNewLink} className="w-full py-2 h-auto">
              Request New Reset Link
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full py-2 h-auto">
              Back to Login
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 text-xs text-muted-foreground"
            onClick={() => setShowDebugDialog(true)}
          >
            <Bug className="h-3 w-3 mr-1" />
            Show Debug Info
          </Button>
          
          <ResetPasswordDebugDialog
            isOpen={showDebugDialog}
            onClose={() => setShowDebugDialog(false)}
            urlDebugInfo={urlDebugInfo}
            token={token}
            status={status}
            debug={debug}
          />
        </div>
      </div>
    );
  }

  // Show success state
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-6 sm:p-8 space-y-6 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Password Reset Successful</h1>
          <p className="text-muted-foreground text-sm">Your password has been reset successfully. You can now log in with your new password.</p>
          <Button onClick={() => navigate('/login')} className="w-full py-2 h-auto">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-lg border border-border shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
          <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>Reset Your Password</h1>
          <p className="text-muted-foreground mt-2 text-sm">Create a new password for your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isMobile ? "text-sm" : ""}>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter your new password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary h-8 w-8 flex items-center justify-center"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isMobile ? "text-sm" : ""}>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Confirm your new password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary h-8 w-8 flex items-center justify-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-6 py-2 h-auto"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/login')} className="text-sm h-auto py-1">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Button>
        </div>
        
        <div className="mt-4 flex justify-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-muted-foreground h-auto py-1"
            onClick={() => setShowDebugDialog(true)}
          >
            <Bug className="h-3 w-3 mr-1" />
            Show Debug Info
          </Button>
        </div>
        
        <ResetPasswordDebugDialog
          isOpen={showDebugDialog}
          onClose={() => setShowDebugDialog(false)}
          urlDebugInfo={urlDebugInfo}
          token={token}
          status={status}
          debug={debug}
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
