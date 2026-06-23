import { db } from "../lib/db"
import { users } from "../lib/db/schema"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

async function main() {
  console.log("Starting database seeding...")

  const adminEmail = "admin@tac-xpress.com"
  const staffEmail = "staff@tac-xpress.com"

  const passwordHash = await bcrypt.hash("TacXpress2026!", 10)

  // Seed Admin
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
  if (existingAdmin.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: adminEmail,
      password: passwordHash,
      role: "admin",
    })
    console.log(`Seeded admin user: ${adminEmail}`)
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }

  // Seed Staff
  const existingStaff = await db
    .select()
    .from(users)
    .where(eq(users.email, staffEmail))
  if (existingStaff.length === 0) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: staffEmail,
      password: passwordHash,
      role: "staff",
    })
    console.log(`Seeded staff user: ${staffEmail}`)
  } else {
    console.log(`Staff user already exists: ${staffEmail}`)
  }

  console.log("Database seeding completed.")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seeding failed:", err)
  process.exit(1)
})
