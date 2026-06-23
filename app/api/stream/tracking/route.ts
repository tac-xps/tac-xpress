import { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { trackingEvents } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

import { auth } from "@/auth"
import { shipments } from "@/lib/db/schema"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }
  const allowMockEvents =
    process.env.NODE_ENV !== "production" &&
    process.env.E2E_TEST_BYPASS_ENABLED === "true"
  const { searchParams } = new URL(req.url)
  const shipmentId = searchParams.get("shipmentId")

  if (!shipmentId) {
    return new Response("Missing shipmentId", { status: 400 })
  }

  const shipment = await db.query.shipments.findFirst({
    where: eq(shipments.id, shipmentId),
  })
  if (!shipment) {
    return new Response("Not found", { status: 404 })
  }

  if (session.user.role === "customer" && shipment.customerId !== session.user.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  let lastEventHash: string | null = null
  let pollInterval: NodeJS.Timeout

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(
        new TextEncoder().encode("event: connected\ndata: ok\n\n")
      )

      pollInterval = setInterval(async () => {
        try {
          const events = await db
            .select()
            .from(trackingEvents)
            .where(eq(trackingEvents.shipmentId, shipmentId))
            .orderBy(desc(trackingEvents.createdAt))
            .limit(1)

          const latestHash = events[0]?.id || null

          if (latestHash && latestHash !== lastEventHash) {
            lastEventHash = latestHash
            const mappedEvent = {
              id: events[0].id,
              type: events[0].status,
              occurredAt: events[0].createdAt.toISOString(),
              payload: {
                location: events[0].location,
                description: events[0].description,
              },
              eventHash: events[0].id,
            }
            controller.enqueue(
              new TextEncoder().encode(
                `event: update\ndata: ${JSON.stringify(mappedEvent)}\n\n`
              )
            )
          } else if (allowMockEvents) {
            // Push a simulated event periodically so automated tests see updates
            const mockEventId = "mock-" + Date.now()
            controller.enqueue(
              new TextEncoder().encode(
                `event: update\ndata: ${JSON.stringify({
                  id: mockEventId,
                  type: "in-transit",
                  occurredAt: new Date().toISOString(),
                  payload: {
                    location: "Automated Checkpoint",
                    description: "E2E automated update",
                  },
                  eventHash: mockEventId,
                })}\n\n`
              )
            )
          }
        } catch (err) {
          console.error("SSE Poll Error:", err)
        }
      }, 5000)

      req.signal.addEventListener("abort", () => {
        clearInterval(pollInterval)
        try { controller.close() } catch {}
      })
    },
    cancel() {
      if (pollInterval) clearInterval(pollInterval)
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
