# Cloudflare Worker implementation

## R-SHAPE-1 - New servers use createMcpHandler

**Severity.** `high`, escalating to `blocker` when a new production server is built on a
deprecated stateful path with no current stateless route.

**Rule.** A new or migrated Cloudflare Worker MCP server must use Cloudflare Agents
`createMcpHandler()` with a server factory based on `@modelcontextprotocol/server` for the
stateless Streamable HTTP route.

**Why.** Cloudflare's current Agents docs recommend `createMcpHandler()` for new MCP
servers and reserve `McpAgent` for legacy stateful deployments while they migrate.

**Evidence.**

- Source/config: Worker entrypoint imports, server factory, package dependencies, handler
  construction.
- CI/artifacts: Worker handler tests that initialize a fresh server per request path.
- Runtime/deploy: preview route smoke using Streamable HTTP at `/mcp`.
- Exception: accepted only for an existing legacy deployment with a dated migration plan;
  include owner, route scope, clients affected, compensating stateless lane, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag new code importing `McpAgent` without a separate stateless route, passing an
SDK v1 server to the stateless handler, or lacking any `createMcpHandler()` path.

**References.**

- Cloudflare Agents MCP transport:
  <https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>

## R-SHAPE-2 - McpAgent is legacy-only

**Severity.** `high`.

**Rule.** `McpAgent` may remain only for existing stateful or sessionful deployments, and
must be labelled as deprecated/legacy in docs, route maps, and migration evidence. It must
not be the only route for a server claiming current MCP `2026-07-28` support.

**Why.** Cloudflare identifies `McpAgent` as deprecated and feature-frozen, with SDK v2
servers unable to run inside it.

**Evidence.**

- Source/config: imports, route map, class declarations, migration comments, and package
  dependencies.
- CI/artifacts: tests proving modern requests use the stateless route.
- Runtime/deploy: usage telemetry or logs for the legacy lane.
- Exception: `acceptedException` must name the old clients, owner, route/environment scope,
  controls preventing new clients from onboarding to the lane, evidence, expiry/review date,
  and approval trail.

**vcqa.** Flag `class ... extends McpAgent`, `agents/mcp` legacy imports, `/sse` routes, or
SDK v1 `McpServer` imports where no migration lane is documented.

**References.**

- Cloudflare `McpAgent` API:
  <https://developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>

## R-SHAPE-3 - MCP and metadata routes are explicit

**Severity.** `high`.

**Rule.** The Worker must route MCP traffic through explicit endpoints, usually `/mcp`, and
must expose authorization metadata routes without allowing non-MCP application routes to
fall through into the protocol handler.

**Why.** A Worker that treats every request as MCP creates ambiguous auth, CORS, cache,
error, and abuse-control behavior.

**Evidence.**

- Source/config: `fetch` route dispatch, router definitions, OAuth provider `apiRoute`,
  metadata handlers, route tests.
- CI/artifacts: tests for `/mcp`, metadata paths, unknown routes, and non-MCP methods.
- Runtime/deploy: preview smoke showing expected status codes per route.
- Exception: accepted only for a dedicated Worker whose only public route is MCP plus
  metadata; include owner, route scope, evidence, review date, and approval trail.

**vcqa.** Flag catch-all `fetch` handlers that pass every request to MCP, missing unknown
route tests, or OAuth metadata paths absent from route tests.

**References.**

- Cloudflare Agents MCP transport:
  <https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/>
- MCP authorization server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery>
- Cloudflare Workers documentation:
  <https://developers.cloudflare.com/workers/>

## R-SHAPE-4 - Worker config and bindings are typed deployment inputs

**Severity.** `medium`, escalating to `high` when missing types or bindings affect auth,
state, audit, storage, or production deploy behavior.

**Rule.** `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc` must declare the Worker
name, compatibility date, environments, and bindings used by MCP tools, and source code must
type those bindings at the Worker boundary.

**Why.** Remote tool servers often combine auth secrets, Durable Objects, KV/R2/D1, and
service bindings. Untyped or implicit bindings make deploys environment-dependent.

**Evidence.**

- Source/config: Wrangler config, generated or handwritten `Env` type, Worker entrypoint,
  binding usage.
- CI/artifacts: typecheck/build output and config tests or lint.
- Runtime/deploy: preview/prod binding inventory in runbook or deployment evidence.
- Exception: only for generated binding types checked into CI; include generator command,
  owner, scope, evidence, review date, and approval trail.

**vcqa.** Flag binding reads from `any`, missing compatibility dates, undeclared
environment-specific bindings, or MCP tool handlers using globals instead of typed env.

**References.**

- Cloudflare Workers documentation:
  <https://developers.cloudflare.com/workers/>
- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- Cloudflare Workers environments:
  <https://developers.cloudflare.com/workers/wrangler/environments/>

## R-SHAPE-5 - Stateless server construction has no cross-request mutation leak

**Severity.** `high` when mutable server state can affect auth, permissions, tool lists, or
tenant data; otherwise `medium`.

**Rule.** The stateless server factory must avoid shared mutable module state that changes
authorization, tool availability, resource contents, audit context, or tenant data across
requests. Shared constants and caches are allowed only when their scope and cache policy are
safe.

**Why.** Workers can reuse isolates. MCP `2026-07-28` still requires the protocol state to
come from each request, not accidental module-level memory.

**Evidence.**

- Source/config: server factory, module globals, cache helpers, per-request auth context.
- CI/artifacts: tests that call the handler with different actors/tenants and prove no
  state bleed.
- Runtime/deploy: incident or smoke evidence for actor/tenant isolation where applicable.
- Exception: `acceptedException` for read-only immutable caches only, with owner, scope,
  invalidation policy, evidence, expiry/review date, and approval trail.

**vcqa.** Flag mutable module-level arrays/maps holding actors, permissions, tool lists,
resource data, request IDs, or tenant IDs without scoped keys and reset tests.

**References.**

- MCP statelessness:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic#statelessness>
- Cloudflare Workers documentation:
  <https://developers.cloudflare.com/workers/>
