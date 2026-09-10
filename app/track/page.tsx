import Link from "next/link"
import { trackAwb } from "@/app/actions/tracking"
import { SiteNavigation } from "@/components/public/site-navigation"
import { SiteFooter } from "@/components/public/site-footer"
import { TrackingDetails } from "@/components/tracking/tracking-details"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Search, PackageSearch } from "lucide-react"

export const metadata = { title: "Track your shipment | TAC-XPRESS" }
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
    <div className="cargo-public flex min-h-svh flex-col bg-background text-foreground">
      <SiteNavigation />
      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-8 sm:py-16"
      >
        <div className="mb-8 flex flex-col gap-4">
          <p className="text-sm font-medium text-primary">From here to there</p>
          <h1 className="cargo-heading">Where is your cargo?</h1>
          <p className="text-muted-foreground">
            Use the AWB number on your receipt to see your latest recorded
            shipment updates.
          </p>
        </div>
        <form
          action="/track"
          method="get"
          className="mb-8 flex flex-col gap-3 rounded-xl border bg-card p-5 sm:p-6"
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
              className="min-w-0 flex-1"
            />
            <Button type="submit">
              <Search data-icon="inline-start" />
              Track shipment
            </Button>
          </div>
        </form>
        {response?.error && (
          <Alert variant="destructive">
            <AlertTitle>We couldn’t retrieve this shipment</AlertTitle>
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
      </main>
      <SiteFooter />
    </div>
  )
}
