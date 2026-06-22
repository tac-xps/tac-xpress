CREATE TYPE "public"."driver_status" AS ENUM('active', 'on_leave', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."hub_type" AS ENUM('warehouse', 'branch', 'transit_center');--> statement-breakpoint
CREATE TYPE "public"."vehicle_status" AS ENUM('active', 'maintenance', 'retired');--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"phone" text NOT NULL,
	"license_number" text NOT NULL,
	"status" "driver_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "drivers_license_number_unique" UNIQUE("license_number")
);
--> statement-breakpoint
CREATE TABLE "hubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"contact" text,
	"type" "hub_type" DEFAULT 'branch' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "vehicles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"registration_number" text NOT NULL,
	"capacity_kg" integer NOT NULL,
	"status" "vehicle_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "vehicles_registration_number_unique" UNIQUE("registration_number")
);
--> statement-breakpoint
ALTER TABLE "manifests" ADD COLUMN "origin_hub_id" uuid;--> statement-breakpoint
ALTER TABLE "manifests" ADD COLUMN "destination_hub_id" uuid;--> statement-breakpoint
ALTER TABLE "manifests" ADD COLUMN "vehicle_id" uuid;--> statement-breakpoint
ALTER TABLE "manifests" ADD COLUMN "driver_id" uuid;--> statement-breakpoint
ALTER TABLE "pricing_rules" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_origin_hub_id_hubs_id_fk" FOREIGN KEY ("origin_hub_id") REFERENCES "public"."hubs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_destination_hub_id_hubs_id_fk" FOREIGN KEY ("destination_hub_id") REFERENCES "public"."hubs"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_vehicle_id_vehicles_id_fk" FOREIGN KEY ("vehicle_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manifests" ADD CONSTRAINT "manifests_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "manifests_origin_hub_idx" ON "manifests" USING btree ("origin_hub_id");--> statement-breakpoint
CREATE INDEX "manifests_destination_hub_idx" ON "manifests" USING btree ("destination_hub_id");