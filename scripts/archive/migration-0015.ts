import { db } from "../lib/db"
import { sql } from "drizzle-orm"

async function main() {
  console.log("Running Migration 0015...")

  try {
    await db.execute(sql`
      -- 1. Link tickets to auth.users (Supabase manages auth.users)
      ALTER TABLE tickets 
        ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS guest_email TEXT,
        ADD COLUMN IF NOT EXISTS guest_phone TEXT;

      -- 2. User profiles (extends auth.users with app-specific data)
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT,
        company_name TEXT,
        phone TEXT,
        preferred_language TEXT DEFAULT 'en',
        email_notifications BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );

      -- 3. Email notification log
      CREATE TABLE IF NOT EXISTS email_notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        recipient_email TEXT NOT NULL,
        template_name TEXT NOT NULL,
        subject TEXT NOT NULL,
        body_html TEXT,
        body_text TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),
        provider_message_id TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        sent_at TIMESTAMPTZ
      );

      -- 4. Indexes
      CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
      CREATE INDEX IF NOT EXISTS idx_email_notifications_pending ON email_notifications(status) WHERE status = 'pending';
      CREATE INDEX IF NOT EXISTS idx_email_notifications_ticket ON email_notifications(ticket_id);

      -- 5. Trigger: Update profiles.updated_at
      CREATE OR REPLACE FUNCTION update_profile_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_profile_update ON profiles;
      CREATE TRIGGER trigger_profile_update
      BEFORE UPDATE ON profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_profile_timestamp();
    `)
    console.log("Migration 0015 completed successfully.")
  } catch (err) {
    console.error("Migration failed:", err)
  } finally {
    process.exit(0)
  }
}

main()
