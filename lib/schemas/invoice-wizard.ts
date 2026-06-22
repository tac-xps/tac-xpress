import { z } from "zod"
import { isValidLogisticsPhone } from "@/lib/validation/phone"

const requiredPhone = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(isValidLogisticsPhone, "Enter a valid phone number")
const optionalPhone = z
  .string()
  .trim()
  .refine(isValidLogisticsPhone, "Enter a valid phone number")
  .optional()

export const invoiceWizardSchema = z.object({
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  originState: z.string().default(""),
  destinationState: z.string().default(""),
  consignorName: z.string().min(3, "Name must be at least 3 characters"),
  consignorCompany: z.string().optional(),
  consignorPhone: requiredPhone,
  consignorAltPhone: optionalPhone,
  consignorEmail: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  consignorAddress: z.string().optional().or(z.literal("")),
  consignorPinCode: z.string().optional().or(z.literal("")),
  consignorIdType: z.enum(["aadhaar", "pan", "passport", "none"]),
  consignorIdNumber: z.string().optional(),
  consigneeName: z.string().min(1, "Name is required"),
  consigneePhone: requiredPhone,
  consigneeAltPhone: optionalPhone,
  consigneeEmail: z.string().email().optional().or(z.literal("")),
  consigneeAddress: z.string().optional().or(z.literal("")),
  consigneePinCode: z.string().optional().or(z.literal("")),
  contentDescription: z.string().min(5, "Description is required"),
  natureOfGoods: z.enum([
    "documents",
    "electronics",
    "garments",
    "fragile",
    "medicines",
    "others",
  ]),
  itemCondition: z.enum(["new", "used", "refurbished"]),
  declaredValue: z.coerce.number().min(0, "Value must be positive"),
  pieces: z.coerce.number().min(1, "Pieces must be at least 1"),
  weightKg: z.coerce.number().min(0.1, "Weight must be positive"),
  dimensionsL: z.coerce.number().optional().default(0),
  dimensionsW: z.coerce.number().optional().default(0),
  dimensionsH: z.coerce.number().optional().default(0),
  packagingType: z.enum([
    "none",
    "corrugated_box",
    "bubble_wrap",
    "wooden_crate",
    "pallet",
  ]),
  isFragile: z.boolean().default(false),
  insuranceOptIn: z.boolean().default(false),
  freightRatePerKg: z.coerce.number().min(0).optional(),
  freightCharge: z.coerce.number().min(0),
  pickupCharge: z.coerce.number().min(0),
  packingCharge: z.coerce.number().min(0),
  docketCharge: z.coerce.number().min(0),
  insuranceCharge: z.coerce.number().min(0),
  otherCharges: z.coerce.number().min(0),
  gstRate: z.coerce.number(),
  paymentMode: z.enum(["cash", "upi", "card", "wallet", "credit", "to_pay"]),
  advancePaid: z.coerce.number().min(0),
  remarks: z.string().optional(),
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, "You must accept the terms"),
  prohibitedAccepted: z
    .boolean()
    .refine(
      (val) => val === true,
      "You must accept the prohibited items declaration"
    ),
})

export type InvoiceWizardValues = z.infer<typeof invoiceWizardSchema>
