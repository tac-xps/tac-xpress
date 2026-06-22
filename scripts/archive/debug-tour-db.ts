import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "../lib/db/schema"
import { eq } from "drizzle-orm"
import "dotenv/config"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("No DATABASE_URL")

const client = postgres(connectionString, { prepare: false, ssl: "require" })
const db = drizzle(client, { schema })

async function run() {
  // The admin user from the terminal logs
  const testId = "f1c9d3a0-42c8-4093-921f-530d7482bde8"

  console.log("=== Testing Drizzle ORM query (same as layout.tsx) ===")

  try {
    const dbUser = await db.query.users.findFirst({
      where: eq(schema.users.id, testId),
    })

    console.log(
      "dbUser result:",
      dbUser
        ? { id: dbUser.id, isOnboarded: dbUser.isOnboarded }
        : "NOT FOUND (undefined)"
    )
    console.log("isOnboarded would be:", dbUser?.isOnboarded ?? false)

    if (!dbUser) {
      console.log("\n⚠️  User NOT found in users table!")
      console.log("This means isOnboarded defaults to FALSE")
      console.log(
        "The tour SHOULD show — if it doesn't, the issue is client-side"
      )
    }
  } catch (err: any) {
    console.error("Drizzle query FAILED:", err.message)
    console.log("isOnboarded would default to FALSE (from catch block)")
  }

  await client.end()
}

run()
