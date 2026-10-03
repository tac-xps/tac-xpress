import {
  eachDayOfInterval,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns"
import { isNull, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import {
  hubs,
  invoices,
  manifestItems,
  manifests,
  shipments,
  users,
  vehicles,
} from "@/lib/db/schema"

export type TrendValue = number | null

export type DashboardStats = {
  totalDispatches: number
  airCargo: number
  surfaceCargo: number
  pickDrop: number
  trends: {
    dispatches: TrendValue
    air: TrendValue
    surface: TrendValue
    pick: TrendValue
  }
}

export type ShipmentVolumePoint = {
  date: string
  airCargo: number
  surfaceCargo: number
}

export type HubVolumePoint = {
  id: string
  name: string
  location: string
  totalShipments: number
  totalShipmentsLabel: string
  trend: TrendValue
}

export type HubOperationsSummary = {
  hasLiveData: boolean
  title: string
  description: string
}

export type AnalyticsOverview = {
  networkVolume: number
  networkVolumeTrend: TrendValue
  fleetEfficiency: number | null
  fleetEfficiencyTrend: TrendValue
  onTimePerformance: number | null
  onTimePerformanceTrend: TrendValue
  fleetAvailability: {
    managedTotal: number
    managedOperational: number
    registryTotal: number
    registryOperational: number
    data: Array<{
      label: string
      managed: number
      registry: number
    }>
  }
  shipmentVolumeByMonth: Array<{
    month: string
    air: number
    road: number
  }>
  revenueByMonth: Array<{ month: string; amountPaise: number }>
  customerGrowthByMonth: Array<{ month: string; customers: number }>
  topRoutes: Array<{ route: string; volume: number }>
  // NEW
  dailyVolume: Array<{ date: string; air: number; surface: number }>
  statusBreakdown: {
    delivered: number
    inTransit: number
    pending: number
    atRisk: number
  }
  period: AnalyticsPeriod
}

export type AnalyticsPeriod = "7d" | "30d" | "90d" | "month" | "lastmonth" | "all"

export function parseAnalyticsPeriod(raw: string | undefined): AnalyticsPeriod {
  const valid: AnalyticsPeriod[] = ["7d", "30d", "90d", "month", "lastmonth", "all"]
  return valid.includes(raw as AnalyticsPeriod) ? (raw as AnalyticsPeriod) : "30d"
}

function buildPeriodWindow(period: AnalyticsPeriod, now: Date): { start: Date | null; end: Date } {
  const end = now
  if (period === "all") return { start: null, end }
  if (period === "7d") return { start: startOfDay(subDays(now, 6)), end }
  if (period === "30d") return { start: startOfDay(subDays(now, 29)), end }
  if (period === "90d") return { start: startOfDay(subDays(now, 89)), end }
  if (period === "month") return { start: startOfMonth(now), end }
  // lastmonth
  const lastMonthStart = startOfMonth(subMonths(now, 1))
  const lastMonthEnd = startOfMonth(now)
  return { start: lastMonthStart, end: lastMonthEnd }
}

function toNumber(value: unknown) {
  return Number(value ?? 0)
}

function toTrend(current: number, previous: number): TrendValue {
  if (current === 0 && previous === 0) {
    return null
  }

  if (previous <= 0) {
    return null
  }

  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function toRate(numerator: number, denominator: number) {
  if (denominator <= 0) {
    return null
  }

  return Number(((numerator / denominator) * 100).toFixed(1))
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value)
}

export async function getDashboardOverview() {
  const now = new Date()
  const currentMonthStart = startOfMonth(now)
  const previousMonthStart = startOfMonth(subMonths(now, 1))
  const chartStart = startOfDay(subDays(now, 89))

  const currentMonthStartIso = currentMonthStart.toISOString()
  const previousMonthStartIso = previousMonthStart.toISOString()
  const chartStartIso = chartStart.toISOString()

  const bookingDay = sql<string>`to_char(${shipments.bookingDate}, 'YYYY-MM-DD')`

  const [shipmentSummaryRows, dispatchSummaryRows, chartRows, hubRows] =
    await Promise.all([
      db
        .select({
          total: sql<number>`count(*)`,
          airCargo: sql<number>`coalesce(sum(case when ${shipments.serviceType} = 'express_air' then 1 else 0 end), 0)`,
          surfaceCargo: sql<number>`coalesce(sum(case when ${shipments.serviceType} in ('standard_ocean', 'road_freight') then 1 else 0 end), 0)`,
          currentTotal: sql<number>`coalesce(sum(case when ${shipments.bookingDate} >= ${currentMonthStartIso} then 1 else 0 end), 0)`,
          previousTotal: sql<number>`coalesce(sum(case when ${shipments.bookingDate} >= ${previousMonthStartIso} and ${shipments.bookingDate} < ${currentMonthStartIso} then 1 else 0 end), 0)`,
          currentAir: sql<number>`coalesce(sum(case when ${shipments.bookingDate} >= ${currentMonthStartIso} and ${shipments.serviceType} = 'express_air' then 1 else 0 end), 0)`,
          previousAir: sql<number>`coalesce(sum(case when ${shipments.bookingDate} >= ${previousMonthStartIso} and ${shipments.bookingDate} < ${currentMonthStartIso} and ${shipments.serviceType} = 'express_air' then 1 else 0 end), 0)`,
          currentSurface: sql<number>`coalesce(sum(case when ${shipments.bookingDate} >= ${currentMonthStartIso} and ${shipments.serviceType} in ('standard_ocean', 'road_freight') then 1 else 0 end), 0)`,
          previousSurface: sql<number>`coalesce(sum(case when ${shipments.bookingDate} >= ${previousMonthStartIso} and ${shipments.bookingDate} < ${currentMonthStartIso} and ${shipments.serviceType} in ('standard_ocean', 'road_freight') then 1 else 0 end), 0)`,
        })
        .from(shipments)
        .where(isNull(shipments.deletedAt)),
      db
        .select({
          total: sql<number>`count(*)`,
          currentTotal: sql<number>`coalesce(sum(case when ${manifests.createdAt} >= ${currentMonthStartIso} then 1 else 0 end), 0)`,
          previousTotal: sql<number>`coalesce(sum(case when ${manifests.createdAt} >= ${previousMonthStartIso} and ${manifests.createdAt} < ${currentMonthStartIso} then 1 else 0 end), 0)`,
        })
        .from(manifests)
        .where(
          sql`${manifests.referenceId} like 'PU-%' or ${manifests.referenceId} like 'DL-%'`
        ),
      db
        .select({
          date: bookingDay,
          airCargo: sql<number>`coalesce(sum(case when ${shipments.serviceType} = 'express_air' then 1 else 0 end), 0)`,
          surfaceCargo: sql<number>`coalesce(sum(case when ${shipments.serviceType} in ('standard_ocean', 'road_freight') then 1 else 0 end), 0)`,
        })
        .from(shipments)
        .where(
          sql`${shipments.deletedAt} is null and ${shipments.bookingDate} >= ${chartStartIso}`
        )
        .groupBy(bookingDay)
        .orderBy(bookingDay),
      db
        .select({
          id: hubs.id,
          name: hubs.name,
          location: hubs.location,
          totalShipments: sql<number>`count(${manifestItems.id})`,
          currentShipments: sql<number>`coalesce(sum(case when ${manifests.createdAt} >= ${currentMonthStartIso} and ${manifestItems.id} is not null then 1 else 0 end), 0)`,
          previousShipments: sql<number>`coalesce(sum(case when ${manifests.createdAt} >= ${previousMonthStartIso} and ${manifests.createdAt} < ${currentMonthStartIso} and ${manifestItems.id} is not null then 1 else 0 end), 0)`,
        })
        .from(hubs)
        .leftJoin(manifests, sql`${manifests.originHubId} = ${hubs.id}`)
        .leftJoin(
          manifestItems,
          sql`${manifestItems.manifestId} = ${manifests.id}`
        )
        .where(isNull(hubs.deletedAt))
        .groupBy(hubs.id, hubs.name, hubs.location)
        .orderBy(sql`count(${manifestItems.id}) desc, ${hubs.name} asc`)
        .limit(4),
    ])

  const shipmentSummary = shipmentSummaryRows[0]
  const dispatchSummary = dispatchSummaryRows[0]

  const stats: DashboardStats = {
    totalDispatches: toNumber(shipmentSummary?.total),
    airCargo: toNumber(shipmentSummary?.airCargo),
    surfaceCargo: toNumber(shipmentSummary?.surfaceCargo),
    pickDrop: toNumber(dispatchSummary?.total),
    trends: {
      dispatches: toTrend(
        toNumber(shipmentSummary?.currentTotal),
        toNumber(shipmentSummary?.previousTotal)
      ),
      air: toTrend(
        toNumber(shipmentSummary?.currentAir),
        toNumber(shipmentSummary?.previousAir)
      ),
      surface: toTrend(
        toNumber(shipmentSummary?.currentSurface),
        toNumber(shipmentSummary?.previousSurface)
      ),
      pick: toTrend(
        toNumber(dispatchSummary?.currentTotal),
        toNumber(dispatchSummary?.previousTotal)
      ),
    },
  }

  const chartByDay = new Map(
    chartRows.map((row) => [
      row.date,
      {
        airCargo: toNumber(row.airCargo),
        surfaceCargo: toNumber(row.surfaceCargo),
      },
    ])
  )

  const salesData: ShipmentVolumePoint[] = eachDayOfInterval({
    start: chartStart,
    end: startOfDay(now),
  }).map((day) => {
    const key = format(day, "yyyy-MM-dd")
    const values = chartByDay.get(key)

    return {
      date: key,
      airCargo: values?.airCargo ?? 0,
      surfaceCargo: values?.surfaceCargo ?? 0,
    }
  })

  const hubsData: HubVolumePoint[] = hubRows.map((row) => ({
    id: row.id,
    name: row.name,
    location: row.location,
    totalShipments: toNumber(row.totalShipments),
    totalShipmentsLabel: formatCompactNumber(toNumber(row.totalShipments)),
    trend: toTrend(
      toNumber(row.currentShipments),
      toNumber(row.previousShipments)
    ),
  }))

  const totalHubShipments = hubsData.reduce(
    (sum, hub) => sum + hub.totalShipments,
    0
  )
  const activeHubCount = hubsData.filter((hub) => hub.totalShipments > 0).length

  const operationsSummary: HubOperationsSummary =
    hubsData.length === 0
      ? {
          hasLiveData: false,
          title: "Regional hub network is still empty.",
          description:
            "Add your first hub to start tracking manifest-linked throughput.",
        }
      : totalHubShipments === 0
        ? {
            hasLiveData: false,
            title: `${hubsData.length} hubs are configured.`,
            description:
              "Manifest-linked shipment volume has not started flowing through the network yet.",
          }
        : {
            hasLiveData: true,
            title: `${activeHubCount} active hubs are moving freight.`,
            description: `${totalHubShipments.toLocaleString()} shipments have been linked to origin-hub manifests so far.`,
          }

  return {
    stats,
    salesData,
    hubsData,
    operationsSummary,
  }
}

export async function getAnalyticsOverview(period: AnalyticsPeriod = "30d"): Promise<AnalyticsOverview> {
  const now = new Date()
  const { start: windowStart, end: windowEnd } = buildPeriodWindow(period, now)
  const previousWindowStart = windowStart ? startOfDay(subDays(windowStart, windowStart ? Math.ceil((windowEnd.getTime() - windowStart.getTime()) / (1000 * 60 * 60 * 24)) : 30)) : null
  const sixMonthsStart = startOfMonth(subMonths(now, 5))

  // Convert all dates to ISO strings for Drizzle sql`` interpolation.
  // Drizzle's sql tag serializes Date objects via .toString() which produces
  // "Thu Sep 03 2026 00:00:00 GMT+0530 ..." — a format Postgres cannot parse.
  // Using .toISOString() produces "2026-09-03T00:00:00.000Z" which Postgres
  // correctly casts to timestamp.
  const currentWindowStartIso = windowStart?.toISOString() ?? null
  const currentWindowEndIso = windowEnd.toISOString()
  const previousWindowStartIso = previousWindowStart?.toISOString() ?? null
  const sixMonthsStartIso = sixMonthsStart.toISOString()

  // Build conditional SQL fragments to avoid interpolating null values.
  // When there's no window start (period === "all"), we use sql`true` / sql`false`
  // so that no parameter placeholder is emitted at all.
  const currentStartShipmentsCond = currentWindowStartIso
    ? sql`${shipments.bookingDate} >= ${currentWindowStartIso} and ${shipments.bookingDate} < ${currentWindowEndIso}`
    : sql`${shipments.bookingDate} < ${currentWindowEndIso}`

  const currentStartUpdatedAtCond = currentWindowStartIso
    ? sql`${shipments.updatedAt} >= ${currentWindowStartIso} and ${shipments.updatedAt} < ${currentWindowEndIso}`
    : sql`${shipments.updatedAt} < ${currentWindowEndIso}`

  const prevStartShipmentsCond = previousWindowStartIso
    ? sql`${shipments.bookingDate} >= ${previousWindowStartIso} and ${shipments.bookingDate} < ${currentWindowStartIso ?? currentWindowEndIso}`
    : sql`false`

  const prevStartUpdatedAtCond = previousWindowStartIso
    ? sql`${shipments.updatedAt} >= ${previousWindowStartIso} and ${shipments.updatedAt} < ${currentWindowStartIso ?? currentWindowEndIso}`
    : sql`false`

  const bookingDay = sql<string>`to_char(${shipments.bookingDate}, 'YYYY-MM-DD')`

  const [
    shipmentSummaryRows,
    vehicleSummaryRows,
    shipmentVolumeRows,
    revenueRows,
    customerGrowthRows,
    dailyVolumeRows,
    topRouteRows,
  ] = await Promise.all([
    db
      .select({
        networkVolume: sql<number>`count(*)`,
        currentNetworkVolume: sql<number>`coalesce(sum(case when ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
        previousNetworkVolume: sql<number>`coalesce(sum(case when ${prevStartShipmentsCond} then 1 else 0 end), 0)`,
        currentDelivered: sql<number>`coalesce(sum(case when ${shipments.status} = 'delivered' and ${currentStartUpdatedAtCond} then 1 else 0 end), 0)`,
        previousDelivered: sql<number>`coalesce(sum(case when ${shipments.status} = 'delivered' and ${prevStartUpdatedAtCond} then 1 else 0 end), 0)`,
        currentOnTime: sql<number>`coalesce(sum(case when ${shipments.status} = 'delivered' and ${currentStartUpdatedAtCond} and ${shipments.edd} is not null and ${shipments.updatedAt} <= ${shipments.edd} then 1 else 0 end), 0)`,
        previousOnTime: sql<number>`coalesce(sum(case when ${shipments.status} = 'delivered' and ${prevStartUpdatedAtCond} and ${shipments.edd} is not null and ${shipments.updatedAt} <= ${shipments.edd} then 1 else 0 end), 0)`,
        // Status breakdown for the current period
        countDelivered: sql<number>`coalesce(sum(case when ${shipments.status} = 'delivered' and ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
        countInTransit: sql<number>`coalesce(sum(case when ${shipments.status} = 'in-transit' and ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
        countAtRisk: sql<number>`coalesce(sum(case when ${shipments.slaAtRisk} = true and ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
        countPending: sql<number>`coalesce(sum(case when ${shipments.status} = 'pending' and ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
        // Service breakdown in period
        periodAir: sql<number>`coalesce(sum(case when ${shipments.serviceType} = 'express_air' and ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
        periodSurface: sql<number>`coalesce(sum(case when ${shipments.serviceType} in ('standard_ocean','road_freight') and ${currentStartShipmentsCond} then 1 else 0 end), 0)`,
      })
      .from(shipments)
      .where(isNull(shipments.deletedAt)),
    db
      .select({
        total: sql<number>`count(*)`,
        active: sql<number>`coalesce(sum(case when ${vehicles.status} = 'active' then 1 else 0 end), 0)`,
        maintenance: sql<number>`coalesce(sum(case when ${vehicles.status} = 'maintenance' then 1 else 0 end), 0)`,
        retired: sql<number>`coalesce(sum(case when ${vehicles.status} = 'retired' then 1 else 0 end), 0)`,
      })
      .from(vehicles)
      .where(isNull(vehicles.deletedAt)),

    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${shipments.bookingDate}), 'YYYY-MM')`,
        air: sql<number>`coalesce(sum(case when ${shipments.serviceType} = 'express_air' then 1 else 0 end), 0)`,
        road: sql<number>`coalesce(sum(case when ${shipments.serviceType} = 'road_freight' then 1 else 0 end), 0)`,
      })
      .from(shipments)
      .where(
        currentWindowStartIso
          ? sql`${shipments.deletedAt} is null and ${shipments.bookingDate} >= ${currentWindowStartIso} and ${shipments.bookingDate} < ${currentWindowEndIso}`
          : sql`${shipments.deletedAt} is null and ${shipments.bookingDate} < ${currentWindowEndIso}`
      )
      .groupBy(sql`date_trunc('month', ${shipments.bookingDate})`)
      .orderBy(sql`date_trunc('month', ${shipments.bookingDate})`),
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${invoices.createdAt}), 'YYYY-MM')`,
        amountPaise: sql<number>`coalesce(sum(${invoices.amount}), 0)`,
      })
      .from(invoices)
      .where(
        currentWindowStartIso
          ? sql`${invoices.createdAt} >= ${currentWindowStartIso} and ${invoices.createdAt} < ${currentWindowEndIso}`
          : sql`${invoices.createdAt} < ${currentWindowEndIso}`
      )
      .groupBy(sql`date_trunc('month', ${invoices.createdAt})`)
      .orderBy(sql`date_trunc('month', ${invoices.createdAt})`),
    db
      .select({
        month: sql<string>`to_char(date_trunc('month', ${users.createdAt}), 'YYYY-MM')`,
        customers: sql<number>`count(*)`,
      })
      .from(users)
      .where(
        currentWindowStartIso
          ? sql`${users.role} = 'customer' and ${users.deletedAt} is null and ${users.createdAt} >= ${currentWindowStartIso} and ${users.createdAt} < ${currentWindowEndIso}`
          : sql`${users.role} = 'customer' and ${users.deletedAt} is null and ${users.createdAt} < ${currentWindowEndIso}`
      )
      .groupBy(sql`date_trunc('month', ${users.createdAt})`)
      .orderBy(sql`date_trunc('month', ${users.createdAt})`),
    // Daily volume for chart (within period window)
    db
      .select({
        date: bookingDay,
        air: sql<number>`coalesce(sum(case when ${shipments.serviceType} = 'express_air' then 1 else 0 end), 0)`,
        surface: sql<number>`coalesce(sum(case when ${shipments.serviceType} in ('standard_ocean', 'road_freight') then 1 else 0 end), 0)`,
      })
      .from(shipments)
      .where(
        currentWindowStartIso
          ? sql`${shipments.deletedAt} is null and ${shipments.bookingDate} >= ${currentWindowStartIso} and ${shipments.bookingDate} < ${currentWindowEndIso}`
          : sql`${shipments.deletedAt} is null and ${shipments.bookingDate} < ${currentWindowEndIso}`
      )
      .groupBy(bookingDay)
      .orderBy(bookingDay),
    // Top routes (within period)
    db
      .select({
        origin: shipments.origin,
        destination: shipments.destination,
        volume: sql<number>`count(*)`,
      })
      .from(shipments)
      .where(
        currentWindowStartIso
          ? sql`${shipments.deletedAt} is null and ${shipments.bookingDate} >= ${currentWindowStartIso} and ${shipments.bookingDate} < ${currentWindowEndIso}`
          : sql`${shipments.deletedAt} is null and ${shipments.bookingDate} < ${currentWindowEndIso}`
      )
      .groupBy(shipments.origin, shipments.destination)
      .orderBy(sql`count(*) desc`)
      .limit(10),
  ])


  const shipmentSummary = shipmentSummaryRows[0]
  const vehicleSummary = vehicleSummaryRows[0]

  const currentOnTimeRate = toRate(
    toNumber(shipmentSummary?.currentOnTime),
    toNumber(shipmentSummary?.currentDelivered)
  )
  const previousOnTimeRate = toRate(
    toNumber(shipmentSummary?.previousOnTime),
    toNumber(shipmentSummary?.previousDelivered)
  )

  const fleetEfficiency = toRate(
    toNumber(vehicleSummary?.active),
    toNumber(vehicleSummary?.total)
  )

  return {
    networkVolume: toNumber(shipmentSummary?.networkVolume),
    networkVolumeTrend: toTrend(
      toNumber(shipmentSummary?.currentNetworkVolume),
      toNumber(shipmentSummary?.previousNetworkVolume)
    ),
    fleetEfficiency,
    fleetEfficiencyTrend: null,
    onTimePerformance: currentOnTimeRate,
    onTimePerformanceTrend:
      currentOnTimeRate === null || previousOnTimeRate === null
        ? null
        : toTrend(currentOnTimeRate, previousOnTimeRate),
    fleetAvailability: {
      managedTotal: toNumber(vehicleSummary?.total),
      managedOperational: toNumber(vehicleSummary?.active),
      registryTotal: 0,
      registryOperational: 0,
      data: [
        {
          label: "Active",
          managed: toNumber(vehicleSummary?.active),
          registry: 0,
        },
        {
          label: "Maintenance",
          managed: toNumber(vehicleSummary?.maintenance),
          registry: 0,
        },
        {
          label: "Idle / Retired",
          managed: toNumber(vehicleSummary?.retired),
          registry: 0,
        },
      ],
    },
    shipmentVolumeByMonth: shipmentVolumeRows.map((row) => ({
      month: row.month,
      air: toNumber(row.air),
      road: toNumber(row.road),
    })),
    revenueByMonth: revenueRows.map((row) => ({
      month: row.month,
      amountPaise: toNumber(row.amountPaise),
    })),
    customerGrowthByMonth: customerGrowthRows.map((row) => ({
      month: row.month,
      customers: toNumber(row.customers),
    })),
    topRoutes: topRouteRows.map((row) => ({
      route: `${row.origin} → ${row.destination}`,
      volume: toNumber(row.volume),
    })),
    // NEW
    dailyVolume: dailyVolumeRows.map((row) => ({
      date: row.date,
      air: toNumber(row.air),
      surface: toNumber(row.surface),
    })),
    statusBreakdown: {
      delivered: toNumber(shipmentSummary?.countDelivered),
      inTransit: toNumber(shipmentSummary?.countInTransit),
      atRisk: toNumber(shipmentSummary?.countAtRisk),
      pending: toNumber(shipmentSummary?.countPending),
    },
    period,
  }
}
