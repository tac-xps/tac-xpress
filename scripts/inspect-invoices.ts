import { config } from "dotenv"
import { resolve } from "path"
import postgres from "postgres"

config({ path: resolve(process.cwd(), ".env.local") })

async function inspectInvoices() {
  const sql = postgres(process.env.DATABASE_URL!)
  const invs = await sql`
    SELECT i.id, i.shipment_id, i.status, i.amount, i.whatsapp_status, 
           s.awb_number, s.consignor_name, s.consignor_phone, s.consignee_name, s.consignee_phone
    FROM invoices i
    LEFT JOIN shipments s ON i.shipment_id = s.id
    ORDER BY i.created_at DESC;
  `
  console.log("Found", invs.length, "invoices:")
  for (const inv of invs) {
    console.log({
      id: inv.id,
      awb: inv.awb_number,
      status: inv.status,
      consignorPhone: inv.consignor_phone,
      consigneePhone: inv.consignee_phone,
      whatsappStatus: inv.whatsapp_status,
    })
  }
  await sql.end()
}

inspectInvoices().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
