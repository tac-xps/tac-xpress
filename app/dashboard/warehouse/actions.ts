"use server"

import { actionClient } from "@/lib/safe-action"
import { z } from "zod"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { requireDashboardAction } from "@/lib/auth/guards"

const scanShipmentSchema = z.object({
  awbNumber: z.string().min(1, "AWB Number is required"),
})

export const scanShipmentAction = actionClient
  .schema(scanShipmentSchema)
  .action(async ({ parsedInput: { awbNumber } }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) {
      return {
        success: false,
        error: authResult.response.error,
        shipment: undefined,
      }
    }

    // Find the shipment
    const shipment = await db.query.shipments.findFirst({
      where: eq(shipments.awbNumber, awbNumber),
    })

    if (!shipment) {
      return {
        success: false,
        error: `Shipment with AWB ${awbNumber} not found.`,
        shipment: undefined,
      }
    }

    if (shipment.deletedAt) {
      return {
        success: false,
        error: `Shipment ${awbNumber} was deleted.`,
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

    // Determine the new status. If pending, it becomes in-transit. If already in-transit, we just log a tracking event.
    const newStatus =
      shipment.status === "pending" ? "in-transit" : shipment.status

    try {
      await db.transaction(async (tx) => {
        // Update shipment status if it changed
        if (shipment.status !== newStatus) {
          await tx
            .update(shipments)
            .set({ status: newStatus })
            .where(eq(shipments.id, shipment.id))
        }

        // Always add a tracking event for the scan
        await tx.insert(trackingEvents).values({
          shipmentId: shipment.id,
          status: newStatus,
          location: "Warehouse Hub",
          description: `Shipment scanned and processed at hub.`,
        })
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
    } catch (error) {
      console.error("Failed to process scan:", error)
      return {
        success: false,
        error: "Database error while processing scan.",
        shipment: undefined,
      }
    }
  })
