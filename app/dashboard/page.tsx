import Link from "next/link"
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { shipments, manifests, invoices, tickets } from "@/lib/db/schema"
import { sql, isNull } from "drizzle-orm"
import { getDashboardOverview } from "@/lib/dashboard-metrics"
import { PageHeader } from "@/components/operations/page-header"
import { OverviewMetrics } from "@/components/operations/overview-metrics"
import { VolumeChart } from "@/components/operations/volume-chart"
import { WorkQueue } from "@/components/operations/work-queue"
import { OpenManifests, HubActivity } from "@/components/operations/overview-records"
import { Button } from "@/components/ui/button"
import { getControlCenterSnapshot } from "@/lib/control-center"
import { ControlCenterActions, ControlCenterPanels } from "@/components/operations/control-center"
export default async function DashboardPage() {
  await requireStaffPage()
  const [overview, drafts, [pending], [draftCount], [overdue], [support], control] = await Promise.all([
    getDashboardOverview(),
    db.query.manifests.findMany({ where: (table, { eq }) => eq(table.status, "draft"), with: { driver: true, vehicle: true, originHub: true, destinationHub: true }, orderBy: (table, { desc }) => [desc(table.createdAt)], limit: 10 }),
    db.select({ count: sql<number>`count(*) filter (where ${shipments.status} = 'pending')` }).from(shipments).where(isNull(shipments.deletedAt)),
    db.select({ count: sql<number>`count(*) filter (where ${manifests.status} = 'draft')` }).from(manifests),
    db.select({ count: sql<number>`count(*) filter (where ${invoices.status} = 'unpaid' and ${invoices.dueDate} < now())` }).from(invoices),
    db.select({ count: sql<number>`count(*) filter (where ${tickets.status} in ('open', 'in_progress'))` }).from(tickets),
    getControlCenterSnapshot(),
  ])
  return <div className="flex min-w-0 flex-col gap-6">
    <PageHeader title="Operations overview" description="A clear view of the cargo, work queues and records behind each delivery."><Button asChild variant="outline"><Link href="/dashboard/dispatch">Open dispatch</Link></Button><Button asChild><Link href="/dashboard/shipments">Manage shipments</Link></Button></PageHeader>
    <ControlCenterActions />
    <OverviewMetrics stats={overview.stats} />
    <ControlCenterPanels snapshot={control} />
    <div className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]"><VolumeChart data={overview.salesData} /><WorkQueue counts={{ pending: Number(pending.count), drafts: Number(draftCount.count), overdue: Number(overdue.count), support: Number(support.count) }} /></div><div className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]"><OpenManifests data={drafts} /><HubActivity hubs={overview.hubsData} /></div>
  </div>
}

