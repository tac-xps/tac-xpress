-- squawk:ignore-file require-concurrent-index-creation
-- Note: Supabase CLI migration runners execute migration scripts in an implicit transaction block where
-- `CREATE INDEX CONCURRENTLY` is disallowed by PostgreSQL. For high-throughput live production environments,
-- execute these index creation statements concurrently via a non-transactional deployment session.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Users
CREATE INDEX IF NOT EXISTS users_name_trgm_idx ON users USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS users_email_trgm_idx ON users USING gin (email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS users_phone_trgm_idx ON users USING gin (phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS users_city_trgm_idx ON users USING gin (city gin_trgm_ops);

-- Tickets
CREATE INDEX IF NOT EXISTS tickets_subject_trgm_idx ON tickets USING gin (subject gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tickets_customer_name_trgm_idx ON tickets USING gin (customer_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tickets_customer_email_trgm_idx ON tickets USING gin (customer_email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS tickets_awb_number_trgm_idx ON tickets USING gin (awb_number gin_trgm_ops);

-- Shipments
CREATE INDEX IF NOT EXISTS shipments_awb_number_trgm_idx ON shipments USING gin (awb_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS shipments_consignor_name_trgm_idx ON shipments USING gin (consignor_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS shipments_consignee_name_trgm_idx ON shipments USING gin (consignee_name gin_trgm_ops);

-- Manifests
CREATE INDEX IF NOT EXISTS manifests_reference_id_trgm_idx ON manifests USING gin (reference_id gin_trgm_ops);

-- Hubs
CREATE INDEX IF NOT EXISTS hubs_name_trgm_idx ON hubs USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS hubs_location_trgm_idx ON hubs USING gin (location gin_trgm_ops);

-- Feedback
CREATE INDEX IF NOT EXISTS feedback_name_trgm_idx ON feedback USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS feedback_email_trgm_idx ON feedback USING gin (email gin_trgm_ops);

-- Vehicles & Drivers
CREATE INDEX IF NOT EXISTS vehicles_reg_number_trgm_idx ON vehicles USING gin (registration_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS drivers_name_trgm_idx ON drivers USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS drivers_phone_trgm_idx ON drivers USING gin (phone gin_trgm_ops);
CREATE INDEX IF NOT EXISTS drivers_license_trgm_idx ON drivers USING gin (license_number gin_trgm_ops);
