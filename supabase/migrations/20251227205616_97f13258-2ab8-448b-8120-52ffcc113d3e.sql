-- Add explicit deny policy for public reads on leads table
-- Defense in depth: ensure anonymous users cannot read lead data
CREATE POLICY "Public cannot read leads"
ON public.leads 
FOR SELECT
TO anon
USING (false);

-- Add explicit deny policy for public updates on leads table  
CREATE POLICY "Public cannot update leads"
ON public.leads 
FOR UPDATE
TO anon
USING (false);

-- Add explicit deny policy for public deletes on leads table
CREATE POLICY "Public cannot delete leads"
ON public.leads 
FOR DELETE
TO anon
USING (false);