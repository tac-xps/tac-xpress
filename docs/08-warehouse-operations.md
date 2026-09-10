# Warehouse operations

Warehouse workflows are staff-only dashboard operations. The current product includes warehouse views, audit surfaces, scanner providers, manifests, shipment updates, hubs, fleet data, and supporting notifications.

## Operating principles

- Verify staff authorization in every server action and route handler.
- Make scanning recoverable: show the recognized AWB, the intended operation, validation failures, and a confirmation before an irreversible status change.
- Keep controls touch-friendly on tablet widths and make status, location, and next action readable without color alone.
- Audit staff changes where the domain action changes shipment, manifest, invoice, or ticket state.

## Design standard

Use Nordic Lagom dense-data patterns: restrained surfaces, mono identifiers, sentence-case controls, clear exceptions, and no visual chrome that competes with operator decisions.
