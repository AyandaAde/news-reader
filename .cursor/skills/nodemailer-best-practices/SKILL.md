---
name: nodemailer-best-practices
description: Build, review, debug, and maintain production-ready Nodemailer email integrations in TypeScript and Next.
js. Use for SMTP configuration, Webnames securemail, implicit TLS on port 587, Greeting never received / ETIMEDOUT CONN, Clerk email.created verification emails, transport retries, and transactional email.
---

# Nodemailer Best Practices

## Purpose

Implement secure, reliable, maintainable email delivery using Nodemailer.

Canonical implementation: `lib/emails/mailer.ts`

This skill applies to:
- Next.js App Router API routes
- TypeScript backend services
- Clerk `email.created` verification and new-device emails
- Transactional emails
- Luma AI notifications
- SMTP connection debugging
- Production email infrastructure

## 1. Core principles

Always:

1. Use a dedicated email service (`lib/emails/mailer.ts`).
2. Keep SMTP credentials server-side.
3. Validate environment variables through `env.ts`.
4. Reuse a successful SMTP transport; close and drop it after a failed send.
5. Configure connection, greeting, and socket timeouts.
6. Match TLS mode to the provider docs, not to generic port folklore.
7. Retry only handshake/network failures, and only against a different SMTP target.
8. Avoid logging passwords, tokens, or SMTP authorization material.
9. Use HTML and plain-text email alternatives.
10. Keep email sending separate from business logic.
11. In production, never swallow send failures.
12. Force IPv4 (`family: 4`) and set TLS `servername` to the SMTP host.

Do not:
- Put SMTP credentials in client-side code.
- Use `NEXT_PUBLIC_` for SMTP secrets.
- Create a new Nodemailer transport for every email.
- Hardcode SMTP passwords.
- Cache a transporter that just failed.
- Treat TCP `Test-NetConnection` success as a working SMTP session.
- Assume port 587 means STARTTLS.
- Retry authentication failures (535) or invalid recipients.
- Use `any` to bypass TypeScript errors.

## 2. Project structure

Keep sending in one module. Callers import `sendEmail`.

```
lib/emails/
  mailer.ts
  email-brand.ts
  verification-email.ts
app/api/webhooks/clerk/route.ts
env.ts
```

Keep route handlers thin. Do not create extra Nodemailer transports in API routes.

## 3. Environment variables

Server-only. Validated in `env.ts`.

Required:

```
EMAIL_USER=
EMAIL_PASSWORD=
```

Optional (defaults match Webnames):

```
SMTP_HOST=securemail.webnames.ca
SMTP_PORT=587
SMTP_SECURE=true
```

`SMTP_SECURE` accepts `true` / `false` / `1` / `0` / `yes` / `no`. When omitted, treat any port other than 25 as implicit TLS.

This project uses `EMAIL_USER` / `EMAIL_PASSWORD`, not `SMTP_USER` / `SMTP_PASSWORD`.

Never expose SMTP credentials to the browser. Never use `NEXT_PUBLIC_SMTP_*`.

## 4. SMTP TLS and port configuration

Use the SMTP provider's official configuration.

Webnames (`securemail.webnames.ca`):

- Incoming: 993 IMAP, SSL
- Outgoing: **587 with SSL enabled** (optionally 465)
- "Outgoing SSL: Enabled" and Gmail's "Secured connection using SSL" on 587 mean **implicit TLS**, not STARTTLS
- Nodemailer: `port: 587`, `secure: true`, `requireTLS: false`

| Port | Mode | Nodemailer |
| --- | --- | --- |
| 587 (Webnames) | Implicit TLS / SSL | `secure: true` |
| 587 (STARTTLS providers) | Upgrade after 220 | `secure: false`, `requireTLS: true` |
| 465 | Implicit TLS | `secure: true` |
| 25 | Plain / blocked | Do not use |

If the client waits for SMTP `220` while the server waits for a TLS ClientHello, Nodemailer throws `Greeting never received` / `ETIMEDOUT` / `command: CONN`.

That is the failure mode of STARTTLS against a 587-SSL server.

```ts
nodemailer.createTransport({
  host,
  port: 587,
  secure: true,
  requireTLS: false,
  name: host,
  family: 4,
  auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASSWORD },
  connectionTimeout: 6_000,
  greetingTimeout: 6_000,
  socketTimeout: 15_000,
  tls: {
    servername: host,
    minVersion: "TLSv1.2",
    rejectUnauthorized: false,
  },
});
```

Do not guess hostnames. Do not copy generic "587 = STARTTLS" advice onto Webnames.

## 5. Transport reuse

Cache one transporter keyed by `host:port:ssl|starttls`.

- Reuse it only after a successful `sendMail`
- On failure, `close()` it and clear the cache so the next attempt does not reuse a dead socket
- In serverless, reuse while the isolate is warm; do not assume the process stays alive

## 6. Verify SMTP connectivity

`transporter.verify()` checks handshake and auth. It does not prove the message will be delivered.

Do not call `verify()` before every email. Use it for diagnostics.

Never report "email sent" before `sendMail()` succeeds.

A TCP connect is not a verify. `Test-NetConnection ... -Port 587` returning `TcpTestSucceeded=True` only means SYN-ACK. The peer can still send no SMTP `220`.

## 7. Sending emails

All sends go through `sendEmail` in `lib/emails/mailer.ts`.

- `from` is `"Luma AI" <EMAIL_USER>`
- Attach brand logos via `getEmailLogoAttachments()`
- Callers pass `to`, `subject`, `html`, optional `text` and `attachments`

Do not allow arbitrary user-controlled `from` addresses.

## 8. HTML and plain-text emails

Always provide a plain-text alternative when practical.

Prefer reusable templates in `lib/emails/`.

Escape user-provided content before inserting it into HTML.

## 9. Error handling

Preserve the original SMTP error (`code`, `command`, message).

Log `SMTP send failed via host:port:ssl|starttls` with the error object.

Production: rethrow after retries are exhausted.

Development only: if every target fails, log subject and plain-text body, then return without throwing so Clerk webhooks are not 500'd when this network blocks outbound SMTP. Never do this in production.

Do not log SMTP passwords.

## 10. SMTP timeout debugging

When you see:

```
Error: Greeting never received
code: "ETIMEDOUT"
command: "CONN"
```

the TCP session opened (or appeared to) and no SMTP `220` arrived before `greetingTimeout`.

Check, in order:

1. TLS mode vs provider docs (Webnames 587 = implicit SSL).
2. SMTP hostname (`securemail.webnames.ca`).
3. Port (587 works at TCP here; 465/25/2525 do not).
4. IPv4 vs IPv6 (`family: 4`).
5. ISP / firewall SMTP tarpit (Gmail 587 timing out too means the network, not Webnames).
6. Cached dead transporter.
7. Credentials (only after the handshake succeeds).

Do not blame the email template.

### Diagnostic checklist

DNS:

```powershell
Resolve-DnsName securemail.webnames.ca
```

TCP (not SMTP):

```powershell
Test-NetConnection securemail.webnames.ca -Port 587
Test-NetConnection securemail.webnames.ca -Port 465
```

Known results from this workspace's network:

- `587 tcp=True` but no SMTP greeting
- `465 tcp=False`
- `2525 tcp=False`
- `25 tcp=False`
- HTTPS (443) works

Do not assume a successful TCP connection proves SMTP authentication works.

## 11. Timeout configuration

Use bounded timeouts so Clerk webhooks do not hang ~15–17s:

```
connectionTimeout: 6_000
greetingTimeout: 6_000
socketTimeout: 15_000
```

Do not use unlimited timeouts. Do not stack many sequential fallbacks in development.

## 12. Retries

Retries must be bounded and target-based.

Retry only:

- `ETIMEDOUT`, `ECONNREFUSED`, `ESOCKET`, `ECONNRESET`, `EHOSTUNREACH`, `ETLS`, `EDNS`
- `command === "CONN"`
- `/greeting never received|connection timeout|socket closed/i`

Do not retry:

- Authentication failure
- Invalid recipient
- Invalid sender
- Permanent SMTP rejection

Fallback order in production:

1. Configured primary (`SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE`)
2. `587` implicit TLS
3. `587` STARTTLS
4. `465` implicit TLS

Skip duplicates. In development, attempt the primary only, then use the local fallback in section 9.

Close the transporter after each failed attempt.

## 13. Email delivery architecture

Clerk `email.created` (verification OTP, new-device sign-in) is sent synchronously from `app/api/webhooks/clerk/route.ts` via `sendEmail`.

If that send throws, the webhook returns 500, the OTP never arrives, and `SubscriptionGate` sends `/dashboard` back to `/auth?type=login`.

Production must use a working SMTP handshake. Local ISP SMTP blocks cannot be fixed by switching ports; they require an HTTPS mail API or reading the development log fallback.

Do not make unrelated database writes depend on SMTP completing.

## 14. Clerk integration

Custom Clerk emails are delivered by this app, not by Clerk, when the `email.created` webhook is subscribed.

1. Clerk emits `email.created` with the OTP in `data.data`.
2. The webhook handler calls `sendEmail`.
3. Clerk does not send a duplicate if the webhook returns 200.
4. Organization invitations use Clerk's own invitation email, not this mailer.

If Clerk invitations work but sign-in codes do not, debug Nodemailer — not the Clerk Organizations API.

## 15. Security

Never log:

- SMTP passwords
- SMTP authorization tokens
- Production verification codes
- Password reset tokens

Development may log the plain-text email body when SMTP is unreachable so a local OTP can be recovered from the terminal. Production must not.

Rate-limit public email endpoints. Do not let user input control SMTP headers.

## 16. Observability

Log:

- Target key (`host:port:ssl|starttls`)
- SMTP `code` and `command`
- Duration / timeout class

Do not log secrets.

## 17. Testing

Test:

- Webnames 587 with `secure: true`
- STARTTLS mismatch (`Greeting never received`)
- Port 465 unreachable
- Invalid credentials after a real handshake
- Retry skipping auth errors
- Transporter cache cleared after failure
- Clerk `email.created` still 200 in local development when SMTP is blocked
- Production still throws when SMTP is blocked

Do not send test emails to real users accidentally.

## 18. Code review checklist

- [ ] Secrets are `EMAIL_USER` / `EMAIL_PASSWORD` on the server only.
- [ ] Webnames 587 uses implicit TLS (`secure: true`) unless `SMTP_SECURE=false`.
- [ ] Timeouts are ~6s / 6s / 15s.
- [ ] Transport is reused only while the target stays healthy.
- [ ] Failed transports are closed and uncached.
- [ ] Fallbacks retry handshake errors only.
- [ ] `family: 4` and `tls.servername` are set.
- [ ] `from` uses `EMAIL_USER`.
- [ ] HTML is escaped or templated; plain-text is provided.
- [ ] Production failures propagate; development local-SMTP fallback is explicit.
- [ ] Logs do not contain SMTP passwords.
- [ ] Clerk `email.created` is not confused with Clerk org invitation mail.

## 19. Response format for coding tasks

When implementing or fixing Nodemailer:

1. Explain the root cause (TLS mode vs network tarpit vs auth).
2. Change `lib/emails/mailer.ts` and `env.ts` rather than ad-hoc transports.
3. Include required environment variables.
4. Explain how to test locally (terminal OTP fallback vs production send).
5. Avoid unrelated refactors.

## 20. Final principle

Reliable email is a system, not just a `sendMail()` call.

Prioritize:

Correct TLS for the provider → Bounded timeouts → Retry only dead handshakes → Production errors surface → Observability without secrets.
