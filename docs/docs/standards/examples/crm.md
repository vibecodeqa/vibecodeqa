# CRM Stack Coverage

This page maps `~/work/crm` to the current VibeCode QA standards catalog. It is the first
worked example because CRM exercises the exact combination that motivated the standards
work: React, Vite, Cloudflare Pages Functions, D1, Workers, MCP, TypeScript packages, and
operator tooling.

## Current answer

CRM is **partially covered** today.

| CRM slice | Detected shape | Coverage today | Next needed standard |
|---|---|---|---|
| `app` | React SPA with Vite, TypeScript, React Router, Vitest, Playwright | Covered by [React SPA v1](/standards/react-spa/v1/) | Shared cross-cutting standards for TypeScript, security, testing, accessibility, and dependency policy |
| `app/functions` | Cloudflare Pages Functions API deployed with the SPA | Covered by [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) | [Cloudflare D1 App](../stacks/cloudflare-d1-app.md) |
| `app` D1 usage | D1 binding plus `migrations/` and tenant deployment scripts | Planned | [Cloudflare D1 App](../stacks/cloudflare-d1-app.md), tracked by [issue #7](https://github.com/vibecodeqa/vibecodeqa/issues/7) |
| `packages/mcp-worker` | Cloudflare Worker remote MCP server with Zod and OAuth-related dependencies | Planned | [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md), tracked by [issue #8](https://github.com/vibecodeqa/vibecodeqa/issues/8) |
| `packages/cli` | Node command-line client using the SDK | Planned | [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md) |
| `packages/sdk` | Private TypeScript SDK package | Planned | [TypeScript SDK](../stacks/typescript-sdk.md) |
| `packages/mcp` | Generated or build-output MCP artifact without a package manifest | No standard matched | Decide whether this should be generated output, a package, or removed from resolver scope |
| repo | React SPA co-deployed with Pages Functions | Covered as an alias of [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) | CRM-specific D1 and tenant recipe after D1 v1 is authored |

## Resolver snapshot

The standards resolver currently sees six CRM slices:

```text
app                  react-spa@v1
app/functions        pages-fullstack@v1
packages/cli         node-service [planned]
packages/mcp         no archetype matched
packages/mcp-worker  worker-edge + mcp-server + zod-validation [planned]
packages/sdk         library [planned]
repo recipe          react-spa-on-cloudflare-pages@v1
```

The repo-level recipe `react-spa-on-cloudflare-pages` is treated as an alias of the
authored Cloudflare Pages Fullstack rubric. The next useful CRM-specific recipe should add
D1 and tenant deployment rules after the D1 standard is authored.

## What is already judgeable

### React app

Use [React SPA v1](/standards/react-spa/v1/) for the `app` frontend. CRM has the signals
this standard expects:

- React 19 and React Router 7 dependencies
- Vite build pipeline
- TypeScript project build
- Vitest and Playwright scripts
- static `dist` output for Cloudflare Pages

The rubric can already judge SPA fallback, client env boundaries, component/runtime
anti-patterns, build output hygiene, basic accessibility gates, and frontend test posture.

### Pages Functions

Use [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) for
`app/functions`. CRM has the signals this standard expects:

- `functions/` API surface beside the SPA
- Wrangler Pages config with `pages_build_output_dir`
- same-origin app/API deployment shape
- auth-sensitive server routes
- build scripts that generate OpenAPI output before Vite build

The rubric can already judge route ownership, API/auth placement, deployed config
boundaries, same-origin API expectations, and Pages deployment assembly.

## What CRM still needs

### D1 application standard

CRM uses D1 through a local Wrangler binding and tenant-oriented deployment scripts. The
full standard still needs to define:

- append-only migration rules after a migration reaches shared environments
- migration drift or checksum expectations
- local fresh-apply checks in CI
- staging, production, preview, and tenant database isolation
- safe query construction and parameter binding checks

Authoring [Cloudflare D1 App](../stacks/cloudflare-d1-app.md) is the next highest-value
step for CRM because it turns the database and tenant migration model into judgeable
rules.

### Worker MCP standard

CRM has `@rocketlab-crm/mcp-worker`, with Cloudflare Workers, the MCP SDK, Zod, and
OAuth-related dependencies. The full standard still needs to define:

- remote MCP boundary authorization
- tool schema quality
- mutating tool permission scopes
- Durable Object or other storage boundaries where used
- per-environment OAuth/client isolation
- audit trail expectations for mutating tools

Authoring [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md) makes
the MCP surface reviewable instead of treating it as a generic Worker.

### CLI and SDK standards

CRM also has a private SDK consumed by a Node CLI. These are planned standards, not
authored rubrics yet:

- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md): exit-code contract,
  credential resolution, production/staging safety defaults, structured output, and SDK
  reuse.
- [TypeScript SDK](../stacks/typescript-sdk.md): export maps, declarations, OpenAPI
  contract freshness, typed errors, and consumer compatibility tests.

## Recommended authoring order for CRM

1. Finish [Cloudflare D1 App v1](../stacks/cloudflare-d1-app.md). This unlocks the most
   concrete unresolved CRM risk: database migration and tenant isolation discipline.
2. Finish [Cloudflare Worker MCP Server v1](../stacks/cloudflare-worker-mcp-server.md).
   This covers the remote tool boundary, OAuth, schemas, and auditability.
3. Add a CRM-specific recipe that composes React SPA, Pages Fullstack, D1, and tenant
   deployment into one deployable application profile.
4. Author Node CLI Internal Tool and TypeScript SDK once the app/runtime standards are
   stable enough to define shared package expectations.

## Coverage status

CRM is a useful example now, but it is not fully covered yet.

The right claim is:

```text
CRM frontend and Pages Functions are covered by authored v1 rubrics.
CRM's React-on-Pages repo recipe is covered as a Cloudflare Pages Fullstack alias.
CRM database, MCP Worker, CLI, SDK, and tenant-specific recipe still need authored rubrics.
```
