import { getAppUrl } from "../lib/config/app-url"

// Run in the deployment environment; never log secret values.
const errors: string[] = []
try { getAppUrl(process.env.NEXT_PUBLIC_APP_URL, "production") } catch (error) { errors.push((error as Error).message) }
for (const name of ["AUTH_SECRET", "NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ARCJET_KEY", "CRON_SECRET", "RESEND_API_KEY", "FROM_EMAIL", "INVOICE_PDF_SIGNING_SECRET", "SENTRY_DSN", "OPENROUTER_API", "MOBILE_API_SECRET"]) {
  const value = process.env[name]?.trim()
  if (!value || /placeholder|fill-in|dummy|example|ci-only|test-secret/i.test(value)) errors.push(`${name} is missing or contains a placeholder.`)
}
if (!process.env.SUPABASE_POOLER_URL && !process.env.DATABASE_URL) errors.push("A production database connection is required.")
for (const name of ["AUTH_SECRET", "CRON_SECRET", "INVOICE_PDF_SIGNING_SECRET", "MOBILE_API_SECRET"]) {
  if ((process.env[name]?.length ?? 0) < 32) errors.push(`${name} must be at least 32 characters.`)
}
for (const name of ["E2E_TEST_BYPASS_ENABLED", "NEXT_PUBLIC_E2E_TEST_BYPASS_ENABLED", "PLAYWRIGHT_TEST"]) {
  if (process.env[name] === "true") errors.push(`${name} must be disabled in production.`)
}
if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://ujyellrhwhqjmfponhuz.supabase.co") errors.push("Supabase URL does not match the approved tac-xpress project.")
if (process.env.WHATSAPP_ENABLED !== "true") errors.push("WhatsApp delivery is disabled; invoice delivery acceptance is incomplete.")
for (const name of ["WPBOX_API_TOKEN", "WPBOX_USER_ID", "WHATSAPP_APP_SECRET", "WHATSAPP_VERIFY_TOKEN"]) {
  if (!process.env[name]?.trim()) errors.push(`${name} is required for WhatsApp invoice delivery and callbacks.`)
}
if (errors.length) { errors.forEach(error => process.stderr.write(`${error}\n`)); process.exitCode = 1 }
else process.stdout.write("Production environment checks passed. Provider delivery and restore acceptance are separate checks.\n")
