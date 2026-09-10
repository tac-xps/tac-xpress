import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTransition } from "react"
import { toast } from "sonner"
import * as Sentry from "@sentry/nextjs"
import { updateStaffAction } from "./actions"
import { editStaffSchema, type EditStaffValues } from "./validations"
import type { User } from "@/lib/db/schema"

export type StaffForEdit = Pick<
  User,
  "id" | "name" | "email" | "phone" | "role"
>

export function useEditStaffDialog(
  staff: StaffForEdit,
  onOpenChange: (open: boolean) => void
) {
  const form = useForm<EditStaffValues>({
    resolver: zodResolver(editStaffSchema as any),
    defaultValues: {
      id: staff.id,
      name: staff.name || "",
      email: staff.email || "",
      phone: staff.phone || "",
      role: staff.role as "staff" | "admin",
    },
  })

  const [isSubmitting, startTransition] = useTransition()

  function onSubmit(values: EditStaffValues) {
    startTransition(async () => {
      try {
        const result = await updateStaffAction(values)
        if (result?.data?.success) {
          toast.success("Staff member updated")
          onOpenChange(false)
        } else {
          toast.error(
            result?.data?.error ?? result?.serverError ?? "Update failed"
          )
        }
      } catch (error) {
        Sentry.captureException(error)
        toast.error("An unexpected error occurred.")
      }
    })
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  }
}
