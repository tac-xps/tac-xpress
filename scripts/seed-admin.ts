import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

async function seed() {
  const email = "admin@tacxpress.com"
  const password = "admin123"

  console.log("Seeding admin user...")
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Tac Xpress Admin" },
  })

  if (error) {
    if (error.message.includes("already been registered")) {
      console.log("Admin user already exists!")

      // Upsert profile just in case
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
      const adminUser = existingUser.users.find((u) => u.email === email)

      if (adminUser) {
        await supabaseAdmin.from("profiles").upsert({
          id: adminUser.id,
          full_name: "Tac Xpress Admin",
          email_notifications: true,
        })
        console.log("Admin profile updated.")
      }
      return
    }
    console.error("Error creating admin user:", error.message)
    return
  }

  if (data.user) {
    await supabaseAdmin.from("profiles").upsert({
      id: data.user.id,
      full_name: "Tac Xpress Admin",
      email_notifications: true,
    })
    console.log("Admin seeded successfully!")
  }
}

seed()
