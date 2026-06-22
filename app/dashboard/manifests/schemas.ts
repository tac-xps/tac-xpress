import { z } from "zod"

export const createManifestSchema = z.object({
  originHubId: z.string().uuid("Select an origin hub"),
  destinationHubId: z.string().uuid("Select a destination hub"),
  vehicleId: z.string().uuid("Select a vehicle"),
  driverId: z.string().uuid("Select a driver"),
  shipmentIds: z
    .array(z.string().uuid())
    .min(1, "Select at least one shipment"),
})

export const scanShipmentSchema = z.object({
  manifestId: z.string().uuid(),
  awbNumber: z.string().min(1),
})

export const updateManifestSchema = z.object({
  id: z.string().uuid(),
  referenceId: z
    .string()
    .min(3, "Reference ID must be at least 3 characters")
    .optional(),
  originHubId: z.string().uuid().nullable().optional(),
  destinationHubId: z.string().uuid().nullable().optional(),
  vehicleId: z.string().uuid().nullable().optional(),
  driverId: z.string().uuid().nullable().optional(),
  status: z.enum(["draft", "finalized"]).optional(),
})

export const deleteManifestSchema = z.object({
  id: z.string().uuid(),
})
