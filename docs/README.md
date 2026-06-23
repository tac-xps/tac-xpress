# Tac-Xpress Documentation

**Version:** 2.0.0 | **Effective:** 2026-06-06 | **Owner:** CTO

---

## About Tac-Xpress

Tac-Xpress is a next-generation, enterprise-grade freight forwarding and logistics management platform. It provides real-time container tracking, cryptographic audit trails, zero-trust role-based access control, and a warehouse-floor-ready mobile interface. It is built specifically for freight forwarders, warehouse operators, and supply chain managers who need court-admissible accuracy and real-time situational awareness.

> **The Golden Rule:** The UI mock (`mocks/cargo-data.ts`) is the single source of truth for all data contracts. Any backend schema that cannot render in Storybook is invalid.

---

## Documentation Index

This directory contains the following documents, ordered from high-level to implementation-specific:

| # | File | Audience | Description |
|---|------|----------|-------------|
| 01 | [01-architecture-overview.md](./01-architecture-overview.md) | All | System architecture, layer progression (P0-P5), and strategic moats |
| 02 | [02-getting-started.md](./02-getting-started.md) | Developers | Local setup, environment variables, and first run |
| 03 | [03-database-schema.md](./03-database-schema.md) | Backend | All tables, RLS policies, and schema conventions |
| 04 | [04-authentication-and-authorization.md](./04-authentication-and-authorization.md) | Backend/Security | NextAuth v5, JWT strategy, RBAC, and capability tokens |
| 05 | [05-api-reference.md](./05-api-reference.md) | Backend/Integrators | Server actions, webhook endpoints, and SSE stream |
| 06 | [06-ui-components.md](./06-ui-components.md) | Frontend | Component library, SecureBoundary, and design system |
| 07 | [07-real-time-tracking.md](./07-real-time-tracking.md) | Full-Stack | Event sourcing, hash chains, SSE, and webhooks |
| 08 | [08-warehouse-operations.md](./08-warehouse-operations.md) | Operations | Warehouse view, inventory, and mobile-first UX |
| 09 | [09-demo-environment.md](./09-demo-environment.md) | Sales/Devs | Onboarding flow, demo data generation, and the demo script |
| 10 | [10-deployment.md](./10-deployment.md) | DevOps | CI/CD, environment matrix, and production checklist |
| 11 | [11-security-and-compliance.md](./11-security-and-compliance.md) | Security | Zero-Trust model, HMAC verification, and compliance roadmap |
| 12 | [12-monitoring-and-observability.md](./12-monitoring-and-observability.md) | DevOps | Sentry setup, alerting tiers, and logging standards |
| 13 | [13-moat-activation-guide.md](./13-moat-activation-guide.md) | CTO/Product | 8 strategic moats — status, triggers, and activation playbooks |
| 14 | [14-decision-log.md](./14-decision-log.md) | All | Architectural Decision Records (ADRs) for all phases |
