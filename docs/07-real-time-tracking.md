# Tracking and realtime behavior

Shipments and tracking events are the source of operational status. Staff create and update events through protected dashboard workflows; carrier webhooks validate signatures before applying allowed status transitions.

## Public tracking

Public tracking is intentionally smaller than staff tracking. It exposes only an approved shipment projection and public events. It must be rate-limited, avoid customer identity and internal notes, and not rely on an RLS policy alone to hide columns.

## Live operations

Dashboard tracking consumes protected telemetry and stream routes. Telemetry ingestion verifies the mobile-client secret and validates coordinates before use. Production telemetry must use durable storage or a cache; process memory is not a cross-instance persistence layer.

## UX requirements

Show a clear last-updated time, status label, location, and recovery state. A map or live indicator cannot be the only way to understand an exception. Reduced-motion users must retain a static, readable timeline.
