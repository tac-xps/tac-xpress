-- Verified against the current hosted policy names and columns.
-- Server-managed roles cannot be changed through the public Data API.
ALTER POLICY "Enable read access for all users" ON public.profiles TO authenticated USING ((select auth.uid()) = id);
ALTER POLICY "Enable update for users based on id" ON public.profiles TO authenticated USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);
REVOKE ALL ON public.profiles FROM anon;
REVOKE UPDATE, INSERT, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.profiles FROM PUBLIC, authenticated;
GRANT UPDATE (full_name, avatar_url, email_notifications, whatsapp_notifications, sms_notifications) ON public.profiles TO authenticated;
