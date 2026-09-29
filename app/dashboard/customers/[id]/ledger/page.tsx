import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { invoices, users, shipments } from "@/lib/db/schema"
import { eq, desc, sql } from "drizzle-orm"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  const [customerInvoices, countRes] = await Promise.all([
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
      .where(eq(invoices.customerId, customerId))
  ])

  // These sums should ideally come from an aggregate query across all invoices,
  // but keeping it simple for the current page slice or aggregate everything.
  // Actually, to get true totals, we should aggregate everything, not just the page.
  const aggregateSums = await db
    .select({
      totalBilled: sql<number>`sum(${invoices.amount})`,
      totalAdvance: sql<number>`sum(${invoices.advancePaid})`,
      totalDue: sql<number>`sum(${invoices.balanceDue})`,
    })
    .from(invoices)
    .where(eq(invoices.customerId, customerId))

  const totalBilled = Number(aggregateSums[0].totalBilled) || 0
  const totalAdvance = Number(aggregateSums[0].totalAdvance) || 0
  const totalDue = Number(aggregateSums[0].totalDue) || 0

  const pageCount = Math.ceil(Number(countRes[0].count) / pageSize)

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Customer Ledger
        </h1>
        <p className="text-muted-foreground">
          Statement of Account for {customer.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Billed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(totalBilled / 100).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
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
