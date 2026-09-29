import { requireAdminPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, desc, ilike, isNull, or, inArray, sql } from "drizzle-orm"
import { AddStaffDialog } from "./add-staff-dialog"
import { StaffClientTable } from "./staff-client-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import {
  containsPattern,
  parseRecordQuery,
  recordOrder,
  type RecordSearchParams,
} from "@/lib/table-query"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Staff & Administrators",
}

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireAdminPage()

  const params = await searchParams
  const query = parseRecordQuery(
    params,
    ["name", "email", "role", "createdAt"] as const,
    "role"
  )
  const pattern = containsPattern(query.q)

  const sortColumns = {
    name: users.name,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt,
  }
  const sortColumn = sortColumns[query.sort as keyof typeof sortColumns] ?? users.role

  const staffRows = await db.query.users.findMany({
    where: and(
      isNull(users.deletedAt),
      inArray(users.role, ["staff", "admin"]),
      query.q
        ? or(
            ilike(users.name, pattern),
            ilike(users.email, pattern),
            ilike(users.phone, pattern)
          )
        : undefined
    ),
    orderBy: [recordOrder(sortColumn, query.order), desc(users.createdAt)],
    limit: query.pageSize,
    offset: (query.page - 1) * query.pageSize,
  })

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(users)
    .where(
      and(
        isNull(users.deletedAt),
        inArray(users.role, ["staff", "admin"]),
        query.q
          ? or(
              ilike(users.name, pattern),
              ilike(users.email, pattern),
              ilike(users.phone, pattern)
            )
          : undefined
      )
    )
  const totalCount = Number(countResult[0].count)
  const pageCount = Math.ceil(totalCount / query.pageSize)

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Staff & Administrators"
        description="Manage workspace access for staff members and system administrators."
      >
        <AddStaffDialog />
      </PageHeader>
      
      <div className="rounded-none border bg-card">
        <TableToolbar
          pathname="/dashboard/staff"
          query={query.q}
          sort={query.sort}
          order={query.order}
          placeholder="Search by name, email, or phone..."
        />
        <StaffClientTable
          data={staffRows}
          pageCount={pageCount}
        />
      </div>
    </div>
  )
}
