-- READ ONLY. Run only against the intended staging project after checking its ref.
-- This reports candidate data. It does not infer receipt or assignment outcomes.
BEGIN TRANSACTION READ ONLY;

DO $$
BEGIN
  IF to_regclass('public.shipments') IS NULL
     OR to_regclass('public.manifests') IS NULL
     OR to_regclass('public.manifest_items') IS NULL THEN
    RAISE EXCEPTION 'Required cargo tables are missing; stop and inspect schema history';
  END IF;
END
$$;

SELECT to_regclass('public.shipment_legs') IS NOT NULL AS shipment_legs_exists;

SELECT status, count(*) AS manifest_count
FROM public.manifests
GROUP BY status
ORDER BY status;

SELECT status, count(*) AS shipment_count
FROM public.shipments
GROUP BY status
ORDER BY status;

-- The migration draft stops if any shipment has more than one historical row.
SELECT shipment_id, count(*) AS manifest_item_count,
       count(DISTINCT manifest_id) AS manifest_count
FROM public.manifest_items
GROUP BY shipment_id
HAVING count(*) > 1
ORDER BY manifest_item_count DESC, shipment_id;

-- Review legacy dispatch reference prefixes before using draft classification.
SELECT CASE
         WHEN reference_id LIKE 'PU-%' THEN 'pickup'
         WHEN reference_id LIKE 'DL-%' THEN 'delivery'
         ELSE 'line_haul'
       END AS proposed_leg_type,
       status,
       count(*) AS manifest_count
FROM public.manifests
GROUP BY proposed_leg_type, status
ORDER BY proposed_leg_type, status;

-- These active rows would be retained by the additive migration. Confirm each
-- draft or in-transit assignment still represents cargo on that load.
SELECT m.reference_id, m.status AS manifest_status, s.awb_number,
       s.status AS shipment_status, mi.created_at AS assigned_at
FROM public.manifest_items AS mi
JOIN public.manifests AS m ON m.id = mi.manifest_id
JOIN public.shipments AS s ON s.id = mi.shipment_id
WHERE s.deleted_at IS NULL
  AND (m.status = 'draft' OR s.status = 'in-transit')
ORDER BY m.created_at, s.awb_number;

ROLLBACK;
