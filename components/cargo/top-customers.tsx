import { formatInteger } from "@/components/formater"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCard } from "@/components/dashboard-card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

const rows = [
  { name: "Delhi Retailers", shipments: 1420 },
  { name: "Manipur Handlooms", shipments: 980 },
  { name: "TechParts India", shipments: 760 },
  { name: "MedEquip Imphal", shipments: 540 },
  { name: "Capital Goods LLC", shipments: 410 },
] as const

export function TopCustomers() {
  return (
    <DashboardCard className="relative">
      <CardHeader>
        <CardTitle className="text-balance">Top Customers</CardTitle>
        <CardDescription className="text-pretty">
          Customers with the highest shipping volume.
        </CardDescription>
      </CardHeader>
      <CardContent className="mask-b-from-50% mask-b-to-100% p-0 pb-2">
        <Table className="border-t">
          <TableCaption className="sr-only">
            Top customers by shipment volume.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6" scope="col">
                Customer Name
              </TableHead>
              <TableHead className="pr-6 text-end tabular-nums" scope="col">
                Shipments
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow className="hover:bg-transparent" key={row.name}>
                <TableCell className="max-w-56 truncate pl-6 font-medium">
                  <span className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
                    {row.name || Object.keys(row)[0]}
                  </span>
                </TableCell>
                <TableCell className="pr-6 text-end text-xs tracking-tight text-muted-foreground tabular-nums">
                  {formatInteger(row.shipments)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <div className="absolute inset-x-0 bottom-0 flex h-1/5 items-center justify-center bg-background mask-t-from-30%">
        <Button asChild className="relative" variant="ghost">
          <Link href="/dashboard/customers">
            View All
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  )
}
