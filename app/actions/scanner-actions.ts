"use server"

import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"
import { requireDashboardSession } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

const isUUID = (str: string) => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export async function getScannedShipmentDetails(code: string) {
  await requireDashboardSession()

  try {
    // Allow scanning by AWB Number or exact Shipment ID
    const targetShipment = await db.query.shipments.findFirst({
      where: (shipments, { eq }) => {
        if (isUUID(code)) {
          return eq(shipments.id, code)
        }
        return eq(shipments.awbNumber, code)
      },
      with: {
        customer: true,
        invoice: true,
        trackingEvents: {
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
    const previousStatus = await db.transaction(async (tx) => {
      const [currentShipment] = await tx
        .select({ status: shipments.status })
        .from(shipments)
        .where(eq(shipments.id, shipmentId))
        .limit(1)

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
      })

      return currentShipment.status
    })

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "scanner_status_transition",
      entity: "shipments",
      entityId: shipmentId,
      before: { status: previousStatus },
      after: { status, location, description },
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
