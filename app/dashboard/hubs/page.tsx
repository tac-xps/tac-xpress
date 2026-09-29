import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { hubs } from "@/lib/db/schema"
import { and, desc, ilike, isNull, or, sql } from "drizzle-orm"
import { AddHubDialog } from "./add-hub-dialog"
import { HubsClientTable } from "./hubs-client-table"
import { PageHeader } from "@/components/operations/page-header"
import { TableToolbar } from "@/components/operations/table-toolbar"
import {
  DEFAULT_PAGE_SIZE,
  parsePage,
} from "@/components/ui/page-navigation"
import {
  containsPattern,
  parseRecordQuery,
  recordOrder,
  type RecordSearchParams,
} from "@/lib/table-query"
export default async function HubsPage({
  searchParams,
}: {
  searchParams: Promise<RecordSearchParams>
}) {
  await requireStaffPage()
  const params = await searchParams
  const query = parseRecordQuery(params, ["createdAt", "name", "location"])
  const pattern = containsPattern(query.q)
  const columns = {
    createdAt: hubs.createdAt,
    name: hubs.name,
    location: hubs.location,
  }
  const rows = await db
    .select()
    .from(hubs)
    .where(
      and(
        isNull(hubs.deletedAt),
        query.q
          ? or(
              ilike(hubs.name, pattern),
              ilike(hubs.location, pattern),
              ilike(hubs.contact, pattern)
            )
          : undefined
      )
    )
    .orderBy(
      recordOrder(columns[query.sort as keyof typeof columns], query.order),
      desc(hubs.id)
    )
    .limit(query.pageSize)
    .offset((query.page - 1) * query.pageSize)

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(hubs)
    .where(
      and(
        isNull(hubs.deletedAt),
        query.q
          ? or(
              ilike(hubs.name, pattern),
              ilike(hubs.location, pattern),
              ilike(hubs.contact, pattern)
            )
          : undefined
      )
    )
  const totalCount = Number(countResult[0].count)
  const pageCount = Math.ceil(totalCount / query.pageSize)
  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Hubs & branches"
        description="Maintain the locations and contacts used for routing and manifest assignments."
      >
        <AddHubDialog />
      </PageHeader>
      <section
        aria-label="Network locations"
        className="min-w-0 overflow-hidden rounded-none border bg-card"
      >
        <TableToolbar
          pathname="/dashboard/hubs"
          query={query.q}
          sort={query.sort}
          order={query.order}
          placeholder="Hub, location or contact"
        />
        <HubsClientTable
          hubs={rows}
          pageCount={pageCount}
        />
      </section>
    </div>
  )
}
