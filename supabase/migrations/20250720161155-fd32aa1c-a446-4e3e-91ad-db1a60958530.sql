
-- Phase 1: Database Query Optimization
-- Create a comprehensive function that returns all user data with roles in a single query

CREATE OR REPLACE FUNCTION public.get_admin_users_bulk(
    page_offset integer DEFAULT 0,
    page_limit integer DEFAULT 50,
    search_term text DEFAULT ''
)
RETURNS TABLE(
    user_data jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Check if caller is admin
    IF NOT is_admin_secure(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can access user data';
    END IF;

    RETURN QUERY
    WITH user_roles_agg AS (
        SELECT 
            ur.user_id,
            jsonb_agg(
                jsonb_build_object(
                    'role_name', r.name,
                    'hierarchy_level', r.hierarchy_level,
                    'expires_at', ur.expires_at
                )
            ) as roles_data,
            -- Pre-compute role flags for faster access
            bool_or(r.name = 'admin' AND (ur.expires_at IS NULL OR ur.expires_at > NOW())) as is_admin,
            bool_or(r.name = 'Free User' AND (ur.expires_at IS NULL OR ur.expires_at > NOW())) as has_free_access,
            bool_or(r.name = 'academy_student' AND (ur.expires_at IS NULL OR ur.expires_at > NOW())) as has_academy_access,
            bool_or(r.hierarchy_level >= 40 AND (ur.expires_at IS NULL OR ur.expires_at > NOW())) as has_premium_access
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.expires_at IS NULL OR ur.expires_at > NOW()
        GROUP BY ur.user_id
    ),
    filtered_users AS (
        SELECT 
            p.id,
            p.email,
            p.full_name,
            p.created_at,
            COALESCE(ura.roles_data, '[]'::jsonb) as roles_data,
            COALESCE(ura.is_admin, false) as is_admin,
            COALESCE(ura.has_free_access, false) as has_free_access,
            COALESCE(ura.has_academy_access, false) as has_academy_access,
            COALESCE(ura.has_premium_access, false) as has_premium_access
        FROM profiles p
        LEFT JOIN user_roles_agg ura ON p.id = ura.user_id
        WHERE 
            CASE 
                WHEN search_term = '' THEN TRUE
                ELSE (
                    p.email ILIKE '%' || search_term || '%' OR
                    p.full_name ILIKE '%' || search_term || '%'
                )
            END
        ORDER BY p.created_at DESC
        LIMIT page_limit
        OFFSET page_offset
    )
    SELECT 
        jsonb_build_object(
            'id', fu.id,
            'email', fu.email,
            'full_name', fu.full_name,
            'created_at', fu.created_at,
            'roles', fu.roles_data,
            'isAdmin', fu.is_admin,
            'hasFreeAccess', fu.has_free_access,
            'hasAcademyAccess', fu.has_academy_access,
            'hasPremiumAccess', fu.has_premium_access,
            'last_sign_in_at', null -- Not available in profiles
        ) as user_data
    FROM filtered_users fu;
END;
$$;

-- Create function to get total user count for pagination
CREATE OR REPLACE FUNCTION public.get_admin_users_count(search_term text DEFAULT '')
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    total_count integer;
BEGIN
    -- Check if caller is admin
    IF NOT is_admin_secure(auth.uid()) THEN
        RAISE EXCEPTION 'Only admins can access user data';
    END IF;

    SELECT COUNT(*)
    INTO total_count
    FROM profiles p
    WHERE 
        CASE 
            WHEN search_term = '' THEN TRUE
            ELSE (
                p.email ILIKE '%' || search_term || '%' OR
                p.full_name ILIKE '%' || search_term || '%'
            )
        END;
        
    RETURN total_count;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email_search 
ON public.profiles USING gin(email gin_trgm_ops, full_name gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_created_at 
ON public.profiles (created_at DESC);

-- Enable the pg_trgm extension for better text search (if not already enabled)
-- This might already exist, so we use IF NOT EXISTS equivalent
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm') THEN
        CREATE EXTENSION pg_trgm;
    END IF;
END
$$;

-- Create materialized view for even faster access (optional, can be refreshed periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_user_summary AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    COALESCE(
        jsonb_agg(
            CASE 
                WHEN r.name IS NOT NULL 
                THEN jsonb_build_object('name', r.name, 'level', r.hierarchy_level)
                ELSE NULL
            END
        ) FILTER (WHERE r.name IS NOT NULL), 
        '[]'::jsonb
    ) as roles_summary,
    bool_or(r.name = 'admin') as is_admin,
    bool_or(r.name = 'Free User') as has_free_access,
    bool_or(r.name = 'academy_student') as has_academy_access,
    bool_or(r.hierarchy_level >= 40) as has_premium_access
FROM profiles p
LEFT JOIN user_roles ur ON p.id = ur.user_id AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
LEFT JOIN roles r ON ur.role_id = r.id
GROUP BY p.id, p.email, p.full_name, p.created_at;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_user_summary_id ON public.mv_user_summary (id);
CREATE INDEX IF NOT EXISTS idx_mv_user_summary_email ON public.mv_user_summary (email);

-- Function to refresh materialized view (call this periodically or after role changes)
CREATE OR REPLACE FUNCTION public.refresh_user_summary()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_user_summary;
END;
$$;
