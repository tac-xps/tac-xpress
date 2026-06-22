import postgres from "postgres"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

async function run() {
  const connectionString = process.env.DATABASE_URL!
  const sql = postgres(connectionString, { max: 1 })

  const migrations = ["0014_whatsapp.sql"]

  for (const migration of migrations) {
    const file = path.join(process.cwd(), "supabase", "migrations", migration)
    const queries = fs.readFileSync(file, "utf8")
    console.log(`Running ${migration}...`)
    try {
      await sql.unsafe(queries)
      console.log(`✅ ${migration} applied.`)
    } catch (error) {
      console.error(`❌ ${migration} failed:`, error)
    }
  }

  await sql.end()
}

run()
