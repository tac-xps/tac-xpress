import { db } from "./lib/db"
import { shipments, trackingEvents } from "./lib/db/schema"
import { eq } from "drizzle-orm"

async function test() {
  const shipmentId = "a8fdc50e-f995-4b70-9502-e0e531b566c1"
  console.log("Testing shipment:", shipmentId)

  try {
    const previousStatus = await db.transaction(async (tx) => {
      const [currentShipment] = await tx
        .select({ status: shipments.status })
        .from(shipments)
        .where(eq(shipments.id, shipmentId))
        .limit(1)

      if (!currentShipment) throw new Error("Shipment not found")

      const validNextStatus: Record<string, string[]> = {
        pending: ["in-transit"],
        "in-transit": ["in-transit", "delivered"],
        delivered: [],
      }

      if (!validNextStatus[currentShipment.status]?.includes("in-transit")) {
        throw new Error(
          `Invalid shipment transition: ${currentShipment.status} to in-transit`
        )
      }

      console.log("Transition valid. Inserting event...")

      await tx.insert(trackingEvents).values({
        shipmentId,
        status: "in-transit",
        location: "Test Location",
        description: "Test Description",
      })

      console.log("Event inserted. Updating shipment...")

      await tx
        .update(shipments)
        .set({ status: "in-transit" })
        .where(eq(shipments.id, shipmentId))

      return currentShipment.status
    })
    console.log("Success! Previous status:", previousStatus)
  } catch (error) {
    console.error("Caught error:", error)
  }
}

test()
  .catch(console.error)
  .finally(() => process.exit(0))
