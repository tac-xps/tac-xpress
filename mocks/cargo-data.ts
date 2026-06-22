export const frozenDate = new Date("2026-01-15T00:00:00.000Z")

export const mockOrganization = {
  id: "org_123",
  name: "Global Freight Forwarders Inc",
  slug: "global-freight",
  plan: "enterprise",
  settings: { allowPublicTracking: true },
  createdAt: frozenDate,
  updatedAt: frozenDate,
}

export const mockUser = {
  id: "user_456",
  email: "admin@globalfreight.com",
  name: "Jane Smith",
  avatarUrl: "https://example.com/avatar.jpg",
  orgId: "org_123",
  role: "admin",
  emailVerified: frozenDate,
  createdAt: frozenDate,
  updatedAt: frozenDate,
}

export const mockShipment = {
  id: "SHP-2026-001",
  orgId: "org_123",
  origin: "Imphal, IN",
  destination: "New Delhi, IN",
  status: "draft",
  carrier: "Tac Xpress",
  containerId: "TAC1234567",
  estimatedArrival: frozenDate,
  weight: 15000.5,
  volume: 35.2,
  value: 125000.0,
  cargoItems: [{ hsCode: "8471.30", description: "Laptops", quantity: 150 }],
  documents: [{ type: "bol", url: "https://example.com/doc.pdf" }],
  trackingEvents: [{ event: "booked", timestamp: frozenDate.toISOString() }],
  createdAt: frozenDate,
  updatedAt: frozenDate,
}

export const mockTrackingEvent = {
  id: "evt_789",
  shipmentId: "SHP-2026-001",
  eventType: "departed",
  location: "Imphal Hub",
  timestamp: frozenDate,
  metadata: { vehicle: "Truck DL-1CA-5678" },
  createdAt: frozenDate,
}

export const mockWarehouse = {
  id: "wh_101",
  orgId: "org_123",
  name: "New Delhi Primary Facility",
  code: "DEL-01",
  address: { street: "123 Freight Way", city: "New Delhi", country: "IN" },
  timezone: "Asia/Kolkata",
  createdAt: frozenDate,
}

export const mockInventory = {
  id: "inv_202",
  warehouseId: "wh_101",
  sku: "LAPTOP-PRO-15",
  batchLot: "BATCH-2026-A",
  quantity: 500,
  locationId: "loc_A1_B2",
  expiryDate: "2030-12-31",
  createdAt: frozenDate,
  updatedAt: frozenDate,
}

export const mockInvoice = {
  id: "INV-2026-001",
  shipmentId: "SHP-2026-001",
  customerId: "user_456",
  amount: 25000,
  status: "unpaid",
  dueDate: "2026-02-15T00:00:00.000Z",
  freightCharge: 20000,
  pickupCharge: 1000,
  packingCharge: 500,
  insuranceCharge: 3500,
  subtotal: 25000,
  gstRate: 18,
  cgst: 2250,
  sgst: 2250,
  igst: 0,
  balanceDue: 25000,
  createdAt: frozenDate,
  updatedAt: frozenDate,
}

export const mockManifest = {
  id: "MAN-2026-001",
  referenceId: "REF-MAN-A1",
  createdBy: "user_456",
  originHubId: "wh_101",
  destinationHubId: "wh_102",
  status: "draft",
  createdAt: frozenDate,
  updatedAt: frozenDate,
}

export const mockEdgeCases = {
  empty: [],
  single: [mockShipment],
  overflow: Array(50)
    .fill(mockShipment)
    .map((s, i) => ({ ...s, id: `SHP-2026-${i}` })),
}
