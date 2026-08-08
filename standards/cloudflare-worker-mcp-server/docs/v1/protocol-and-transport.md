# Protocol And Transport

## R-PROTO-1 - Remote transport follows MCP HTTP semantics

**Rule.** Remote clients must connect through a supported MCP HTTP transport, preferably
the MCP Streamable HTTP transport as provided by Cloudflare Agents helpers or the MCP SDK.

**Why.** MCP messages, lifecycle negotiation, sessions, and streaming behavior are
protocol concerns. A generic JSON API that happens to call tools is not a conforming
remote MCP server.

**vcqa.** Identify `createMcpHandler`, `McpAgent.serve`, MCP SDK Streamable HTTP
transport, or equivalent protocol handlers; flag custom JSON endpoints that bypass MCP
initialization and tool listing. The transport mode this rule resolves is one column of the
compatibility matrix required by [R-PROTO-5](#r-proto-5-declare-a-compatibility-matrix).

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/

## R-PROTO-2 - MCP lifecycle is not skipped

**Rule.** The server must participate in MCP initialization and advertise only the
capabilities it actually implements.

**Why.** MCP clients use the initialization handshake and capability advertisement to
decide which protocol features, tools, prompts, resources, and flows are available.

**vcqa.** Inspect MCP server construction and capabilities for declared tools, prompts,
resources, elicitation, or logging; flag code paths that expose handlers without the MCP
initialize/list flows.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/server
- https://github.com/modelcontextprotocol/typescript-sdk

## R-PROTO-3 - Protocol errors are structured and safe

**Rule.** MCP and HTTP errors should preserve protocol-visible status while avoiding raw
stack traces, provider errors, secret names, or internal storage details.

**Why.** Remote MCP clients receive errors directly and may feed them back into model
context. Over-detailed errors become information disclosure and prompt material.

**vcqa.** Inspect error handlers around MCP server dispatch, tool handlers, and Worker
routes for structured failures, safe client messages, and server-side correlation IDs.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25
- https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices
- https://developers.cloudflare.com/durable-objects/best-practices/error-handling/

## R-PROTO-4 - Compatibility bridges are documented

**Rule.** If the server supports older clients through proxies, SSE compatibility, or
local `mcp-remote` bridges, the production endpoint and supported client path must be
documented and tested separately from local-only setup.

**Why.** Remote MCP support is still uneven across clients. Local bridges are useful for
testing but can mask authorization, cookie, redirect, and transport differences in the
production Worker.

**vcqa.** Check docs, smoke tests, and client examples for the deployed MCP URL and the
bridge/proxy path; flag only-local connection instructions for a server advertised as
remote. Each supported bridge or legacy transport path is a separate row of the
compatibility matrix required by [R-PROTO-5](#r-proto-5-declare-a-compatibility-matrix),
with its own tested client and its own retained smoke evidence.

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/test-remote-mcp-server/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/remote-mcp-server/
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports

## R-PROTO-5 - Declare a compatibility matrix

**Severity.** `high`, escalating to `blocker` when the server advertises remote client
support that no row of the matrix covers, because clients then discover incompatibility at
connection time rather than at review time.

**Rule.** The repo must publish, in version control, a compatibility matrix stating what
this deployment actually supports. Every row names:

| Column | What it must state |
|---|---|
| MCP protocol revision | the exact `protocolVersion` string the server negotiates, for example `2025-11-25`; list every revision the server accepts, and say which one it returns from `initialize` when a client offers something else |
| SDK / helper version | the pinned version of `@modelcontextprotocol/sdk`, `agents`, or the Cloudflare Agents helper that implements the transport, as resolved in the lockfile |
| Transport mode | Streamable HTTP, or a legacy/bridged path declared under R-PROTO-4, with the route it is served on (for example `/mcp`, `/sse`) |
| Auth mode | unauthenticated, bearer token, OAuth resource server per R-AUTH-2, Cloudflare Access, or another named scheme, and the environment it applies to |
| Tested clients | the specific clients or the inspector, at the version tested, that this row was verified against |

The matrix must be dated or commit-anchored, and every claim in it must be backed by the
retained smoke evidence required by
[R-DEPLOY-5](deployment-gates.md#r-deploy-5-mcp-smoke-evidence-is-retained).

**Why.** Remote MCP behavior depends on protocol revision, SDK version, transport mode,
auth challenge behavior, and the client on the other end. Those five interact: a deployment
can pass type checks, deploy cleanly, and still fail a real client path. Without a stated
matrix, "supported" is a reviewer's guess, and a version bump silently changes what the
server accepts.

**Scoring.** A pass requires the matrix to exist in the repo, to cover every route the
server exposes as an MCP endpoint, and to agree with the code and lockfile. A matrix listing
a protocol revision, transport, or client that no retained evidence covers is a fail — an
untested claim is worse than an absent one. Claims are per deployment; the matrix must say
which environment each row describes when preview and production differ.

**vcqa.** Locate the matrix in the README, a docs page, or a machine-readable file, then
cross-check each column against the repo: the negotiated `protocolVersion` in the server
construction and in the `initialize` response evidence; the SDK/helper version in
`package.json` and the lockfile; the transport helper and route in the Worker entrypoint
and Wrangler routes; the auth mode in the middleware and protected-resource metadata; and
the tested clients against the retained smoke output. Flag a matrix that has drifted from
the lockfile, a route with no row, and a row with no evidence.

**Evidence.**

- Source/config: the matrix file or section, the Worker entrypoint and transport
  construction, `package.json` plus the lockfile entry for the SDK/helper, Wrangler routes
  and environments.
- CI/artifacts: the retained smoke output from R-DEPLOY-5, resolvable to the same commit as
  the matrix.
- Runtime/deploy: an `initialize` exchange against the deployed URL whose response
  `protocolVersion` matches the row, and the negotiated revision echoed on subsequent
  requests where the revision requires it.
- Exception: `acceptedException` for a row that is documented as best-effort rather than
  supported, naming owner, scope, environment, reason, compensating controls, evidence,
  expiry/review date, and approval trail. A row cannot be excepted into existence without
  evidence; drop the claim instead.

**References.**

- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/basic/transports
- https://developers.cloudflare.com/agents/model-context-protocol/protocol/transport/
- https://developers.cloudflare.com/agents/model-context-protocol/guides/test-remote-mcp-server/

