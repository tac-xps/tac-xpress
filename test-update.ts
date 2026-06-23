import { db } from "./lib/db"; import { users } from "./lib/db/schema"; import { eq } from "drizzle-orm"; db.update(users).set({ role: "admin" }).where(eq(users.email, "test@test.com"));
