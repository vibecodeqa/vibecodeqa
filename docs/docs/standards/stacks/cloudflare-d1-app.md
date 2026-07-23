# Cloudflare D1 App

**Status:** Authored

Cloudflare Workers or Pages Functions using D1 with versioned SQL migrations and environment-specific bindings.

## Full rubric

[Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/)

## Scope

Cloudflare Workers or Pages Functions using D1 with versioned SQL migrations and environment-specific bindings.

## Not in scope

- generic SQL style
- non-Cloudflare database deployments
- frontend state management

## Composes

- [Cloudflare D1](../items/cloudflare-d1.md)
- [Cloudflare Workers](../items/cloudflare-workers.md)
- [Cloudflare Pages Functions](../items/cloudflare-pages-functions.md)
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

## Rule highlights

- **R-SHAPE-1: The runtime boundary is Cloudflare-owned.** D1 access belongs in Workers,
  Pages Functions, or server code compiled to those runtimes, never in browser code.
- **R-BIND-1: Binding names are stable and typed at the boundary.** D1 bindings should be
  represented in generated Cloudflare types or explicit `Env`/`Bindings` interfaces.
- **R-MIG-1: Migrations are append-only after shared apply.** A migration that may have
  reached preview, staging, production, or a tenant database is changed only by a later
  migration.
- **R-MIG-3: Clean local migration apply is a required gate.** CI applies all migrations to
  a clean local D1 database before remote promotion.
- **R-DRIFT-1: Applied migration identity is drift-checked.** A checksum manifest,
  protected migration history, or equivalent guard proves source history still matches
  applied database history.
- **R-ENV-1: Local, preview/staging, and production use distinct databases.** Wrangler and
  Pages bindings must make the target database explicit.
- **R-TENANT-1: Tenant isolation model is declared and enforced.** Multi-tenant apps choose
  per-tenant database, per-tenant binding/service boundary, or shared database with
  mandatory row/table scoping.
- **R-SQL-1: Untrusted values use prepared statement binding.** Request data, auth claims,
  route params, and tenant IDs enter SQL through `.bind(...)`, not interpolation.
- **R-CI-2: Production migrations run before production code deploy.** Deploy ordering
  must match the schema expectations of the release, with documented exceptions for staged
  rollouts.
- **R-DEPLOY-1: Preview deploys do not run production migrations.** Pull request and
  preview workflows use preview/staging databases only.

## Anti-patterns

- Editing a migration after it has been applied to staging or production.
- Reusing one D1 database for preview, staging, and production.
- Building SQL strings with request data.
- Running production migrations from a local laptop with no CI gate.
- Leaving tenant isolation as an implementation assumption instead of a documented model.

## Benefits

- Cloudflare SaaS example D1 usage.
