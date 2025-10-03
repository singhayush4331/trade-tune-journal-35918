-- Create new role structure for Haven ARK Masterclass system
-- First, let's create the new roles
INSERT INTO public.roles (name, description, hierarchy_level, is_system_role, color) VALUES
('haven_ark_masterclass', 'Haven ARK Masterclass Student - Full access to Academy and Wiggly', 50, true, '#10B981'),
('wiggly_only', 'Wiggly Platform Only - Trading tools access only', 25, true, '#3B82F6')
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  hierarchy_level = EXCLUDED.hierarchy_level,
  color = EXCLUDED.color;

-- Create permissions for haven_ark_masterclass role
INSERT INTO public.role_permissions (role_id, permission, granted) 
SELECT r.id, p.permission::permission_type, true
FROM public.roles r
CROSS JOIN (
  VALUES 
    ('access_dashboard'),
    ('access_trades'), 
    ('access_calendar'),
    ('access_playbooks'),
    ('access_analytics'),
    ('access_notebook'),
    ('access_funds'),
    ('access_brokers'),
    ('access_wiggly_ai'),
    ('access_academy'),
    ('view_courses'),
    ('enroll_courses'),
    ('create_trades'),
    ('edit_trades'),
    ('delete_trades'),
    ('export_trades'),
    ('create_playbooks'),
    ('edit_playbooks'),
    ('delete_playbooks'),
    ('create_notes'),
    ('edit_notes'),
    ('delete_notes'),
    ('manage_funds'),
    ('connect_brokers'),
    ('use_ai_features')
) AS p(permission)
WHERE r.name = 'haven_ark_masterclass'
ON CONFLICT (role_id, permission) DO UPDATE SET granted = true;

-- Create permissions for wiggly_only role (no Academy access)
INSERT INTO public.role_permissions (role_id, permission, granted)
SELECT r.id, p.permission::permission_type, true
FROM public.roles r
CROSS JOIN (
  VALUES
    ('access_dashboard'),
    ('access_trades'),
    ('access_calendar'), 
    ('access_playbooks'),
    ('access_analytics'),
    ('access_notebook'),
    ('access_funds'),
    ('access_brokers'),
    ('access_wiggly_ai'),
    ('create_trades'),
    ('edit_trades'),
    ('delete_trades'),
    ('export_trades'),
    ('create_playbooks'),
    ('edit_playbooks'),
    ('delete_playbooks'),
    ('create_notes'),
    ('edit_notes'),
    ('delete_notes'),
    ('manage_funds'),
    ('connect_brokers'),
    ('use_ai_features')
) AS p(permission)
WHERE r.name = 'wiggly_only'
ON CONFLICT (role_id, permission) DO UPDATE SET granted = true;

-- Create payments table for tracking transactions
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_type TEXT NOT NULL CHECK (payment_type IN ('haven_ark_masterclass', 'wiggly_monthly', 'wiggly_yearly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'manual_verification')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  manual_verification_notes TEXT,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on payments table
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all payments" ON public.payments
  FOR ALL USING (is_admin_secure(auth.uid()));

-- Create account creation requests table
CREATE TABLE IF NOT EXISTS public.account_creation_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  payment_id UUID REFERENCES public.payments(id),
  role_type TEXT NOT NULL CHECK (role_type IN ('haven_ark_masterclass', 'wiggly_only')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  password_sent BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

-- Enable RLS on account creation requests
ALTER TABLE public.account_creation_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for account creation requests  
CREATE POLICY "Admins can manage account requests" ON public.account_creation_requests
  FOR ALL USING (is_admin_secure(auth.uid()));

-- Add trigger for updated_at on payments
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();