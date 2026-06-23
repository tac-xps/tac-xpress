import { AppShell } from "@/components/app-shell"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

import { NotificationWrapper } from "./notification-wrapper"
import { ScannerProvider } from "@/components/scanner/scanner-provider"
import { OnboardingTourProvider } from "@/components/onboarding-tour-provider"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/signin")
  }

  let isOnboarded = false // Default to false so new users get the tour
  if (session.user.id !== "00000000-0000-0000-0000-000000000000") {
    try {
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
      })
      console.log(
        "[Tour/Layout] DB lookup for user",
        session.user.id,
        "=> dbUser:",
        dbUser
          ? { id: dbUser.id, isOnboarded: dbUser.isOnboarded }
          : "NOT FOUND"
      )
      isOnboarded = dbUser?.isOnboarded ?? false
    } catch (err) {
      console.error(
        "[Tour/Layout] DB query failed, defaulting isOnboarded to false:",
        err
      )
      isOnboarded = false
    }
  }

  const role = (session?.user as { role?: string })?.role || "staff"

  return (
    <NotificationWrapper>
      <OnboardingTourProvider isOnboarded={isOnboarded} />
      <ScannerProvider>
        <AppShell userRole={role}>{children}</AppShell>
      </ScannerProvider>
    </NotificationWrapper>
  )
}
