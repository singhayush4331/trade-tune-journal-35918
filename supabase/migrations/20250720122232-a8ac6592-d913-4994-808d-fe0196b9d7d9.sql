
-- First, let's update the handle_new_user function to give Academy signups a 24-hour Wiggly trial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    academy_role_id UUID;
    trial_role_id UUID;
    wiggly_role_id UUID;
    signup_type TEXT;
    role_name TEXT;
BEGIN
    -- Insert profile for all new users
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    
    -- Get the signup type from metadata
    signup_type := NEW.raw_user_meta_data->>'signup_type';
    
    -- Handle different signup types
    IF signup_type = 'academy' OR signup_type = 'haven_ark' THEN
        -- Academy/Haven ARK signups get academy_student role (permanent)
        SELECT id INTO academy_role_id FROM public.roles WHERE name = 'academy_student';
        
        IF academy_role_id IS NOT NULL THEN
            INSERT INTO public.user_roles (user_id, role_id, assigned_by)
            VALUES (NEW.id, academy_role_id, NEW.id);
            
            -- Log the academy role assignment
            INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
            VALUES (NEW.id, NEW.id, academy_role_id, 'auto_assigned', NEW.id, 
                    jsonb_build_object('trigger', 'signup', 'type', signup_type, 'role', 'academy_student'));
        END IF;
        
        -- Also give them a 24-hour Wiggly trial
        SELECT id INTO trial_role_id FROM public.roles WHERE name = 'Trial User';
        
        IF trial_role_id IS NOT NULL THEN
            INSERT INTO public.user_roles (user_id, role_id, assigned_by, expires_at)
            VALUES (NEW.id, trial_role_id, NEW.id, NOW() + INTERVAL '24 hours');
            
            -- Log the trial role assignment
            INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
            VALUES (NEW.id, NEW.id, trial_role_id, 'auto_assigned', NEW.id, 
                    jsonb_build_object('trigger', 'signup', 'type', signup_type, 'role', 'trial_wiggly', 'duration', '24_hours'));
        END IF;
        
    ELSIF signup_type = 'wiggly_only' THEN  
        -- Wiggly-only signups get wiggly_only role
        SELECT id INTO wiggly_role_id FROM public.roles WHERE name = 'wiggly_only';
        
        IF wiggly_role_id IS NOT NULL THEN
            INSERT INTO public.user_roles (user_id, role_id, assigned_by)
            VALUES (NEW.id, wiggly_role_id, NEW.id);
            
            -- Log the wiggly role assignment
            INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
            VALUES (NEW.id, NEW.id, wiggly_role_id, 'auto_assigned', NEW.id, 
                    jsonb_build_object('trigger', 'signup', 'type', signup_type, 'role', 'wiggly_only'));
        END IF;
        
    ELSE
        -- Default to trial user for regular signups
        SELECT id INTO trial_role_id FROM public.roles WHERE name = 'Trial User';
        
        IF trial_role_id IS NOT NULL THEN
            INSERT INTO public.user_roles (user_id, role_id, assigned_by, expires_at)
            VALUES (NEW.id, trial_role_id, NEW.id, NOW() + INTERVAL '24 hours');
            
            -- Log the trial role assignment
            INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
            VALUES (NEW.id, NEW.id, trial_role_id, 'auto_assigned', NEW.id, 
                    jsonb_build_object('trigger', 'signup', 'type', 'regular', 'role', 'trial_user', 'duration', '24_hours'));
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't block signup
        INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
        VALUES (NEW.id, NEW.id, NULL, 'signup_error', NEW.id, 
                jsonb_build_object('error', SQLERRM, 'signup_type', signup_type));
        RETURN NEW;
END;
$function$;

-- Create a helper function to check if a user should be upgraded to premium
CREATE OR REPLACE FUNCTION public.should_upgrade_to_premium(user_uuid uuid, course_uuid uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    course_status_val course_status;
    has_academy_role boolean;
    has_premium_role boolean;
BEGIN
    -- Check if course is published
    SELECT status INTO course_status_val FROM public.courses WHERE id = course_uuid;
    
    IF course_status_val != 'published' THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user has academy_student role
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid
        AND r.name = 'academy_student'
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_academy_role;
    
    IF NOT has_academy_role THEN
        RETURN FALSE;
    END IF;
    
    -- Check if user already has premium access (hierarchy >= 40)
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid
        AND r.hierarchy_level >= 40
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_premium_role;
    
    -- Only upgrade if they don't already have premium access
    RETURN NOT has_premium_role;
END;
$function$;

-- Create a function to safely upgrade an academy user to premium
CREATE OR REPLACE FUNCTION public.upgrade_academy_user_to_premium(user_uuid uuid, course_uuid uuid, upgraded_by uuid DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    trial_role_id UUID;
    premium_role_id UUID;
    result jsonb;
    course_title TEXT;
BEGIN
    -- Initialize result
    result := jsonb_build_object('success', false, 'message', '', 'actions', '[]'::jsonb);
    
    -- Check if upgrade should happen
    IF NOT public.should_upgrade_to_premium(user_uuid, course_uuid) THEN
        result := jsonb_set(result, '{message}', '"User does not qualify for premium upgrade"');
        RETURN result;
    END IF;
    
    -- Get course title for logging
    SELECT title INTO course_title FROM public.courses WHERE id = course_uuid;
    
    -- Get role IDs
    SELECT id INTO trial_role_id FROM public.roles WHERE name = 'Trial User';
    SELECT id INTO premium_role_id FROM public.roles WHERE name = 'Premium User';
    
    -- Remove Trial User role if present
    IF trial_role_id IS NOT NULL THEN
        DELETE FROM public.user_roles 
        WHERE user_id = user_uuid AND role_id = trial_role_id;
        
        result := jsonb_set(result, '{actions}', 
            (result->'actions') || jsonb_build_array('removed_trial_role'));
    END IF;
    
    -- Add Premium User role
    IF premium_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (user_uuid, premium_role_id, COALESCE(upgraded_by, user_uuid))
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        result := jsonb_set(result, '{actions}', 
            (result->'actions') || jsonb_build_array('added_premium_role'));
    END IF;
    
    -- Log the upgrade
    INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
    VALUES (COALESCE(upgraded_by, user_uuid), user_uuid, premium_role_id, 'auto_upgraded', 
            COALESCE(upgraded_by, user_uuid), 
            jsonb_build_object(
                'trigger', 'course_assignment',
                'course_id', course_uuid,
                'course_title', course_title,
                'course_status', 'published',
                'upgrade_type', 'academy_to_premium'
            ));
    
    result := jsonb_set(result, '{success}', 'true');
    result := jsonb_set(result, '{message}', '"Successfully upgraded to Premium User"');
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log error
        INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
        VALUES (COALESCE(upgraded_by, user_uuid), user_uuid, NULL, 'upgrade_error', 
                COALESCE(upgraded_by, user_uuid),
                jsonb_build_object(
                    'error', SQLERRM,
                    'course_id', course_uuid,
                    'upgrade_type', 'academy_to_premium'
                ));
        
        result := jsonb_set(result, '{message}', to_jsonb('Error: ' || SQLERRM));
        RETURN result;
END;
$function$;
