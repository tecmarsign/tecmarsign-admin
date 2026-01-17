-- Create a security definer function to check user role without triggering RLS
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = _user_id
$$;

-- Create helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = _user_id AND role = 'admin'
  )
$$;

-- Drop existing problematic policies on users table
DROP POLICY IF EXISTS "Admins can delete users" ON public.users;
DROP POLICY IF EXISTS "Admins can insert users" ON public.users;
DROP POLICY IF EXISTS "Admins can update users" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can view all users" 
ON public.users FOR SELECT 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert users" 
ON public.users FOR INSERT 
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update users" 
ON public.users FOR UPDATE 
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete users" 
ON public.users FOR DELETE 
USING (public.is_admin(auth.uid()));