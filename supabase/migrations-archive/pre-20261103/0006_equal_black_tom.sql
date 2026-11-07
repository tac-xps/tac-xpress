CREATE TYPE "public"."id_proof_type" AS ENUM('aadhaar', 'pan', 'passport', 'none');--> statement-breakpoint
CREATE TYPE "public"."item_condition" AS ENUM('new', 'used', 'refurbished');--> statement-breakpoint
CREATE TYPE "public"."nature_of_goods" AS ENUM('documents', 'electronics', 'garments', 'fragile', 'medicines', 'others');--> statement-breakpoint
CREATE TYPE "public"."packaging_type" AS ENUM('none', 'corrugated_box', 'bubble_wrap', 'wooden_crate', 'pallet');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('cash', 'upi', 'card', 'wallet', 'credit', 'to_pay');--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "freight_charge" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "pickup_charge" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "packing_charge" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "docket_charge" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "insurance_charge" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "other_charges" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "subtotal" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "gst_rate" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "hsn_code" text DEFAULT '996511';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "cgst" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "sgst" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "igst" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_mode" "payment_mode" DEFAULT 'cash';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "advance_paid" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "balance_due" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "remarks" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "terms_accepted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "prohibited_accepted" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "signature_url" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "booking_date" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "edd" timestamp;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_name" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_company" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_phone" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_alt_phone" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_email" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_address" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_pin_code" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_id_type" "id_proof_type" DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignor_id_number" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignee_name" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignee_phone" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignee_alt_phone" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignee_email" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignee_address" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "consignee_pin_code" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "content_description" text;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "nature_of_goods" "nature_of_goods" DEFAULT 'others';--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "item_condition" "item_condition" DEFAULT 'new';--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "declared_value" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "pieces" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "dimensions_l" integer;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "dimensions_w" integer;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "dimensions_h" integer;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "charged_weight_kg" integer;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "packaging_type" "packaging_type" DEFAULT 'none';--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "is_fragile" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "shipments" ADD COLUMN "insurance_opt_in" boolean DEFAULT false;