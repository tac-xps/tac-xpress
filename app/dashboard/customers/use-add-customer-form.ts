import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as Sentry from "@sentry/nextjs"
import { toast } from "sonner"
import { useTransition } from "react"
import { createCustomerAction } from "./actions"
import { addCustomerSchema, type AddCustomerValues } from "./validations"

export function useAddCustomerForm(onSuccess?: () => void) {
  const form = useForm<AddCustomerValues>({
    resolver: zodResolver(addCustomerSchema as any),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
    },
  })

  const [isExecuting, startTransition] = useTransition()

  function onSubmit(values: AddCustomerValues) {
    startTransition(async () => {
      try {
        const result = await createCustomerAction(values)
        if (result?.success) {
          toast.success("Customer added successfully")
          form.reset()
          onSuccess?.()
        } else {
          toast.error(result?.error || "Failed to add customer")
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
