import fs from "fs"
import { createClient } from "@supabase/supabase-js"

// Parse .env.local manually
const envFile = fs.readFileSync(".env.local", "utf8")
const env: Record<string, string> = {}
envFile.split("\n").forEach((line) => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    let key = match[1]
    let value = match[2] || ""
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1)
    env[key] = value
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing env vars")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  const email = "superadmin@tac-xpress.com"
  const password = "TacXpressAdmin2026!"

  console.log(`Creating user ${email}...`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    if (
      error.message.includes("already registered") ||
      error.message.includes("already exists")
    ) {
      console.log("User already exists in Supabase Auth. Fetching...")
      const { data: usersData, error: listError } =
        await supabase.auth.admin.listUsers()
      if (listError) throw listError

      const existingUser = usersData.users.find((u) => u.email === email)
      if (existingUser) {
        await supabase.auth.admin.updateUserById(existingUser.id, { password })
        console.log("Updated password for existing user in Supabase Auth.")

        // Let's also verify them via direct postgres query through Supabase REST
        const { error: dbError } = await supabase.from("users").upsert({
          id: existingUser.id,
          email: existingUser.email,
          role: "admin",
        })
        if (dbError)
          console.error("Could not upsert into public.users:", dbError.message)
        else console.log("Upserted user into public.users.")
      }
    } else {
      console.error("Error creating user:", error)
    }
  } else if (data.user) {
    console.log("Created in Supabase Auth:", data.user.id)

    // Insert into public.users
    const { error: dbError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email,
      role: "admin",
    })
    if (dbError)
      console.error("Could not insert into public.users:", dbError.message)
    else console.log("Inserted user into public.users.")
  }

  console.log("\n✅ Super Admin Ready!")
  console.log(`Email: ${email}`)
  console.log(`Password: ${password}`)
}

main().catch(console.error)
