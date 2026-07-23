# Cloudflare D1

D1 is Cloudflare SQLite storage used from Workers and Pages Functions.

## Upstream references

- [D1 Documentation](https://developers.cloudflare.com/d1/)
- [D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)

## What upstream owns

- D1 API behavior
- migration command behavior
- binding shape

## What VCQA owns

- migration discipline.
- local/remote parity checks.
- tenant database isolation.
- query-safety checks.

## Detection signals

- `[[d1_databases]]` in Wrangler config
- `migrations/*.sql`
- D1 binding usage in Functions or Workers

## Composed standards

- [Cloudflare D1 App](../stacks/cloudflare-d1-app.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)

## Combination-born guidelines

- D1 plus GitHub Actions requires a migration apply gate before production deployment.
- D1 plus tenancy requires per-tenant or explicitly partitioned database boundaries.
- D1 plus TypeScript requires parameterized query patterns and typed row mapping.
