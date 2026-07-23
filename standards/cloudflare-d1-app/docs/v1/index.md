# Cloudflare D1 App - Edition v1

!!! info "Edition metadata"
    **Targets:** Cloudflare Workers/Pages Functions · D1 · Wrangler migrations · TypeScript · GitHub Actions
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `cloudflare-d1-app@v1`

This edition captures the gold standard for a D1-backed Cloudflare app. It focuses on the
seam between platform bindings, SQL migration history, tenant/environment isolation, query
safety, local/remote parity, and production deployment gates.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
a `vcqa` signal, and primary references.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Project shape and bindings](project-shape-and-bindings.md) | `SHAPE` / `BIND` | runtime shape, D1 bindings, generated types |
| 2 | [Migrations and drift](migrations-and-drift.md) | `MIG` / `DRIFT` / `ROLL` | versioned SQL, ordering, drift, destructive changes |
| 3 | [Environment and tenancy](environment-and-tenancy.md) | `ENV` / `TENANT` | preview/staging/prod DBs, tenant isolation, data locality |
| 4 | [Query safety and types](query-safety-and-types.md) | `SQL` / `TYPE` | prepared statements, dynamic SQL, validation, indexes |
| 5 | [Local parity and testing](local-parity-and-testing.md) | `LOCAL` / `TEST` | local D1, remote parity, seeded tests, smoke checks |
| 6 | [CI and deploy gates](ci-and-deploy-gates.md) | `CI` / `DEPLOY` | migration gates, deploy ordering, credentials, observability |

## Non-negotiables

- **R-MIG-1** - migrations are versioned SQL files and are append-only after a shared
  environment has applied them.
- **R-MIG-3** - CI proves migrations can apply to a clean local D1 database before remote
  promotion.
- **R-ENV-1** - local, preview/staging, and production D1 databases are distinct and
  intentionally selected.
- **R-TENANT-1** - multi-tenant apps declare and enforce one tenant isolation model.
- **R-SQL-1** - untrusted values enter SQL through D1 prepared statement bindings, not
  string interpolation.
- **R-CI-2** - production migrations run before production deploy and are gated by build,
  type, test, and local migration checks.

## Reference baseline

- Cloudflare D1 migrations: <https://developers.cloudflare.com/d1/reference/migrations/>
- Wrangler D1 commands: <https://developers.cloudflare.com/workers/wrangler/commands/d1/>
- D1 local development: <https://developers.cloudflare.com/d1/best-practices/local-development/>
- D1 prepared statements: <https://developers.cloudflare.com/d1/worker-api/prepared-statements/>
- D1 environments: <https://developers.cloudflare.com/d1/configuration/environments/>
- Pages bindings: <https://developers.cloudflare.com/pages/functions/bindings/>
- GitHub Actions token permissions: <https://docs.github.com/en/actions/tutorials/authenticate-with-github_token>
