import { db } from "../lib/db"
import {
  users,
  shipments,
  invoices,
  trackingEvents,
  vehicles,
  pricingRules,
} from "../lib/db/schema"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"

async function seed() {
  console.log("Seeding demo data...")

  try {
    console.log("Cleaning up old operational data...")
    try {
      await db.delete(trackingEvents)
      console.log("Cleared trackingEvents.")
    } catch (e: any) {
      console.error(`Failed to clear table trackingEvents: ${e.message}`)
    }

    try {
      await db.delete(invoices)
      console.log("Cleared invoices.")
    } catch (e: any) {
      console.error(`Failed to clear table invoices: ${e.message}`)
    }

    try {
      await db.delete(shipments)
      console.log("Cleared shipments.")
    } catch (e: any) {
      console.error(`Failed to clear table shipments: ${e.message}`)
    }

    // Upsert Users
    const adminEmail = "admin@tacxpress.app"
    const staffEmail = "staff@tacxpress.app"
    const passwordHash = await bcrypt.hash("TacXpress2026!", 10)

    let adminId: string
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
    if (existingAdmin.length === 0) {
      const [newAdmin] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          email: adminEmail,
          role: "admin",
        })
        .returning({ id: users.id })
      adminId = newAdmin.id
      console.log(`Inserted admin user: ${adminEmail}`)
    } else {
      adminId = existingAdmin[0].id
      console.log(`Preserved admin user: ${adminEmail}`)
    }

    let staffId: string
    const existingStaff = await db
      .select()
      .from(users)
      .where(eq(users.email, staffEmail))
    if (existingStaff.length === 0) {
      const [newStaff] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          email: staffEmail,
          role: "staff",
        })
        .returning({ id: users.id })
      staffId = newStaff.id
      console.log(`Inserted staff user: ${staffEmail}`)
    } else {
      staffId = existingStaff[0].id
      console.log(`Preserved staff user: ${staffEmail}`)
    }

    // Insert Shipments
    const insertedShipments = await db
      .insert(shipments)
      .values([
        {
          awbNumber: "AWB-100200300",
          origin: "Imphal",
          destination: "New Delhi",
          status: "in-transit",
          serviceType: "express_air",
          weightKg: 25,
          customerId: adminId,
        },
        {
          awbNumber: "AWB-500600700",
          origin: "New Delhi",
          destination: "Imphal",
          status: "delivered",
          serviceType: "road_freight",
          weightKg: 10,
          customerId: staffId,
        },
        {
          awbNumber: "AWB-12345",
          origin: "Imphal",
          destination: "New Delhi",
          status: "in-transit",
          serviceType: "express_air",
          weightKg: 15,
          customerId: adminId,
        },
      ])
      .returning({ id: shipments.id })

    console.log(`Inserted ${insertedShipments.length} shipments.`)

    // Insert Tracking Events
    if (insertedShipments.length > 0) {
      await db.insert(trackingEvents).values([
        {
          shipmentId: insertedShipments[0].id,
          status: "pending",
          location: "Imphal Hub",
          description: "Shipment picked up from origin",
        },
        {
          shipmentId: insertedShipments[0].id,
          status: "in-transit",
          location: "New Delhi Transit",
          description: "Departed from Imphal",
        },
      ])
      console.log("Inserted tracking events.")

      // Insert mock invoice for the first shipment
      await db.insert(invoices).values([
        {
          id: crypto.randomUUID(),
          customerId: adminId,
          shipmentId: insertedShipments[0].id,
          amount: 15000,
          status: "unpaid",
          pdfUrl: "https://example.com/invoice.pdf",
        },
      ])
      console.log("Inserted mock invoice.")
    }

    // Insert Vehicles
    try {
      await db.delete(vehicles)
      console.log("Cleared vehicles.")
    } catch (e: any) {
      console.error(`Failed to clear table vehicles: ${e.message}`)
    }

    const insertedFleet = await db
      .insert(vehicles)
      .values([
        {
          registrationNumber: "DL-1CA-5678",
          capacityKg: 2000,
          status: "active",
        },
        {
          registrationNumber: "HR-26B-9012",
          capacityKg: 4000,
          status: "maintenance",
        },
        {
          registrationNumber: "MH-04C-3456",
          capacityKg: 1500,
          status: "retired",
        },
        {
          registrationNumber: "UP-16D-7890",
          capacityKg: 3000,
          status: "active",
        },
        {
          registrationNumber: "KA-01E-2345",
          capacityKg: 5000,
          status: "active",
        },
      ])
      .returning({ id: vehicles.id })

    // Insert Pricing Rules
    try {
      await db.delete(pricingRules)
      console.log("Cleared pricing rules.")
    } catch (e: any) {
      console.error(`Failed to clear table pricingRules: ${e.message}`)
    }

    const insertedPricingRules = await db
      .insert(pricingRules)
      .values([
        {
          serviceType: "express_air",
          origin: "DEL",
          destination: "IMF",
          basePrice: 1000,
          pricePerKg: 750,
        },
        {
          serviceType: "road_freight",
          origin: "DEL",
          destination: "IMF",
          basePrice: 500,
          pricePerKg: 450,
        },
        {
          serviceType: "express_air",
          origin: "IMF",
          destination: "DEL",
          basePrice: 1000,
          pricePerKg: 750,
        },
        {
          serviceType: "road_freight",
          origin: "IMF",
          destination: "DEL",
          basePrice: 500,
          pricePerKg: 450,
        },
      ])
      .returning({ id: pricingRules.id })

    console.log(`Inserted ${insertedPricingRules.length} pricing rules.`)

    console.log("Seed complete.")
  } catch (error: any) {
    console.error(`Structural seed failure:`, error)
  }
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
