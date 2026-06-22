-- migrations/0012_ai_triage.sql
-- Add AI triage columns to tickets table

ALTER TABLE tickets ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('delay', 'damage', 'billing', 'general', 'lost'));
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2) DEFAULT 0.00;
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ai_routing TEXT; -- e.g., 'auto_resolved', 'agent_queue', 'escalation'
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS ai_auto_reply_enabled BOOLEAN DEFAULT true;

-- Update existing tickets to have a default category of 'general' to satisfy the CHECK constraint if needed,
-- but since the column is nullable, we don't strictly need to backfill unless required by application logic.
-- However, we'll set a default for existing rows just in case.
UPDATE tickets SET category = 'general' WHERE category IS NULL;

-- Optional: Create an index on ai_routing for queue views
CREATE INDEX IF NOT EXISTS tickets_ai_routing_idx ON tickets (ai_routing);
