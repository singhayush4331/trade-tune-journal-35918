
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/hooks/use-auth';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const { refreshData } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Extract all possible parameters from URL
        const token = searchParams.get('token') || searchParams.get('confirmation_token') || '';
        const tokenHash = searchParams.get('token_hash') || '';
        const type = searchParams.get('type') || 'signup';
        const email = searchParams.get('email') || '';
        const redirectTo = searchParams.get('redirect_to') || '';
        
        console.log('Starting email verification process');
        // Process URL parameters for verification
        
        // First check: Is the user already authenticated?
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session) {
          console.log('User already has a valid session - verification already completed');
          setVerified(true);
          return;
        }

        // Check if we have any verification parameters at all
        if (!token && !tokenHash) {
          throw new Error('Verification token is missing');
        }

        // Strategy 1: Try using token_hash if available (Supabase's preferred method)
        if (tokenHash) {
          try {
            console.log('Attempting verification with token_hash');
            const { data: hashData, error: hashError } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: type as any
            });
            
            if (!hashError && hashData?.user) {
              console.log('Verification successful using token_hash approach');
              await refreshData();
              setVerified(true);
              return;
            } else {
              console.log('token_hash approach failed:', hashError?.message);
            }
          } catch (e) {
            console.log('Error with token_hash approach:', e);
          }
        }
        
        // Strategy 2: Try with regular token if available
        if (token) {
          // Try with email + token if email is available
          if (email) {
            try {
              console.log('Attempting verification with email+token');
              const { data: emailTokenData, error: emailTokenError } = await supabase.auth.verifyOtp({
                email,
                token,
                type: type as any
              });
              
              if (!emailTokenError && emailTokenData?.user) {
                console.log('Verification successful using email+token approach');
                await refreshData();
                setVerified(true);
                return;
              } else {
                console.log('email+token approach failed:', emailTokenError?.message);
              }
            } catch (e) {
              console.log('Error with email+token approach:', e);
            }
          }

          // Try token as token_hash if direct token didn't work
          try {
            console.log('Attempting verification with token as token_hash');
            const { data: tokenAsHashData, error: tokenAsHashError } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: type as any
            });
            
            if (!tokenAsHashError && tokenAsHashData?.user) {
              console.log('Verification successful using token as token_hash approach');
              await refreshData();
              setVerified(true);
              return;
            } else {
              console.log('token as token_hash approach failed:', tokenAsHashError?.message);
            }
          } catch (e) {
            console.log('Error with token as token_hash approach:', e);
          }
        }

        // Final check: verification might have succeeded but we missed it
        const { data: finalSessionData } = await supabase.auth.getSession();
        if (finalSessionData?.session) {
          console.log('Final check - user is now authenticated, verification likely succeeded');
          await refreshData();
          setVerified(true);
          return;
        }
        
        // If we reach here, all verification attempts failed
        throw new Error('Could not verify email with the provided parameters');
        
      } catch (error: any) {
        console.error('Verification error:', error);
        setVerificationError(error.message || 'Failed to verify email');
        
        // One final check for an existing session
        const { data: errorSessionCheck } = await supabase.auth.getSession();
        if (errorSessionCheck?.session) {
          console.log('Found valid session despite errors - verification succeeded');
          setVerified(true);
          return;
        }

        // Helper message for users
        toast.info('If you already verified your email, try logging in directly.');
      } finally {
        setVerifying(false);
      }
    };

    verifyEmail();
  }, [searchParams, refreshData]);

  const handleLoginRedirect = () => {
    // Add URL parameter to indicate verification status when redirecting to login
    navigate(verified ? '/login?verified=true' : '/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-6 sm:p-8 shadow-lg"
        >
          {verifying ? (
            <div className="text-center space-y-4">
              <Loader2 className={`h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary mx-auto`} />
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>Verifying your email...</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Please wait while we verify your email address.</p>
            </div>
          ) : verified ? (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="bg-primary/10 rounded-full p-3 w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                <Check className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
              </div>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold`}>Email Verified!</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Your email has been successfully verified. You can now access all features of your account.
              </p>
              <Button 
                onClick={handleLoginRedirect}
                className="w-full bg-gradient-to-r from-primary via-blue-500 to-green-500 py-2 h-auto"
              >
                Continue to Login
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-destructive/10 rounded-full p-3 w-14 h-14 sm:w-16 sm:h-16 mx-auto flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 sm:h-10 sm:w-10 text-destructive" />
              </div>
              <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-destructive`}>Verification Issue</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {verificationError || 'We couldn\'t verify your email. The link might be expired or invalid.'}
              </p>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                If you already clicked the verification link before, your account may already be verified. Try logging in with your credentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  onClick={handleLoginRedirect}
                  variant="outline"
                  className="py-2 h-auto flex-1"
                >
                  Back to Login
                </Button>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="secondary"
                  className="py-2 h-auto flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
