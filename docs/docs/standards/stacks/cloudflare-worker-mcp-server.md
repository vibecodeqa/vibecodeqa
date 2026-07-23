# Cloudflare Worker MCP Server

**Status:** Planned charter

Remote MCP servers deployed on Cloudflare Workers, optionally using Durable Objects or KV/R2 for state.

## Full rubric

No full versioned rubric has been authored yet.


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

## Benefits

- crm/packages/mcp-worker.
