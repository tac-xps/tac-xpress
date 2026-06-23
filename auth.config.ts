import type { NextAuthConfig } from "next-auth"
import { resolveAuthSecret } from "@/lib/auth/secret"

export const authConfig = {
  secret: resolveAuthSecret(),
  basePath: "/api/auth",
  providers: [], // Providers are populated in auth.ts to avoid Edge Runtime issues
  trustHost: true, // Required for both the proxy and auth.ts NextAuth instances to work in production
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("NextAuth JWT callback", {
          hasUser: Boolean(user),
          userId: user?.id,
        })
      }

      // The user object is only present on the initial sign-in.
      // We encode the role and org_id into the token here.
      if (user) {
        token.role = (user as any).role || "staff"
        token.org_id = "default-org" // Legacy P5 compatibility
      }
      return token
    },
    async session({ session, token }) {
      if (process.env.NODE_ENV !== "production") {
        console.debug("NextAuth Session callback", {
          userId: session.user?.id ?? token.sub,
          role: token.role,
        })
      }
      if (session.user) {
        session.user.org_id = token.org_id as string
        session.user.role = token.role as string
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: "/signin",
  },
  debug: process.env.NODE_ENV !== "production",
} satisfies NextAuthConfig
