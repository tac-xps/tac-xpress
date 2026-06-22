import React from "react"
import { db } from "@/lib/db"
import { users, manifests, vehicles, drivers } from "@/lib/db/schema"
import { isNull } from "drizzle-orm"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, Navigation, Settings2, ShieldCheck } from "lucide-react"
import { MessageDriverButton } from "./message-driver-button"
import { FleetIcon } from "@/components/icons/sidebar-icons"

import { AddVehicleDialog } from "./add-vehicle-dialog"
import { AddDriverDialog } from "./add-driver-dialog"
import { VehiclesClientTable } from "./vehicles-client-table"
import { DriversClientTable } from "./drivers-client-table"
import Image from "next/image"
import {
  DEFAULT_PAGE_SIZE,
  PageNavigation,
  parsePage,
} from "@/components/ui/page-navigation"

export default async function FleetPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>
}) {
  const page = parsePage((await searchParams).page)
  const activeManifests = await db.query.manifests.findMany({
    where: (manifests, { inArray }) => inArray(manifests.status, ["finalized"]),
    orderBy: (manifests, { desc }) => [desc(manifests.createdAt)],
    limit: 100,
  })

  const vehicleRows = await db.query.vehicles.findMany({
    where: isNull(vehicles.deletedAt),
    with: {
      driver: true,
    },
    orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)],
    limit: DEFAULT_PAGE_SIZE + 1,
    offset: (page - 1) * DEFAULT_PAGE_SIZE,
  })

  const hasNext = vehicleRows.length > DEFAULT_PAGE_SIZE
  const allVehicles = vehicleRows.slice(0, DEFAULT_PAGE_SIZE)

  const allDrivers = await db.query.drivers.findMany({
    where: isNull(drivers.deletedAt),
    orderBy: (drivers, { desc }) => [desc(drivers.createdAt)],
    limit: 100,
  })

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-lg bg-primary/10 p-3">
            <FleetIcon className="size-8 text-primary" />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Fleet Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Asset health and driver assignment matrix.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddDriverDialog />
          <AddVehicleDialog drivers={allDrivers} />
        </div>
      </div>

      <div className="flex snap-x snap-mandatory scrollbar-thin gap-6 overflow-x-auto pb-6">
        {allVehicles.length === 0 ? (
          <div className="col-span-full rounded-xl border border-border/50 bg-muted/20 py-12 text-center text-muted-foreground">
            No fleet vehicles found.
          </div>
        ) : (
          allVehicles.map((asset, i) => {
            const driverName = asset.driver?.name || "Unassigned"
            const driverId = asset.driver?.id
            const activeManifest = activeManifests.find(
              (m) => m.vehicleId === asset.id || m.driverId === driverId
            )

            const type =
              asset.capacityKg > 1000
                ? "Heavy Commercial"
                : asset.capacityKg > 500
                  ? "Medium Commercial"
                  : "Light Commercial"
            const location = activeManifest ? "En route" : "Idle at Hub"

            // Image Path Mapping
            const lightImage =
              type === "Heavy Commercial"
                ? "/images/fleet/heavy_commercial_light.png"
                : type === "Medium Commercial"
                  ? "/images/fleet/medium_commercial_light.png"
                  : "/images/fleet/light_commercial_light.png"
            const darkImage =
              type === "Heavy Commercial"
                ? "/images/fleet/heavy_commercial_dark.png"
                : type === "Medium Commercial"
                  ? "/images/fleet/medium_commercial_dark.png"
                  : "/images/fleet/light_commercial_dark.png"

            return (
              <Card
                key={asset.id}
                className={`group/card @container/card w-[85vw] shrink-0 snap-start transition-transform duration-300 hover:-translate-y-1 md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]`}
                style={{ animationDelay: `${i * 75}ms` }}
              >
                <CardContent className="flex flex-col gap-5 p-5">
                  <div className="relative mb-2 h-32 w-full overflow-hidden rounded-xl border border-border/50 bg-muted/10">
                    {/* 3D Image Container */}
                    <Image
                      alt={`${type} vehicle`}
                      className="object-contain transition-transform duration-700 ease-out group-hover/card:scale-105 dark:hidden"
                      fill
                      sizes="(max-width: 768px) 85vw, 25vw"
                      src={lightImage}
                    />
                    <Image
                      alt={`${type} vehicle`}
                      className="hidden object-contain transition-transform duration-700 ease-out group-hover/card:scale-105 dark:block"
                      fill
                      sizes="(max-width: 768px) 85vw, 25vw"
                      src={darkImage}
                    />

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2 rounded-md border border-border/50 bg-background px-2 py-1 shadow-sm">
                      <span
                        className={`size-2.5 rounded-full ${
                          asset.status === "active"
                            ? "bg-primary shadow-[0_0_8px_color-mix(in_oklab,var(--primary)_50%,transparent)]"
                            : asset.status === "maintenance"
                              ? "bg-status-pending shadow-[0_0_8px_color-mix(in_oklab,var(--color-status-pending)_50%,transparent)]"
                              : "bg-destructive shadow-[0_0_8px_color-mix(in_oklab,var(--destructive)_50%,transparent)]"
                        }`}
                      />
                      <span className="text-[10px] font-bold tracking-wider text-foreground uppercase">
                        {asset.status}
                      </span>
                    </div>

                    {/* Settings Button */}
                    <div className="absolute top-2 right-2 cursor-pointer rounded-lg border border-border/50 bg-background p-1.5 text-muted-foreground shadow-sm transition-colors hover:bg-background hover:text-foreground">
                      <Settings2 className="size-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {asset.registrationNumber}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {type}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-xl border border-border/30 bg-background p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <ShieldCheck className="size-4 text-muted-foreground" />
                        <span className="font-medium">{driverName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Navigation className="size-4 shrink-0" />
                      <span className="truncate">{location}</span>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-2">
                    <MessageDriverButton
                      driverId={driverId || ""}
                      manifestId={activeManifest?.id}
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 pt-4 lg:grid-cols-2">
        <VehiclesClientTable vehicles={allVehicles} drivers={allDrivers} />
        <DriversClientTable drivers={allDrivers} />
      </div>
      <PageNavigation
        page={page}
        hasNext={hasNext}
        pathname="/dashboard/fleet"
      />
    </div>
  )
}
