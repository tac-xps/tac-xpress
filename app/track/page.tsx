import Link from "next/link"
import { trackAwb } from "@/app/actions/tracking"
import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import { TrackingDetails } from "@/components/tracking/tracking-details"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, PackageSearch } from "lucide-react"

export const metadata = {
  title: "Track your shipment | TAC-XPRESS",
  description:
    "Enter your AWB number to see real-time shipment milestones and delivery status.",
}
interface TrackingPageProps {
  searchParams: Promise<{ awb?: string | string[] }>
}
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
      <PageIntro
        eyebrow="Track a shipment"
        title="Where is your cargo?"
        description="Use the AWB number on your receipt to see your latest recorded shipment updates."
      />
      <section className="cargo-container pb-16 lg:pb-24">
        <form
          action="/track"
          method="get"
          className="mb-8 flex flex-col gap-3 rounded-none border bg-card p-5 sm:p-6"
        >
          <Label htmlFor="tracking-awb">AWB number</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="tracking-awb"
              name="awb"
              defaultValue={awb}
              placeholder="Enter your AWB number"
              required
              maxLength={40}
              autoCapitalize="characters"
              className="min-w-0 flex-1 font-mono uppercase tracking-wider text-sm"
            />
            <Button type="submit">
              <Search data-icon="inline-start" />
              Track shipment
            </Button>
          </div>
        </form>
        {response?.error && (
          <Alert variant="destructive">
            <AlertTitle>We could not retrieve this shipment</AlertTitle>
            <AlertDescription>
              {response.error} Check the number on your receipt or{" "}
              <Link href="/#support" className="underline">
                contact support
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}
        {response?.success && response.data && (
          <TrackingDetails result={response.data} />
        )}
        {!awb && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <PackageSearch
              className="size-10 text-muted-foreground"
              aria-hidden="true"
            />
            <h2 className="text-lg font-medium">Ready when you are.</h2>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Enter your AWB number above to see published shipment updates. For
              invoices or a question about your booking, contact our team.
            </p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact our team</Link>
            </Button>
          </div>
        )}
      </section>
    </PublicPage>
  )
}
