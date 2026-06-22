import { db } from "../lib/db"

async function run() {
  try {
    const res = await db.execute(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices'"
    )
    console.log(res.map((r) => r.column_name))
  } catch (e) {
    console.error("DB Error:", e)
  }
}

run()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
