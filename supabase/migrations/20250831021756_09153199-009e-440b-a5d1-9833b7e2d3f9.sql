-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.personal_information ENABLE ROW LEVEL SECURITY;

-- Allow administrators to view all personal information
CREATE POLICY "Admins can view personal information"
ON public.personal_information
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow administrators to update personal information
CREATE POLICY "Admins can update personal information"
ON public.personal_information
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow administrators to delete personal information
CREATE POLICY "Admins can delete personal information"
ON public.personal_information
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
