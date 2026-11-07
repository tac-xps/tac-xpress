# Resend sender setup

Date: 2026-11-03. The updated local API key authenticates successfully. No key value is included here.
The account initially had no domains. Its new `tacxpress.in` verification entry is pending.
Public DNS returned NXDOMAIN for `tacxpress.in`. The owner selected the existing local Gmail mailbox as the temporary operations recipient.
That personal address is configured locally and in Vercel, and is omitted from source-controlled documentation.
Current local `FROM_EMAIL` uses Gmail. Resend requires an owned, verified sender domain.

## Verification records

Publish these exact records after activating the domain. Use automatic TTL. The DKIM value is a public verification key.

| Type | Name | Value | Priority |
| --- | --- | --- | --- |
| TXT | resend._domainkey | p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDtw8K4G5PIDTufHN4vEmDqs3Uqz0FrZXs9FcBMZyH6Vq9hbfsh7HYH2kgf8lArdriBRcq2+1/MT9i/Z/wyEaTa2KEpsE1/5sDSW9on1cRBjbYJba5GA1s+nRVVfbduvw6zpK2c0L9enSqPGxTsAAjI1OXux696X/9CYzUF5kA+IQIDAQAB |  |
| MX | send | feedback-smtp.us-east-1.amazonses.com | 10 |
| TXT | send | v=spf1 include:amazonses.com ~all |  |
| CNAME | rsend | send.forge.rmta.net |  |

These records configure outbound sending. Configure and confirm the operations mailbox separately.

## Complete acceptance

1. Confirm `tacxpress.in` is the intended domain and make its DNS available.
2. Publish the records above through the authoritative DNS provider.
3. Request Resend verification and confirm the sending domain reaches `verified`.
4. Set `FROM_EMAIL=admin@tacxpress.in` locally and in Vercel after confirming this sender.
5. Set `RESEND_FROM_EMAIL` consistently, or remove its override after reviewing the notification sender.
6. Keep the approved temporary operations recipient until the owner activates and approves the domain mailbox.
7. Perform delivery acceptance only with an explicitly approved recipient and message.

`pnpm verify:production-env` rejects malformed sender addresses and common personal-mailbox sender domains for both variables.
It cannot establish domain ownership, provider verification, or actual delivery. Those remain live acceptance checks.

The 2026-11-03 public DNS recheck still returns NXDOMAIN. Resend authenticates but reports zero verified domains.
See the [release remediation plan](release-remediation-plan.md) for the remaining access, deployment, migration, and recovery gates.

No application email was sent during these checks. The Vercel environment changes require a subsequent deployment.

Sources: [verified domains](https://resend.com/docs/dashboard/domains/introduction), [domain API](https://resend.com/docs/api-reference/domains/create-domain).
