# Zod

Zod provides runtime schemas that can infer TypeScript types. VCQA uses this item for
boundary validation and schema-sharing glue; TypeScript owns static checking and OpenAPI
owns published HTTP contract semantics.

## Upstream references

- [Zod Documentation](https://zod.dev/)
- [Basic usage](https://zod.dev/basics)
- [Defining schemas](https://zod.dev/api)
- [Formatting errors](https://zod.dev/error-formatting)
- [JSON Schema conversion](https://zod.dev/json-schema)

## What upstream owns

- schema API behavior and parser semantics
- `parse`, `safeParse`, async parsing, error, transform, and refinement mechanics
- TypeScript inference for schema input and output types
- JSON Schema conversion behavior

## VCQA-owned rule surface

- **ZOD-BOUNDARY:** untrusted request bodies, query params, env values, tool arguments,
  storage reads, webhook payloads, and SDK inputs are parsed before side effects.
- **ZOD-ERROR:** user-facing validation errors have a stable, non-leaky shape; internal
  parser issues are logged or mapped according to the stack standard.
- **ZOD-SOURCE:** shared schemas have a documented source of truth when also exported to
  OpenAPI, JSON Schema, forms, or generated SDK types.
- **ZOD-ASYNC:** async refinements and transforms use async parsing APIs and are not hidden
  behind synchronous helper types.
- **ZOD-TYPE:** `z.infer`, `z.input`, and `z.output` are used intentionally when transforms
  make input and output types differ.

## Detection signals

- `zod` dependency
- schema modules
- `safeParse` or `parse` calls at boundaries
- `z.infer`, `z.input`, `z.output`, transforms, refinements, or formatted errors
- schema export/generation scripts for JSON Schema or OpenAPI

## Composed standards

- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)

## Combination-born examples

- Zod plus OpenAPI needs contract freshness checks between schemas and published API docs.
- Zod plus React forms requires accessible error mapping, not just validation failure.
- Zod plus MCP tools means tool arguments are parsed before side effects.
- Zod plus TypeScript SDKs gives consumers typed outputs, but runtime inputs from users,
  network, and configuration still require parsing.
