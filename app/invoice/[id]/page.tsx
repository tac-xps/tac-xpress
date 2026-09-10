import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { InvoiceView } from "./invoice-view"
import { requireDocumentPage } from "@/lib/auth/page-access"
import { getAppUrl } from "@/lib/config/app-url"

export default async function InvoicePrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id: paramId } = await params
  await requireDocumentPage(paramId)
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const isPreview = resolvedSearchParams.preview === "true"

  const targetInvoice = await db.query.invoices.findFirst({
    where: (invoices, { eq, or }) =>
      or(eq(invoices.shipmentId, paramId), eq(invoices.id, paramId)),
    with: {
      shipment: true,
    },
  })

  if (!targetInvoice || !targetInvoice.shipment || targetInvoice.shipment.deletedAt) {
    return notFound()
  }

  const shipment = targetInvoice.shipment

  return (
    <InvoiceView
      invoice={targetInvoice}
      shipment={shipment}
      isPreview={isPreview}
      appOrigin={getAppUrl()}
    />
  )
}
