# UI sources and adaptations

Reviewed 7 September 2026. The operations workspace uses Nordic Lagom: warm stone surfaces, restrained graphite/brown actions, clear typography and deliberate whitespace. The latest public frontend adopts the user's Cargo Home 4 reference through original transport renders, orange/charcoal sections and editorial display typography. Tailark Veil remains the primary public composition source; official shadcn Radix components supply the interactive system. Customers use public tracking/contact; the workspace is for provisioned admins and staff.

## Tailark documentation coverage

All seven pages in the documentation navigation were read, including hydrated content where the web reader omitted it:

| Page | Applied finding |
| --- | --- |
| [Introduction](https://tailark.com/docs) | Tailark supplies shadcn-based compositions; adapt the source to product content. |
| [Quick setup](https://tailark.com/docs/quick-setup) | Use the free `@tailark-oss` namespace and the correct primitive base. |
| [Project setup](https://tailark.com/docs/project-setup) | Keep the existing Next.js project and aliases; do not overwrite its preset. |
| [Migration](https://tailark.com/docs/migration) | Distinguish Radix and Base UI registry endpoints and namespaces. |
| [Theme](https://tailark.com/docs/theme) | Apply semantic CSS variables consistently in both themes. |
| [MCP](https://tailark.com/docs/mcp) | Registry discovery is available through shadcn tooling. This review used its CLI. |
| [Changelog](https://tailark.com/docs/changelog) | Distinguish the current free kits from the paid Quartz offer. |

The free registry listing contained 260 items; Veil contained 74 including helpers. This is inventory coverage, not a claim that every block was reviewed. No paid Tailark Pro key or Quartz block was used.

## Source blocks

Source was inspected with `pnpm exec shadcn view` against the official registries. Public source snapshots are in `artifacts/ui-sources/`. Existing component code was adapted in place; no unrelated source files were deleted.

| Official source | Application |
| --- | --- |
| `@tailark-oss/veil-hero-section-3` | `components/public/home-hero.tsx`: introduction/actions adapted into the Cargo Home 4 visual direction. The actual AWB form now lives in `shipment-desk.tsx`. |
| `veil-content-1`, `veil-content-2` | Public story, services, shipping steps and preparation: asymmetric text sections, dividers and restrained grids. |
| `veil-faqs-2` | Shipping FAQ: introduction beside the official shadcn Accordion. |
| `veil-footer-1` | Public footer: identity, grouped links and separate legal/staff entry. |
| `veil-contact-1` | Contact page: useful contact context beside the existing validated support form. |
| `veil-comparator-1` | Service comparison: shadcn Table with actual planning considerations rather than invented prices. |
| `@shadcn/sidebar-07` | Operations sidebar, workspace frame, breadcrumb header and account menu. Example projects and sample identities were replaced with actual TAC-XPRESS navigation and server-supplied staff context. |
| Official shadcn data-table recipe | Shipment, customer, invoice, manifest, hub and ticket registers. TanStack Table uses URL-backed server sorting and paginated queries. |
| Official shadcn chart patterns | Operational volume and service-level reporting with bounded data, descriptive labels and explicit no-data states. |

Other registry sources inspected for comparison: Veil hero 1 and its header, hero 4, features 3, FAQs 1, footer 2 and CTA 2. Inspection does not imply each was shipped.

## Official shadcn reference pages

The 7 September square-control update retains these sources. [Button](https://ui.shadcn.com/docs/components/button) variants now own the compact 24/28/32/36px size scale. Shape tokens are zero across public and staff UI. [StyleX was reviewed](stylex-assessment-2026-09-07.md) as a styling architecture reference; it was not added as a dependency or represented as a component source.

[Sidebar](https://ui.shadcn.com/docs/components/sidebar), [Data table](https://ui.shadcn.com/docs/components/data-table), [Accordion](https://ui.shadcn.com/docs/components/accordion), [Field](https://ui.shadcn.com/docs/components/field), [Command](https://ui.shadcn.com/docs/components/command), [Dropdown menu](https://ui.shadcn.com/docs/components/dropdown-menu), [Chart](https://ui.shadcn.com/docs/components/chart).

The implementation uses the installed shadcn Dialog, Sheet, AlertDialog, Command, Popover, Table, Card, Badge, RadioGroup, Form, Input, Select, Textarea, Progress, Sidebar, Breadcrumb, Avatar and Accordion primitives. The lookup combobox follows the official Popover + Command recipe. Notifications and destructive confirmations use these same primitives.

## Product-specific composition

### Control-center follow-up, 7 September 2026

The overview and communications workspace retain the approved Nocturne light/dark tokens, square corners and compact button scale. [Efferd documentation](https://efferd.com/docs) and the free `@efferd/dashboard-2` registry source informed the compact billing/activity/invoice hierarchy, adapted with real TAC-XPRESS queues and existing shadcn Card, Table, Badge, Sidebar and Button components. The registry address includes the required style segment: `https://efferd.com/r/{style}/{name}.json`. The source snapshot is `artifacts/control-center/efferd-dashboard-2.json`.

The visible [Shadcn UI Kit sales dashboard](https://shadcnuikit.com/dashboard/sales) informed register density and navigation hierarchy. No paid source was downloaded or copied. Public composition still uses the previously documented Tailark sources. Financial documents use their own A4 and 4-by-6-inch print layouts with real QR/Code128 encoders; template statistics and simulated customer records are confined to clearly marked Storybook fixtures.

Tailark and shadcn provide layout and interaction patterns; TAC-XPRESS supplies content, data queries, authorization, booking validation, business transitions and document handling. No fake testimonials, customer counts, carrier availability, fares, map positions or company affiliations were added.

QR documents still require `qrcode.react` to encode machine-readable data; maps and barcode decoding likewise need specialist libraries. These are functional engines, not alternative UI kits. Legacy Kibo, shadcn-space and other unused source files remain in the dirty checkout; they were not deleted or presented as Tailark/shadcn source. The route dependency audit covers 73 entry files and 369 reachable modules and reports no active imports from the competing UI kit paths or packages it checks. This is a static dependency result, not a license or authenticated execution audit.
