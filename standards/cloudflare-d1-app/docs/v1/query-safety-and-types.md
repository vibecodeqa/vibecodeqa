# Query Safety And Types

## R-SQL-1 - Untrusted values use prepared statement binding

**Rule.** Request data, auth claims, route params, form values, and tenant IDs enter SQL
through D1 prepared statement parameters such as `?` plus `.bind(...)`, never string
interpolation.

**Why.** Cloudflare recommends D1 prepared statements with bound parameters, and OWASP
identifies parameterized queries as the primary SQL injection defense.

**vcqa.** Flag template literals, string concatenation, or `.replace()`-built SQL that
includes untrusted values; allow static SQL strings with `.bind(...)` for values.

**References.** <https://developers.cloudflare.com/d1/worker-api/prepared-statements/>,
<https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>

## R-SQL-2 - Dynamic identifiers are allow-listed

**Rule.** Dynamic table names, column names, sort fields, directions, and JSON paths are
selected from server-side allow-lists, not bound as values or interpolated from requests.

**Why.** Prepared statement parameters protect values, not SQL structure. Identifier
selection needs an explicit allow-list.

**vcqa.** Flag user-controlled values inside SQL identifiers or `ORDER BY`/`LIMIT`/table
position unless guarded by enum/schema validation and a fixed mapping.

**References.** <https://developers.cloudflare.com/d1/worker-api/prepared-statements/>,
<https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>

## R-SQL-3 - Raw `exec()` is restricted to trusted SQL

**Rule.** `D1Database.exec()` is used only for trusted SQL files, migrations, diagnostics,
or internal setup; application request paths use prepared statements.

**Why.** `exec()` runs SQL text directly. In request handling, prepared statements provide
the safer and typed D1 API surface.

**vcqa.** Flag `env.DB.exec(...)` reachable from request data or accepting variable SQL
outside migration/test utilities.

**References.** <https://developers.cloudflare.com/d1/worker-api/d1-database/>,
<https://developers.cloudflare.com/d1/worker-api/prepared-statements/>

## R-TYPE-1 - D1 rows are typed and validated at boundaries

**Rule.** Query result rows have TypeScript types or schemas, and data crossing request,
auth, or external API boundaries is runtime-validated before it influences SQL.

**Why.** D1's TypeScript API can type returned rows, but database and request boundaries are
runtime data. Static casts alone do not prove shape or authorization.

**vcqa.** Check for `run<T>()`, `first<T>()`, row interfaces, schema parsers, and boundary
validation. Flag blind `as T` casts on request JSON or database rows used in critical
logic.

**References.** <https://developers.cloudflare.com/d1/worker-api/>,
<https://developers.cloudflare.com/d1/worker-api/return-object/>

## R-SQL-4 - Tenant and lookup predicates are indexed

**Rule.** High-cardinality tenant keys, foreign keys, and frequent lookup predicates used
by request paths have indexes created by migrations.

**Why.** D1 uses SQLite semantics. Tenant-scoped apps commonly filter by tenant and object
IDs on every request; missing indexes can turn authorization-safe queries into latency and
cost problems.

**vcqa.** Compare query predicates with migration-created indexes; flag tenant-owned tables
with frequent `WHERE tenant_id = ?` or join predicates and no supporting index.

**References.** <https://developers.cloudflare.com/d1/best-practices/use-indexes/>

## R-SQL-5 - Error responses do not leak SQL internals

**Rule.** Database errors returned to clients are safe, generic messages; detailed SQL,
bindings, tenant IDs, and stack traces stay in server-side logs with redaction.

**Why.** D1-backed routes often expose user-facing APIs. Raw SQL errors can reveal schema
and tenant boundaries while making injection probing easier.

**vcqa.** Flag response bodies containing SQL text, stack traces, migration table names, or
raw D1 errors from catch blocks.

**References.** <https://developers.cloudflare.com/d1/worker-api/return-object/>,
<https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html>
