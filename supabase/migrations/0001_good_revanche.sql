CREATE TYPE "public"."service_type" AS ENUM('express_air', 'standard_ocean', 'road_freight');--> statement-breakpoint
CREATE TABLE "manifest_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"manifest_id" uuid,
	"shipment_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_type" "service_type" NOT NULL,
	"origin" text NOT NULL,
	"destination" text NOT NULL,
	"base_price" integer NOT NULL,
	"price_per_kg" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid,
	"status" "shipment_status" NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "service_type" "service_type" DEFAULT 'express_air' NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "weight_kg" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "manifest_items" ADD CONSTRAINT "manifest_items_manifest_id_manifests_id_fk" FOREIGN KEY ("manifest_id") REFERENCES "public"."manifests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manifest_items" ADD CONSTRAINT "manifest_items_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_events" ADD CONSTRAINT "tracking_events_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "manifest_items_manifest_id_idx" ON "manifest_items" USING btree ("manifest_id");--> statement-breakpoint
CREATE INDEX "manifest_items_shipment_id_idx" ON "manifest_items" USING btree ("shipment_id");--> statement-breakpoint
CREATE INDEX "tracking_events_shipment_id_idx" ON "tracking_events" USING btree ("shipment_id");