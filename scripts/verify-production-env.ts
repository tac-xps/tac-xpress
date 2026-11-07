import { getAppUrl } from "../lib/config/app-url"
import { getWhatsAppConfig } from "../lib/whatsapp/config"
import { z } from "zod"

// Run in the deployment environment; never log secret values.
const errors: string[] = []
try {
  getAppUrl(process.env.NEXT_PUBLIC_APP_URL, "production")
} catch (error) {
  errors.push((error as Error).message)
}
for (const name of [
  "AUTH_SECRET",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ARCJET_KEY",
  "CRON_SECRET",
  "RESEND_API_KEY",
  "FROM_EMAIL",
  "INVOICE_PDF_SIGNING_SECRET",
  "SENTRY_DSN",
  "OPENROUTER_API",
  "MOBILE_API_SECRET",
]) {
  const value = process.env[name]?.trim()
  if (
    !value ||
    /placeholder|fill-in|dummy|example|ci-only|test-secret/i.test(value)
  )
    errors.push(`${name} is missing or contains a placeholder.`)
}
const dbUrl = process.env.SUPABASE_POOLER_URL || process.env.DATABASE_URL
if (!dbUrl) {
  errors.push("A production database connection is required.")
} else if (dbUrl.includes("pooler.supabase.com")) {
  try {
    const port = new URL(dbUrl).port
    if (!["5432", "6543"].includes(port))
      errors.push("Supabase pooler must explicitly select port 5432 or 6543.")
    else if (port === "5432")
      process.stderr.write(
        "Session pooler selected. Verify serverless connection capacity and hosted acceptance separately.\n"
      )
  } catch {
    errors.push("The Supabase pooler URL is invalid.")
  }
}
for (const name of [
  "AUTH_SECRET",
  "CRON_SECRET",
  "INVOICE_PDF_SIGNING_SECRET",
  "MOBILE_API_SECRET",
]) {
  if ((process.env[name]?.length ?? 0) < 32)
    errors.push(`${name} must be at least 32 characters.`)
}
for (const name of [
  "E2E_TEST_BYPASS_ENABLED",
  "NEXT_PUBLIC_E2E_TEST_BYPASS_ENABLED",
  "PLAYWRIGHT_TEST",
]) {
  if (process.env[name] === "true")
    errors.push(`${name} must be disabled in production.`)
}
const approvedSupabaseUrls = ["https://ujyellrhwhqjmfponhuz.supabase.co"]
if (!approvedSupabaseUrls.includes(process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""))
  errors.push("Supabase URL does not match the approved tac-xpress project.")
if (process.env.WHATSAPP_ENABLED !== "true")
  errors.push(
    "WhatsApp delivery is disabled; invoice delivery acceptance is incomplete."
  )
for (const name of ["WPBOX_API_TOKEN", "WPBOX_USER_ID"]) {
  if (!process.env[name]?.trim())
    errors.push(`${name} is required for outbound LeminAI messaging.`)
}
const whatsapp = getWhatsAppConfig()
if (!whatsapp.metaWebhookConfigured) {
  if (whatsapp.appSecret || whatsapp.verifyToken) {
    errors.push(
      "Meta callbacks require both WHATSAPP_APP_SECRET and WHATSAPP_VERIFY_TOKEN."
    )
  } else {
    process.stderr.write(
      "Meta callbacks are not configured. Verify LeminAI callback authentication and delivery receipts separately.\n"
    )
  }
}
const operationsEmail =
  process.env.OPS_NOTIFICATION_EMAIL?.trim() || process.env.ADMIN_EMAIL?.trim()
if (!operationsEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(operationsEmail)) {
  errors.push(
    "OPS_NOTIFICATION_EMAIL or ADMIN_EMAIL must identify the operations notification recipient."
  )
}
for (const name of ["FROM_EMAIL", "RESEND_FROM_EMAIL"]) {
  const sender = process.env[name]?.trim() ?? ""
  if (name === "RESEND_FROM_EMAIL" && !sender) continue
  const senderAddress = /[<>]/.test(sender)
    ? sender.match(/^[^<>\r\n]+<([^<>\r\n]+)>$/)?.[1]?.trim()
    : sender
  const parsedSender = z.email().safeParse(senderAddress)
  if (!parsedSender.success) {
    errors.push(`${name} must contain a valid sender address.`)
  } else {
    const senderDomain = parsedSender.data.split("@")[1].toLowerCase()
    if (
      [
        "gmail.com",
        "googlemail.com",
        "outlook.com",
        "hotmail.com",
        "yahoo.com",
        "icloud.com",
      ].includes(senderDomain)
    ) {
      errors.push(
        `${name} must use an owned, verified Resend domain. Keep personal mailboxes as recipients only.`
      )
    }
  }
}
if (errors.length) {
  errors.forEach((error) => process.stderr.write(`${error}\n`))
  process.exitCode = 1
} else
  process.stdout.write(
    "Production environment checks passed. Sender-domain verification, provider delivery, callback authentication, and restore acceptance are separate checks.\n"
  )
