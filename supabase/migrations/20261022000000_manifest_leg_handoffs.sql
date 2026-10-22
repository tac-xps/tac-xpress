-- Promoted migration for manifest leg type, active item tracking, and item handoffs.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.manifests') IS NULL
     OR to_regclass('public.manifest_items') IS NULL
     OR to_regclass('public.shipments') IS NULL
     OR to_regclass('public.users') IS NULL
     OR to_regclass('public.tracking_events') IS NULL THEN
    RAISE EXCEPTION 'Required logistics tables are missing; inspect hosted schema first';
  END IF;
END
$$;

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

ALTER TABLE public.manifests
  ADD COLUMN IF NOT EXISTS leg_type public.manifest_leg_type NOT NULL DEFAULT 'line_haul';

-- Existing dispatch actions generated these reference prefixes by run type.
UPDATE public.manifests
SET leg_type = CASE
  WHEN reference_id LIKE 'PU-%' THEN 'pickup'::public.manifest_leg_type
  WHEN reference_id LIKE 'DL-%' THEN 'delivery'::public.manifest_leg_type
  ELSE 'line_haul'::public.manifest_leg_type
END;

ALTER TABLE public.manifest_items
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

CREATE UNIQUE INDEX IF NOT EXISTS manifest_items_one_active_shipment_unique
  ON public.manifest_items (shipment_id)
  WHERE is_active;

CREATE TABLE IF NOT EXISTS public.manifest_item_handoffs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  manifest_item_id uuid NOT NULL
    REFERENCES public.manifest_items(id) ON DELETE RESTRICT,
  outcome public.manifest_handoff_outcome NOT NULL,
  location text NOT NULL,
  receiving_party text,
  received_by uuid NOT NULL
    REFERENCES public.users(id) ON DELETE RESTRICT,
  event_key text NOT NULL UNIQUE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT manifest_item_handoffs_receiver_required
    CHECK (outcome = 'exception' OR (receiving_party IS NOT NULL AND length(trim(receiving_party)) > 0))
);

CREATE INDEX IF NOT EXISTS manifest_item_handoffs_item_created_idx
  ON public.manifest_item_handoffs (manifest_item_id, created_at);

CREATE UNIQUE INDEX IF NOT EXISTS manifest_item_handoffs_one_received_unique
  ON public.manifest_item_handoffs (manifest_item_id)
  WHERE outcome = 'received';

ALTER TABLE public.manifest_item_handoffs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.manifest_item_handoffs FROM public, anon, authenticated;
GRANT ALL ON public.manifest_item_handoffs TO service_role;

COMMIT;
