import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { manifests, shipments } from "@/lib/db/schema"
import { desc } from "drizzle-orm"
import {
  DeliveryClient,
  type ManifestSummaryItem,
  type DeliveryShipmentItem,
  type RouteSummaryMetrics,
} from "./delivery-client"

export const dynamic = "force-dynamic"

interface DriverDeliveryPageProps {
  searchParams: Promise<{
    manifestId?: string
  }>
}

export default async function DriverDeliveryPage({
  searchParams,
}: DriverDeliveryPageProps) {
  await requireStaffPage()

  const resolvedParams = await searchParams
  const requestedManifestId = resolvedParams?.manifestId

  // Fetch recent manifests with relations
  const rawManifests = await db.query.manifests.findMany({
    limit: 20,
    with: {
      originHub: true,
      destinationHub: true,
      driver: true,
      vehicle: true,
      items: {
        with: {
          shipment: {
            with: {
              invoice: true,
            },
          },
        },
      },
    },
    orderBy: [desc(manifests.createdAt)],
  })

  // Format manifest summaries for the switcher
  const manifestsList: ManifestSummaryItem[] = rawManifests.map((m) => ({
    id: m.id,
    referenceId: m.referenceId,
    status: m.status,
    originHub: m.originHub?.name ?? "Origin Hub",
    destinationHub: m.destinationHub?.name ?? "Destination Hub",
    driverName: m.driver?.name ?? "Unassigned Driver",
    driverPhone: m.driver?.phone ?? null,
    vehicleReg: m.vehicle?.registrationNumber ?? "No vehicle assigned",
    createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
  }))

  // Resolve currently active manifest
  const selectedRawManifest =
    (requestedManifestId
      ? rawManifests.find((m) => m.id === requestedManifestId)
      : rawManifests[0]) ?? null

  const activeManifestSummary: ManifestSummaryItem | null = selectedRawManifest
    ? {
        id: selectedRawManifest.id,
        referenceId: selectedRawManifest.referenceId,
        status: selectedRawManifest.status,
        originHub: selectedRawManifest.originHub?.name ?? "Origin Hub",
        destinationHub: selectedRawManifest.destinationHub?.name ?? "Destination Hub",
        driverName: selectedRawManifest.driver?.name ?? "Unassigned Driver",
        driverPhone: selectedRawManifest.driver?.phone ?? null,
        vehicleReg: selectedRawManifest.vehicle?.registrationNumber ?? "No vehicle assigned",
        createdAt: selectedRawManifest.createdAt
          ? new Date(selectedRawManifest.createdAt).toISOString()
          : new Date().toISOString(),
      }
    : null

  // Resolve assigned shipments
  let rawShipments: any[] = []
  if (selectedRawManifest && selectedRawManifest.items.length > 0) {
    rawShipments = selectedRawManifest.items
      .map((item) => item.shipment)
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
  } else if (rawManifests.length === 0) {
    // If no manifests exist yet, fetch recent shipments so driver delivery console remains functional
    rawShipments = await db.query.shipments.findMany({
      limit: 15,
      orderBy: [desc(shipments.createdAt)],
      with: {
        invoice: true,
      },
    })
  }

  // Map to DeliveryShipmentItem
  const mappedShipments: DeliveryShipmentItem[] = rawShipments.map((s) => ({
    id: s.id,
    awbNumber: s.awbNumber,
    status: s.status,
    consigneeName: s.consigneeName ?? "Consignee",
    consigneePhone: s.consigneePhone ?? null,
    consigneeAddress: s.consigneeAddress || s.destination || "Destination Hub",
    consigneePinCode: s.consigneePinCode ?? null,
    pieces: Number(s.pieces ?? 1),
    weightKg: Number(s.weightKg ?? 1),
    serviceType: s.serviceType ?? "express_air",
    declaredValue: Number(s.declaredValue ?? 0),
    edd: s.edd ? new Date(s.edd).toISOString() : null,
    invoiceAmount: s.invoice ? s.invoice.amount / 100 : null,
    paymentStatus: s.invoice?.status ?? "unpaid",
  }))

  // Calculate Route Telemetry Metrics
  const totalStops = mappedShipments.length
  const completedStops = mappedShipments.filter((s) => s.status === "delivered").length
  const inTransitStops = mappedShipments.filter(
    (s) => s.status === "out-for-delivery" || s.status === "in-transit"
  ).length
  const pendingStops = totalStops - completedStops
  const totalWeightKg = Math.round(
    mappedShipments.reduce((acc, s) => acc + (s.weightKg || 0), 0) * 10
  ) / 10
  const totalPieces = mappedShipments.reduce((acc, s) => acc + (s.pieces || 0), 0)
  const codPendingAmount = mappedShipments.reduce((acc, s) => {
    if (s.invoiceAmount && s.paymentStatus !== "paid") {
      return acc + s.invoiceAmount
    }
    return acc
  }, 0)

  const summaryMetrics: RouteSummaryMetrics = {
    totalStops,
    completedStops,
    inTransitStops,
    pendingStops,
    totalWeightKg,
    totalPieces,
    codPendingAmount,
  }

  return (
    <DeliveryClient
      manifests={manifestsList}
      activeManifest={activeManifestSummary}
      shipments={mappedShipments}
      summary={summaryMetrics}
    />
  )
}

