import { z } from "zod"

export const addDriverSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Valid phone is required"),
  licenseNumber: z.string().min(1, "License number is required"),
  status: z.enum(["active", "on_leave", "inactive"]),
})

export const updateDriverSchema = addDriverSchema.extend({
  id: z.string().uuid(),
})

export const deleteDriverSchema = z.object({
  id: z.string().uuid(),
})

export const addVehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  capacityKg: z.coerce.number().positive(),
  driverId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === "none" ? null : val)),
  status: z.enum(["active", "maintenance", "retired"]),
})

export const updateVehicleSchema = addVehicleSchema.extend({
  id: z.string().uuid(),
})

export const deleteVehicleSchema = z.object({
  id: z.string().uuid(),
})

export type AddDriverValues = z.infer<typeof addDriverSchema>
export type UpdateDriverValues = z.infer<typeof updateDriverSchema>
export type AddVehicleValues = z.infer<typeof addVehicleSchema>
export type UpdateVehicleValues = z.infer<typeof updateVehicleSchema>
