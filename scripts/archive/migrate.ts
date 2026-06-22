import postgres from "postgres"
import "dotenv/config"

const connectionString =
  process.env.SUPABASE_POOLER_URL || process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "Missing SUPABASE_POOLER_URL or DATABASE_URL for realtime migration."
  )
}

const sql = postgres(connectionString, { max: 1 })

async function main() {
  console.log("Enabling Supabase Realtime for tracking_events and shipments...")
  try {
    // Supabase specific setup for realtime
    await sql`
      begin;
        drop publication if exists supabase_realtime;
        create publication supabase_realtime;
      commit;
    `
    await sql`alter publication supabase_realtime add table tracking_events, shipments;`
    console.log("Realtime enabled successfully!")
  } catch (err) {
    console.error("Failed to enable realtime:", err)
  }

  await sql.end()
  console.log("Migration complete!")
}

main().catch(console.error)
