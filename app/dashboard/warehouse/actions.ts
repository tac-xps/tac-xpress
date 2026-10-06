"use server"

import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { and, desc, eq, inArray, isNotNull, isNull } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { logAuditInTransaction } from "@/lib/audit"
import { requireDashboardSession } from "@/lib/auth/guards"
import * as Sentry from "@sentry/nextjs"

export interface DiscrepancyRecord {
  id: string
  awb: string
  hub: string
  expectedLocation: string
  scannedLocation: string
  discrepancyType: "location_mismatch" | "unmanifested" | "missing_tag"
  status: "pending" | "reconciled"
  timestamp: string
}

const scanShipmentSchema = z.object({
  awbNumber: z.string().trim().min(1, "AWB Number is required"),
})

export const scanShipmentAction = authActionClient
  .schema(scanShipmentSchema)
  .action(async ({ parsedInput: { awbNumber }, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const [shipment] = await tx
          .select()
          .from(shipments)
          .where(
            and(
              eq(shipments.awbNumber, awbNumber),
              isNull(shipments.deletedAt)
            )
          )
          .limit(1)
          .for("update")

        if (!shipment) {
          return {
            success: false,
            error: `Shipment with AWB ${awbNumber} not found.`,
            shipment: undefined,
          }
        }

        if (shipment.status === "delivered") {
          return {
            success: false,
            error: `Shipment ${awbNumber} is already delivered.`,
            shipment: undefined,
          }
        }

        const newStatus =
          shipment.status === "pending" ? "in-transit" : shipment.status

        if (shipment.status !== newStatus) {
          await tx
            .update(shipments)
            .set({ status: newStatus })
            .where(eq(shipments.id, shipment.id))
        }

        await tx.insert(trackingEvents).values({
          shipmentId: shipment.id,
          awbNumber: shipment.awbNumber,
          eventType: "warehouse_scan",
          status: newStatus,
          location: "Warehouse Hub",
          description: `Shipment scanned and processed at hub.`,
          loggedBy: ctx.session.user.id,
          isPublic: false,
        })

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "scanner_warehouse_transition",
          entity: "shipments",
          entityId: shipment.id,
          before: { status: shipment.status },
          after: { status: newStatus, location: "Warehouse Hub" },
        })

        revalidatePath("/dashboard/warehouse")
        revalidatePath("/dashboard/shipments")

        return {
          success: true,
          error: undefined,
          shipment: {
            id: shipment.id,
            awbNumber: shipment.awbNumber,
            status: newStatus,
            origin: shipment.origin,
            destination: shipment.destination,
          },
        }
      })
    } catch (error) {
      Sentry.captureException(error, {
        tags: { feature: "warehouse-scanner", stage: "scan-action" },
      })
      console.error("Failed to process scan:", error)
      return {
        success: false,
        error: "Database error while processing scan.",
        shipment: undefined,
      }
    }
  })

export async function getWarehouseAuditDiscrepanciesAction(): Promise<{
  success: boolean
  error?: string
  data: DiscrepancyRecord[]
}> {
  await requireDashboardSession()
  try {
    const activeShipments = await db.query.shipments.findMany({
      where: and(
        isNull(shipments.deletedAt),
        inArray(shipments.status, ["pending", "in-transit"])
      ),
      with: {
        manifestItems: true,
      },
      limit: 25,
      orderBy: (s, { desc }) => [desc(s.createdAt)],
    })

    const unmanifested = activeShipments
      .filter((s) => s.manifestItems.length === 0)
      .map((s) => ({
        id: `unman-${s.id}`,
        awb: s.awbNumber,
        hub: s.origin || "Hub Floor",
        expectedLocation: "Unassigned Manifest",
        scannedLocation: "Inbound Staging",
        discrepancyType: "unmanifested" as const,
        status: "pending" as const,
        timestamp: new Date(s.createdAt).toLocaleDateString(),
      }))

    const reconciledEvents = await db.query.trackingEvents.findMany({
      where: and(
        eq(trackingEvents.eventType, "warehouse_audit_reconciled"),
        isNotNull(trackingEvents.awbNumber)
      ),
      limit: 15,
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    })

    const reconciled = reconciledEvents.map((evt) => ({
      id: `rec-${evt.id}`,
      awb: evt.awbNumber || "Unknown",
      hub: evt.location || "Warehouse Hub",
      expectedLocation: evt.locationCode || "Floor Scan",
      scannedLocation: evt.locationCode || "Floor Scan",
      discrepancyType: "location_mismatch" as const,
      status: "reconciled" as const,
      timestamp: new Date(evt.createdAt).toLocaleDateString(),
    }))

    return {
      success: true,
      data: [...unmanifested, ...reconciled],
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "warehouse-audit" } })
    return {
      success: false,
      error: "Failed to load audit discrepancies",
      data: [],
    }
  }
}

export async function verifyAwbForAuditAction(awbNumber: string): Promise<{
  success: boolean
  isDiscrepancy?: boolean
  discrepancy?: DiscrepancyRecord
  message?: string
  error?: string
}> {
  await requireDashboardSession()
  try {
    const trimmed = awbNumber.trim().toUpperCase()
    if (!trimmed) {
      return { success: false, error: "AWB Number is required." }
    }

    const shipment = await db.query.shipments.findFirst({
      where: and(isNull(shipments.deletedAt), eq(shipments.awbNumber, trimmed)),
      with: {
        manifestItems: {
          with: {
            manifest: {
              with: {
                destinationHub: true,
              },
            },
          },
        },
      },
    })

    if (!shipment) {
      return {
        success: true,
        isDiscrepancy: true,
        discrepancy: {
          id: `unreg-${trimmed}-${Date.now()}`,
          awb: trimmed,
          hub: "Floor Staging",
          expectedLocation: "Manifest Record",
          scannedLocation: "Scanner Station",
          discrepancyType: "unmanifested",
          status: "pending",
          timestamp: "Just now",
        },
        message: `AWB ${trimmed} is not registered in system. Flagged as unmanifested discrepancy.`,
      }
    }

    if (shipment.manifestItems.length === 0) {
      return {
        success: true,
        isDiscrepancy: true,
        discrepancy: {
          id: `unman-${shipment.id}`,
          awb: shipment.awbNumber,
          hub: shipment.origin || "Hub Floor",
          expectedLocation: "Manifest Assigned",
          scannedLocation: "Floor Scan",
          discrepancyType: "unmanifested",
          status: "pending",
          timestamp: "Just now",
        },
        message: `Shipment ${trimmed} has no assigned manifest. Added to discrepancy review.`,
      }
    }

    const manifest = shipment.manifestItems[0].manifest
    const dest = manifest?.destinationHub?.name || shipment.destination
    return {
      success: true,
      isDiscrepancy: false,
      message: `Shipment ${trimmed} is properly manifested (Ref: ${manifest?.referenceId || "Assigned"}, Dest: ${dest}). No discrepancy.`,
    }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "warehouse-audit" } })
    return { success: false, error: "Failed to audit AWB scan." }
  }
}

export async function reconcileWarehouseDiscrepanciesAction(
  awbs: string[],
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const session = await requireDashboardSession()
  try {
    return await db.transaction(async (tx) => {
      for (const awb of awbs) {
        const shipment = await tx.query.shipments.findFirst({
          where: and(isNull(shipments.deletedAt), eq(shipments.awbNumber, awb)),
        })

        if (shipment) {
          await tx.insert(trackingEvents).values({
            shipmentId: shipment.id,
            awbNumber: shipment.awbNumber,
            eventType: "warehouse_audit_reconciled",
            status: shipment.status,
            location: "Warehouse Hub",
            description:
              reason || "Warehouse floor audit discrepancy reconciled by staff.",
            loggedBy: session.user.id,
            isPublic: false,
          })

          await logAuditInTransaction(tx, {
            userId: session.user.id,
            userEmail: session.user.email || "staff",
            action: "warehouse_audit_reconciled",
            entity: "shipments",
            entityId: shipment.id,
            before: { discrepancy: "pending" },
            after: {
              discrepancy: "reconciled",
              reason: reason || "Floor audit verified",
            },
          })
        } else {
          await logAuditInTransaction(tx, {
            userId: session.user.id,
            userEmail: session.user.email || "staff",
            action: "warehouse_audit_reconciled_unregistered",
            entity: "unregistered_awb",
            entityId: awb,
            before: { awb, status: "pending" },
            after: {
              awb,
              status: "reconciled",
              reason: reason || "Unregistered consignment verified",
            },
          })
        }
      }

      revalidatePath("/dashboard/warehouse/audit")
      return { success: true }
    })
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "warehouse-audit" } })
    return { success: false, error: "Failed to persist reconciliation." }
  }
}
