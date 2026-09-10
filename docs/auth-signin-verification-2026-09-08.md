# Staff sign-in verification — 8 September 2026

## Login failure and fix

Supabase MCP confirmed that the requested Auth identity already exists, its email
is confirmed, and its active application user and profile both have the `admin`
role. The application supports `admin`, `staff`, and `customer`; `admin` is the
highest role. No duplicate identity or password reset was necessary.

The real staff sign-in form rejected the correct credentials before reaching
Supabase. Arcjet reported that the custom `email` fingerprint characteristic was
empty. In the installed SDK, `email` is a reserved request property used by email
validation, so it is excluded from custom fingerprint fields.

The credential limiter now uses `credentialKey`. Its existing limit of ten
attempts per fifteen minutes remains enabled. Denials and protection failures
produce distinct, safe sign-in messages. Genuine credential failures retain the
generic “Invalid email or password” response. Protection errors still block
authentication and are reported to Sentry.

## Local dashboard connection

Successful authentication exposed a separate dashboard loading stall. The local
database URL used the shared transaction pooler on port 6543. The stall appeared
in both Turbopack and Webpack, while direct read-only database checks completed.

The local `.env.local` `DATABASE_URL` now uses the same project's session pooler
on port 5432. Supabase recommends session pooling for persistent application
servers on IPv4 networks: [connection guidance](https://supabase.com/docs/guides/database/connecting-to-postgres).
This change resolved the observed local dashboard stall. The precise internal
cause of the transaction-pool stall was not isolated.

Temporary driver, bundler, monitoring, and diagnostic changes were removed. The
development server is running with the normal Turbopack command on port 3001.
The environment file remains local and contains no newly provisioned secrets.
Deployment connection settings were not changed or verified by this repair.

## Verification

- The regression test uses the real Arcjet SDK's request normalization and
  fingerprint generation with only its remote service replaced. It failed before
  the identifier correction and passes afterward.
- Tests cover stable account buckets, rate-limit denials, service and partial
  rule failures, genuine credential failures, and preservation of redirects.
- All 159 unit tests across 23 files passed, along with TypeScript and targeted ESLint.
- A fresh browser sign-in reached “Operations overview” with an `admin` session.
- An authenticated request to the customer API returned HTTP 200.
- An incorrect password was rejected and produced no authenticated session.
- Three full dashboard reloads completed in approximately 3.9, 4.8, and 5.3 seconds.

These are local verification results, not production deployment clearance.
