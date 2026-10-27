-- Drop the overly permissive public tracking policy
DROP POLICY IF EXISTS "shipments_public_tracking" ON "shipments";

-- Create a secure view for public tracking
CREATE OR REPLACE VIEW "public_shipments" AS
SELECT 
    awb_number, 
    origin, 
    destination, 
    status, 
    service_type, 
    service, 
    created_at, 
    estimated_delivery,
    is_publicly_trackable
FROM "shipments"
WHERE is_publicly_trackable = true;

-- Grant access to anon and authenticated
GRANT SELECT ON "public_shipments" TO anon, authenticated;
