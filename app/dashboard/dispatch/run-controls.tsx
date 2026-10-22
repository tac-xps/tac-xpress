"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { Badge } from "@/components/reui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { startDispatchRunAction } from "./actions"
import {
  recordManifestItemHandoffAction,
  updateManifestAction,
} from "@/app/dashboard/manifests/actions"

type HandoffRun = {
  id: string
  status: "draft" | "finalized"
  legType: "pickup" | "line_haul" | "delivery"
  items?: {
    id: string
    isActive: boolean
    handoffs?: { outcome: string }[]
    shipment: { status: string; awbNumber: string } | null
  }[]
}

export function RunControls({ run }: { run: HandoffRun }) {
  const router = useRouter()
  const [confirmingStart, setConfirmingStart] = useState(false)
  const [handoffOpen, setHandoffOpen] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState("")
  const [location, setLocation] = useState("")
  const [receivingParty, setReceivingParty] = useState("")
  const [notes, setNotes] = useState("")
  const [eventKey, setEventKey] = useState("")
  const [error, setError] = useState("")
  const start = useAction(startDispatchRunAction)
  const handoff = useAction(recordManifestItemHandoffAction)
  const finalizeManifest = useAction(updateManifestAction)
  const pending =
    start.isExecuting || finalizeManifest.isExecuting || handoff.isExecuting
  const isStart = run.status === "draft"
  const activeItems = (run.items ?? []).filter(
    (item) => item.isActive && item.shipment?.status === "in-transit"
  )
  const allReceived =
    Boolean(run.items?.length) &&
    run.items!.every((item) =>
      item.handoffs?.some((handoff) => handoff.outcome === "received")
    )

  const selectItem = (itemId: string) => {
    setSelectedItemId(itemId)
    setLocation("")
    setReceivingParty("")
    setNotes("")
    setEventKey(crypto.randomUUID())
    setError("")
  }

  const saveHandoff = async (outcome: "received" | "exception") => {
    if (!selectedItemId) return
    setError("")
    try {
      const result = await handoff.executeAsync({
        manifestId: run.id,
        manifestItemId: selectedItemId,
        outcome,
        location,
        receivingParty: outcome === "received" ? receivingParty : undefined,
        notes: notes || undefined,
        eventKey,
      })
      if (result?.data?.success) {
        toast.success(
          outcome === "received"
            ? run.legType === "delivery"
              ? "Delivery recorded"
              : "Cargo handover recorded"
            : "Operational exception recorded"
        )
        setSelectedItemId("")
        setEventKey("")
        router.refresh()
      } else {
        setError(
          result?.data?.error ||
            result?.serverError ||
            "The handover could not be recorded. Retry after checking the current assignment."
        )
      }
    } catch (caught) {
      Sentry.captureException(caught)
      setError(
        "The request was interrupted. Retry with the same form values to avoid duplicate handovers."
      )
    }
  }

  if (allReceived) return <Badge variant="success-light">Received</Badge>
  if (!isStart && activeItems.length === 0)
    return <Badge variant="outline">No active handover</Badge>

  if (isStart) {
    return (
      <>
        <Button
          type="button"
          size="sm"
          onClick={() => setConfirmingStart(true)}
        >
          Start run
        </Button>
        <AlertDialog
          open={confirmingStart}
          onOpenChange={(value) => {
            if (!pending) setConfirmingStart(value)
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Start this dispatch run?</AlertDialogTitle>
              <AlertDialogDescription>
                This locks the run assignments and records departure. Confirm
                the vehicle and driver are ready.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel type="button" disabled={pending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="button"
                disabled={pending}
                onClick={async (event) => {
                  event.preventDefault()
                  try {
                    const result =
                      run.legType === "line_haul"
                        ? await finalizeManifest.executeAsync({
                            id: run.id,
                            status: "finalized",
                          })
                        : await start.executeAsync({ id: run.id })
                    if (result?.data?.success) {
                      toast.success(
                        run.legType === "line_haul"
                          ? "Manifest finalized"
                          : "Dispatch started"
                      )
                      setConfirmingStart(false)
                      router.refresh()
                    } else {
                      toast.error(
                        result?.data?.error ||
                          result?.serverError ||
                          "The run could not be started"
                      )
                    }
                  } catch (caught) {
                    Sentry.captureException(caught)
                    toast.error(
                      "The request was interrupted. Refresh the run before retrying."
                    )
                  }
                }}
              >
                {pending ? "Saving…" : "Confirm departure"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => setHandoffOpen(true)}
        disabled={activeItems.length === 0}
      >
        Record handover
      </Button>
      <Dialog
        open={handoffOpen}
        onOpenChange={(value) => {
          if (!pending) setHandoffOpen(value)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record a shipment handover</DialogTitle>
            <DialogDescription>
              Receive one shipment at a time. An exception keeps its active
              assignment until staff records a successful handover.
            </DialogDescription>
          </DialogHeader>

          {activeItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Every shipment on this load has a recorded handover.
            </p>
          ) : (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor={`handoff-item-${run.id}`}>
                  Shipment to receive
                </Label>
                <Select
                  value={selectedItemId || undefined}
                  onValueChange={selectItem}
                  disabled={pending}
                >
                  <SelectTrigger id={`handoff-item-${run.id}`}>
                    <SelectValue placeholder="Select an active shipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.shipment!.awbNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedItemId && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor={`handoff-location-${run.id}`}>
                      Receiving location
                    </Label>
                    <Input
                      id={`handoff-location-${run.id}`}
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      maxLength={160}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`handoff-party-${run.id}`}>
                      Receiver name or team
                    </Label>
                    <Input
                      id={`handoff-party-${run.id}`}
                      value={receivingParty}
                      onChange={(event) =>
                        setReceivingParty(event.target.value)
                      }
                      maxLength={160}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`handoff-notes-${run.id}`}>
                      Notes{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </Label>
                    <Input
                      id={`handoff-notes-${run.id}`}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      maxLength={1000}
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={pending || !selectedItemId || !location.trim()}
              onClick={() => void saveHandoff("exception")}
            >
              {pending ? "Saving…" : "Record exception"}
            </Button>
            <Button
              type="button"
              disabled={
                pending ||
                !selectedItemId ||
                !location.trim() ||
                !receivingParty.trim()
              }
              onClick={() => void saveHandoff("received")}
            >
              {pending ? "Saving…" : "Confirm receipt"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
