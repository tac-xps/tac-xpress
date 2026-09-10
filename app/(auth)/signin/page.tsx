// Official shadcn two-column sign-in composition with Tailark Veil content treatment.
import Link from "next/link"
import { LoginForm } from "@/components/login-form"
import { Logo } from "@/components/logo"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LockKeyhole } from "lucide-react"
import { CargoImage } from "@/components/public/cargo-image"
export const metadata = { title: "Staff sign in | TAC-XPRESS" }
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>
}) {
  const { reason } = await searchParams
  return (
    <main className="cargo-public grid min-h-svh bg-background text-foreground lg:grid-cols-2">
      <section className="cargo-inverse relative isolate flex flex-col gap-12 overflow-hidden border-b bg-background p-6 sm:p-12 lg:justify-between lg:border-r lg:border-b-0 lg:p-16">
        <CargoImage
          asset="warehouse"
          className="cargo-hero-media hidden lg:block"
          sizes="50vw"
          loading="eager"
        />
        <div className="cargo-hero-shade" aria-hidden="true" />
        <Link href="/" aria-label="TAC-XPRESS home">
          <Logo className="h-7" />
        </Link>
        <div className="hidden max-w-lg flex-col gap-8 lg:flex">
          <p className="text-sm text-muted-foreground">
            TAC-XPRESS / Operations
          </p>
          <h2 className="text-5xl leading-tight font-medium tracking-tight">
            The work behind
            <br />
            every delivery.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            A shared workspace for the team managing shipments, dispatch,
            warehouse, billing and support.
          </p>
          <p className="border-t pt-6 text-sm text-muted-foreground">
            For provisioned admins and staff.
          </p>
        </div>
        <p className="hidden text-sm text-muted-foreground lg:block">
          New Delhi ↔ Northeast India
        </p>
      </section>
      <section className="relative flex flex-col items-center justify-center p-6 py-16 sm:p-12">
        <div className="absolute top-4 right-4">
          <ThemeSwitcher />
        </div>
        <div className="flex w-full max-w-sm flex-col gap-8">
          {reason === "staff-only" && (
            <Alert>
              <LockKeyhole />
              <AlertTitle>Staff workspace only</AlertTitle>
              <AlertDescription>
                Customers can track shipments and contact the team without an
                account. Sign in here only with provisioned staff access.
              </AlertDescription>
            </Alert>
          )}
          <LoginForm />
          <div className="border-t pt-6 text-center text-sm text-muted-foreground">
            <p>Sending or receiving cargo? No sign-in needed.</p>
            <p className="mt-3 flex flex-wrap justify-center gap-4">
              <Link
                href="/track"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Track a shipment
              </Link>
              <Link
                href="/contact"
                className="font-medium text-foreground underline underline-offset-4"
              >
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
