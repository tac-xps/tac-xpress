import postgres from "postgres"
import "dotenv/config"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("No DATABASE_URL")

const sql = postgres(connectionString, { max: 1 })

async function run() {
  try {
    await sql`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_onboarded" boolean DEFAULT false NOT NULL;`
    console.log("Migration successful!")
  } catch (e) {
    console.error("Migration failed:", e)
  } finally {
    await sql.end()
  }
}
run()
