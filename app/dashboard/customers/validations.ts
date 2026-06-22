import { z } from "zod"
import { isValidLogisticsPhone } from "@/lib/validation/phone"

export const addCustomerSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .refine(isValidLogisticsPhone, "Enter a valid phone number."),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pinCode: z.string().optional().or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
})

export const editCustomerSchema = addCustomerSchema.partial().extend({
  id: z.string().uuid(),
})

export type AddCustomerValues = z.infer<typeof addCustomerSchema>
export type EditCustomerValues = z.infer<typeof editCustomerSchema>
