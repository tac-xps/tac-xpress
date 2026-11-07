-- migrations/0010_audit_log.sql
-- Audit log for tracking sensitive actions in the Customer Portal.
-- Every invoice download, document access, and auth event should log here.

CREATE TABLE IF NOT EXISTS audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email  text NOT NULL,
  action      text NOT NULL,  -- e.g. 'invoice_download', 'portal_login', 'portal_logout'
  resource_id text,           -- The ID of the resource being acted on (invoice_id, shipment_id, etc.)
  metadata    jsonb,          -- Arbitrary extra context (IP address, AWB, etc.)
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Index for email-based queries (e.g. "show me all actions by this user")
CREATE INDEX IF NOT EXISTS audit_log_user_email_idx ON audit_log (user_email);

-- Index for time-based queries (e.g. "show all downloads in the last 24h")
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at DESC);

-- RLS: Only service role (server-side) can insert. No public reads.
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- No SELECT policy for anon/authenticated — server only via service role key.
-- This prevents portal users from seeing their own audit trail (which would reveal
-- access patterns and could be used to probe other users' data).
