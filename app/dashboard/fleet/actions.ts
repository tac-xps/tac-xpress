"use server"

import { db } from "@/lib/db"
import { drivers, vehicles } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

import {
  addVehicleSchema,
  addDriverSchema,
  updateDriverSchema,
  deleteDriverSchema,
  updateVehicleSchema,
  deleteVehicleSchema,
} from "./validations"

// --- Vehicles ---
export async function createVehicleAction(
  data: z.infer<typeof addVehicleSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = addVehicleSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const existing = await db.query.vehicles.findFirst({
      where: eq(vehicles.registrationNumber, parsed.data.registrationNumber),
    })
    if (existing) {
      return { success: false, error: "Registration number already exists" }
    }
    const [vehicle] = await db.insert(vehicles).values(parsed.data).returning()

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "create",
      entity: "vehicles",
      entityId: vehicle.id,
      after: vehicle,
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, vehicle, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to create vehicle" }
  }
}

export async function updateVehicleAction(
  data: z.infer<typeof updateVehicleSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = updateVehicleSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const { id, ...updateData } = parsed.data
    const before = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, id),
    })
    if (!before) return { success: false, error: "Vehicle not found" }
    const duplicate = await db.query.vehicles.findFirst({
      where: and(
        eq(vehicles.registrationNumber, updateData.registrationNumber),
        ne(vehicles.id, id)
      ),
    })
    if (duplicate) {
      return { success: false, error: "Registration number already exists" }
    }
    const [vehicle] = await db
      .update(vehicles)
      .set(updateData)
      .where(eq(vehicles.id, id))
      .returning()

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "update",
      entity: "vehicles",
      entityId: id,
      before,
      after: vehicle,
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, vehicle, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to update vehicle" }
  }
}

export async function deleteVehicleAction(
  data: z.infer<typeof deleteVehicleSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = deleteVehicleSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const before = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, parsed.data.id),
    })
    if (!before) return { success: false, error: "Vehicle not found" }
    await db
      .update(vehicles)
      .set({ deletedAt: new Date() })
      .where(eq(vehicles.id, parsed.data.id))

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "delete",
      entity: "vehicles",
      entityId: parsed.data.id,
      before,
      after: { deletedAt: new Date().toISOString() },
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to delete vehicle" }
  }
}

// --- Drivers ---
export async function createDriverAction(
  data: z.infer<typeof addDriverSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = addDriverSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const existing = await db.query.drivers.findFirst({
      where: eq(drivers.licenseNumber, parsed.data.licenseNumber),
    })
    if (existing) {
      return { success: false, error: "License number already exists" }
    }
    const [driver] = await db.insert(drivers).values(parsed.data).returning()

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "create",
      entity: "drivers",
      entityId: driver.id,
      after: driver,
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, driver, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to create driver" }
  }
}

export async function updateDriverAction(
  data: z.infer<typeof updateDriverSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = updateDriverSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const { id, ...updateData } = parsed.data
    const before = await db.query.drivers.findFirst({
      where: eq(drivers.id, id),
    })
    if (!before) return { success: false, error: "Driver not found" }
    const duplicate = await db.query.drivers.findFirst({
      where: and(
        eq(drivers.licenseNumber, updateData.licenseNumber),
        ne(drivers.id, id)
      ),
    })
    if (duplicate) {
      return { success: false, error: "License number already exists" }
    }
    const [driver] = await db
      .update(drivers)
      .set(updateData)
      .where(eq(drivers.id, id))
      .returning()

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "update",
      entity: "drivers",
      entityId: id,
      before,
      after: driver,
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, driver, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to update driver" }
  }
}

export async function deleteDriverAction(
  data: z.infer<typeof deleteDriverSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = deleteDriverSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }

  try {
    const before = await db.query.drivers.findFirst({
      where: eq(drivers.id, parsed.data.id),
    })
    if (!before) return { success: false, error: "Driver not found" }
    await db
      .update(drivers)
      .set({ deletedAt: new Date() })
      .where(eq(drivers.id, parsed.data.id))

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "delete",
      entity: "drivers",
      entityId: parsed.data.id,
      before,
      after: { deletedAt: new Date().toISOString() },
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to delete driver" }
  }
}
