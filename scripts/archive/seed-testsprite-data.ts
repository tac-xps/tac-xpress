import { db } from "../lib/db/index"
import { manifests, users, hubs, vehicles, drivers } from "../lib/db/schema"
import * as dotenv from "dotenv"
dotenv.config({ path: ".env.local" })

async function seedTestSprite() {
  console.log("Seeding PU manifest for TestSprite tests...")

  const adminUsers = await db.select().from(users).limit(1)
  const adminUserId = adminUsers[0]?.id

  const originHubs = await db.select().from(hubs).limit(1)
  const originHubId = originHubs[0]?.id

  const destHubs = await db.select().from(hubs).limit(2)
  const destHubId = destHubs[1]?.id || destHubs[0]?.id

  const vehicleList = await db.select().from(vehicles).limit(1)
  const vehicleId = vehicleList[0]?.id

  const driverList = await db.select().from(drivers).limit(1)
  const driverId = driverList[0]?.id

  if (!originHubId || !destHubId || !vehicleId || !driverId) {
    console.log("Missing relation data!")
    process.exit(1)
  }

  // Insert Manifest (Dispatch Run)
  await db.insert(manifests).values({
    referenceId: "PU-TEST-001",
    originHubId: originHubId,
    destinationHubId: destHubId,
    vehicleId: vehicleId,
    driverId: driverId,
    status: "draft",
    createdBy: adminUserId,
  })
  console.log("✅ Seeded dispatch run PU-TEST-001")

  console.log("Data seeded successfully!")
  process.exit(0)
}

seedTestSprite().catch((err) => {
  console.error("Failed to seed testsprite data:", err)
  process.exit(1)
})
