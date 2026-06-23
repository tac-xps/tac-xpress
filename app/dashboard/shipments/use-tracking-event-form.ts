import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { useTransition } from "react"
import { createTrackingEventAction } from "./actions"
import { createTrackingEventSchema } from "./schemas"
import { z } from "zod"

import { useAction } from "next-safe-action/hooks"

type TrackingEventValues = z.infer<typeof createTrackingEventSchema>

export function useTrackingEventForm(
  shipmentId: string,
  onSuccess: () => void
) {
  const form = useForm<TrackingEventValues>({
    resolver: zodResolver(createTrackingEventSchema as any),
    defaultValues: {
      shipmentId,
      status: "in-transit",
      location: "",
      description: "",
    },
  })

  const { executeAsync, isExecuting } = useAction(createTrackingEventAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Tracking event logged successfully")
        onSuccess()
      } else {
        toast.error("Failed to log event")
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An unexpected error occurred")
    },
  })

  async function onSubmit(values: TrackingEventValues) {
    try {
      await executeAsync(values)
    } catch (error) {
      Sentry.captureException(error)
      toast.error("An unexpected error occurred")
    }
  }

  return {
    form,
    status: isExecuting ? "executing" : "idle",
    onSubmit,
  }
}
