import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { requireDocumentPage } from "@/lib/auth/page-access"
import { ShippingLabel } from "@/components/documents/shipping-label"
import { PrintButton } from "../print-button"

export default async function ShippingLabelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireDocumentPage(id)
  const invoice = await db.query.invoices.findFirst({
    where: (table, { eq, or }) => or(eq(table.id, id), eq(table.shipmentId, id)),
    with: { shipment: true },
  })
  let shipment = invoice?.shipment
  if (!shipment) {
    shipment = await db.query.shipments.findFirst({
      where: (table, { eq, or, and, isNull }) =>
        and(
          or(eq(table.id, id), eq(table.awbNumber, id)),
          isNull(table.deletedAt)
        ),
    })
  }
  if (!shipment || shipment.deletedAt) notFound()
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 bg-muted p-4 print:block print:bg-white print:p-0">
      <style>{'@media print { @page { size: 4in 3in; margin: 0; } html, body { margin: 0; padding: 0; } }'}</style>
      <div className="print:hidden flex w-full max-w-[4in] sm:max-w-[5in] md:max-w-[6in] items-center justify-between gap-2 px-1">
        <span className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
          4&quot; × 3&quot; Thermal Label (4:3 Aspect Ratio)
        </span>
        <PrintButton />
      </div>
      <div
        className="max-w-full overflow-x-auto rounded-none shadow-xl transition-transform sm:scale-125 md:scale-150 origin-top mt-4 mb-24 print:m-0 print:transform-none print:shadow-none"
        role="region"
        aria-label="4 by 3 inch thermal shipping label print preview"
        tabIndex={0}
      >
        <ShippingLabel shipment={shipment} />
      </div>
    </main>
  )
}
