"use server"

import { db } from "@/lib/db"
import { shipments, invoices, trackingEvents } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"

const completeDeliverySchema = z.object({
  shipmentId: z.string().uuid(),
  signatureDataUrl: z.string(),
})
import * as Sentry from "@sentry/nextjs"

export const completeDeliveryAction = actionClient
  .schema(completeDeliverySchema)
  .action(async ({ parsedInput: { shipmentId, signatureDataUrl } }) => {
    try {
      await db.transaction(async (tx) => {
        // 1. Update Shipment
        await tx
          .update(shipments)
          .set({ status: "delivered" })
          .where(eq(shipments.id, shipmentId))

        // 2. Update Invoice with signature (storing data URL directly for demo)
        // In production, upload to Supabase Storage and store URL.
        await tx
          .update(invoices)
          .set({ signatureUrl: signatureDataUrl })
          .where(eq(invoices.shipmentId, shipmentId))

        // 3. Add Tracking Event
        await tx.insert(trackingEvents).values({
          shipmentId,
          status: "delivered",
          location: "Delivery Address", // Could get from driver GPS
          description: "Shipment delivered and signed by consignee.",
        })
      })

      revalidatePath("/driver/delivery")
      revalidatePath(`/driver/delivery/${shipmentId}`)
      revalidatePath("/dashboard/tracking")

      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to complete delivery" }
    }
  })
