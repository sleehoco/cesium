-- Fix search path security for newly created newsletter functions
CREATE OR REPLACE FUNCTION public.validate_email(email_text text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Basic email validation regex
  RETURN email_text ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' 
    AND length(email_text) <= 254
    AND email_text NOT LIKE '%@%@%'; -- Prevent multiple @ signs
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_newsletter_subscriber()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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