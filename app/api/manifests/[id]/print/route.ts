import { db } from "@/lib/db"
import { manifests } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { format } from "date-fns"
import { requireDashboardApi } from "@/lib/auth/guards"
import { escapeHtml } from "@/lib/server/escape-html"

const MANIFEST_PRINT_TOKENS = {
  ink: "#191716",
  paper: "#ffffff",
  paperSubtle: "#f7f5f3",
  border: "#e2dedc",
  muted: "#66615e",
  statusDraftBg: "#f7f5f3",
  statusDraftText: "#66615e",
  statusFinalizedBg: "#d1fae5",
  statusFinalizedText: "#065f46",
  statusPendingBg: "#fef3c7",
  statusPendingText: "#92400e",
  statusTransitBg: "#dbeafe",
  statusTransitText: "#1e40af",
  statusDeliveredBg: "#d1fae5",
  statusDeliveredText: "#065f46",
  statusDelayedBg: "#fee2e2",
  statusDelayedText: "#991b1b",
} as const

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response

  const { id } = await params
  const { searchParams } = new URL(request.url)
  const autoprint = searchParams.get("autoprint") !== "false"

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
  <title>Manifest ${escapeHtml(manifest.referenceId)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; color: ${MANIFEST_PRINT_TOKENS.ink}; background: ${MANIFEST_PRINT_TOKENS.paper}; padding: 24px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid ${MANIFEST_PRINT_TOKENS.ink}; padding-bottom: 16px; margin-bottom: 20px; }
    .company { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .doc-title { font-size: 14px; font-weight: 700; color: ${MANIFEST_PRINT_TOKENS.muted}; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .ref { font-size: 20px; font-weight: 800; font-family: monospace; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 20px; padding: 16px; background: ${MANIFEST_PRINT_TOKENS.paperSubtle}; border: 1px solid ${MANIFEST_PRINT_TOKENS.border}; }
    .meta-item label { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${MANIFEST_PRINT_TOKENS.muted}; margin-bottom: 4px; }
    .meta-item span { font-size: 13px; font-weight: 600; }
    .status { display: inline-block; padding: 2px 8px; border-radius: 0; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .status-draft { background: #f0f0f0; color: ${MANIFEST_PRINT_TOKENS.muted}; }
    .status-finalized { background: ${MANIFEST_PRINT_TOKENS.statusFinalizedBg}; color: ${MANIFEST_PRINT_TOKENS.statusFinalizedText}; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    thead tr { background: ${MANIFEST_PRINT_TOKENS.ink}; color: ${MANIFEST_PRINT_TOKENS.paper}; }
    th { padding: 8px 10px; text-align: left; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
    td { padding: 8px 10px; border-bottom: 1px solid ${MANIFEST_PRINT_TOKENS.border}; font-size: 11px; vertical-align: top; }
    tr:nth-child(even) td { background: ${MANIFEST_PRINT_TOKENS.paperSubtle}; }
    .awb { font-family: monospace; font-weight: 700; font-size: 12px; }
    .route { color: ${MANIFEST_PRINT_TOKENS.muted}; }
    .weight { font-family: monospace; text-align: right; }
    .status-pill { padding: 2px 6px; border-radius: 0; font-size: 9px; font-weight: 700; text-transform: uppercase; }
    .pending { background: ${MANIFEST_PRINT_TOKENS.statusPendingBg}; color: ${MANIFEST_PRINT_TOKENS.statusPendingText}; }
    .in_transit { background: ${MANIFEST_PRINT_TOKENS.statusTransitBg}; color: ${MANIFEST_PRINT_TOKENS.statusTransitText}; }
    .delivered { background: ${MANIFEST_PRINT_TOKENS.statusFinalizedBg}; color: ${MANIFEST_PRINT_TOKENS.statusFinalizedText}; }
    .delayed { background: ${MANIFEST_PRINT_TOKENS.statusDelayedBg}; color: ${MANIFEST_PRINT_TOKENS.statusDelayedText}; }
    .summary { display: flex; justify-content: flex-end; gap: 32px; margin-top: 20px; padding-top: 16px; border-top: 1px solid ${MANIFEST_PRINT_TOKENS.border}; }
    .summary-item { text-align: right; }
    .summary-item label { display: block; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: ${MANIFEST_PRINT_TOKENS.muted}; }
    .summary-item span { font-size: 18px; font-weight: 800; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid ${MANIFEST_PRINT_TOKENS.border}; display: flex; justify-content: space-between; color: ${MANIFEST_PRINT_TOKENS.muted}; font-size: 10px; }
    .sig-box { width: 200px; border-bottom: 1px solid ${MANIFEST_PRINT_TOKENS.border}; padding-bottom: 40px; margin-top: 40px; }
    .sig-label { font-size: 10px; color: ${MANIFEST_PRINT_TOKENS.muted}; margin-top: 6px; }
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
      <div class="ref">${escapeHtml(manifest.referenceId)}</div>
      <div style="color:#666;margin-top:4px">${format(new Date(manifest.createdAt), "dd MMM yyyy, HH:mm")}</div>
      <div style="margin-top:6px"><span class="status status-${escapeHtml(manifest.status)}">${escapeHtml(manifest.status)}</span></div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      <label>Driver</label>
      <span>${escapeHtml((manifest as any).driver?.name ?? "Unassigned")}</span>
    </div>
    <div class="meta-item">
      <label>Driver Phone</label>
      <span>${escapeHtml((manifest as any).driver?.phone ?? "-")}</span>
    </div>
    <div class="meta-item">
      <label>Vehicle</label>
      <span>${escapeHtml((manifest as any).vehicle?.registrationNumber ?? "Unassigned")}</span>
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
        <td class="awb">${escapeHtml(item.shipment?.awbNumber ?? "-")}</td>
        <td>${escapeHtml(item.shipment?.consigneeName ?? "-")}</td>
        <td class="route">${item.shipment ? `${escapeHtml(item.shipment.origin)} → ${escapeHtml(item.shipment.destination)}` : "-"}</td>
        <td class="weight">${item.shipment?.weightKg != null ? item.shipment.weightKg.toFixed(1) : "-"}</td>
        <td><span class="status-pill ${escapeHtml(item.shipment?.status ?? "")}">${escapeHtml(item.shipment?.status?.replace("_", " ") ?? "-")}</span></td>
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
    <span>TAC-XPRESS | Dispatch Manifest System</span>
    <span>Ref: ${escapeHtml(manifest.referenceId)} | Generated: ${format(new Date(), "dd/MM/yyyy HH:mm")}</span>
  </div>

  ${autoprint ? "<script>window.onload = () => window.print();</script>" : ""}
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  })
}
