import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { createClient } from "@supabase/supabase-js"
import * as Sentry from "@sentry/nextjs"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  basePath: "/api/auth",
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const email = credentials.email as string
        const bypassPassword = process.env.E2E_TEST_USER_PASSWORD

        // 1. E2E Bypass Flow
        if (
          process.env.NODE_ENV !== "production" &&
          process.env.E2E_TEST_BYPASS_ENABLED === "true" &&
          bypassPassword &&
          credentials.password === bypassPassword
        ) {
          if (email.includes("admin")) {
            const adminId = "00000000-0000-0000-0000-000000000000"
            await ensureUserInDb(adminId, email, "admin")
            return { id: adminId, email, role: "admin" }
          }

          const dbUsers = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
          const existingUser = dbUsers[0]
          if (existingUser) {
            return {
              id: existingUser.id,
              email: existingUser.email,
              role: existingUser.role || "staff",
            }
          }

          if (email.includes("viewer")) {
            const viewerId = "22222222-2222-2222-2222-222222222222"
            await ensureUserInDb(viewerId, email, "customer")
            return { id: viewerId, email, role: "customer" }
          } else {
            // Staff mock logic
            const defaultStaffId = "11111111-1111-1111-1111-111111111111"
            const staffById = await db
              .select()
              .from(users)
              .where(eq(users.id, defaultStaffId))
            const newId = staffById[0] ? crypto.randomUUID() : defaultStaffId
            await ensureUserInDb(newId, email, "staff")
            return { id: newId, email, role: "staff" }
          }
        }

        // 2. Real Supabase Auth Flow
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })

        if (error || !data.user) {
          console.error("Authentication failed for user")
          if (error) {
            Sentry.captureException(error)
          }
          return null
        }

        const id = data.user.id
        const userEmail = data.user.email as string

        // Lookup or insert role
        const dbUsers = await db.select().from(users).where(eq(users.id, id))
        let dbUser = dbUsers[0]

        if (!dbUser) {
          await db.insert(users).values({
            id,
            email: userEmail,
            role: "staff",
          })
          return { id, email: userEmail, role: "staff" }
        }

        return {
          id,
          email: userEmail,
          role: dbUser.role || "staff",
        }
      },
    }),
  ],
})

// Helper function to ensure mock users exist in DB
async function ensureUserInDb(
  id: string,
  email: string,
  role: "admin" | "staff" | "customer"
) {
  const existing = await db.select().from(users).where(eq(users.id, id))
  if (!existing[0]) {
    await db.insert(users).values({ id, email, role }).onConflictDoNothing()
  }
}
