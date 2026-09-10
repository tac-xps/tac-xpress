import { z } from "zod"
import { isValidLogisticsPhone } from "@/lib/validation/phone"

export const addStaffSchema = z.object({
  name: z.string().min(1, "Full name is required."),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .refine(isValidLogisticsPhone, "Enter a valid phone number."),
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(1, "Email is required for staff access."),
  role: z.enum(["staff", "admin"], {
    message: "Role is required.",
  }),
})

export const editStaffSchema = addStaffSchema.partial().extend({
  id: z.string().uuid(),
})

export type AddStaffValues = z.infer<typeof addStaffSchema>
export type EditStaffValues = z.infer<typeof editStaffSchema>
