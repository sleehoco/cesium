-- Personal Information RLS hardening: allow admins while preserving owner-only policies
-- Ensure RLS is enabled (no-op if already enabled)
ALTER TABLE public.personal_information ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all personal information
CREATE POLICY "Admins can view all personal information"
ON public.personal_information
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update any personal information
CREATE POLICY "Admins can update all personal information"
ON public.personal_information
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete personal information
CREATE POLICY "Admins can delete personal information"
ON public.personal_information
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
