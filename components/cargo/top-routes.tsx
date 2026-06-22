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
import Image from "next/image"

const FLAGPACK_BASE = "https://flag.vercel.app"

const rows = [
  { origin: "DEL", destination: "IMF", volume: 6120, delta: 5.2 },
  { origin: "IMF", destination: "DEL", volume: 2840, delta: 8.1 },
] as const

const regionNames = new Intl.DisplayNames(["en"], { type: "region" })

function flagUrl(countryCode: string) {
  return `${FLAGPACK_BASE}/s/${countryCode.toUpperCase()}.svg`
}

export function TopRoutes() {
  return (
    <DashboardCard className="relative md:col-span-2">
      <CardHeader>
        <CardTitle className="text-balance">Top Routes</CardTitle>
        <CardDescription className="text-pretty">
          Most active shipping lanes in the last 12 months.
        </CardDescription>
      </CardHeader>
      <CardContent className="mask-b-from-50% mask-b-to-100% p-0 pb-2">
        <Table className="border-t">
          <TableCaption className="sr-only">
            Top routes by shipment volume with year-over-year change.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6" scope="col">
                Route
              </TableHead>
              <TableHead className="text-end tabular-nums" scope="col">
                Volume
              </TableHead>
              <TableHead className="pr-6 text-end" scope="col">
                Change
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                className="hover:bg-transparent"
                key={`${row.origin}-${row.destination}`}
              >
                <TableCell className="max-w-56 truncate pl-6 font-medium">
                  <span className="inline-flex max-w-full items-center gap-2">
                    <Image
                      alt={`Flag of India`}
                      className="h-3.5 w-5 shrink-0 rounded-none object-cover"
                      height={14}
                      src={flagUrl("IN")}
                      width={20}
                      unoptimized
                    />
                    <span className="min-w-0 truncate text-sm font-medium tracking-wider text-muted-foreground uppercase">
                      {row.origin} → {row.destination}
                    </span>
                  </span>
                </TableCell>
                <TableCell className="text-end text-xs tracking-tight text-muted-foreground tabular-nums">
                  {formatInteger(row.volume)}
                </TableCell>
                <TableCell className="pr-6 text-end text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  <span className="tracking-tight tabular-nums">
                    {row.delta > 0 ? "+" : ""}
                    {row.delta}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
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
