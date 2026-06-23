"use server"

import { db } from "@/lib/db"
import {
  shipments,
  trackingEvents,
  type shipmentStatusEnum,
} from "@/lib/db/schema"
import { desc, eq, like, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { actionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import {
  createShipmentSchema,
  createTrackingEventSchema,
  updateShipmentSchema,
  deleteShipmentSchema,
} from "./schemas"
import { z } from "zod"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

/**
 * Server action to create a new shipment record.
 *
 * Validates the shipment details, allocates a daily sequential AWB number,
 * and sets the initial status to 'pending'. Handles database insertion and error capturing.
 */
export const createShipmentAction = actionClient
  .schema(createShipmentSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) {
      return {
        success: false,
        error: authResult.response.error,
        shipment: undefined,
      }
    }

    try {
      const newShipment = await db.transaction(async (tx) => {
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
          .orderBy(desc(shipments.awbNumber))
          .limit(1)

        const previousSequence = latest
          ? Number.parseInt(latest.awbNumber.slice(prefix.length), 10)
          : 0
        const awbNumber = `${prefix}${String(previousSequence + 1).padStart(4, "0")}`

        const [shipment] = await tx
          .insert(shipments)
          .values({
            ...parsedInput,
            awbNumber,
            status: "pending",
          })
          .returning()

        // Automatically log the initial creation tracking event
        await tx.insert(trackingEvents).values({
          shipmentId: shipment.id,
          status: "pending",
          location: parsedInput.origin,
          description: `Shipment booked and picked up from ${parsedInput.consignorName || "sender"}.`,
        })

        return shipment
      })

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "create",
        entity: "shipments",
        entityId: newShipment.id,
        after: newShipment,
      })

      revalidatePath("/dashboard/shipments")
      return { success: true, shipment: newShipment, error: undefined }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error("Failed to create shipment. Please try again.")
    }
  })

export const createTrackingEventAction = actionClient
  .schema(createTrackingEventSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    const { shipmentId, status, location, description } = parsedInput

    try {
      const previousStatus = await db.transaction(async (tx) => {
        const [currentShipment] = await tx
          .select({ status: shipments.status })
          .from(shipments)
          .where(eq(shipments.id, shipmentId))
          .limit(1)

        if (!currentShipment) throw new Error("Shipment not found")

        // Removed state machine validation to allow manual override of status

        // 1. Insert the tracking event
        await tx.insert(trackingEvents).values({
          shipmentId,
          status,
          location,
          description,
        })

        // 2. Update the main shipment status
        await tx
          .update(shipments)
          .set({ status })
          .where(eq(shipments.id, shipmentId))

        return currentShipment.status
      })

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "status_transition",
        entity: "shipments",
        entityId: shipmentId,
        before: { status: previousStatus },
        after: { status, location, description },
      })

      revalidatePath("/dashboard/shipments")
      revalidatePath("/dashboard/tracking")
      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error(error.message || "Failed to log tracking event")
    }
  })

export const updateShipmentAction = actionClient
  .schema(updateShipmentSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const { id, ...updateData } = parsedInput
      const before = await db.query.shipments.findFirst({
        where: eq(shipments.id, id),
      })
      if (!before) throw new Error("Shipment not found")
      await db.update(shipments).set(updateData).where(eq(shipments.id, id))

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "update",
        entity: "shipments",
        entityId: id,
        before,
        after: updateData,
      })

      revalidatePath("/dashboard/shipments")
      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error("Failed to update shipment.")
    }
  })

export const deleteShipmentAction = actionClient
  .schema(deleteShipmentSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const before = await db.query.shipments.findFirst({
        where: eq(shipments.id, parsedInput.id),
      })
      if (!before) throw new Error("Shipment not found")

      // Soft delete
      await db
        .update(shipments)
        .set({ deletedAt: new Date() })
        .where(eq(shipments.id, parsedInput.id))

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "delete",
        entity: "shipments",
        entityId: parsedInput.id,
        before,
        after: { deletedAt: new Date().toISOString() },
      })

      revalidatePath("/dashboard/shipments")
      return { success: true }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error("Failed to delete shipment.")
    }
  })
