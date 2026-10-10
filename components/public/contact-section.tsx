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
          <div className="border-t-2 border-t-primary/70 border-x border-b border-border/80 bg-card/60 p-5 shadow-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
              Consignment Quotation
            </div>
            <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground">
              Planning a shipment?
            </h2>
            <p className="mt-2 text-body-editorial text-sm">
              <strong className="font-semibold text-foreground">Include volumetric specs. </strong>
              Specify origin, destination, piece count, gross weight, and package dimensions to compute chargeable weight and get an itemized quote.
            </p>
          </div>

          <div className="border-t-2 border-t-primary/70 border-x border-b border-border/80 bg-card/60 p-5 shadow-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
              Consignment Support
            </div>
            <h2 className="mt-2 text-base font-semibold tracking-tight text-foreground">
              Need help with a delivery?
            </h2>
            <p className="mt-2 text-body-editorial text-sm">
              <strong className="font-semibold text-foreground">Provide reference numbers. </strong>
              Include your 10-digit Air Waybill reference for shipment status, or the tax invoice number for billing reconciliation.
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
