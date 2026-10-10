// Adapted from @tailark-oss/veil-comparator-1 using the official shadcn Table.
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const rows = [
  [
    "Operational Fit",
    "Priority 24–48 hour transit when schedule speed and time-critical delivery are paramount.",
    "High-capacity road linehaul when volume freight, heavy machinery, or cost optimization is primary.",
  ],
  [
    "Consignment Specs",
    "Piece count, gross weight, L × W × H external dimensions, and required flight departure date.",
    "Pallet count, total cubic volume, gross tonnage, and destination dock loading constraints.",
  ],
  [
    "Corridor Routing",
    "Commercial scheduled flight belly-hold capacity, terminal security screening, and onward station sortation.",
    "National highway arterial routes, multi-axle freight vehicles, and all-weather regional transit.",
  ],
  [
    "Statutory Declarations",
    "Mandatory IATA DG check (lithium batteries UN 3480/3481, liquids) and consignor identity declarations.",
    "Stackability constraints, center-of-gravity stencil markers, and transit-grade pallet banding.",
  ],
  [
    "Tariff & Billing Basis",
    "Calculated on chargeable volumetric weight (1:6000 ratio vs gross weight), plus statutory 18% GST.",
    "Determined by gross cubic volume, truckload class, corridor mileage index, and freight tariff.",
  ],
]

export function ServiceComparison() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24"
      aria-labelledby="comparison-title"
    >
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-primary">
            <span className="size-1.5 rounded-none bg-primary" aria-hidden="true" />
            Corridor Evaluation
          </div>
          <h2 id="comparison-title" className="mt-3 text-section text-foreground">
            Choose with the details in view.
          </h2>
        </div>
        <p className="max-w-md text-body-editorial">
          These planning criteria outline operational differences. Confirm route availability, spot tariffs, and transit timelines with our operations desk.
        </p>
      </div>

      <div className="mt-10 rounded-none border border-border/80 bg-card/60 shadow-xs overflow-hidden">
        <Table>
          <caption className="sr-only">
            Air and surface cargo planning comparison
          </caption>
          <TableHeader>
            <TableRow className="border-b border-border/80 bg-muted/30">
              <TableHead className="min-w-40 font-mono text-xs uppercase tracking-wider font-semibold text-foreground py-4">
                Planning Criteria
              </TableHead>
              <TableHead className="min-w-64 font-mono text-xs uppercase tracking-wider font-semibold text-primary py-4">
                Air Cargo · Express Flight
              </TableHead>
              <TableHead className="min-w-64 font-mono text-xs uppercase tracking-wider font-semibold text-foreground py-4">
                Surface Cargo · Arterial Linehaul
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/70">
            {rows.map(([label, air, surface]) => (
              <TableRow key={label} className="transition-colors hover:bg-muted/20">
                <TableCell className="font-medium text-foreground py-4 align-top">
                  {label}
                </TableCell>
                <TableCell className="leading-relaxed whitespace-normal text-body-editorial py-4 align-top">
                  {air}
                </TableCell>
                <TableCell className="leading-relaxed whitespace-normal text-body-editorial py-4 align-top">
                  {surface}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
