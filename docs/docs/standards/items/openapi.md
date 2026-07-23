# OpenAPI

OpenAPI describes HTTP API contracts for documentation, validation, and client generation.

## Upstream references

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [JSON Schema](https://json-schema.org/specification)

## What upstream owns

- OpenAPI document structure
- operation and schema semantics
- JSON Schema alignment

## What VCQA owns

- contract freshness checks.
- generated client/server drift checks.
- operation coverage.

## Detection signals

- `openapi.yaml`, `openapi.json`, or generated API clients
- API contract scripts
- SDK generation config

## Composed standards

- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)

## Combination-born guidelines

- OpenAPI plus TypeScript SDK requires generated types to match the checked-in contract.
- OpenAPI plus Zod requires a documented source of truth for schemas.
- OpenAPI plus CLI tooling needs stable output/error contracts for automation.
