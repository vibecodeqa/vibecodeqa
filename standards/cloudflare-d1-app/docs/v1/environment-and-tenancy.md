# Environment And Tenancy

## R-ENV-1 - Local, preview/staging, and production use distinct databases

**Rule.** Local development, preview or staging, and production D1 databases are distinct
resources or explicitly selected modes; preview/staging must not silently use production.

**Why.** Wrangler supports local and remote modes, and D1 supports environment-specific
database bindings. Accidental production reuse is a data-loss and privacy failure.

**vcqa.** Inspect `env.*.d1_databases`, `preview_database_id`, Pages bindings, and
workflow flags for distinct database IDs/names and explicit `--local`, `--preview`,
`--remote`, or `--env` usage.

**References.** <https://developers.cloudflare.com/d1/configuration/environments/>,
<https://developers.cloudflare.com/pages/functions/bindings/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>

## R-ENV-2 - Remote D1 commands name the intended environment

**Rule.** Any script or workflow that touches a remote D1 database identifies the target
environment/database and does not rely on implicit defaults.

**Why.** Wrangler D1 commands can operate locally, remotely, and against preview databases.
The target must be obvious in code review before migrations or SQL execute.

**vcqa.** Flag remote `wrangler d1 execute` or `wrangler d1 migrations apply` commands
without `--remote`, `--preview`, `--env`, explicit database name, or equivalent workflow
environment selection.

**References.** <https://developers.cloudflare.com/workers/wrangler/commands/d1/>

## R-TENANT-1 - Tenant isolation model is declared and enforced

**Rule.** Multi-tenant apps declare one isolation model: per-tenant D1 database, per-tenant
binding/service boundary, or shared database with mandatory row/table tenant scoping. Code
and migrations must match that model.

**Why.** D1 does not infer application tenancy. Tenant isolation is a repo-level contract
between routing, auth, schema, queries, and deployment.

**vcqa.** Look for tenant architecture docs, schema conventions, route/auth tenant
resolution, and data-access helpers. Flag apps with tenant identifiers in auth/routes but
no enforced database or row-level tenant boundary.

**References.** <https://developers.cloudflare.com/d1/configuration/environments/>,
<https://developers.cloudflare.com/d1/worker-api/prepared-statements/>

## R-TENANT-2 - Shared-DB tenancy scopes every tenant-owned table and query

**Rule.** If tenants share one D1 database, every tenant-owned table has a tenant key, and
every tenant-owned read/write query constrains by that key or by a join that is proven to
derive it.

**Why.** A single missing predicate can disclose or mutate another tenant's data. Query
safety must include authorization scope, not only SQL injection safety.

**vcqa.** Flag tenant-owned tables without `tenant_id` or equivalent keys; flag queries on
tenant-owned tables without tenant predicates, tenant-scoped repository helpers, or test
coverage for cross-tenant denial.

**References.** <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>,
<https://developers.cloudflare.com/d1/best-practices/use-indexes/>

## R-TENANT-3 - Per-tenant databases are selected from trusted metadata

**Rule.** If tenancy is isolated by database, the database binding or service selection is
derived from trusted tenant metadata, not raw request parameters.

**Why.** Per-database isolation fails if a user-controlled hostname, header, or path can
select another tenant's database without authorization.

**vcqa.** Check tenant resolution code for signed/authenticated tenant identity before D1
binding selection; flag direct request-to-database-name maps.

**References.** <https://developers.cloudflare.com/workers/runtime-apis/bindings/>,
<https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-ENV-3 - Data locality choices are documented when relevant

**Rule.** Apps with jurisdictional or latency-sensitive tenant data document D1 data
location choices at database creation time.

**Why.** D1 jurisdiction is a database creation property, and location hints are creation
inputs. They cannot be retrofitted casually after production data exists.

**vcqa.** Look for `wrangler d1 create --jurisdiction` or `--location` notes, IaC records,
or tenant provisioning docs when the repo claims regional tenancy, GDPR, FedRAMP, or data
residency behavior.

**References.** <https://developers.cloudflare.com/d1/configuration/data-location/>
