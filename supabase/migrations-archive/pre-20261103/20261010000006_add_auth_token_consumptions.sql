-- Forward migration: Ensure auth_token_consumptions table exists for distributed single-use tokens
CREATE TABLE IF NOT EXISTS public.auth_token_consumptions (
  jti text PRIMARY KEY,
  purpose text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_token_consumptions_expires_at_idx ON public.auth_token_consumptions(expires_at);

-- Enable RLS and revoke client access
ALTER TABLE public.auth_token_consumptions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_token_consumptions FROM anon, authenticated;
GRANT ALL ON public.auth_token_consumptions TO service_role;
