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

      <section className="container mx-auto max-w-5xl px-4 pb-16 md:px-8 lg:pb-24">
        <div className="border border-border/80 bg-card divide-y divide-border/70 shadow-xs">
          {/* Clause 01 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary font-semibold">
                  <FileCheck className="size-3.5 text-primary" />
                  <span>Clause 01 · Statutory Compliance</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Accurate Cargo Declaration
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  The Consignor must accurately declare contents, actual invoice valuation, piece count, and condition of goods prior to terminal intake. Statutory documentation including GST E-Way bills must match physical freight.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 02 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-destructive font-semibold">
                  <AlertTriangle className="size-3.5 text-destructive" />
                  <span>Clause 02 · Safety Prohibition</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Prohibited & Hazardous Articles
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  Booking contraband, combustible materials, narcotics, or undeclared dangerous goods is strictly prohibited under civil aviation and carriage laws. The Consignor assumes absolute legal and financial liability if such items are tendered.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 03 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary font-semibold">
                  <Box className="size-3.5 text-primary" />
                  <span>Clause 03 · Custody & Security</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Inspection and X-Ray Authority
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  The carrier reserves the operational right to inspect, weigh, and submit any consignment to airport security X-ray screening to verify regulatory compliance and aviation safety standards.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 04 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary font-semibold">
                  <ShieldCheck className="size-3.5 text-primary" />
                  <span>Clause 04 · Risk Assessment</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Carriage Liability & Insurance Coverage
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  Fragile and commercial electronic items are consigned under owner risk unless insured under a declared-value carrier policy. For uninsured consignments, maximum compensation for proven loss or transit damage is strictly capped at ₹150/kg.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 05 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <Scale className="size-3.5 text-muted-foreground" />
                  <span>Clause 05 · Exceptional Events</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Force Majeure Exclusions
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  The company shall not be held liable for delays, loss, or damages caused by Acts of God, natural disasters, strikes, political unrest, or circumstances beyond its control.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 06 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>Clause 06 · Destination Protocols</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Hub Demurrage & Storage Schedules
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  Consignments must be collected from the destination office within 7 days. Demurrage (godown) charges of ₹55/day will apply starting 21 days from the date of receipt.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 07 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
                  <FileText className="size-3.5 text-muted-foreground" />
                  <span>Clause 07 · Warehouse Disposition</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Carrier Lien and Unclaimed Freight Disposal
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  Consignments left unclaimed for 45 days will be marked as abandoned. The company reserves the right to dispose of or auction unclaimed items after 100 days from the receipt date to recover dues, without further communication.
                </p>
              </div>
            </div>
          </div>

          {/* Clause 08 */}
          <div className="p-6 sm:p-8 hover:bg-muted/20 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-primary font-semibold">
                  <Gavel className="size-3.5 text-primary" />
                  <span>Clause 08 · Legal Authority</span>
                </div>
                <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Governing Law & Delhi Jurisdiction
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground text-pretty max-w-[65ch]">
                  All consignments are subject to standard contract terms of Tapan Associate Courier and Cargo Service. All arbitration and legal disputes are subject to the exclusive jurisdiction of the competent courts of New Delhi, India.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-border/80 pt-6 text-center font-mono text-xs text-muted-foreground">
          <p>
            © {CURRENT_YEAR} Tapan Associate Courier and Cargo Service. All rights reserved.
          </p>
        </div>
      </section>
    </PublicPage>
  )
}

