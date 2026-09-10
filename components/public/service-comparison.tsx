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
    "Start here",
    "When the delivery window is the priority",
    "When size and a flexible timeline are the priority",
  ],
  [
    "Details to share",
    "Contents, weight, dimensions and required date",
    "Contents, package count, dimensions and loading access",
  ],
  [
    "Planning considerations",
    "Flight capacity, airline acceptance and onward movement",
    "Road conditions, consolidation and destination access",
  ],
  [
    "Special handling",
    "Declare goods before booking; acceptance is reviewed",
    "Discuss packaging, stacking and loading requirements",
  ],
  [
    "Charges and timing",
    "Confirmed for the consignment and route",
    "Confirmed for the consignment and route",
  ],
]
export function ServiceComparison() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:py-24"
      aria-labelledby="comparison-title"
    >
      <h2 id="comparison-title" className="text-3xl font-medium tracking-tight">
        Choose with the details in view.
      </h2>
      <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
        These are planning considerations, not a promise of availability or a
        fixed transit time. Confirm the service and terms for your particular
        goods with our team.
      </p>
      <div className="mt-10 rounded-lg border bg-card">
        <Table>
          <caption className="sr-only">
            Air and surface cargo planning comparison
          </caption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-36">Consideration</TableHead>
              <TableHead className="min-w-52">Air cargo</TableHead>
              <TableHead className="min-w-52">Surface cargo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(([label, air, surface]) => (
              <TableRow key={label}>
                <TableCell className="font-medium">{label}</TableCell>
                <TableCell className="leading-relaxed whitespace-normal text-muted-foreground">
                  {air}
                </TableCell>
                <TableCell className="leading-relaxed whitespace-normal text-muted-foreground">
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
