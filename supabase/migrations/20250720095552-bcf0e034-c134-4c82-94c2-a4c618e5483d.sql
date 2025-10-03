
-- Remove the haven_ark_masterclass role and update the signup trigger
-- to only use academy_student for all academy signups

-- First, let's update the handle_new_user trigger to simplify the role assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    role_id UUID;
    signup_type TEXT;
    role_name TEXT;
BEGIN
    -- Insert profile for all new users
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    -- Get the signup type from metadata
    signup_type := NEW.raw_user_meta_data->>'signup_type';
    
    -- Determine role based on signup type
    IF signup_type = 'academy' OR signup_type = 'haven_ark' THEN
        -- Both Haven ARK and Academy signups get the same role
        role_name := 'academy_student';
    ELSIF signup_type = 'wiggly_only' THEN  
        role_name := 'wiggly_only';
    ELSE
        -- Default to trial user for regular signups
        role_name := 'Trial User';
    END IF;
    
    -- Get role ID
    SELECT id INTO role_id FROM public.roles WHERE name = role_name;
    
    IF role_id IS NOT NULL THEN
        -- For trial users, set expiration
        IF role_name = 'Trial User' THEN
            INSERT INTO public.user_roles (user_id, role_id, assigned_by, expires_at)
            VALUES (NEW.id, role_id, NEW.id, NOW() + INTERVAL '24 hours');
        ELSE
            -- For academy and wiggly users, no expiration
            INSERT INTO public.user_roles (user_id, role_id, assigned_by)
            VALUES (NEW.id, role_id, NEW.id);
        END IF;
        
        -- Log the automatic role assignment
        INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
        VALUES (NEW.id, NEW.id, role_id, 'auto_assigned', NEW.id, 
                jsonb_build_object('trigger', 'signup', 'type', signup_type));
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Remove the haven_ark_masterclass role if it exists (since user said no existing users have it)
DELETE FROM public.role_permissions WHERE role_id IN (
    SELECT id FROM public.roles WHERE name = 'haven_ark_masterclass'
);
DELETE FROM public.roles WHERE name = 'haven_ark_masterclass';

-- Update the payments table to remove haven_ark_masterclass payment type
-- Since we're unifying everything under academy
UPDATE public.payments 
SET payment_type = 'academy_access' 
WHERE payment_type = 'haven_ark_masterclass';

-- Update the account_creation_requests table
UPDATE public.account_creation_requests 
SET role_type = 'academy_student' 
WHERE role_type = 'haven_ark_masterclass';
