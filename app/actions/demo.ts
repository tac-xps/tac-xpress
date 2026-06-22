"use server"

import * as Sentry from "@sentry/nextjs"
import { db } from "@/lib/db"
import {
  users,
  shipments,
  trackingEvents,
  hubs,
  drivers,
  vehicles,
} from "@/lib/db/schema"
import { inArray, sql } from "drizzle-orm"
import crypto from "crypto"
import { revalidatePath } from "next/cache"
import { requireDashboardSession } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

export async function generateDemoData() {
  try {
    const session = await requireDashboardSession(["admin"])

    const userId = session.user.id
    const now = new Date()

    const result = await db.transaction(async (tx) => {
      // 1. Create Demo Hubs
      const demoHubs = [
        {
          name: "Imphal Hub",
          location: "Imphal",
          type: "warehouse" as const,
        },
        {
          name: "New Delhi Terminal",
          location: "New Delhi",
          type: "transit_center" as const,
        },
      ]
      await tx.insert(hubs).values(demoHubs)

      // 2. Create shipments
      const demoShipments = [
        {
          awbNumber: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          origin: "Imphal",
          destination: "New Delhi",
          status: "in-transit" as const,
          weightKg: 120,
          customerId: userId,
          createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        },
        {
          awbNumber: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
          origin: "New Delhi",
          destination: "Imphal",
          status: "pending" as const,
          weightKg: 92,
          customerId: userId,
          createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
      ]

      const insertedShipments = await tx
        .insert(shipments)
        .values(demoShipments)
        .returning({ id: shipments.id })

      // 3. Create tracking events
      if (insertedShipments.length > 0) {
        await tx.insert(trackingEvents).values([
          {
            shipmentId: insertedShipments[0].id,
            status: "in-transit",
            location: "Road Freight",
            description: "In Transit",
            createdAt: now,
          },
        ])
      }

      return {
        success: true,
        shipments: demoShipments.length,
      }
    })

    revalidatePath("/dashboard")
    await logAudit({
      action: "demo_data_generated",
      entity: "shipments",
      userId: session.user.id,
      userEmail: session.user.email ?? null,
      metadata: {
        shipments_created: result.shipments,
      },
    })
    return result
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: error.message || "Internal Server Error" }
  }
}

export async function cleanupDemoData() {
  try {
    const session = await requireDashboardSession(["admin"])

    let deletedShipments = 0
    await db.transaction(async (tx) => {
      const demoShipments = await tx
        .select({ id: shipments.id })
        .from(shipments)
        .where(sql`${shipments.awbNumber} like 'DEMO-%'`)

      const demoShipmentIds = demoShipments.map((shipment) => shipment.id)
      deletedShipments = demoShipmentIds.length

      if (demoShipmentIds.length > 0) {
        await tx
          .delete(trackingEvents)
          .where(inArray(trackingEvents.shipmentId, demoShipmentIds))

        await tx.delete(shipments).where(inArray(shipments.id, demoShipmentIds))
      }
    })

    revalidatePath("/dashboard")
    revalidatePath("/onboarding")
    await logAudit({
      action: "demo_data_cleaned",
      entity: "shipments",
      userId: session.user.id,
      userEmail: session.user.email ?? null,
      metadata: {
        shipments_deleted: deletedShipments,
      },
    })

    return { success: true }
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: error.message || "Internal Server Error" }
  }
}
