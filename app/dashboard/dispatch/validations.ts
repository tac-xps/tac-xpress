import { z } from "zod"

export const createDispatchRunSchema = z.object({
  driverId: z.string().uuid("Please select a driver"),
  vehicleId: z.string().uuid("Please select a vehicle"),
  runType: z.enum(["pickup", "delivery"]),
  shipmentIds: z
    .array(z.string().uuid())
    .min(1, "Select at least one shipment"),
})

export type CreateDispatchRunValues = z.infer<typeof createDispatchRunSchema>

export const updateDispatchRunSchema = z.object({
  id: z.string().uuid(),
  driverId: z.string().uuid("Please select a driver").optional(),
  vehicleId: z.string().uuid("Please select a vehicle").optional(),
  status: z.enum(["draft", "finalized"]).optional(),
})

export const deleteDispatchRunSchema = z.object({
  id: z.string().uuid(),
})

export type UpdateDispatchRunValues = z.infer<typeof updateDispatchRunSchema>
