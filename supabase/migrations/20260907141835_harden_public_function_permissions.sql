-- Narrow reconciliation against the verified hosted function signatures.
-- Do not replay historical migrations against the populated hosted database.
ALTER FUNCTION public.get_resolution_metrics(integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.get_sla_breach_rate(integer) SET search_path = public, pg_temp;
ALTER FUNCTION public.update_first_reply() SET search_path = public, pg_temp;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;
