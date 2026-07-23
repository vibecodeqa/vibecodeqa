# State Storage And Audit

## R-STATE-1 - Durable Object IDs are scoped to the coordination boundary

**Rule.** Durable Object IDs must include or derive from the tenant, user, session, or
resource boundary that the object coordinates; shared global IDs require an explicit
reason.

**Why.** Durable Objects provide globally unique, single-threaded instances with private
storage. A poorly scoped ID can mix tenants, sessions, or authorization contexts.

**vcqa.** Inspect `idFromName`, `getByName`, `newUniqueId`, `jurisdiction`, and wrapper
helpers for names that include the intended boundary; flag `"global"`, `"default"`, or
predictable shared names used for user or tenant state.

**References.**

- https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
- https://developers.cloudflare.com/durable-objects/concepts/what-are-durable-objects/
- https://developers.cloudflare.com/durable-objects/reference/data-location/

## R-STATE-2 - Durable Objects are used for coordination, not generic persistence

**Rule.** Durable Objects should be used when a tool needs per-entity coordination,
session state, strong consistency, persistent connections, or scheduled work; generic
stateless tool calls should stay in the Worker.

**Why.** A single Durable Object is a throughput and locality boundary. Overusing one as
a global singleton can serialize unrelated tool traffic and create failure hotspots.

**vcqa.** Identify Durable Object namespaces and map each to a coordination atom; flag one
object handling unrelated tenants/users/resources or stateless operations that do not need
DO semantics.

**References.**

- https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
- https://developers.cloudflare.com/durable-objects/platform/limits/
- https://developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/

## R-STATE-3 - Storage choices match consistency and sensitivity

**Rule.** Tool state must be stored in the Cloudflare product that matches its consistency,
size, sensitivity, and access pattern; KV/R2/D1/Durable Object storage must not share
keys across authorization boundaries.

**Why.** MCP tools often bridge user data, credentials, and external APIs. Storage
boundaries are part of the permission model, not only infrastructure.

**vcqa.** Review binding names, key construction, table schemas, bucket paths, and access
helpers for tenant/user/session/resource partitioning and least-privilege access.

**References.**

- https://developers.cloudflare.com/workers/runtime-apis/bindings/
- https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
- https://developers.cloudflare.com/durable-objects/api/legacy-kv-storage-api/

## R-STATE-4 - Persistent data is not kept only in Worker globals

**Rule.** Data that must survive Worker eviction, Durable Object hibernation, deploys, or
regional movement must be persisted to platform storage, not only module-level variables.

**Why.** Worker and Durable Object memory is runtime-local and may disappear. In-memory
state is valid only as a cache for data that can be reconstructed or reloaded.

**vcqa.** Scan for module-level `Map`, arrays, caches, sessions, or token stores; check
whether durable recovery exists for values that affect authorization, mutation history,
or user-visible state.

**References.**

- https://developers.cloudflare.com/durable-objects/reference/in-memory-state/
- https://developers.cloudflare.com/durable-objects/concepts/durable-object-lifecycle/
- https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/

## R-AUDIT-1 - Mutating tool calls leave an audit trail

**Rule.** Every mutating tool call must produce a traceable event with actor, tool name,
target resource, authorization scope, result, timestamp, and request correlation ID.

**Why.** Remote MCP servers let agents act on behalf of users. Operators need an
accountable record for debugging, abuse response, user support, and security review.

**vcqa.** Inspect mutating tool handlers for durable event writes, structured logs, queue
events, Analytics Engine, D1, R2, or equivalent audit sinks; flag mutations with only
console logging or no actor/target/outcome fields.

**References.**

- https://developers.cloudflare.com/workers/observability/
- https://developers.cloudflare.com/workers/observability/logs/workers-logs/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/2_0_vulns/LLM06_ExcessiveAgency.html

## R-AUDIT-2 - Audit trails redact sensitive content

**Rule.** Audit logs must capture enough metadata to reconstruct tool activity without
persisting secrets, bearer tokens, OAuth refresh tokens, full prompts, or unnecessary PII.

**Why.** Logs are security assets and liability surfaces. MCP tool inputs and outputs can
contain credentials, repository content, customer data, or model-generated sensitive text.

**vcqa.** Inspect logging helpers, serializers, Tail Worker sinks, and audit schemas for
redaction, allowlisted fields, token scrubbing, and retention policy.

**References.**

- https://developers.cloudflare.com/workers/observability/logs/tail-workers/
- https://developers.cloudflare.com/workers/observability/logs/logpush/
- https://owasp.org/www-project-top-10-for-large-language-model-applications/

