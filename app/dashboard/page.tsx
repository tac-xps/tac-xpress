import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Dashboard Overview | TAC-XPRESS",
  description: "Operations overview, real-time metrics, cargo volume, and hub activity.",
}
import { requireStaffPage } from "@/lib/auth/page-access"
import { db } from "@/lib/db"
import { shipments, manifests, invoices, tickets } from "@/lib/db/schema"
import { sql, isNull } from "drizzle-orm"
import { getDashboardOverview } from "@/lib/dashboard-metrics"
import { PageHeader } from "@/components/operations/page-header"
import { OverviewMetrics } from "@/components/operations/overview-metrics"
import { VolumeChart } from "@/components/operations/volume-chart"
import { ChartBarInteractive } from "@/components/operations/chart-bar-interactive"
import { WorkQueue } from "@/components/operations/work-queue"
import { OpenManifests, HubActivity } from "@/components/operations/overview-records"
import { Button } from "@/components/ui/button"
import { getControlCenterSnapshot } from "@/lib/control-center"
import { ControlCenterActions, ControlCenterPanels } from "@/components/operations/control-center"
import { Skeleton } from "@/components/ui/skeleton"

import { unstable_cache } from "next/cache"

// ─── Cached query fetchers (30s revalidation, instant subsequent loads) ───────

const getWorkQueueCounts = unstable_cache(
  async () => {
    const [pending, draftCount, overdue, support] = await Promise.all([
      db
        .select({ count: sql<number>`count(*) filter (where ${shipments.status} = 'pending')` })
        .from(shipments)
        .where(isNull(shipments.deletedAt))
        .then((r) => r[0]?.count ?? 0),
      db
        .select({ count: sql<number>`count(*) filter (where ${manifests.status} = 'draft')` })
        .from(manifests)
        .then((r) => r[0]?.count ?? 0),
      db
        .select({
          count: sql<number>`count(*) filter (where ${invoices.status} = 'unpaid' and ${invoices.dueDate} < now())`,
        })
        .from(invoices)
        .then((r) => r[0]?.count ?? 0),
      db
        .select({
          count: sql<number>`count(*) filter (where ${tickets.status} in ('open', 'in_progress'))`,
        })
        .from(tickets)
        .then((r) => r[0]?.count ?? 0),
    ])
    return {
      pending: Number(pending),
      drafts: Number(draftCount),
      overdue: Number(overdue),
      support: Number(support),
    }
  },
  ["dashboard-work-queue-counts"],
  { revalidate: 30, tags: ["dashboard-metrics", "work-queue"] }
)

const getOpenDraftManifests = unstable_cache(
  async () => {
    // Two lean queries instead of one massive lateral join that times out.
    // Query 1: manifests with only the columns the table + dialog header need.
    const rawManifests = await db.query.manifests.findMany({
      where: (table, { eq }) => eq(table.status, "draft"),
      columns: {
        id: true,
        referenceId: true,
        status: true,
        createdAt: true,
        driverId: true,
        vehicleId: true,
        originHubId: true,
        destinationHubId: true,
      },
      with: {
        driver: {
          columns: { id: true, name: true, phone: true },
        },
        vehicle: {
          columns: { registrationNumber: true },
        },
        originHub: {
          columns: { name: true },
        },
        destinationHub: {
          columns: { name: true },
        },
      },
      orderBy: (table, { desc }) => [desc(table.createdAt)],
      limit: 10,
    })

    // Query 2: items for those manifests with only the 7 shipment fields the dialog renders.
    const manifestIds = rawManifests.map((m) => m.id)
    const rawItems =
      manifestIds.length > 0
        ? await db.query.manifestItems.findMany({
            where: (table, { inArray }) => inArray(table.manifestId, manifestIds),
            columns: { id: true, manifestId: true },
            with: {
              shipment: {
                columns: {
                  id: true,
                  awbNumber: true,
                  origin: true,
                  destination: true,
                  weightKg: true,
                  status: true,
                  consigneeName: true,
                },
              },
            },
          })
        : []

    // Group items by manifestId for O(1) lookup
    const itemsByManifest = new Map<string, typeof rawItems>()
    for (const item of rawItems) {
      const list = itemsByManifest.get(item.manifestId) ?? []
      list.push(item)
      itemsByManifest.set(item.manifestId, list)
    }

    return rawManifests.map((m) => ({
      ...m,
      items: itemsByManifest.get(m.id) ?? [],
    }))
  },
  ["dashboard-open-draft-manifests"],
  { revalidate: 30, tags: ["dashboard-metrics", "manifests-drafts"] }
)

// ─── Async RSC sections (each streams independently) ──────────────────────────

async function OverviewSection({
  workQueueSlot,
}: {
  workQueueSlot: React.ReactNode
}) {
  let overview: Awaited<ReturnType<typeof getDashboardOverview>> | null = null
  try {
    overview = await getDashboardOverview()
  } catch (error) {
    console.error("[OverviewSection] Failed to load dashboard metrics:", error)
    return null
  }

  if (!overview) return null

  return (
    <>
      <OverviewMetrics stats={overview.stats} />
      <div className="grid min-w-0 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <VolumeChart data={overview.salesData} />
        {workQueueSlot}
      </div>
      <ChartBarInteractive data={overview.salesData} />
      <Suspense fallback={<Skeleton className="h-72 rounded-lg" />}>
        <HubActivitySection hubsData={overview.hubsData} />
      </Suspense>
    </>
  )
}

async function HubActivitySection({
  hubsData,
}: {
  hubsData: Awaited<ReturnType<typeof getDashboardOverview>>["hubsData"]
}) {
  return <HubActivity hubs={hubsData} />
}

async function WorkQueueSection() {
  let counts = { pending: 0, drafts: 0, overdue: 0, support: 0 }
  try {
    counts = await getWorkQueueCounts()
  } catch (error) {
    console.error("[WorkQueueSection] Failed to load work queue:", error)
  }

  return <WorkQueue counts={counts} />
}

async function OpenManifestsSection() {
  let drafts: Array<{
    id: string
    referenceId: string
    status: "draft" | "finalized"
    createdAt?: Date
    driverId?: string | null
    vehicleId?: string | null
    originHubId?: string | null
    destinationHubId?: string | null
    driver: { id?: string; name: string | null; phone?: string | null } | null
    vehicle: { registrationNumber: string | null } | null
    originHub: { name: string } | null
    destinationHub: { name: string } | null
    items?: any[]
  }> = []
  try {
    drafts = await getOpenDraftManifests()
  } catch (error) {
    console.error("[OpenManifestsSection] Failed to load manifests:", error)
    drafts = []
  }

  return <OpenManifests data={drafts} />
}

async function ControlCenterSection() {
  let control = null
  try {
    control = await getControlCenterSnapshot()
  } catch (error) {
    console.error("[ControlCenterSection] Failed to load control center snapshot:", error)
    return null
  }

  if (!control) return null

  return <ControlCenterPanels snapshot={control} />
}

// ─── Skeleton fallbacks ───────────────────────────────────────────────────────

function OverviewSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Skeleton className="h-64 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}

function ControlCenterSkeleton() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-lg" />
      ))}
    </div>
  )
}

function ManifestsSkeleton() {
  return <Skeleton className="h-72 w-full rounded-lg" />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  // Auth guard: verifies staff session before rendering page shell
  await requireStaffPage()

  return (
    <div className="flex min-w-0 flex-col gap-6 md:gap-8">
      <PageHeader
        title="Operations overview"
        description="A clear view of the cargo, work queues and records behind each delivery."
      >
        <Button asChild variant="outline">
          <Link href="/dashboard/dispatch">Open dispatch</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/shipments">Manage shipments</Link>
        </Button>
      </PageHeader>

      {/* Operations banner */}
      <div className="w-full overflow-hidden rounded-lg border border-border/80 shadow-xs aspect-[4/1] max-h-56">
        <Image
          src="/images/dashboard/banner_dashboard.png"
          alt="TAC-XPRESS operations dashboard banner"
          width={1536}
          height={384}
          priority
          className="w-full h-full object-cover"
        />
      </div>

      {/* Quick actions bar */}
      <ControlCenterActions />

      {/* Overview metrics, volume chart, and work queue */}
      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewSection
          workQueueSlot={
            <Suspense fallback={<Skeleton className="h-64 rounded-lg" />}>
              <WorkQueueSection />
            </Suspense>
          }
        />
      </Suspense>

      {/* Control center stream */}
      <Suspense fallback={<ControlCenterSkeleton />}>
        <ControlCenterSection />
      </Suspense>

      {/* Open manifests stream */}
      <Suspense fallback={<ManifestsSkeleton />}>
        <OpenManifestsSection />
      </Suspense>
    </div>
  )
}
