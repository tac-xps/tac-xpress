# TAC-XPRESS control-center audit — 7 September 2026

**Release decision: not yet cleared for deployment.** This follow-up implements material control-center, invoice, document, messaging and telemetry repairs. Local verification and hosted database checks do not establish that the deployed website, staff sessions, provider callbacks or physical labels work in production. Work continued after midnight UTC on 8 September; the report date follows the local work session.

## Product and design

The dashboard is the operations center for provisioned admins and staff. Customers use the public website, tracking, contact and assistant without accounts. Staff access is discreet in the footer utility row. Existing server checks still re-read the current user role and deletion state, including protected compatibility `/portal` routes; a hidden link is not the access control.

The overview now brings together invoice balances, unpublished tracking work, contact requests and WhatsApp delivery attempts, with direct links to cargo workflows. A Communications page lists actual attempts, queued/failed support jobs and recent email notifications. Queries are bounded and server-authorized. Empty states remain truthful; examples exist only in marked Storybook fixtures.

The approved Nocturne light/dark colors, square geometry and compact button sizes are preserved. The free [Efferd dashboard source](https://efferd.com/blocks/dashboard) and [documentation](https://efferd.com/docs) informed task grouping, billing/activity hierarchy and register density. The visible [Shadcn UI Kit sales dashboard](https://shadcnuikit.com/dashboard/sales) informed navigation and table hierarchy; no paid source was copied. Existing shadcn primitives and the previously documented Tailark public sections remain the foundation. See [UI sources](UI-SOURCES.md) for exact provenance and the StyleX assessment.

## Workflow implementation and evidence

| Workflow | What changed or was checked | Evidence and remaining boundary |
| --- | --- | --- |
| Admin/staff control center | Real work queues and communications history; discreet staff entry; current-role server guards retained. | Role/security tests plus responsive isolated UI checks. Real staff sign-in, demotion/revocation and every authenticated route still need staging browser acceptance. |
| Shipment/invoice wizard | One transaction saves shipment, invoice, first public booking event and audit. Request UUID and advisory locking make a repeated submission return the same saved invoice. | PGlite transaction tests cover rollback and retry. No hosted customer booking was created. |
| Invoice amounts | All six charge lines, including docket, participate in server-owned integer-paise calculations. Tax rounding, payment ceilings, balances and status are validated. | Financial and transaction tests reject forged totals, stale payments and overpayment. Editing a paid invoice no longer silently creates a new payment. |
| Invoice lifecycle | Canonical persistence and audit share a transaction; admin voiding preserves records and rejects paid invoices needing reconciliation. | Voided documents remain viewable as records but cannot be sent or labelled as active shipments. Refund/credit-note accounting is not implemented by voiding. |
| Invoice PDF | Rebuilt A4 invoice with actual sender/recipient, route, pieces, weight, every charge, GST split, recorded payments and balance. Current canonical PDF is generated before WhatsApp sending. | Real fixture PDFs rendered and parsed; invoice QR decoded. Serverless Chromium, concurrency, storage expiry and actual staff download still need deployed acceptance. |
| Barcode labels | Shared 4 × 6 inch label for wizard and print route, Code128 AWB, AWB QR, long-address wrapping and clear print contrast. | Standard and long-address fixtures are single-page with no overflow. Programmatic decoding passed; physical thermal-printer/scanner acceptance remains. |
| WhatsApp invoice sending | Recipient must match the saved billing/sender record. Pending attempt is durable before provider contact; finite timeout; no automatic ambiguous resend. Accepted IDs are saved to the same attempt. | Provider tests cover pre-send persistence failure, acceptance and uncertain response. No real recipient was messaged. Approved document templates and callback behavior require provider acceptance. |
| Delivery callbacks | HMAC, body/event limits, schema validation, monotonic status transitions and correct invoice association. | Tests cover malformed/signature failures, unknown-ID retry, old failures and receipt order. Live signed provider callbacks remain unverified. |
| WhatsApp inbox | Message-ID and phone locking; replay-safe ticket/reply/subscriber/audit changes; triage job saved atomically; opt-out survives ordinary messages and stale opt-in. | Transaction tests exercise duplicate delivery and rollback. Automatic receipt acknowledgment remains best-effort. |
| Contact intake | Ticket, audit, acknowledgment-email job and triage job save together. Durable leases/backoff recover interrupted work. | SQL transaction/lease tests. Actual scheduler execution, email delivery, backlog capacity and operational review need acceptance. |
| SLA | Retried triage keeps deadlines anchored to receipt; category policy takes precedence over null fallback; failed policy/SLA persistence reaches the durable worker. | Regression tests cover unchanged deadlines and failure propagation. Policy values and staffed response commitments require operations approval. |
| Public chatbot | Bounded user/assistant transport and history, public-only shipment context, finite provider deadline, visible retry/contact recovery. | Route/privacy tests and browser failure→retry test. Live synthetic public-chat inference returned text; the selected replacement triage router returned valid JSON. Deployed perimeter/streaming and quality acceptance remain separate. |
| Public tracking | Published-event projection and privacy boundaries retained; wizard creates an initial published booking event for its own new shipment. | Query/privacy tests and public browser validation. Existing unpublished events were not bulk-published. |
| Fleet telemetry | Replaced process memory with private Postgres positions. Active registered vehicles only, validated coordinates/time, older observations cannot overwrite newer ones, stale positions hidden. | SQL/API credential tests; hosted table and grants verified. No live positions submitted. Per-driver/device identity and assignment isolation remain absent. |
| Manifests and dispatch | Existing locks and finalized-load protections reviewed and covered by transaction tests. | A multi-leg arrival/completion state is still needed before safe reassignment. The destination-receipt decision is pending; finalized loads were not silently unlocked. |
| Microservices/integrations | Application boundaries, cron, webhook, private health, PDF worker and local Edge Function source inspected. | This is a modular Next.js application. No Supabase Edge Functions are deployed. No unverified service was activated or split into a new deployment. |

## Persistence and provider behavior

Contact work is stored in `background_jobs`, claimed with `FOR UPDATE SKIP LOCKED`, an expiring lease and a lease token. A stale worker cannot acknowledge a newer claim. Failed attempts back off and remain visible after the retry limit. The scheduler processes up to two jobs per invocation; this needs capacity testing against expected contact volume.

Resend acknowledgment jobs use a stable idempotency key. The provider retains keys for 24 hours; uncertain retries older than 23 hours are held for manual review rather than risking a repeat after expiry. This safeguard is specific to acknowledgment jobs and does not establish exactly-once delivery for every outbound path. [Resend idempotency guidance](https://resend.com/docs/dashboard/emails/idempotency-keys).

WhatsApp persists a pending attempt before sending. If the provider response is ambiguous, staff must check provider history before retrying. If acceptance succeeds but the subsequent database update fails, Sentry records the attempt/provider identifiers for reconciliation and the UI preserves the accepted outcome. There is still an unavoidable external side-effect/commit gap without provider idempotency or a reconciliation API. Delivery and read states require callbacks; an HTTP success alone is not delivery.

AI auto-reply remains disabled by default. Its legacy reply/send sequence still requires durable idempotent delivery and real-provider acceptance before activation. The triage confidence field remains a heuristic rather than a calibrated model probability. No automated response policy or confidence threshold is certified by this audit.

## Hosted Supabase verification

Project: `tac-xpress`, reference `ujyellrhwhqjmfponhuz`, active/healthy, PostgreSQL 17.6, `ap-southeast-2`. The private cargo document bucket was verified. Twenty-four public tables have RLS enabled. The security advisor reports twenty-three informational no-policy findings consistent with the server-only table model and one warning for disabled leaked-password protection. This is not an assertion that RLS protects database-owner/service-role queries; application authorization remains necessary. [Supabase password protection](https://supabase.com/docs/guides/auth/password-security).

Three additive migrations were applied to this hosted project in this pass:

1. `20260907233111_durable_communication_jobs.sql`: background jobs, email delivery log and dead-letter queue, indexes and private grants.
2. `20260907235640_whatsapp_inbox_indexes.sql`: message replay and active WhatsApp ticket lookup indexes.
3. `20260908000855_durable_fleet_telemetry.sql`: private registered-vehicle position store with coordinate constraints and observation index.

The four new tables deny client SELECT to `anon` and `authenticated` and allow the server role. Final read-only counts show zero queued jobs, zero email attempts and zero fleet positions. No customer records, fleet positions or provider messages were inserted for acceptance testing. Existing historical migrations were not replayed and the hosted database was not reset. These operational tables are migration-owned SQL; the older Drizzle baseline still needs reconciliation before automated schema deployment.

## Verification results

- Unit/security/transaction suite: **151 tests passed across 22 files** on Vitest 4.1.10. Includes real PostgreSQL-compatible transactions via PGlite, not only mocked calls.
- TypeScript/Next route type generation: passed.
- ESLint: zero errors, **248 warnings** remain across the checkout. Stylelint passed.
- Production Next build and rebuilt Storybook: passed. Route generation, type checking and optimization completed successfully with E2E bypass flags disabled; the final build also includes the corrected provider model fallback.
- Public browser suite: **51 tests passed** on the rebuilt production preview, including 320/768/1440 px, light/dark, keyboard, no-JavaScript and the chat failure/retry case. **Four isolated dashboard checks passed**, making **55 browser checks** in total. The later server-only model configuration/fallback correction does not change these UI paths.
- Documents: invoice and two label fixtures rendered as one page each, with no measured overflow or page errors. Four barcode/QR decoding assertions passed. Fixtures are explicitly simulated and use `example.test` URLs.
- Runtime dependency audit: **zero known advisories**. Full dependency audit: **three remaining development-only advisories**, two high in Storybook's `image-size` and one low in `elliptic`, with no published fixed version in the audit feed. Do not process untrusted image fixtures in Storybook. These findings were not suppressed.
- Patched the critical Vitest browser issue and affected transitive tooling, upgraded Redocly CLI, and constrained Drizzle's legacy transformer to patched esbuild. Drizzle version and TypeScript transformer smoke checks passed. Redocly lint passes with seven unused-example-component warnings; the mock-derived contract is not the live HTTP specification.
- OpenRouter authenticated key endpoint returned 200. A subsequent synthetic inference check found the configured `meta-llama/llama-3.3-70b-instruct:free` model returned 404. Local `OPENAI_MODEL` now uses the verified `openrouter/free` replacement, which produced valid triage JSON; public-chat inference also returned text. No customer data was sent. The documented fallback uses the full `openai/gpt-4o-mini` identifier. Small smoke requests do not establish model quality, sustained availability or deployment acceptance. [OpenRouter key endpoint](https://openrouter.ai/docs/api_reference/limits), [free router behavior](https://openrouter.ai/docs/guides/routing/routers/free-router).

The browser runner initially lacked Playwright's downloaded Chromium. The final run uses the installed Edge channel. That launcher failure is separate from application behavior. GStack workflow/review/QA guidance and repository frontend, shadcn and Supabase skills informed the work; browser evidence comes from project Playwright and real document rendering, not a GStack daemon run. The source inventory is a coverage aid, not exhaustive line-by-line certification.

## Deployment gates and next acceptance work

| Gate | Required action or evidence |
| --- | --- |
| Actual deployed identity | Supply the staging/production website URL. `NEXT_PUBLIC_APP_URL` is currently localhost; it must be the validated HTTPS website origin. A Supabase/MCP URL is not a website. |
| Provider/mobile credentials | A random 32-byte mobile integration secret was provisioned only in ignored `.env.local`, without displaying its value. Provision/rotate it in the deployment secret store and authorized devices. Supply `WHATSAPP_APP_SECRET` and `WHATSAPP_VERIFY_TOKEN` from the actual provider. Those two values and the website origin are the remaining local configuration-check failures. Do not paste credentials into reports or chat. |
| Trusted request perimeter | The local production preview cannot resolve a trusted client address through Arcjet for private routes, so those probes return 503. Keep protection enabled; verify platform/trusted-proxy behavior on the actual deployment. |
| Staff authorization acceptance | Exercise provisioned admin and staff, rejected customer/disabled user, demotion/revocation, MFA/password policy, and read/write privilege boundaries using real staging identities. Enable Supabase leaked-password protection. |
| WhatsApp and email | Confirm approved invoice template, canonical document URL access/expiry, relay acceptance IDs, signed delivery/read/failed callbacks, uncertain-send reconciliation, actual recipient delivery and no duplicate retry. Confirm Resend sender domain and customer acknowledgment delivery. |
| Public AI and tracking | Select and capacity-test a production model with an agreed spend/rate limit. The local free router is a working repair for a retired model, not production capacity acceptance. Test approved staged shipment data, deployed streaming, abuse limits and contact recovery. Confirm published-only tracking after operational updates. Leave AI auto-reply disabled until its delivery path is hardened. |
| Scheduling and throughput | Enable the communications cron and verify backlog recovery/retry exhaustion alerts. The five-minute schedule requires Vercel Pro/Enterprise or an external authenticated scheduler; Hobby is limited to daily execution. [Vercel cron limits](https://vercel.com/docs/cron-jobs/usage-and-pricing). |
| Cargo lifecycle | Agree on destination receipt/leg completion before reassignment. Verify manifest finalize→dispatch→receive with operations staff. Carrier quote/booking integrations remain manual/unconnected where the UI says so. |
| Fleet identity | Provision and rotate integration credentials. Add driver/device identity and assignment checks before exposing mobile writes to individual drivers or devices. |
| Finance and physical documents | Verify legal issuer/GSTIN, tax jurisdiction including a zero-tax invoice later becoming taxable, and the aggregate consignment-dimension contract. Current dimensions describe the overall packed consignment, not invented equal-sized pieces. Approve printed A4 and physical 4 × 6 labels with the real printer/scanner. |
| Database release | Reconcile migration history and Drizzle baseline, rehearse backup restoration, test serverless connection/PDF concurrency, and define release owner, rollback and monitoring. No restore rehearsal or deployed load test was performed. |
| Tooling | Track the three unpatched Storybook advisories, deprecated transitive tools and the gbrain OpenAI/Zod peer mismatch. Local build/test success does not clear these maintainability concerns. |

No deployment, commit, push or real recipient messaging was performed. The large pre-existing dirty worktree was preserved. The pending website URL and manifest completion decision are the next user inputs; neither is inferred from elapsed time.

## Evidence files

All paths below are relative to the repository root:

- `artifacts/control-center/implementation_plan.md`, `route-inventory.json` — scope and indexed boundaries.
- `typecheck-final.log`, `unit-final.log`, `lint-final.log`, `stylelint-final.log`, `build-final.log`, `storybook-final.log` in the same folder — final local checks.
- `public-browser.log`, `public-final.log`, `workspace-final.log`, `chat-browser.log` — browser checks, with simulated workspace data clearly marked.
- `invoice.pdf`, `label.pdf`, `label-long.pdf`, corresponding PNGs, `documents-results.json`, `barcode-results.json` — print and decoding evidence.
- `hosted-permissions.json`, `hosted-state-counts.json`, `hosted-security-advisors.json` — hosted metadata checks.
- `production-env.log`, `production-perimeter.json`, `provider-auth.json`, `provider-inference.json`, `provider-inference.log` — release configuration, key authentication, current synthetic inference and original retired-model failure evidence.
- `dependency-audit-prod-final.json`, `dependency-audit-all-final.json`, `contracts-final.log`, `drizzle-toolchain.log` — dependency/toolchain checks.

The [architecture](ARCHITECTURE.md), [API reference](05-api-reference.md) and [UI source record](UI-SOURCES.md) describe current behavior. The earlier [Nordic audit](nordic-lagom-audit-2026-09-07.md) retains its historical measurements.
