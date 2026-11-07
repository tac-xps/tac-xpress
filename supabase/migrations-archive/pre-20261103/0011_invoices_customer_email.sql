-- migrations/0011_invoices_customer_email.sql
-- Denormalize customer_email onto invoices for efficient portal queries.
-- Avoids a join through shipments on every portal page load.

ALTER TABLE invoices ADD COLUMN IF NOT EXISTS customer_email text;

-- Backfill from the shipments join
UPDATE invoices i
SET customer_email = s.customer_email
FROM shipments s
WHERE i.shipment_id = s.id
  AND s.customer_email IS NOT NULL;

-- Index for portal queries
CREATE INDEX IF NOT EXISTS invoices_customer_email_idx ON invoices (customer_email);

-- Optional: add invoice_date alias if not present (invoices use created_at)
-- No alter needed — created_at already exists on invoices.
