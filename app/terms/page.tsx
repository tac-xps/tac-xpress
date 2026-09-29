import { PublicPage } from "@/components/public/public-page"
import { PageIntro } from "@/components/public/page-intro"
import {
  ShieldCheck,
  Scale,
  AlertTriangle,
  Clock,
  Box,
  FileText,
  Gavel,
  FileCheck,
} from "lucide-react"

const CURRENT_YEAR = new Date().getFullYear()

export const metadata = {
  title: "Terms and Conditions | TAC-XPRESS",
  description: "Terms and conditions for TAC-XPRESS cargo services.",
}

export default function TermsAndConditionsPage() {
  return (
    <PublicPage>
      <PageIntro
        eyebrow="Legal"
        title="Terms & Conditions"
        description="Please read these terms carefully before booking your shipment. By using TAC-XPRESS services, you agree to the following policies."
      />

      <section className="container mx-auto max-w-4xl px-4 pb-12 md:px-8 lg:pb-16">
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Item 1 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Accurate Declaration</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The Consignor must accurately declare the contents, actual value,
              and condition of the goods prior to booking.
            </p>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Prohibited Goods</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Booking illegal, hazardous, or contraband items is strictly
              prohibited. The Consignor assumes absolute legal and financial
              liability if such items are found.
            </p>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <Box className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Right to Inspect</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The company reserves the right to open and inspect any consignment
              to ensure compliance with safety and legal standards.
            </p>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="text-trend-positive flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Liability & Insurance</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Fragile and electronic items are shipped entirely at the
              owner&apos;s risk unless booked under a special insurance program.
              For uninsured shipments, the maximum compensation for loss,
              damage, or misplacement is strictly limited to Rs. 150/kg.
            </p>
          </div>

          {/* Item 5 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-pending/10 text-status-pending">
              <Scale className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Force Majeure</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              The company shall not be held liable for delays, loss, or damages
              caused by Acts of God, natural disasters, strikes, political
              unrest, or circumstances beyond its control.
            </p>
          </div>

          {/* Item 6 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-status-pending/10 text-status-pending">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Demurrage Charges</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Consignments must be collected from the destination office within
              7 days. Demurrage (godown) charges of Rs. 55/day will apply
              starting 21 days from the date of receipt.
            </p>
          </div>

          {/* Item 7 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">Lien and Disposal</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Consignments left unclaimed for 45 days will be marked as
              abandoned. The company reserves the right to dispose of or auction
              unclaimed items after 100 days from the receipt date to recover
              dues, without further communication.
            </p>
          </div>

          {/* Item 8 */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Gavel className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-foreground">
              Governing Law & Jurisdiction
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              All bookings are subject to the terms of Tapan Associate Courier
              and Cargo Service. Any disputes arising shall be subject to the
              exclusive jurisdiction of the courts in Delhi.
            </p>
          </div>
        </div>

        <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {CURRENT_YEAR} Tapan Associate Courier and Cargo
            Service. All rights reserved.
          </p>
        </div>
      </section>
    </PublicPage>
  )
}
