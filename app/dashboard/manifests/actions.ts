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
import { authActionClient } from "@/lib/safe-action"
import {
  createManifestSchema,
  scanShipmentSchema,
  updateManifestSchema,
  deleteManifestSchema,
} from "./schemas"
import { and, desc, eq, inArray, isNull, like, sql } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"

export const createManifestAction = authActionClient
  .schema(createManifestSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { shipmentIds, originHubId, destinationHubId, vehicleId, driverId } =
      parsedInput
    const createdBy = ctx.session.user.id

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
            where: and(
              eq(vehicles.id, vehicleId),
              isNull(vehicles.deletedAt),
              eq(vehicles.status, "active")
            ),
          }),
          tx.query.drivers.findFirst({
            where: and(
              eq(drivers.id, driverId),
              isNull(drivers.deletedAt),
              eq(drivers.status, "active")
            ),
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
          .orderBy(shipments.id)
          .for("update")

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
          .orderBy(
            desc(sql`length(${manifests.referenceId})`),
            desc(manifests.referenceId)
          )
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

        await logAuditInTransaction(tx, {
          userId: createdBy,
          userEmail: ctx.session.user.email || "unknown",
          action: "create",
          entity: "manifests",
          entityId: newManifest.id,
          after: { ...parsedInput, referenceId },
        })
        return { id: newManifest.id, referenceId }
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

export const scanShipmentAction = authActionClient
  .schema(scanShipmentSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { manifestId, awbNumber } = parsedInput
    try {
      await db.transaction(async (tx) => {
        const [manifest] = await tx
          .select()
          .from(manifests)
          .where(eq(manifests.id, manifestId))
          .for("update")
        if (!manifest || manifest.status !== "draft")
          throw new Error("Only a draft manifest can accept shipments")
        const [record] = await tx
          .select()
          .from(shipments)
          .where(
            and(eq(shipments.awbNumber, awbNumber), isNull(shipments.deletedAt))
          )
          .for("update")
        if (!record || record.status !== "pending")
          throw new Error("Select a pending shipment")
        const existing = await tx.query.manifestItems.findFirst({
          where: eq(manifestItems.shipmentId, record.id),
        })
        if (existing)
          throw new Error("Shipment is already assigned to a manifest")
        const [{ total }] = await tx
          .select({ total: sql<number>`count(*)::integer` })
          .from(manifestItems)
          .where(eq(manifestItems.manifestId, manifestId))
        if (total >= 500)
          throw new Error("A manifest can contain up to 500 shipments")
        await tx
          .insert(manifestItems)
          .values({ manifestId, shipmentId: record.id })
        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "add_shipment",
          entity: "manifests",
          entityId: manifestId,
          after: { shipmentId: record.id, awbNumber: record.awbNumber },
        })
      })
      revalidatePath("/dashboard/manifests")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to add shipment",
      }
    }
  })
export const updateManifestAction = authActionClient
  .schema(updateManifestSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const { id, ...updateData } = parsedInput
      const manifest = await db.transaction(async (tx) => {
        // Serialize edits, scans, finalization and deletion of this load.
        await tx
          .select({ id: manifests.id })
          .from(manifests)
          .where(eq(manifests.id, id))
          .for("update")
        const current = await tx.query.manifests.findFirst({
          where: eq(manifests.id, id),
          with: { items: { with: { shipment: true } }, originHub: true },
        })

        if (!current) throw new Error("Manifest not found")
        if (
          updateData.referenceId &&
          updateData.referenceId !== current.referenceId
        )
          throw new Error("Manifest references cannot be changed")
        if (current.status === "finalized") {
          throw new Error("A finalized manifest cannot be changed")
        }
        const assignments = { ...current, ...updateData }
        const [origin, destination, vehicle, driver] = await Promise.all([
          assignments.originHubId
            ? tx.query.hubs.findFirst({
                where: and(
                  eq(hubs.id, assignments.originHubId),
                  isNull(hubs.deletedAt)
                ),
              })
            : null,
          assignments.destinationHubId
            ? tx.query.hubs.findFirst({
                where: and(
                  eq(hubs.id, assignments.destinationHubId),
                  isNull(hubs.deletedAt)
                ),
              })
            : null,
          assignments.vehicleId
            ? tx.query.vehicles.findFirst({
                where: and(
                  eq(vehicles.id, assignments.vehicleId),
                  isNull(vehicles.deletedAt),
                  eq(vehicles.status, "active")
                ),
              })
            : null,
          assignments.driverId
            ? tx.query.drivers.findFirst({
                where: and(
                  eq(drivers.id, assignments.driverId),
                  isNull(drivers.deletedAt),
                  eq(drivers.status, "active")
                ),
              })
            : null,
        ])
        if (!origin || !destination || !vehicle || !driver)
          throw new Error(
            "Choose available hubs and an active driver and vehicle"
          )
        if (origin.id === destination.id)
          throw new Error("Origin and destination hubs must be different")

        if (updateData.status === "finalized") {
          if (
            !assignments.originHubId ||
            !assignments.destinationHubId ||
            !assignments.vehicleId ||
            !assignments.driverId
          ) {
            throw new Error("Complete all assignments before finalizing")
          }
          if (current.items.length === 0) {
            throw new Error("A manifest must contain at least one shipment")
          }

          const shipmentIds = current.items.map((item) => item.shipmentId)
          const lockedShipments = await tx
            .select({
              id: shipments.id,
              status: shipments.status,
              deletedAt: shipments.deletedAt,
            })
            .from(shipments)
            .where(inArray(shipments.id, shipmentIds))
            .orderBy(shipments.id)
            .for("update")
          if (
            lockedShipments.length !== shipmentIds.length ||
            lockedShipments.some(
              (item) => item.status !== "pending" || item.deletedAt
            )
          ) {
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
              location: origin.name,
              description: `Manifest ${current.referenceId} finalized for line-haul dispatch.`,
              loggedBy: ctx.session.user.id,
              isPublic: true,
            }))
          )
        }

        const [updated] = await tx
          .update(manifests)
          .set(updateData)
          .where(eq(manifests.id, id))
          .returning()
        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: updateData.status === "finalized" ? "finalize" : "update",
          entity: "manifests",
          entityId: id,
          before: current,
          after: updated,
        })
        return updated
      })

      revalidatePath("/dashboard/manifests")
      return { success: true, manifest, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update manifest",
      }
    }
  })

export const deleteManifestAction = authActionClient
  .schema(deleteManifestSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await db.transaction(async (tx) => {
        const [existing] = await tx
          .delete(manifests)
          .where(
            and(eq(manifests.id, parsedInput.id), eq(manifests.status, "draft"))
          )
          .returning()
        if (!existing)
          throw new Error("Only an existing draft manifest can be deleted")
        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "delete",
          entity: "manifests",
          entityId: parsedInput.id,
          before: existing,
        })
      })

      revalidatePath("/dashboard/manifests")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete manifest" }
    }
  })
