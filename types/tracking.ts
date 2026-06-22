import { ShipmentStatus } from "./db-aligned"

export type TrackingEventType =
  | "picked-up"
  | "in-transit"
  | "arrived-hub"
  | "departed-hub"
  | "out-for-delivery"
  | "delivered"
  | "failed-delivery"
  | "returned"
  | "customs-hold"
  | "customs-cleared"
  | "exception"

export interface TrackingEvent {
  id: string
  awb_number: string
  event_type: TrackingEventType
  location: string
  location_code?: string
  description: string
  event_time: string
  created_at: string
  logged_by?: string
  is_public: boolean
  notes?: string
}

export interface TrackingResult {
  awb_number: string
  origin: string
  destination: string
  status: ShipmentStatus | string
  service: string
  weight: string
  created_at: string
  customer_name?: string
  events: TrackingEvent[]
  current_location?: string
  estimated_delivery?: string
}
