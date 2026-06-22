import { db } from "../lib/db"
import * as fs from "fs"
import * as path from "path"

async function run() {
  try {
    const sqlPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "0018_whatsapp_ticket_contracts.sql"
    )
    console.log("Running migration from:", sqlPath)
    const sql = fs.readFileSync(sqlPath, "utf8")
    await db.execute(sql)
    console.log("Successfully ran migration 0018")
  } catch (e) {
    console.error("DB Error:", e)
  }
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
