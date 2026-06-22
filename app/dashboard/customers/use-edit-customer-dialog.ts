import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { updateCustomerAction } from "./actions"
import { editCustomerSchema, type EditCustomerValues } from "./validations"

export type CustomerForEdit = {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pinCode: string | null
}

export function useEditCustomerDialog(
  customer: CustomerForEdit,
  onOpenChange: (open: boolean) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EditCustomerValues>({
    resolver: zodResolver(editCustomerSchema as any),
    defaultValues: {
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      pinCode: customer.pinCode || "",
    },
  })

  async function onSubmit(data: EditCustomerValues) {
    setIsSubmitting(true)
    const result = await updateCustomerAction({
      ...data,
      id: customer.id,
    } as any)

    if (result?.success) {
      toast.success("Customer updated successfully")
      onOpenChange(false)
    } else {
      toast.error(result?.error || "An error occurred")
    }
    setIsSubmitting(false)
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  }
}
