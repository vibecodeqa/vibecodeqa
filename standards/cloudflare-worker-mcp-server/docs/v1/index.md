# Cloudflare Worker MCP Server - Edition v1

!!! info "Edition metadata"
    **Targets:** Cloudflare Workers, remote MCP, TypeScript, Zod, optional Durable Objects
    **Reviewed:** 2026-07; **Next review due:** 2027-07
    **Status:** latest; **Pin as:** `cloudflare-worker-mcp-server@v1`

This edition captures the gold standard for remote MCP servers hosted on Cloudflare
Workers. It focuses on the seam between HTTP transport, OAuth authorization, tool schema
quality, Worker bindings, Durable Object or platform storage, auditability, and deployment.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
a `vcqa` signal that describes how a scanner or judge evaluates it, and upstream
references when the rule depends on external authority.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Project shape](project-shape.md) | `SHAPE` | Worker entrypoint, MCP endpoint ownership, binding types |
| 2 | [Protocol and transport](protocol-and-transport.md) | `PROTO` | MCP Streamable HTTP, routing, sessions, errors |
| 3 | [Authorization and permissions](authorization-and-permissions.md) | `AUTH` / `PERM` | OAuth, protected resource metadata, scopes, consent |
| 4 | [Tool schemas and validation](tool-schemas-and-validation.md) | `TOOL` / `VAL` | tool definitions, Zod schemas, side-effect gates |
| 5 | [State storage and audit](state-storage-and-audit.md) | `STATE` / `AUDIT` | Durable Objects, KV/R2/D1 boundaries, mutation trails |
| 6 | [Output safety and observability](output-safety-and-observability.md) | `OUT` / `OBS` | untrusted tool output, logs, safe errors, metrics |
| 7 | [Deployment gates](deployment-gates.md) | `DEPLOY` / `CI` | Wrangler config, environments, tests, least-privilege CI |

## Non-negotiables

- **R-AUTH-1** - protected remote MCP endpoints enforce authorization at the Worker
  boundary before tool dispatch.
- **R-AUTH-2** - OAuth-protected MCP servers publish protected resource metadata or an
  equivalent challenge path required by the MCP authorization spec.
- **R-PERM-1** - every tool maps to a narrow permission boundary; mutating tools are not
  covered by generic read grants.
- **R-TOOL-1** - every tool has a narrow input schema advertised to clients and enforced
  at runtime.
- **R-VAL-1** - parsed tool arguments are used for authorization and side effects; raw
  JSON is never trusted.
- **R-STATE-1** - Durable Object IDs and storage keys are scoped to the tenant, user,
  session, or resource boundary they coordinate.
- **R-AUDIT-1** - mutating tool calls produce a traceable event with actor, tool, target,
  outcome, and request correlation.
- **R-OUT-1** - tool output and fetched content are treated as untrusted data, not as
  executable instructions for later tool calls.
