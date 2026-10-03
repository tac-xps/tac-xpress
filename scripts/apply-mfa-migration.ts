import postgres from "postgres"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function run() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_POOLER_URL
  if (!url) {
    console.error("Missing DATABASE_URL in .env.local")
    process.exit(1)
  }

  const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1")
  const sql = postgres(url, {
    max: 1,
    ssl: isLocalhost ? false : "require",
  })

  try {
    console.log("Applying user_passkeys and user_mfa tables migration...")
    await sql`
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
    `
    await sql`CREATE INDEX IF NOT EXISTS user_passkeys_user_id_idx ON public.user_passkeys(user_id);`
    await sql`
      CREATE TABLE IF NOT EXISTS public.user_mfa (
        user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
        totp_secret_encrypted text,
        totp_enabled boolean NOT NULL DEFAULT false,
        backup_codes_hash text,
        updated_at timestamp without time zone NOT NULL DEFAULT now()
      );
    `
    console.log("✅ Successfully created user_passkeys and user_mfa tables!")
  } catch (err) {
    console.error("Migration failed:", err)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

run()
