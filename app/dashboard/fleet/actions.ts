"use server"

import { db } from "@/lib/db"
import { drivers, vehicles } from "@/lib/db/schema"
import { and, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"
import { authActionClient } from "@/lib/safe-action"
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
export const createVehicleAction = authActionClient
  .schema(addVehicleSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session

  try {
    const existing = await db.query.vehicles.findFirst({
      where: eq(vehicles.registrationNumber, data.registrationNumber),
    })
    if (existing) {
      return { success: false, error: "Registration number already exists" }
    }
    const [vehicle] = await db.insert(vehicles).values(data).returning()

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
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
})

export const updateVehicleAction = authActionClient
  .schema(updateVehicleSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session

  try {
    const { id, ...updateData } = data
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
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
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
})

export const deleteVehicleAction = authActionClient
  .schema(deleteVehicleSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session

  try {
    const before = await db.query.vehicles.findFirst({
      where: eq(vehicles.id, data.id),
    })
    if (!before) return { success: false, error: "Vehicle not found" }
    await db
      .update(vehicles)
      .set({ deletedAt: new Date() })
      .where(eq(vehicles.id, data.id))

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "delete",
      entity: "vehicles",
      entityId: data.id,
      before,
      after: { deletedAt: new Date().toISOString() },
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to delete vehicle" }
  }
})

// --- Drivers ---
export const createDriverAction = authActionClient
  .schema(addDriverSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session

  try {
    const existing = await db.query.drivers.findFirst({
      where: eq(drivers.licenseNumber, data.licenseNumber),
    })
    if (existing) {
      return { success: false, error: "License number already exists" }
    }
    const [driver] = await db.insert(drivers).values(data).returning()

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
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
})

export const updateDriverAction = authActionClient
  .schema(updateDriverSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session

  try {
    const { id, ...updateData } = data
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
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
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
})

export const deleteDriverAction = authActionClient
  .schema(deleteDriverSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session

  try {
    const before = await db.query.drivers.findFirst({
      where: eq(drivers.id, data.id),
    })
    if (!before) return { success: false, error: "Driver not found" }
    await db
      .update(drivers)
      .set({ deletedAt: new Date() })
      .where(eq(drivers.id, data.id))

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "delete",
      entity: "drivers",
      entityId: data.id,
      before,
      after: { deletedAt: new Date().toISOString() },
    })

    revalidatePath("/dashboard/fleet")
    return { success: true, error: undefined }
  } catch (error) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to delete driver" }
  }
})
