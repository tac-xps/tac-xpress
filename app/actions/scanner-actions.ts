"use server"

import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"
import { requireDashboardSession } from "@/lib/auth/guards"
import { logAuditInTransaction } from "@/lib/audit"

const isUUID = (str: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export async function getScannedShipmentDetails(code: string) {
  await requireDashboardSession()

  try {
    code = z.string().trim().min(1).max(64).parse(code)
    // Allow scanning by AWB Number or exact Shipment ID
    const targetShipment = await db.query.shipments.findFirst({
      where: and(
        isNull(shipments.deletedAt),
        isUUID(code) ? eq(shipments.id, code) : eq(shipments.awbNumber, code)
      ),
      with: {
        customer: true,
        invoice: true,
        trackingEvents: {
          limit: 100,
          orderBy: (events, { desc }) => [desc(events.createdAt)],
        },
        manifestItems: {
          with: {
            manifest: {
              with: {
                originHub: true,
                destinationHub: true,
              },
            },
          },
        },
      },
    })

    if (!targetShipment) {
      return { success: false, error: "Shipment not found for this barcode." }
    }

    return { success: true, data: targetShipment }
  } catch (error: any) {
    Sentry.captureException(error)
    console.error("Error fetching scanned shipment:", error)
    return {
      success: false,
      error: "Database error occurred while fetching shipment.",
    }
  }
}

export async function updateScannedShipmentStatus(
  shipmentId: string,
  status: "pending" | "in-transit" | "delivered",
  location: string,
  description: string
) {
  const session = await requireDashboardSession()

  try {
    z.string().uuid().parse(shipmentId)
    z.enum(["pending", "in-transit", "delivered"]).parse(status)
    location = z.string().trim().min(2).max(160).parse(location)
    description = z.string().trim().min(2).max(1000).parse(description)
    await db.transaction(async (tx) => {
      const [currentShipment] = await tx
        .select({ status: shipments.status })
        .from(shipments)
        .where(and(eq(shipments.id, shipmentId), isNull(shipments.deletedAt)))
        .limit(1)
        .for("update")

      if (!currentShipment) throw new Error("Shipment not found")

      const validNextStatus = {
        pending: "in-transit",
        "in-transit": "delivered",
        delivered: null,
      } as const

      if (validNextStatus[currentShipment.status] !== status) {
        throw new Error(
          `Invalid shipment transition: ${currentShipment.status} to ${status}`
        )
      }

      await tx
        .update(shipments)
        .set({ status })
        .where(eq(shipments.id, shipmentId))

      await tx.insert(trackingEvents).values({
        shipmentId,
        status,
        location,
        description,
        loggedBy: session.user.id,
        isPublic: false,
      })

      await logAuditInTransaction(tx, {
        userId: session.user.id,
        userEmail: session.user.email || "unknown",
        action: "scanner_status_transition",
        entity: "shipments",
        entityId: shipmentId,
        before: { status: currentShipment.status },
        after: { status, location, description },
      })
    })

    return { success: true }
  } catch (error: unknown) {
    Sentry.captureException(error)
    console.error("Error updating shipment status:", error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update shipment status.",
    }
  }
}
