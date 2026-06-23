import { db } from "../lib/db"
import { users } from "../lib/db/schema"

async function main() {
  console.log("Resetting all users isOnboarded to false...")
  await db.update(users).set({ isOnboarded: false })
  console.log("Done!")
  process.exit(0)
}

main().catch(console.error)
