-- Migrate records from fleet_vehicles into vehicles before dropping the redundant table
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'fleet_vehicles') THEN
    INSERT INTO public.vehicles (id, registration_number, capacity_kg, status, created_at, deleted_at)
    SELECT
      fv.id,
      fv.registration_number,
      1000,
      CASE
        WHEN fv.status::text = 'maintenance' THEN 'maintenance'::public.vehicle_status
        WHEN fv.status::text = 'retired' THEN 'retired'::public.vehicle_status
        ELSE 'active'::public.vehicle_status
      END,
      fv.created_at,
      fv.deleted_at
    FROM public.fleet_vehicles fv
    ON CONFLICT (registration_number) DO NOTHING;
  END IF;
END $$;

DROP TABLE IF EXISTS fleet_vehicles CASCADE;
DROP TYPE IF EXISTS fleet_vehicle_status CASCADE;
