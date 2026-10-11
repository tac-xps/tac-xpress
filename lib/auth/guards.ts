import { NextResponse } from "next/server"
import type { Session } from "next-auth"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"
import { cache } from "react"

export const DASHBOARD_ROLES = ["admin", "staff"] as const

type DashboardRole = (typeof DASHBOARD_ROLES)[number]

type AuthSession = Session | null

// Match the Postgres `uuid` input syntax, not one UUID version: v7 IDs and the
// fixed local staff IDs (11111111-...) are valid `users.id` values.
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const currentAllowedRole = cache(
  async (
    session: AuthSession,
    allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
  ) => {
    if (!session?.user?.id) return null
    try {
      let currentUser: {
        role: string
        name: string | null
        avatarUrl: string | null
        isOnboarded: boolean | null
      } | null = null

      if (UUID_REGEX.test(session.user.id)) {
        const rows = await db
          .select({
            role: users.role,
            name: users.name,
            avatarUrl: users.avatarUrl,
            isOnboarded: users.isOnboarded,
          })
          .from(users)
          .where(and(eq(users.id, session.user.id), isNull(users.deletedAt)))
          .limit(1)
        currentUser = rows[0] || null
      }

      if (!currentUser && session.user.email) {
        const rowsByEmail = await db
          .select({
            role: users.role,
            name: users.name,
            avatarUrl: users.avatarUrl,
            isOnboarded: users.isOnboarded,
          })
          .from(users)
          .where(and(eq(users.email, session.user.email), isNull(users.deletedAt)))
          .limit(1)
        currentUser = rowsByEmail[0] || null
      }

      if (currentUser && allowedRoles.includes(currentUser.role as DashboardRole)) {
        return currentUser
      }

      const sessionRole = (session.user as { role?: string })?.role
      if (sessionRole && allowedRoles.includes(sessionRole as DashboardRole)) {
        return {
          role: sessionRole,
          name: session.user.name ?? null,
          avatarUrl: session.user.image ?? null,
          isOnboarded: true,
        }
      }

      return null
    } catch (error) {
      Sentry.captureException(error, { tags: { area: "authorization" } })
      const sessionRole = (session.user as { role?: string })?.role
      if (sessionRole && allowedRoles.includes(sessionRole as DashboardRole)) {
        return {
          role: sessionRole,
          name: session.user.name ?? null,
          avatarUrl: session.user.image ?? null,
          isOnboarded: true,
        }
      }
      return null
    }
  }
)

export const requireDashboardSession = cache(
  async (allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const currentUser = await currentAllowedRole(session, allowedRoles)
  if (!currentUser) {
    throw new Error("Forbidden")
  }

  return {
    ...session,
    user: {
      ...session.user,
      role: currentUser.role as DashboardRole,
      name: currentUser.name || session.user.name,
      avatarUrl: currentUser.avatarUrl,
      isOnboarded: currentUser.isOnboarded ?? false,
    },
  }
})

export async function requireDashboardAction(
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: {
        success: false,
        error: "You must be signed in to perform this action.",
      },
    }
  }

  const currentUser = await currentAllowedRole(session, allowedRoles)
  if (!currentUser) {
    return {
      ok: false as const,
      response: {
        success: false,
        error: "You do not have permission to perform this action.",
      },
    }
  }

  return {
    ok: true as const,
    session: {
      ...session,
      user: {
        ...session.user,
        role: currentUser.role as DashboardRole,
        name: currentUser.name || session.user.name,
        avatarUrl: currentUser.avatarUrl,
        isOnboarded: currentUser.isOnboarded ?? false,
      },
    },
  }
}

export async function requireDashboardApi(
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  const currentUser = await currentAllowedRole(session, allowedRoles)
  if (!currentUser) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return {
    ok: true as const,
    session: {
      ...session,
      user: {
        ...session.user,
        role: currentUser.role as DashboardRole,
        name: currentUser.name || session.user.name,
        avatarUrl: currentUser.avatarUrl,
        isOnboarded: currentUser.isOnboarded ?? false,
      },
    },
  }
}



