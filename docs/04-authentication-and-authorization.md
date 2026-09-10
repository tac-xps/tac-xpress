# Authentication and authorization

## Staff workspace

NextAuth credentials verify Supabase Auth identity and require a provisioned, non-deleted `users` record with the current `admin` or `staff` role. `AUTH_SECRET` signs sessions. Public identities are never automatically provisioned as staff. Password recovery and real account provisioning require deployment acceptance.

Use `lib/auth/guards.ts` at every protected data/action boundary. The guard reads the current database role; stale JWT claims cannot retain permissions after role changes or deletion. Database failures deny access and reach Sentry. Admin-only actions explicitly restrict the allowed roles; the staff directory is admin-only.

## Public customers

Customers do not have accounts or a portal. They use published AWB tracking and public contact/support. Customer rows remain business records for bookings, billing and consignments; those records confer no sign-in rights.

Legacy `/portal` routes require staff authorization and redirect to the equivalent dashboard destination. Legacy registration and email-link actions cannot establish a session. The old callback clears portal cookies and offers staff sign-in recovery; it does not exchange an email token.

## Documents and delivery

Printable invoices/labels require current staff authorization or a five-minute, invoice-specific render token. PDF jobs use a different signed purpose. Private cargo documents reauthorize the record and storage path. Staff avatars are private and scoped to their owner.

Delivery pages are staff tools. A future driver identity needs assignment-level authorization before activation. Public tracking exposes only explicitly published events and excludes contact, financial and internal operational fields.

## Request protection

The Next.js proxy checks Arcjet decisions explicitly. Denials remain denials. Protection errors, including partial rule errors, return 503 for private routes and mutations; read-only public information stays available and the degradation is reported. Production placeholders are rejected. Client IP forwarding and provider acceptance must be verified on the actual deployment. Application role checks remain mandatory even when the perimeter permits a request.

Keep credentials server-only, validate all input, use generic credential errors, and never treat editable user metadata as an authorization source.
