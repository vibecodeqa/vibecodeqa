# Cloudflare Worker MCP Server

**Status:** Authored

Remote MCP servers deployed on Cloudflare Workers, optionally using Durable Objects or KV/R2 for state.

## Full rubric

[Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/)

## Reference implementation

[vibecodeqa/ref-cloudflare-worker-mcp](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp)
is the forkable template for this stack. It shows the expected Worker entrypoint,
protected resource metadata, authorization-before-dispatch path, scoped tool permissions,
runtime validation, audit events, CI gates, and tracked VCQA report without tying the
standard to any product.

## Scope

Remote MCP servers deployed on Cloudflare Workers, optionally using Durable Objects or KV/R2 for state.

## Not in scope

- local-only MCP servers
- generic Worker APIs with no MCP surface
- AI prompt guidelines not tied to tools

## Composes

- [Cloudflare Workers](../items/cloudflare-workers.md)
- [Durable Objects](../items/durable-objects.md)
- [Model Context Protocol](../items/mcp.md)
- [Zod](../items/zod.md)
- [TypeScript](../items/typescript.md)
- [Web Security](../items/web-security.md)
- [GitHub Actions](../items/github-actions.md)

## VCQA-owned rule surface

- remote MCP authorization.
- tool schema and permission boundaries.
- Durable Object/KV storage policy.
- per-environment OAuth isolation.
- tool audit trail.

## Detection signals

- Worker config
- `@modelcontextprotocol/sdk`
- tool/resource schema definitions
- OAuth or protected resource metadata

## Combination-born guidelines

- Every tool needs a precise schema and explicit permission boundary.
- Authorization is enforced at the Worker boundary, not only by client convention.
- Mutating tool calls need an audit trail or traceable event.

## Rule highlights

- **R-SHAPE-1: Worker entrypoint owns the MCP endpoint.** Remote MCP routing is explicit
  and non-MCP routes do not fall through into the protocol handler.
- **R-AUTH-1: Worker boundary enforces authorization.** Protected MCP endpoints reject
  unauthenticated or unauthorized requests before tool dispatch.
- **R-AUTH-2: Protected resource metadata is published.** OAuth-protected MCP servers
  expose protected resource metadata or a challenge path clients can discover.
- **R-PERM-1: Tools map to narrow permissions.** Each tool has an enforceable permission
  or scope, and mutating tools require write-capable grants.
- **R-TOOL-1: Tool input schemas are narrow.** Tool parameters are concrete, bounded, and
  advertised to clients instead of hidden in prose.
- **R-VAL-1: Tool arguments are parsed before side effects.** Zod or equivalent runtime
  validation happens before authorization-sensitive work or mutations.
- **R-STATE-1: Durable Object IDs are scoped to the coordination boundary.** Tenant,
  user, session, or resource state is not mixed through shared object IDs.
- **R-AUDIT-1: Mutating tool calls leave an audit trail.** Actor, tool, target, scope,
  outcome, timestamp, and request correlation are captured.
- **R-OUT-1: Tool output is untrusted data.** External or user-controlled content returned
  by tools is not treated as policy or instructions for further tool calls.
- **R-DEPLOY-3: CI runs protocol and auth smoke tests before production.** Deploys prove
  initialization, tool listing, representative calls, and unauthorized rejection.

## Anti-patterns

- Exposing a generic `runCommand` or `queryDatabase` tool without narrow authorization.
- Trusting MCP client identity without checking the Worker request boundary.
- Sharing Durable Object state across tenants through predictable object IDs.
- Reusing production OAuth credentials in preview.
- Logging prompt/tool content without redaction policy.

## Benefits

- Cloudflare SaaS example MCP Worker.
