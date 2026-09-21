import { config } from "dotenv"
import { resolve } from "path"
import postgres from "postgres"

config({ path: resolve(process.cwd(), ".env.local") })

async function inspectLogs() {
  const sql = postgres(process.env.DATABASE_URL!)
  const logs = await sql`
    SELECT id, phone, message_type, status, template_name, related_invoice_id, 
           failure_reason, provider_payload, created_at
    FROM whatsapp_outbound_logs
    ORDER BY created_at DESC
    LIMIT 10;
  `
  console.log("Recent 10 WhatsApp outbound logs:")
  for (const log of logs) {
    console.log({
      id: log.id,
      phone: log.phone,
      status: log.status,
      template: log.template_name,
      invoice: log.related_invoice_id,
      failure: log.failure_reason,
      payload: log.provider_payload,
      at: log.created_at,
    })
  }
  await sql.end()
}

inspectLogs().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
