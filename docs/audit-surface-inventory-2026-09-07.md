> Historical inventory. See the [current audit](nordic-lagom-audit-2026-09-07.md) and [route inventory](../artifacts/route-source-audit.json) for the later staff-only redesign.

# Audit surface inventory — 7 September 2026

This inventory records scope, not a claim of exhaustive line-by-line review. Application code, database migrations, configuration, test and release surfaces were indexed. Critical auth, data access, public input, messaging and shared UI paths received targeted review.

Source inventory at completion, excluding generated screenshots and machine evidence:

- app: 220 files
- components: 204 files
- hooks: 8 files
- lib: 41 files
- utils: 3 files
- supabase: 43 files
- tests: 3 files
- __tests__: 10 files
- docs: 128 files

## Routes

| File | Runtime evidence |
| --- | --- |
| `app/(auth)/signin/page.tsx` | Responsive accessibility and required-field checks; real sign-in acceptance pending |
| `app/api/auth/capabilities/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/auth/[...nextauth]/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/chat/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/cron/sla-check/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/customers/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/documents/download/route.ts` | Anonymous access denied in browser tests; PDF generation acceptance pending |
| `app/api/documents/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/drivers/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/fleet/telemetry/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/health/route.ts` | Anonymous access denied in browser tests |
| `app/api/manifests/[id]/print/route.ts` | Anonymous access denied in browser tests; staff printing acceptance pending |
| `app/api/public/invoice-pdf/route.ts` | Unsigned jobs denied in browser tests; token unit tests; rendering acceptance pending |
| `app/api/sentry-example-api/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/stream/tracking/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/vehicles/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/webhooks/carrier/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/api/webhooks/whatsapp/route.ts` | Static inspection; authenticated/provider acceptance pending |
| `app/auth/callback/route.ts` | Unit tests and invalid-link browser recovery |
| `app/dashboard/analytics/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/customers/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/customers/[id]/ledger/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/dispatch/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/fleet/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/hubs/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/integrations/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/invoices/create/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/invoices/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/manifests/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/messages/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/metrics/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/operations/air-cargo/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/operations/surface-cargo/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/page.tsx` | Anonymous access denied in browser tests |
| `app/dashboard/pricing/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/shipments/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/shipments/[id]/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/tracking/demo/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/tracking/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/warehouse/audit/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/dashboard/warehouse/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/driver/delivery/page.tsx` | Anonymous access denied in browser tests; authenticated workflow acceptance pending |
| `app/driver/delivery/[id]/page.tsx` | Anonymous access denied in browser tests; authenticated workflow acceptance pending |
| `app/feedback/page.tsx` | Responsive browser and automated accessibility checks |
| `app/invoice/[id]/label/page.tsx` | Anonymous access denied in browser tests; authenticated rendering acceptance pending |
| `app/invoice/[id]/page.tsx` | Anonymous access denied in browser tests; authenticated rendering acceptance pending |
| `app/page.tsx` | Responsive browser and automated accessibility checks |
| `app/portal/invoices/page.tsx` | Anonymous access denied in browser tests |
| `app/portal/page.tsx` | Responsive browser and automated accessibility checks |
| `app/portal/shipments/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/portal/tickets/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/portal/track/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/sentry-example-page/page.tsx` | Static inspection; authenticated/provider acceptance pending |
| `app/terms/page.tsx` | Responsive browser and automated accessibility checks |
| `app/track/page.tsx` | Responsive browser and automated accessibility checks |

