import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  pgEnum,
  index,
  uniqueIndex,
  check,
  boolean,
  real,
  jsonb,
} from "drizzle-orm/pg-core"
import { sql, relations } from "drizzle-orm"

export const roleEnum = pgEnum("role", ["admin", "staff", "customer"])
export const shipmentStatusEnum = pgEnum("shipment_status", [
  "pending",
  "in-transit",
  "delivered",
])
export const ticketStatusEnum = pgEnum("ticket_status", [
  "open",
  "in_progress",
  "awaiting_customer",
  "resolved",
])
export const invoiceStatusEnum = pgEnum("invoice_status", [
  "unpaid",
  "paid",
  "void",
])
export const whatsappStatusEnum = pgEnum("whatsapp_status", [
  "pending",
  "sent",
  "failed",
])
export const manifestStatusEnum = pgEnum("manifest_status", [
  "draft",
  "finalized",
])
export const serviceTypeEnum = pgEnum("service_type", [
  "express_air",
  "standard_ocean",
  "road_freight",
])
export const natureOfGoodsEnum = pgEnum("nature_of_goods", [
  "documents",
  "electronics",
  "garments",
  "fragile",
  "medicines",
  "others",
])
export const itemConditionEnum = pgEnum("item_condition", [
  "new",
  "used",
  "refurbished",
])
export const packagingTypeEnum = pgEnum("packaging_type", [
  "none",
  "corrugated_box",
  "bubble_wrap",
  "wooden_crate",
  "pallet",
])
export const paymentModeEnum = pgEnum("payment_mode", [
  "cash",
  "upi",
  "card",
  "wallet",
  "credit",
  "to_pay",
])
export const idProofTypeEnum = pgEnum("id_proof_type", [
  "aadhaar",
  "pan",
  "passport",
  "none",
])

export const hubTypeEnum = pgEnum("hub_type", [
  "warehouse",
  "branch",
  "transit_center",
])
export const vehicleStatusEnum = pgEnum("vehicle_status", [
  "active",
  "maintenance",
  "retired",
])
export const driverStatusEnum = pgEnum("driver_status", [
  "active",
  "on_leave",
  "inactive",
])
export const fleetVehicleStatusEnum = pgEnum("fleet_vehicle_status", [
  "active",
  "maintenance",
  "idle",
])

export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(), // Optional
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pinCode: text("pin_code"),
  role: roleEnum("role").notNull().default("customer"),
  isOnboarded: boolean("is_onboarded").default(false).notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"),
})

export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  role: roleEnum("role").default("customer"),
  emailNotifications: boolean("email_notifications").default(true),
  whatsappNotifications: boolean("whatsapp_notifications").default(true),
  smsNotifications: boolean("sms_notifications").default(false),
})

export const shipments = pgTable(
  "shipments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    awbNumber: text("awb_number").notNull().unique(),
    customerId: uuid("customer_id").references(() => users.id, {
      onDelete: "restrict",
    }),
    status: shipmentStatusEnum("status").notNull().default("pending"),
    origin: text("origin").notNull(),
    destination: text("destination").notNull(),
    serviceType: serviceTypeEnum("service_type")
      .notNull()
      .default("express_air"),
    weightKg: real("weight_kg").notNull().default(1),
    bookingDate: timestamp("booking_date").defaultNow().notNull(),
    edd: timestamp("edd"),
    consignorName: text("consignor_name"),
    consignorCompany: text("consignor_company"),
    consignorPhone: text("consignor_phone"),
    consignorAltPhone: text("consignor_alt_phone"),
    consignorEmail: text("consignor_email"),
    consignorAddress: text("consignor_address"),
    consignorPinCode: text("consignor_pin_code"),
    consignorIdType: idProofTypeEnum("consignor_id_type").default("none"),
    consignorIdNumber: text("consignor_id_number"),
    consigneeName: text("consignee_name"),
    consigneePhone: text("consignee_phone"),
    consigneeAltPhone: text("consignee_alt_phone"),
    consigneeEmail: text("consignee_email"),
    consigneeAddress: text("consignee_address"),
    consigneePinCode: text("consignee_pin_code"),
    contentDescription: text("content_description"),
    natureOfGoods: natureOfGoodsEnum("nature_of_goods").default("others"),
    itemCondition: itemConditionEnum("item_condition").default("new"),
    declaredValue: integer("declared_value").default(0),
    pieces: integer("pieces").default(1),
    dimensionsL: integer("dimensions_l"),
    dimensionsW: integer("dimensions_w"),
    dimensionsH: integer("dimensions_h"),
    chargedWeightKg: real("charged_weight_kg"),
    packagingType: packagingTypeEnum("packaging_type").default("none"),
    isFragile: boolean("is_fragile").default(false),
    insuranceOptIn: boolean("insurance_opt_in").default(false),
    slaAtRisk: boolean("sla_at_risk").default(false),
    slaAtRiskAlertedAt: timestamp("sla_at_risk_alerted_at"),
    slaRiskAcknowledged: boolean("sla_risk_acknowledged").default(false),
    slaRiskAcknowledgedBy: uuid("sla_risk_acknowledged_by"),
    slaRiskAcknowledgedAt: timestamp("sla_risk_acknowledged_at"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("shipments_customer_id_idx").on(table.customerId),
    index("shipments_status_idx").on(table.status),
    check("shipments_weight_kg_positive", sql`${table.weightKg} > 0`),
  ]
)

export const tickets = pgTable(
  "tickets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    customerId: uuid("customer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id"),
    guestEmail: text("guest_email"),
    guestPhone: text("guest_phone"),
    customerName: text("customer_name"),
    customerEmail: text("customer_email"),
    customerPhone: text("customer_phone"),
    awbNumber: text("awb_number"), // optional, if linked to a shipment
    subject: text("subject").notNull(),
    message: text("message"),
    description: text("description").notNull(),
    intakeCategory: text("intake_category"),
    category: text("category"),
    status: ticketStatusEnum("status").notNull().default("open"),
    priority: text("priority").default("medium"),
    assignedTo: text("assigned_to"),
    assignedTeam: text("assigned_team"),
    relatedAwb: text("related_awb"),
    source: text("source"),
    resolvedAt: timestamp("resolved_at"),
    slaDeadlineFirstResponse: timestamp("sla_deadline_first_response"),
    slaDeadlineResolution: timestamp("sla_deadline_resolution"),
    slaBreached: boolean("sla_breached").default(false),
    slaBreachType: text("sla_breach_type"), // 'first_response' or 'resolution'
    slaAtRisk: boolean("sla_at_risk").default(false),
    firstReplyAt: timestamp("first_reply_at"),
    aiConfidence: real("ai_confidence").default(0),
    aiRouting: text("ai_routing"),
    aiAutoReplyEnabled: boolean("ai_auto_reply_enabled").default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("tickets_customer_id_idx").on(table.customerId),
    index("tickets_customer_email_idx").on(table.customerEmail),
    index("tickets_status_idx").on(table.status),
  ]
)

export const ticketReplies = pgTable(
  "ticket_replies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ticketId: uuid("ticket_id")
      .references(() => tickets.id, {
        onDelete: "cascade",
      })
      .notNull(),
    message: text("message"),
    isInternal: boolean("is_internal").default(false).notNull(),
    senderType: text("sender_type"),
    senderId: text("sender_id"),
    senderName: text("sender_name"),
    senderEmail: text("sender_email"),
    whatsappMessageId: text("whatsapp_message_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("ticket_replies_ticket_id_idx").on(table.ticketId)]
)

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shipmentId: uuid("shipment_id").references(() => shipments.id, {
      onDelete: "restrict",
    }),
    customerId: uuid("customer_id").references(() => users.id, {
      onDelete: "restrict",
    }),
    amount: integer("amount").notNull(), // in cents
    status: invoiceStatusEnum("status").notNull().default("unpaid"),
    pdfUrl: text("pdf_url"), // Link to generated PDF in Supabase Storage
    dueDate: timestamp("due_date"),
    freightCharge: integer("freight_charge").default(0),
    pickupCharge: integer("pickup_charge").default(0),
    packingCharge: integer("packing_charge").default(0),
    docketCharge: integer("docket_charge").default(0),
    insuranceCharge: integer("insurance_charge").default(0),
    otherCharges: integer("other_charges").default(0),
    subtotal: integer("subtotal").default(0),
    gstRate: integer("gst_rate").default(0),
    hsnCode: text("hsn_code").default("996511"),
    cgst: integer("cgst").default(0),
    sgst: integer("sgst").default(0),
    igst: integer("igst").default(0),
    paymentMode: paymentModeEnum("payment_mode").default("cash"),
    advancePaid: integer("advance_paid").default(0),
    balanceDue: integer("balance_due").default(0),
    remarks: text("remarks"),
    termsAccepted: boolean("terms_accepted").default(false),
    prohibitedAccepted: boolean("prohibited_accepted").default(false),
    signatureUrl: text("signature_url"),
    whatsappStatus: whatsappStatusEnum("whatsapp_status")
      .notNull()
      .default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("invoices_shipment_id_idx").on(table.shipmentId),
    index("invoices_customer_id_idx").on(table.customerId),
    index("invoices_status_idx").on(table.status),
  ]
)

export const hubs = pgTable("hubs", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  contact: text("contact"),
  type: hubTypeEnum("type").default("branch").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
})

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  registrationNumber: text("registration_number").notNull().unique(),
  capacityKg: integer("capacity_kg").notNull(),
  status: vehicleStatusEnum("status").default("active").notNull(),
  driverId: uuid("driver_id").references(() => drivers.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
})

export const drivers = pgTable("drivers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  licenseNumber: text("license_number").notNull().unique(),
  status: driverStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
})

export const fleetVehicles = pgTable("fleet_vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  registrationNumber: text("registration_number").notNull().unique(),
  driverId: uuid("driver_id").references(() => users.id, {
    onDelete: "set null",
  }),
  status: fleetVehicleStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
})

export const manifests = pgTable(
  "manifests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    referenceId: text("reference_id").notNull().unique(),
    createdBy: uuid("created_by").references(() => users.id, {
      onDelete: "set null",
    }), // Staff/Admin who created it
    originHubId: uuid("origin_hub_id").references(() => hubs.id, {
      onDelete: "restrict",
    }),
    destinationHubId: uuid("destination_hub_id").references(() => hubs.id, {
      onDelete: "restrict",
    }),
    vehicleId: uuid("vehicle_id").references(() => vehicles.id, {
      onDelete: "set null",
    }),
    driverId: uuid("driver_id").references(() => drivers.id, {
      onDelete: "set null",
    }),
    status: manifestStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdateFn(() => new Date())
      .notNull(),
  },
  (table) => [
    index("manifests_created_by_idx").on(table.createdBy),
    index("manifests_origin_hub_idx").on(table.originHubId),
    index("manifests_destination_hub_idx").on(table.destinationHubId),
  ]
)

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const pricingRules = pgTable("pricing_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  serviceType: serviceTypeEnum("service_type").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  basePrice: integer("base_price").notNull(), // in cents
  pricePerKg: integer("price_per_kg").notNull(), // in cents
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull(),
  deletedAt: timestamp("deleted_at"),
})
// NOTE: Drizzle doesn't natively support CHECK at table level for all fields.
// CHECK constraints (base_price >= 0, price_per_kg >= 0) are enforced at the DB
// level via migration 0003.

export const trackingEvents = pgTable(
  "tracking_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shipmentId: uuid("shipment_id")
      .references(() => shipments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    awbNumber: text("awb_number"),
    eventType: text("event_type"),
    status: shipmentStatusEnum("status").notNull(),
    location: text("location").notNull(),
    locationCode: text("location_code"),
    description: text("description").notNull(),
    eventTime: timestamp("event_time").defaultNow().notNull(),
    loggedBy: text("logged_by"),
    isPublic: boolean("is_public").default(false).notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("tracking_events_shipment_id_idx").on(table.shipmentId),
    index("tracking_events_awb_number_idx").on(table.awbNumber),
  ]
)

export const whatsappSubscribers = pgTable(
  "whatsapp_subscribers",
  {
    phone: text("phone").primaryKey(),
    name: text("name"),
    optedIn: boolean("opted_in").default(true),
    lastInboundAt: timestamp("last_inbound_at"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("idx_whatsapp_subscribers_opted").on(table.optedIn)]
)

export const messageOutbound = pgTable(
  "message_outbound",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    phone: text("phone").notNull(),
    body: text("body").notNull(),
    whatsappMessageId: text("whatsapp_message_id"),
    providerName: text("provider_name").default("wpbox"),
    providerMessageId: text("provider_message_id"),
    metaMessageId: text("meta_message_id"),
    status: text("status").notNull().default("sent"),
    templateName: text("template_name"),
    templateLanguage: text("template_language"),
    messageType: text("message_type").notNull().default("text"),
    relatedTicketId: uuid("related_ticket_id").references(() => tickets.id, {
      onDelete: "set null",
    }),
    relatedAwb: text("related_awb"),
    failureReason: text("failure_reason"),
    providerPayload: jsonb("provider_payload"),
    lastStatusAt: timestamp("last_status_at").defaultNow(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_message_outbound_phone").on(table.phone),
    index("idx_message_outbound_provider_message_id").on(
      table.providerMessageId
    ),
    index("idx_message_outbound_meta_message_id").on(table.metaMessageId),
  ]
)

export const manifestItems = pgTable(
  "manifest_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    manifestId: uuid("manifest_id")
      .references(() => manifests.id, {
        onDelete: "cascade",
      })
      .notNull(),
    shipmentId: uuid("shipment_id")
      .references(() => shipments.id, {
        onDelete: "cascade",
      })
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("manifest_items_manifest_id_idx").on(table.manifestId),
    index("manifest_items_shipment_id_idx").on(table.shipmentId),
    uniqueIndex("manifest_items_manifest_shipment_unique").on(
      table.manifestId,
      table.shipmentId
    ),
  ]
)

export const invoicesRelations = relations(invoices, ({ one }) => ({
  shipment: one(shipments, {
    fields: [invoices.shipmentId],
    references: [shipments.id],
  }),
  customer: one(users, {
    fields: [invoices.customerId],
    references: [users.id],
  }),
}))

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  customer: one(users, {
    fields: [shipments.customerId],
    references: [users.id],
  }),
  invoice: one(invoices),
  trackingEvents: many(trackingEvents),
  manifestItems: many(manifestItems),
}))

export const usersRelations = relations(users, ({ many }) => ({
  shipments: many(shipments),
  tickets: many(tickets),
  invoices: many(invoices),
  manifests: many(manifests),
  fleetVehicles: many(fleetVehicles),
}))

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  customer: one(users, {
    fields: [tickets.customerId],
    references: [users.id],
  }),
  replies: many(ticketReplies),
}))

export const ticketRepliesRelations = relations(ticketReplies, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketReplies.ticketId],
    references: [tickets.id],
  }),
}))

export const hubsRelations = relations(hubs, ({ many }) => ({
  manifestsAsOrigin: many(manifests, { relationName: "originHub" }),
  manifestsAsDestination: many(manifests, { relationName: "destinationHub" }),
}))

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  manifests: many(manifests),
  driver: one(drivers, {
    fields: [vehicles.driverId],
    references: [drivers.id],
  }),
}))

export const driversRelations = relations(drivers, ({ many }) => ({
  manifests: many(manifests),
  vehicles: many(vehicles),
}))

export const manifestsRelations = relations(manifests, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [manifests.createdBy],
    references: [users.id],
  }),
  originHub: one(hubs, {
    fields: [manifests.originHubId],
    references: [hubs.id],
    relationName: "originHub",
  }),
  destinationHub: one(hubs, {
    fields: [manifests.destinationHubId],
    references: [hubs.id],
    relationName: "destinationHub",
  }),
  vehicle: one(vehicles, {
    fields: [manifests.vehicleId],
    references: [vehicles.id],
  }),
  driver: one(drivers, {
    fields: [manifests.driverId],
    references: [drivers.id],
  }),
  items: many(manifestItems),
}))

export const trackingEventsRelations = relations(trackingEvents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [trackingEvents.shipmentId],
    references: [shipments.id],
  }),
}))

export const manifestItemsRelations = relations(manifestItems, ({ one }) => ({
  manifest: one(manifests, {
    fields: [manifestItems.manifestId],
    references: [manifests.id],
  }),
  shipment: one(shipments, {
    fields: [manifestItems.shipmentId],
    references: [shipments.id],
  }),
}))

export const fleetVehiclesRelations = relations(fleetVehicles, ({ one }) => ({
  driver: one(users, {
    fields: [fleetVehicles.driverId],
    references: [users.id],
  }),
}))

export type User = typeof users.$inferSelect
export type Shipment = typeof shipments.$inferSelect
export type Invoice = typeof invoices.$inferSelect
export type FleetVehicle = typeof fleetVehicles.$inferSelect
export type Vehicle = typeof vehicles.$inferSelect
export type Driver = typeof drivers.$inferSelect
export type Manifest = typeof manifests.$inferSelect
export type Ticket = typeof tickets.$inferSelect
export type TicketReply = typeof ticketReplies.$inferSelect
