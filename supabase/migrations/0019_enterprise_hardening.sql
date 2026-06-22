ALTER TABLE tickets
  ADD COLUMN IF NOT EXISTS needs_human_review BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sla_breach_processed_at TIMESTAMPTZ;

ALTER TABLE audit_log
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS entity TEXT,
  ADD COLUMN IF NOT EXISTS entity_id TEXT,
  ADD COLUMN IF NOT EXISTS "before" JSONB,
  ADD COLUMN IF NOT EXISTS "after" JSONB;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'invoices_amount_nonnegative'
  ) THEN
    ALTER TABLE invoices
      ADD CONSTRAINT invoices_amount_nonnegative
      CHECK (amount >= 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'shipments_pieces_positive'
  ) THEN
    ALTER TABLE shipments
      ADD CONSTRAINT shipments_pieces_positive
      CHECK (pieces >= 1);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS audit_log_user_id_idx
  ON audit_log (user_id);

CREATE INDEX IF NOT EXISTS audit_log_entity_idx
  ON audit_log (entity, entity_id, created_at DESC);
