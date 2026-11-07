CREATE UNIQUE INDEX "manifest_items_manifest_shipment_unique" ON "manifest_items" USING btree ("manifest_id","shipment_id");--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_weight_kg_positive" CHECK ("shipments"."weight_kg" > 0);--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_base_price_check" CHECK ("base_price" >= 0);--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD CONSTRAINT "pricing_rules_price_per_kg_check" CHECK ("price_per_kg" >= 0);--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "shipments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "manifests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "manifest_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "tracking_events" ENABLE ROW LEVEL SECURITY;