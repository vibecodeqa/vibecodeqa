# Zod

Zod provides runtime schema validation with TypeScript inference.

## Upstream references

- [Zod Documentation](https://zod.dev/)

## What upstream owns

- schema API behavior
- parsing and error mechanics
- type inference

## What VCQA owns

- boundary-validation expectations.
- safeParse/error-shape policy.
- schema sharing across API/client seams.

## Detection signals

- `zod` dependency
- schema modules
- `safeParse` or `parse` calls at boundaries

## Composed standards

- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)

## Combination-born guidelines

- Zod plus OpenAPI needs contract freshness checks between schemas and published API docs.
- Zod plus React forms requires accessible error mapping, not just validation failure.
- Zod plus MCP tools means tool arguments are parsed before side effects.
