import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

import postgres from "postgres"
import fs from "fs"
import path from "path"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is required (expected in .env.local)")
}

const isLocalhost =
  connectionString.includes("localhost") ||
  connectionString.includes("127.0.0.1")

const sql = postgres(connectionString, {
  prepare: false,
  ssl: isLocalhost ? false : "require",
})

async function main() {
  try {
    const file4 = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "0004_elite_master_chief.sql"
    )
    const sql4 = fs.readFileSync(file4, "utf-8")
    console.log("Applying 0004...")
    await sql.unsafe(sql4)
    console.log("0004 applied")

    const file5 = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "0005_rls_policies.sql"
    )
    const sql5 = fs.readFileSync(file5, "utf-8")
    console.log("Applying 0005...")
    await sql.unsafe(sql5)
    console.log("0005 applied")
  } catch (error) {
    console.error("Migration failed", error)
    process.exitCode = 1
  } finally {
    await sql.end()
  }
}

main()
