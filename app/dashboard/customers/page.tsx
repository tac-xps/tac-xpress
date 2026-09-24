import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm"
import { AddCustomerDialog } from "./add-customer-dialog"
import { CustomerDataTable } from "./customer-data-table"
import { DEFAULT_PAGE_SIZE, parsePage } from "@/components/ui/page-navigation"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import { ExportPage } from "@/components/operations/export-page"
import { containsPattern, parseRecordQuery, recordOrder, type RecordSearchParams } from "@/lib/table-query"
export default async function CustomersPage({ searchParams }: { searchParams: Promise<RecordSearchParams> }) {
  await requireStaffPage()
  const params = await searchParams
  const page = parsePage(params.page)
  const query = parseRecordQuery(params, ["name", "email", "city", "createdAt"])
  const pattern = containsPattern(query.q)
  const sortColumns = { name: users.name, email: users.email, city: users.city, createdAt: users.createdAt }
  const rows = await db.select().from(users).where(and(eq(users.role, "customer"), isNull(users.deletedAt), query.q ? or(ilike(users.name, pattern), ilike(users.email, pattern), ilike(users.phone, pattern), ilike(users.city, pattern)) : undefined)).orderBy(recordOrder(sortColumns[query.sort as keyof typeof sortColumns], query.order), desc(users.id)).limit(DEFAULT_PAGE_SIZE).offset((page - 1) * DEFAULT_PAGE_SIZE)
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(users).where(and(eq(users.role, "customer"), isNull(users.deletedAt), query.q ? or(ilike(users.name, pattern), ilike(users.email, pattern), ilike(users.phone, pattern), ilike(users.city, pattern)) : undefined))
  const totalCount = Number(countResult[0].count)
  const pageCount = Math.ceil(totalCount / DEFAULT_PAGE_SIZE)
  const data = rows
  return <div className="flex min-w-0 flex-col gap-6"><PageHeader title="Customers" description="Maintain shipment contacts and billing records. Customer records do not grant workspace access."><ExportPage filename={`customers-page-${page}`} rows={[["Name", "Email", "Phone", "City", "State"], ...data.map((row) => [row.name, row.email, row.phone, row.city, row.state])]} /><AddCustomerDialog /></PageHeader><section aria-label="Customer records" className="min-w-0 overflow-hidden rounded-none border bg-card"><TableToolbar pathname="/dashboard/customers" query={query.q} sort={query.sort} order={query.order} placeholder="Name, email, phone or city" /><CustomerDataTable data={data} pageCount={pageCount} /></section></div>
}

