import { TicketForm } from "@/components/public/ticket-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function ContactSection() {
  return (
    <section
      className="cargo-container pb-16 lg:pb-24"
      aria-label="Contact the TAC-XPRESS team"
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
        {/* Left Column: Context, FAQs and Escalation Guidance */}
        <div className="flex flex-col gap-8 lg:col-span-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Planning a shipment?
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground text-sm">
              Include the origin and destination, contents, package count, weight
              and dimensions. Tell us when you need the goods delivered and any
              special handling needs.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Need help with a delivery?
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground text-sm">
              Add your AWB number and explain the issue. For invoice questions,
              include the invoice reference so the team can find the right record.
            </p>
          </div>

          <Alert className="rounded-none border-border bg-muted/40 p-4">
            <Info className="size-4 text-primary shrink-0" />
            <div className="ml-3">
              <AlertTitle className="text-xs font-bold uppercase tracking-wider font-mono text-foreground">
                What happens next
              </AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground leading-relaxed mt-1">
                Your request goes directly to our operations and dispatch desk.
                Service availability, route transit feasibility, and final spot rates
                are confirmed before a consignment booking is issued.
              </AlertDescription>
            </div>
          </Alert>
        </div>

        {/* Right Column: Bounded, Ergonomic Contact Card */}
        <div className="min-w-0 lg:col-span-7 flex justify-start lg:justify-end">
          <div className="w-full max-w-xl">
            <TicketForm />
          </div>
        </div>
      </div>
    </section>
  )
}
