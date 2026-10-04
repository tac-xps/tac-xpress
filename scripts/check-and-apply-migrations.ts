import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });

  try {
    const tableRes = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'shipment_legs';
    `;
    console.log("shipment_legs exists in DB:", tableRes.length > 0);

    if (tableRes.length === 0) {
      console.log("Applying shipment_legs migration...");
      await sql`
        DO $$ BEGIN
          CREATE TYPE public.leg_status AS ENUM ('pending', 'in_transit', 'completed', 'exception');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `;
      await sql`
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
      `;
      await sql`CREATE INDEX IF NOT EXISTS shipment_legs_shipment_id_idx ON public.shipment_legs(shipment_id);`;
      await sql`CREATE INDEX IF NOT EXISTS shipment_legs_status_idx ON public.shipment_legs(status);`;
      await sql`ALTER TABLE public.shipment_legs ENABLE ROW LEVEL SECURITY;`;
      await sql`REVOKE ALL ON public.shipment_legs FROM public, anon;`;
      await sql`GRANT ALL ON public.shipment_legs TO authenticated, service_role;`;
      console.log("✅ shipment_legs table created successfully!");
    } else {
      console.log("✅ shipment_legs table is already present.");
    }
  } catch (err) {
    console.error("Error checking/creating shipment_legs:", err);
  } finally {
    await sql.end();
  }
}

main();
