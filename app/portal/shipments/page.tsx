import { verifyPortalSession } from "@/app/actions/portal-auth"
import { getPortalShipments } from "@/app/actions/portal-shipments"
import { redirect } from "next/navigation"
import ShipmentsTable from "../components/shipments-table"

export const metadata = {
  title: "My Shipments | TAC-XPRESS Portal",
  description: "View your complete shipment history",
}

export default async function PortalShipmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>
}) {
  const session = await verifyPortalSession()
  if (!session) redirect("/portal")

  const params = await searchParams
  const page = Math.max(0, parseInt(params.page ?? "0", 10))

  const response = await getPortalShipments(page)
  const result =
    response.success && response.data
      ? response.data
      : {
          shipments: [],
          total: 0,
          page: 0,
          pageSize: 25,
          hasMore: false,
        }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">My Shipments</h1>
        <p className="text-sm text-muted-foreground">
          {result.total} shipment{result.total !== 1 ? "s" : ""} on record for{" "}
          {session.email}
        </p>
      </div>

      <ShipmentsTable
        shipments={result.shipments}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        hasMore={result.hasMore}
      />
    </div>
  )
}
