CREATE MATERIALIZED VIEW IF NOT EXISTS shipment_status_summary AS
SELECT DISTINCT ON (shipment_id)
  shipment_id,
  type as current_status,
  occurred_at as last_updated_at,
  payload
FROM tracking_event_log
ORDER BY shipment_id, occurred_at DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_shipment_status_summary_shipment_id ON shipment_status_summary(shipment_id);

CREATE OR REPLACE FUNCTION refresh_shipment_status_summary()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY shipment_status_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS refresh_shipment_status_summary_trigger ON tracking_event_log;

CREATE TRIGGER refresh_shipment_status_summary_trigger
AFTER INSERT OR UPDATE OR DELETE ON tracking_event_log
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_shipment_status_summary();
