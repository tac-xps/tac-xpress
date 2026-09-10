# Nordic Lagom design migration

The current standard is [DESIGN.md](DESIGN.md); exact Tailark and shadcn adaptations are recorded in [UI-SOURCES.md](UI-SOURCES.md). This supersedes the former green workspace and customer portal.

| Existing treatment | Current treatment |
| --- | --- |
| Neon, glass, tactical or spruce accents | Warm stone surfaces, graphite text and restrained brown actions from semantic tokens. |
| Decorative gradients and persistent animation | Content hierarchy, space, borders and purposeful interaction. |
| Competing UI kit blocks | Tailark Veil public sections and official shadcn Radix compositions. |
| Oversized decorative metrics | Compact actual totals with periods and denominators. |
| Manual internal-ID entry | Guarded named-record comboboxes. |
| Native confirmation and implicit upload success | Shadcn AlertDialog and explicit saved, failed or retry states. |
| Customer portal links | Public tracking/contact and a separate staff sign-in entry. |

Keep business behavior explicit while adapting the interface. Preserve unrelated legacy files, use server components for explanatory content, and split large components and state hooks. Verify light/dark themes, 320px overflow, keyboard focus and actual success/failure behavior. An isolated visual fixture does not establish an authenticated operational workflow.
