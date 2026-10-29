import { Auth0Client } from "@auth0/nextjs-auth0/server"

const auth0Secret =
  process.env.AUTH0_SECRET ||
  process.env.AUTH_SECRET ||
  "0000000000000000000000000000000000000000000000000000000000000000"

const isProd = process.env.NODE_ENV === "production"
const domain = process.env.AUTH0_DOMAIN || (isProd ? "" : "dev-mydyvbfsq8sjrz6j.jp.auth0.com")
const clientId = process.env.AUTH0_CLIENT_ID || (isProd ? "" : "EtEfOLGDBkQoZC0v3WZneyyQGh0JwKgL")

export const isAuth0Configured = Boolean(
  (process.env.AUTH0_DOMAIN && process.env.AUTH0_CLIENT_ID && process.env.AUTH0_SECRET) ||
    (!isProd && (process.env.AUTH_SECRET || process.env.AUTH0_SECRET))
)

export const auth0 = new Auth0Client({
  domain,
  clientId,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  secret: auth0Secret,
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
