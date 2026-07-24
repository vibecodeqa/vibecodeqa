# Stack Standards

Stack standards are the VCQA-owned units that can become full, versioned rubrics. They
describe deployable shapes, not isolated frameworks.

## Authored stack rubrics

- [React SPA](react-spa.md): client-rendered React hosted as static files. Full rubric:
  [React SPA v1](/standards/react-spa/v1/). Template:
  [ref-react-spa](https://github.com/vibecodeqa/ref-react-spa).
- [Cloudflare Pages Fullstack](cloudflare-pages-fullstack.md): static frontend plus
  same-origin Pages Functions API. Full rubric:
  [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/). Also
  cataloged as `react-spa-on-cloudflare-pages`.
- [Cloudflare D1 App](cloudflare-d1-app.md): D1 migrations, bindings, query safety, and
  environment isolation. Full rubric:
  [Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/).
- [Cloudflare Worker MCP Server](cloudflare-worker-mcp-server.md): remote MCP on Workers
  with authorization, tool schemas, storage boundaries, and auditability. Full rubric:
  [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/). Template:
  [ref-cloudflare-worker-mcp](https://github.com/vibecodeqa/ref-cloudflare-worker-mcp).
- [Tenant-Deployed Cloudflare SaaS](tenant-deployed-cloudflare-saas.md): per-tenant
  Cloudflare deployment, provisioning, promotion, data state, aliases, and auditability.
  Full rubric: [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/).

## Authored cross-cutting rubrics

Cross-cutting rubrics are authored standards too, but they are cataloged through item
pages because they apply across many stack shapes rather than defining a deployable stack
by themselves.

- [Security v1](/standards/security/v1/): cataloged from the
  [Web Security](../items/web-security.md) item.
- [Testing v1](/standards/testing/v1/): cataloged from the
  [Vitest](../items/vitest.md), [Playwright](../items/playwright.md), and
  [GitHub Actions](../items/github-actions.md) items.
- [TypeScript v1](/standards/typescript/v1/): cataloged from the
  [TypeScript](../items/typescript.md) item.

## Planned stack charters

- [Node CLI Internal Tool](node-cli-internal-tool.md): Node CLIs used by developers, CI,
  or operators.
- [TypeScript SDK](typescript-sdk.md): package/API compatibility for TypeScript client
  libraries.
- [GitHub Action Package](github-action-package.md): reusable Actions with metadata,
  input validation, permissions, and release policy.
- [VS Code Extension Package](vscode-extension-package.md): editor extension activation,
  trust, webviews, and marketplace packaging.
- [Tauri React Desktop](tauri-react-desktop.md): React frontend plus native Tauri command
  and capability boundaries.
- [Zensical KB Site](zensical-kb-site.md): Markdown-authored docs KB with stable published
  URLs and source/reference discipline.

## What makes a stack standard

A stack standard should exist when a combination creates rules that no single upstream
source owns. For example, Cloudflare D1 docs explain migrations, and GitHub Actions docs
explain workflows, but VCQA must define the combined rule that CI applies D1 migrations to
a clean local database before production promotion.

## Independent Assessments

Every stack page has a dated assessment report under
[Standards Assessments](../assessments/index.md). These reports judge whether the page is
clear, evidence-backed, checkable, and ready to define or support a full rubric.

For the complete public map across stack standards, cross-cutting standards, stack items,
examples, templates, and reports, use the [Standards Graph](../graph.md).
