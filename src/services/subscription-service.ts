
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserRoles } from '@/utils/roles-cache';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    amount: 999,
    duration: 'monthly',
    features: ['Full access to all features', 'Real-time trade analysis', 'AI-powered insights', 'Priority support']
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    amount: 8999,
    duration: 'yearly',
    features: ['Full access to all features', 'Real-time trade analysis', 'AI-powered insights', 'Priority support', 'Save 25%']
  }
];

export const hasActiveSubscription = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      return false;
    }

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.session.user.id)
      .eq('status', 'active')
      .gte('end_date', new Date().toISOString())
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return !!subscriptions;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
};

export const getCurrentSubscription = async () => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('No authenticated user');
    }
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', session.session.user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return null;
  }
};

export const createSubscriptionOrder = async (planId: string, userData: any) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('No authenticated user');
    }

    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) {
      throw new Error('Invalid plan selected');
    }

    // Call the Razorpay edge function to create order
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'create_order',
        amount: plan.amount,
        plan_id: planId,
        user_data: userData
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating subscription order:', error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('No authenticated user');
    }

    // Call the Razorpay edge function to cancel subscription
    const { data, error } = await supabase.functions.invoke('razorpay', {
      body: {
        action: 'cancel_subscription',
        subscription_id: subscriptionId
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

export const isAcademyOnlyUser = async (): Promise<boolean> => {
  try {
    const { roles, maxHierarchyLevel } = await getCurrentUserRoles();
    const hasAcademyRole = roles.includes('academy_student');
    const hasOtherRoles = roles.some(role =>
      ['premium_user', 'basic_user', 'Free User', 'Trial User', 'admin', 'moderator', 'free_user'].includes(role)
    );
    return hasAcademyRole && !hasOtherRoles && maxHierarchyLevel < 90;
  } catch (error) {
    console.error('Error checking if user is academy-only:', error);
    return false;
  }
};

export const upgradeAcademyUser = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session?.user) {
      throw new Error('No authenticated user');
    }
    
    // This would typically involve a payment process
    // After successful payment, we would add the 'basic_user' role
    
    // For demo purposes, we'll just add the role directly
    const { error } = await supabase
      .rpc('add_role_to_user', {
        target_user_id: session.session.user.id,
        role_name: 'basic_user'
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error upgrading academy user:', error);
    return false;
  }
};
