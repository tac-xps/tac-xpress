-- migrations/0013_sla_engine.sql

-- 1. SLA Policies
CREATE TABLE IF NOT EXISTS sla_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  category TEXT CHECK (category IN ('delay', 'damage', 'billing', 'general', 'lost')),
  first_response_minutes INTEGER NOT NULL DEFAULT 240,
  resolution_minutes INTEGER NOT NULL DEFAULT 2880,
  escalation_threshold DECIMAL(3,2) NOT NULL DEFAULT 0.80,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add SLA tracking to tickets
ALTER TABLE tickets 
  ADD COLUMN IF NOT EXISTS sla_deadline_first_response TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_deadline_resolution TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sla_breached BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sla_breach_type TEXT CHECK (sla_breach_type IN ('first_response', 'resolution')),
  ADD COLUMN IF NOT EXISTS sla_at_risk BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS first_reply_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS assigned_team TEXT;

-- 3. Notifications / Alert Queue
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('sla_at_risk', 'sla_breached', 'escalation', 'agent_assigned')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ
);

-- 4. Trigger: Auto-set first_reply_at when first reply is inserted
CREATE OR REPLACE FUNCTION update_first_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tickets 
  SET first_reply_at = NEW.created_at 
  WHERE id = NEW.ticket_id 
  AND first_reply_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_first_reply ON ticket_replies;
CREATE TRIGGER trigger_first_reply
AFTER INSERT ON ticket_replies
FOR EACH ROW
EXECUTE FUNCTION update_first_reply();

-- 5. Performance indexes
CREATE INDEX IF NOT EXISTS idx_tickets_sla_breach ON tickets(sla_breached) WHERE sla_breached = true;
CREATE INDEX IF NOT EXISTS idx_tickets_sla_deadlines ON tickets(sla_deadline_first_response, sla_deadline_resolution) WHERE status NOT IN ('resolved');
CREATE INDEX IF NOT EXISTS idx_notifications_pending ON notifications(status) WHERE status = 'pending';

-- 6. Seed default policies
INSERT INTO sla_policies (name, priority, first_response_minutes, resolution_minutes, escalation_threshold) VALUES
('Critical', 'critical', 60, 240, 0.80),
('High', 'high', 240, 1440, 0.80),
('Medium', 'medium', 480, 2880, 0.80),
('Low', 'low', 1440, 10080, 0.80);

-- SLA Breach Rate by Priority Function
CREATE OR REPLACE FUNCTION get_sla_breach_rate(days_back INTEGER)
RETURNS TABLE(priority TEXT, total BIGINT, breached BIGINT, rate DECIMAL) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.priority,
    COUNT(*)::BIGINT as total,
    SUM(CASE WHEN t.sla_breached THEN 1 ELSE 0 END)::BIGINT as breached,
    ROUND(100.0 * SUM(CASE WHEN t.sla_breached THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 2) as rate
  FROM tickets t
  WHERE t.created_at > NOW() - (days_back || ' days')::INTERVAL
  GROUP BY t.priority
  ORDER BY rate DESC;
END;
$$ LANGUAGE plpgsql;

-- Average Resolution Time & AI Touch Rate Function
CREATE OR REPLACE FUNCTION get_resolution_metrics(days_back INTEGER)
RETURNS TABLE(
  total_resolved BIGINT,
  avg_resolution_hours DECIMAL,
  ai_touched BIGINT,
  ai_touch_rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT t.id)::BIGINT as total_resolved,
    ROUND(AVG(EXTRACT(EPOCH FROM (t.updated_at - t.created_at))/3600)::numeric, 2) as avg_resolution_hours,
    COUNT(DISTINCT CASE WHEN tr.ticket_id IS NOT NULL THEN t.id END)::BIGINT as ai_touched,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN tr.ticket_id IS NOT NULL THEN t.id END) / NULLIF(COUNT(DISTINCT t.id), 0), 2) as ai_touch_rate
  FROM tickets t
  LEFT JOIN (
    SELECT DISTINCT ticket_id FROM ticket_replies WHERE sender_type = 'ai'
  ) tr ON tr.ticket_id = t.id
  WHERE t.status IN ('resolved')
  AND t.created_at > NOW() - (days_back || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql;
