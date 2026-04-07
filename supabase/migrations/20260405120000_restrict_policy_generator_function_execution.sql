REVOKE EXECUTE ON FUNCTION public.validate_policy_access_key(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.increment_key_usage(text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_access_key() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_access_key()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin access required';
  END IF;

  RETURN 'PG-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 12));
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_policy_access_key(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.increment_key_usage(text) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_access_key() TO authenticated, service_role;
