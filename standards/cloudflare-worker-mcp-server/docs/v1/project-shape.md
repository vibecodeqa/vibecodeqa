# Project Shape

## R-SHAPE-1 - Worker entrypoint owns the MCP endpoint

**Rule.** The Worker entrypoint must route the remote MCP endpoint explicitly, commonly
`/mcp`, and non-MCP routes must not fall through into the MCP handler.

**Why.** A remote MCP server is an HTTP resource with protocol-specific authentication,
transport, and error behavior. Ambiguous routing makes authorization and protocol checks
hard to reason about.

**vcqa.** Inspect Worker `fetch` handlers, Hono/itty/router definitions, `McpAgent.serve`,
`createMcpHandler`, or raw SDK transport setup for a dedicated MCP route and explicit
non-MCP 404 handling.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25
- https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/
- https://developers.cloudflare.com/agents/model-context-protocol/apis/handler-api/

## R-SHAPE-2 - Stateless and stateful MCP modes are deliberate

**Rule.** A stateless MCP server should use a plain Worker handler; a stateful or
per-session MCP server should use Durable Objects or `McpAgent` rather than Worker global
state.

**Why.** Cloudflare Workers are stateless across requests, while Durable Objects provide a
single instance with private persistent storage for coordination. Remote MCP session state
must survive the runtime shape chosen for it.

**vcqa.** Check for `createMcpHandler`, `McpAgent`, Durable Object bindings, global
mutable variables, session maps, and comments/config that explain why state is or is not
durable.

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/
- https://developers.cloudflare.com/durable-objects/best-practices/rules-of-durable-objects/
- https://developers.cloudflare.com/durable-objects/reference/in-memory-state/

## R-SHAPE-3 - Worker bindings are generated and typed

**Rule.** Worker `Env` types must be generated from Wrangler configuration or otherwise
kept mechanically synchronized with actual bindings.

**Why.** MCP tools often depend on secrets, Durable Object namespaces, KV namespaces, R2
buckets, D1 databases, and service bindings. A hand-written `Env` interface can drift and
hide broken deployments until runtime.

**vcqa.** Look for generated Worker types from `wrangler types`, typed `ExportedHandler`,
and CI/typecheck coverage for binding changes; flag stale or hand-maintained `Env`
interfaces with binding names that diverge from Wrangler config.

**References.**

- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/

## R-SHAPE-4 - Runtime compatibility is pinned

**Rule.** Wrangler configuration must set an explicit `compatibility_date`, and any
Node.js compatibility flags must be intentional and tested.

**Why.** MCP SDKs and Cloudflare Agents helpers run inside the Workers runtime.
Compatibility dates and flags control runtime behavior and available APIs.

**vcqa.** Parse `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc` for
`compatibility_date`; flag missing dates, unexplained broad `nodejs_compat`, or Node-only
imports without the required compatibility flag.

**References.**

- https://developers.cloudflare.com/workers/configuration/compatibility-dates/
- https://developers.cloudflare.com/workers/configuration/compatibility-flags/
- https://developers.cloudflare.com/workers/runtime-apis/nodejs/

