import { createClient } from "@supabase/supabase-js";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createSupabaseAdmin() {
  const email = "admin@tacxpress.in";
  const password = "Tac@2026";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase environment variables");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log(`Creating user in Supabase Auth: ${email}...`);
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (authError) {
      // If user already exists in Auth, we can try to update their password
      if (authError.message.includes("already registered")) {
        console.log(`User already exists in Supabase Auth. Updating password...`);
        const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingAuthUser = usersData.users.find(u => u.email === email);
        if (existingAuthUser) {
          const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
            existingAuthUser.id,
            { password: password }
          );
          if (updateError) throw updateError;
          console.log("Supabase Auth password updated.");
          await syncToDatabase(existingAuthUser.id, email, password);
          return;
        }
      } else {
        throw authError;
      }
    } else {
      console.log("User created in Supabase Auth.");
      await syncToDatabase(authData.user.id, email, password);
    }
  } catch (error) {
    console.error("Failed to create/update Supabase user:", error);
  }
}

async function syncToDatabase(id: string, email: string, plainPassword: string) {
  console.log(`Syncing user ${id} to public.users table...`);
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  
  const existing = await db.select().from(users).where(eq(users.email, email));
  
  if (existing.length > 0) {
    await db.update(users)
      .set({ id: id, role: "admin" })
      .where(eq(users.email, email));
    console.log("Updated public.users table.");
  } else {
    await db.insert(users).values({
      id: id,
      email: email,
      role: "admin",
    });
    console.log("Inserted into public.users table.");
  }
}

createSupabaseAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
