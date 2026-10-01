import "server-only"

import { db } from "@/lib/db"
import {
  shipments,
  shipmentLegs,
  trackingEvents,
  type ShipmentLeg,
  type NewShipmentLeg,
} from "@/lib/db/schema"
import { eq, asc, and } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"
import * as Sentry from "@sentry/nextjs"

export interface CreateLegInput {
  legNumber: number
  originLocation: string
  destinationLocation: string
  originHubId?: string
  destinationHubId?: string
  vehicleId?: string
  driverId?: string
  manifestId?: string
  notes?: string
}

export interface LegProgress {
  totalLegs: number
  completedLegs: number
  activeLeg: ShipmentLeg | null
  isCompleted: boolean
  progressPercent: number
  legs: ShipmentLeg[]
}

/**
 * Configure legs for a multi-leg route (e.g., Delhi -> Kolkata -> Guwahati).
 */
export async function createShipmentLegs(
  shipmentId: string,
  legs: CreateLegInput[]
): Promise<ShipmentLeg[]> {
  if (!legs.length) return []

  const sortedLegs = [...legs].sort((a, b) => a.legNumber - b.legNumber)
  const rowsToInsert: NewShipmentLeg[] = sortedLegs.map((leg, index) => ({
    shipmentId,
    legNumber: leg.legNumber,
    originLocation: leg.originLocation,
    destinationLocation: leg.destinationLocation,
    originHubId: leg.originHubId,
    destinationHubId: leg.destinationHubId,
    vehicleId: leg.vehicleId,
    driverId: leg.driverId,
    manifestId: leg.manifestId,
    status: index === 0 ? "in_transit" : "pending",
    startedAt: index === 0 ? new Date() : null,
    notes: leg.notes,
  }))

  const created = await db
    .insert(shipmentLegs)
    .values(rowsToInsert)
    .returning()

  return created
}

/**
 * Fetch all legs for a shipment in traversal order.
 */
export async function getShipmentLegs(shipmentId: string): Promise<ShipmentLeg[]> {
  return db
    .select()
    .from(shipmentLegs)
    .where(eq(shipmentLegs.shipmentId, shipmentId))
    .orderBy(asc(shipmentLegs.legNumber))
}

/**
 * Confirm leg completion at a warehouse scan checkpoint and advance shipment state.
 */
export async function completeShipmentLeg(params: {
  legId: string
  location: string
  loggedBy?: string
  notes?: string
}): Promise<{
  success: boolean
  isFinalLeg: boolean
  nextLeg?: ShipmentLeg
  error?: string
}> {
  try {
    return await db.transaction(async (tx) => {
      const [currentLeg] = await tx
        .select()
        .from(shipmentLegs)
        .where(eq(shipmentLegs.id, params.legId))
        .limit(1)
        .for("update")

      if (!currentLeg) {
        throw new Error("Shipment leg not found.")
      }

      if (currentLeg.status === "completed") {
        return { success: true, isFinalLeg: false }
      }

      if (currentLeg.status !== "in_transit") {
        throw new Error(
          `Cannot complete leg ${currentLeg.legNumber}: current status is "${currentLeg.status}", expected "in_transit".`
        )
      }

      const now = new Date()

      // Mark current leg as completed
      await tx
        .update(shipmentLegs)
        .set({
          status: "completed",
          completedAt: now,
          notes: params.notes ?? currentLeg.notes,
          updatedAt: now,
        })
        .where(eq(shipmentLegs.id, params.legId))

      // Get all legs to evaluate progress
      const allLegs = await tx
        .select()
        .from(shipmentLegs)
        .where(eq(shipmentLegs.shipmentId, currentLeg.shipmentId))
        .orderBy(asc(shipmentLegs.legNumber))

      const nextLeg = allLegs.find(
        (l) => l.legNumber > currentLeg.legNumber && l.status === "pending"
      )

      const isFinalLeg = !nextLeg

      if (isFinalLeg) {
        // All legs completed -> mark entire shipment delivered
        await tx
          .update(shipments)
          .set({ status: "delivered", updatedAt: now })
          .where(eq(shipments.id, currentLeg.shipmentId))

        await tx.insert(trackingEvents).values({
          shipmentId: currentLeg.shipmentId,
          status: "delivered",
          location: params.location,
          description: `Consignment delivered at destination hub (${currentLeg.destinationLocation}). Final leg completed.`,
          loggedBy: params.loggedBy,
          isPublic: true,
        })
      } else {
        // Advance to next leg
        await tx
          .update(shipmentLegs)
          .set({
            status: "in_transit",
            startedAt: now,
            updatedAt: now,
          })
          .where(eq(shipmentLegs.id, nextLeg.id))

        await tx
          .update(shipments)
          .set({ status: "in-transit", updatedAt: now })
          .where(eq(shipments.id, currentLeg.shipmentId))

        await tx.insert(trackingEvents).values({
          shipmentId: currentLeg.shipmentId,
          status: "in-transit",
          location: params.location,
          description: `Leg ${currentLeg.legNumber} arrival confirmed at ${currentLeg.destinationLocation}. Cargo transferred to leg ${nextLeg.legNumber} toward ${nextLeg.destinationLocation}.`,
          loggedBy: params.loggedBy,
          isPublic: true,
        })
      }

      await logAuditInTransaction(tx, {
        userId: params.loggedBy,
        userEmail: "system@tac-xpress",
        action: "shipment_leg_completed",
        entity: "shipment_legs",
        entityId: params.legId,
        before: { status: currentLeg.status },
        after: {
          status: "completed",
          completedAt: now.toISOString(),
          isFinalLeg,
          nextLegId: nextLeg?.id ?? null,
        },
      })

      return {
        success: true,
        isFinalLeg,
        nextLeg,
      }
    })
  } catch (error: any) {
    Sentry.captureException(error, {
      tags: { area: "multi_leg_transition" },
      extra: { legId: params.legId },
    })
    return {
      success: false,
      isFinalLeg: false,
      error: error?.message || "Failed to complete shipment leg.",
    }
  }
}

/**
 * Compute progress metrics across all route legs for staff and tracking UIs.
 */
export async function getShipmentLegProgress(
  shipmentId: string
): Promise<LegProgress> {
  const legs = await getShipmentLegs(shipmentId)
  if (!legs.length) {
    return {
      totalLegs: 0,
      completedLegs: 0,
      activeLeg: null,
      isCompleted: false,
      progressPercent: 0,
      legs: [],
    }
  }

  const completedLegs = legs.filter((l) => l.status === "completed").length
  const activeLeg =
    legs.find((l) => l.status === "in_transit") ??
    legs.find((l) => l.status === "pending") ??
    null
  const isCompleted = completedLegs === legs.length
  const progressPercent = Math.round((completedLegs / legs.length) * 100)

  return {
    totalLegs: legs.length,
    completedLegs,
    activeLeg,
    isCompleted,
    progressPercent,
    legs,
  }
}

export interface LegProgressMetrics {
  totalLegs: number
  completedLegs: number
  activeLegNumber: number | null
  isCompleted: boolean
  progressPercent: number
  isFinalLegActive: boolean
}

/**
 * Pure calculation helper to evaluate progress metrics across legs.
 */
export function calculateLegProgress(
  legs: Array<{ status: string; legNumber: number }>
): LegProgressMetrics {
  if (!legs.length) {
    return {
      totalLegs: 0,
      completedLegs: 0,
      activeLegNumber: null,
      isCompleted: false,
      progressPercent: 0,
      isFinalLegActive: false,
    }
  }

  const sorted = [...legs].sort((a, b) => a.legNumber - b.legNumber)
  const completedLegs = sorted.filter((l) => l.status === "completed").length
  const active =
    sorted.find((l) => l.status === "in_transit") ??
    sorted.find((l) => l.status === "pending") ??
    null

  const isCompleted = completedLegs === sorted.length
  const progressPercent = Math.round((completedLegs / sorted.length) * 100)
  const isFinalLegActive =
    active !== null && active.legNumber === sorted[sorted.length - 1].legNumber

  return {
    totalLegs: sorted.length,
    completedLegs,
    activeLegNumber: active?.legNumber ?? null,
    isCompleted,
    progressPercent,
    isFinalLegActive,
  }
}
