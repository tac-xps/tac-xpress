import { z } from "zod"
import { isValidLogisticsPhone } from "@/lib/validation/phone"

const optionalPhone = z
  .string()
  .trim()
  .refine(isValidLogisticsPhone, "Enter a valid phone number")
  .optional()

export const createShipmentSchema = z.object({
  customerId: z.string().uuid({ message: "Please select a customer" }),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  weightKg: z.coerce.number().int().positive("Weight must be greater than 0"),
  consignorName: z.string().optional(),
  consignorPhone: optionalPhone,
  consignorAddress: z.string().optional(),
  consigneeName: z.string().optional(),
  consigneePhone: optionalPhone,
  consigneeAddress: z.string().optional(),
  natureOfGoods: z
    .enum([
      "documents",
      "electronics",
      "garments",
      "fragile",
      "medicines",
      "others",
    ])
    .optional(),
  itemCondition: z.enum(["new", "used", "refurbished"]).optional(),
  packagingType: z
    .enum(["none", "corrugated_box", "bubble_wrap", "wooden_crate", "pallet"])
    .optional(),
  pieces: z.coerce.number().int().min(1).default(1),
  dimensionsL: z.coerce.number().int().min(0).optional(),
  dimensionsW: z.coerce.number().int().min(0).optional(),
  dimensionsH: z.coerce.number().int().min(0).optional(),
  chargedWeightKg: z.coerce.number().int().min(0).optional(),
  isFragile: z.boolean().optional(),
  insuranceOptIn: z.boolean().optional(),
  selectedRateId: z.string().optional(),
})

export type CreateShipmentValues = z.infer<typeof createShipmentSchema>
