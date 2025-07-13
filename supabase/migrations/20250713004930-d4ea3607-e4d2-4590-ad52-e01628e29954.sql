-- Fix Critical Role Escalation Vulnerability
-- Remove the ability for users to update their own role directly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Users can update their profile but NOT the role field
CREATE POLICY "Users can update profile data only" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Only admins can update user roles
CREATE POLICY "Admins can update user roles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Ensure profile role syncs with user_roles table
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the profile with the new role
  UPDATE public.profiles 
  SET role = NEW.role 
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger to sync roles
DROP TRIGGER IF EXISTS sync_profile_role_trigger ON public.user_roles;
CREATE TRIGGER sync_profile_role_trigger
  AFTER INSERT OR UPDATE OF role ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_role();