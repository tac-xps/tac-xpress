-- Forward migration to ensure all MFA columns exist on existing databases
ALTER TABLE public.user_mfa ADD COLUMN IF NOT EXISTS totp_pending_secret_encrypted text;
ALTER TABLE public.user_mfa ADD COLUMN IF NOT EXISTS failed_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_mfa ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Distributed single-use token consumption table (MFA grants, rate limit proofs, WebAuthn challenges)
CREATE TABLE IF NOT EXISTS public.auth_token_consumptions (
  jti text PRIMARY KEY,
  purpose text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS auth_token_consumptions_expires_at_idx ON public.auth_token_consumptions(expires_at);

-- Enable Row Level Security (RLS) on passkeys, MFA, and token consumption tables
ALTER TABLE public.user_passkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_token_consumptions ENABLE ROW LEVEL SECURITY;

-- Revoke all direct permissions from anon and authenticated roles to prevent PostgREST tampering.
-- All mutations and queries flow strictly through server actions connecting via Postgres superuser/direct connection.
REVOKE ALL ON public.user_passkeys FROM anon, authenticated;
REVOKE ALL ON public.user_mfa FROM anon, authenticated;
REVOKE ALL ON public.auth_token_consumptions FROM anon, authenticated;

-- Drop all client-accessible policies to ensure complete server-side isolation
DROP POLICY IF EXISTS "Users can view own passkeys" ON public.user_passkeys;
DROP POLICY IF EXISTS "Users can insert own passkeys" ON public.user_passkeys;
DROP POLICY IF EXISTS "Users can delete own passkeys" ON public.user_passkeys;
DROP POLICY IF EXISTS "Users can update own passkeys" ON public.user_passkeys;
DROP POLICY IF EXISTS "Users can view own mfa" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can update own mfa" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can insert own mfa" ON public.user_mfa;
DROP POLICY IF EXISTS "Users can delete own mfa" ON public.user_mfa;

