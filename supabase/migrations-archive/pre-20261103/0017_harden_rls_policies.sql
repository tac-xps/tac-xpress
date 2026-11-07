ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shipments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "manifests" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tracking_events" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pricing_rules" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "manifest_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tickets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_replies" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read users" ON "users";
DROP POLICY IF EXISTS "Allow authenticated insert users" ON "users";
DROP POLICY IF EXISTS "Allow authenticated update users" ON "users";
DROP POLICY IF EXISTS "Allow authenticated read shipments" ON "shipments";
DROP POLICY IF EXISTS "Allow authenticated insert shipments" ON "shipments";
DROP POLICY IF EXISTS "Allow authenticated update shipments" ON "shipments";
DROP POLICY IF EXISTS "Allow authenticated read invoices" ON "invoices";
DROP POLICY IF EXISTS "Allow authenticated insert invoices" ON "invoices";
DROP POLICY IF EXISTS "Allow authenticated update invoices" ON "invoices";
DROP POLICY IF EXISTS "Allow authenticated read manifests" ON "manifests";
DROP POLICY IF EXISTS "Allow authenticated insert manifests" ON "manifests";
DROP POLICY IF EXISTS "Allow authenticated read tracking_events" ON "tracking_events";
DROP POLICY IF EXISTS "Allow authenticated insert tracking_events" ON "tracking_events";
DROP POLICY IF EXISTS "Allow authenticated read pricing_rules" ON "pricing_rules";
DROP POLICY IF EXISTS "Allow authenticated insert pricing_rules" ON "pricing_rules";
DROP POLICY IF EXISTS "Allow authenticated read manifest_items" ON "manifest_items";
DROP POLICY IF EXISTS "Allow authenticated insert manifest_items" ON "manifest_items";
DROP POLICY IF EXISTS "Enable read access for anon users tickets" ON "tickets";
DROP POLICY IF EXISTS "Enable read access for anon users ticket_replies" ON "ticket_replies";
DROP POLICY IF EXISTS "Enable insert for anon users tickets" ON "tickets";
DROP POLICY IF EXISTS "Enable read access for public tracking events tracking" ON "tracking_events";
DROP POLICY IF EXISTS "Enable read access for public shipments shipments" ON "shipments";

CREATE POLICY "users_self_or_staff_select"
ON "users"
FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "users_self_or_staff_update"
ON "users"
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "users_self_insert"
ON "users"
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  OR EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "shipments_public_tracking"
ON "shipments"
FOR SELECT
TO anon, authenticated
USING (COALESCE(is_publicly_trackable, false) = true);

CREATE POLICY "shipments_staff_all"
ON "shipments"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "tracking_events_public_tracking"
ON "tracking_events"
FOR SELECT
TO anon, authenticated
USING (COALESCE(is_public, false) = true);

CREATE POLICY "tracking_events_staff_all"
ON "tracking_events"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "invoices_staff_all"
ON "invoices"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "manifests_staff_all"
ON "manifests"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "pricing_rules_staff_all"
ON "pricing_rules"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "manifest_items_staff_all"
ON "manifest_items"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "tickets_public_insert"
ON "tickets"
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "tickets_staff_all"
ON "tickets"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

CREATE POLICY "ticket_replies_staff_all"
ON "ticket_replies"
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.users staff_user
    WHERE staff_user.id = auth.uid()
      AND staff_user.role IN ('admin', 'staff')
      AND staff_user.deleted_at IS NULL
  )
);

NOTIFY pgrst, 'reload schema';
