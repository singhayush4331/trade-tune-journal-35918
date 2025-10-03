-- Add INSERT policy for profiles table to allow admins to create profiles
CREATE POLICY "Admins can create profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (is_admin_secure(auth.uid()));

-- Also create a security definer function to safely create profiles for account fixes
CREATE OR REPLACE FUNCTION public.create_profile_for_user(
  target_user_id UUID,
  user_email TEXT,
  user_full_name TEXT DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT is_admin_secure(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can create profiles for other users';
  END IF;

  -- Insert the profile
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (target_user_id, user_email, user_full_name)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name);

  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;