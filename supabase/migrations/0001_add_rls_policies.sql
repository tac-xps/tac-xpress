-- Enable RLS on all tables
ALTER TABLE "organizations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shipments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "warehouses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "inventory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tracking_events" ENABLE ROW LEVEL SECURITY;

-- Organizations
CREATE POLICY "Users view their own org"
  ON "organizations" FOR SELECT
  USING (id IN (
    SELECT org_id FROM "users" WHERE id = auth.uid()
  ));

-- Users
CREATE POLICY "Users view org members"
  ON "users" FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM "users" WHERE id = auth.uid()
  ));

-- Shipments
CREATE POLICY "Users view org shipments"
  ON "shipments" FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM "users" WHERE id = auth.uid()
  ));

-- Warehouses
CREATE POLICY "Users view org warehouses"
  ON "warehouses" FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM "users" WHERE id = auth.uid()
  ));

-- Inventory
CREATE POLICY "Users view org inventory"
  ON "inventory" FOR SELECT
  USING (warehouse_id IN (
    SELECT w.id FROM "warehouses" w
    JOIN "users" u ON w.org_id = u.org_id
    WHERE u.id = auth.uid()
  ));

-- Tracking Events
CREATE POLICY "Users view shipment tracking events"
  ON "tracking_events" FOR SELECT
  USING (shipment_id IN (
    SELECT s.id FROM "shipments" s
    JOIN "users" u ON s.org_id = u.org_id
    WHERE u.id = auth.uid()
  ));
