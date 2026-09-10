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
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Draft manifests</CardTitle>
        <CardDescription>Latest 10 loads awaiting finalization</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/manifests?status=draft">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5">Reference</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Assignment</TableHead>
              <TableHead className="pr-5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-5 font-mono text-xs">
                  <Link
                    href={`/dashboard/manifests?q=${encodeURIComponent(item.referenceId)}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {item.referenceId}
                  </Link>
                </TableCell>
                <TableCell>
                  {item.originHub?.name ?? "Origin not assigned"} →{" "}
                  {item.destinationHub?.name ?? "Destination not assigned"}
                </TableCell>
                <TableCell>
                  <span className="block">
                    {item.driver?.name ?? "Driver not assigned"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.vehicle?.registrationNumber ?? "Vehicle not assigned"}
                  </span>
                </TableCell>
                <TableCell className="pr-5">
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
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Hub throughput</CardTitle>
        <CardDescription>
          Top four hubs · all-time manifest items
        </CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/hubs">Hubs</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="flex items-center justify-between gap-4 border-t pt-4 first:border-0 first:pt-0"
          >
            <div>
              <p className="font-medium">{hub.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {hub.location}
              </p>
            </div>
            <span className="text-xl tabular-nums">
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
