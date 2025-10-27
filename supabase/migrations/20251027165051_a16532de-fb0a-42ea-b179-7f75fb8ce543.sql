-- Fix policy_generator_keys public exposure
DROP POLICY IF EXISTS "Anyone can validate their own key" ON public.policy_generator_keys;

-- Create a secure RPC function to validate access keys without exposing them
CREATE OR REPLACE FUNCTION public.validate_policy_access_key(key_to_validate text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  key_record record;
BEGIN
  -- Check if key exists and is valid
  SELECT 
    id,
    email,
    is_active,
    expires_at,
    usage_count,
    max_usage
  INTO key_record
  FROM public.policy_generator_keys
  WHERE access_key = key_to_validate
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_usage IS NULL OR usage_count < max_usage);
  
  -- Return validation result without exposing the actual key
  IF key_record.id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'valid', true,
      'email', key_record.email
    );
  ELSE
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'Invalid, expired, or usage limit reached'
    );
  END IF;
END;
$$;

-- Add RPC function to increment usage count (admin only)
CREATE OR REPLACE FUNCTION public.increment_key_usage(key_to_increment text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.policy_generator_keys
  SET usage_count = usage_count + 1
  WHERE access_key = key_to_increment
    AND is_active = true;
END;
$$;

-- Ensure RLS is enabled on both tables
ALTER TABLE public.policy_generator_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_generator_access_requests ENABLE ROW LEVEL SECURITY;