
-- Phase 1: Database Schema Fixes
-- Add proper foreign key constraints with CASCADE behavior

-- First, let's create a comprehensive role cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_expired_roles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Remove expired trial roles
  DELETE FROM public.user_roles ur
  WHERE ur.expires_at IS NOT NULL 
    AND ur.expires_at < NOW()
    AND EXISTS (
      SELECT 1 FROM public.roles r 
      WHERE r.id = ur.role_id 
      AND r.name ILIKE '%trial%'
    );
    
  -- Log cleanup action
  INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
  SELECT NULL, ur.user_id, ur.role_id, 'auto_cleanup_expired', NULL,
         jsonb_build_object('cleanup_type', 'expired_trial', 'cleanup_time', NOW())
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.expires_at IS NOT NULL 
    AND ur.expires_at < NOW()
    AND r.name ILIKE '%trial%';
END;
$$;

-- Create function to resolve role conflicts
CREATE OR REPLACE FUNCTION public.resolve_role_conflicts(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    premium_role_id UUID;
    trial_role_id UUID;
    free_role_id UUID;
    conflicts_found boolean := false;
BEGIN
    -- Get role IDs
    SELECT id INTO premium_role_id FROM public.roles WHERE name = 'Premium User';
    SELECT id INTO trial_role_id FROM public.roles WHERE name = 'Trial User';
    SELECT id INTO free_role_id FROM public.roles WHERE name = 'Free User';
    
    -- Check if user has Premium + Trial conflict
    IF EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = target_user_id 
        AND role_id = premium_role_id
        AND (expires_at IS NULL OR expires_at > NOW())
    ) AND EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = target_user_id 
        AND role_id = trial_role_id
        AND (expires_at IS NULL OR expires_at > NOW())
    ) THEN
        -- Remove Trial User role (Premium takes precedence)
        DELETE FROM public.user_roles 
        WHERE user_id = target_user_id AND role_id = trial_role_id;
        
        -- Log conflict resolution
        INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
        VALUES (target_user_id, target_user_id, trial_role_id, 'conflict_resolved', target_user_id,
                jsonb_build_object('conflict_type', 'premium_trial', 'action', 'removed_trial'));
        
        conflicts_found := true;
    END IF;
    
    -- Check if user has Premium + Free conflict
    IF EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = target_user_id 
        AND role_id = premium_role_id
        AND (expires_at IS NULL OR expires_at > NOW())
    ) AND EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = target_user_id 
        AND role_id = free_role_id
        AND (expires_at IS NULL OR expires_at > NOW())
    ) THEN
        -- Remove Free User role (Premium takes precedence)
        DELETE FROM public.user_roles 
        WHERE user_id = target_user_id AND role_id = free_role_id;
        
        -- Log conflict resolution
        INSERT INTO public.role_audit_log (user_id, target_user_id, role_id, action, changed_by, metadata)
        VALUES (target_user_id, target_user_id, free_role_id, 'conflict_resolved', target_user_id,
                jsonb_build_object('conflict_type', 'premium_free', 'action', 'removed_free'));
        
        conflicts_found := true;
    END IF;
    
    RETURN conflicts_found;
END;
$$;

-- Enhanced upgrade function with proper validation and atomic operations
CREATE OR REPLACE FUNCTION public.atomic_enroll_and_upgrade(
    user_uuid uuid, 
    course_uuid uuid, 
    upgraded_by uuid DEFAULT NULL::uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    result jsonb;
    course_title TEXT;
    course_status_val course_status;
    enrollment_exists boolean;
    upgrade_result jsonb;
BEGIN
    -- Initialize result
    result := jsonb_build_object(
        'success', false, 
        'message', '', 
        'actions', '[]'::jsonb,
        'enrollment_created', false,
        'upgrade_attempted', false
    );
    
    -- Start transaction (implicit in function)
    
    -- Validate course exists and get details
    SELECT title, status INTO course_title, course_status_val 
    FROM public.courses 
    WHERE id = course_uuid;
    
    IF course_title IS NULL THEN
        result := jsonb_set(result, '{message}', '"Course not found"');
        RETURN result;
    END IF;
    
    -- Check if enrollment already exists
    SELECT EXISTS (
        SELECT 1 FROM public.user_enrollments 
        WHERE user_id = user_uuid 
        AND course_id = course_uuid 
        AND status = 'active'
    ) INTO enrollment_exists;
    
    -- Create enrollment if it doesn't exist
    IF NOT enrollment_exists THEN
        BEGIN
            INSERT INTO public.user_enrollments (user_id, course_id, status)
            VALUES (user_uuid, course_uuid, 'active');
            
            result := jsonb_set(result, '{enrollment_created}', 'true');
            result := jsonb_set(result, '{actions}', 
                (result->'actions') || jsonb_build_array('created_enrollment'));
                
        EXCEPTION
            WHEN OTHERS THEN
                result := jsonb_set(result, '{message}', 
                    to_jsonb('Failed to create enrollment: ' || SQLERRM));
                RETURN result;
        END;
    END IF;
    
    -- Attempt upgrade if course is published
    IF course_status_val = 'published' THEN
        result := jsonb_set(result, '{upgrade_attempted}', 'true');
        
        -- Call the upgrade function
        SELECT public.upgrade_academy_user_to_premium(user_uuid, course_uuid, upgraded_by)
        INTO upgrade_result;
        
        -- Check if upgrade was successful
        IF (upgrade_result->>'success')::boolean THEN
            result := jsonb_set(result, '{success}', 'true');
            result := jsonb_set(result, '{message}', 
                to_jsonb('Enrollment and upgrade completed successfully'));
            result := jsonb_set(result, '{actions}', 
                (result->'actions') || (upgrade_result->'actions'));
        ELSE
            -- Upgrade failed, but enrollment succeeded
            result := jsonb_set(result, '{success}', 'true');
            result := jsonb_set(result, '{message}', 
                to_jsonb('Enrollment created, but upgrade not applicable: ' || (upgrade_result->>'message')));
        END IF;
    ELSE
        -- Course not published, just enrollment
        result := jsonb_set(result, '{success}', 'true');
        result := jsonb_set(result, '{message}', 
            to_jsonb('Enrollment created successfully (no upgrade needed for ' || course_status_val || ' course)'));
    END IF;
    
    -- Clean up any role conflicts
    PERFORM public.resolve_role_conflicts(user_uuid);
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Rollback happens automatically due to function transaction
        result := jsonb_set(result, '{message}', 
            to_jsonb('Transaction failed: ' || SQLERRM));
        RETURN result;
END;
$$;

-- Enhanced upgrade eligibility checker
CREATE OR REPLACE FUNCTION public.validate_upgrade_eligibility(
    user_uuid uuid, 
    course_uuid uuid,
    check_permissions boolean DEFAULT true
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    result jsonb;
    course_status_val course_status;
    has_academy_role boolean;
    has_premium_role boolean;
    user_exists boolean;
    course_exists boolean;
BEGIN
    -- Initialize result
    result := jsonb_build_object(
        'eligible', false,
        'reasons', '[]'::jsonb,
        'user_status', jsonb_build_object(),
        'course_status', ''
    );
    
    -- Check if user exists
    SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = user_uuid) INTO user_exists;
    IF NOT user_exists THEN
        result := jsonb_set(result, '{reasons}', 
            (result->'reasons') || jsonb_build_array('User not found'));
        RETURN result;
    END IF;
    
    -- Check if course exists and get status
    SELECT status INTO course_status_val FROM public.courses WHERE id = course_uuid;
    IF course_status_val IS NULL THEN
        result := jsonb_set(result, '{reasons}', 
            (result->'reasons') || jsonb_build_array('Course not found'));
        RETURN result;
    END IF;
    
    result := jsonb_set(result, '{course_status}', to_jsonb(course_status_val::text));
    
    -- Check if course is published
    IF course_status_val != 'published' THEN
        result := jsonb_set(result, '{reasons}', 
            (result->'reasons') || jsonb_build_array('Course is not published'));
    END IF;
    
    -- Check if user has academy_student role
    SELECT public.has_role(user_uuid, 'academy_student') INTO has_academy_role;
    IF NOT has_academy_role THEN
        result := jsonb_set(result, '{reasons}', 
            (result->'reasons') || jsonb_build_array('User does not have academy_student role'));
    END IF;
    
    -- Check if user already has premium access
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = user_uuid
        AND r.hierarchy_level >= 40
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    ) INTO has_premium_role;
    
    IF has_premium_role THEN
        result := jsonb_set(result, '{reasons}', 
            (result->'reasons') || jsonb_build_array('User already has premium access'));
    END IF;
    
    -- Set user status
    result := jsonb_set(result, '{user_status}', jsonb_build_object(
        'has_academy_role', has_academy_role,
        'has_premium_role', has_premium_role
    ));
    
    -- Determine eligibility
    IF course_status_val = 'published' AND has_academy_role AND NOT has_premium_role THEN
        result := jsonb_set(result, '{eligible}', 'true');
        result := jsonb_set(result, '{reasons}', '[]'::jsonb);
    END IF;
    
    RETURN result;
END;
$$;

-- Create function to detect role conflicts across all users
CREATE OR REPLACE FUNCTION public.detect_role_conflicts()
RETURNS TABLE(
    user_id uuid,
    email text,
    conflicting_roles text[],
    conflict_type text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    WITH user_role_summary AS (
        SELECT 
            ur.user_id,
            p.email,
            array_agg(r.name ORDER BY r.hierarchy_level DESC) as roles,
            array_agg(r.hierarchy_level ORDER BY r.hierarchy_level DESC) as levels
        FROM public.user_roles ur
        JOIN public.roles r ON ur.role_id = r.id
        JOIN public.profiles p ON ur.user_id = p.id
        WHERE ur.expires_at IS NULL OR ur.expires_at > NOW()
        GROUP BY ur.user_id, p.email
    )
    SELECT 
        urs.user_id,
        urs.email,
        urs.roles,
        CASE 
            WHEN 'Premium User' = ANY(urs.roles) AND 'Trial User' = ANY(urs.roles) THEN 'premium_trial_conflict'
            WHEN 'Premium User' = ANY(urs.roles) AND 'Free User' = ANY(urs.roles) THEN 'premium_free_conflict'
            WHEN array_length(urs.levels, 1) > 1 AND urs.levels[1] >= 40 AND urs.levels[2] < 40 THEN 'hierarchy_conflict'
            ELSE 'other_conflict'
        END as conflict_type
    FROM user_role_summary urs
    WHERE (
        ('Premium User' = ANY(urs.roles) AND 'Trial User' = ANY(urs.roles)) OR
        ('Premium User' = ANY(urs.roles) AND 'Free User' = ANY(urs.roles)) OR
        (array_length(urs.levels, 1) > 1 AND urs.levels[1] >= 40 AND urs.levels[2] < 40)
    );
END;
$$;

-- Add constraint to prevent duplicate active enrollments
ALTER TABLE public.user_enrollments 
ADD CONSTRAINT unique_active_enrollment 
UNIQUE (user_id, course_id) 
DEFERRABLE INITIALLY DEFERRED;

-- Create index for better performance on role conflict detection
CREATE INDEX IF NOT EXISTS idx_user_roles_active 
ON public.user_roles (user_id, role_id) 
WHERE expires_at IS NULL OR expires_at > NOW();

-- Create scheduled cleanup job function
CREATE OR REPLACE FUNCTION public.schedule_role_cleanup()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clean up expired roles
    PERFORM public.cleanup_expired_roles();
    
    -- Resolve conflicts for all users
    PERFORM public.resolve_role_conflicts(user_id) 
    FROM (SELECT DISTINCT user_id FROM public.user_roles) as users;
END;
$$;
