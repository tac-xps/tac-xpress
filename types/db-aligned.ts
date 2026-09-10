// AUTO-GENERATED. DO NOT EDIT MANUALLY.
// Generated at: 2026-06-24T18:57:22.808Z
// Source: public schema information_schema.columns


export interface AuditLog {
  id: string
  user_email: string
  action: string
  resource_id?: string
  metadata?: Record<string, any>
  created_at: string
  user_id?: string
  entity?: string
  entity_id?: string
  before?: Record<string, any>
  after?: Record<string, any>
}


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


export interface FleetVehicles {
  id: string
  registration_number: string
  driver_id?: string
  status: string
  created_at: string
  deleted_at?: string
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
  due_date?: string
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
  whatsapp_status: string
  created_at: string
  updated_at: string
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
  origin_hub_id?: string
  destination_hub_id?: string
  vehicle_id?: string
  driver_id?: string
  status: string
  created_at: string
  updated_at: string
}


export interface MessageOutbound {
  id: string
  phone: string
  body: string
  whatsapp_message_id?: string
  provider_name?: string
  provider_message_id?: string
  meta_message_id?: string
  status: string
  template_name?: string
  template_language?: string
  message_type: string
  related_ticket_id?: string
  related_awb?: string
  failure_reason?: string
  provider_payload?: Record<string, any>
  last_status_at?: string
  created_at?: string
}


export interface Notifications {
  id: string
  ticket_id?: string
  recipient_email: string
  type: string
  status: string
  payload?: Record<string, any>
  created_at?: string
  sent_at?: string
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


export interface Profiles {
  id: string
  full_name?: string
  avatar_url?: string
  role?: string
  email_notifications?: boolean
  whatsapp_notifications?: boolean
  sms_notifications?: boolean
}


export interface Shipments {
  id: string
  awb_number: string
  customer_id?: string
  status: string
  origin: string
  destination: string
  service_type: string
  weight_kg: any
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
  charged_weight_kg?: any
  packaging_type?: string
  is_fragile?: boolean
  insurance_opt_in?: boolean
  sla_at_risk?: boolean
  sla_at_risk_alerted_at?: string
  sla_risk_acknowledged?: boolean
  sla_risk_acknowledged_by?: string
  sla_risk_acknowledged_at?: string
  deleted_at?: string
  created_at: string
  updated_at: string
}


export interface SlaPolicies {
  id: string
  name: string
  priority: string
  category?: string
  first_response_minutes: number
  resolution_minutes: number
  escalation_threshold: any
  is_active?: boolean
  created_at?: string
}


export interface TicketReplies {
  id: string
  ticket_id: string
  message?: string
  is_internal: boolean
  sender_type?: string
  sender_id?: string
  sender_name?: string
  sender_email?: string
  whatsapp_message_id?: string
  created_at: string
}


export interface Tickets {
  id: string
  customer_id?: string
  user_id?: string
  guest_email?: string
  guest_phone?: string
  customer_name?: string
  customer_email?: string
  customer_phone?: string
  awb_number?: string
  subject: string
  message?: string
  description: string
  intake_category?: string
  category?: string
  status: string
  priority?: string
  assigned_to?: string
  related_awb?: string
  source?: string
  resolved_at?: string
  ai_confidence?: any
  ai_routing?: string
  ai_auto_reply_enabled?: boolean
  created_at: string
  updated_at: string
  sla_deadline_first_response?: string
  sla_deadline_resolution?: string
  sla_breached?: boolean
  sla_breach_type?: string
  sla_at_risk?: boolean
  first_reply_at?: string
  assigned_team?: string
  needs_human_review: boolean
  sla_breach_processed_at?: string
}


export interface TrackingEvents {
  id: string
  shipment_id: string
  awb_number?: string
  event_type?: string
  status: string
  location: string
  location_code?: string
  description: string
  event_time: string
  logged_by?: string
  is_public: boolean
  notes?: string
  created_at: string
}


export interface Users {
  id: string
  name?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pin_code?: string
  password?: string
  role: string
  is_onboarded: boolean
  avatar_url?: string
  created_at: string
  updated_at: string
  deleted_at?: string
}


export interface Vehicles {
  id: string
  registration_number: string
  capacity_kg: number
  status: string
  driver_id?: string
  created_at: string
  deleted_at?: string
}


export interface WhatsappSubscribers {
  phone: string
  name?: string
  opted_in?: boolean
  last_inbound_at?: string
  created_at?: string
  updated_at?: string
}

// KNOWN ENUMS
export type DriverStatus = 'active' | 'on_leave' | 'inactive'
export type FleetVehicleStatus = 'active' | 'maintenance' | 'idle'
export type HubType = 'warehouse' | 'branch' | 'transit_center'
export type IdProofType = 'aadhaar' | 'pan' | 'passport' | 'none'
export type InvoiceStatus = 'unpaid' | 'paid' | 'void'
export type ItemCondition = 'new' | 'used' | 'refurbished'
export type ManifestStatus = 'draft' | 'finalized'
export type NatureOfGoods = 'documents' | 'electronics' | 'garments' | 'fragile' | 'medicines' | 'others'
export type PackagingType = 'none' | 'corrugated_box' | 'bubble_wrap' | 'wooden_crate' | 'pallet'
export type PaymentMode = 'cash' | 'upi' | 'card' | 'wallet' | 'credit' | 'to_pay'
export type Role = 'admin' | 'staff' | 'customer'
export type ServiceType = 'express_air' | 'standard_ocean' | 'road_freight'
export type ShipmentStatus = 'pending' | 'in-transit' | 'delivered'
export type TicketStatus = 'open' | 'in_progress' | 'awaiting_customer' | 'resolved'
export type VehicleStatus = 'active' | 'maintenance' | 'retired'
export type WhatsappStatus = 'pending' | 'sent' | 'failed'
