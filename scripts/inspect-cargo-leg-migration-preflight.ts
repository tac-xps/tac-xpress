import postgres from "postgres"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })
dotenv.config()

async function main() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.SUPABASE_POOLER_URL ||
    process.env.DIRECT_URL

  if (!connectionString) {
    console.error(
      "Missing DATABASE_URL, SUPABASE_POOLER_URL, or DIRECT_URL in environment."
    )
    process.exitCode = 1
    return
  }

  console.log("Connecting to database for cargo leg migration preflight...")
  const sql = postgres(connectionString, { max: 1, ssl: "require" })

  try {
    const results = await sql.begin(async (tx) => {
      // 1. Verify schema existence and set up temporary normalization views
      await tx.unsafe(`
        DO $$
        BEGIN
          IF to_regclass('public.shipments') IS NULL
             OR to_regclass('public.manifests') IS NULL
             OR to_regclass('public.manifest_items') IS NULL
             OR to_regclass('public.users') IS NULL
             OR to_regclass('public.tracking_events') IS NULL THEN
            RAISE EXCEPTION 'Required cargo tables are missing (shipments, manifests, manifest_items, users, tracking_events); stop and inspect schema history';
          END IF;

          CREATE OR REPLACE TEMP VIEW v_cargo_manifest_items AS
            SELECT id, manifest_id, shipment_id, created_at AS assigned_at
            FROM public.manifest_items;

          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'manifests' AND column_name = 'reference_id') THEN
            CREATE OR REPLACE TEMP VIEW v_cargo_manifests AS
              SELECT id, reference_id, status, created_at
              FROM public.manifests;
          ELSE
            CREATE OR REPLACE TEMP VIEW v_cargo_manifests AS
              SELECT id, manifest_number AS reference_id, status, created_at
              FROM public.manifests;
          END IF;

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
      `)

      const [shipmentLegs] = await tx.unsafe(`
        SELECT to_regclass('public.shipment_legs') IS NOT NULL AS shipment_legs_exists;
      `)

      const manifestCounts = await tx.unsafe(`
        SELECT status, count(*)::int AS manifest_count
        FROM v_cargo_manifests
        GROUP BY status
        ORDER BY status;
      `)

      const shipmentCounts = await tx.unsafe(`
        SELECT status, count(*)::int AS shipment_count
        FROM v_cargo_shipments
        GROUP BY status
        ORDER BY status;
      `)

      const duplicates = await tx.unsafe(`
        SELECT shipment_id, count(*)::int AS manifest_item_count,
               count(DISTINCT manifest_id)::int AS manifest_count
        FROM v_cargo_manifest_items
        GROUP BY shipment_id
        HAVING count(*) > 1
        ORDER BY manifest_item_count DESC, shipment_id;
      `)

      const proposedLegs = await tx.unsafe(`
        SELECT CASE
                 WHEN reference_id LIKE 'PU-%' THEN 'pickup'
                 WHEN reference_id LIKE 'DL-%' THEN 'delivery'
                 ELSE 'line_haul'
               END AS proposed_leg_type,
               status,
               count(*)::int AS manifest_count
        FROM v_cargo_manifests
        GROUP BY 1, status
        ORDER BY 1, status;
      `)

      const activeLoads = await tx.unsafe(`
        SELECT m.reference_id, m.status::text AS manifest_status, s.awb_number,
               s.status::text AS shipment_status, mi.assigned_at
        FROM v_cargo_manifest_items AS mi
        JOIN v_cargo_manifests AS m ON m.id = mi.manifest_id
        JOIN v_cargo_shipments AS s ON s.id = mi.shipment_id
        WHERE s.deleted_at IS NULL
          AND (m.status::text ILIKE 'draft' OR s.status::text ILIKE 'in-transit')
        ORDER BY m.created_at, s.awb_number;
      `)

      // Intentionally raise roll-back exception or exit transaction safely
      return {
        shipmentLegs: shipmentLegs?.shipment_legs_exists ?? false,
        manifestCounts,
        shipmentCounts,
        duplicates,
        proposedLegs,
        activeLoads,
      }
    })

    console.log("\n=== CARGO LEG MIGRATION PREFLIGHT REPORT ===")
    console.log(`Legacy shipment_legs table present: ${results.shipmentLegs}`)
    console.log("\nManifest Counts by Status:")
    console.table(results.manifestCounts)
    console.log("\nShipment Counts by Status:")
    console.table(results.shipmentCounts)
    console.log("\nProposed Leg Type Distribution:")
    console.table(results.proposedLegs)

    if (results.duplicates.length > 0) {
      console.warn(
        `\n⚠️ WARNING: Found ${results.duplicates.length} duplicate shipment assignment(s):`
      )
      console.table(results.duplicates)
      console.warn(
        "Resolve duplicate assignments before applying the unique partial index migration."
      )
      process.exitCode = 1
    } else {
      console.log(
        "\n✅ Duplicate Check Passed: 0 duplicate shipment assignments found."
      )
    }

    console.log(`\nActive / In-Flight Loads (${results.activeLoads.length}):`)
    if (results.activeLoads.length > 0) {
      console.table(results.activeLoads)
    } else {
      console.log("None.")
    }
    console.log("\nPreflight complete. Zero data mutations committed.")
  } catch (error) {
    console.error("Preflight inspection failed:", error)
    process.exitCode = 1
  } finally {
    await sql.end()
  }
}

main()
