

-- Drop the existing has_role function first
DROP FUNCTION IF EXISTS public.has_role(uuid, text);

-- Recreate the has_role function with correct parameter names
CREATE OR REPLACE FUNCTION public.has_role(user_uuid uuid, role_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid
    AND r.name = role_name
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
  );
END;
$$;

-- Drop existing lessons RLS policies if they exist
DROP POLICY IF EXISTS "Users can view enrolled course lessons" ON lessons;
DROP POLICY IF EXISTS "Users can view free lessons" ON lessons;
DROP POLICY IF EXISTS "Academy students can view trial and flagship lessons" ON lessons;

-- Create a comprehensive RLS policy for lessons that includes academy student access
CREATE POLICY "Users can view lessons with proper access" ON lessons
FOR SELECT USING (
  -- Free lessons are accessible to everyone
  is_free = true
  OR
  -- Users can view lessons from courses they're enrolled in
  EXISTS (
    SELECT 1 FROM user_enrollments ue
    JOIN course_modules cm ON cm.course_id = ue.course_id
    WHERE ue.user_id = auth.uid()
    AND cm.id = lessons.module_id
    AND ue.status = 'active'
  )
  OR
  -- Academy students can access trial and flagship course lessons
  (
    public.has_role(auth.uid(), 'academy_student')
    AND EXISTS (
      SELECT 1 FROM courses c
      JOIN course_modules cm ON c.id = cm.course_id
      WHERE cm.id = lessons.module_id
      AND c.status IN ('trial', 'flagship')
    )
  )
  OR
  -- Admins can view all lessons
  public.is_admin_secure(auth.uid())
);

-- Ensure RLS is enabled on lessons table
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

