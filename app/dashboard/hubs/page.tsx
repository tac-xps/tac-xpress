import { db } from "@/lib/db"
import { hubs } from "@/lib/db/schema"
import { desc, isNull } from "drizzle-orm"
import { AddHubDialog } from "./add-hub-dialog"
import { HubsClientTable } from "./hubs-client-table"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export const dynamic = "force-dynamic"

export default async function HubsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const rows = await db
    .select()
    .from(hubs)
    .where(isNull(hubs.deletedAt))
    .orderBy(desc(hubs.createdAt))
    .limit(DEFAULT_PAGE_SIZE + 1)
    .offset((page - 1) * DEFAULT_PAGE_SIZE)
  const hasNext = rows.length > DEFAULT_PAGE_SIZE
  const allHubs = rows.slice(0, DEFAULT_PAGE_SIZE)

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Transit Hubs</h1>
          <p className="text-muted-foreground">
            Manage your network of branches, warehouses, and transit centers.
          </p>
        </div>
        <AddHubDialog />
      </div>

      <HubsClientTable hubs={allHubs} />
      <PageNavigation
        page={page}
        hasNext={hasNext}
        pathname="/dashboard/hubs"
      />
    </div>
  )
}
