"use server"

import { authActionClient } from "@/lib/safe-action"
import { z } from "zod"
import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { and, eq, isNull } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { logAuditInTransaction } from "@/lib/audit"
import * as Sentry from "@sentry/nextjs"

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
