ALTER TABLE "manifest_items" ALTER COLUMN "manifest_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "manifest_items" ALTER COLUMN "shipment_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "tracking_events" ALTER COLUMN "shipment_id" SET NOT NULL;