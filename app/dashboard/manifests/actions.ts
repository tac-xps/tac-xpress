"use server"

import { db } from "@/lib/db"
import {
  drivers,
  hubs,
  manifests,
  manifestItems,
  manifestItemHandoffs,
  shipments,
  trackingEvents,
  vehicles,
} from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { authActionClient } from "@/lib/safe-action"
import {
  createManifestSchema,
  recordManifestHandoffSchema,
  scanShipmentSchema,
  updateManifestSchema,
  deleteManifestSchema,
} from "./schemas"
import { and, desc, eq, inArray, isNull, like, sql } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"
import { messageDriverAction } from "@/app/dashboard/dispatch/whatsapp-actions"
import {
  assertLoadCapacity,
  assertManifestRoute,
} from "@/lib/shipments/load-rules"
import { recordManifestItemHandoff } from "@/lib/shipments/record-handoff"
import { canAllocateShipmentToLeg } from "@/lib/shipments/manifest-leg-rules"

export const createManifestAction = authActionClient
  .schema(createManifestSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      shipmentIds,
      originHubId,
      destinationHubId,
      vehicleId,
      driverId,
      sendWhatsAppNotification,
      requestId,
    } = parsedInput
    const createdBy = ctx.session.user.id

    const started = performance.now()
    try {
      const createdManifest = await db.transaction(async (tx) => {
        if (requestId) {
          await tx.execute(sql`select pg_advisory_xact_lock(hashtext('manifest-create'), hashtext(${requestId}))`)
          const previous = await tx.query.manifests.findFirst({
            where: eq(manifests.id, requestId),
            with: { items: { columns: { shipmentId: true } } },
          })
          if (previous) {
            const priorShipments = new Set(previous.items.map((item) => item.shipmentId))
            if (
              previous.createdBy !== createdBy ||
              previous.legType !== "line_haul" ||
              previous.originHubId !== originHubId ||
              previous.destinationHubId !== destinationHubId ||
              previous.vehicleId !== vehicleId ||
              previous.driverId !== driverId ||
              priorShipments.size !== shipmentIds.length ||
              shipmentIds.some((id) => !priorShipments.has(id))
            ) throw new Error("This submission no longer matches its manifest")
            return { id: previous.id, referenceId: previous.referenceId, replay: true }
          }
        }
        await tx
          .select({ id: vehicles.id })
          .from(vehicles)
          .where(eq(vehicles.id, vehicleId))
          .for("update")
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
          .select({
            id: shipments.id,
            status: shipments.status,
            origin: shipments.origin,
            destination: shipments.destination,
            weightKg: shipments.weightKg,
          })
          .from(shipments)
          .where(
            and(
              inArray(shipments.id, shipmentIds),
              inArray(shipments.status, ["pending", "in-transit"]),
              isNull(shipments.deletedAt)
            )
          )
          .orderBy(shipments.id)
          .for("update")

        if (eligibleShipments.length !== shipmentIds.length) {
          throw new Error("One or more shipments are no longer available")
        }

        assertManifestRoute(eligibleShipments, originHub, destinationHub)
        assertLoadCapacity(eligibleShipments, vehicle.capacityKg)

        const existingAssignments = await tx
          .select({ shipmentId: manifestItems.shipmentId })
          .from(manifestItems)
          .where(
            and(
              inArray(manifestItems.shipmentId, shipmentIds),
              eq(manifestItems.isActive, true)
            )
          )
          .limit(1)

        if (existingAssignments.length > 0) {
          throw new Error("One or more shipments already have an active load")
        }

        const receivedRows = await tx
          .select({ shipmentId: manifestItems.shipmentId })
          .from(manifestItemHandoffs)
          .innerJoin(
            manifestItems,
            eq(manifestItemHandoffs.manifestItemId, manifestItems.id)
          )
          .where(
            and(
              inArray(manifestItems.shipmentId, shipmentIds),
              eq(manifestItemHandoffs.outcome, "received")
            )
          )
        const receivedShipmentIds = new Set(
          receivedRows.map((row) => row.shipmentId)
        )
        if (
          eligibleShipments.some(
            (shipment) =>
              !canAllocateShipmentToLeg({
                legType: "line_haul",
                status: shipment.status,
                hasPriorReceipt: receivedShipmentIds.has(shipment.id),
                hasActiveAssignment: false,
              })
          )
        ) {
          throw new Error(
            "In-transit cargo needs a recorded handover before entering another load"
          )
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
            id: requestId,
            referenceId,
            createdBy,
            originHubId,
            destinationHubId,
            vehicleId,
            driverId,
            status: "draft",
            legType: "line_haul",
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
        return { id: newManifest.id, referenceId, replay: false }
      })

      let whatsAppDispatched = false
      const committed = performance.now()
      if (!createdManifest.replay && sendWhatsAppNotification && driverId) {
        const assignedDriver = await db.query.drivers.findFirst({
          where: eq(drivers.id, driverId),
        })

        if (assignedDriver?.phone) {
          try {
            const sendPromise = messageDriverAction(
              createdManifest.id,
              driverId
            )
            const timeoutPromise = new Promise<{
              success: boolean
              error?: string
            }>((_, reject) =>
              setTimeout(() => reject(new Error("Relay timeout")), 3000)
            )
            const sendResult = await Promise.race([sendPromise, timeoutPromise])
            whatsAppDispatched = sendResult.success === true
          } catch (msgErr) {
            Sentry.captureException(msgErr, {
              tags: { area: "manifest_create_whatsapp_notify" },
            })
            whatsAppDispatched = false
          }
        }
      }

      if (!requestId) revalidatePath("/dashboard/manifests")
      logManifestTiming(requestId, "create", started, committed, ctx.authorizationMs)
      return {
        success: true,
        manifest: { id: createdManifest.id, referenceId: createdManifest.referenceId },
        whatsAppDispatched,
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
        if (
          !manifest ||
          manifest.status !== "draft" ||
          manifest.legType !== "line_haul"
        )
          throw new Error("Only a draft manifest can accept shipments")
        if (
          !manifest.vehicleId ||
          !manifest.originHubId ||
          !manifest.destinationHubId
        )
          throw new Error(
            "Complete the manifest assignments before adding cargo"
          )
        const [vehicle] = await tx
          .select()
          .from(vehicles)
          .where(eq(vehicles.id, manifest.vehicleId))
          .for("update")
        const [origin, destination] = await Promise.all([
          tx.query.hubs.findFirst({ where: eq(hubs.id, manifest.originHubId) }),
          tx.query.hubs.findFirst({
            where: eq(hubs.id, manifest.destinationHubId),
          }),
        ])
        if (!vehicle || !origin || !destination)
          throw new Error("Manifest assignments are unavailable")
        const [record] = await tx
          .select()
          .from(shipments)
          .where(
            and(eq(shipments.awbNumber, awbNumber), isNull(shipments.deletedAt))
          )
          .for("update")
        if (!record || !["pending", "in-transit"].includes(record.status))
          throw new Error("Select an eligible shipment")
        const existing = await tx.query.manifestItems.findFirst({
          where: and(
            eq(manifestItems.shipmentId, record.id),
            eq(manifestItems.isActive, true)
          ),
        })
        if (existing) throw new Error("Shipment already has an active load")
        const [receipt] = await tx
          .select({ id: manifestItemHandoffs.id })
          .from(manifestItemHandoffs)
          .innerJoin(
            manifestItems,
            eq(manifestItemHandoffs.manifestItemId, manifestItems.id)
          )
          .where(
            and(
              eq(manifestItems.shipmentId, record.id),
              eq(manifestItemHandoffs.outcome, "received")
            )
          )
          .limit(1)
        if (
          !canAllocateShipmentToLeg({
            legType: manifest.legType,
            status: record.status,
            hasPriorReceipt: Boolean(receipt),
            hasActiveAssignment: false,
          })
        ) {
          throw new Error(
            "In-transit cargo needs a recorded handover before entering another load"
          )
        }
        const assigned = await tx
          .select({
            origin: shipments.origin,
            destination: shipments.destination,
            weightKg: shipments.weightKg,
          })
          .from(shipments)
          .innerJoin(manifestItems, eq(manifestItems.shipmentId, shipments.id))
          .where(
            and(
              eq(manifestItems.manifestId, manifestId),
              eq(manifestItems.isActive, true)
            )
          )
          .orderBy(shipments.id)
          .for("update")
        assertManifestRoute([...assigned, record], origin, destination)
        assertLoadCapacity([...assigned, record], vehicle.capacityKg)
        const [{ total }] = await tx
          .select({ total: sql<number>`count(*)::integer` })
          .from(manifestItems)
          .where(eq(manifestItems.manifestId, manifestId))
        if (total >= 500)
          throw new Error("A manifest can contain up to 500 shipments")
        await tx
          .insert(manifestItems)
          .values({ manifestId, shipmentId: record.id, isActive: true })
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
    const started = performance.now()
    const { id, requestId, ...updateData } = parsedInput
    const departureOnly = updateData.status === "finalized" && Object.keys(updateData).length === 1
    try {
      const { manifest, activeItemIds } = await db.transaction(async (tx) => {
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
        if (current.legType !== "line_haul") {
          throw new Error(
            "Use the dispatch workflow for pickup and delivery legs"
          )
        }
        if (current.status === "finalized") {
          if (!departureOnly) throw new Error("A finalized manifest cannot be changed")
          return {
            manifest: current,
            activeItemIds: current.items
              .filter((item) => item.isActive && item.shipment?.status === "in-transit")
              .map((item) => item.id),
          }
        }
        const assignments = { ...current, ...updateData }
        if (assignments.vehicleId)
          await tx
            .select({ id: vehicles.id })
            .from(vehicles)
            .where(eq(vehicles.id, assignments.vehicleId))
            .for("update")
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

        const activeItems = current.items.filter((item) => item.isActive)
        const cargoIds = activeItems.map((item) => item.shipmentId)
        const loadCargo = cargoIds.length
          ? await tx
              .select({
                id: shipments.id,
                status: shipments.status,
                deletedAt: shipments.deletedAt,
                origin: shipments.origin,
                destination: shipments.destination,
                weightKg: shipments.weightKg,
              })
              .from(shipments)
              .where(inArray(shipments.id, cargoIds))
              .orderBy(shipments.id)
              .for("update")
          : []
        assertManifestRoute(loadCargo, origin, destination)
        assertLoadCapacity(loadCargo, vehicle.capacityKg)
        if (updateData.status === "finalized") {
          if (
            !assignments.originHubId ||
            !assignments.destinationHubId ||
            !assignments.vehicleId ||
            !assignments.driverId
          ) {
            throw new Error("Complete all assignments before finalizing")
          }
          if (activeItems.length === 0) {
            throw new Error("A manifest must contain at least one shipment")
          }

          const shipmentIds = cargoIds
          const lockedShipments = loadCargo
          if (
            lockedShipments.length !== shipmentIds.length ||
            lockedShipments.some((item) => item.deletedAt)
          ) {
            throw new Error("All manifest shipments must be available")
          }

          const receivedRows = await tx
            .select({ shipmentId: manifestItems.shipmentId })
            .from(manifestItemHandoffs)
            .innerJoin(
              manifestItems,
              eq(manifestItemHandoffs.manifestItemId, manifestItems.id)
            )
            .where(
              and(
                inArray(manifestItems.shipmentId, shipmentIds),
                eq(manifestItemHandoffs.outcome, "received")
              )
            )
          const receivedShipmentIds = new Set(
            receivedRows.map((row) => row.shipmentId)
          )
          if (
            lockedShipments.some(
              (shipment) =>
                !canAllocateShipmentToLeg({
                  legType: "line_haul",
                  status: shipment.status,
                  hasPriorReceipt: receivedShipmentIds.has(shipment.id),
                  hasActiveAssignment: false,
                })
            )
          ) {
            throw new Error(
              "In-transit cargo needs a recorded prior handover before departure"
            )
          }

          const pendingIds = lockedShipments
            .filter((shipment) => shipment.status === "pending")
            .map((shipment) => shipment.id)
          if (pendingIds.length > 0) {
            await tx
              .update(shipments)
              .set({ status: "in-transit" })
              .where(inArray(shipments.id, pendingIds))
          }
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
        return {
          manifest: updated,
          activeItemIds: departureOnly ? activeItems.map((item) => item.id) : [],
        }
      })

      const committed = performance.now()
      if (!departureOnly || !requestId) revalidatePath("/dashboard/manifests")
      logManifestTiming(requestId, "update", started, committed, ctx.authorizationMs)
      return { success: true, manifest, activeItemIds, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to update manifest",
      }
    }
  })

function logManifestTiming(
  requestId: string | undefined,
  operation: "create" | "update",
  started: number,
  committed: number,
  authorizationMs: number
) {
  if (process.env.MANIFEST_TIMING !== "true" || !requestId) return
  console.info(JSON.stringify({
    event: "manifest-server",
    requestId,
    operation,
    authorizationMs: Math.round(authorizationMs),
    transactionMs: Math.round(committed - started),
    afterCommitMs: Math.round(performance.now() - committed),
  }))
}

export const recordManifestItemHandoffAction = authActionClient
  .schema(recordManifestHandoffSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const result = await recordManifestItemHandoff(
        parsedInput,
        ctx.session.user
      )

      revalidatePath("/dashboard/dispatch")
      revalidatePath("/dashboard/manifests")
      revalidatePath("/dashboard/shipments")
      revalidatePath("/dashboard/tracking")
      return { ...result, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to record shipment handover",
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
