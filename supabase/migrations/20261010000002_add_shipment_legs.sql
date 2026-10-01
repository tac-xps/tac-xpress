DO $$ BEGIN
  CREATE TYPE public.leg_status AS ENUM ('pending', 'in_transit', 'completed', 'exception');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.shipment_legs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  leg_number integer NOT NULL,
  origin_hub_id uuid REFERENCES public.hubs(id) ON DELETE RESTRICT,
  destination_hub_id uuid REFERENCES public.hubs(id) ON DELETE RESTRICT,
  origin_location text NOT NULL,
  destination_location text NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE SET NULL,
  driver_id uuid REFERENCES public.drivers(id) ON DELETE SET NULL,
  manifest_id uuid REFERENCES public.manifests(id) ON DELETE SET NULL,
  status public.leg_status NOT NULL DEFAULT 'pending',
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shipment_legs_shipment_leg_number_unique UNIQUE (shipment_id, leg_number)
);

CREATE INDEX IF NOT EXISTS shipment_legs_shipment_id_idx ON public.shipment_legs(shipment_id);
CREATE INDEX IF NOT EXISTS shipment_legs_status_idx ON public.shipment_legs(status);

ALTER TABLE public.shipment_legs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.shipment_legs FROM public, anon;
GRANT ALL ON public.shipment_legs TO authenticated, service_role;
