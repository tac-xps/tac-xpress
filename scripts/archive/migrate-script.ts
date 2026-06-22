import { db } from "./lib/db"
import { sql } from "drizzle-orm"

async function main() {
  console.log("Adding driver_id to vehicles...")
  try {
    await db.execute(
      sql`ALTER TABLE "vehicles" ADD COLUMN IF NOT EXISTS "driver_id" UUID REFERENCES "drivers"("id") ON DELETE SET NULL;`
    )
    console.log("Success: driver_id added.")
  } catch (e: any) {
    console.error("Error adding driver_id:", e)
  }

  console.log("Dropping fleet_vehicles...")
  try {
    await db.execute(sql`DROP TABLE IF EXISTS "fleet_vehicles";`)
    console.log("Success: fleet_vehicles dropped.")
  } catch (e: any) {
    console.error("Error dropping fleet_vehicles:", e)
  }

  console.log("Done.")
  process.exit(0)
}

main()
