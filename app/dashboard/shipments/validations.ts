import { z } from "zod"
import { createShipmentSchema as serverSchema } from "./schemas"
export const createShipmentSchema = serverSchema.extend({ selectedRateId: z.string().optional() })
export type CreateShipmentValues = z.output<typeof createShipmentSchema>
export type ShipmentFormInput = z.input<typeof createShipmentSchema>

