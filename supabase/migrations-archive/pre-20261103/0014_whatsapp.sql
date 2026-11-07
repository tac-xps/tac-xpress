-- migrations/0014_whatsapp.sql

-- 1. WhatsApp subscribers / opt-in registry
CREATE TABLE IF NOT EXISTS whatsapp_subscribers (
  phone TEXT PRIMARY KEY,
  name TEXT,
  opted_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Outbound message log
CREATE TABLE IF NOT EXISTS message_outbound (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  body TEXT NOT NULL,
  whatsapp_message_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  template_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Add source and phone to tickets (source may already exist from migration 0012, skip if so)
DO $$ BEGIN
  ALTER TABLE tickets ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'portal' CHECK (source IN ('portal', 'whatsapp', 'email', 'api', 'test'));
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS customer_phone TEXT;

-- 4. Add phone to customers (guard in case table doesn't exist)
DO $$ BEGIN
  ALTER TABLE customers ADD COLUMN IF NOT EXISTS phone TEXT;
EXCEPTION WHEN undefined_table THEN
  RAISE NOTICE 'customers table does not exist, skipping phone column add';
END $$;

-- 5. Add whatsapp_message_id to ticket_replies for threading
ALTER TABLE ticket_replies ADD COLUMN IF NOT EXISTS whatsapp_message_id TEXT;

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_source ON tickets(source);
CREATE INDEX IF NOT EXISTS idx_tickets_phone ON tickets(customer_phone);
CREATE INDEX IF NOT EXISTS idx_message_outbound_phone ON message_outbound(phone);
CREATE INDEX IF NOT EXISTS idx_whatsapp_subscribers_opted ON whatsapp_subscribers(opted_in);
