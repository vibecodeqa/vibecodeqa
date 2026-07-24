# Model Context Protocol

MCP defines how tools, resources, prompts, and transports are exposed to AI clients.

## Upstream references

- [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)

## What upstream owns

- protocol messages
- transport behavior
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

- MCP plus Workers requires edge authorization and protected resource metadata.
- MCP plus Zod requires precise tool schemas that constrain arguments before execution.
- MCP plus OAuth requires tool-level permission boundaries and audit trails for mutations.
