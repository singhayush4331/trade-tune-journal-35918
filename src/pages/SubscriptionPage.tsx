import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { IndianRupee, CalendarCheck, Check, Percent, Loader2, ArrowRight, AlertCircle, ArrowLeft, LogOut, Clock, CreditCard, Download, FileText, Calendar, Shield, Settings, Sparkles, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { createSubscriptionOrder, getCurrentSubscription, SUBSCRIPTION_PLANS, cancelSubscription } from '@/services/subscription-service';
import { format, addMonths, differenceInDays, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatIndianCurrency } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { signOutUser } from '@/services/auth-service';
import { supabase } from '@/integrations/supabase/client';
import { useTrialStatus } from '@/hooks/use-trial-status';
declare global {
  interface Window {
    Razorpay: any;
  }
}
const SubscriptionBenefitCard = ({
  icon: Icon,
  title,
  description,
  active = true
}) => <div className={`flex items-start gap-3 p-4 rounded-lg ${active ? 'bg-primary/5 border border-primary/20' : 'bg-muted/20 border border-border'}`}>
    <div className={`p-2 rounded-full ${active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
      <Icon size={18} />
    </div>
    <div>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>;
const SubscriptionPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('overview');
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    refreshData
  } = useAuth();
  const isMobile = useIsMobile();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const { isTrialActive, trialExpiresAt } = useTrialStatus();
  
  // Check for success/failure in URL params
  const queryParams = new URLSearchParams(location.search);
  const isSuccess = queryParams.get('success') === 'true';
  const isFailure = queryParams.get('success') === 'false';

  // Add navigation functions
  const handleBackToDashboard = () => {
    navigate('/dashboard', { replace: true });
  };

  const handleLogoutAndGoHome = async () => {
    try {
      setIsLoading(true); // Add loading state while logout is processing
      
      // First ensure all cache and session data is cleared
      window.dispatchEvent(new CustomEvent('clearUserDataCache'));
      sessionStorage.clear();
      
      // Logout the user and wait for it to complete
      await signOutUser();
      
      toast.success('You have been logged out');
      
      // Add a small delay to ensure auth state is fully updated
      setTimeout(() => {
        // Use navigate with replace:true to prevent back navigation and break the loop
        navigate('/login', { replace: true });
      }, 300);
    } catch (error: any) {
      console.error('Error logging out:', error);
      toast.error(error.message || 'Failed to log out');
      setIsLoading(false); // Reset loading state on error
    }
  };

  // Calculate remaining days
  useEffect(() => {
    if (activeSubscription?.end_date) {
      const endDate = new Date(activeSubscription.end_date);
      const today = new Date();
      const days = differenceInDays(endDate, today);
      setDaysLeft(days > 0 ? days : 0);
    }
  }, [activeSubscription?.end_date]);
  useEffect(() => {
    // Handle success/failure URL params
    if (isSuccess && user) {
      toast.success('Payment successful!');
      // Clear the URL params
      navigate('/subscription', {
        replace: true
      });
    } else if (isFailure && user) {
      toast.error('Payment was cancelled or failed.');
      // Clear the URL params
      navigate('/subscription', {
        replace: true
      });
    }
  }, [isSuccess, isFailure, user, navigate]);
  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded successfully');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      setErrorDetails('Failed to load payment system. Please try refreshing the page.');
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  useEffect(() => {
    // Check if user has an active subscription
    const checkSubscription = async () => {
      try {
        setIsLoading(true);
        setErrorDetails(null);

        // First ensure we have a valid session
        const {
          data: sessionData,
          error: sessionError
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.error("Session error in subscription page:", sessionError);
          setErrorDetails(`Authentication error: ${sessionError.message}`);
          return;
        }
        if (!sessionData?.session?.user) {
          console.error("No valid user session found");
          setErrorDetails("No active user session found. Please log in again.");
          return;
        }
        const subscription = await getCurrentSubscription();
        setActiveSubscription(subscription);
      } catch (error: any) {
        console.error('Error checking subscription:', error);
        setErrorDetails(`Error checking subscription: ${error.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      checkSubscription();
    } else {
      console.warn('No user found, cannot check subscription');
      setErrorDetails('Not authenticated. Please log in first.');
    }
  }, [user]);
  
  const handleSubscribe = async (planId: string) => {
    setErrorDetails(null);
    if (!user) {
      toast.error('You must be logged in to subscribe');
      navigate('/login');
      return;
    }
    try {
      setProcessing(true);

      // First ensure we have a valid session
      const {
        data: sessionData,
        error: sessionError
      } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error before subscription:", sessionError);

        // Try to refresh the session
        const {
          data: refreshData,
          error: refreshError
        } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("Failed to refresh session before subscription:", refreshError);
          toast.error('Authentication error. Please log in again.');
          setTimeout(() => navigate('/login'), 1500);
          return;
        }
        console.log("Session refreshed successfully before subscription.");
      }

      // Check again after potential refresh
      const {
        data: currentSession
      } = await supabase.auth.getSession();
      if (!currentSession?.session?.access_token) {
        console.error("No valid access token found");
        toast.error('Authentication session invalid. Please log in again.');
        setTimeout(() => navigate('/login'), 1500);
        return;
      }
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid plan selected');
      }

      // Get user information for payment
      const userData = {
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      };

      // Create one-time payment order - will handle checkout via Razorpay SDK
      await createSubscriptionOrder(planId, userData);

      // Fetch updated subscription (this might not show immediately if checkout is still in progress)
      const updatedSubscription = await getCurrentSubscription();
      if (updatedSubscription) {
        setActiveSubscription(updatedSubscription);
      }

      // Refresh global data
      refreshData();
    } catch (error: any) {
      console.error('Payment error:', error);
      setErrorDetails(`Payment error: ${error.message || 'Unknown error'}`);
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!activeSubscription?.razorpay_subscription_id) {
      toast.error('No active subscription found to cancel');
      return;
    }
    try {
      setProcessing(true);
      await cancelSubscription(activeSubscription.razorpay_subscription_id);

      // Refresh subscription data
      const updatedSubscription = await getCurrentSubscription();
      setActiveSubscription(updatedSubscription);
      toast.success('Subscription auto-renewal has been cancelled. Your current subscription will remain active until the end of the billing cycle.');
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setProcessing(false);
    }
  };
  const downloadInvoice = () => {
    // This would typically connect to your payment provider's API to download an invoice
    toast.info('Invoice download feature will be available soon.');
  };
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading your subscription details...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-card/30 py-16 px-4">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center max-w-7xl mx-auto mb-6">
        {activeSubscription ? (
          <Button variant="outline" onClick={handleBackToDashboard} className="flex items-center gap-1">
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        ) : (
          <Button variant="outline" onClick={handleLogoutAndGoHome} className="flex items-center gap-1">
            <LogOut size={16} />
            Back to Home Page
          </Button>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="text-center mb-12">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <IndianRupee className="mr-1 h-4 w-4" />
            Subscription
          </span>
          <h1 className="text-4xl font-bold mt-6 mb-6 bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent py-[6px]">
            {activeSubscription ? 'Manage Your Subscription' : 'Unlock Full Access'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {activeSubscription ? 'View and manage your current subscription details' : 'Choose the plan that works best for your trading journey'}
          </p>
        </motion.div>

        {/* Trial Banner - Show only if user is on trial and doesn't have an active subscription */}
        {isTrialActive && trialExpiresAt && !activeSubscription && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-8"
          >
            <div className="bg-gradient-to-r from-primary/20 to-blue-500/10 border border-primary/30 rounded-xl p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">
                You're currently on a free trial!
              </h2>
              <p className="text-muted-foreground mb-4">
                Your trial expires {formatDistanceToNow(trialExpiresAt, { addSuffix: true })}. 
                Subscribe now to continue accessing all premium features without interruption.
              </p>
              <div className="w-full bg-background/30 h-2 rounded-full overflow-hidden my-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(5, Math.min(100, (new Date().getTime() - new Date(trialExpiresAt).getTime() + 24 * 60 * 60 * 1000) / (24 * 60 * 60 * 1000) * 100))}%` }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          </motion.div>
        )}

        {errorDetails && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.1
      }} className="max-w-2xl mx-auto mb-8">
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                {errorDetails}
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button variant="outline" onClick={() => navigate('/login')} className="flex items-center mx-auto gap-1">
                Back to Login
              </Button>
            </div>
          </motion.div>}

        {/* Subscription Dashboard for Active Subscribers */}
        {activeSubscription && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }} className="max-w-4xl mx-auto mb-12">
            <Card className="border-primary mb-8">
              <CardHeader className="bg-primary/5 border-b border-border/40">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {activeSubscription.plan_type === 'yearly' ? 'Annual Subscription' : 'Monthly Subscription'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Your subscription is active and in good standing
                    </p>
                  </div>
                  <span className="inline-flex items-center bg-green-500/10 text-green-500 rounded-full px-3 py-1 text-xs font-medium">
                    <Check className="mr-1 h-3 w-3" /> Active
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Current Subscription Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Left side - Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Current Period</p>
                        <p className="font-medium">
                          {activeSubscription.start_date ? format(new Date(activeSubscription.start_date), 'dd MMM yyyy') : 'N/A'}
                          {' - '}
                          {activeSubscription.end_date ? format(new Date(activeSubscription.end_date), 'dd MMM yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Billing Amount</p>
                        <p className="font-medium">
                          {formatIndianCurrency(activeSubscription.amount)}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({activeSubscription.plan_type === 'yearly' ? 'yearly' : 'monthly'})
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    {activeSubscription.next_billing_date && <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Next Billing Date</p>
                          <p className="font-medium">
                            {format(new Date(activeSubscription.next_billing_date), 'dd MMM yyyy')}
                          </p>
                        </div>
                      </div>}
                  </div>
                  
                  {/* Right side - Status & Actions */}
                  <div>
                    {/* Days Remaining */}
                    {daysLeft !== null && <div className="mb-5">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Subscription Valid For</span>
                          <span className="text-sm font-medium">{daysLeft} days left</span>
                        </div>
                        <div className="w-full bg-muted/50 rounded-full h-2.5">
                          <div className="bg-primary h-2.5 rounded-full" style={{
                      width: `${Math.max(5, Math.min(100, daysLeft / (activeSubscription.plan_type === 'yearly' ? 365 : 30) * 100))}%`
                    }} />
                        </div>
                      </div>}
                    
                    {/* Auto Renewal Status */}
                    <div className="p-4 border border-border rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Auto-Renewal</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${activeSubscription.auto_renew ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                          {activeSubscription.auto_renew ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {activeSubscription.auto_renew ? `Your subscription will automatically renew on ${activeSubscription.next_billing_date ? format(new Date(activeSubscription.next_billing_date), 'dd MMM yyyy') : 'the end date'}.` : 'Your subscription will expire at the end of the current period.'}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2 mt-4">
                      {activeSubscription.auto_renew && <Button variant="outline" size="sm" onClick={handleCancelSubscription} disabled={processing} className="w-full flex items-center justify-center">
                          {processing ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : null}
                          Cancel Auto-renewal
                        </Button>}
                      <Button variant="outline" size="sm" onClick={downloadInvoice} className="w-full flex items-center justify-center gap-1">
                        <Receipt className="h-3.5 w-3.5" />
                        Download Invoice
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center gap-1">
                        Return to Dashboard
                        <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Subscription Benefits */}
            
            
            {/* Frequently Asked Questions */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center font-medium p-3 bg-muted/30 rounded-lg">
                    <span>How do I upgrade my plan?</span>
                    <span className="transition group-open:rotate-180">
                      <ArrowRight size={16} />
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2 p-2">
                    Contact our support team to upgrade your current plan to a different tier. You can email us at support@wiggly.com.
                  </p>
                </details>
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center font-medium p-3 bg-muted/30 rounded-lg">
                    <span>What happens when I cancel auto-renewal?</span>
                    <span className="transition group-open:rotate-180">
                      <ArrowRight size={16} />
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2 p-2">
                    When you cancel auto-renewal, your subscription will remain active until the end of the current billing period. After that, it will expire and you'll lose access to premium features.
                  </p>
                </details>
                <details className="group cursor-pointer">
                  <summary className="flex justify-between items-center font-medium p-3 bg-muted/30 rounded-lg">
                    <span>How can I get a refund?</span>
                    <span className="transition group-open:rotate-180">
                      <ArrowRight size={16} />
                    </span>
                  </summary>
                  <p className="text-sm text-muted-foreground mt-2 p-2">
                    For refund requests, please contact our support team within 7 days of purchase. Refunds are subject to our refund policy.
                  </p>
                </details>
              </div>
            </div>
          </motion.div>}

        {/* Subscription Plans for New Users */}
        {!activeSubscription && <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <motion.div initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }} className="flex">
              <Card className="relative h-full w-full backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-background to-primary/5 rounded-lg opacity-50 pointer-events-none"></div>
                
                <CardHeader className="text-center pb-8 pt-6">
                  <h3 className="text-2xl font-semibold">Monthly Plan</h3>
                  <p className="text-4xl font-bold mt-4 flex items-center justify-center">
                    <IndianRupee className="h-6 w-6 mr-1" />
                    {SUBSCRIPTION_PLANS[0].amount}
                    <span className="text-base font-normal text-muted-foreground ml-2">/month</span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">One-time payment</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {['Full access to all features', 'Real-time trade analysis', 'AI-powered insights', 'Priority support', 'Advanced analytics reports'].map((feature, index) => <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button size="lg" className="w-full" disabled={processing || !!activeSubscription || !user || !scriptLoaded} onClick={() => handleSubscribe('monthly')}>
                    {processing ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </> : !user ? 'Please Log In First' : !scriptLoaded ? 'Loading Payment System...' : activeSubscription ? 'Already Subscribed' : 'Pay Now'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }} className="flex">
              <Card className="relative h-full w-full border-primary backdrop-blur-sm bg-gradient-to-b from-primary/5 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-lg opacity-50 pointer-events-none"></div>
                
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Percent className="mr-1 h-3 w-3" />
                    Save 25%
                  </span>
                </div>
                
                <CardHeader className="text-center pb-8 pt-6">
                  <h3 className="text-2xl font-semibold">Yearly Plan</h3>
                  <div className="mt-4">
                    <p className="text-4xl font-bold flex items-center justify-center">
                      <IndianRupee className="h-6 w-6 mr-1" />
                      {Math.round(SUBSCRIPTION_PLANS[1].amount / 12)}
                      <span className="text-base font-normal text-muted-foreground ml-2">/month</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      One-time payment of {formatIndianCurrency(SUBSCRIPTION_PLANS[1].amount)}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {['Full access to all features', 'Real-time trade analysis', 'AI-powered insights', 'Priority support', 'Advanced analytics reports'].map((feature, index) => <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </li>)}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button size="lg" variant="gradient" className="w-full" disabled={processing || !!activeSubscription || !user || !scriptLoaded} onClick={() => handleSubscribe('yearly')}>
                    {processing ? <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </> : !user ? 'Please Log In First' : !scriptLoaded ? 'Loading Payment System...' : activeSubscription ? 'Already Subscribed' : 'Pay Now'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>}

        {!scriptLoaded && !activeSubscription && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.5
      }} className="mt-8 max-w-2xl mx-auto">
            <Alert variant="default" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Payment system is still loading. Please wait a moment...
              </AlertDescription>
            </Alert>
          </motion.div>}

        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.6
      }} className="text-center mt-12 text-sm text-muted-foreground">
          <p>
            For any billing inquiries, please contact our support team at support@wiggly.com
          </p>
        </motion.div>
      </div>
    </div>;
};
export default SubscriptionPage;
