-- Migration 0018: Ticket contract + WhatsApp relay hardening

ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS intake_category TEXT;

UPDATE tickets
SET intake_category = category
WHERE intake_category IS NULL
  AND category IS NOT NULL
  AND category NOT IN ('delay', 'damage', 'billing', 'general', 'lost');

UPDATE tickets
SET category = 'general'
WHERE category IS NULL
   OR category NOT IN ('delay', 'damage', 'billing', 'general', 'lost');

UPDATE tickets
SET source = 'portal'
WHERE source = 'landing-page';

ALTER TABLE whatsapp_subscribers
  ADD COLUMN IF NOT EXISTS last_inbound_at TIMESTAMPTZ;

ALTER TABLE message_outbound
  ADD COLUMN IF NOT EXISTS provider_name TEXT DEFAULT 'wpbox',
  ADD COLUMN IF NOT EXISTS provider_message_id TEXT,
  ADD COLUMN IF NOT EXISTS meta_message_id TEXT,
  ADD COLUMN IF NOT EXISTS message_type TEXT DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS template_language TEXT,
  ADD COLUMN IF NOT EXISTS related_ticket_id UUID REFERENCES tickets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS related_awb TEXT,
  ADD COLUMN IF NOT EXISTS failure_reason TEXT,
  ADD COLUMN IF NOT EXISTS provider_payload JSONB,
  ADD COLUMN IF NOT EXISTS last_status_at TIMESTAMPTZ DEFAULT now();

UPDATE message_outbound
SET provider_name = COALESCE(provider_name, 'wpbox'),
    provider_message_id = COALESCE(provider_message_id, whatsapp_message_id),
    message_type = CASE
      WHEN template_name IS NULL THEN COALESCE(message_type, 'text')
      ELSE 'template'
    END,
    last_status_at = COALESCE(last_status_at, created_at, now());

DO $$
BEGIN
  ALTER TABLE message_outbound
    ADD CONSTRAINT message_outbound_message_type_check
    CHECK (message_type IN ('text', 'template'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS idx_tickets_intake_category
  ON tickets (intake_category);

CREATE INDEX IF NOT EXISTS idx_whatsapp_subscribers_last_inbound
  ON whatsapp_subscribers (last_inbound_at DESC);

CREATE INDEX IF NOT EXISTS idx_message_outbound_provider_message_id
  ON message_outbound (provider_message_id);

CREATE INDEX IF NOT EXISTS idx_message_outbound_meta_message_id
  ON message_outbound (meta_message_id);

CREATE INDEX IF NOT EXISTS idx_message_outbound_related_ticket
  ON message_outbound (related_ticket_id);

CREATE INDEX IF NOT EXISTS idx_message_outbound_related_awb
  ON message_outbound (related_awb);
