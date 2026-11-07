import { AppShell } from "@/components/app-shell"
import { requireStaffPage } from "@/lib/auth/page-access"
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
        <main className="isolate relative min-w-0 flex-1 p-5 sm:p-6 lg:p-8 xl:p-10">
          <div className="relative mx-auto flex w-full max-w-[1536px] min-w-0 flex-col gap-6 md:gap-8">
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
  session: Awaited<ReturnType<typeof requireStaffPage>>
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
  const session = await requireStaffPage()

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
