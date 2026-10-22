-- Drizzle migration for manifest leg types, active item state, and item handoffs.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'manifest_leg_type') THEN
    CREATE TYPE public.manifest_leg_type AS ENUM ('pickup', 'line_haul', 'delivery');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'manifest_handoff_outcome') THEN
    CREATE TYPE public.manifest_handoff_outcome AS ENUM ('received', 'exception');
  END IF;
END
$$;

ALTER TABLE manifests ADD COLUMN IF NOT EXISTS leg_type manifest_leg_type NOT NULL DEFAULT 'line_haul';
ALTER TABLE manifest_items ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS manifest_items_one_active_shipment_unique
  ON manifest_items (shipment_id)
  WHERE is_active;

CREATE TABLE IF NOT EXISTS manifest_item_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_item_id uuid NOT NULL REFERENCES manifest_items(id) ON DELETE RESTRICT,
  outcome manifest_handoff_outcome NOT NULL,
  location text NOT NULL,
  receiving_party text,
  received_by uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  event_key text NOT NULL UNIQUE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT manifest_item_handoffs_receiver_required
    CHECK (outcome = 'exception' OR (receiving_party IS NOT NULL AND length(trim(receiving_party)) > 0))
);

CREATE INDEX IF NOT EXISTS manifest_item_handoffs_item_created_idx
  ON manifest_item_handoffs (manifest_item_id, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS manifest_item_handoffs_one_received_unique
  ON manifest_item_handoffs (manifest_item_id)
  WHERE outcome = 'received';
