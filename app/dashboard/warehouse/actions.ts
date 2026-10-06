"use server"

import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { and, desc, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { logAuditInTransaction, logAudit } from "@/lib/audit"
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
    const trackedEvents = await db.query.trackingEvents.findMany({
      where: inArray(trackingEvents.eventType, [
        "warehouse_audit_discrepancy",
        "warehouse_audit_reconciled",
      ]),
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    })

    const itemsMap = new Map<string, DiscrepancyRecord>()

    for (const evt of trackedEvents) {
      const awb = evt.awbNumber
      if (!awb || itemsMap.has(awb)) continue

      const isReconciled = evt.eventType === "warehouse_audit_reconciled"

      itemsMap.set(awb, {
        id: `audit-${evt.id}`,
        awb,
        hub: evt.location || "Warehouse Hub",
        expectedLocation: isReconciled
          ? evt.locationCode || "Floor Scan"
          : "Manifest Assigned",
        scannedLocation: evt.locationCode || "Floor Scan",
        discrepancyType: isReconciled ? "location_mismatch" : "unmanifested",
        status: isReconciled ? "reconciled" : "pending",
        timestamp: new Date(evt.createdAt).toLocaleDateString(),
      })
    }

    try {
      const unregRows = await db.execute<{
        id: string
        action: string
        entity_id: string
        after: unknown
        created_at: string
      }>(sql`
        select id, action, entity_id, "after", created_at
        from (
          select distinct on (entity_id) id, action, entity_id, "after", created_at
          from public.audit_log
          where action in ('warehouse_audit_discrepancy_unregistered', 'warehouse_audit_reconciled_unregistered')
          order by entity_id, created_at desc
        ) latest_unreg
        order by created_at desc
      `)

      for (const row of unregRows) {
        const awb = row.entity_id
        if (!awb || itemsMap.has(awb)) continue

        const afterData =
          typeof row.after === "string"
            ? (JSON.parse(row.after) as Record<string, unknown>)
            : (row.after as Record<string, unknown> | null)

        const isReconciled =
          row.action === "warehouse_audit_reconciled_unregistered"

        itemsMap.set(awb, {
          id: `unreg-${row.id}`,
          awb,
          hub: (afterData?.hub as string) || "Floor Staging",
          expectedLocation:
            (afterData?.expectedLocation as string) || "Manifest Record",
          scannedLocation:
            (afterData?.scannedLocation as string) || "Scanner Station",
          discrepancyType: "unmanifested",
          status: isReconciled ? "reconciled" : "pending",
          timestamp: new Date(row.created_at).toLocaleDateString(),
        })
      }
    } catch (auditErr) {
      Sentry.captureException(auditErr, {
        tags: { area: "warehouse-audit-log-query" },
      })
    }

    return {
      success: true,
      data: Array.from(itemsMap.values()),
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
  const session = await requireDashboardSession()
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
      try {
        const existingUnreg = await db.execute<{ action: string }>(sql`
          select action from public.audit_log
          where entity_id = ${trimmed}
            and action in ('warehouse_audit_discrepancy_unregistered', 'warehouse_audit_reconciled_unregistered')
          order by created_at desc
          limit 1
        `)
        const alreadyPending =
          existingUnreg.length > 0 &&
          existingUnreg[0].action ===
            "warehouse_audit_discrepancy_unregistered"

        if (!alreadyPending) {
          await logAudit({
            userId: session.user.id,
            userEmail: session.user.email || "staff",
            action: "warehouse_audit_discrepancy_unregistered",
            entity: "unregistered_awb",
            entityId: trimmed,
            resourceId: trimmed,
            after: {
              awb: trimmed,
              hub: "Floor Staging",
              expectedLocation: "Manifest Record",
              scannedLocation: "Scanner Station",
              discrepancyType: "unmanifested",
              status: "pending",
            },
          })
        }
      } catch (err) {
        Sentry.captureException(err, {
          tags: { area: "warehouse-audit-log-unreg" },
        })
      }

      const discrepancy: DiscrepancyRecord = {
        id: `unreg-${trimmed}`,
        awb: trimmed,
        hub: "Floor Staging",
        expectedLocation: "Manifest Record",
        scannedLocation: "Scanner Station",
        discrepancyType: "unmanifested",
        status: "pending",
        timestamp: "Just now",
      }

      return {
        success: true,
        isDiscrepancy: true,
        discrepancy,
        message: `AWB ${trimmed} is not registered in system. Flagged as unmanifested discrepancy.`,
      }
    }

    if (shipment.manifestItems.length === 0) {
      const existingEvent = await db.query.trackingEvents.findFirst({
        where: and(
          eq(trackingEvents.shipmentId, shipment.id),
          inArray(trackingEvents.eventType, [
            "warehouse_audit_discrepancy",
            "warehouse_audit_reconciled",
          ])
        ),
        orderBy: (evt, { desc }) => [desc(evt.createdAt)],
      })

      let eventId = existingEvent?.id
      if (
        !existingEvent ||
        existingEvent.eventType !== "warehouse_audit_discrepancy"
      ) {
        const [newEvent] = await db
          .insert(trackingEvents)
          .values({
            shipmentId: shipment.id,
            awbNumber: shipment.awbNumber,
            eventType: "warehouse_audit_discrepancy",
            status: shipment.status,
            location: shipment.origin || "Hub Floor",
            locationCode: "Floor Scan",
            description:
              "Warehouse floor audit flagged consignment: unassigned manifest.",
            loggedBy: session.user.id,
            isPublic: false,
          })
          .returning()

        eventId = newEvent?.id

        try {
          await logAudit({
            userId: session.user.id,
            userEmail: session.user.email || "staff",
            action: "warehouse_audit_discrepancy",
            entity: "shipments",
            entityId: shipment.id,
            resourceId: shipment.awbNumber,
            after: {
              awb: shipment.awbNumber,
              discrepancyType: "unmanifested",
              status: "pending",
            },
          })
        } catch (auditErr) {
          Sentry.captureException(auditErr, {
            tags: { area: "warehouse-audit-log" },
          })
        }
      }

      const discrepancy: DiscrepancyRecord = {
        id: `audit-${eventId || shipment.id}`,
        awb: shipment.awbNumber,
        hub: shipment.origin || "Hub Floor",
        expectedLocation: "Manifest Assigned",
        scannedLocation: "Floor Scan",
        discrepancyType: "unmanifested",
        status: "pending",
        timestamp: "Just now",
      }

      return {
        success: true,
        isDiscrepancy: true,
        discrepancy,
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
  if (!awbs.length) {
    return {
      success: false,
      error: "No consignments specified for reconciliation.",
    }
  }

  try {
    return await db.transaction(async (tx) => {
      // 1. Pre-validate all AWBs in the batch first.
      // If any AWB lacks an active discrepancy, return failure before executing any writes.
      const validatedShipments = new Map<
        string,
        typeof shipments.$inferSelect | null
      >()

      for (const awb of awbs) {
        const lastTracked = await tx.query.trackingEvents.findFirst({
          where: and(
            eq(trackingEvents.awbNumber, awb),
            inArray(trackingEvents.eventType, [
              "warehouse_audit_discrepancy",
              "warehouse_audit_reconciled",
            ])
          ),
          orderBy: (events, { desc }) => [desc(events.createdAt)],
        })

        const hasTrackedPending =
          lastTracked?.eventType === "warehouse_audit_discrepancy"

        let hasUnregisteredPending = false
        try {
          const unregLogs = await tx.execute<{ action: string }>(sql`
            select action
            from public.audit_log
            where entity_id = ${awb}
              and action in ('warehouse_audit_discrepancy_unregistered', 'warehouse_audit_reconciled_unregistered')
            order by created_at desc
            limit 1
          `)
          if (
            unregLogs.length > 0 &&
            unregLogs[0].action === "warehouse_audit_discrepancy_unregistered"
          ) {
            hasUnregisteredPending = true
          }
        } catch {
          // Fall through
        }

        if (!hasTrackedPending && !hasUnregisteredPending) {
          return {
            success: false,
            error: `Consignment ${awb} has no active warehouse discrepancy to reconcile.`,
          }
        }

        const shipment = await tx.query.shipments.findFirst({
          where: and(isNull(shipments.deletedAt), eq(shipments.awbNumber, awb)),
        })
        validatedShipments.set(awb, shipment || null)
      }

      // 2. Perform all writes atomically for the pre-validated batch
      for (const awb of awbs) {
        const shipment = validatedShipments.get(awb)

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
            resourceId: shipment.awbNumber,
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
            resourceId: awb,
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
