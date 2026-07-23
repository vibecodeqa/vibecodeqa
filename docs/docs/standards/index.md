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
- [Compositions](compositions.md): the linked map of stack items and composed standards.
- [Examples](examples/index.md): real repositories mapped to authored standards and open gaps.
- [Authoring](authoring.md): lifecycle and templates for creating new standards.
- [Stack standards](stacks/index.md): authored rubrics and planned stack charters.
- [Stack items](items/index.md): reusable building blocks and upstream ownership.

## Authored standards

| Standard | Status | Charter | Full rubric |
|---|---|---|---|
| React SPA | Authored | [React SPA charter](stacks/react-spa.md) | [React SPA v1](/standards/react-spa/v1/) |
| Cloudflare Pages Fullstack | Authored | [Cloudflare Pages Fullstack charter](stacks/cloudflare-pages-fullstack.md) | [Cloudflare Pages Fullstack v1](/standards/cloudflare-pages-fullstack/v1/) |
| Cloudflare D1 App | Authored | [Cloudflare D1 App charter](stacks/cloudflare-d1-app.md) | [Cloudflare D1 App v1](/standards/cloudflare-d1-app/v1/) |
| Cloudflare Worker MCP Server | Authored | [Cloudflare Worker MCP Server charter](stacks/cloudflare-worker-mcp-server.md) | [Cloudflare Worker MCP Server v1](/standards/cloudflare-worker-mcp-server/v1/) |
| Tenant-Deployed Cloudflare SaaS | Authored | [Tenant-Deployed Cloudflare SaaS charter](stacks/tenant-deployed-cloudflare-saas.md) | [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/) |
| Security | Authored | [Web Security item](items/web-security.md) | [Security v1](/standards/security/v1/) |

## Planned stack charters

- [Node CLI Internal Tool](stacks/node-cli-internal-tool.md)
- [TypeScript SDK](stacks/typescript-sdk.md)
- [GitHub Action Package](stacks/github-action-package.md)
- [VS Code Extension Package](stacks/vscode-extension-package.md)
- [Tauri React Desktop](stacks/tauri-react-desktop.md)
- [Zensical KB Site](stacks/zensical-kb-site.md)

## Planned cross-cutting standards

- Testing
- TypeScript
- Dependency Hygiene
- Accessibility

Testing, TypeScript, Dependency Hygiene, Node CLI Internal Tool, and TypeScript SDK are
now the next standards to convert into full versioned rubrics for the Cloudflare SaaS
example.

## Worked examples

- [Cloudflare SaaS app coverage](examples/cloudflare-saas-app.md): how a real
  React/Cloudflare/D1/MCP repository maps to authored standards, planned standards, and
  the next authoring gaps.

## Reference implementations

- [vibecodeqa/reference-cloudflare-saas](https://github.com/vibecodeqa/reference-cloudflare-saas):
  open-source template repository for the Cloudflare SaaS stack. It demonstrates React
  SPA, Cloudflare Pages Functions, D1, Worker MCP, SDK, CLI, tenant manifests, runbooks,
  CI gates, and a tracked VCQA report.

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
