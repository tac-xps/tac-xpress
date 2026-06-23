import { verifyPortalSession } from "@/app/actions/portal-auth"
import { getPortalInvoices } from "@/app/actions/portal-invoices"
import { redirect } from "next/navigation"
import InvoicesList from "../components/invoices-list"

export const metadata = {
  title: "Invoices & Billing | TAC-XPRESS Portal",
  description: "View and download your invoices",
}

export default async function PortalInvoicesPage() {
  const session = await verifyPortalSession()
  if (!session) redirect("/portal")

  const response = await getPortalInvoices()
  const invoices = (response.success ? response.data : []) as any[]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">
          Invoices & Billing
        </h1>
        <p className="text-sm text-muted-foreground">
          {invoices.length} invoice{invoices.length !== 1 ? "s" : ""} on record
          for {session.email}
        </p>
      </div>

      <InvoicesList invoices={invoices} />
    </div>
  )
}
