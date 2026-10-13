import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { AddCustomerDialog } from "./add-customer-dialog"
import { CustomerDataTable } from "./customer-data-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { ExportPage } from "@/components/operations/export-page"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"

export const metadata: Metadata = {
  title: "Customers | TAC-XPRESS",
  description: "Customer accounts, profiles, ledger history, and contact directory.",
}

export default async function CustomersPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  await requireStaffPage()
  const params = await searchParams
  const query = parseRecordQuery(params, ["name", "email", "city", "createdAt"])
  const pattern = containsPattern(query.q)
  const sortColumns = { name: users.name, email: users.email, city: users.city, createdAt: users.createdAt }
  const whereClause = and(
    eq(users.role, "customer"),
    isNull(users.deletedAt),
    query.q
      ? or(
          ilike(users.name, pattern),
          ilike(users.email, pattern),
          ilike(users.phone, pattern),
          ilike(users.city, pattern)
        )
      : undefined
  )

  const [rows, countResult] = await Promise.all([
    db
      .select()
      .from(users)
      .where(whereClause)
      .orderBy(recordOrder(sortColumns[query.sort as keyof typeof sortColumns], query.order), desc(users.id))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize),
    db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(whereClause),
  ])

  const totalCount = Number(countResult[0]?.count ?? 0)
  const pageCount = Math.ceil(totalCount / query.pageSize)
  const data = rows

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Customers"
        description="Maintain shipment contacts and billing records. Customer records do not grant workspace access."
      >
        <ExportPage
          filename={`customers-page-${query.page}`}
          rows={[["Name", "Email", "Phone", "City", "State"], ...data.map((row) => [row.name, row.email, row.phone, row.city, row.state])]}
        />
        <AddCustomerDialog />
      </PageHeader>
      <section aria-label="Customer records" className="min-w-0 overflow-hidden rounded-none border bg-card">
        <TableToolbar pathname="/dashboard/customers" query={query.q} sort={query.sort} order={query.order} placeholder="Name, email, phone or city" />
        <CustomerDataTable data={data} pageCount={pageCount} />
      </section>
    </div>
  )
}
