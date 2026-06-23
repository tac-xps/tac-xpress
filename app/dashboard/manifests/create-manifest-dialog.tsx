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

interface CreateManifestDialogProps {
  shipments: {
    id: string
    awbNumber: string
    destination: string
  }[]
  hubs: { id: string; label: string }[]
  vehicles: { id: string; label: string }[]
  drivers: { id: string; label: string }[]
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
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create Manifest
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <DialogHeader className="shrink-0 border-b border-border/50 px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-bold">
            Create Digital Manifest
          </DialogTitle>
          <DialogDescription>
            Bundle pending shipments into a single consolidated manifest.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-hidden">
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
