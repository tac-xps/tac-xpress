import type { Invoice } from "@/lib/db/schema"

export function invoiceMoney(paise: number | null) {
  return `INR ${((paise ?? 0) / 100).toFixed(2)}`
}

interface InvoiceChargesProps {
  invoice: Invoice
}
export function InvoiceCharges({ invoice }: InvoiceChargesProps) {
  const rows = [
    ["Freight", invoice.freightCharge],
    ["Pickup", invoice.pickupCharge],
    ["Packing", invoice.packingCharge],
    ["Docket", invoice.docketCharge],
    ["Insurance", invoice.insuranceCharge],
    ["Other charges", invoice.otherCharges],
    ["CGST", invoice.cgst],
    ["SGST", invoice.sgst],
    ["IGST", invoice.igst],
  ] as const
  return (
    <table className="w-full border-collapse text-xs">
      <thead>
        <tr className="border-y border-black bg-gray-100 text-left">
          <th className="px-3 py-2">Description</th>
          <th className="px-3 py-2 text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label} className="border-b border-gray-200">
            <td className="px-3 py-2">{label}</td>
            <td className="px-3 py-2 text-right font-mono">
              {invoiceMoney(value)}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot className="font-mono">
        <tr className="border-t border-black bg-gray-100 font-bold">
          <th className="px-3 py-2 text-left font-sans">Invoice total</th>
          <td className="px-3 py-2 text-right">
            {invoiceMoney(invoice.amount)}
          </td>
        </tr>
        <tr>
          <th className="px-3 py-2 text-left font-sans font-normal">
            Payment recorded
          </th>
          <td className="px-3 py-2 text-right">
            {invoiceMoney(invoice.advancePaid)}
          </td>
        </tr>
        <tr className="border-t border-black font-bold">
          <th className="px-3 py-2 text-left font-sans">Balance due</th>
          <td className="px-3 py-2 text-right">
            {invoiceMoney(
              invoice.status === "void"
                ? 0
                : (invoice.balanceDue ?? invoice.amount)
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  )
}
