import type { Meta, StoryObj } from "@storybook/nextjs"
import type { Invoice, Shipment } from "@/lib/db/schema"
import { InvoiceDocument } from "@/components/invoice-document"
import { ShippingLabel } from "@/components/documents/shipping-label"

// Isolated print fixtures. These records never connect to operational actions.
const shipment = {
  id: "22222222-2222-4222-8222-222222222222", awbNumber: "TAC-QA-20260907", serviceType: "express_air", pieces: 12,
  consignorName: "Sample Sender · Design fixture", consignorAddress: "42 Example Industrial Estate, Loading Bay 3, New Delhi", consignorPinCode: "110001", consignorPhone: "+910000000001", consignorEmail: "sender@example.test",
  consigneeName: "Sample Recipient · Design fixture", consigneeAddress: "18 Example Market Road, Near the Community Centre, Imphal West, Manipur", consigneePinCode: "795001", consigneePhone: "+910000000002",
  origin: "New Delhi", destination: "Imphal", weightKg: 36, chargedWeightKg: 40, bookingDate: new Date("2026-09-07T09:00:00Z"), contentDescription: "Packaged household items. Simulated document for print verification.",
} as Shipment
const invoice: Invoice = {
  id: "11111111-1111-4111-8111-111111111111", shipmentId: shipment.id, customerId: null,
  amount: 156940, status: "unpaid", pdfUrl: null, dueDate: null,
  freightCharge: 100000, pickupCharge: 10000, packingCharge: 10000, docketCharge: 3000, insuranceCharge: 5000, otherCharges: 5000,
  subtotal: 133000, gstRate: 18, hsnCode: "996511", cgst: 0, sgst: 0, igst: 23940, paymentMode: "upi", advancePaid: 50000, balanceDue: 106940,
  remarks: "Simulated fixture", termsAccepted: true, prohibitedAccepted: true, signatureUrl: null, whatsappStatus: "pending", createdAt: new Date("2026-09-07T09:00:00Z"), updatedAt: new Date("2026-09-07T09:00:00Z"),
}
const meta = { title: "Operations/Documents", parameters: { layout: "fullscreen" } } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const InvoicePrint: Story = { render: () => <InvoiceDocument invoice={invoice} shipment={shipment} appOrigin="https://example.test" /> }
export const ThermalLabel: Story = { render: () => <><style>{"@media print { @page { size: 4in 6in; margin: 0; } }"}</style><ShippingLabel shipment={shipment} /></> }
export const LongAddressLabel: Story = { render: () => <ShippingLabel shipment={{ ...shipment, consigneeAddress: "Building 42, Third Floor, Office 308, Example Business Park, Opposite the Main Railway Station, Ring Road Extension, Ward 16, Imphal West District, Manipur. Contact reception before unloading.", consignorAddress: "Warehouse 8, Example Logistics Estate, Industrial Area Phase Two, Near Gate 3, New Delhi. Dispatch office on the ground floor." }} /> }
