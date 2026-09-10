export type InvoiceData = {
  whatsappStatus?: string;
  id: string; customer: { name?: string | null; phone?: string | null } | null; createdAt: Date; status: string; amount: number; paymentMode?: string | null; pdfUrl?: string | null; shipmentId?: string | null;
  shipment?: { id?: string | null; awbNumber?: string | null; consignorName?: string | null; consignorPhone?: string | null; consigneeName?: string | null; consigneePhone?: string | null } | null;
  freightCharge?: number | null; pickupCharge?: number | null; packingCharge?: number | null; docketCharge?: number | null; insuranceCharge?: number | null; otherCharges?: number | null; gstRate?: number | null; advancePaid?: number | null; balanceDue?: number | null; remarks?: string | null;
}
export function formatInvoiceCurrency(paise: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(paise / 100) }

