-- Function to get all users with their roles (security definer to access auth.users)
CREATE OR REPLACE FUNCTION public.get_users_with_roles()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  role app_role,
  user_email text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ur.id,
    ur.user_id,
    ur.role,
    au.email::text as user_email,
    au.created_at
  FROM public.user_roles ur
  JOIN auth.users au ON ur.user_id = au.id
  ORDER BY ur.role, au.email;
END;
$$;