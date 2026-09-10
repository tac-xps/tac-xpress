"use client"
import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { startDispatchRunAction, completeDispatchRunAction } from "./actions"
import type { DispatchRunRecord } from "./dispatch-client-table"
export function RunControls({ run }: { run: DispatchRunRecord }) {
  const [confirming, setConfirming] = useState(false)
  const start = useAction(startDispatchRunAction)
  const complete = useAction(completeDispatchRunAction)
  const pending = start.isExecuting || complete.isExecuting
  const isStart = run.status === "draft"
  const delivered =
    Boolean(run.items?.length) &&
    run.items!.every((item) => item.shipment?.status === "delivered")
  if (delivered) return <Badge variant="outline">Delivered</Badge>
  if (!isStart && !run.referenceId.startsWith("DL-"))
    return (
      <span className="text-xs text-muted-foreground">
        Record handover on the shipment
      </span>
    )
  return (
    <>
      <Button
        size="sm"
        variant={isStart ? "default" : "outline"}
        onClick={() => setConfirming(true)}
      >
        {isStart ? "Start run" : "Confirm delivery"}
      </Button>
      <AlertDialog
        open={confirming}
        onOpenChange={(value) => {
          if (!pending) setConfirming(value)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isStart
                ? "Start this dispatch run?"
                : "Confirm every shipment was delivered?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isStart
                ? "This locks the run assignments and records its shipments as in transit. Confirm the vehicle and driver are ready."
                : "This marks every shipment on the delivery run as delivered and publishes a tracking event. Continue only after verifying all handovers. Record individual exceptions on each shipment instead."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={async (event) => {
                event.preventDefault()
                try {
                  const result = await (isStart
                    ? start.executeAsync({ id: run.id })
                    : complete.executeAsync({ id: run.id }))
                  if (result?.data?.success) {
                    toast.success(
                      isStart ? "Dispatch started" : "Delivery recorded"
                    )
                    setConfirming(false)
                  } else {
                    toast.error(
                      result?.data?.error ||
                        result?.serverError ||
                        "The run could not be updated"
                    )
                  }
                } catch (error) {
                  Sentry.captureException(error)
                  toast.error(
                    "The request was interrupted. Refresh the run to check its status before retrying."
                  )
                }
              }}
            >
              {pending ? "Saving…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
