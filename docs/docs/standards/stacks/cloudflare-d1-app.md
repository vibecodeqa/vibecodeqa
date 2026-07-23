# Cloudflare D1 App

**Status:** Planned charter

Cloudflare Workers or Pages Functions using D1 with versioned SQL migrations and environment-specific bindings.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

Cloudflare Workers or Pages Functions using D1 with versioned SQL migrations and environment-specific bindings.

## Not in scope

- generic SQL style
- non-Cloudflare database deployments
- frontend state management

## Composes

- [Cloudflare D1](../items/cloudflare-d1.md)
- [TypeScript](../items/typescript.md)
- [Web Security](../items/web-security.md)
- [GitHub Actions](../items/github-actions.md)

## VCQA-owned rule surface

- append-only/versioned migrations.
- migration checksum or drift guard.
- local apply test.
- staging/prod/tenant database isolation.
- parameterized query enforcement.

## Detection signals

- `[[d1_databases]]` in Wrangler config
- `migrations/*.sql`
- D1 binding usage in app code

## Combination-born guidelines

- Migrations are append-only after deployment; editing applied migrations is a defect.
- CI applies migrations to a clean local database before production deployment.
- Tenant, staging, preview, and production databases need distinct binding boundaries.

## Benefits

- crm/app/functions with D1.
