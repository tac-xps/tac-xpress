import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { HubVolumePoint } from "@/lib/dashboard-metrics"
export type OpenManifest = {
  id: string
  referenceId: string
  status: string
  driver: { name: string } | null
  vehicle: { registrationNumber: string } | null
  originHub: { name: string } | null
  destinationHub: { name: string } | null
}
export function OpenManifests({ data }: { data: OpenManifest[] }) {
  return (
    <Card className="border border-border/80 shadow-xs overflow-hidden">
      <CardHeader className="border-b border-border/80 bg-muted/20 px-6 py-4">
        <div>
          <CardTitle>Draft manifests</CardTitle>
          <CardDescription className="mt-1">
            Latest 10 loads awaiting finalization
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/manifests?status=draft">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs font-semibold text-primary">
                  <Link
                    href={`/dashboard/manifests?q=${encodeURIComponent(item.referenceId)}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {item.referenceId}
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">
                    {item.originHub?.name ?? "Origin not assigned"} →{" "}
                    {item.destinationHub?.name ?? "Destination not assigned"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="block font-medium">
                    {item.driver?.name ?? "Driver not assigned"}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {item.vehicle?.registrationNumber ?? "Vehicle not assigned"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">Draft</Badge>
                </TableCell>
              </TableRow>
            ))}
            {!data.length && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-28 text-center text-muted-foreground"
                >
                  No draft manifests. Create a manifest when a load is ready to
                  plan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function HubActivity({ hubs }: { hubs: HubVolumePoint[] }) {
  return (
    <Card className="border border-border/80 shadow-xs overflow-hidden">
      <CardHeader className="border-b border-border/80 bg-muted/20 px-6 py-4">
        <div>
          <CardTitle>Hub throughput</CardTitle>
          <CardDescription className="mt-1">
            Top four hubs · all-time manifest items
          </CardDescription>
        </div>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/hubs">Hubs</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border/60 p-6">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
          >
            <div>
              <p className="font-medium text-foreground">{hub.name}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {hub.location}
              </p>
            </div>
            <span className="text-lg font-mono font-bold tabular-nums">
              {hub.totalShipments.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
        {!hubs.length && (
          <p className="py-6 text-sm text-muted-foreground">
            No hubs configured. Add the network locations to begin.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
