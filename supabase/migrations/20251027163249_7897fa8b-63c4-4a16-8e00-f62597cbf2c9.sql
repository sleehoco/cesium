-- Create table for policy generator access requests
CREATE TABLE IF NOT EXISTS public.policy_generator_access_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  company_name TEXT,
  phone_number TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  notes TEXT
);

-- Create table for policy generator access keys
CREATE TABLE IF NOT EXISTS public.policy_generator_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_request_id UUID REFERENCES public.policy_generator_access_requests(id),
  access_key TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  max_usage INTEGER DEFAULT NULL, -- NULL means unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.policy_generator_access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_generator_keys ENABLE ROW LEVEL SECURITY;

-- Policies for access requests
CREATE POLICY "Anyone can submit access requests"
  ON public.policy_generator_access_requests
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all access requests"
  ON public.policy_generator_access_requests
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins can update access requests"
  ON public.policy_generator_access_requests
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'moderator')
    )
  );

-- Policies for access keys
CREATE POLICY "Anyone can validate their own key"
  ON public.policy_generator_keys
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage keys"
  ON public.policy_generator_keys
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role IN ('admin', 'moderator')
    )
  );

-- Create function to generate access key
CREATE OR REPLACE FUNCTION generate_access_key()
RETURNS TEXT AS $$
BEGIN
  RETURN 'PG-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX idx_policy_generator_keys_access_key ON public.policy_generator_keys(access_key);
CREATE INDEX idx_policy_generator_keys_email ON public.policy_generator_keys(email);
CREATE INDEX idx_policy_generator_access_requests_email ON public.policy_generator_access_requests(email);
CREATE INDEX idx_policy_generator_access_requests_status ON public.policy_generator_access_requests(status);