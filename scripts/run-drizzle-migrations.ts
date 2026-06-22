import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import postgres from "postgres"

async function run() {
  console.log("Running drizzle migrations...")
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error("Missing DATABASE_URL")
    process.exit(1)
  }

  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql)

  try {
    await migrate(db, { migrationsFolder: "./supabase/migrations" })
    console.log("Migrations complete!")
  } catch (e) {
    console.error("Migration error:", e)
  } finally {
    await sql.end()
    process.exit(0)
  }
}

run()
