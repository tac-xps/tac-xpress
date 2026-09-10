import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Sentry from "@sentry/nextjs"
import { toast } from "sonner"
import { useTransition } from "react"
import { createStaffAction } from "./actions"
import { addStaffSchema, type AddStaffValues } from "./validations"

export function useAddStaffForm(onSuccess?: () => void) {
  const form = useForm<AddStaffValues>({
    resolver: zodResolver(addStaffSchema as any),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      role: "staff",
    },
  })

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: AddStaffValues) {
    startTransition(async () => {
      try {
        const result = await createStaffAction(values)
        if ((result?.data?.success)) {
          toast.success("Staff member added successfully")
          form.reset()
          onSuccess?.()
        } else {
          toast.error((result?.data?.error ?? result?.serverError) || "Failed to add staff member")
        }
      } catch (error) {
        Sentry.captureException(error)
        toast.error("An unexpected error occurred.")
      }
    })
  }

  return {
    form,
    isExecuting,
    onSubmit,
  }
}
