import { z } from "zod"
import { isValidLogisticsPhone } from "@/lib/validation/phone"

const optionalPhone = z
  .string()
  .trim()
  .refine(isValidLogisticsPhone, "Enter a valid phone number")
  .optional()

export const createShipmentSchema = z.object({
  customerId: z.string().uuid(),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  weightKg: z.number().int().positive("Weight must be greater than 0"),
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
  pieces: z.number().int().min(1).default(1),
  dimensionsL: z.number().int().min(0).optional(),
  dimensionsW: z.number().int().min(0).optional(),
  dimensionsH: z.number().int().min(0).optional(),
  chargedWeightKg: z.number().int().min(0).optional(),
  isFragile: z.boolean().optional(),
  insuranceOptIn: z.boolean().optional(),
})

export const createTrackingEventSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
  status: z.enum(["pending", "in-transit", "delivered"]),
  location: z.string().min(2, "Location must be at least 2 characters"),
  description: z.string().min(2, "Description must be at least 2 characters"),
})

export const updateShipmentSchema = z.object({
  id: z.string().uuid(),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  weightKg: z.number().int().positive("Weight must be greater than 0"),
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
  pieces: z.number().int().min(1).optional(),
  dimensionsL: z.number().int().min(0).optional(),
  dimensionsW: z.number().int().min(0).optional(),
  dimensionsH: z.number().int().min(0).optional(),
  chargedWeightKg: z.number().int().min(0).optional(),
  isFragile: z.boolean().optional(),
  insuranceOptIn: z.boolean().optional(),
})

export const deleteShipmentSchema = z.object({
  id: z.string().uuid(),
})
