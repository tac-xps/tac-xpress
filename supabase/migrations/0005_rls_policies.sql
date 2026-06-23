-- Enable Row Level Security on all core tables
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shipments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "manifests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tracking_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pricing_rules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "manifest_items" ENABLE ROW LEVEL SECURITY;

-- Create extremely permissive policies for MVP so that Supabase REST API works if needed,
-- but normally Next.js Server Components bypass RLS via direct connection.
CREATE POLICY "Allow authenticated read users" ON "users" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert users" ON "users" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update users" ON "users" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read shipments" ON "shipments" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert shipments" ON "shipments" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update shipments" ON "shipments" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read invoices" ON "invoices" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert invoices" ON "invoices" FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update invoices" ON "invoices" FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated read manifests" ON "manifests" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert manifests" ON "manifests" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read tracking_events" ON "tracking_events" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert tracking_events" ON "tracking_events" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read pricing_rules" ON "pricing_rules" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert pricing_rules" ON "pricing_rules" FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated read manifest_items" ON "manifest_items" FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert manifest_items" ON "manifest_items" FOR INSERT TO authenticated WITH CHECK (true);
