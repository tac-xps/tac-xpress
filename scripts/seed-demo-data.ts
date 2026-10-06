import { db } from "../lib/db"
import {
  users,
  shipments,
  invoices,
  trackingEvents,
  vehicles,
  pricingRules,
  hubs,
  drivers,
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

    // Insert Hubs
    try {
      const defaultHubs = [
        { name: "Central Delhi Cargo Hub", location: "Central Delhi", contact: "+91 11 2345 6789", type: "warehouse" as const },
        { name: "South Delhi Distribution Hub", location: "South Delhi", contact: "+91 11 2345 6790", type: "branch" as const },
        { name: "New Delhi Airport Gateway", location: "New Delhi", contact: "+91 11 2345 6791", type: "transit_center" as const },
        { name: "Imphal Main Cargo Hub", location: "Imphal", contact: "+91 385 245 1234", type: "warehouse" as const },
        { name: "Imphal West Logistics Center", location: "Imphal West", contact: "+91 385 245 5678", type: "branch" as const },
        { name: "Guwahati Transit Terminal", location: "Guwahati", contact: "+91 361 289 4321", type: "transit_center" as const },
        { name: "Kolkata Gateway Terminal", location: "Kolkata", contact: "+91 33 2233 4455", type: "transit_center" as const },
      ]
      for (const h of defaultHubs) {
        const existing = await db.select().from(hubs).where(eq(hubs.name, h.name))
        if (existing.length === 0) {
          await db.insert(hubs).values(h)
        }
      }
      console.log("Seeded operational hubs.")
    } catch (e: any) {
      console.error(`Failed to seed hubs: ${e.message}`)
    }

    // Insert Drivers
    let rajeshId: string | undefined
    let aslamId: string | undefined
    let birenId: string | undefined
    try {
      const defaultDrivers = [
        { name: "Rajesh Kumar", phone: "+91 98101 23456", licenseNumber: "DL-0420110012345", status: "active" as const },
        { name: "Biren Singh", phone: "+91 94360 87654", licenseNumber: "MN-0120150023456", status: "active" as const },
        { name: "Mohd. Aslam", phone: "+91 98712 34567", licenseNumber: "UP-1420180034567", status: "active" as const },
      ]
      for (const d of defaultDrivers) {
        const existing = await db.select().from(drivers).where(eq(drivers.licenseNumber, d.licenseNumber))
        let driverRecordId: string
        if (existing.length === 0) {
          const [inserted] = await db.insert(drivers).values(d).returning({ id: drivers.id })
          driverRecordId = inserted.id
        } else {
          driverRecordId = existing[0].id
        }
        if (d.name === "Rajesh Kumar") rajeshId = driverRecordId
        if (d.name === "Mohd. Aslam") aslamId = driverRecordId
        if (d.name === "Biren Singh") birenId = driverRecordId
      }
      console.log("Seeded operational drivers.")
    } catch (e: any) {
      console.error(`Failed to seed drivers: ${e.message}`)
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
          driverId: rajeshId,
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
          driverId: aslamId,
        },
        {
          registrationNumber: "KA-01E-2345",
          capacityKg: 5000,
          status: "active",
          driverId: birenId,
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
