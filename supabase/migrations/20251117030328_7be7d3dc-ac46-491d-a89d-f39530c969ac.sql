-- Create table for connection fingerprints
CREATE TABLE public.connection_fingerprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  browser_fingerprint JSONB,
  connection_metadata JSONB,
  ai_analysis JSONB,
  risk_score INTEGER,
  detected_threats TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.connection_fingerprints ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own fingerprints"
  ON public.connection_fingerprints
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "System can insert fingerprints"
  ON public.connection_fingerprints
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all fingerprints"
  ON public.connection_fingerprints
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'::app_role
    )
  );

-- Index for performance
CREATE INDEX idx_connection_fingerprints_session ON connection_fingerprints(session_id);
CREATE INDEX idx_connection_fingerprints_created ON connection_fingerprints(created_at DESC);
CREATE INDEX idx_connection_fingerprints_risk ON connection_fingerprints(risk_score DESC);

-- Trigger for updated_at
CREATE TRIGGER update_connection_fingerprints_updated_at
  BEFORE UPDATE ON public.connection_fingerprints
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();