import Link from "next/link"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { invoices, shipments, users } from "@/lib/db/schema"
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { InvoiceDataTable } from "./invoice-data-table"
import { formatInvoiceCurrency } from "./invoice-types"
import { DEFAULT_PAGE_SIZE, PageNavigation, parsePage } from "@/components/ui/page-navigation"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { ExportPage } from "@/components/operations/export-page"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"
const statuses = [{ value: "unpaid", label: "Unpaid" }, { value: "paid", label: "Paid" }, { value: "void", label: "Void" }, { value: "overdue", label: "Overdue" }]
export default async function InvoicesPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  const session = await requireStaffPage()
  const params = await searchParams
  const page = parsePage(params.page)
  const query = parseRecordQuery(params, ["id", "createdAt", "status", "amount"])
  if (!statuses.some(({ value }) => value === query.status)) query.status = "all"
  const pattern = containsPattern(query.q)
  const sortColumns = { id: invoices.id, createdAt: invoices.createdAt, status: invoices.status, amount: invoices.amount }
  const [rows, [financials]] = await Promise.all([
    db.query.invoices.findMany({
      where: and(query.q ? or(sql`${invoices.id}::text ilike ${pattern}`, inArray(invoices.customerId, db.select({ id: users.id }).from(users).where(ilike(users.name, pattern))), inArray(invoices.shipmentId, db.select({ id: shipments.id }).from(shipments).where(or(ilike(shipments.awbNumber, pattern), ilike(shipments.consignorName, pattern))))) : undefined,
        query.status === "overdue" ? sql`${invoices.status} = 'unpaid' and ${invoices.dueDate} < now()` : query.status !== "all" ? eq(invoices.status, query.status as "unpaid" | "paid" | "void") : undefined),
      with: { customer: true, shipment: true }, orderBy: [recordOrder(sortColumns[query.sort as keyof typeof sortColumns], query.order), desc(invoices.id)], limit: DEFAULT_PAGE_SIZE + 1, offset: (page - 1) * DEFAULT_PAGE_SIZE,
    }),
    db.select({ outstanding: sql<number>`coalesce(sum(case when ${invoices.status} = 'unpaid' then coalesce(${invoices.balanceDue}, ${invoices.amount}) else 0 end), 0)`, paidTotal: sql<number>`coalesce(sum(case when ${invoices.status} = 'paid' then ${invoices.amount} else 0 end), 0)`, overdue: sql<number>`count(*) filter (where ${invoices.status} = 'unpaid' and ${invoices.dueDate} < now())` }).from(invoices),
  ])
  const data = rows.slice(0, DEFAULT_PAGE_SIZE)
  const totals = [["Outstanding balance", formatInvoiceCurrency(Number(financials.outstanding))], ["Paid invoices · all time", formatInvoiceCurrency(Number(financials.paidTotal))], ["Overdue invoices", Number(financials.overdue).toLocaleString("en-IN")]]
  return <div className="flex min-w-0 flex-col gap-6"><PageHeader title="Invoices" description="Review billing records, payment status and outstanding balances. Totals cover all invoices."><ExportPage filename={`invoices-page-${page}`} rows={[["Invoice ID", "Customer", "Status", "Amount INR", "Balance INR"], ...data.map((row) => [row.id, row.customer?.name ?? row.shipment?.consignorName ?? "", row.status, row.amount / 100, (row.balanceDue ?? row.amount) / 100])]} /><Button asChild><Link href="/dashboard/invoices/create">Create invoice</Link></Button></PageHeader>
    <dl className="grid gap-6 rounded-none border bg-card p-5 sm:grid-cols-3">{totals.map(([label, value]) => <div key={label}><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-3 text-2xl font-medium tabular-nums">{value}</dd></div>)}</dl>
    <section aria-label="Invoice records" className="min-w-0 overflow-hidden rounded-none border bg-card"><TableToolbar pathname="/dashboard/invoices" query={query.q} status={query.status} statuses={statuses} sort={query.sort} order={query.order} placeholder="Invoice ID, customer or AWB" /><InvoiceDataTable canVoid={session.user.role === "admin"} data={data} sort={query.sort} order={query.order} /><PageNavigation page={page} hasNext={rows.length > DEFAULT_PAGE_SIZE} pathname="/dashboard/invoices" query={query} /></section>
  </div>
}

