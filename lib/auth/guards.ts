import { NextResponse } from "next/server"
import type { Session } from "next-auth"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"

export const DASHBOARD_ROLES = ["admin", "staff"] as const

type DashboardRole = (typeof DASHBOARD_ROLES)[number]

type AuthSession = Session | null

async function currentAllowedRole(
  session: AuthSession,
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  if (!session?.user?.id) return null
  try {
    const [currentUser] = await db.select({ role: users.role }).from(users)
      .where(and(eq(users.id, session.user.id), isNull(users.deletedAt))).limit(1)
    return currentUser && allowedRoles.includes(currentUser.role as DashboardRole) ? currentUser.role : null
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "authorization" } })
    return null
  }
}

export async function requireDashboardSession(
  allowedRoles: readonly DashboardRole[] = DASHBOARD_ROLES
) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const currentRole = await currentAllowedRole(session, allowedRoles)
  if (!currentRole) {
    throw new Error("Forbidden")
  }

  return { ...session, user: { ...session.user, role: currentRole } }
}

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

  const currentRole = await currentAllowedRole(session, allowedRoles)
  if (!currentRole) {
    return {
      ok: false as const,
      response: {
        success: false,
        error: "You do not have permission to perform this action.",
      },
    }
  }

  return { ok: true as const, session: { ...session, user: { ...session.user, role: currentRole } } }
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

  const currentRole = await currentAllowedRole(session, allowedRoles)
  if (!currentRole) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { ok: true as const, session: { ...session, user: { ...session.user, role: currentRole } } }
}



