// Adapted from @tailark-oss/veil-contact-1; connected to the existing support action.
import { TicketForm } from "@/app/(landing)/components/ticket-form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"
export function ContactSection() {
  return (
    <section
      className="mx-auto grid max-w-7xl gap-10 px-4 pb-16 sm:px-8 lg:grid-cols-5 lg:gap-20 lg:pb-24"
      aria-label="Contact the TAC-XPRESS team"
    >
      <div className="flex flex-col gap-8 lg:col-span-2">
        <div>
          <h2 className="text-xl font-medium">Planning a shipment?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Include the origin and destination, contents, package count, weight
            and dimensions. Tell us when you need the goods delivered and any
            special handling needs.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-medium">Need help with a delivery?</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Add your AWB number and explain the issue. For invoice questions,
            include the invoice reference so the team can find the right record.
          </p>
        </div>
        <Alert>
          <Info />
          <AlertTitle>What happens next</AlertTitle>
          <AlertDescription>
            Your request goes to our support team. The form confirms when it has
            been received. Service availability, acceptance and pricing need to
            be confirmed before a booking is arranged.
          </AlertDescription>
        </Alert>
      </div>
      <div className="min-w-0 lg:col-span-3">
        <TicketForm />
      </div>
    </section>
  )
}
