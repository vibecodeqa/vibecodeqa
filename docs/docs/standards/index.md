# Standards

VibeCode QA standards are the reviewable rules a project is judged against after its stack has been detected.

The important boundary is this: VibeCode QA does **not** re-create broad framework doctrine. React, TypeScript, WCAG, OWASP, Cloudflare, MCP, GitHub Actions, and other ecosystem authorities already publish the broad rules. VibeCode QA cites those sources, then owns the stack-specific glue:

- repository and slice shape
- runtime and deployment constraints
- detection mapping
- exception policy
- anti-patterns a scanner or AI judge should flag

```text
upstream standards + stack items + deploy/runtime seams = VCQA rubric
```

## How this section is organized

- [References](references.md): official specs and primary-source docs to cite before writing a VibeCode QA rule.
- [Assessment](assessment.md): criteria for judging rubrics, reference repos, and VCQA itself.
- [Assessment reports](assessments/index.md): dated independent reports on standards pages and reference implementations.
- [Compositions](compositions.md): the linked map of stack items and composed standards.
- [Graph](graph.md): navigable graph of stack standards, stack-item leaves, templates, and VCQA reports.
- [Examples](examples/index.md): real repositories mapped to authored standards and open gaps.
- [Authoring](authoring.md): lifecycle and templates for creating new standards.
- [Stack standards](stacks/index.md): authored rubrics and planned stack charters.
- [Stack items](items/index.md): reusable building blocks and upstream ownership.

## Authored stack rubrics

These are deployable stack shapes with full versioned rubrics and stack charter pages.

| Stack standard | Charter | Full rubric |
|---|---|---|
| React SPA | [React SPA charter](stacks/react-spa.md) | [React SPA v1](/standards/react-spa/v1/) |
| Cloudflare Pages Fullstack (`react-spa-on-cloudflare-pages` alias) | [Cloudflare Pages Fullstack charter](stacks/cloudflare-pages-fullstack.md) | [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) |
| Cloudflare D1 App | [Cloudflare D1 App charter](stacks/cloudflare-d1-app.md) | [Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/) |
| Cloudflare Worker MCP Server | [Cloudflare Worker MCP Server charter](stacks/cloudflare-worker-mcp-server.md) | [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/) |
| Tenant-Deployed Cloudflare SaaS | [Tenant-Deployed Cloudflare SaaS charter](stacks/tenant-deployed-cloudflare-saas.md) | [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/) |

## Authored cross-cutting rubrics

These are first-class authored standards, but they are not deployable stack charters. They
apply across stack shapes when the relevant item leaves are present.

| Cross-cutting standard | Catalog page | Full rubric |
|---|---|---|
| Security | [Web Security item](items/web-security.md) | [Security v1](/standards/security/v1/) |
| Testing | [Vitest item](items/vitest.md), [Playwright item](items/playwright.md), and [GitHub Actions item](items/github-actions.md) | [Testing v1](/standards/testing/v1/) |
| TypeScript | [TypeScript item](items/typescript.md) | [TypeScript v1](/standards/typescript/v1/) |

## Planned stack charters

These pages have charters and composition maps, but no full versioned rubric yet.

- [Node CLI Internal Tool](stacks/node-cli-internal-tool.md)
- [TypeScript SDK](stacks/typescript-sdk.md)
- [GitHub Action Package](stacks/github-action-package.md)
- [VS Code Extension Package](stacks/vscode-extension-package.md)
- [Tauri React Desktop](stacks/tauri-react-desktop.md)
- [Zensical KB Site](stacks/zensical-kb-site.md)

## Planned cross-cutting standards

- Dependency Hygiene
- Accessibility

Dependency Hygiene, Node CLI Internal Tool, TypeScript SDK, and Accessibility are now the
next standards to convert into full versioned rubrics for the Cloudflare SaaS example.

## Catalog entry points

- [Stack standards](stacks/index.md): authored stack rubrics and planned stack charters.
- [Stack items](items/index.md): reusable framework, runtime, protocol, testing, CI, docs,
  and security leaves.
- [Standards graph](graph.md): linked map of authored stack rubrics, cross-cutting
  rubrics, planned stack charters, item leaves, templates, and VCQA reports.
- [Assessment reports](assessments/index.md): dated reviews for every stack charter page.
- [Examples](examples/index.md): real repositories mapped to authored rubrics and planned
  gaps.

## Worked examples

- [Cloudflare SaaS app coverage](examples/cloudflare-saas-app.md): how a real
  React/Cloudflare/D1/MCP repository maps to authored standards, planned standards, and
  the next authoring gaps.

## Reference implementations

Reference implementations are one public GitHub template repo per reusable stack archetype
or high-value stack composition. The intent is not to generate every possible combination
up front; it is to keep a curated set where each repo demonstrates a standard, carries CI,
and tracks its own VCQA report.

These templates do not replace vendor starters. Use official React, Vite, Cloudflare, MCP,
and other ecosystem docs for basic project creation. VCQA templates show the extra
composition layer: how upstream guidance, deploy/runtime seams, CI evidence, runbooks, and
VCQA reports fit together.

- [vibecodeqa/ref-react-spa](https://github.com/vibecodeqa/ref-react-spa):
  open-source template repository for the React SPA stack. It demonstrates Vite,
  TypeScript, React Router, Vitest, Playwright, static build gates, client environment
  boundaries, and a tracked A-grade VCQA report. Official starting points:
  [React app from Scratch](https://react.dev/learn/build-a-react-app-from-scratch) and
  [Vite getting started](https://vite.dev/guide/). Report:
  [A 94/100](https://github.com/vibecodeqa/ref-react-spa/blob/main/docs/vcqa-report.md).
- [vibecodeqa/ref-cloudflare-worker-mcp](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp):
  open-source template repository for the Cloudflare Worker MCP Server stack. It
  demonstrates the MCP TypeScript SDK's Web Standard Streamable HTTP transport on
  Cloudflare Workers, protected resource metadata, authorization before tool dispatch,
  scoped tool permissions, Zod validation, audit events, runbooks, Wrangler dry-run
  deploys, and a tracked A-grade VCQA report. Official starting points:
  [Cloudflare Workers templates](https://developers.cloudflare.com/workers/get-started/quickstarts/),
  [Cloudflare templates](https://github.com/cloudflare/templates),
  [MCP TypeScript SDK](https://ts.sdk.modelcontextprotocol.io/), and
  [MCP Streamable HTTP transport](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).
  Report:
  [A 91/100](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp/blob/main/docs/vcqa-report.md).
- [vibecodeqa/ref-cloudflare-saas](https://github.com/vibecodeqa/ref-cloudflare-saas):
  open-source reference fixture for tenant-deployed Cloudflare SaaS. It demonstrates one
  rich composition: React SPA, Cloudflare Pages Functions, D1, Worker MCP, SDK, CLI,
  tenant manifests, runbooks, CI gates, and a tracked VCQA report. The standard is broader
  than this exact repo shape; it applies when tenant identity changes deployable Cloudflare
  resources, environments, data bindings, domains, or operational evidence. Report:
  [A 91/100](https://github.com/vibecodeqa/ref-cloudflare-saas/blob/main/docs/vcqa-report.md).
- [vibecodeqa/ref-node-cli-internal-tool](https://github.com/vibecodeqa/ref-node-cli-internal-tool):
  open-source template repository for the Node CLI Internal Tool stack. It demonstrates
  strict TypeScript, stable exit codes, credential resolution order, production safety
  guards, structured output, parser tests, and executable smoke checks. Report:
  [A 92/100](https://github.com/vibecodeqa/ref-node-cli-internal-tool/blob/main/docs/vcqa-report.md).

Next template candidates:

- `ref-cloudflare-pages-fullstack`: React SPA plus same-origin Pages Functions.
- `ref-cloudflare-d1-app`: D1 migrations, local apply checks, bindings, and query
  safety without the rest of the SaaS composition.
- `ref-typescript-sdk`: export maps, declarations, typed errors, generated client
  drift checks, and consumer compatibility tests.
- `ref-zensical-kb-site`: Markdown source of truth, stable docs URLs, references,
  generated-site policy, and docs smoke checks.
- `ref-vscode-extension-package`: activation scope, workspace trust, command/webview
  boundaries, marketplace metadata, and extension tests.
- `ref-tauri-react-desktop`: Tauri command/capability boundaries, secure storage,
  file-system safety, packaging, and frontend/backend typing.

## Machine-readable files

- [`/standards/references.json`](/standards/references.json): external source registry.
- [`/standards/compositions.json`](/standards/compositions.json): composition map with docs/rubric URLs.
- [`/standards/registry.json`](/standards/registry.json): current resolver catalog.

## What gets born from combinations

Combination-born guidelines are the reason VCQA standards exist. Examples:

- React plus Vite plus static hosting: client env vars are public, and deep links require SPA fallback.
- React plus Cloudflare Pages Functions: `/api/*` routes need server-side auth middleware and must not collide with SPA routes.
- Cloudflare D1 plus GitHub Actions: migrations need a local apply check and production promotion gate.
- Workers plus MCP plus OAuth: tool schemas, scopes, and audit trails become part of the security standard.
- VS Code webviews plus React: CSP and message bridge limits are required beyond normal React guidance.
