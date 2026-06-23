import { db } from "../lib/db"

async function run() {
  try {
    const res = await db.execute("SELECT * FROM message_outbound LIMIT 1")
    console.log("Query successful", res)
  } catch (e) {
    console.error("DB Error:", e)
  }
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
