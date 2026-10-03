import postgres from "postgres"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

async function run() {
  const url = process.env.DATABASE_URL || process.env.SUPABASE_POOLER_URL
  if (!url) {
    console.error("Missing DATABASE_URL in .env.local")
    process.exit(1)
  }

  const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1")
  const sql = postgres(url, {
    max: 1,
    ssl: isLocalhost ? false : "require",
  })

  try {
    console.log("Applying invoice columns migration...")
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS document_snapshot jsonb;`
    await sql`ALTER TABLE invoices ADD COLUMN IF NOT EXISTS terms_version text DEFAULT '2026.10';`
    console.log("✅ Successfully added document_snapshot and terms_version to invoices table!")
  } catch (err) {
    console.error("Migration failed:", err)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

run()
