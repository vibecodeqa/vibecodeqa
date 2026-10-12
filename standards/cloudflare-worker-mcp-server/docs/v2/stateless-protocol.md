# Stateless protocol

## R-PROTO-1 - Requests are stateless

**Severity.** `blocker` for servers claiming MCP `2026-07-28`; `high` for dual-era servers
whose current lane can fall back to legacy session state.

**Rule.** A current Cloudflare Worker MCP route must process each request from the request
body, request `_meta`, headers, credentials, and explicit tool arguments. It must not depend
on `initialize`, `notifications/initialized`, `Mcp-Session-Id`, connection identity, process
identity, or a previous request on the same transport.

**Why.** MCP `2026-07-28` removed protocol-level sessions and made each request
self-describing. Hidden connection state breaks modern clients, cacheability, retries, and
Worker routing.

**Evidence.**

- Source/config: Worker MCP handler, route code, state helpers, tests that exercise repeated
  requests without an initialization handshake.
- CI/artifacts: HTTP transcript proving a direct `tools/list`, `tools/call`, or
  `server/discover` request succeeds without a prior session.
- Runtime/deploy: deployed preview smoke for the stateless route.
- Exception: only for a declared legacy route or dual-era lane, using `acceptedException`
  with owner, clients affected, removal plan, compensating route isolation, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag `Mcp-Session-Id`, `initialize`-required tests, session stores used by the
current route, or handlers that reject modern requests until a previous request has run.

**References.**

- MCP `2026-07-28` changelog:
  <https://modelcontextprotocol.io/specification/2026-07-28/changelog>
- MCP statelessness:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic#statelessness>
- MCP versioning and compatibility:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning>

## R-PROTO-2 - Request metadata carries protocol version and client context

**Severity.** `high`, escalating to `blocker` when the server cannot reject unsupported
protocol versions correctly.

**Rule.** Every modern request path must require or generate the MCP `2026-07-28` request
metadata contract: `io.modelcontextprotocol/protocolVersion`,
`io.modelcontextprotocol/clientCapabilities`, and, where available,
`io.modelcontextprotocol/clientInfo`. HTTP requests must also carry
`MCP-Protocol-Version`. Unsupported versions must produce an
`UnsupportedProtocolVersionError` with supported versions.

**Why.** Modern MCP has no negotiation handshake. The protocol version and capabilities are
per-request inputs that decide which behavior is legal.

**Evidence.**

- Source/config: request parser or SDK handler configuration and unsupported-version error
  handling.
- CI/artifacts: tests for supported and unsupported versions, including response body shape.
- Runtime/deploy: protocol smoke transcript against `/mcp`.
- Exception: only for generated SDK code that enforces the same metadata behavior; record
  SDK version, owner, route scope, test evidence, review date, and approval trail.

**vcqa.** Flag current MCP route tests that omit `_meta`, omit `MCP-Protocol-Version`, or
never assert unsupported-version behavior.

**References.**

- MCP versioning and compatibility:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning>
- MCP schema reference:
  <https://modelcontextprotocol.io/specification/2026-07-28/schema>

## R-PROTO-3 - Streamable HTTP mirrored headers are validated

**Severity.** `blocker` when headers are used for routing, authz, rate limiting, tenancy,
or tool dispatch; otherwise `high`.

**Rule.** Streamable HTTP POST requests must include `MCP-Protocol-Version`, `Mcp-Method`,
and `Mcp-Name` where the protocol requires them, and the server or trusted SDK layer must
reject missing, malformed, or body-mismatched headers before policy decisions trust those
headers.

**Why.** MCP `2026-07-28` added mirrored headers so intermediaries can route and enforce
policy, but trusting a header that disagrees with the JSON-RPC body creates a confused
deputy risk.

**Evidence.**

- Source/config: header validation code, SDK handler version, intermediary rules that use
  mirrored headers.
- CI/artifacts: tests for missing headers, mismatched `Mcp-Method`, mismatched `Mcp-Name`,
  invalid encoded values, and expected `400` / `HeaderMismatch` responses.
- Runtime/deploy: HTTP transcript from the Worker route.
- Exception: accepted only when the route delegates validation to a cited SDK version and
  tests prove the failure cases; include owner, SDK version, route scope, evidence, expiry
  or review date, and approval trail.

**vcqa.** Flag code that branches on `Mcp-Method`, `Mcp-Name`, `Mcp-Param-*`, tenant, or
tool headers without a nearby validation path or tests that compare headers to the body.

**References.**

- MCP Streamable HTTP:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http>
- MCP `2026-07-28` changelog:
  <https://modelcontextprotocol.io/specification/2026-07-28/changelog>

## R-PROTO-4 - server/discover is implemented

**Severity.** `blocker` for MCP `2026-07-28` servers; `high` for dual-era servers where
the stateless lane is present but discovery is incomplete.

**Rule.** The stateless route must implement `server/discover` and return supported
protocol versions, capabilities, server identity metadata, and cache hints.

**Why.** `server/discover` is mandatory for servers and gives modern clients a safe way to
learn supported versions and capabilities before probing separate list endpoints.

**Evidence.**

- Source/config: handler or SDK support for `server/discover`.
- CI/artifacts: test or fixture asserting `supportedVersions`, `capabilities`,
  server info, `resultType`, `ttlMs`, and `cacheScope`.
- Runtime/deploy: deployed `server/discover` transcript.
- Exception: no exception for a server claiming current MCP support. Legacy-only servers
  must pin or declare the older standard instead.

**vcqa.** Flag current MCP servers with no `server/discover` test, no discovery response
fixture, or discovery results that omit version/capability/cache fields.

**References.**

- MCP server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/discover>
- MCP versioning and compatibility:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning>

## R-PROTO-5 - List and read results are cacheable on purpose

**Severity.** `high` when cache metadata can leak tenant/user-specific data or produce
stale tool/resource lists; otherwise `medium`.

**Rule.** `tools/list`, `prompts/list`, `resources/list`, `resources/read`,
`resources/templates/list`, and `server/discover` results must include `ttlMs` and
`cacheScope`, and those values must match whether the response varies by credentials,
tenant, environment, or mutable backend state.

**Why.** MCP `2026-07-28` made cache hints part of list/read results. Incorrect public
cache scope or stale TTL can disclose tools/resources across authorization contexts.

**Evidence.**

- Source/config: response builders and capability/list/read handlers.
- CI/artifacts: tests for public and private cache scopes, authorized tool/resource subsets,
  deterministic ordering, and list changes where supported.
- Runtime/deploy: smoke transcript showing cache fields on representative list/read calls.
- Exception: accepted only for `ttlMs: 0` while a dynamic list is stabilized; include owner,
  scope, reason, replacement plan, evidence, expiry/review date, and approval trail.

**vcqa.** Flag cacheable MCP responses without `ttlMs`/`cacheScope`, `public` cache scope on
credential-specific output, or nondeterministic list ordering in fixtures/tests.

**References.**

- MCP `2026-07-28` changelog:
  <https://modelcontextprotocol.io/specification/2026-07-28/changelog>
- MCP schema reference:
  <https://modelcontextprotocol.io/specification/2026-07-28/schema>
- MCP tools:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/tools>

## R-PROTO-6 - Legacy compatibility is isolated and named

**Severity.** `high`, escalating to `blocker` when legacy handling can intercept current
requests or make production behavior ambiguous.

**Rule.** Any support for `2025-03-26`, `2025-11-25`, SSE, sessionful Streamable HTTP, RPC,
or `McpAgent` must be declared as a legacy or dual-era lane with its own route, lifecycle
status, supported clients, tests, and removal or review plan. The stateless route must reject
legacy fallback where it would mask migration defects.

**Why.** Cloudflare still supports legacy paths for existing deployments, but current
servers should not silently mix protocol eras.

**Evidence.**

- Source/config: route map, handler options such as legacy rejection, compatibility matrix,
  and migration runbook.
- CI/artifacts: tests that route modern and legacy requests to the intended lane.
- Runtime/deploy: monitoring or logs showing legacy usage during migration.
- Exception: `acceptedException` must name the legacy clients, owner, route/environment
  scope, compensating isolation, evidence, expiry/review date, and approval trail.

**vcqa.** Flag mixed imports, `/sse` routes, `McpAgent`, `createLegacyMcpHandler`, or
`initialize` support with no compatibility matrix and no route-level tests.

**References.**

- Cloudflare `McpAgent` API:
  <https://developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>
- MCP versioning and compatibility:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning>
