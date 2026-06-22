"use server"

import { db } from "@/lib/db"
import {
  drivers,
  hubs,
  manifests,
  manifestItems,
  shipments,
  trackingEvents,
  vehicles,
} from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { actionClient } from "@/lib/safe-action"
import { requireDashboardAction } from "@/lib/auth/guards"
import {
  createManifestSchema,
  scanShipmentSchema,
  updateManifestSchema,
  deleteManifestSchema,
} from "./schemas"
import { z } from "zod"
import { and, desc, eq, inArray, isNull, like, sql } from "drizzle-orm"
import { logAudit } from "@/lib/audit"

export const createManifestAction = actionClient
  .schema(createManifestSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    const { shipmentIds, originHubId, destinationHubId, vehicleId, driverId } =
      parsedInput
    const createdBy = authResult.session.user.id

    try {
      const createdManifest = await db.transaction(async (tx) => {
        const [originHub, destinationHub, vehicle, driver] = await Promise.all([
          tx.query.hubs.findFirst({
            where: and(eq(hubs.id, originHubId), isNull(hubs.deletedAt)),
          }),
          tx.query.hubs.findFirst({
            where: and(eq(hubs.id, destinationHubId), isNull(hubs.deletedAt)),
          }),
          tx.query.vehicles.findFirst({
            where: and(eq(vehicles.id, vehicleId), isNull(vehicles.deletedAt)),
          }),
          tx.query.drivers.findFirst({
            where: and(eq(drivers.id, driverId), isNull(drivers.deletedAt)),
          }),
        ])

        if (!originHub || !destinationHub || !vehicle || !driver) {
          throw new Error(
            "A selected manifest assignment is no longer available"
          )
        }
        if (originHub.id === destinationHub.id) {
          throw new Error("Origin and destination hubs must be different")
        }

        const eligibleShipments = await tx
          .select({ id: shipments.id })
          .from(shipments)
          .where(
            and(
              inArray(shipments.id, shipmentIds),
              eq(shipments.status, "pending"),
              isNull(shipments.deletedAt)
            )
          )

        if (eligibleShipments.length !== shipmentIds.length) {
          throw new Error("One or more shipments are no longer pending")
        }

        const existingAssignments = await tx
          .select({ shipmentId: manifestItems.shipmentId })
          .from(manifestItems)
          .where(inArray(manifestItems.shipmentId, shipmentIds))
          .limit(1)

        if (existingAssignments.length > 0) {
          throw new Error("One or more shipments are already manifested")
        }

        const datePart = new Date()
          .toISOString()
          .slice(0, 10)
          .replaceAll("-", "")
        const prefix = `MAN-${datePart}-`

        await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${prefix}))`)
        const [latest] = await tx
          .select({ referenceId: manifests.referenceId })
          .from(manifests)
          .where(like(manifests.referenceId, `${prefix}%`))
          .orderBy(desc(manifests.referenceId))
          .limit(1)

        const previousSequence = latest
          ? Number.parseInt(latest.referenceId.slice(prefix.length), 10)
          : 0
        const referenceId = `${prefix}${String(previousSequence + 1).padStart(4, "0")}`

        // 1. Create Manifest
        const [newManifest] = await tx
          .insert(manifests)
          .values({
            referenceId,
            createdBy,
            originHubId,
            destinationHubId,
            vehicleId,
            driverId,
            status: "draft",
          })
          .returning({ id: manifests.id })

        // 2. Add Shipments to Manifest Items
        const itemsToInsert = shipmentIds.map((shipmentId: string) => ({
          manifestId: newManifest.id,
          shipmentId,
        }))

        await tx.insert(manifestItems).values(itemsToInsert)

        return { id: newManifest.id, referenceId }
      })

      await logAudit({
        userId: createdBy,
        userEmail: authResult.session.user.email || "unknown",
        action: "create",
        entity: "manifests",
        entityId: createdManifest.id,
        after: { ...parsedInput, referenceId: createdManifest.referenceId },
      })

      revalidatePath("/dashboard/manifests")
      return {
        success: true,
        manifest: createdManifest,
        error: undefined,
      }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to create manifest",
      }
    }
  })

export async function scanShipmentAction(
  data: z.infer<typeof scanShipmentSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = scanShipmentSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: "Invalid form data" }

  const { manifestId, awbNumber } = parsed.data

  try {
    // Find the shipment by AWB
    const shipment = await db.query.shipments.findFirst({
      where: (shipments, { eq }) => eq(shipments.awbNumber, awbNumber),
    })

    if (!shipment) {
      return { success: false, error: "Shipment not found" }
    }
    if (shipment.status !== "pending" || shipment.deletedAt) {
      return {
        success: false,
        error: "Only pending shipments can be manifested",
      }
    }

    // Check if it's already in the manifest
    const existing = await db.query.manifestItems.findFirst({
      where: (manifestItems, { eq }) =>
        eq(manifestItems.shipmentId, shipment.id),
    })

    if (existing) {
      return {
        success: false,
        error: "Shipment is already assigned to a manifest",
      }
    }

    // Add to manifest
    await db.insert(manifestItems).values({
      manifestId,
      shipmentId: shipment.id,
    })
    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "add_shipment",
      entity: "manifests",
      entityId: manifestId,
      after: { shipmentId: shipment.id, awbNumber: shipment.awbNumber },
    })

    revalidatePath("/dashboard/manifests")
    return { success: true, error: undefined }
  } catch (error: unknown) {
    Sentry.captureException(error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add shipment",
    }
  }
}

export const updateManifestAction = actionClient
  .schema(updateManifestSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const { id, ...updateData } = parsedInput
      const manifest = await db.transaction(async (tx) => {
        const current = await tx.query.manifests.findFirst({
          where: eq(manifests.id, id),
          with: { items: { with: { shipment: true } }, originHub: true },
        })

        if (!current) throw new Error("Manifest not found")
        if (current.status === "finalized" && updateData.status === "draft") {
          throw new Error("A finalized manifest cannot return to draft")
        }

        if (
          updateData.status === "finalized" &&
          current.status !== "finalized"
        ) {
          if (
            !current.originHubId ||
            !current.destinationHubId ||
            !current.vehicleId ||
            !current.driverId
          ) {
            throw new Error("Complete all assignments before finalizing")
          }
          if (current.items.length === 0) {
            throw new Error("A manifest must contain at least one shipment")
          }

          const shipmentIds = current.items.map((item) => item.shipmentId)
          const invalidShipment = current.items.some(
            (item) => item.shipment?.status !== "pending"
          )
          if (invalidShipment) {
            throw new Error("All manifest shipments must be pending")
          }

          await tx
            .update(shipments)
            .set({ status: "in-transit" })
            .where(inArray(shipments.id, shipmentIds))
          await tx.insert(trackingEvents).values(
            shipmentIds.map((shipmentId) => ({
              shipmentId,
              status: "in-transit" as const,
              location: current.originHub?.name || "Origin hub",
              description: `Manifest ${current.referenceId} finalized for line-haul dispatch.`,
              loggedBy: authResult.session.user.id,
              isPublic: true,
            }))
          )
        }

        const [updated] = await tx
          .update(manifests)
          .set(updateData)
          .where(eq(manifests.id, id))
          .returning()
        return { before: current, updated }
      })

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: updateData.status === "finalized" ? "finalize" : "update",
        entity: "manifests",
        entityId: id,
        before: manifest.before,
        after: manifest.updated,
      })

      revalidatePath("/dashboard/manifests")
      return { success: true, manifest: manifest.updated, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update manifest",
      }
    }
  })

export const deleteManifestAction = actionClient
  .schema(deleteManifestSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const existing = await db.query.manifests.findFirst({
        where: eq(manifests.id, parsedInput.id),
      })
      if (!existing) return { success: false, error: "Manifest not found" }
      if (existing.status === "finalized") {
        return {
          success: false,
          error: "Finalized manifests cannot be deleted",
        }
      }

      await db.delete(manifests).where(eq(manifests.id, parsedInput.id))
      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "delete",
        entity: "manifests",
        entityId: parsedInput.id,
        before: existing,
      })

      revalidatePath("/dashboard/manifests")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete manifest" }
    }
  })
