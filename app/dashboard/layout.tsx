import { AppShell } from "@/components/app-shell"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { requireDashboardSession } from "@/lib/auth/guards"
import { NotificationWrapper } from "./notification-wrapper"
import { ScannerProvider } from "@/components/scanner/scanner-provider"
import { OnboardingTourProvider } from "@/components/onboarding-tour-provider"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[260px] border-r bg-muted/20 md:block" />
      <div className="flex w-full flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Skeleton className="h-8 w-8 rounded-full" />
        </header>
        <main className="flex flex-1 flex-col p-4 md:p-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 md:gap-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-32 w-full rounded-none" />
          </div>
        </main>
      </div>
    </div>
  )
}

async function AppShellWrapper({
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
    <>
      <OnboardingTourProvider isOnboarded={user?.isOnboarded ?? false} />
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
    </>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationWrapper>
      <ScannerProvider>
        <Suspense fallback={<AppShellSkeleton />}>
          <AppShellWrapper>{children}</AppShellWrapper>
        </Suspense>
      </ScannerProvider>
    </NotificationWrapper>
  )
}
