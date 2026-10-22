"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { CreateManifestForm } from "./create-manifest-form"
import type {
  ManifestShipmentItem,
  ManifestVehicleOption,
  ManifestHubOption,
} from "./manifest-telemetry-card"
import type { ManifestDriverOption } from "./manifest-fleet-card"

interface CreateManifestDialogProps {
  shipments: ManifestShipmentItem[]
  hubs: ManifestHubOption[]
  vehicles: ManifestVehicleOption[]
  drivers: ManifestDriverOption[]
}

export function CreateManifestDialog({
  shipments,
  hubs,
  vehicles,
  drivers,
}: CreateManifestDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-none font-semibold">
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Manifest
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] max-h-[92vh] w-[96vw] flex-col gap-0 overflow-hidden rounded-none border border-border bg-background p-0 shadow-2xl sm:max-w-5xl lg:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border/50 px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-bold">
            Create Digital Manifest
          </DialogTitle>
          <DialogDescription>
            Bundle new cargo or received in-transit cargo into a hub-to-hub
            load.
          </DialogDescription>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <CreateManifestForm
            shipments={shipments}
            hubs={hubs}
            vehicles={vehicles}
            drivers={drivers}
            onSuccess={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
