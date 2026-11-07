"use server"

import { db } from "@/lib/db"
import { invoices, manifests, manifestItems, shipments } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authActionClient } from "@/lib/safe-action"
import { assertNonemptySignature } from "@/lib/shipments/signature"
import { recordManifestItemHandoff } from "@/lib/shipments/record-handoff"
import * as Sentry from "@sentry/nextjs"

const completeDeliverySchema = z.object({
  shipmentId: z.string().uuid(),
  signatureDataUrl: z
    .string()
    .max(250_000)
    .regex(
      /^data:image\/png;base64,[A-Za-z0-9+/=]+$/,
      "A PNG signature is required"
    ),
})

export const completeDeliveryAction = authActionClient
  .schema(completeDeliverySchema)
  .action(async ({ parsedInput: { shipmentId, signatureDataUrl }, ctx }) => {
    try {
      await assertNonemptySignature(signatureDataUrl)
      const [delivery] = await db
        .select({
          manifestId: manifests.id,
          manifestItemId: manifestItems.id,
          location: shipments.destination,
          receivingParty: shipments.consigneeName,
        })
        .from(manifestItems)
        .innerJoin(manifests, eq(manifests.id, manifestItems.manifestId))
        .innerJoin(shipments, eq(shipments.id, manifestItems.shipmentId))
        .where(
          and(
            eq(shipments.id, shipmentId),
            eq(manifests.legType, "delivery"),
            eq(manifests.status, "finalized")
          )
        )
        .orderBy(desc(manifestItems.createdAt), desc(manifestItems.id))
        .limit(1)
      if (!delivery)
        throw new Error(
          "Start an assigned delivery run before completing delivery"
        )
      const [invoice] = await db
        .select({ id: invoices.id })
        .from(invoices)
        .where(eq(invoices.shipmentId, shipmentId))
        .limit(1)
      if (!invoice)
        throw new Error(
          "Generate an invoice for this shipment before completing delivery"
        )
      const result = await recordManifestItemHandoff(
        {
          manifestId: delivery.manifestId,
          manifestItemId: delivery.manifestItemId,
          outcome: "received",
          location: delivery.location,
          receivingParty: delivery.receivingParty || "Consignee",
          eventKey: crypto.randomUUID(),
          signatureDataUrl,
        },
        ctx.session.user
      )
      revalidatePath("/driver/delivery")
      revalidatePath(`/driver/delivery/${shipmentId}`)
      revalidatePath("/dashboard/dispatch")
      revalidatePath("/dashboard/manifests")
      revalidatePath("/dashboard/shipments")
      revalidatePath("/dashboard/tracking")
      return { ...result, success: true }
    } catch (error: unknown) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to complete delivery",
      }
    }
  })
