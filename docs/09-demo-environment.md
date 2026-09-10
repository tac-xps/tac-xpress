# Demo and test environment

Demo utilities are restricted to non-production environments and protected dashboard access. They must never be enabled by a public client flag in production.

## Safe use

- Use dedicated demo or local data, never production records.
- Configure `E2E_TEST_BYPASS_ENABLED`, test credentials, and test-only secrets only outside production.
- Keep test routes unavailable in production; the perimeter rewrites test-auth routes when bypass is not explicitly allowed.
- Remove or rotate temporary test credentials when an environment changes purpose.

The production readiness checklist is [deployment](./10-deployment.md), not this guide.
