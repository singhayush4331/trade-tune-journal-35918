-- Fix security warnings by setting search_path to 'public' for all functions

-- 1. Fix cleanup_expired_reset_tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  DELETE FROM public.password_reset_tokens 
  WHERE expires_at < NOW() OR used_at IS NOT NULL;
END;
$function$;

-- 2. Fix create_course_module
CREATE OR REPLACE FUNCTION public.create_course_module(p_course_id uuid, p_title text, p_description text DEFAULT NULL::text)
 RETURNS course_modules
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  next_order_index INTEGER;
  new_module course_modules;
BEGIN
  -- Get the next order index
  SELECT COALESCE(MAX(order_index), -1) + 1 
  INTO next_order_index 
  FROM course_modules 
  WHERE course_id = p_course_id;

  -- Insert new module
  INSERT INTO course_modules (course_id, title, description, order_index)
  VALUES (p_course_id, p_title, p_description, next_order_index)
  RETURNING * INTO new_module;

  RETURN new_module;
END;
$function$;

-- 3. Fix delete_module_cascade
CREATE OR REPLACE FUNCTION public.delete_module_cascade(p_module_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Delete all lessons in the module first
  DELETE FROM lessons WHERE module_id = p_module_id;
  
  -- Delete the module
  DELETE FROM course_modules WHERE id = p_module_id;
  
  RETURN TRUE;
END;
$function$;

-- 4. Fix merge_duplicate_accounts
CREATE OR REPLACE FUNCTION public.merge_duplicate_accounts(keep_user_id uuid, remove_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Transfer all data from remove_user_id to keep_user_id
    
    -- Transfer trades
    UPDATE trades SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer notes
    UPDATE notes SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer playbooks
    UPDATE playbooks SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer funds
    UPDATE funds SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer subscriptions
    UPDATE subscriptions SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer user enrollments
    UPDATE user_enrollments SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer user progress
    UPDATE user_progress SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer broker connections
    UPDATE broker_connections SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer user achievements
    UPDATE user_achievements SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer quiz attempts
    UPDATE user_quiz_attempts SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer assignment submissions
    UPDATE assignment_submissions SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Transfer lesson discussions
    UPDATE lesson_discussions SET user_id = keep_user_id WHERE user_id = remove_user_id;
    
    -- Remove duplicate user roles
    DELETE FROM user_roles WHERE user_id = remove_user_id;
    
    -- Remove duplicate profile
    DELETE FROM profiles WHERE id = remove_user_id;
    
    RETURN true;
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$function$;

-- 5. Fix reorder_modules
CREATE OR REPLACE FUNCTION public.reorder_modules(p_module_updates jsonb)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  module_update JSONB;
BEGIN
  -- Update each module's order
  FOR module_update IN SELECT jsonb_array_elements(p_module_updates)
  LOOP
    UPDATE course_modules 
    SET order_index = (module_update->>'order_index')::INTEGER
    WHERE id = (module_update->>'id')::UUID;
  END LOOP;

  RETURN TRUE;
END;
$function$;

-- 6. Fix update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;