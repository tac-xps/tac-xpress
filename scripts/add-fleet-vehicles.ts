import { db } from "../lib/db"

async function run() {
  try {
    console.log("Creating enum fleet_vehicle_status...")
    await db.execute(
      `DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fleet_vehicle_status') THEN CREATE TYPE fleet_vehicle_status AS ENUM ('active', 'maintenance', 'idle'); END IF; END $$;`
    )

    console.log("Creating table fleet_vehicles...")
    await db.execute(
      `CREATE TABLE IF NOT EXISTS fleet_vehicles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
        registration_number TEXT NOT NULL UNIQUE, 
        driver_id UUID REFERENCES users(id) ON DELETE SET NULL, 
        status fleet_vehicle_status NOT NULL DEFAULT 'active', 
        created_at TIMESTAMP NOT NULL DEFAULT NOW(), 
        deleted_at TIMESTAMP
      );`
    )
    console.log("Successfully created table and enum")
  } catch (e) {
    console.error("DB Error:", e)
  }
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
