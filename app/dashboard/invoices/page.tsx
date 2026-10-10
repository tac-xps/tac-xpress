import Link from "next/link"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { invoices, shipments, users } from "@/lib/db/schema"
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { InvoiceDataTable } from "./invoice-data-table"
import { formatInvoiceCurrency } from "./invoice-types"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { ExportPage } from "@/components/operations/export-page"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"
import { Wallet, CheckCircle2, AlertCircle } from "lucide-react"

const statuses = [
  { value: "unpaid", label: "Unpaid" },
  { value: "paid", label: "Paid" },
  { value: "void", label: "Void" },
  { value: "overdue", label: "Overdue" },
]

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  const session = await requireStaffPage()
  const params = await searchParams
  const query = parseRecordQuery(params, ["id", "createdAt", "status", "amount"])
  if (!statuses.some(({ value }) => value === query.status)) query.status = "all"
  const pattern = containsPattern(query.q)
  const sortColumns = { id: invoices.id, createdAt: invoices.createdAt, status: invoices.status, amount: invoices.amount }
  const [rows, countResult, [financials]] = await Promise.all([
    db.query.invoices.findMany({
      where: and(
        query.q
          ? or(
              sql`${invoices.id}::text ilike ${pattern}`,
              inArray(invoices.customerId, db.select({ id: users.id }).from(users).where(ilike(users.name, pattern))),
              inArray(invoices.shipmentId, db.select({ id: shipments.id }).from(shipments).where(or(ilike(shipments.awbNumber, pattern), ilike(shipments.consignorName, pattern))))
            )
          : undefined,
        query.status === "overdue"
          ? sql`${invoices.status} = 'unpaid' and ${invoices.dueDate} < now()`
          : query.status !== "all"
            ? eq(invoices.status, query.status as "unpaid" | "paid" | "void")
            : undefined
      ),
      with: { customer: true, shipment: true },
      orderBy: [recordOrder(sortColumns[query.sort as keyof typeof sortColumns], query.order), desc(invoices.id)],
      limit: query.pageSize,
      offset: (query.page - 1) * query.pageSize,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(invoices)
      .where(
        and(
          query.q
            ? or(
                sql`${invoices.id}::text ilike ${pattern}`,
                inArray(invoices.customerId, db.select({ id: users.id }).from(users).where(ilike(users.name, pattern))),
                inArray(invoices.shipmentId, db.select({ id: shipments.id }).from(shipments).where(or(ilike(shipments.awbNumber, pattern), ilike(shipments.consignorName, pattern))))
              )
            : undefined,
          query.status === "overdue"
            ? sql`${invoices.status} = 'unpaid' and ${invoices.dueDate} < now()`
            : query.status !== "all"
              ? eq(invoices.status, query.status as "unpaid" | "paid" | "void")
              : undefined
        )
      ),
    db
      .select({
        outstanding: sql<number>`coalesce(sum(case when ${invoices.status} = 'unpaid' then coalesce(${invoices.balanceDue}, ${invoices.amount}) else 0 end), 0)`,
        paidTotal: sql<number>`coalesce(sum(case when ${invoices.status} = 'paid' then ${invoices.amount} else 0 end), 0)`,
        overdue: sql<number>`count(*) filter (where ${invoices.status} = 'unpaid' and ${invoices.dueDate} < now())`,
      })
      .from(invoices),
  ])
  const totalCount = Number(countResult[0].count)
  const pageCount = Math.ceil(totalCount / query.pageSize)
  const data = rows

  const overdueCount = Number(financials.overdue)
  const metrics = [
    {
      label: "Outstanding balance",
      value: formatInvoiceCurrency(Number(financials.outstanding)),
      description: "Unpaid customer receivables",
      icon: Wallet,
      highlight: false,
    },
    {
      label: "Paid invoices · all time",
      value: formatInvoiceCurrency(Number(financials.paidTotal)),
      description: "Successfully settled accounts",
      icon: CheckCircle2,
      highlight: false,
    },
    {
      label: "Overdue invoices",
      value: overdueCount.toLocaleString("en-IN"),
      description: overdueCount > 0 ? "Action required — past due date" : "All accounts within terms",
      icon: AlertCircle,
      highlight: overdueCount > 0,
    },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Invoices"
        description="Review billing records, payment status and outstanding balances. Totals cover all invoices."
      >
        <ExportPage
          filename={`invoices-page-${query.page}`}
          rows={[
            ["Invoice ID", "Customer", "Status", "Amount INR", "Balance INR"],
            ...data.map((row) => [
              row.id,
              row.customer?.name ?? row.shipment?.consignorName ?? "",
              row.status,
              row.amount / 100,
              (row.balanceDue ?? row.amount) / 100,
            ]),
          ]}
        />
        <Button asChild>
          <Link href="/dashboard/invoices/create">Create invoice</Link>
        </Button>
      </PageHeader>

      <section
        aria-label="Financial summary"
        className="overflow-hidden rounded-none border border-border/80 bg-card shadow-xs transition-shadow duration-200 hover:shadow-sm"
      >
        <div className="flex items-center justify-between border-b border-border/80 bg-muted/30 px-5 py-2.5 text-xs text-muted-foreground">
          <span>Financial summary · aggregate invoice balances</span>
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground/70">
            <span className="size-1.5 rounded-none bg-status-delivered animate-pulse" />
            Live
          </span>
        </div>
        <dl className="grid grid-cols-1 divide-y divide-border/60 p-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {metrics.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                className="flex flex-col justify-between py-4 sm:py-0 sm:px-6 sm:first:pl-0 sm:last:pr-0"
              >
                <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <Icon
                    className={`size-3.5 ${item.highlight ? "text-destructive" : "text-muted-foreground/80"}`}
                  />
                  <span>{item.label}</span>
                </dt>
                <dd className="mt-3">
                  <span
                    className={`font-metric-xl ${
                      item.highlight ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    {item.value}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
                </dd>
              </div>
            )
          })}
        </dl>
      </section>

      <section aria-label="Invoice records" className="min-w-0 overflow-hidden rounded-none border bg-card">
        <TableToolbar
          pathname="/dashboard/invoices"
          query={query.q}
          status={query.status}
          statuses={statuses}
          sort={query.sort}
          order={query.order}
          placeholder="Invoice ID, customer or AWB"
        />
        <InvoiceDataTable canVoid={session.user.role === "admin"} data={data} pageCount={pageCount} />
      </section>
    </div>
  )
}

