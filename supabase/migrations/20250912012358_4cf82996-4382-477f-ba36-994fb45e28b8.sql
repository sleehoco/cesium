-- Fix newsletter security issues: prevent email harvesting and spam
-- 1. Add unique constraint to prevent duplicate email subscriptions
ALTER TABLE public.newsletter_subscribers 
ADD CONSTRAINT unique_subscriber_email UNIQUE (email);

-- 2. Add email validation function
CREATE OR REPLACE FUNCTION public.validate_email(email_text text)
RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  -- Basic email validation regex
  RETURN email_text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    AND length(email_text) <= 254
    AND email_text NOT LIKE '%@%@%'; -- Prevent multiple @ signs
END;
$$;

-- 3. Add validation trigger for email format
CREATE OR REPLACE FUNCTION public.validate_newsletter_subscriber()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Validate email format
  IF NOT public.validate_email(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format provided';
  END IF;
  
  -- Sanitize name field (prevent XSS and limit length)
  IF NEW.name IS NOT NULL THEN
    NEW.name = trim(regexp_replace(NEW.name, '[<>"\''&]', '', 'g'));
    IF length(NEW.name) > 100 THEN
      NEW.name = left(NEW.name, 100);
    END IF;
  END IF;
  
  -- Ensure status is valid
  IF NEW.status NOT IN ('active', 'unsubscribed', 'bounced') THEN
    NEW.status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. Create the validation trigger
CREATE TRIGGER validate_newsletter_subscriber_trigger
  BEFORE INSERT OR UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_newsletter_subscriber();

-- 5. Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;

-- New policy with additional security checks
CREATE POLICY "Validated newsletter subscription" 
ON public.newsletter_subscribers 
FOR INSERT 
WITH CHECK (
  -- Allow insert but with validation
  public.validate_email(email) 
  AND length(coalesce(name, '')) <= 100
  AND status IN ('active', 'unsubscribed', 'bounced')
);

-- 6. Add rate limiting table for basic spam protection
CREATE TABLE IF NOT EXISTS public.newsletter_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet,
  email text,
  attempts integer DEFAULT 1,
  last_attempt timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone
);

-- Enable RLS on rate limits table
ALTER TABLE public.newsletter_rate_limits ENABLE ROW LEVEL SECURITY;

-- Only admins can view rate limit data
CREATE POLICY "Admins can view rate limits" 
ON public.newsletter_rate_limits 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() 
  AND role = ANY(ARRAY['admin'::app_role, 'moderator'::app_role])
));

-- System can insert rate limit records
CREATE POLICY "System can insert rate limits" 
ON public.newsletter_rate_limits 
FOR INSERT 
WITH CHECK (true);