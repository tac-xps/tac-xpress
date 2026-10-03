-- WebAuthn / Windows Hello Passkeys Table
CREATE TABLE IF NOT EXISTS public.user_passkeys (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  public_key text NOT NULL,
  counter integer NOT NULL DEFAULT 0,
  device_type text NOT NULL DEFAULT 'platform',
  transports jsonb,
  name text NOT NULL DEFAULT 'My Device',
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  last_used_at timestamp without time zone
);

CREATE INDEX IF NOT EXISTS user_passkeys_user_id_idx ON public.user_passkeys(user_id);

-- RFC 6238 TOTP & Backup Codes Configuration Table
CREATE TABLE IF NOT EXISTS public.user_mfa (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  totp_secret_encrypted text,
  totp_pending_secret_encrypted text,
  totp_enabled boolean NOT NULL DEFAULT false,
  backup_codes_hash text,
  updated_at timestamp without time zone NOT NULL DEFAULT now()
);
