# OpenAPI

OpenAPI describes HTTP API contracts used for documentation, validation, and client
generation. VCQA uses this item for contract freshness and generated-code drift, not for
generic REST design doctrine.

## Upstream references

- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [JSON Schema](https://json-schema.org/specification)
- [JSON Schema Draft 2020-12](https://json-schema.org/draft/2020-12)

## What upstream owns

- OpenAPI document structure and version semantics
- path, operation, parameter, request body, response, security, and component semantics
- JSON Schema alignment for schema vocabularies and validation behavior

## VCQA-owned rule surface

- **OAS-SOURCE:** each stack names a source of truth for the API contract: handwritten
  OpenAPI, generated OpenAPI, Zod-derived schemas, or server annotations.
- **OAS-FRESH:** checked-in contracts, generated SDK types, mock fixtures, and docs are
  regenerated or diff-checked in CI when endpoint code changes.
- **OAS-COVERAGE:** public HTTP operations include method, path, parameters, request body,
  success responses, error responses, and security requirements where applicable.
- **OAS-SCHEMA:** schemas used for request/response validation stay aligned with JSON Schema
  dialect expectations and any Zod conversion limitations.
- **OAS-CLIENT:** generated TypeScript clients expose stable types and error models that
  match the published contract, not only happy-path responses.

## Detection signals

- `openapi.yaml`, `openapi.json`, or generated API clients
- API contract scripts
- SDK generation config
- `components.schemas`, `paths`, `operationId`, `securitySchemes`, or `$schema`
- checked-in generated types or clients referencing OpenAPI

## Composed standards

- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)

## Combination-born examples

- OpenAPI plus TypeScript SDK requires generated types to match the checked-in contract.
- OpenAPI plus Zod requires a documented source of truth for schemas.
- OpenAPI plus CLI tooling needs stable output/error contracts for automation.
- OpenAPI plus GitHub Actions needs CI drift checks so releases do not publish stale clients
  or docs.
