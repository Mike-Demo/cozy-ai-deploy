REVOKE EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;