import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TicketForm } from "@/app/(landing)/components/ticket-form"
export function HomeSupport() {
  return (
    <section
      id="support"
      className="scroll-mt-24 border-t bg-surface"
      aria-labelledby="support-title"
    >
      <div className="cargo-container cargo-section grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-6">
          <p className="text-sm font-medium text-primary">Let’s talk cargo</p>
          <h2 id="support-title" className="cargo-heading">
            A person to help
            <br />
            with the next step.
          </h2>
          <p className="max-w-md leading-relaxed text-muted-foreground">
            Planning a shipment, checking on a delivery, or sorting out an
            invoice? Tell us what you need. Include your AWB number if you have
            one.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/track">Track a shipment</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/shipping-guide">Prepare your shipment</Link>
            </Button>
          </div>
        </div>
        <div
          id="quote"
          className="min-w-0 rounded-xl border bg-card p-2 sm:p-4"
        >
          <TicketForm />
        </div>
      </div>
    </section>
  )
}
