CREATE TABLE public.gist_rate_limits (
  bucket_key text PRIMARY KEY,
  count integer NOT NULL DEFAULT 0,
  reset_at timestamptz NOT NULL
);

GRANT ALL ON public.gist_rate_limits TO service_role;

ALTER TABLE public.gist_rate_limits ENABLE ROW LEVEL SECURITY;

-- No policies: this table is only reachable by privileged server code.

CREATE OR REPLACE FUNCTION public.consume_rate_limit(
  _key text,
  _limit integer,
  _window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _now timestamptz := now();
  _count integer;
BEGIN
  DELETE FROM public.gist_rate_limits WHERE reset_at <= _now;

  INSERT INTO public.gist_rate_limits (bucket_key, count, reset_at)
  VALUES (_key, 1, _now + make_interval(secs => _window_seconds))
  ON CONFLICT (bucket_key) DO UPDATE
    SET count = public.gist_rate_limits.count + 1
  RETURNING count INTO _count;

  RETURN _count <= _limit;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_rate_limit(text, integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_rate_limit(text, integer, integer) TO service_role;