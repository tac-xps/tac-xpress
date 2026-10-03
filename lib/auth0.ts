import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  domain: process.env.AUTH0_DOMAIN || "dev-mydyvbfsq8sjrz6j.jp.auth0.com",
  clientId: process.env.AUTH0_CLIENT_ID || "EtEfOLGDBkQoZC0v3WZneyyQGh0JwKgL",
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: process.env.AUTH0_SECRET || "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  appBaseUrl: process.env.APP_BASE_URL || process.env.AUTH0_BASE_URL || "http://localhost:3000",
})

export const AUTH0_NAMESPACE = "https://tac-xpress.app"

/**
 * Retrieve the current authenticated user's role from Auth0 custom claims.
 */
export async function getAuth0UserRole(): Promise<string | null> {
  const session = await auth0.getSession()
  if (!session?.user) return null
  const user = session.user as Record<string, unknown>
  const role = user[`${AUTH0_NAMESPACE}/role`] as string | undefined
  const roles = user[`${AUTH0_NAMESPACE}/roles`] as string[] | undefined
  return role || roles?.[0] || null
}
