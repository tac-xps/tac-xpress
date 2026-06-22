// AUTO-GENERATED. DO NOT EDIT MANUALLY.
// Generated at: 2026-06-06T03:01:42.869Z
// Source: public schema information_schema.columns

export interface Drivers {
  id: string
  name: string
  phone: string
  license_number: string
  status: string
  created_at: string
  deleted_at?: string
}

export interface Feedback {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export interface Hubs {
  id: string
  name: string
  location: string
  contact?: string
  type: string
  created_at: string
  deleted_at?: string
}

export interface Invoices {
  id: string
  shipment_id?: string
  customer_id?: string
  amount: number
  status: string
  pdf_url?: string
  whatsapp_status: string
  created_at: string
  updated_at: string
  freight_charge?: number
  pickup_charge?: number
  packing_charge?: number
  docket_charge?: number
  insurance_charge?: number
  other_charges?: number
  subtotal?: number
  gst_rate?: number
  hsn_code?: string
  cgst?: number
  sgst?: number
  igst?: number
  payment_mode?: string
  advance_paid?: number
  balance_due?: number
  remarks?: string
  terms_accepted?: boolean
  prohibited_accepted?: boolean
  signature_url?: string
}

export interface ManifestItems {
  id: string
  manifest_id: string
  shipment_id: string
  created_at: string
}

export interface Manifests {
  id: string
  reference_id: string
  created_by?: string
  status: string
  created_at: string
  updated_at: string
  origin_hub_id?: string
  destination_hub_id?: string
  vehicle_id?: string
  driver_id?: string
}

export interface PricingRules {
  id: string
  service_type: string
  origin: string
  destination: string
  base_price: number
  price_per_kg: number
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface Shipments {
  id: string
  awb_number: string
  customer_id?: string
  status: string
  origin: string
  destination: string
  created_at: string
  updated_at: string
  service_type: string
  weight_kg: number
  booking_date: string
  edd?: string
  consignor_name?: string
  consignor_company?: string
  consignor_phone?: string
  consignor_alt_phone?: string
  consignor_email?: string
  consignor_address?: string
  consignor_pin_code?: string
  consignor_id_type?: string
  consignor_id_number?: string
  consignee_name?: string
  consignee_phone?: string
  consignee_alt_phone?: string
  consignee_email?: string
  consignee_address?: string
  consignee_pin_code?: string
  content_description?: string
  nature_of_goods?: string
  item_condition?: string
  declared_value?: number
  pieces?: number
  dimensions_l?: number
  dimensions_w?: number
  dimensions_h?: number
  charged_weight_kg?: number
  packaging_type?: string
  is_fragile?: boolean
  insurance_opt_in?: boolean
  deleted_at?: string
  service?: string
  weight?: string
  customer_name?: string
  estimated_delivery?: string
  is_publicly_trackable: boolean
  customer_email?: string
}

export interface TicketReplies {
  id: string
  ticket_id: string
  message: string
  is_internal: boolean
  sender_type: string
  sender_id?: string
  sender_name: string
  sender_email?: string
  created_at: string
}

export interface Tickets {
  id: string
  customer_id?: string
  awb_number?: string
  subject: string
  description?: string
  status: string
  created_at: string
  updated_at: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  message?: string
  category?: string
  priority?: string
  assigned_to?: string
  related_awb?: string
  resolved_at?: string
  source?: string
}

export interface TrackingEvents {
  id: string
  shipment_id: string
  status?: string
  location: string
  description: string
  created_at: string
  awb_number?: string
  event_type?: string
  location_code?: string
  event_time: string
  logged_by?: string
  is_public: boolean
  notes?: string
}

export interface Users {
  id: string
  email: string
  role: string
  created_at: string
  updated_at: string
  phone?: string
  deleted_at?: string
}

export interface Vehicles {
  id: string
  registration_number: string
  capacity_kg: number
  status: string
  created_at: string
  deleted_at?: string
}

// KNOWN ENUMS
export type DriverStatus = "active" | "on_leave" | "inactive"
export type HubType = "warehouse" | "branch" | "transit_center"
export type IdProofType = "aadhaar" | "pan" | "passport" | "none"
export type InvoiceStatus = "unpaid" | "paid"
export type ItemCondition = "new" | "used" | "refurbished"
export type ManifestStatus = "draft" | "finalized"
export type NatureOfGoods =
  | "documents"
  | "electronics"
  | "garments"
  | "fragile"
  | "medicines"
  | "others"
export type PackagingType =
  | "none"
  | "corrugated_box"
  | "bubble_wrap"
  | "wooden_crate"
  | "pallet"
export type PaymentMode =
  | "cash"
  | "upi"
  | "card"
  | "wallet"
  | "credit"
  | "to_pay"
export type Role = "admin" | "staff" | "customer"
export type ServiceType = "express_air" | "standard_ocean" | "road_freight"
export type ShipmentStatus = "pending" | "in-transit" | "delivered"
export type TicketStatus = "open" | "in_progress" | "resolved"
export type VehicleStatus = "active" | "maintenance" | "retired"
export type WhatsappStatus = "pending" | "sent" | "failed"
