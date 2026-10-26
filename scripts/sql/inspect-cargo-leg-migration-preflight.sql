-- READ ONLY preflight inspection.
-- Run only against the intended staging project after checking its ref.
-- Supports both modern (manifest_items) and legacy (manifest_shipments) schemas.
-- Reports candidate data without inferring receipt or assignment outcomes.
BEGIN;

DO $$
BEGIN
  IF to_regclass('public.shipments') IS NULL
     OR to_regclass('public.manifests') IS NULL
     OR (to_regclass('public.manifest_items') IS NULL AND to_regclass('public.manifest_shipments') IS NULL) THEN
    RAISE EXCEPTION 'Required cargo tables are missing; stop and inspect schema history';
  END IF;

  -- Normalize manifest items across legacy and modern table structures
  IF to_regclass('public.manifest_items') IS NOT NULL THEN
    CREATE OR REPLACE TEMP VIEW v_cargo_manifest_items AS
      SELECT id, manifest_id, shipment_id, created_at AS assigned_at
      FROM public.manifest_items;
  ELSE
    CREATE OR REPLACE TEMP VIEW v_cargo_manifest_items AS
      SELECT id, manifest_id, shipment_id, added_at AS assigned_at
      FROM public.manifest_shipments;
  END IF;

  -- Normalize manifests across legacy manifest_number and modern reference_id
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'manifests' AND column_name = 'reference_id') THEN
    CREATE OR REPLACE TEMP VIEW v_cargo_manifests AS
      SELECT id, reference_id, status, created_at
      FROM public.manifests;
  ELSE
    CREATE OR REPLACE TEMP VIEW v_cargo_manifests AS
      SELECT id, manifest_number AS reference_id, status, created_at
      FROM public.manifests;
  END IF;

  -- Normalize shipments across legacy cancelled_at and modern deleted_at
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'shipments' AND column_name = 'deleted_at') THEN
    CREATE OR REPLACE TEMP VIEW v_cargo_shipments AS
      SELECT id, awb_number, status, deleted_at, created_at
      FROM public.shipments;
  ELSE
    CREATE OR REPLACE TEMP VIEW v_cargo_shipments AS
      SELECT id, awb_number, status, cancelled_at AS deleted_at, created_at
      FROM public.shipments;
  END IF;
END
$$;

-- 1. Check legacy shipment legs table existence
SELECT to_regclass('public.shipment_legs') IS NOT NULL AS shipment_legs_exists;

-- 2. Manifest counts by status
SELECT status, count(*) AS manifest_count
FROM v_cargo_manifests
GROUP BY status
ORDER BY status;

-- 3. Shipment counts by status
SELECT status, count(*) AS shipment_count
FROM v_cargo_shipments
GROUP BY status
ORDER BY status;

-- 4. Check for duplicate historical assignments (migration abort condition)
SELECT shipment_id, count(*) AS manifest_item_count,
       count(DISTINCT manifest_id) AS manifest_count
FROM v_cargo_manifest_items
GROUP BY shipment_id
HAVING count(*) > 1
ORDER BY manifest_item_count DESC, shipment_id;

-- 5. Review legacy dispatch reference prefixes before using draft classification
SELECT CASE
         WHEN reference_id LIKE 'PU-%' THEN 'pickup'
         WHEN reference_id LIKE 'DL-%' THEN 'delivery'
         ELSE 'line_haul'
       END AS proposed_leg_type,
       status,
       count(*) AS manifest_count
FROM v_cargo_manifests
GROUP BY 1, status
ORDER BY 1, status;

-- 6. Active load inspection: draft manifests or in-transit shipments
SELECT m.reference_id, m.status::text AS manifest_status, s.awb_number,
       s.status::text AS shipment_status, mi.assigned_at
FROM v_cargo_manifest_items AS mi
JOIN v_cargo_manifests AS m ON m.id = mi.manifest_id
JOIN v_cargo_shipments AS s ON s.id = mi.shipment_id
WHERE s.deleted_at IS NULL
  AND (m.status::text ILIKE 'draft' OR s.status::text ILIKE 'in-transit')
ORDER BY m.created_at, s.awb_number;

ROLLBACK;
