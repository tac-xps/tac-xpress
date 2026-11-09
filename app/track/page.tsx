import Link from "next/link"
import { trackAwb } from "@/app/actions/tracking"
import { PublicPage } from "@/components/public/public-page"
import { TrackingDetails } from "@/components/tracking/tracking-details"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Search,
  PackageSearch,
  Plane,
  Truck,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react"

export const metadata = {
  title: "Track your shipment | TAC-XPRESS",
  description:
    "Enter your AWB number to see real-time shipment milestones, gate custody, and delivery status between New Delhi and Imphal.",
}

interface TrackingPageProps {
  searchParams: Promise<{ awb?: string | string[] }>
}

const SAMPLE_AWBS = [
  { awb: "AWB-100200300", label: "In Transit", mode: "Air" },
  { awb: "AWB-500600700", label: "Pending", mode: "Surface" },
  { awb: "AWB-12345", label: "Delivered", mode: "Air" },
]

/**
 * Server-rendered public shipment tracking station.
 * Supports standard GET submissions without client-side JavaScript.
 *
 * @param props - Next.js page properties containing URL search parameters.
 * @returns Server-rendered tracking view with telemetry or consignment status.
 */
export default async function TrackingPage({
  searchParams,
}: TrackingPageProps) {
  const params = await searchParams
  const awb =
    typeof params.awb === "string" ? params.awb.trim().toUpperCase() : ""
  const form = new FormData()
  form.set("awb_number", awb)
  const response = awb ? await trackAwb(form) : null

  return (
    <PublicPage>
      {/* Telemetry Header */}
      <section className="relative border-b border-border/80 bg-muted/15 py-12 lg:py-16">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-12">
          {/* Corridor Status Beacon */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center border border-border/80 bg-background px-2.5 py-1 font-mono text-[11px] font-semibold text-primary rounded-none">
              DEL ⇄ IMF NODE
            </span>
            <span className="border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground rounded-none">
              Express Linehaul Active
            </span>
            <span className="hidden sm:inline-flex border border-border/60 bg-muted/40 px-2 py-0.5 font-mono text-[11px] text-muted-foreground rounded-none">
              Gate Telemetry v2.4
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground font-sans">
            Where is your cargo?
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-muted-foreground">
            Enter your AWB number to access real-time gate induction, flight manifest, and station handoff telemetry on the New Delhi ⇄ Imphal bilateral corridor.
          </p>

          {/* Quick Search Form */}
          <div className="mt-8 max-w-3xl">
            <form
              action="/track"
              method="get"
              className="flex flex-col gap-3 rounded-none border border-border/80 bg-card p-5 sm:p-6 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="tracking-awb"
                  className="font-mono text-xs font-bold text-muted-foreground"
                >
                  AWB number
                </Label>
                <span className="font-mono text-[11px] text-muted-foreground">
                  DEL (IGI) ⇄ IMF (Bir Tikendrajit)
                </span>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Input
                    id="tracking-awb"
                    name="awb"
                    defaultValue={awb}
                    placeholder="Enter your AWB number"
                    required
                    maxLength={40}
                    autoCapitalize="characters"
                    className="h-11 rounded-none border-border font-mono text-sm pl-3 pr-8"
                  />
                  {awb && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted-foreground">
                      VERIFIED
                    </span>
                  )}
                </div>
                <Button
                  type="submit"
                  className="h-11 rounded-none px-6 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
                >
                  <Search className="size-4 mr-2" aria-hidden="true" />
                  Track shipment
                </Button>
              </div>

              {/* Sample AWB Shortcuts */}
              <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border/60 pt-3">
                <span className="font-mono text-[11px] text-muted-foreground">Sample AWBs:</span>
                {SAMPLE_AWBS.map((sample) => (
                  <Link
                    key={sample.awb}
                    href={`/track?awb=${sample.awb}`}
                    className="inline-flex items-center gap-1 border border-border/80 bg-muted/40 hover:bg-muted px-2 py-0.5 font-mono text-[11px] text-foreground transition-colors rounded-none"
                  >
                    <span>{sample.awb}</span>
                    <span className="text-[10px] text-muted-foreground">({sample.mode})</span>
                    <ArrowRight className="size-2.5 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto w-full max-w-[1320px] px-4 py-12 sm:px-6 lg:px-12">
        {/* Error Notification */}
        {response?.error && (
          <div className="mb-8">
            <Alert variant="destructive" className="rounded-none border-destructive/50 bg-destructive/10">
              <AlertTitle className="font-semibold text-destructive">
                We could not retrieve this shipment
              </AlertTitle>
              <AlertDescription className="mt-1 text-xs text-foreground/85 leading-relaxed">
                {response.error} Check the number on your receipt or{" "}
                <Link href="/#contact" className="underline font-medium">
                  contact support
                </Link>
                . For urgent dispatch updates, reach out directly at +91 98561 73829.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Success Tracking Result */}
        {response?.success && response.data && (
          <div className="w-full">
            <TrackingDetails result={response.data} />
          </div>
        )}

        {/* Empty State with Corridor Specifications */}
        {!awb && (
          <div className="flex flex-col gap-12">
            <div className="flex flex-col items-center gap-4 py-8 text-center max-w-lg mx-auto">
              <div className="flex size-14 items-center justify-center border border-border/80 bg-muted/30 rounded-none text-muted-foreground">
                <PackageSearch className="size-7 text-primary" aria-hidden="true" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-sans">
                Ready when you are.
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Enter your AWB number above to see published shipment updates. For
                invoices or a question about your booking, contact our team.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <Button asChild variant="outline" className="rounded-none text-xs h-9 px-4">
                  <Link href="/#contact">Contact our team</Link>
                </Button>
                <Button asChild className="rounded-none text-xs h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/#pricing">View Corridor Tariffs</Link>
                </Button>
              </div>
            </div>

            {/* Bilateral Infrastructure Highlights */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-border/80 pt-10">
              <div className="border border-border/80 bg-card p-5 rounded-none">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="size-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    Air Cargo Linehaul
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-2">
                  <Clock className="size-3 text-primary" />
                  <span>24-48h SLA</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Daily departures connecting IGI Airport (DEL) directly with Bir Tikendrajit Airport (IMF). Commercial air express with temperature-monitored compartments.
                </p>
              </div>

              <div className="border border-border/80 bg-card p-5 rounded-none">
                <div className="flex items-center gap-2 mb-3">
                  <Truck className="size-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    Surface Highway Freight
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-2">
                  <Clock className="size-3 text-primary" />
                  <span>4-7d SLA</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Secure arterial transit via NH-27/NH-2 through North Bengal corridor into Imphal hub. Dedicated fleet with satellite GPS telemetry and dual-driver crews.
                </p>
              </div>

              <div className="border border-border/80 bg-card p-5 rounded-none">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="size-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-foreground">
                    Gate Custody Protocol
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-2">
                  <MapPin className="size-3 text-primary" />
                  <span>Optical Verification</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Strict barcode and custody handoff at every transfer point. Zero manual updates without physical optical verification at intake, tarmac, and delivery.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </PublicPage>
  )
}
