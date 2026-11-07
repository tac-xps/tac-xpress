-- 20261010000007_add_performance_and_audit_indexes.sql
-- High-throughput performance and operational analytics indexes.

-- Shipments range and composite indexes for analytics and dashboard lookups
CREATE INDEX IF NOT EXISTS shipments_booking_date_idx ON public.shipments (booking_date);
CREATE INDEX IF NOT EXISTS shipments_status_booking_date_idx ON public.shipments (status, booking_date);
CREATE INDEX IF NOT EXISTS shipments_created_at_idx ON public.shipments (created_at DESC);

-- Tickets support lifecycle indexes
CREATE INDEX IF NOT EXISTS tickets_created_at_idx ON public.tickets (created_at DESC);
CREATE INDEX IF NOT EXISTS tickets_status_created_at_idx ON public.tickets (status, created_at DESC);

-- Invoices revenue ledger index
CREATE INDEX IF NOT EXISTS invoices_created_at_idx ON public.invoices (created_at DESC);

-- Background jobs worker poll index
CREATE INDEX IF NOT EXISTS background_jobs_status_available_at_idx ON public.background_jobs (status, available_at);

-- Dead letter queue audit index
CREATE INDEX IF NOT EXISTS dead_letter_queue_created_at_idx ON public.dead_letter_queue (created_at DESC);

-- Audit log action timeline index
CREATE INDEX IF NOT EXISTS audit_log_action_created_at_idx ON public.audit_log (action, created_at DESC);
