# Cloudflare SaaS App Coverage

This example maps a real product repository to the VibeCode QA standards catalog. It is
named for the reusable architecture: React SPA, Cloudflare Pages Functions, D1,
Worker-hosted MCP, TypeScript packages, and operator tooling.

## What this teaches

This example is not teaching a product domain. It teaches how VCQA should decompose a real
fullstack repository into standards that can be reused across many products.

The lessons are:

- A product repository is not one standard. It is a composition of slice standards.
- Authored coverage and planned coverage must be shown separately.
- Framework best practices are cited, not rewritten.
- VCQA owns the cross-stack rules that appear only when technologies are combined.
- Resolver output should become a standards authoring backlog, not just a scan report.

## Current answer

The example app is **partially covered** today.

| Repo slice | Detected shape | Coverage today | Next needed standard |
|---|---|---|---|
| `app` | React SPA with Vite, TypeScript, React Router, Vitest, Playwright | Covered by [React SPA v1](/standards/react-spa/v1/) | Shared cross-cutting standards for TypeScript, security, testing, accessibility, and dependency policy |
| `app/functions` | Cloudflare Pages Functions API deployed with the SPA | Covered by [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) | [Cloudflare D1 App](../stacks/cloudflare-d1-app.md) |
| `app` D1 usage | D1 binding plus `migrations/` and tenant deployment scripts | Planned | [Cloudflare D1 App](../stacks/cloudflare-d1-app.md), tracked by [issue #7](https://github.com/vibecodeqa/vibecodeqa/issues/7) |
| `packages/mcp-worker` | Cloudflare Worker remote MCP server with Zod and OAuth-related dependencies | Planned | [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md), tracked by [issue #8](https://github.com/vibecodeqa/vibecodeqa/issues/8) |
| `packages/cli` | Node command-line client using the SDK | Planned | [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md) |
| `packages/sdk` | Private TypeScript SDK package | Planned | [TypeScript SDK](../stacks/typescript-sdk.md) |
| `packages/mcp` | Generated or build-output MCP artifact without a package manifest | No standard matched | Decide whether this should be generated output, a package, or removed from resolver scope |
| repo | React SPA co-deployed with Pages Functions | Covered as an alias of [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) | SaaS-specific D1 and tenant recipe after D1 v1 is authored |

## Resolver snapshot

The standards resolver currently sees six slices:

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
authored Cloudflare Pages Fullstack rubric. The next useful recipe should add D1 and
tenant deployment rules after the D1 standard is authored.

## What is already judgeable

### React app

Use [React SPA v1](/standards/react-spa/v1/) for the frontend. This repository has the
signals the standard expects:

- React 19 and React Router 7 dependencies
- Vite build pipeline
- TypeScript project build
- Vitest and Playwright scripts
- static `dist` output for Cloudflare Pages

The rubric can already judge SPA fallback, client environment boundaries,
component/runtime anti-patterns, build output hygiene, basic accessibility gates, and
frontend test posture.

### Pages Functions

Use [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) for
`app/functions`. This repository has the signals the standard expects:

- `functions/` API surface beside the SPA
- Wrangler Pages config with `pages_build_output_dir`
- same-origin app/API deployment shape
- auth-sensitive server routes
- build scripts that generate OpenAPI output before Vite build

The rubric can already judge route ownership, API/auth placement, deployed config
boundaries, same-origin API expectations, and Pages deployment assembly.

## What remains unjudged

### D1 application standard

The app uses D1 through a local Wrangler binding and tenant-oriented deployment scripts.
The full standard still needs to define:

- append-only migration rules after a migration reaches shared environments
- migration drift or checksum expectations
- local fresh-apply checks in CI
- staging, production, preview, and tenant database isolation
- safe query construction and parameter binding checks

Authoring [Cloudflare D1 App](../stacks/cloudflare-d1-app.md) is the next highest-value
step because it turns database migration and tenant isolation discipline into judgeable
rules.

### Worker MCP standard

The repo has a Worker-hosted MCP server with Cloudflare Workers, the MCP SDK, Zod, and
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

The repo also has a private SDK consumed by a Node CLI. These are planned standards, not
authored rubrics yet:

- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md): exit-code contract,
  credential resolution, production/staging safety defaults, structured output, and SDK
  reuse.
- [TypeScript SDK](../stacks/typescript-sdk.md): export maps, declarations, OpenAPI
  contract freshness, typed errors, and consumer compatibility tests.

## Combination-born guidelines

This is the important part. These are examples of rules that do not belong to React,
Cloudflare, D1, MCP, or TypeScript alone. They are born from the stack combination:

- React SPA plus Cloudflare Pages Functions: `/api/*` route ownership, SPA fallback, and
  function route matching must be checked together.
- Vite plus Cloudflare Pages: client environment variables are public, so secrets belong
  in Functions or Worker bindings only.
- Pages Functions plus D1: request handlers need server-side auth before database access,
  and migrations must gate deploys.
- D1 plus tenant deployment: staging, production, preview, and tenant databases need
  explicit isolation rules.
- MCP plus Worker plus OAuth: tool dispatch must sit behind Worker boundary
  authorization, not just client convention.
- MCP plus Zod plus SDK: tool schemas, API contracts, and SDK types need drift checks
  across the tool/API boundary.
- CLI plus SDK plus production API: command defaults, credentials, and exit codes become
  operational safety rules.

## Recommended authoring order

1. Finish [Cloudflare D1 App v1](../stacks/cloudflare-d1-app.md). This unlocks the most
   concrete unresolved risk: database migration and tenant isolation discipline.
2. Finish [Cloudflare Worker MCP Server v1](../stacks/cloudflare-worker-mcp-server.md).
   This covers the remote tool boundary, OAuth, schemas, and auditability.
3. Add a SaaS recipe that composes React SPA, Pages Fullstack, D1, and tenant deployment
   into one deployable application profile.
4. Author Node CLI Internal Tool and TypeScript SDK once the app/runtime standards are
   stable enough to define shared package expectations.

## Coverage status

The right claim is:

```text
The frontend and Pages Functions are covered by authored v1 rubrics.
The React-on-Pages repo recipe is covered as a Cloudflare Pages Fullstack alias.
D1, MCP Worker, CLI, SDK, and tenant-specific SaaS recipe still need authored rubrics.
```
