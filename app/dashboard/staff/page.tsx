import { requireAdminPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, desc, ilike, isNull, or, inArray } from "drizzle-orm"
import { AddStaffDialog } from "./add-staff-dialog"
import { StaffClientTable } from "./staff-client-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"
import { containsPattern, firstParam, type RecordSearchParams } from "@/lib/table-query"
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
  const page = parsePage(params.page)
  const q = firstParam(params.q).trim().slice(0, 100)
  const pattern = containsPattern(q)

  const staffRows = await db.query.users.findMany({
    where: and(
      isNull(users.deletedAt),
      inArray(users.role, ["staff", "admin"]),
      q
        ? or(
            ilike(users.name, pattern),
            ilike(users.email, pattern),
            ilike(users.phone, pattern)
          )
        : undefined
    ),
    orderBy: [desc(users.role), desc(users.createdAt)],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })

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
          query={q}
          placeholder="Search by name, email, or phone..."
        />
        <StaffClientTable
          data={staffRows.slice(0, DEFAULT_PAGE_SIZE)}
          sort="role"
          order="asc"
        />
      </div>

      <PageNavigation
        page={page}
        hasNext={staffRows.length > DEFAULT_PAGE_SIZE}
        pathname="/dashboard/staff"
        query={{ q }}
      />
    </div>
  )
}
