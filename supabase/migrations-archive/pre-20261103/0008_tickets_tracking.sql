-- Tickets Table modifications
CREATE TABLE IF NOT EXISTS "tickets" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "customer_name" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "customer_email" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "customer_phone" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "subject" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "message" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "category" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'open';
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "priority" text DEFAULT 'medium';
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "assigned_to" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "related_awb" text;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "resolved_at" timestamp;
ALTER TABLE "tickets" ADD COLUMN IF NOT EXISTS "source" text;

-- Ticket Replies Table
CREATE TABLE IF NOT EXISTS "ticket_replies" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "ticket_id" uuid REFERENCES "tickets"("id") ON DELETE CASCADE;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "message" text;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "is_internal" boolean DEFAULT false NOT NULL;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "sender_type" text;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "sender_id" text;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "sender_name" text;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "sender_email" text;
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;

-- Shipments Table modifications
CREATE TABLE IF NOT EXISTS "shipments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "awb_number" text UNIQUE;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "origin" text;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "destination" text;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "status" text;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "service" text;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "weight" text;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "customer_name" text;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "estimated_delivery" timestamp;
ALTER TABLE "shipments" ADD COLUMN IF NOT EXISTS "is_publicly_trackable" boolean DEFAULT false NOT NULL;

-- Tracking Events Table
CREATE TABLE IF NOT EXISTS "tracking_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL
);
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "awb_number" text;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "event_type" text;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "location" text;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "location_code" text;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "description" text;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "event_time" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "logged_by" text;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "is_public" boolean DEFAULT false NOT NULL;
ALTER TABLE "tracking_events" ADD COLUMN IF NOT EXISTS "notes" text;

-- Real-time publication
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime;
COMMIT;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE ticket_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE tracking_events;
ALTER PUBLICATION supabase_realtime ADD TABLE shipments;

-- RLS Policies
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_replies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shipments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tracking_events" ENABLE ROW LEVEL SECURITY;

-- Clean existing policies so we don't duplicate
DO $$ BEGIN
    DROP POLICY IF EXISTS "Enable insert for anon users tickets" ON "tickets";
    DROP POLICY IF EXISTS "Enable read access for anon users tickets" ON "tickets";
    DROP POLICY IF EXISTS "Enable read access for anon users ticket_replies" ON "ticket_replies";
    DROP POLICY IF EXISTS "Enable read access for public tracking events tracking" ON "tracking_events";
    DROP POLICY IF EXISTS "Enable read access for public shipments shipments" ON "shipments";
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Allow public inserts for landing page ticket creation
CREATE POLICY "Enable insert for anon users tickets" ON "tickets" FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read access for anon users tickets" ON "tickets" FOR SELECT USING (true);
CREATE POLICY "Enable read access for anon users ticket_replies" ON "ticket_replies" FOR SELECT USING (true);
CREATE POLICY "Enable read access for public tracking events tracking" ON "tracking_events" FOR SELECT USING (is_public = true);
CREATE POLICY "Enable read access for public shipments shipments" ON "shipments" FOR SELECT USING (is_publicly_trackable = true);

NOTIFY pgrst, 'reload schema';
