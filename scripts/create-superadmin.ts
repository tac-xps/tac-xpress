import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function createSuperAdmin() {
  const email = "admin@tacxpress.in";
  const plainPassword = "Tac@2026";
  
  try {
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    
    const existing = await db.select().from(users).where(eq(users.email, email));
    
    if (existing.length > 0) {
      console.log(`User ${email} already exists. Updating password and role to admin...`);
      await db.update(users)
        .set({ role: "admin" })
        .where(eq(users.email, email));
      console.log("Updated successfully.");
    } else {
      console.log(`Creating superadmin user: ${email}...`);
      await db.insert(users).values({
        id: crypto.randomUUID(),
        email: email,
        role: "admin",
      });
      console.log("Created successfully.");
    }
  } catch (error) {
    console.error("Failed to create superadmin:", error);
  }
}

createSuperAdmin()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
