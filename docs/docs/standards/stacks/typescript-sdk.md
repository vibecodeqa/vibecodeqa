# TypeScript SDK

**Status:** Planned charter

TypeScript packages consumed as SDKs or client libraries by other projects.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

TypeScript packages consumed as SDKs or client libraries by other projects.

## Not in scope

- apps with no exported API
- private implementation packages
- untyped JavaScript packages

## Composes

- [TypeScript](../items/typescript.md)
- [OpenAPI](../items/openapi.md)
- [Zod](../items/zod.md)
- [Vitest](../items/vitest.md)

## VCQA-owned rule surface

- export map and declaration quality.
- API contract freshness.
- credential boundary.
- typed error model.
- consumer compatibility tests.

## Detection signals

- `package.json` exports or main/types fields
- declaration output
- OpenAPI/generated client config

## Combination-born guidelines

- Export maps and declarations are compatibility gates, not packaging polish.
- Generated API clients must track the checked-in OpenAPI contract.
- Runtime errors need a typed model consumers can handle without string matching.

## Benefits

- crm/packages/sdk.
- future VCQA schema/client packages.
