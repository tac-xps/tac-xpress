"use client"

import React from "react"
import { PackageTrackerCard } from "@/components/ui/tracker-card"

export default function Demo() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <PackageTrackerCard
        status="In Transit"
        packageNumber="AWB-EDBF7EAC1746"
        destination="Los Angeles, CA"
        destinationFlag={<span className="text-xl">🇺🇸</span>}
        date="Oct 24, 2023"
        description="Shipment arrived at sorting facility."
        packageImage={
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <span className="text-sm font-medium">Package Image</span>
          </div>
        }
        onTrackClick={() => alert("Tracking details clicked!")}
      />
    </div>
  )
}
