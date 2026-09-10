// Adapted from @tailark-oss/veil-content-2.
import Link from "next/link"
import { Button } from "@/components/ui/button"
export function TrackingExplainer() {
  return (
    <section className="bg-surface" aria-labelledby="tracking-info-title">
      <div className="cargo-container cargo-section">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="cargo-eyebrow mb-5 text-muted-foreground">
              04 / Stay informed
            </p>
            <h2 id="tracking-info-title" className="cargo-heading">
              Know the last recorded step.
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/track">Open shipment tracking</Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <p className="border-t pt-6 leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              One reference for the journey.
            </span>{" "}
            Keep your AWB number from the booking receipt. Public tracking
            brings together recorded shipment events so you can check progress
            without creating an account.
          </p>
          <p className="border-t pt-6 leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              An update needs context.
            </span>{" "}
            Tracking is based on recorded events, not continuous vehicle GPS. If
            an update is unclear, contact the team with your AWB, destination
            and question so we can look into the right shipment.
          </p>
        </div>
      </div>
    </section>
  )
}
