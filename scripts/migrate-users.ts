import postgres from "postgres"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error("DATABASE_URL not found")
  process.exit(1)
}

const sql = postgres(connectionString, { ssl: "require" })

async function migrate() {
  try {
    console.log("Starting manual migration...")
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS address text;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS city text;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS state text;`
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_code text;`
    await sql`ALTER TABLE users ALTER COLUMN email DROP NOT NULL;`
    console.log("Migration complete!")
  } catch (error) {
    console.error("Migration failed:", error)
  } finally {
    await sql.end()
  }
}

migrate()
