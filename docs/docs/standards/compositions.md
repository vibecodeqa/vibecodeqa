# Standards Compositions

VibeCode QA standards are built from upstream authorities plus the stack-specific glue
needed to judge real repositories.

The machine-readable version lives at
[`/standards/compositions.json`](/standards/compositions.json).

## Decision

We do not author a generic "React standard" or "TypeScript standard". React, TypeScript,
WCAG, OWASP, Cloudflare, and MCP already publish the broad doctrine. VibeCode QA standards
define deployable stack shapes and cite those sources.

## Individual stack items

| Item | Kind | Upstream references | VCQA owns |
|---|---|---|---|
| `node` | runtime | Node docs, Node security, npm `package.json` | Runtime and package metadata gates, CLI/service process safety, Node-specific security checks. |
| `react` | framework | React docs, Rules of Hooks | Detection mapping for hook/component anti-patterns; stack-specific conventions only where needed. |
| `react-router` | routing | React Router docs | SPA fallback expectations and route organization for static deployments. |
| `vite` | build tool | Vite guide, Vite static deploy | Build artifact expectations, env boundary, static hosting fit. |
| `typescript` | language | TSConfig Reference, TypeScript Handbook | Strictness enforcement by stack, generated-file exceptions, typed boundary checks. |
| `web-accessibility` | quality | WCAG 2.2, WAI-ARIA APG | Code-level detection mapping and UI acceptance gates. |
| `web-security` | security | OWASP ASVS, OWASP cheat sheets | Stack-specific auth, secret boundaries, detectable unsafe patterns, CI gates. |
| `vitest` | testing | Vitest guide | Required test layers by stack, coverage and CI gate expectations. |
| `playwright` | testing | Playwright best practices | E2E smoke coverage by deployable app shape, artifact and failure-report expectations. |
| `cloudflare-pages-functions` | runtime | Pages Functions routing and middleware docs | Functions shape, same-origin API seam, SPA/functions route collision checks, binding policy. |
| `cloudflare-workers` | runtime | Cloudflare Workers docs and best practices | Compatibility-date policy, Worker deployment checks, runtime anti-patterns. |
| `cloudflare-d1` | database | D1 docs and migrations | Migration discipline, local/remote parity, tenant DB isolation, query-safety checks. |
| `durable-objects` | state | Durable Objects docs and best practices | Stateful object boundaries, migration/storage policy, binding checks. |
| `mcp` | protocol | MCP spec, authorization, security, TypeScript SDK | Tool safety, remote authorization, schema quality, auditability. |
| `zod` | validation | Zod docs | Boundary validation, `safeParse`/error shape, schema sharing across seams. |
| `openapi` | API contract | OpenAPI, JSON Schema | Contract freshness, generated client/server drift, operation coverage. |
| `github-actions` | CI | GitHub Actions secure use and OIDC/deployment hardening | Workflow permission gates, environment checks, required stack gates. |
| `vscode-extension` | extension | VS Code extension API, publishing, runtime security | Activation scope, webview/security policy, marketplace metadata checks. |
| `github-action` | automation | GitHub action metadata and creating actions docs | `action.yml` quality, input/output contract, token/permission guidance, release policy. |
| `tauri` | desktop | Tauri docs | Command/capability boundaries, secret storage, packaging/signing checks. |
| `docs-kb` | documentation | Zensical, Diataxis, ADR guidance, C4 | Source/build separation, ADR freshness, published KB access policy, architecture drift gates. |

## Composed standards to author

| Composed standard | Status | Composes | Owned rule surface | Benefits |
|---|---|---|---|---|
| `react-spa-static` | Authored as `react-spa` v1 | React, React Router, Vite, TypeScript, accessibility, security, Vitest, Playwright | Static SPA boundary, client env policy, routing fallback, build output and asset hygiene. | VibeCode QA app web dashboard; CRM app frontend. |
| `cloudflare-pages-fullstack` | Planned | `react-spa-static`, Pages Functions, TypeScript, security, GitHub Actions | Same-origin API seam, Functions route shape, middleware/auth placement, bindings, deployed vars, SPA/functions deploy assembly. | CRM app; future VibeCode QA dashboard patterns. |
| `cloudflare-d1-app` | Planned | D1, TypeScript, security, GitHub Actions | Versioned migrations, checksums/drift guard, local apply test, staging/prod/tenant DB isolation, parameterized queries. | CRM Pages Functions with D1. |
| `cloudflare-worker-mcp-server` | Planned | Workers, Durable Objects, MCP, Zod, TypeScript, security, GitHub Actions | Remote MCP auth, tool schemas, permission boundaries, DO/KV storage, per-env OAuth isolation, audit trail. | CRM MCP Worker. |
| `tenant-deployed-cloudflare-saas` | Planned | Pages Functions, D1, Workers, GitHub Actions, security, docs-kb | Tenant isolation, promotion gates, per-tenant D1/secrets, deployment alias auth perimeter, provisioning docs. | CRM tenant deployment model. |
| `node-cli-internal-tool` | Planned | Node, TypeScript, OpenAPI, security | Exit-code contract, credential resolution, prod/staging safety defaults, structured output, SDK reuse. | CRM CLI; VibeCode QA CLI. |
| `typescript-sdk` | Planned | TypeScript, OpenAPI, Zod, Vitest | Export map/declarations, contract freshness, credential boundary, typed error model, compatibility tests. | CRM SDK; future VibeCode QA schema/client packages. |
| `github-action-package` | Planned | GitHub Action, GitHub Actions, Node, TypeScript | Metadata completeness, minimum permissions, input validation, runtime/dependency policy, release tag policy. | VibeCode QA action repo. |
| `vscode-extension-package` | Planned | VS Code Extension, TypeScript, Node, security | Activation scope, workspace trust, command/webview boundaries, marketplace metadata, extension tests. | VibeCode QA VS Code repo. |
| `tauri-react-desktop` | Planned | Tauri, React, TypeScript, security, docs-kb | Command/capability boundaries, keychain storage, file-watch safety, signing, frontend/backend contract typing. | VibeCode QA desktop monitor. |
| `zensical-kb-site` | Planned | docs-kb, GitHub Actions | Markdown is source of truth, generated site ignored, stable URLs, tracked source references, docs drift checks. | VibeCode QA docs/standards; CRM docs. |

## Authoring order

Start with the stack standards that have the highest reuse and clearest repo evidence:

1. `cloudflare-pages-fullstack`: unlocks CRM's `app/functions` shape.
2. `cloudflare-d1-app`: captures migration and tenant database discipline.
3. `cloudflare-worker-mcp-server`: captures MCP over Workers, Durable Objects, OAuth, and tool safety.
4. `node-cli-internal-tool`, `typescript-sdk`, and `zensical-kb-site`: cover shared packages and documentation model.
