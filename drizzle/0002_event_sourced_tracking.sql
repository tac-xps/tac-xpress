CREATE TABLE "tracking_event_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" text NOT NULL,
	"type" text NOT NULL,
	"payload" jsonb NOT NULL,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"recorded_by" text,
	"previous_hash" text,
	"event_hash" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracking_event_log" ADD CONSTRAINT "tracking_event_log_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tracking_event_log" ADD CONSTRAINT "tracking_event_log_recorded_by_users_id_fk" FOREIGN KEY ("recorded_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tracking_event_log_shipment_hash_idx" ON "tracking_event_log" USING btree ("shipment_id");