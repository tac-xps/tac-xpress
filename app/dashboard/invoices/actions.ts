"use server"

import { signDocumentToken } from "@/lib/auth/document-token"
import { getAppUrl } from "@/lib/config/app-url"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { eq, or, and, sql } from "drizzle-orm"

import { logAuditInTransaction } from "@/lib/audit"
import { chargedWeight } from "@/lib/shipment-weight"
import { calculateInvoice, toPaise } from "@/lib/invoices/calculations"
import { createStoredInvoice, updateStoredInvoice, voidStoredInvoice } from "@/lib/invoices/persistence"
import { requireDashboardSession } from "@/lib/auth/guards"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { invoices, shipments, users, trackingEvents } from "@/lib/db/schema"
import { authActionClient } from "@/lib/safe-action"
import { invoiceWizardSchema } from "@/lib/schemas/invoice-wizard"
import { normalizeWhatsAppPhone, sendWhatsAppTemplateMessage } from "@/lib/whatsapp/service"
import { capturePostHogEvent } from "@/lib/posthog-server"
const GENERIC_INVOICE_ERROR =
  "We could not complete the invoice request. Please try again."
const GENERIC_WIZARD_ERROR =
  "A critical error occurred while creating your shipment."



const sendInvoiceViaWhatsAppSchema = z.object({
  invoiceId: z.string().uuid("Invalid invoice ID"),
  phone: z.string().min(10, "Phone number is required").max(30),
})

export const sendInvoiceViaWhatsApp = authActionClient
  .schema(sendInvoiceViaWhatsAppSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { invoiceId, phone } = parsedInput
    let providerAccepted = false

    // Record the send outcome after the response is sent, so the analytics
    // round trip never adds latency to the operator's toast.
    const captureSendOutcome = (
      outcome: "success" | "failure",
      reason?: string
    ) =>
      after(() =>
        capturePostHogEvent("invoice_whatsapp_send", ctx.session.user.id, {
          invoiceId,
          outcome,
          ...(reason ? { reason } : {}),
        })
      )

    try {
      if (process.env.WHATSAPP_ENABLED !== "true") {
        captureSendOutcome("failure", "delivery_disabled")
        return {
          success: false,
          error: "WhatsApp delivery is currently disabled.",
        }
      }

      const invoice = await db.query.invoices.findFirst({
        where: eq(invoices.id, invoiceId),
        with: { shipment: true, customer: true },
      })

      if (!invoice?.shipment || invoice.shipment.deletedAt) {
        captureSendOutcome("failure", "missing_shipment")
        return {
          success: false,
          error: "Invoice does not have an associated active shipment.",
        }
      }

      if (invoice.status === "void") {
        captureSendOutcome("failure", "void_invoice")
        return {
          success: false,
          error:
            "Cannot send a voided invoice via WhatsApp. Please issue an active invoice.",
        }
      }

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.SUPABASE_SERVICE_ROLE_KEY
      ) {
        Sentry.captureMessage(
          "Missing required Supabase environment variables",
          {
            level: "error",
          }
        )
        captureSendOutcome("failure", "not_configured")
        return {
          success: false,
          error: "Invoice delivery is not configured.",
        }
      }

      const normalizedPhone = normalizeWhatsAppPhone(phone)
      const candidatePhones = [
        invoice.shipment.consignorPhone
          ? normalizeWhatsAppPhone(invoice.shipment.consignorPhone)
          : null,
        invoice.customer?.phone
          ? normalizeWhatsAppPhone(invoice.customer.phone)
          : null,
        invoice.shipment.consigneePhone
          ? normalizeWhatsAppPhone(invoice.shipment.consigneePhone)
          : null,
      ].filter((p): p is string => Boolean(p))

      if (candidatePhones.length === 0) {
        return {
          success: false,
          error: "No contact phone number is recorded on this shipment.",
        }
      }

      if (!candidatePhones.includes(normalizedPhone)) {
        return {
          success: false,
          error:
            "The recipient phone does not match any contact recorded on this shipment.",
        }
      }

      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      let finalPdfUrl = ""
      const fileName = `whatsapp-invoice-${invoice.id}.pdf`

      try {
        // Check if PDF is already in storage to avoid redundant Puppeteer runs
        const { data: existingFiles } = await supabase.storage
          .from("cargo-documents")
          .list("", { search: fileName })

        const fileExists = existingFiles?.some((f) => f.name === fileName)

        if (!fileExists) {
          const { renderInvoicePdf } = await import(
            "@/lib/documents/render-invoice-pdf"
          )
          const pdfBuffer = await renderInvoicePdf(invoice.id)
          const { error: uploadError } = await supabase.storage
            .from("cargo-documents")
            .upload(fileName, pdfBuffer, {
              contentType: "application/pdf",
              upsert: true,
            })
          if (uploadError) throw uploadError
        }

        // Generate a fresh 7-day signed URL for WPBox
        const { data: signedUrlData, error: signError } = await supabase.storage
          .from("cargo-documents")
          .createSignedUrl(fileName, 60 * 60 * 24 * 7)

        if (signError || !signedUrlData?.signedUrl) {
          throw signError || new Error("Failed to create signed URL")
        } else {
          finalPdfUrl = signedUrlData.signedUrl
        }
      } catch (err) {
        Sentry.captureMessage("Failed to retrieve WhatsApp PDF from Supabase", {
          level: "error",
          extra: { error: String(err), invoiceId: invoice.id },
        })
        captureSendOutcome("failure", "pdf_unavailable")
        return {
          success: false,
          error: `Failed to process invoice PDF: ${err instanceof Error ? err.message : "Error"}`,
        }
      }
      const sendResult = await sendWhatsAppTemplateMessage({
        to: phone,
        template: "invoice",
        relatedAwb: invoice.shipment.awbNumber,
        relatedInvoiceId: invoice.id,
        context: "invoice_send",
        bodyPreview: `[template:invoice:${invoice.id}]`,
        components: [
          {
            type: "HEADER",
            parameters: [
              {
                type: "document",
                document: {
                  link: finalPdfUrl,
                  filename: `Invoice-${invoice.id.split("-")[0].toUpperCase()}.pdf`,
                },
              },
            ],
          },
          {
            type: "BODY",
            parameters: [
              {
                type: "text",
                text: invoice.shipment.consignorName || "Customer",
              },
              {
                type: "text",
                text: `INV-${invoice.id.split("-")[0].toUpperCase()}`,
              },
              {
                type: "text",
                text: `INR ${(invoice.amount / 100).toFixed(2)}`,
              },
            ],
          },
        ],
      })

      if (!sendResult.success) {
        await db
          .update(invoices)
          .set({ whatsappStatus: "failed", updatedAt: new Date() })
          .where(eq(invoices.id, invoiceId))

        captureSendOutcome("failure", "provider_rejected")
        revalidatePath("/dashboard/invoices")
        return {
          success: false,
          error:
            sendResult.error ||
            "WhatsApp provider rejected the invoice message.",
        }
      }

      providerAccepted = true
      await db
        .update(invoices)
        .set({ whatsappStatus: "sent", updatedAt: new Date() })
        .where(eq(invoices.id, invoiceId))

      captureSendOutcome("success")
      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "send_invoice_whatsapp" },
        extra: { invoiceId, actorId: ctx.session.user.id },
      })
      if (providerAccepted) return { success: true, warning: "Provider accepted the message. Its local status needs reconciliation." }

      await db
        .update(invoices)
        .set({ whatsappStatus: "failed", updatedAt: new Date() })
        .where(eq(invoices.id, invoiceId))

      captureSendOutcome("failure", "exception")
      revalidatePath("/dashboard/invoices")
      return {
        success: false,
        error: "Failed to send WhatsApp message.",
      }
    }
  })

const createInvoiceSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
})

export const createInvoiceAction = authActionClient
  .schema(createInvoiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const newInvoice = await createStoredInvoice(parsedInput.shipmentId, toPaise(parsedInput.amount), ctx.session.user)

      revalidatePath("/dashboard/invoices")
      return { success: true, invoiceId: newInvoice.id }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "create_invoice" },
        extra: {
          actorId: ctx.session.user.id,
          shipmentId: parsedInput.shipmentId,
        },
      })
      return {
        success: false,
        error: GENERIC_INVOICE_ERROR,
      }
    }
  })

const updateInvoiceSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["unpaid", "paid"]),
  amount: z.number().nonnegative(),
  advancePaid: z.number().nonnegative().optional(),
  balanceDue: z.number().optional(),
})

export const updateInvoiceAction = authActionClient
  .schema(updateInvoiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { id, status, amount, advancePaid } = parsedInput

    try {
      await updateStoredInvoice(id, { status, amount, advancePaid }, ctx.session.user, { paymentOnly: true })

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "update_invoice" },
        extra: { actorId: ctx.session.user.id, invoiceId: id },
      })
      return { success: false, error: "Failed to update invoice." }
    }
  })

// ─── Full Invoice Update ───────────────────────────────────────────────────────
// Updates ALL charge breakdown fields plus recalculates totals.

const updateFullInvoiceSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["unpaid", "paid"]),
  paymentMode: z
    .enum(["cash", "upi", "card", "wallet", "credit", "to_pay"])
    .optional(),
  freightCharge: z.number().nonnegative().optional(),
  pickupCharge: z.number().nonnegative().optional(),
  packingCharge: z.number().nonnegative().optional(),
  docketCharge: z.number().nonnegative().optional(),
  insuranceCharge: z.number().nonnegative().optional(),
  otherCharges: z.number().nonnegative().optional(),
  subtotal: z.number().nonnegative().optional(),
  gstRate: z.number().min(0).max(28).optional(),
  cgst: z.number().nonnegative().optional(),
  sgst: z.number().nonnegative().optional(),
  amount: z.number().nonnegative().optional(),
  advancePaid: z.number().nonnegative().optional(),
  balanceDue: z.number().optional(),
  remarks: z.string().optional(),
  shipmentId: z.string().uuid().optional(),
  consignorName: z.string().optional(),
  consignorPhone: z.string().optional(),
  consigneeName: z.string().optional(),
  consigneePhone: z.string().optional(),
})

export const updateFullInvoiceAction = authActionClient
  .schema(updateFullInvoiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      id,
      shipmentId,
      consignorName,
      consignorPhone,
      consigneeName,
      consigneePhone,
      ...fields
    } = parsedInput

    try {
      await updateStoredInvoice(id, fields, ctx.session.user, { shipmentId, parties: { consignorName, consignorPhone, consigneeName, consigneePhone } })

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "update_full_invoice" },
        extra: { actorId: ctx.session.user.id, invoiceId: id },
      })
      return { success: false, error: "Failed to update invoice." }
    }
  })

const deleteInvoiceSchema = z.object({
  id: z.string().uuid(),
})

export const deleteInvoiceAction = authActionClient
  .schema(deleteInvoiceSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      await requireDashboardSession(["admin"])
      await voidStoredInvoice(parsedInput.id, ctx.session.user)

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "delete_invoice" },
        extra: { actorId: ctx.session.user.id, invoiceId: parsedInput.id },
      })
      return { success: false, error: "Failed to delete invoice." }
    }
  })

async function upsertCustomerHelper(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  name: string,
  phone: string,
  email?: string | null,
  address?: string | null,
  pinCode?: string | null,
  city?: string | null,
  state?: string | null
) {
  if (!phone) return null

  // Normalize phone (strip non-digits)
  const normalizedPhone = phone.replace(/\D/g, "")
  const searchPhone10 =
    normalizedPhone.length > 10 ? normalizedPhone.slice(-10) : normalizedPhone
  const searchPhone91 = `91${searchPhone10}`

  const existing = await tx.query.users.findFirst({
    where: (usersTable: any, { eq, and, or }: any) =>
      and(
        eq(usersTable.role, "customer"),
        or(
          eq(usersTable.phone, phone),
          eq(usersTable.phone, normalizedPhone),
          eq(usersTable.phone, searchPhone10),
          eq(usersTable.phone, searchPhone91),
          eq(usersTable.phone, `+${searchPhone91}`)
        )
      ),
  })

  // Prevent unique constraint violation by checking if the requested email belongs to another user
  // Normalize to lowercase so comparison is consistent with the DB unique constraint
  let safeEmail =
    email && email.trim() !== "" ? email.trim().toLowerCase() : null
  if (safeEmail) {
    const emailOwner = await tx.query.users.findFirst({
      where: (t: any, { sql: sqlHelper }: any) =>
        sqlHelper`LOWER(${t.email}) = ${safeEmail}`,
    })
    if (emailOwner && (!existing || emailOwner.id !== existing.id)) {
      // The email belongs to a different account. We ignore the email update to prevent a crash.
      safeEmail = existing ? existing.email : null
    }
  }

  const isUniqueViolation = (err: unknown) =>
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"

  if (existing) {
    let updated
    try {
      await tx.transaction(async (tx2) => {
        ;[updated] = await tx2
          .update(users)
          .set({
            name: name || existing.name,
            email: safeEmail || existing.email,
            phone: phone || existing.phone,
            address: address || existing.address,
            pinCode: pinCode || existing.pinCode,
            city: city || existing.city,
            state: state || existing.state,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existing.id))
          .returning()
      })
    } catch (err) {
      if (!isUniqueViolation(err)) throw err
      ;[updated] = await tx
        .update(users)
        .set({
          name: name || existing.name,
          email: existing.email,
          phone: phone || existing.phone,
          address: address || existing.address,
          pinCode: pinCode || existing.pinCode,
          city: city || existing.city,
          state: state || existing.state,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning()
    }
    return updated
  } else {
    let inserted
    try {
      await tx.transaction(async (tx2) => {
        ;[inserted] = await tx2
          .insert(users)
          .values({
            id: crypto.randomUUID(),
            name,
            email: safeEmail,
            phone,
            address: address || null,
            pinCode: pinCode || null,
            city: city || null,
            state: state || null,
            role: "customer",
          })
          .returning()
      })
    } catch (err) {
      if (!isUniqueViolation(err)) throw err
      ;[inserted] = await tx
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          name,
          email: null,
          phone,
          address: address || null,
          pinCode: pinCode || null,
          city: city || null,
          state: state || null,
          role: "customer",
        })
        .returning()
    }
    return inserted
  }
}

export const createWizardInvoiceAction = authActionClient
  .schema(invoiceWizardSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const invoiceId = parsedInput.requestId ?? crypto.randomUUID()
      const awbNumber = `AWB-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`

      const { newInvoice, newShipment } = await Sentry.startSpan(
        {
          name: "create wizard invoice transaction",
          op: "db.transaction",
          attributes: {
            "invoice.service_type": parsedInput.serviceType,
          },
        },
        async () =>
          db.transaction(async (tx) => {
            await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${invoiceId}, 0))`)
            const existing = await tx.query.invoices.findFirst({ where: eq(invoices.id, invoiceId), with: { shipment: true } })
            if (existing?.shipment) return { newInvoice: existing, newShipment: existing.shipment }
            // Upsert consignor
            const consignorUser = await upsertCustomerHelper(
              tx,
              parsedInput.consignorName,
              parsedInput.consignorPhone,
              parsedInput.consignorEmail,
              parsedInput.consignorAddress,
              parsedInput.consignorPinCode,
              parsedInput.origin,
              null
            )

            // Upsert consignee
            const consigneeUser = await upsertCustomerHelper(
              tx,
              parsedInput.consigneeName,
              parsedInput.consigneePhone,
              parsedInput.consigneeEmail,
              parsedInput.consigneeAddress,
              parsedInput.consigneePinCode,
              parsedInput.destination,
              null
            )

            const [newShipment] = await tx
              .insert(shipments)
              .values({
                awbNumber,
                status: "pending",
                customerId: consignorUser?.id || null,
                origin: parsedInput.origin,
                destination: parsedInput.destination,
                serviceType: parsedInput.serviceType,
                weightKg: parsedInput.weightKg,
                consignorName: parsedInput.consignorName,
                consignorCompany: parsedInput.consignorCompany,
                consignorPhone: parsedInput.consignorPhone,
                consignorAltPhone: parsedInput.consignorAltPhone,
                consignorEmail: parsedInput.consignorEmail,
                consignorAddress: parsedInput.consignorAddress,
                consignorPinCode: parsedInput.consignorPinCode,
                consignorIdType: parsedInput.consignorIdType,
                consignorIdNumber: parsedInput.consignorIdNumber,
                consigneeName: parsedInput.consigneeName,
                consigneePhone: parsedInput.consigneePhone,
                consigneeAltPhone: parsedInput.consigneeAltPhone,
                consigneeEmail: parsedInput.consigneeEmail,
                consigneeAddress: parsedInput.consigneeAddress,
                consigneePinCode: parsedInput.consigneePinCode,
                contentDescription: parsedInput.contentDescription,
                natureOfGoods: parsedInput.natureOfGoods,
                itemCondition: parsedInput.itemCondition,
                declaredValue: toPaise(parsedInput.declaredValue),
                pieces: parsedInput.pieces,
                dimensionsL: parsedInput.dimensionsL,
                dimensionsW: parsedInput.dimensionsW,
                dimensionsH: parsedInput.dimensionsH,
                chargedWeightKg: chargedWeight(parsedInput),
                packagingType: parsedInput.packagingType,
                isFragile: parsedInput.isFragile,
                insuranceOptIn: parsedInput.insuranceOptIn,
              })
              .returning()

            const freightChargePaise = toPaise(parsedInput.freightCharge)
            const pickupChargePaise = toPaise(parsedInput.pickupCharge)
            const packingChargePaise = toPaise(parsedInput.packingCharge)
            const docketChargePaise = toPaise(parsedInput.docketCharge)
            const insuranceChargePaise = toPaise(parsedInput.insuranceCharge)
            const otherChargesPaise = toPaise(parsedInput.otherCharges)

            const totals = calculateInvoice({ freightCharge: freightChargePaise, pickupCharge: pickupChargePaise, packingCharge: packingChargePaise, docketCharge: docketChargePaise, insuranceCharge: insuranceChargePaise, otherCharges: otherChargesPaise, gstRate: parsedInput.gstRate, interstate: !!parsedInput.originState && !!parsedInput.destinationState && parsedInput.originState.trim().toLowerCase() !== parsedInput.destinationState.trim().toLowerCase(), advancePaid: toPaise(parsedInput.advancePaid) })

            const [newInvoice] = await tx
              .insert(invoices)
              .values({
                id: invoiceId,
                shipmentId: newShipment.id,
                customerId: consignorUser?.id || null,
                ...totals,
                freightCharge: freightChargePaise,
                pickupCharge: pickupChargePaise,
                packingCharge: packingChargePaise,
                docketCharge: docketChargePaise,
                insuranceCharge: insuranceChargePaise,
                otherCharges: otherChargesPaise,
                gstRate: parsedInput.gstRate,
                paymentMode: parsedInput.paymentMode,
                remarks: parsedInput.remarks,
                termsAccepted: parsedInput.termsAccepted,
                prohibitedAccepted: parsedInput.prohibitedAccepted,
                pdfUrl: `/invoice/${invoiceId}`,
              })
              .returning()

            await tx.insert(trackingEvents).values({ shipmentId: newShipment.id, status: "pending", location: newShipment.origin, description: "Shipment booked", isPublic: true })
            await logAuditInTransaction(tx, { action: "invoice.wizard_created", entity: "invoice", entityId: newInvoice.id, userId: ctx.session.user.id, userEmail: ctx.session.user.email, after: { shipmentId: newShipment.id, amount: totals.amount } })
            return { newInvoice, newShipment }
          })
      )

      await capturePostHogEvent("invoice_created", ctx.session.user.id, {
        invoiceId: newInvoice.id,
        shipmentId: newShipment.id,
        amountPaise: newInvoice.amount,
        source: "invoice_wizard",
      })

      revalidatePath("/dashboard/invoices")
      revalidatePath("/dashboard/shipments")

      return {
        success: true,
        invoiceId: newInvoice.id,
        shipmentId: newShipment.id,
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "create_wizard_invoice" },
        extra: { actorId: ctx.session.user.id },
      })
      return {
        success: false,
        error: GENERIC_WIZARD_ERROR,
      }
    }
  })

const getInvoiceDetailsSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
})

export const getInvoiceDetails = authActionClient
  .schema(getInvoiceDetailsSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const targetInvoice = await db.query.invoices.findFirst({
        where: eq(invoices.shipmentId, parsedInput.shipmentId),
        with: {
          shipment: true,
        },
      })

      if (!targetInvoice?.shipment) {
        return null
      }

      return targetInvoice
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "get_invoice_details" },
        extra: {
          actorId: ctx.session.user.id,
          shipmentId: parsedInput.shipmentId,
        },
      })
      return null
    }
  })

const lookupPincodeSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit Indian PIN code"),
})

export const lookupPincodeAction = authActionClient
  .schema(lookupPincodeSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { pincode } = parsedInput
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
        {
          signal: controller.signal,
        }
      )
      clearTimeout(timeoutId)
      if (!res.ok) {
        throw new Error(`Postal API returned status ${res.status}`)
      }
      const data = await res.json()
      if (
        data &&
        data[0] &&
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const postOffices = data[0].PostOffice
        const office = postOffices[0]
        return {
          success: true,
          city: office.District || office.Name || "",
          state: office.State || "",
          officeName: office.Name || "",
        }
      }
      return {
        success: false,
        error: "No details found for this PIN code.",
      }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error: "Failed to fetch PIN code details. Please enter manually.",
      }
    }
  })
