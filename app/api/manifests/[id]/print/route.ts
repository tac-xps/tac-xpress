import { db } from "@/lib/db"
import { manifests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { format } from "date-fns"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const manifest = await db.query.manifests.findFirst({
    where: eq(manifests.id, id),
    with: {
      driver: true,
      vehicle: true,
      items: {
        with: {
          shipment: true,
        },
      },
    },
  })

  if (!manifest) {
    return new NextResponse("Manifest not found", { status: 404 })
  }

  const totalWeight = (manifest.items ?? []).reduce(
    (sum: number, item: any) => sum + (item.shipment?.weightKg ?? 0),
    0
  )

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Manifest ${manifest.referenceId}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: #111; background: #fff; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 16px; margin-bottom: 20px; }
    .company { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .doc-title { font-size: 14px; font-weight: 700; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .ref { font-size: 20px; font-weight: 800; font-family: monospace; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; padding: 16px; background: #f8f8f8; border: 1px solid #e0e0e0; }
    .meta-item label { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666; margin-bottom: 4px; }
    .meta-item span { font-size: 13px; font-weight: 600; }
    .status { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .status-draft { background: #f0f0f0; color: #666; }
    .status-finalized { background: #d1fae5; color: #065f46; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    thead tr { background: #111; color: #fff; }
    th { padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    td { padding: 8px 10px; border-bottom: 1px solid #e8e8e8; font-size: 11px; vertical-align: top; }
    tr:nth-child(even) td { background: #fafafa; }
    .awb { font-family: monospace; font-weight: 700; font-size: 12px; }
    .route { color: #555; }
    .weight { font-family: monospace; text-align: right; }
    .status-pill { padding: 2px 6px; border-radius: 3px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
    .pending { background: #fef3c7; color: #92400e; }
    .in_transit { background: #dbeafe; color: #1e40af; }
    .delivered { background: #d1fae5; color: #065f46; }
    .delayed { background: #fee2e2; color: #991b1b; }
    .summary { display: flex; justify-content: flex-end; gap: 32px; margin-top: 20px; padding-top: 16px; border-top: 1px solid #e0e0e0; }
    .summary-item { text-align: right; }
    .summary-item label { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #666; }
    .summary-item span { font-size: 18px; font-weight: 800; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #ccc; display: flex; justify-content: space-between; color: #888; font-size: 10px; }
    .sig-box { width: 200px; border-bottom: 1px solid #ccc; padding-bottom: 40px; margin-top: 40px; }
    .sig-label { font-size: 10px; color: #888; margin-top: 6px; }
    .sigs { display: flex; gap: 60px; margin-top: 24px; }
    @media print {
      body { padding: 0; }
      @page { margin: 20mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="company">TAC XPRESS</div>
      <div class="doc-title">Line-Haul Manifest</div>
    </div>
    <div style="text-align:right">
      <div class="ref">${manifest.referenceId}</div>
      <div style="color:#666;margin-top:4px">${format(new Date(manifest.createdAt), "dd MMM yyyy, HH:mm")}</div>
      <div style="margin-top:6px"><span class="status status-${manifest.status}">${manifest.status}</span></div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      <label>Driver</label>
      <span>${(manifest as any).driver?.name ?? "Unassigned"}</span>
    </div>
    <div class="meta-item">
      <label>Driver Phone</label>
      <span>${(manifest as any).driver?.phone ?? "—"}</span>
    </div>
    <div class="meta-item">
      <label>Vehicle</label>
      <span>${(manifest as any).vehicle?.registrationNumber ?? "Unassigned"}</span>
    </div>
    <div class="meta-item">
      <label>Printed On</label>
      <span>${format(new Date(), "dd MMM yyyy, HH:mm")}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>AWB Number</th>
        <th>Consignee</th>
        <th>Origin → Destination</th>
        <th>Weight (kg)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${(manifest.items ?? [])
        .map(
          (item: any, idx: number) => `
      <tr>
        <td>${idx + 1}</td>
        <td class="awb">${item.shipment?.awbNumber ?? "—"}</td>
        <td>${item.shipment?.consigneeName ?? "—"}</td>
        <td class="route">${item.shipment ? `${item.shipment.origin} → ${item.shipment.destination}` : "—"}</td>
        <td class="weight">${item.shipment?.weightKg != null ? item.shipment.weightKg.toFixed(1) : "—"}</td>
        <td><span class="status-pill ${item.shipment?.status ?? ""}">${item.shipment?.status?.replace("_", " ") ?? "—"}</span></td>
      </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="summary">
    <div class="summary-item">
      <label>Total AWBs</label>
      <span>${(manifest.items ?? []).length}</span>
    </div>
    <div class="summary-item">
      <label>Total Weight</label>
      <span>${totalWeight.toFixed(1)} kg</span>
    </div>
  </div>

  <div class="sigs">
    <div>
      <div class="sig-box"></div>
      <div class="sig-label">Driver Signature</div>
    </div>
    <div>
      <div class="sig-box"></div>
      <div class="sig-label">Hub Supervisor Signature</div>
    </div>
  </div>

  <div class="footer">
    <span>TAC Xpress — Dispatch Manifest System</span>
    <span>Ref: ${manifest.referenceId} | Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}</span>
  </div>

  <script>window.onload = () => window.print();</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  })
}
