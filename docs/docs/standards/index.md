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
- [Authoring](authoring.md): lifecycle and templates for creating new standards.
- [Stack standards](stacks/index.md): authored rubrics and planned stack charters.
- [Stack items](items/index.md): reusable building blocks and upstream ownership.

## Authored standards

| Standard | Status | Charter | Full rubric |
|---|---|---|---|
| React SPA | Authored | [React SPA charter](stacks/react-spa.md) | [React SPA v1](/standards/react-spa/v1/) |

## Planned stack charters

- [Cloudflare Pages Fullstack](stacks/cloudflare-pages-fullstack.md)
- [Cloudflare D1 App](stacks/cloudflare-d1-app.md)
- [Cloudflare Worker MCP Server](stacks/cloudflare-worker-mcp-server.md)
- [Tenant-Deployed Cloudflare SaaS](stacks/tenant-deployed-cloudflare-saas.md)
- [Node CLI Internal Tool](stacks/node-cli-internal-tool.md)
- [TypeScript SDK](stacks/typescript-sdk.md)
- [GitHub Action Package](stacks/github-action-package.md)
- [VS Code Extension Package](stacks/vscode-extension-package.md)
- [Tauri React Desktop](stacks/tauri-react-desktop.md)
- [Zensical KB Site](stacks/zensical-kb-site.md)

The first three charters are now seeded with candidate rule IDs, anti-patterns, and open
authoring questions. They are the next standards to convert into full versioned rubrics.

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
