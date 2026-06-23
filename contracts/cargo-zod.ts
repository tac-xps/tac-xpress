import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  plan: z.string(),
  settings: z.object({
  allowPublicTracking: z.boolean()
}),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const UserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatarUrl: z.string(),
  orgId: z.string(),
  role: z.string(),
  emailVerified: z.date(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const ShipmentSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  origin: z.string(),
  destination: z.string(),
  status: z.string(),
  carrier: z.string(),
  containerId: z.string(),
  estimatedArrival: z.date(),
  weight: z.number(),
  volume: z.number(),
  value: z.number(),
  cargoItems: z.array(z.object({
  hsCode: z.string(),
  description: z.string(),
  quantity: z.number()
})),
  documents: z.array(z.object({
  type: z.string(),
  url: z.string()
})),
  trackingEvents: z.array(z.object({
  event: z.string(),
  timestamp: z.string()
})),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const TrackingEventSchema = z.object({
  id: z.string(),
  shipmentId: z.string(),
  eventType: z.string(),
  location: z.string(),
  timestamp: z.date(),
  metadata: z.object({
  vehicle: z.string()
}),
  createdAt: z.date()
});

export const WarehouseSchema = z.object({
  id: z.string(),
  orgId: z.string(),
  name: z.string(),
  code: z.string(),
  address: z.object({
  street: z.string(),
  city: z.string(),
  country: z.string()
}),
  timezone: z.string(),
  createdAt: z.date()
});

export const InventorySchema = z.object({
  id: z.string(),
  warehouseId: z.string(),
  sku: z.string(),
  batchLot: z.string(),
  quantity: z.number(),
  locationId: z.string(),
  expiryDate: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const InvoiceSchema = z.object({
  id: z.string(),
  shipmentId: z.string(),
  customerId: z.string(),
  amount: z.number(),
  status: z.string(),
  dueDate: z.string(),
  freightCharge: z.number(),
  pickupCharge: z.number(),
  packingCharge: z.number(),
  insuranceCharge: z.number(),
  subtotal: z.number(),
  gstRate: z.number(),
  cgst: z.number(),
  sgst: z.number(),
  igst: z.number(),
  balanceDue: z.number(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const ManifestSchema = z.object({
  id: z.string(),
  referenceId: z.string(),
  createdBy: z.string(),
  originHubId: z.string(),
  destinationHubId: z.string(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

