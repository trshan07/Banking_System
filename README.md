# Smart Bank

Smart Bank is a React and Express banking application backed by MongoDB. The
repository includes production-oriented security controls, repeatable quality
checks, container builds, and a deployment template.

## Local development

Requirements:

- Node.js 22
- MongoDB configured as a single-node replica set or a managed replica set
- npm 10 or later

Install and configure:

```text
cd server
npm ci
copy .env.example .env

cd ..\client
npm ci
```

Run the API with `npm run dev` in `server` and the UI with `npm run dev` in
`client`.

## Quality gates

Run these before merging:

```text
cd server
npm run lint
npm test -- --runInBand
npm audit --omit=dev --audit-level=high

cd ..\client
npm run lint
npm run build
npm audit --omit=dev --audit-level=high
```

GitHub Actions runs lint, server tests, the server production-dependency audit,
and the client build on every push and pull request.

## Security and financial integrity

- New accounts always start at zero. Opening balances cannot be supplied by a
  customer request.
- Internal transfers run in a MongoDB transaction and require an
  `Idempotency-Key` header in production.
- Transfer values are limited to two decimal places and balance updates round
  through integer minor units.
- External transfers return `501` until a regulated payment provider is
  integrated; they are never falsely recorded as completed.
- Legacy savings balance mutations are disabled in production until they are
  migrated onto the transactional ledger.
- Access and refresh credentials are stored in `HttpOnly`, `Secure`,
  same-site cookies. OAuth credentials are not placed in URLs.
- New users must verify their email before their account becomes active.
- Password resets and password changes revoke existing sessions.
- Uploaded identity documents are signature-checked and served only through an
  authenticated download endpoint. The upload directory is not public.
- Production startup rejects placeholder secrets, non-HTTPS frontend URLs,
  demo users, and MongoDB deployments without replica-set transactions.

## Database deployment

Run the index migration once for each release before starting new application
instances:

```text
cd server
set NODE_ENV=production
npm run migrate
```

Back up MongoDB through the managed database provider. Restore tests must be
performed regularly in an isolated environment. Do not treat an untested
backup as recoverable.

## Container deployment

Create `server/.env.production` from `server/.env.example`, use secrets from a
secret manager, and set:

- `NODE_ENV=production`
- `FRONTEND_URL=https://your-public-host`
- a replica-set `MONGODB_URI`
- independent random `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, and
  `ENCRYPTION_KEY` values of at least 32 characters
- a strong one-time super-administrator password
- `TRUST_PROXY_HOPS=1` when using the supplied reverse-proxy topology

Then run:

```text
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml run --rm server node src/migrations/index.js
docker compose -f docker-compose.production.yml up -d
```

The supplied client container binds to `127.0.0.1:8080`. Place a TLS-terminating
load balancer or reverse proxy in front of it. Never expose this HTTP listener
directly to the internet.

## Operational release checklist

- All quality gates pass from a clean checkout using `npm ci`.
- Dependency advisories are reviewed and resolved or explicitly risk-accepted.
- TLS, HSTS, DNS, CORS origin, proxy-hop count, and cookie behavior are verified
  in the actual deployment topology.
- MongoDB point-in-time recovery, encryption, replica health, alerts, and a
  restore drill are verified.
- SMTP and document-storage failure behavior is tested.
- Metrics, centralized logs, alerting, uptime checks, and incident contacts are
  configured.
- A penetration test, privacy review, banking/legal compliance review, and
  threat-model review are completed before real money or customer identity data
  is accepted.

Application hardening cannot itself provide regulatory approval. Production use
with real banking data remains conditional on those independent infrastructure,
security, and compliance controls.
