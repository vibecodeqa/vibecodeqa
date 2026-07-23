# Node CLI Internal Tool

**Status:** Planned charter

Node-based command-line tools used by developers, CI, operators, or internal automation.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

Node-based command-line tools used by developers, CI, operators, or internal automation.

## Not in scope

- browser apps
- published SDKs with no CLI entrypoint
- long-running services unless the CLI controls them

## Composes

- [TypeScript](../items/typescript.md)
- [Node.js](../items/node.md)
- [OpenAPI](../items/openapi.md)
- [Web Security](../items/web-security.md)

## VCQA-owned rule surface

- noninteractive exit-code contract.
- credential resolution order.
- prod/staging safety defaults.
- structured output mode.
- SDK reuse instead of API duplication.

## Detection signals

- `package.json#bin`
- Node CLI dependencies such as `commander` or `yargs`
- scripts invoked by CI or operators

## Combination-born guidelines

- Exit codes and stderr/stdout behavior are part of the API.
- Credential lookup order must make production operations explicit.
- Structured output mode is required when CI or agents consume results.

## Benefits

- Cloudflare SaaS example CLI.
- vcqa/cli.
