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

## Candidate rules

These are not final rule IDs yet. They are the seed set for `v1`.

- **R-MIG-1: Migrations are append-only after deployment.** A migration file that has
  reached a shared environment must not be edited in place.
- **R-MIG-2: CI applies migrations to a clean local database.** The pipeline should catch
  syntax errors, missing dependencies, and ordering problems before deployment.
- **R-MIG-3: Migration order is deterministic.** Filenames or metadata must sort
  predictably and avoid ambiguous timestamps or duplicate sequence numbers.
- **R-ENV-1: D1 bindings are environment-specific.** Preview, staging, production, and
  tenant databases should not silently share a binding.
- **R-TENANT-1: Tenant isolation is explicit.** A multi-tenant app must document whether
  isolation is per database, per table, or per row key, and code must match that model.
- **R-SQL-1: Queries use parameter binding.** String-built SQL with untrusted values is a
  finding.
- **R-DRIFT-1: Production schema drift is detectable.** The repo should have a migration
  ledger, checksum, or equivalent drift guard.
- **R-ROLL-1: Breaking schema changes have a rollout plan.** Destructive changes need a
  forward-compatible or documented promotion sequence.

## Anti-patterns

- Editing a migration after it has been applied to staging or production.
- Reusing one D1 database for preview, staging, and production.
- Building SQL strings with request data.
- Running production migrations from a local laptop with no CI gate.
- Leaving tenant isolation as an implementation assumption instead of a documented model.

## Open authoring questions

- Should VCQA require checksums, or allow any ledger that proves migration identity?
- What minimum tenant isolation model should pass for the Cloudflare SaaS example?
- Should rollback be required, or is forward-fix documentation enough for D1?

## Benefits

- Cloudflare SaaS example D1 usage.
