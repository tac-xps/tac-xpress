"use server"

import { db } from "@/lib/db"
import {
  manifests,
  manifestItems,
  shipments,
  trackingEvents,
} from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

import { eq, inArray } from "drizzle-orm"

import {
  createDispatchRunSchema,
  updateDispatchRunSchema,
  deleteDispatchRunSchema,
} from "./validations"

// ─── Start Dispatch Run ────────────────────────────────────────────────────────
// Transitions manifest: draft → finalized
// Transitions all linked shipments: pending → in-transit

const startDispatchRunSchema = z.object({ id: z.string().uuid() })

export const startDispatchRunAction = actionClient
  .schema(startDispatchRunSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const transition = await db.transaction(async (tx) => {
        const manifest = await tx.query.manifests.findFirst({
          where: eq(manifests.id, parsedInput.id),
          with: { items: { with: { shipment: true } }, originHub: true },
        })
        if (!manifest) throw new Error("Dispatch run not found")
        if (manifest.status !== "draft")
          throw new Error("Dispatch run already started")
        if (!manifest.driverId || !manifest.vehicleId) {
          throw new Error("Assign a driver and vehicle before dispatch")
        }
        if (manifest.items.length === 0)
          throw new Error("Dispatch run is empty")
        if (
          manifest.items.some((item) => item.shipment?.status !== "pending")
        ) {
          throw new Error("All dispatch shipments must be pending")
        }

        const shipmentIds = manifest.items.map((item) => item.shipmentId)
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
            loggedBy: authResult.session.user.id,
            isPublic: true,
          }))
        )
        return manifest
      })

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "start",
        entity: "dispatch_runs",
        entityId: parsedInput.id,
        before: { status: transition.status },
        after: { status: "finalized" },
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

export const completeDispatchRunAction = actionClient
  .schema(completeDispatchRunSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const shipmentIds = await db.transaction(async (tx) => {
        const manifest = await tx.query.manifests.findFirst({
          where: eq(manifests.id, parsedInput.id),
          with: { items: { with: { shipment: true } }, destinationHub: true },
        })
        if (!manifest) throw new Error("Dispatch run not found")
        if (manifest.status !== "finalized") {
          throw new Error("Start the dispatch run before completing it")
        }
        if (
          manifest.items.some((item) => item.shipment?.status !== "in-transit")
        ) {
          throw new Error("All dispatch shipments must be in transit")
        }

        const ids = manifest.items.map((item) => item.shipmentId)
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
            loggedBy: authResult.session.user.id,
            isPublic: true,
          }))
        )
        return ids
      })

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "complete",
        entity: "dispatch_runs",
        entityId: parsedInput.id,
        after: { deliveredShipmentIds: shipmentIds },
      })

      revalidatePath("/dashboard/dispatch")
      revalidatePath("/dashboard/shipments")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to complete dispatch run" }
    }
  })

export async function createDispatchRunAction(
  data: z.infer<typeof createDispatchRunSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = createDispatchRunSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }
  const { driverId, vehicleId, runType, shipmentIds } = parsed.data

  try {
    const createdBy = authResult.session.user.id

    // Prefix RUN- based on type for easy identification
    const prefix = runType === "pickup" ? "PU-" : "DL-"
    const referenceId = `${prefix}${crypto.randomUUID().slice(0, 8).toUpperCase()}`

    const newManifest = await db.transaction(async (tx) => {
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
      return newManifest
    })

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "create",
      entity: "dispatch_runs",
      entityId: newManifest.id,
      after: { ...parsed.data, referenceId },
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
}

export const updateDispatchRunAction = actionClient
  .schema(updateDispatchRunSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const { id, ...updateData } = parsedInput
      const before = await db.query.manifests.findFirst({
        where: eq(manifests.id, id),
      })
      if (!before) return { success: false, error: "Dispatch run not found" }
      if (before.status === "finalized") {
        return {
          success: false,
          error: "A started dispatch run cannot be edited",
        }
      }
      const [manifest] = await db
        .update(manifests)
        .set(updateData)
        .where(eq(manifests.id, id))
        .returning()

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "update",
        entity: "dispatch_runs",
        entityId: id,
        before,
        after: manifest,
      })

      revalidatePath("/dashboard/dispatch")
      return { success: true, manifest, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update dispatch run" }
    }
  })

export const deleteDispatchRunAction = actionClient
  .schema(deleteDispatchRunSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const before = await db.query.manifests.findFirst({
        where: eq(manifests.id, parsedInput.id),
      })
      if (!before) return { success: false, error: "Dispatch run not found" }
      if (before.status === "finalized") {
        return {
          success: false,
          error: "A started dispatch run cannot be deleted",
        }
      }
      await db.delete(manifests).where(eq(manifests.id, parsedInput.id))

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "delete",
        entity: "dispatch_runs",
        entityId: parsedInput.id,
        before,
      })

      revalidatePath("/dashboard/dispatch")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete dispatch run" }
    }
  })
