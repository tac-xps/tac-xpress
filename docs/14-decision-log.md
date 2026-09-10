# Architecture decision log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-07-29 | Nordic Lagom is the active visual system. | Replace conflicting tactical, glass, and zero-curve guidance with a calm, functional interface. |
| 2026-07-29 | Light mode is the default and dark mode is equivalent. | Logistics work needs a calm daylight default without removing low-light operation support. |
| 2026-07-29 | Northeast Indian/Asian representation remains mandatory. | Design language changes must not erase TAC-XPRESS’s community and route identity. |
| 2026-09-07 | The dashboard is only for provisioned admins and staff; customers use public tracking and contact. | Explicit user product direction retires the earlier customer portal and email-link sessions. |
| 2026-09-07 | Tailark Veil and official shadcn Radix define the active Nordic Lagom interface. | Preserve product-native content, clear operations and one component system. |
| Existing | `proxy.ts` is the Next.js perimeter. | Next.js 16 uses the proxy convention for request interception. |

Add decisions when they change a durable product, security, data, or platform boundary. Link the implementation pull request and update affected canonical documentation in the same change.

