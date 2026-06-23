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

interface ShipmentData {
  id: string
  origin: string
  destination: string
  status: string
}

interface RecentShipmentsProps {
  data?: ShipmentData[]
}

export function RecentShipments({ data = [] }: RecentShipmentsProps) {
  return (
    <DashboardCard className="relative md:col-span-2">
      <CardHeader>
        <CardTitle className="text-balance">Recent Shipments</CardTitle>
        <CardDescription className="text-pretty">
          Latest created shipments and their current status.
        </CardDescription>
      </CardHeader>
      <CardContent className="mask-b-from-50% mask-b-to-100% p-0 pb-2">
        <Table className="border-t">
          <TableCaption className="sr-only">Latest shipments.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6" scope="col">
                AWB Number
              </TableHead>
              <TableHead className="text-center" scope="col">
                Route
              </TableHead>
              <TableHead className="pr-6 text-end" scope="col">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="py-4 text-center text-muted-foreground"
                >
                  No shipments found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow className="hover:bg-transparent" key={row.id}>
                  <TableCell className="max-w-52 truncate pl-6 font-medium">
                    <span className="w-max rounded-none border border-border bg-muted/50 px-1 py-px text-xs tracking-tight tabular-nums">
                      {row.id}
                    </span>
                  </TableCell>
                  <TableCell className="text-center text-sm font-medium tracking-wider text-muted-foreground uppercase">
                    {row.origin} → {row.destination}
                  </TableCell>
                  <TableCell className="pr-6 text-end text-sm font-medium tracking-wider text-muted-foreground uppercase">
                    <span className="tracking-tight tabular-nums">
                      {row.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <div className="absolute inset-x-0 bottom-0 flex h-1/5 items-center justify-center bg-background mask-t-from-30%">
        <Button asChild className="relative" variant="ghost">
          <Link href="/dashboard/shipments">
            View All
            <ArrowRightIcon aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </DashboardCard>
  )
}
