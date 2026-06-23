import crypto from "node:crypto"
import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db"
import { shipments, trackingEvents, users } from "@/lib/db/schema"
import { logAudit } from "@/lib/audit"

const carrierUpdateSchema = z.object({
  awbNumber: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9-]+$/),
  status: z.enum(["pending", "in-transit", "delivered"]),
  payload: z
    .object({
      location: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().min(1).max(500).optional(),
    })
    .optional(),
})

const NEXT_STATUS = {
  pending: "in-transit",
  "in-transit": "delivered",
  delivered: null,
} as const

function verifySignature(rawBody: string, signature: string, secret: string) {
  const expected = Buffer.from(
    crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
    "utf8"
  )
  const actual = Buffer.from(signature, "utf8")
  return (
    expected.length === actual.length &&
    crypto.timingSafeEqual(expected, actual)
  )
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const signature = request.headers.get("x-carrier-signature")
  const secret = process.env.CARRIER_WEBHOOK_SECRET

  if (!secret || !signature || !verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    let body: unknown
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const parsed = carrierUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const [shipment] = await db
      .select()
      .from(shipments)
      .where(eq(shipments.awbNumber, parsed.data.awbNumber.toUpperCase()))
      .limit(1)

    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    if (shipment.status === parsed.data.status) {
      return NextResponse.json({ success: true, duplicate: true })
    }

    if (NEXT_STATUS[shipment.status] !== parsed.data.status) {
      return NextResponse.json(
        { error: "Invalid status transition" },
        { status: 409 }
      )
    }

    const now = new Date()
    const [createdEvent] = await db.transaction(async (tx) => {
      const events = await tx
        .insert(trackingEvents)
        .values({
          shipmentId: shipment.id,
          status: parsed.data.status,
          location: parsed.data.payload?.location || "Carrier network",
          description:
            parsed.data.payload?.description || "Status updated by carrier",
          createdAt: now,
        })
        .returning({ id: trackingEvents.id })

      await tx
        .update(shipments)
        .set({ status: parsed.data.status, updatedAt: now })
        .where(eq(shipments.id, shipment.id))

      return events
    })

    if (!createdEvent) {
      throw new Error("Carrier update did not create a tracking event")
    }

    await logAudit({
      action: "carrier_status_update",
      entity: "shipments",
      entityId: shipment.id,
      before: { status: shipment.status },
      after: { status: parsed.data.status },
      metadata: { eventId: createdEvent.id },
    })

    if (shipment.customerId && process.env.RESEND_API_KEY) {
      const [customer] = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, shipment.customerId))
        .limit(1)

      if (customer?.email) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "")
        const resend = new Resend(process.env.RESEND_API_KEY)
        await resend.emails.send({
          from:
            process.env.RESEND_FROM_EMAIL ||
            "Tac-Xpress <updates@tac-xpress.app>",
          to: [customer.email],
          subject: `Shipment update: ${shipment.awbNumber}`,
          html: `<p>Your shipment <strong>${shipment.awbNumber}</strong> is now <strong>${parsed.data.status}</strong>.</p>${appUrl ? `<p><a href="${appUrl}/track?awb=${encodeURIComponent(shipment.awbNumber)}">View tracking</a></p>` : ""}`,
        })
      }
    }

    return NextResponse.json({ success: true, eventId: createdEvent.id })
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "carrier_webhook" } })
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
