"use server"

import { db } from "@/lib/db"
import {
  manifests,
  manifestItems,
  shipments,
  trackingEvents,
  drivers,
  vehicles,
} from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { authActionClient } from "@/lib/safe-action"
import { logAuditInTransaction } from "@/lib/audit"
import { and, eq, inArray, isNull } from "drizzle-orm"
import { capturePostHogEvent } from "@/lib/posthog-server"

import {
  createDispatchRunSchema,
  updateDispatchRunSchema,
  deleteDispatchRunSchema,
} from "./validations"

// ─── Start Dispatch Run ────────────────────────────────────────────────────────
// Transitions manifest: draft → finalized
// Transitions all linked shipments: pending → in-transit

const startDispatchRunSchema = z.object({ id: z.string().uuid() })

export const startDispatchRunAction = authActionClient
  .schema(startDispatchRunSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await db.transaction(async (tx) => {
        await tx
          .select({ id: manifests.id })
          .from(manifests)
          .where(eq(manifests.id, parsedInput.id))
          .for("update")
        const manifest = await tx.query.manifests.findFirst({
          where: eq(manifests.id, parsedInput.id),
          with: { items: { with: { shipment: true } }, originHub: true },
        })
        if (!manifest) throw new Error("Dispatch run not found")
        if (!/^(PU|DL)-/.test(manifest.referenceId))
          throw new Error("Use the manifest workflow for line-haul loads")
        if (manifest.status !== "draft")
          throw new Error("Dispatch run already started")
        if (!manifest.driverId || !manifest.vehicleId) {
          throw new Error("Assign a driver and vehicle before dispatch")
        }
        if (manifest.items.length === 0)
          throw new Error("Dispatch run is empty")
        const shipmentIds = manifest.items.map((item) => item.shipmentId)
        const [driver, vehicle] = await Promise.all([
          tx.query.drivers.findFirst({
            where: and(
              eq(drivers.id, manifest.driverId),
              eq(drivers.status, "active"),
              isNull(drivers.deletedAt)
            ),
          }),
          tx.query.vehicles.findFirst({
            where: and(
              eq(vehicles.id, manifest.vehicleId),
              eq(vehicles.status, "active"),
              isNull(vehicles.deletedAt)
            ),
          }),
        ])
        if (!driver || !vehicle)
          throw new Error("Assign an active driver and vehicle")
        const locked = await tx
          .select()
          .from(shipments)
          .where(inArray(shipments.id, shipmentIds))
          .orderBy(shipments.id)
          .for("update")
        if (
          locked.length !== shipmentIds.length ||
          locked.some(
            (shipment) => shipment.deletedAt || shipment.status !== "pending"
          )
        )
          throw new Error("All run shipments must be available and pending")
        await tx
          .update(manifests)
          .set({ status: "finalized" })
          .where(eq(manifests.id, parsedInput.id))
        await tx
          .update(shipments)
          .set({ status: "in-transit" })
          .where(inArray(shipments.id, shipmentIds))
        await tx.insert(trackingEvents).values(
          shipmentIds.map((shipmentId) => ({
            shipmentId,
            status: "in-transit" as const,
            location: manifest.originHub?.name || "Dispatch origin",
            description: `Dispatch run ${manifest.referenceId} started.`,
            loggedBy: ctx.session.user.id,
            isPublic: true,
          }))
        )
        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "start",
          entity: "dispatch_runs",
          entityId: parsedInput.id,
          before: { status: manifest.status },
          after: { status: "finalized" },
        })

        await capturePostHogEvent("dispatch_run_started", ctx.session.user.id, {
          manifest_id: parsedInput.id,
          reference_id: manifest.referenceId,
          driver_id: manifest.driverId,
          vehicle_id: manifest.vehicleId,
          shipment_count: shipmentIds.length,
        })
      })

      revalidatePath("/dashboard/dispatch")
      revalidatePath("/dashboard/shipments")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to start dispatch run" }
    }
  })

// ─── Complete Dispatch Run ─────────────────────────────────────────────────────
// Keeps manifest as finalized
// Transitions all linked shipments: in-transit → delivered

const completeDispatchRunSchema = z.object({ id: z.string().uuid() })

export const completeDispatchRunAction = authActionClient
  .schema(completeDispatchRunSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await db.transaction(async (tx) => {
        await tx
          .select({ id: manifests.id })
          .from(manifests)
          .where(eq(manifests.id, parsedInput.id))
          .for("update")
        const manifest = await tx.query.manifests.findFirst({
          where: eq(manifests.id, parsedInput.id),
          with: { items: { with: { shipment: true } }, destinationHub: true },
        })
        if (!manifest) throw new Error("Dispatch run not found")
        if (!manifest.referenceId.startsWith("DL-"))
          throw new Error(
            "Only delivery runs can mark shipments delivered; record pickup or hub handover on each shipment"
          )
        if (manifest.status !== "finalized") {
          throw new Error("Start the dispatch run before completing it")
        }
        if (
          manifest.items.some((item) => item.shipment?.status !== "in-transit")
        ) {
          throw new Error("All dispatch shipments must be in transit")
        }

        const ids = manifest.items.map((item) => item.shipmentId)
        if (ids.length === 0) throw new Error("Dispatch run is empty")
        const locked = await tx
          .select()
          .from(shipments)
          .where(inArray(shipments.id, ids))
          .orderBy(shipments.id)
          .for("update")
        if (
          locked.length !== ids.length ||
          locked.some(
            (shipment) => shipment.deletedAt || shipment.status !== "in-transit"
          )
        )
          throw new Error("All run shipments must still be in transit")
        await tx
          .update(shipments)
          .set({ status: "delivered" })
          .where(inArray(shipments.id, ids))
        await tx.insert(trackingEvents).values(
          ids.map((shipmentId) => ({
            shipmentId,
            status: "delivered" as const,
            location: manifest.destinationHub?.name || "Dispatch destination",
            description: `Dispatch run ${manifest.referenceId} completed.`,
            loggedBy: ctx.session.user.id,
            isPublic: true,
          }))
        )
        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "complete",
          entity: "dispatch_runs",
          entityId: parsedInput.id,
          after: { deliveredShipmentIds: ids },
        })

        await capturePostHogEvent("dispatch_run_completed", ctx.session.user.id, {
          manifest_id: parsedInput.id,
          reference_id: manifest.referenceId,
          shipment_count: ids.length,
        })
      })

      revalidatePath("/dashboard/dispatch")
      revalidatePath("/dashboard/shipments")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to complete dispatch run" }
    }
  })

export const createDispatchRunAction = authActionClient
  .schema(createDispatchRunSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session
    const { driverId, vehicleId, runType, shipmentIds } = data

    try {
      const createdBy = session.user.id

      // Prefix RUN- based on type for easy identification
      const prefix = runType === "pickup" ? "PU-" : "DL-"
      const referenceId = `${prefix}${crypto.randomUUID().slice(0, 8).toUpperCase()}`

      await db.transaction(async (tx) => {
        const [driver, vehicle] = await Promise.all([
          tx.query.drivers.findFirst({
            where: and(
              eq(drivers.id, driverId),
              eq(drivers.status, "active"),
              isNull(drivers.deletedAt)
            ),
          }),
          tx.query.vehicles.findFirst({
            where: and(
              eq(vehicles.id, vehicleId),
              eq(vehicles.status, "active"),
              isNull(vehicles.deletedAt)
            ),
          }),
        ])
        if (!driver || !vehicle)
          throw new Error("Choose an active driver and vehicle")
        const eligible = await tx
          .select()
          .from(shipments)
          .where(inArray(shipments.id, shipmentIds))
          .orderBy(shipments.id)
          .for("update")
        if (
          eligible.length !== shipmentIds.length ||
          eligible.some(
            (shipment) => shipment.deletedAt || shipment.status !== "pending"
          )
        )
          throw new Error("Select available pending shipments")
        const assigned = await tx.query.manifestItems.findFirst({
          where: inArray(manifestItems.shipmentId, shipmentIds),
        })
        if (assigned)
          throw new Error("A selected shipment already belongs to a load")
        // 1. Create Manifest (used as Dispatch Run)
        const [newManifest] = await tx
          .insert(manifests)
          .values({
            referenceId,
            createdBy,
            driverId,
            vehicleId,
            status: "draft",
          })
          .returning({ id: manifests.id })

        // 2. Add Shipments to Manifest Items
        const itemsToInsert = shipmentIds.map((shipmentId: string) => ({
          manifestId: newManifest.id,
          shipmentId,
        }))

        await tx.insert(manifestItems).values(itemsToInsert)
        await logAuditInTransaction(tx, {
          userId: session.user.id,
          userEmail: session.user.email || "unknown",
          action: "create",
          entity: "dispatch_runs",
          entityId: newManifest.id,
          after: { ...data, referenceId },
        })
      })

      revalidatePath("/dashboard/dispatch")
      return { success: true, error: undefined }
    } catch (error: any) {
      Sentry.captureException(error)
      return {
        success: false,
        error: error.message || "Failed to create dispatch run",
      }
    }
  })

export const updateDispatchRunAction = authActionClient
  .schema(updateDispatchRunSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const { id, ...updateData } = parsedInput
      if (updateData.status && updateData.status !== "draft")
        return { success: false, error: "Use Start run to finalize dispatch" }
      const manifest = await db.transaction(async (tx) => {
        const [before] = await tx
          .select()
          .from(manifests)
          .where(eq(manifests.id, id))
          .for("update")
        if (!before) throw new Error("Dispatch run not found")
        if (!/^(PU|DL)-/.test(before.referenceId))
          throw new Error("Use the manifest workflow for this load")
        if (before.status === "finalized") {
          throw new Error("A started dispatch run cannot be edited")
        }
        const assignments = { ...before, ...updateData }
        const [driver, vehicle] = await Promise.all([
          assignments.driverId
            ? tx.query.drivers.findFirst({
                where: and(
                  eq(drivers.id, assignments.driverId),
                  eq(drivers.status, "active"),
                  isNull(drivers.deletedAt)
                ),
              })
            : null,
          assignments.vehicleId
            ? tx.query.vehicles.findFirst({
                where: and(
                  eq(vehicles.id, assignments.vehicleId),
                  eq(vehicles.status, "active"),
                  isNull(vehicles.deletedAt)
                ),
              })
            : null,
        ])
        if (!driver || !vehicle)
          throw new Error("Choose an active driver and vehicle")
        const [updated] = await tx
          .update(manifests)
          .set(updateData)
          .where(and(eq(manifests.id, id), eq(manifests.status, "draft")))
          .returning()
        if (!updated)
          throw new Error(
            "The run has already started; assignments were not changed"
          )

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "update",
          entity: "dispatch_runs",
          entityId: id,
          before,
          after: updated,
        })
        return updated
      })

      revalidatePath("/dashboard/dispatch")
      return { success: true, manifest, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update dispatch run" }
    }
  })

export const deleteDispatchRunAction = authActionClient
  .schema(deleteDispatchRunSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await db.transaction(async (tx) => {
        const [before] = await tx
          .select()
          .from(manifests)
          .where(eq(manifests.id, parsedInput.id))
          .for("update")
        if (!before) throw new Error("Dispatch run not found")
        if (!/^(PU|DL)-/.test(before.referenceId))
          throw new Error("Use the manifest workflow for this load")
        if (before.status === "finalized") {
          throw new Error("A started dispatch run cannot be deleted")
        }
        const removed = await tx
          .delete(manifests)
          .where(
            and(eq(manifests.id, parsedInput.id), eq(manifests.status, "draft"))
          )
          .returning({ id: manifests.id })
        if (!removed.length) throw new Error("The run has already started")

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "delete",
          entity: "dispatch_runs",
          entityId: parsedInput.id,
          before,
        })
      })

      revalidatePath("/dashboard/dispatch")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete dispatch run" }
    }
  })
