import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { requireDocumentPage } from "@/lib/auth/page-access"
import { ShippingLabel } from "@/components/documents/shipping-label"
import { PrintButton } from "../print-button"

export default async function ShippingLabelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireDocumentPage(id)
  const invoice = await db.query.invoices.findFirst({ where: (table, { eq, or }) => or(eq(table.id, id), eq(table.shipmentId, id)), with: { shipment: true } })
  if (!invoice?.shipment || invoice.shipment.deletedAt || invoice.status === "void") notFound()
  return <main className="flex min-h-screen flex-col items-center gap-4 bg-muted p-4 print:block print:bg-white print:p-0">
    <style>{'@media print { @page { size: 4in 6in; margin: 0; } html, body { margin: 0; padding: 0; } }'}</style>
    <div className="print:hidden"><PrintButton /></div>
    <div className="max-w-full overflow-x-auto" role="region" aria-label="4 by 6 inch print preview" tabIndex={0}><ShippingLabel shipment={invoice.shipment} /></div>
  </main>
}
