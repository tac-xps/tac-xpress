import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TicketForm } from "@/components/public/ticket-form"

export function HomeSupport() {
  return (
    <section
      id="support"
      className="scroll-mt-24 border-t bg-surface"
      aria-labelledby="support-title"
    >
      <div className="cargo-container cargo-section grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="flex flex-col gap-6 lg:col-span-5">
          <p className="text-sm font-mono uppercase tracking-wider font-semibold text-primary">
            Let’s talk cargo
          </p>
          <h2 id="support-title" className="cargo-heading">
            A person to help
            <br />
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              with the next step.
            </span>
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground text-sm">
            Planning a shipment, checking on a delivery, or sorting out an
            invoice? Tell us what you need. Include your AWB number if you have
            one.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild variant="outline" className="border-border hover:bg-muted font-mono text-xs uppercase tracking-wider">
              <Link href="/track">Track a shipment</Link>
            </Button>
            <Button asChild variant="outline" className="border-border hover:bg-muted font-mono text-xs uppercase tracking-wider">
              <Link href="/shipping-guide">Prepare your shipment</Link>
            </Button>
          </div>
        </div>
        <div
          id="quote"
          className="min-w-0 lg:col-span-7 flex justify-start lg:justify-end"
        >
          <div className="w-full max-w-xl">
            <TicketForm className="[border-image:linear-gradient(135deg,var(--primary),var(--border)_60%,transparent)1]" />
          </div>
        </div>
      </div>
    </section>
  )
}
