import { z } from "zod"

export const createManifestSchema = z.object({
  originHubId: z.string().uuid("Select an origin hub"),
  destinationHubId: z.string().uuid("Select a destination hub"),
  vehicleId: z.string().uuid("Select a vehicle"),
  driverId: z.string().uuid("Select a driver"),
  shipmentIds: z
    .array(z.string().uuid())
    .min(1, "Select at least one shipment").max(500, "A manifest can contain up to 500 shipments")
    .refine((ids) => new Set(ids).size === ids.length, "Select each shipment only once"),
})

export const scanShipmentSchema = z.object({
  manifestId: z.string().uuid(),
  awbNumber: z.string().trim().min(1).max(64),
})

export const updateManifestSchema = z.object({
  id: z.string().uuid(),
  referenceId: z
    .string()
    .min(3, "Reference ID must be at least 3 characters").max(64).regex(/^[A-Za-z0-9-]+$/, "Use letters, numbers and hyphens")
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
