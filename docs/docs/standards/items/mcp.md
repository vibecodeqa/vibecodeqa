# Model Context Protocol

MCP defines how tools, resources, prompts, discovery, authorization, and transports are
exposed to AI clients.

## Upstream references

- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2026-07-28)
- [MCP Versioning and Compatibility](https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning)
- [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http)
- [MCP Server Discovery](https://modelcontextprotocol.io/specification/2026-07-28/server/discover)
- [MCP Authorization Server Discovery](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/authorization-server-discovery)
- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## What upstream owns

- protocol messages and per-request version metadata
- stateless Streamable HTTP transport behavior
- `server/discover`
- authorization specification
- SDK APIs

## What VCQA owns

- tool safety rubric.
- remote authorization policy.
- tool schema quality.
- auditability.

## Detection signals

- `@modelcontextprotocol/sdk` dependency
- MCP server entrypoints
- tool/resource schema definitions

## Composed standards

- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)

## Combination-born guidelines

- MCP plus Workers requires edge authorization, `server/discover`, and protected resource
  metadata.
- MCP 2026-07-28 plus Streamable HTTP requires `MCP-Protocol-Version`, `Mcp-Method`, and
  `Mcp-Name` header validation before routing or policy trusts mirrored headers.
- MCP plus Zod requires precise tool schemas that constrain arguments before execution.
- MCP plus OAuth requires tool-level permission boundaries and audit trails for mutations.
