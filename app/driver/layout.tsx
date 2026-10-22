import { AppShell } from "@/components/app-shell"
import { redirect } from "next/navigation"
import { requireDashboardSession } from "@/lib/auth/guards"
import { ScannerProvider } from "@/components/scanner/scanner-provider"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function AppShellSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[260px] border-r bg-muted/20 md:block" />
      <div className="flex w-full flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Skeleton className="h-8 w-8 rounded-none" />
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

function DriverShellWrapper({
  session,
  children,
}: {
  session: Awaited<ReturnType<typeof requireDashboardSession>>
  children: React.ReactNode
}) {
  return (
    <AppShell
      userRole={session.user.role}
      user={{
        ...session.user,
        name: session.user.name,
        image: session.user.avatarUrl,
      }}
    >
      {children}
    </AppShell>
  )
}

import { AuthProvider } from "@/providers/auth-provider"

export default async function DriverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await requireDashboardSession().catch(() => redirect("/signin"))

  return (
    <AuthProvider session={session as any}>
      <ScannerProvider>
        <Suspense fallback={<AppShellSkeleton />}>
          <DriverShellWrapper session={session}>{children}</DriverShellWrapper>
        </Suspense>
      </ScannerProvider>
    </AuthProvider>
  )
}
