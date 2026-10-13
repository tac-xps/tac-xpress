"use client"

import React, { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Truck, Users } from "lucide-react"

interface FleetTabsClientProps {
  toolbar?: React.ReactNode
  vehiclesTable: React.ReactNode
  driversTable: React.ReactNode
  vehicleCount: number
  driverCount: number
}

export function FleetTabsClient({
  toolbar,
  vehiclesTable,
  driversTable,
  vehicleCount,
  driverCount,
}: FleetTabsClientProps) {
  const [activeTab, setActiveTab] = useState<string>("vehicles")

  return (
    <div className="space-y-4">
      {/* Tab Switcher visible on all viewports, especially useful on mobile/tablet */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:w-80">
          <TabsTrigger value="vehicles" className="flex items-center gap-2 text-xs">
            <Truck className="size-3.5" />
            <span>Vehicles</span>
            <span className="ml-1 rounded bg-muted px-1.5 py-0.2 font-mono text-micro text-muted-foreground tabular-nums">
              {vehicleCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="drivers" className="flex items-center gap-2 text-xs">
            <Users className="size-3.5" />
            <span>Drivers</span>
            <span className="ml-1 rounded bg-muted px-1.5 py-0.2 font-mono text-micro text-muted-foreground tabular-nums">
              {driverCount}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 overflow-hidden rounded-none border bg-card">
          {toolbar}
          <TabsContent value="vehicles" className="m-0 focus-visible:outline-none">
            {vehiclesTable}
          </TabsContent>
          <TabsContent value="drivers" className="m-0 focus-visible:outline-none">
            {driversTable}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
