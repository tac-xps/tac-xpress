-- DESIGN DRAFT ONLY. Keep outside supabase/migrations until hosted history and
-- the duplicate 0018 migration version have been reconciled.
-- Run the read-only preflight first. This migration aborts on duplicate AWB
-- assignments instead of guessing which historical row is still active.
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

CREATE TYPE public.manifest_leg_type AS ENUM ('pickup', 'line_haul', 'delivery');
CREATE TYPE public.manifest_handoff_outcome AS ENUM ('received', 'exception');

ALTER TABLE public.manifests
  ADD COLUMN leg_type public.manifest_leg_type NOT NULL DEFAULT 'line_haul';

-- Existing dispatch actions generated these reference prefixes by run type.
UPDATE public.manifests
SET leg_type = CASE
  WHEN reference_id LIKE 'PU-%' THEN 'pickup'::public.manifest_leg_type
  WHEN reference_id LIKE 'DL-%' THEN 'delivery'::public.manifest_leg_type
  ELSE 'line_haul'::public.manifest_leg_type
END;

ALTER TABLE public.manifest_items
  ADD COLUMN is_active boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF EXISTS (
    SELECT shipment_id
    FROM public.manifest_items
    WHERE is_active
    GROUP BY shipment_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION 'Multiple historical manifest assignments exist for a shipment; reconcile them before applying this migration';
  END IF;
END
$$;

CREATE UNIQUE INDEX manifest_items_one_active_shipment_unique
  ON public.manifest_items (shipment_id)
  WHERE is_active;

CREATE TABLE public.manifest_item_handoffs (
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

CREATE INDEX manifest_item_handoffs_item_created_idx
  ON public.manifest_item_handoffs (manifest_item_id, created_at);

CREATE UNIQUE INDEX manifest_item_handoffs_one_received_unique
  ON public.manifest_item_handoffs (manifest_item_id)
  WHERE outcome = 'received';

ALTER TABLE public.manifest_item_handoffs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.manifest_item_handoffs FROM public, anon, authenticated;
GRANT ALL ON public.manifest_item_handoffs TO service_role;

COMMIT;
