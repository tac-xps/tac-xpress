-- Add immutable document snapshot and terms versioning to invoices
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS document_snapshot jsonb;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS terms_version text DEFAULT '2026.10';
