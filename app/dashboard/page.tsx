import Link from "next/link"
import { and, isNull, ne } from "drizzle-orm"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { shipments, manifests } from "@/lib/db/schema"
import { getDashboardOverview } from "@/lib/dashboard-metrics"
import { StatisticsBlock } from "@/components/shadcn-space/blocks/dashboard-shell-01/statistics"
import { SalesOverviewChart } from "@/components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart"
import { EarningReportChart } from "@/components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart"
import { ActiveDispatchTable } from "@/components/shadcn-space/blocks/dashboard-shell-01/active-dispatch-table"
import { HubVolumeWidget } from "@/components/shadcn-space/blocks/dashboard-shell-01/hub-volume-widget"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { DashboardIcon } from "@/components/icons/sidebar-icons"
import { TypographyH2, TypographyMuted } from "@/components/ui/typography"

export default async function DashboardPage() {
  const [session, overview, activeShipments] = await Promise.all([
    auth(),
    getDashboardOverview(),
    db.query.manifests.findMany({
      where: (manifests, { and, ne }) => and(ne(manifests.status, "finalized")),
      with: {
        driver: true,
        vehicle: true,
        originHub: true,
        destinationHub: true,
      },
      orderBy: (manifests, { desc }) => [desc(manifests.createdAt)],
      limit: 10,
    }),
  ])

  const displayName = session?.user?.name || "there"

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/15 p-3 shadow-sm ring-1 ring-primary/20">
            <DashboardIcon className="size-8 text-primary" />
          </div>
          <div className="space-y-1">
            <TypographyH2 className="mt-0 border-none pb-0 text-3xl">
              Welcome back, {displayName}.
            </TypographyH2>
            <TypographyMuted>
              Here is what&apos;s happening in your logistics network today.
            </TypographyMuted>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            asChild
            className="bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30"
          >
            <Link href="/dashboard/dispatch">
              <Plus className="mr-2 size-4" />
              New Dispatch
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 transition-shadow duration-300 hover:shadow-md">
          <StatisticsBlock stats={overview.stats} />
        </div>
        <div className="col-span-12 transition-shadow duration-300 hover:shadow-md xl:col-span-8">
          <SalesOverviewChart data={overview.salesData} />
        </div>
        <div className="col-span-12 transition-shadow duration-300 hover:shadow-md xl:col-span-4">
          <EarningReportChart summary={overview.operationsSummary} />
        </div>
        <div className="col-span-12 transition-shadow duration-300 hover:shadow-md xl:col-span-8">
          <ActiveDispatchTable data={activeShipments} />
        </div>
        <div className="col-span-12 transition-shadow duration-300 hover:shadow-md xl:col-span-4">
          <HubVolumeWidget hubs={overview.hubsData} />
        </div>
      </div>
    </div>
  )
}
