"use server"

import { db } from "@/lib/db"
import {
  shipments,
  users,
  trackingEvents,
  manifestItems,
} from "@/lib/db/schema"
import { and, desc, eq, isNull, like, sql } from "drizzle-orm"
import { chargedWeight } from "@/lib/shipment-weight"
import { revalidatePath } from "next/cache"
import { authActionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import { capturePostHogEvent } from "@/lib/posthog-server"
import {
  createShipmentSchema,
  createTrackingEventSchema,
  updateShipmentSchema,
  deleteShipmentSchema,
} from "./schemas"
import { logAuditInTransaction } from "@/lib/audit"

/**
 * Server action to create a new shipment record.
 *
 * Validates the shipment details, allocates a daily sequential AWB number,
 * and sets the initial status to 'pending'. Handles database insertion and error capturing.
 */
export const createShipmentAction = authActionClient
  .schema(createShipmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const newShipment = await db.transaction(async (tx) => {
        const customer = await tx.query.users.findFirst({
          where: and(
            eq(users.id, parsedInput.customerId),
            eq(users.role, "customer"),
            isNull(users.deletedAt)
          ),
        })
        if (!customer) throw new Error("Select an available customer record")
        const datePart = new Date()
          .toISOString()
          .slice(0, 10)
          .replaceAll("-", "")
        const prefix = `TAC-${datePart}-`

        await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${prefix}))`)
        const [latest] = await tx
          .select({ awbNumber: shipments.awbNumber })
          .from(shipments)
          .where(like(shipments.awbNumber, `${prefix}%`))
          .orderBy(
            desc(sql`length(${shipments.awbNumber})`),
            desc(shipments.awbNumber)
          )
          .limit(1)

        const previousSequence = latest
          ? Number.parseInt(latest.awbNumber.slice(prefix.length), 10)
          : 0
        const awbNumber = `${prefix}${String(previousSequence + 1).padStart(4, "0")}`

        const [shipment] = await tx
          .insert(shipments)
          .values({
            ...parsedInput,
            chargedWeightKg: chargedWeight(parsedInput),
            awbNumber,
            status: "pending",
          })
          .returning()

        // Automatically log the initial creation tracking event
        await tx.insert(trackingEvents).values({
          shipmentId: shipment.id,
          status: "pending",
          location: parsedInput.origin,
          description:
            "Shipment booked. Handover and movement will be recorded separately.",
          loggedBy: ctx.session.user.id,
          isPublic: true,
        })

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "create",
          entity: "shipments",
          entityId: shipment.id,
          after: shipment,
        })
        return shipment
      })

      revalidatePath("/dashboard/shipments")
      return { success: true, shipment: newShipment, error: undefined }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error("Failed to create shipment. Please try again.")
    }
  })

export const createTrackingEventAction = authActionClient
  .schema(createTrackingEventSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      shipmentId,
      status,
      location,
      description,
      isPublic = false,
    } = parsedInput

    try {
      await db.transaction(async (tx) => {
        const [currentShipment] = await tx
          .select({ status: shipments.status, awbNumber: shipments.awbNumber })
          .from(shipments)
          .where(and(eq(shipments.id, shipmentId), isNull(shipments.deletedAt)))
          .limit(1)
          .for("update")

        if (!currentShipment) throw new Error("Shipment not found")

        // Removed state machine validation to allow manual override of status

        // 1. Insert the tracking event
        await tx.insert(trackingEvents).values({
          shipmentId,
          awbNumber: currentShipment.awbNumber,
          loggedBy: ctx.session.user.id,
          isPublic,
          status,
          location,
          description,
        })

        // 2. Update the main shipment status
        await tx
          .update(shipments)
          .set({ status })
          .where(eq(shipments.id, shipmentId))

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "status_transition",
          entity: "shipments",
          entityId: shipmentId,
          before: { status: currentShipment.status },
          after: { status, location, description, isPublic },
        })

        await capturePostHogEvent("shipment_status_updated", ctx.session.user.id, {
          shipment_id: shipmentId,
          awb_number: currentShipment.awbNumber,
          old_status: currentShipment.status,
          new_status: status,
          is_public: isPublic,
          location,
        })
      })

      revalidatePath("/dashboard/shipments")
      revalidatePath("/dashboard/tracking")
      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error(error.message || "Failed to log tracking event")
    }
  })

export const updateShipmentAction = authActionClient
  .schema(updateShipmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const { id, ...updateData } = parsedInput
      await db.transaction(async (tx) => {
        const [before] = await tx
          .select()
          .from(shipments)
          .where(eq(shipments.id, id))
          .for("update")
        if (!before || before.deletedAt) throw new Error("Shipment not found")
        // Optional fields omitted by the client keep their current locked values.
        const supplied = Object.fromEntries(
          Object.entries(updateData).filter(([, value]) => value !== undefined)
        ) as typeof updateData
        const updatedCargo = { ...before, ...supplied }
        const [updated] = await tx
          .update(shipments)
          .set({ ...supplied, chargedWeightKg: chargedWeight(updatedCargo) })
          .where(eq(shipments.id, id))
          .returning()

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "update",
          entity: "shipments",
          entityId: id,
          before,
          after: updated,
        })
      })

      revalidatePath("/dashboard/shipments")
      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error("Failed to update shipment.")
    }
  })

export const deleteShipmentAction = authActionClient
  .schema(deleteShipmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await db.transaction(async (tx) => {
        // Allocation also locks the shipment before adding manifest_items.
        const [before] = await tx
          .select()
          .from(shipments)
          .where(eq(shipments.id, parsedInput.id))
          .for("update")
        if (!before || before.deletedAt) throw new Error("Shipment not found")
        if (before.status !== "pending")
          throw new Error("Only unassigned pending shipments can be removed")
        const assignment = await tx.query.manifestItems.findFirst({
          where: eq(manifestItems.shipmentId, before.id),
        })
        if (assignment)
          throw new Error(
            "Remove the draft load before removing this shipment; recorded movement must be preserved"
          )

        // Soft delete
        const deletedAt = new Date()
        await tx
          .update(shipments)
          .set({ deletedAt })
          .where(eq(shipments.id, parsedInput.id))

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "delete",
          entity: "shipments",
          entityId: parsedInput.id,
          before,
          after: { deletedAt: deletedAt.toISOString() },
        })
      })

      revalidatePath("/dashboard/shipments")
      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error("Failed to delete shipment.")
    }
  })
