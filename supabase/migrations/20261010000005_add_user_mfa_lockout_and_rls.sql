-- Forward migration to ensure all MFA columns exist on existing databases
ALTER TABLE public.user_mfa ADD COLUMN IF NOT EXISTS totp_pending_secret_encrypted text;
ALTER TABLE public.user_mfa ADD COLUMN IF NOT EXISTS failed_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE public.user_mfa ADD COLUMN IF NOT EXISTS locked_until timestamptz;

-- Enable Row Level Security (RLS) on passkeys and MFA tables
ALTER TABLE public.user_passkeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mfa ENABLE ROW LEVEL SECURITY;

-- Revoke all direct permissions from anon role to prevent unauthenticated access
REVOKE ALL ON public.user_passkeys FROM anon;
REVOKE ALL ON public.user_mfa FROM anon;

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_passkeys TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_mfa TO authenticated;

-- User Passkeys Policies: Users can only see and manage their own passkeys
DROP POLICY IF EXISTS "Users can view own passkeys" ON public.user_passkeys;
CREATE POLICY "Users can view own passkeys"
  ON public.user_passkeys
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own passkeys" ON public.user_passkeys;
CREATE POLICY "Users can insert own passkeys"
  ON public.user_passkeys
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own passkeys" ON public.user_passkeys;
CREATE POLICY "Users can delete own passkeys"
  ON public.user_passkeys
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own passkeys" ON public.user_passkeys;
CREATE POLICY "Users can update own passkeys"
  ON public.user_passkeys
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- User MFA Policies: Users can only view and modify their own MFA record
DROP POLICY IF EXISTS "Users can view own mfa" ON public.user_mfa;
CREATE POLICY "Users can view own mfa"
  ON public.user_mfa
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own mfa" ON public.user_mfa;
CREATE POLICY "Users can update own mfa"
  ON public.user_mfa
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own mfa" ON public.user_mfa;
CREATE POLICY "Users can insert own mfa"
  ON public.user_mfa
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
