import { createClient } from "@supabase/supabase-js"
import * as dotenv from "dotenv"
import * as path from "path"

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const testPassword = process.env.E2E_TEST_USER_PASSWORD

if (!supabaseUrl || !serviceRoleKey || !testPassword) {
  console.error(
    "Missing required environment variables for seeding test users."
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function seedTestUsers() {
  console.log("Seeding test users for E2E bypass...")

  const testUsers = [
    {
      email: "admin@test.tacexpress.app",
      password: testPassword!,
      role: "admin",
      name: "Test Admin",
    },
    {
      email: "agent@test.tacexpress.app",
      password: testPassword!,
      role: "agent",
      name: "Test Agent",
    },
    {
      email: "viewer@test.tacexpress.app",
      password: testPassword!,
      role: "viewer",
      name: "Test Viewer",
    },
  ]

  for (const user of testUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      email_confirm: true,
      user_metadata: { role: user.role, full_name: user.name },
    })

    if (error) {
      if (error.message.includes("already registered")) {
        console.log(`[SKIPPED] User ${user.email} already exists.`)
        continue
      }
      console.error(`[ERROR] Failed to create ${user.email}:`, error.message)
      continue
    }

    console.log(`[SUCCESS] Created ${user.email} (ID: ${data.user.id})`)
  }

  console.log("Seeding complete!")
}

seedTestUsers().catch(console.error)
