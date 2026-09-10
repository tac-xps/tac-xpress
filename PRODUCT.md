# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

TAC-XPRESS serves two connected audiences: operations staff who create, dispatch, warehouse-process, invoice, track, and support shipments; and customers who track consignments, access invoices, manage their shipments, and request support through the portal.

## Product Purpose

TAC-XPRESS is a logistics operations platform for shipments moving between New Delhi and Northeast India. It brings operational work, customer self-service, public tracking, support, notifications, and shipment records into one system so movement of goods is dependable and visible.

## Positioning

Inferred from the existing implementation: TAC-XPRESS is a regionally grounded logistics partner for Northeast India, combining a staff operations system with customer-facing shipment visibility rather than offering a generic courier marketplace.

## Operating Context

Staff work across shipment booking, dispatch, manifests, warehouse scanning, fleet, hubs, pricing, invoices, tracking, customer records, and support. Customers use public tracking and a signed portal session to see shipments, invoices, and tickets. Notifications can be sent by email and WhatsApp.

## Capabilities and Constraints

- Next.js web application using TypeScript, Tailwind CSS v4, Shadcn UI, Supabase, Drizzle, and Sentry.
- Dashboard/staff access uses NextAuth; customer portal flows use Supabase-backed signed portal sessions.
- Public tracking exposes a least-privilege shipment projection.
- Inferred from the current design direction: the existing Nordic Lagom system in `docs/DESIGN.md` is the binding design standard for refinement, not a reason to replace product functionality or factual copy.

## Brand Commitments

- The product name is TAC-XPRESS / Tactical Air Cargo Express.
- Inferred from the existing design system: interfaces are calm, functional, and humane; operational clarity takes priority over decorative SaaS styling.
- When people are depicted in photography, illustration, or avatars, they must be Northeast Indian/Asian and shown in authentic delivery, family, trader, hub, or route contexts.

## Evidence on Hand

- `README.md`, `docs/ARCHITECTURE.md`, app routes, components, and the current product copy document the capabilities and workflows above.
- `docs/DESIGN.md` defines the incumbent Nordic Lagom design system.
- Existing product claims and testimonials are repository content; future design work must not invent customers, performance figures, or other evidence.

## Product Principles

1. Make every shipment's state and next action understandable to the person responsible for it.
2. Keep staff operations fast, reliable, and appropriately protected.
3. Give customers clear self-service visibility without exposing operational data.
4. Reflect Northeast Indian routes and communities with respect and specificity.
5. Prefer durable operational clarity over generic visual novelty.

## Accessibility & Inclusion

The interface targets WCAG 2.1 AA. Keyboard focus must remain visible; errors must not rely on color alone; dialogs must be named; and key staff actions must preserve 44px touch targets on tablet layouts.
