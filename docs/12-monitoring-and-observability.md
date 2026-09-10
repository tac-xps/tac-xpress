# Monitoring and observability

Sentry captures critical server-action, route, relay, and provider failures. Use meaningful area tags and safe metadata; never attach credentials or full personal records.

## Health

`/api/health` reports database reachability and configuration state for OpenRouter, WhatsApp, and Resend. It requires the cron bearer secret or an authorized dashboard session. Treat health output as operational information, not a public status API.

## What to watch

- Authentication failures and authorization denials.
- Carrier/WhatsApp webhook verification and processing failures.
- Invoice PDF and Storage failures.
- Delivery queue/dead-letter growth and message status lag.
- Public tracking, support, and chat rate-limit denials.

Use health checks with provider dashboards and Sentry release context during deployments.
