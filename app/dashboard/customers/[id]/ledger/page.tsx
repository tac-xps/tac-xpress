import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { invoices, users, shipments } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"

export const metadata: Metadata = {
  title: "Customer Ledger | TAC-XPRESS",
  description: "Account billing history, statement of accounts, payments, and invoice breakdown.",
}
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/operations/page-header"
import { LedgerDataTable, type CustomerInvoiceRow } from "./ledger-data-table"
import { parseRecordQuery, type RecordSearchParams } from "@/lib/table-query"

export const dynamic = "force-dynamic"

export default async function CustomerLedgerPage(props: {
  params: Promise<{ id: string }>
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()

  const params = await props.params
  const searchParams = await props.searchParams
  const customerId = params.id
  const { page, pageSize } = parseRecordQuery(searchParams, [])

  const customer = await db.query.users.findFirst({
    where: eq(users.id, customerId),
  })

  if (!customer) {
    notFound()
  }

  const [customerInvoices, countRes, aggregateSums] = await Promise.all([
    db
      .select({
        id: invoices.id,
        amount: invoices.amount,
        advancePaid: invoices.advancePaid,
        balanceDue: invoices.balanceDue,
        status: invoices.status,
        createdAt: invoices.createdAt,
        awbNumber: shipments.awbNumber,
      })
      .from(invoices)
      .leftJoin(shipments, eq(invoices.shipmentId, shipments.id))
      .where(eq(invoices.customerId, customerId))
      .orderBy(desc(invoices.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(eq(invoices.customerId, customerId)),
    db
      .select({
        totalBilled: sql<number>`coalesce(sum(${invoices.amount}), 0)`,
        totalAdvance: sql<number>`coalesce(sum(${invoices.advancePaid}), 0)`,
        totalDue: sql<number>`coalesce(sum(${invoices.balanceDue}), 0)`,
      })
      .from(invoices)
      .where(eq(invoices.customerId, customerId)),
  ])

  const totalBilled = Number(aggregateSums[0]?.totalBilled) || 0
  const totalAdvance = Number(aggregateSums[0]?.totalAdvance) || 0
  const totalDue = Number(aggregateSums[0]?.totalDue) || 0

  const pageCount = Math.ceil(Number(countRes[0].count) / pageSize)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Customer Ledger"
        description={`Statement of account for ${customer.name || customer.email || "customer"}`}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalBilled / 100).toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Paid (Advances)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-trend-positive text-2xl font-bold">
              ₹{(totalAdvance / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Balance Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              ₹{(totalDue / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <LedgerDataTable data={customerInvoices as CustomerInvoiceRow[]} pageCount={pageCount} />
    </div>
  )
}
