# Cloudflare SaaS App Coverage

This example maps a real product repository to the VibeCode QA standards catalog. It is
named for the reusable architecture: React SPA, Cloudflare Pages Functions, D1,
Worker-hosted MCP, TypeScript packages, and operator tooling.

For a product-neutral implementation of this stack, see
[vibecodeqa/ref-cloudflare-saas](https://github.com/vibecodeqa/ref-cloudflare-saas).
That repository is a template and reference implementation; the standards remain the
source of truth.

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
| `app` | React SPA with Vite, TypeScript, React Router, Vitest, Playwright | Covered by [React SPA v1](/standards/react-spa/v1/) and [Security v1](/standards/security/v1/) | Shared cross-cutting standards for TypeScript, testing, accessibility, and dependency policy |
| `app/functions` | Cloudflare Pages Functions API deployed with the SPA | Covered by [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/), [Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/), and [Security v1](/standards/security/v1/) | Shared cross-cutting standards for TypeScript, testing, and dependency policy |
| repo tenant deployment | Tenant deployment scripts and per-environment Cloudflare resources | Covered by [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/) and [Security v1](/standards/security/v1/) | Testing, dependency, and docs drift checks |
| `packages/mcp-worker` | Cloudflare Worker remote MCP server with Zod and OAuth-related dependencies | Covered by [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/) and [Security v1](/standards/security/v1/) | Shared cross-cutting standards for TypeScript, testing, and dependency policy |
| `packages/cli` | Node command-line client using the SDK | Planned | [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md) |
| `packages/sdk` | Private TypeScript SDK package | Planned | [TypeScript SDK](../stacks/typescript-sdk.md) |
| `packages/mcp` | Generated or build-output MCP artifact without a package manifest | No standard matched | Decide whether this should be generated output, a package, or removed from resolver scope |
| repo | React SPA, Pages Functions, D1, and Worker MCP in a tenant deployment model | Covered by [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/) and the Pages Fullstack alias | Cross-cutting policy rubrics |

## Reference implementation

The open-source reference repo is:

<https://github.com/vibecodeqa/ref-cloudflare-saas>

It complements the standards this way:

- The standards define stable rule IDs, upstream references, and judgment criteria.
- The repo shows one concrete implementation that can be inspected, forked, and scanned.
- The tracked VCQA report in `docs/vcqa-report.md` gives an example of what a high-scoring
  implementation looks like.
- When standards change, this repo becomes a regression fixture: either the template is
  updated, or the standard/checker needs review.

The repo is intentionally generic. It is not CRM-specific and should not contain product
domain assumptions.

## Resolver snapshot

The standards resolver currently sees six slices:

```text
app                  react-spa@v1
app/functions        pages-fullstack@v1 + d1-database@v1
packages/cli         node-service [planned]
packages/mcp         no archetype matched
packages/mcp-worker  cloudflare-worker-mcp-server@v1
packages/sdk         library [planned]
cross-cutting        security@v1 applies to every slice
repo recipe          tenant-deployed-cloudflare-saas@v1, react-spa-on-cloudflare-pages@v1
```

The repo-level recipe `react-spa-on-cloudflare-pages` is treated as an alias of the
authored Cloudflare Pages Fullstack rubric. `tenant-deployed-cloudflare-saas@v1` is the
authored recipe that adds tenant deployment rules across Pages, Workers, D1, secrets,
aliases, and promotion gates.

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

### D1 application standard

Use [Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/) for D1 bindings,
migrations, tenant/environment isolation, query safety, local parity, and deploy gates.
This standard is now judgeable. It covers:

- append-only migration rules after a migration reaches shared environments
- migration drift or checksum expectations
- local fresh-apply checks in CI
- staging, production, preview, and tenant database isolation
- safe query construction and parameter binding checks

### Worker MCP standard

Use [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/) for
the Worker-hosted MCP server. This standard is now judgeable. It covers:

- remote MCP boundary authorization
- tool schema quality
- mutating tool permission scopes
- Durable Object or other storage boundaries where used
- per-environment OAuth/client isolation
- audit trail expectations for mutating tools

### Tenant-deployed Cloudflare SaaS standard

Use [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/)
for the repo-level deployment model. This standard is now judgeable. It covers:

- tenant resource manifests and ownership
- tenant/environment-scoped bindings and secrets
- preview URL, alias, custom-domain, and indexing posture
- promotion evidence across commit, deployment, Worker version, and D1 migration set
- rollback/fix-forward runbooks that treat code and D1 state separately
- tenant provisioning, deprovisioning, smoke tests, observability, and audit evidence

### Security standard

Use [Security v1](/standards/security/v1/) across all slices. This standard is now
judgeable. It covers:

- server-side authorization boundaries
- client/server secret exposure
- runtime input validation, SQL injection, command execution, and outbound URL safety
- browser output, raw HTML, tool output, and safe error handling
- preview/staging/production and tenant isolation checks
- GitHub Actions permissions, deployment credentials, and protected production mutation
- security logging, audit trails, and incident evidence

## What remains unjudged

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

1. Author Node CLI Internal Tool and TypeScript SDK once the app/runtime standards are
   stable enough to define shared package expectations.
2. Decide whether cross-cutting TypeScript, testing, accessibility, and dependency
   standards should become full rubrics or remain stack-item guidance.

## Coverage status

The right claim is:

```text
The frontend, Pages Functions, D1, and Worker MCP surfaces are covered by authored v1 rubrics.
The tenant deployment recipe, React-on-Pages repo recipe, and security baseline are covered by authored v1 rubrics.
CLI, SDK, testing, TypeScript, dependency, and accessibility standards still need authored rubrics.
```
