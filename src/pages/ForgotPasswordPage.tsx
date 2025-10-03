
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { resetPassword } from '@/services/auth-service';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
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
import { useIsMobile } from '@/hooks/use-mobile';

const resetFormSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ResetFormValues = z.infer<typeof resetFormSchema>;

const ForgotPasswordPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const { error } = await resetPassword(values.email);
      
      if (error) {
        throw error;
      }
      
      setIsSubmitted(true);
      toast.success('Password reset instructions sent to your email');
      
      // Store email in session/local storage for reference
      sessionStorage.setItem('reset_email_sent_to', values.email);
      sessionStorage.setItem('reset_email_sent_at', new Date().toISOString());
      localStorage.setItem('reset_email_sent_to', values.email);
      localStorage.setItem('reset_email_sent_at', new Date().toISOString());
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to send reset email. Please try again later.');
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setErrorMessage(null);
    form.reset();
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle={isSubmitted ? "Check your email for a reset link" : "Enter your email to receive a password reset link"}
      footerText={
        <div>
          <Link to="/login" className="text-primary font-medium hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            <span>Back to sign in</span>
          </Link>
        </div>
      }
    >
      {!isSubmitted ? (
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
            
            {errorMessage && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md p-3 text-sm flex items-start gap-2">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className={cn(
                "w-full mt-6 bg-gradient-to-r from-primary via-blue-500 to-green-500 hover:shadow-md transition-all py-2 h-auto", 
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </Form>
      ) : (
        <div className="space-y-6 py-2">
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 sm:p-5 text-center flex flex-col items-center">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mb-2 animate-in fade-in-50" />
            <p className="text-sm">
              We've sent a password reset link to <span className="font-medium text-foreground break-all">{form.getValues().email}</span>
            </p>
          </div>
          <div className="flex flex-col xxs:flex-row justify-center items-center gap-3">
            <Link to="/login">
              <Button variant="outline" className="mt-2 h-auto py-1.5">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to sign in
              </Button>
            </Link>
            <Button variant="secondary" className="mt-2 h-auto py-1.5" onClick={handleTryAgain}>
              Try again
            </Button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
