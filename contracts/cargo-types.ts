import { z } from 'zod';
import {
  OrganizationSchema,
  UserSchema,
  ShipmentSchema,
  TrackingEventSchema,
  WarehouseSchema,
  InventorySchema,
  InvoiceSchema,
  ManifestSchema,
} from './cargo-zod';

export type CargoOrganization = z.infer<typeof OrganizationSchema>;
export type CargoUser = z.infer<typeof UserSchema>;
export type CargoShipment = z.infer<typeof ShipmentSchema>;
export type CargoTrackingEvent = z.infer<typeof TrackingEventSchema>;
export type CargoWarehouse = z.infer<typeof WarehouseSchema>;
export type CargoInventory = z.infer<typeof InventorySchema>;
export type CargoInvoice = z.infer<typeof InvoiceSchema>;
export type CargoManifest = z.infer<typeof ManifestSchema>;
