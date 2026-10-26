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
        <div className="hidden max-w-lg flex-col gap-6 lg:flex">
          <div className="inline-flex items-center gap-2 border border-border/80 bg-muted/40 px-3 py-1 font-mono text-xs uppercase tracking-wider text-foreground font-semibold rounded-none self-start">
            <span className="size-1.5 bg-primary rounded-none" aria-hidden="true" />
            TAC-XPRESS / Operations Desk
          </div>
          <h2 className="text-4xl sm:text-5xl leading-[1.08] tracking-tight">
            <span className="block font-medium text-foreground/80">The work behind</span>
            <span className="block font-bold text-foreground">
              every delivery<span className="text-primary font-black">.</span>
            </span>
          </h2>
          <div className="space-y-3 max-w-md">
            <p className="text-base font-medium text-foreground leading-snug tracking-tight">
              A unified command desk for multi-modal linehaul operations.
            </p>
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="border border-border/70 bg-muted/30 px-2 py-0.5 text-xs rounded-none">
                DEL ⇄ IMF / GAU
              </span>
              <span className="border border-border/70 bg-muted/30 px-2 py-0.5 text-xs rounded-none">
                RESTRICTED ACCESS
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal text-pretty">
              Shared operations workspace for authorized personnel managing real-time shipments, flight manifests, warehouse cross-dock sortation, and GST carriage ledgers.
            </p>
          </div>
          <div className="border-t border-border/70 pt-5 text-xs font-mono text-muted-foreground flex items-center justify-between">
            <span>Provisioned staff credentials required</span>
            <span className="size-1.5 bg-status-delivered rounded-none" aria-hidden="true" />
          </div>
        </div>
        <p className="hidden font-mono text-xs text-muted-foreground lg:block">
          Corridor: New Delhi ⇄ Northeast India
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
