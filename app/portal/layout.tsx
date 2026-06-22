import { verifyPortalSession } from "@/app/actions/portal-auth"
import Link from "next/link"
import { Package, LogOut } from "lucide-react"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await verifyPortalSession()

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold"
            >
              <Package className="h-5 w-5" />
              <span>TAC-XPRESS Portal</span>
            </Link>

            {session && (
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/portal/track"
                  className="text-foreground transition-colors hover:text-foreground/80"
                >
                  Track
                </Link>
                <Link
                  href="/portal/shipments"
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  Shipments
                </Link>
                <Link
                  href="/portal/invoices"
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  Invoices
                </Link>
                <Link
                  href="/portal/tickets"
                  className="text-foreground/60 transition-colors hover:text-foreground/80"
                >
                  Support
                </Link>
              </nav>
            )}
          </div>

          {session && (
            <div className="flex items-center gap-4">
              <div className="hidden text-sm text-muted-foreground sm:block">
                {session.email}
              </div>
              <form
                action={async () => {
                  "use server"
                  const { logoutPortal } =
                    await import("@/app/actions/portal-auth")
                  await logoutPortal()
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  )
}
