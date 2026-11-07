import "server-only"
import { db } from "@/lib/db"
import {
  manifests,
  manifestItems,
  manifestItemHandoffs,
  shipments,
  trackingEvents,
  invoices,
} from "@/lib/db/schema"
import { and, eq } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"
import type { z } from "zod"
import type { recordManifestHandoffSchema } from "@/app/dashboard/manifests/schemas"

type HandoffInput = z.infer<typeof recordManifestHandoffSchema> & {
  signatureDataUrl?: string
}

export async function recordManifestItemHandoff(
  input: HandoffInput,
  actor: { id: string; email?: string | null }
) {
  return db.transaction(async (tx) => {
    const [manifest] = await tx
      .select()
      .from(manifests)
      .where(eq(manifests.id, input.manifestId))
      .for("update")
    if (!manifest || manifest.status !== "finalized") {
      throw new Error("Only a started load can record a handover")
    }

    const [item] = await tx
      .select()
      .from(manifestItems)
      .where(
        and(
          eq(manifestItems.id, input.manifestItemId),
          eq(manifestItems.manifestId, manifest.id)
        )
      )
      .for("update")
    if (!item) throw new Error("Shipment is not part of this load")

    const [shipment] = await tx
      .select()
      .from(shipments)
      .where(eq(shipments.id, item.shipmentId))
      .for("update")
    if (!shipment || shipment.deletedAt) {
      throw new Error("Shipment is not available")
    }

    const [sameEvent] = await tx
      .select()
      .from(manifestItemHandoffs)
      .where(eq(manifestItemHandoffs.eventKey, input.eventKey))
      .limit(1)
    if (sameEvent) {
      if (
        sameEvent.manifestItemId === item.id &&
        sameEvent.outcome === input.outcome
      ) {
        return { success: true, duplicate: true }
      }
      throw new Error("This handover request key was already used")
    }

    if (input.outcome === "received") {
      const [existingReceipt] = await tx
        .select({ id: manifestItemHandoffs.id })
        .from(manifestItemHandoffs)
        .where(
          and(
            eq(manifestItemHandoffs.manifestItemId, item.id),
            eq(manifestItemHandoffs.outcome, "received")
          )
        )
        .limit(1)
      if (existingReceipt) {
        return { success: true, alreadyReceived: true }
      }
      if (!item.isActive || shipment.status !== "in-transit") {
        throw new Error("Only active in-transit cargo can be received")
      }
    } else if (!item.isActive || shipment.status !== "in-transit") {
      throw new Error("Only active in-transit cargo can record an exception")
    }

    const [handoff] = await tx
      .insert(manifestItemHandoffs)
      .values({
        manifestItemId: item.id,
        outcome: input.outcome,
        location: input.location,
        receivingParty: input.receivingParty || null,
        receivedBy: actor.id,
        eventKey: input.eventKey,
        notes: input.notes || null,
      })
      .returning()

    if (input.signatureDataUrl) {
      if (manifest.legType !== "delivery" || input.outcome !== "received") {
        throw new Error("Signatures require a delivery receipt")
      }
      const signed = await tx
        .update(invoices)
        .set({ signatureUrl: input.signatureDataUrl })
        .where(eq(invoices.shipmentId, shipment.id))
        .returning({ id: invoices.id })
      if (!signed.length)
        throw new Error("A delivery signature requires an invoice")
    }

    let delivered = false
    if (input.outcome === "received") {
      const [released] = await tx
        .update(manifestItems)
        .set({ isActive: false })
        .where(
          and(eq(manifestItems.id, item.id), eq(manifestItems.isActive, true))
        )
        .returning({ id: manifestItems.id })
      if (!released) throw new Error("Shipment assignment already changed")

      delivered = manifest.legType === "delivery"
      if (delivered) {
        await tx
          .update(shipments)
          .set({ status: "delivered", updatedAt: new Date() })
          .where(eq(shipments.id, shipment.id))
      }
    }

    await tx.insert(trackingEvents).values({
      shipmentId: shipment.id,
      status: delivered ? "delivered" : "in-transit",
      location: input.location,
      description:
        input.outcome === "exception"
          ? `An operational exception was recorded for ${manifest.referenceId}.`
          : delivered
            ? `Delivery was received for ${manifest.referenceId}.`
            : `Cargo handover was received for ${manifest.referenceId}.`,
      loggedBy: actor.id,
      isPublic: input.outcome === "received",
      notes: input.notes || null,
    })

    await logAuditInTransaction(tx, {
      userId: actor.id,
      userEmail: actor.email || "unknown",
      action:
        input.outcome === "received"
          ? "manifest_item_received"
          : "manifest_item_exception",
      entity: "manifest_item_handoffs",
      entityId: handoff.id,
      before: {
        shipmentStatus: shipment.status,
        assignmentActive: item.isActive,
      },
      after: {
        outcome: handoff.outcome,
        location: handoff.location,
        receivingParty: handoff.receivingParty,
        shipmentStatus: delivered ? "delivered" : shipment.status,
        assignmentActive: input.outcome !== "received",
      },
    })

    return { success: true, delivered }
  })
}
