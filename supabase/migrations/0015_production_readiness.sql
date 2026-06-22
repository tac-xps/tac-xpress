-- Migration 0015: Production Readiness
-- Dead Letter Queue for failed external integrations

CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- e.g., 'ai_triage', 'whatsapp_send', 'sla_apply'
  payload JSONB NOT NULL,
  error TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Index for efficient scanning of unresolved failures
CREATE INDEX IF NOT EXISTS idx_dlq_unresolved ON dead_letter_queue (created_at) WHERE resolved_at IS NULL;
