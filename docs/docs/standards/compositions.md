# Standards Compositions

VibeCode QA standards are built from upstream authorities plus stack-specific glue needed
to judge real repositories. This page is the map from reusable stack items to composed
standards.

The machine-readable version lives at
[`/standards/compositions.json`](/standards/compositions.json).

Product-neutral reference implementation:
[vibecodeqa/reference-cloudflare-saas](https://github.com/vibecodeqa/reference-cloudflare-saas).
It shows how the authored Cloudflare SaaS standards fit together in one template repo.

## Decision

We do not author a generic "React standard" or "TypeScript standard". React, TypeScript,
WCAG, OWASP, Cloudflare, and MCP already publish the broad doctrine. VibeCode QA standards
define deployable stack shapes and cite those sources.

## Authored Standards

[React SPA](stacks/react-spa.md) is authored as
[React SPA v1](/standards/react-spa/v1/). The older name `react-spa-static` is an alias,
not a separate standard.

It composes [React](items/react.md), [React Router](items/react-router.md),
[Vite](items/vite.md), [TypeScript](items/typescript.md),
[Web Accessibility](items/web-accessibility.md), [Web Security](items/web-security.md),
[Vitest](items/vitest.md), and [Playwright](items/playwright.md).

[Cloudflare Pages Fullstack](stacks/cloudflare-pages-fullstack.md) is authored as
[Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/). It composes
[React SPA](stacks/react-spa.md),
[Cloudflare Pages Functions](items/cloudflare-pages-functions.md),
[TypeScript](items/typescript.md), [Web Security](items/web-security.md), and
[GitHub Actions](items/github-actions.md).

[Cloudflare D1 App](stacks/cloudflare-d1-app.md) is authored as
[Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/). It composes
[Cloudflare D1](items/cloudflare-d1.md),
[Cloudflare Pages Functions](items/cloudflare-pages-functions.md),
[Cloudflare Workers](items/cloudflare-workers.md), [TypeScript](items/typescript.md),
[Web Security](items/web-security.md), and [GitHub Actions](items/github-actions.md). It
owns migration discipline, drift checks, local apply tests, environment/tenant DB
isolation, query safety, and deployment gates.

[Cloudflare Worker MCP Server](stacks/cloudflare-worker-mcp-server.md) is authored as
[Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/). It composes
  [Cloudflare Workers](items/cloudflare-workers.md),
  [Durable Objects](items/durable-objects.md), [MCP](items/mcp.md), [Zod](items/zod.md),
  [TypeScript](items/typescript.md), [Web Security](items/web-security.md), and
[GitHub Actions](items/github-actions.md). It owns remote MCP authorization, tool schemas,
permission boundaries, storage policy, environment isolation, audit trail, and output
safety.

[Tenant-Deployed Cloudflare SaaS](stacks/tenant-deployed-cloudflare-saas.md) is authored
as [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/).
It composes [Cloudflare Pages Functions](items/cloudflare-pages-functions.md),
[Cloudflare D1](items/cloudflare-d1.md), [Cloudflare Workers](items/cloudflare-workers.md),
[GitHub Actions](items/github-actions.md), [Web Security](items/web-security.md), and
[Docs KB](items/docs-kb.md). It owns tenant resource manifests, tenant/environment
bindings, protected previews and aliases, promotion gates, D1 state runbooks,
provisioning, observability, and auditability.

[Security](items/web-security.md) is authored as
[Security v1](/standards/security/v1/). It is cross-cutting rather than a deployable
stack standard. It composes OWASP-backed [Web Security](items/web-security.md),
[GitHub Actions](items/github-actions.md), Cloudflare runtime boundaries, MCP tool
boundaries, and docs/runbook evidence. It owns authorization boundary checks, secret
exposure checks, input/output safety, tenant/environment isolation, deploy permissions,
security logging, and incident evidence.

## Planned Stack Standards

### Cross-Cutting

- Testing: applies to every slice; owns required test layers, smoke checks, CI evidence,
  and failure artifacts.
- TypeScript: applies to typed slices; owns strictness policy, generated-file exceptions,
  typed boundaries, and project references.
- Dependency Hygiene: applies to package-managed slices; owns lockfile, audit, install
  script, license, runtime, and supply-chain risk gates.
- Accessibility: applies to UI slices; owns scan/manual acceptance gates that compose
  WCAG and WAI-ARIA guidance into stack-specific review.

### Packages and Tools

- [Node CLI Internal Tool](stacks/node-cli-internal-tool.md): composes
  [Node.js](items/node.md), [TypeScript](items/typescript.md),
  [OpenAPI](items/openapi.md), and [Web Security](items/web-security.md). It owns
  exit-code contracts, credential resolution, safe defaults, structured output, and SDK
  reuse.
- [TypeScript SDK](stacks/typescript-sdk.md): composes
  [TypeScript](items/typescript.md), [OpenAPI](items/openapi.md), [Zod](items/zod.md), and
  [Vitest](items/vitest.md). It owns export maps, declarations, contract freshness,
  typed errors, and consumer compatibility tests.
- [GitHub Action Package](stacks/github-action-package.md): composes
  [GitHub Action Package](items/github-action.md), [GitHub Actions](items/github-actions.md),
  [Node.js](items/node.md), and [TypeScript](items/typescript.md). It owns metadata,
  minimum token permissions, input validation, runtime policy, and release tagging.
- [VS Code Extension Package](stacks/vscode-extension-package.md): composes
  [VS Code Extension](items/vscode-extension.md), [TypeScript](items/typescript.md),
  [Node.js](items/node.md), and [Web Security](items/web-security.md). It owns activation
  scope, workspace trust, command/webview boundaries, marketplace metadata, and extension
  tests.
- [Tauri React Desktop](stacks/tauri-react-desktop.md): composes [Tauri](items/tauri.md),
  [React](items/react.md), [TypeScript](items/typescript.md),
  [Web Security](items/web-security.md), and [Docs KB](items/docs-kb.md). It owns native
  command/capability boundaries, secure storage, file-system safety, signing, and
  frontend/backend contract typing.
- [Zensical KB Site](stacks/zensical-kb-site.md): composes [Docs KB](items/docs-kb.md) and
  [GitHub Actions](items/github-actions.md). It owns Markdown source-of-truth discipline,
  generated-site handling, stable URLs, source references, and docs drift checks.

## Stack Items

Use [Stack Items](items/index.md) for the reusable building blocks. Each item page explains
what upstream owns, what VCQA owns when the item appears in a stack, detection signals, and
the composed standards that use it.

## Authoring Order

1. [Testing](items/vitest.md), TypeScript, and Dependency Hygiene cross-cutting standards:
   remove the remaining repo-wide gaps shown by the resolver.
2. [Node CLI Internal Tool](stacks/node-cli-internal-tool.md) and
   [TypeScript SDK](stacks/typescript-sdk.md): cover the operator and package surfaces in
   the Cloudflare SaaS example.
3. [Zensical KB Site](stacks/zensical-kb-site.md): covers docs source-of-truth and
   publishing discipline.
