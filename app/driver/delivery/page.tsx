import { z } from "zod"
import { notFound } from "next/navigation"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { manifests } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
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

  if (
    requestedManifestId &&
    !z.string().uuid().safeParse(requestedManifestId).success
  )
    notFound()
  const deliveryScope = and(
    eq(manifests.legType, "delivery"),
    eq(manifests.status, "finalized")
  )
  const relations = {
    originHub: true,
    destinationHub: true,
    driver: true,
    vehicle: true,
    items: { with: { shipment: { with: { invoice: true } } } },
  } as const
  const recentManifests = await db.query.manifests.findMany({
    where: deliveryScope,
    limit: 20,
    with: relations,
    orderBy: [desc(manifests.createdAt), desc(manifests.id)],
  })
  const requestedManifest = requestedManifestId
    ? await db.query.manifests.findFirst({
        where: and(deliveryScope, eq(manifests.id, requestedManifestId)),
        with: relations,
      })
    : undefined
  if (requestedManifestId && !requestedManifest) notFound()
  const rawManifests =
    requestedManifest &&
    !recentManifests.some((item) => item.id === requestedManifest.id)
      ? [requestedManifest, ...recentManifests]
      : recentManifests

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
    createdAt: m.createdAt
      ? new Date(m.createdAt).toISOString()
      : new Date().toISOString(),
  }))

  const selectedRawManifest = requestedManifest ?? rawManifests[0] ?? null

  const activeManifestSummary: ManifestSummaryItem | null = selectedRawManifest
    ? {
        id: selectedRawManifest.id,
        referenceId: selectedRawManifest.referenceId,
        status: selectedRawManifest.status,
        originHub: selectedRawManifest.originHub?.name ?? "Origin Hub",
        destinationHub:
          selectedRawManifest.destinationHub?.name ?? "Destination Hub",
        driverName: selectedRawManifest.driver?.name ?? "Unassigned Driver",
        driverPhone: selectedRawManifest.driver?.phone ?? null,
        vehicleReg:
          selectedRawManifest.vehicle?.registrationNumber ??
          "No vehicle assigned",
        createdAt: selectedRawManifest.createdAt
          ? new Date(selectedRawManifest.createdAt).toISOString()
          : new Date().toISOString(),
      }
    : null

  const rawShipments =
    selectedRawManifest?.items
      .map((item) => item.shipment)
      .filter((shipment) => shipment && !shipment.deletedAt) ?? []

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
  const completedStops = mappedShipments.filter(
    (s) => s.status === "delivered"
  ).length
  const inTransitStops = mappedShipments.filter(
    (s) => s.status === "out-for-delivery" || s.status === "in-transit"
  ).length
  const pendingStops = totalStops - completedStops
  const totalWeightKg =
    Math.round(
      mappedShipments.reduce((acc, s) => acc + (s.weightKg || 0), 0) * 10
    ) / 10
  const totalPieces = mappedShipments.reduce(
    (acc, s) => acc + (s.pieces || 0),
    0
  )
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
