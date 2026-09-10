import { AppShell } from "@/components/app-shell"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireDashboardSession } from "@/lib/auth/guards"
import { NotificationWrapper } from "./notification-wrapper"
import { ScannerProvider } from "@/components/scanner/scanner-provider"
import { OnboardingTourProvider } from "@/components/onboarding-tour-provider"
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireDashboardSession().catch(() =>
    redirect("/signin")
  )
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { name: true, avatarUrl: true, isOnboarded: true },
  })
  return (
    <NotificationWrapper>
      <OnboardingTourProvider isOnboarded={user?.isOnboarded ?? false} />
      <ScannerProvider>
        <AppShell
          userRole={session.user.role}
          user={{
            ...session.user,
            name: user?.name || session.user.name,
            image: user?.avatarUrl,
          }}
        >
          {children}
        </AppShell>
      </ScannerProvider>
    </NotificationWrapper>
  )
}
