import { z } from "zod"

export const createHubSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  contact: z.string().optional(),
  type: z.enum(["warehouse", "branch", "transit_center"]),
})
export const updateHubSchema = createHubSchema.extend({
  id: z.string().uuid(),
})
export const deleteHubSchema = z.object({
  id: z.string().uuid(),
})

export type CreateHubValues = z.infer<typeof createHubSchema>
export type UpdateHubValues = z.infer<typeof updateHubSchema>
