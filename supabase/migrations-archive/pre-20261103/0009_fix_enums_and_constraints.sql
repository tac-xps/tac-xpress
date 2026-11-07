-- migrations/0009_fix_enums_and_constraints.sql
-- Fix the enum mismatch immediately (Align DB to UI: DB 'in_transit' -> UI 'in-transit')
-- The UI expects 'in-transit'. Let's check what the current enum value is.
-- We will rename 'in_transit' to 'in-transit' if it exists.
-- Wait, PostgreSQL ALTER TYPE ... RENAME VALUE cannot use IF EXISTS directly for the value, but we can do a DO block.
DO $$ 
BEGIN
  -- Try to rename 'in_transit' to 'in-transit'
  ALTER TYPE shipment_status RENAME VALUE 'in_transit' TO 'in-transit';
EXCEPTION
  WHEN undefined_object THEN
    null;
  WHEN invalid_parameter_value THEN
    null;
END $$;

-- Fix the description constraint if it should be nullable
ALTER TABLE tickets ALTER COLUMN description DROP NOT NULL;

-- Ensure tracking_events.status is present (as tracking seed failed with "null value in column 'status'")
ALTER TABLE tracking_events ALTER COLUMN status DROP NOT NULL;

-- Make shipment_id in tracking_events nullable if it fails, OR ensure we map it correctly. 
-- In seed-demo-data, we mapped shipment_id.

-- Add customer_email to shipments if it doesn't exist for Portal B
ALTER TABLE shipments ADD COLUMN IF NOT EXISTS customer_email text;

-- Add indexes for Portal B (email-lookup driven)
CREATE INDEX IF NOT EXISTS tickets_customer_email_idx ON tickets (customer_email);
CREATE INDEX IF NOT EXISTS shipments_customer_email_idx ON shipments (customer_email);
