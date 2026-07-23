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

## Candidate rules

These are not final rule IDs yet. They are the seed set for `v1`.

- **R-MCP-1: Every tool has a narrow schema.** Tool inputs must be validated before side
  effects; broad untyped objects are findings.
- **R-MCP-2: Tool descriptions are reviewed as executable affordances.** Tool names and
  descriptions should not invite unsafe or overly broad behavior.
- **R-AUTH-1: Remote MCP requires boundary authorization.** The Worker must reject
  unauthenticated or unauthorized calls before tool dispatch.
- **R-SCOPE-1: Mutating tools require explicit scope.** Read-only and write-capable tools
  should be distinguishable in permissions and documentation.
- **R-STORE-1: Durable Object IDs are scoped.** Object IDs should include tenant, user, or
  session boundaries where applicable.
- **R-ENV-1: OAuth/client configuration is environment-specific.** Preview and production
  credentials must not be interchangeable.
- **R-AUDIT-1: Mutations leave an audit trail.** A mutating tool call should produce a
  traceable event with actor, tool, target, and result.
- **R-PROMPT-1: Tool output treats untrusted content as data.** Tool responses that include
  repository/user content should not inject instructions back into the client context.

## Anti-patterns

- Exposing a generic `runCommand` or `queryDatabase` tool without narrow authorization.
- Trusting MCP client identity without checking the Worker request boundary.
- Sharing Durable Object state across tenants through predictable object IDs.
- Reusing production OAuth credentials in preview.
- Logging prompt/tool content without redaction policy.

## Open authoring questions

- Which MCP authorization profile should `v1` target first?
- Should audit trail be required for all tools or only mutating tools?
- How should VCQA classify prompt-injection defenses that are only manually reviewable?

## Benefits

- crm/packages/mcp-worker.
