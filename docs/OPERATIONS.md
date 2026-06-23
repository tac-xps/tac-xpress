# TAC-XPRESS Operations Manual

## 1. PII Scrubbing Policy

To comply with data privacy regulations and prevent PII leakage to third-party observability providers, all engineers must follow these policies when logging to Sentry or internal logs:

### WhatsApp Webhook PII
- **Raw Phone Numbers:** MUST NEVER be sent to Sentry or generic system logs. Phone numbers must be hashed using HMAC-SHA256 with the `PHONE_HASH_SECRET` environment variable.
- **Normalization:** Before hashing, phone numbers must be normalized by stripping non-digit characters and leading zeros to ensure identical numbers produce identical hashes (e.g. `+91 98765 43210` -> `919876543210`).
- **Short Numbers:** Normalized numbers under 7 digits will be hashed as `[INVALID]`.
- **Message Content:** Customer message text is strictly excluded from Sentry contexts, as it may contain names, addresses, or AWB numbers.

### Other Entities
Always scrub the following fields before capturing exceptions:
- `email`
- `awb_number`
- `customer_name`

**Reference Implementation:** Check `captureWhatsAppError` in `app/actions/whatsapp-inbound.ts`.

---

## 2. Sentry Alert Configuration

To move from passive telemetry to proactive observability, the following metric alerts must be configured in Sentry under **Project Settings → Alerts → Create Alert Rule → Metric Alert**.

| Alert Rule | Trigger Condition | Action / Notification | Priority |
| :--- | :--- | :--- | :--- |
| **WhatsApp Webhook Failure Spike** | `whatsapp.phone_hash:* error.type:WhatsAppAPIError` <br/> > 5 errors in 10 min | Slack `#ops-whatsapp` | P1 |
| **AI Triage Latency Degradation** | `ai.triage.llm` span <br/> avg > 3s over 15 min | Slack `#ops-ai` | P2 |
| **AI Cost Anomaly** | `ai.cost.usd:>0.01` (Aggregate metrics) <br/> > $5 in 1 hour | Email CTO + Slack `#ops-billing` | P2 |
| **SLA Breach Detector Down** | `sla-check` cron <br/> 0 successful runs in 15 min | Slack `#ops-sla` + PagerDuty | P1 |
| **DLQ Growth** | `dead_letter_queue` rows <br/> > 10 in 1 hour | Slack `#ops-platform` | P2 |

### Notes
- Ensure PagerDuty integration is active for the `SLA Breach Detector Down` alert.
- The `AI Cost Anomaly` requires aggregating the `ai.cost.usd` span attribute over time.
