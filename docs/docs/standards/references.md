# Standards References

This is the authority map for VibeCode QA standards. These are the official specs,
framework docs, platform docs, security standards, and testing guides we cite before
writing stack-specific rubrics.

The machine-readable version lives at
[`/standards/references.json`](/standards/references.json). Schema:
[`/standards/references.schema.json`](/standards/references.schema.json).

## Registry status

- Last reviewed: **2026-07-22**
- Link health: **checked-in-ci**
- Link rule: Every primary-source URL must return 2xx. Redirects fail unless expectedRedirectUrl is recorded on the reference.
- Applicability rule: appliesTo contains only canonical VCQA standard or stack item IDs from registry.json/compositions.json. Descriptive discovery terms live in topics.

## Authoring rule

VCQA standards should compose and cite these sources. Do not re-create broad framework doctrine when an upstream standard already exists; author only the stack shape, deployment constraints, detection mapping, exceptions, and anti-patterns needed to judge a repo.

## Source preference

- Official specification
- Official project or vendor documentation
- Recognized independent standard body
- Mature ecosystem documentation
- Vendor-neutral implementation guide

## Web platform

Baseline browser, markup, accessibility, and web API references.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [HTML Living Standard](https://html.spec.whatwg.org/) | WHATWG | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `html`, `browser-app`, `static-site`, `spa`, `ssr` | HTML semantics; forms; navigation; browser integration |
| [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/) | W3C WAI | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `docs-kb` | `ui`, `website`, `web-app`, `documentation-site` | Accessibility conformance; perceivable/operable/understandable/robust criteria |
| [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) | W3C WAI | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `ui`, `component-library`, `web-app` | ARIA widget patterns; keyboard interaction; focus behavior |
| [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web) | Mozilla | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `browser-app`, `javascript`, `css`, `html` | Browser API behavior; compatibility; web platform explanations |

## Languages and runtimes

Language, runtime, package manager, and CLI baseline references.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [TSConfig Reference](https://www.typescriptlang.org/tsconfig/) | TypeScript | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `typescript` | `tsconfig`, `strict-types` | Strictness flags; module resolution; project references |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | TypeScript | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `typescript`, `typescript-sdk` | `library`, `sdk`, `app` | Type modeling; narrowing; generics; declaration files |
| [Node.js Documentation](https://nodejs.org/docs/latest/api/) | OpenJS Foundation | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `node-cli-internal-tool`, `typescript-sdk` | `node-service`, `node-cli`, `node-library` | Runtime APIs; process behavior; streams; crypto; file system |
| [Node.js Security Best Practices](https://nodejs.org/learn/getting-started/security-best-practices) | OpenJS Foundation | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `node-cli-internal-tool` | `node-service`, `node-cli`, `server-side-javascript` | Node runtime security posture; dependency and input handling guidance |
| [package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/) | npm | Pinned to v11 upstream docs. | CI-enforced 2xx | none expected | - | `npm-package`, `library`, `cli`, `workspace` | Package metadata; bin; exports; files; scripts; engines |
| [pnpm Workspaces](https://pnpm.io/workspaces) | pnpm | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `monorepo`, `workspace`, `typescript-project-references` | Workspace layout; workspace protocol; recursive scripts |
| [Effective Dart](https://dart.dev/effective-dart) | Dart | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `dart` | `flutter` | Dart style; documentation; usage and design guidance |
| [Melos Documentation](https://melos.invertase.dev/) | Invertase | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `melos` | `dart-workspace`, `flutter-workspace`, `monorepo` | Dart and Flutter monorepo package orchestration; bootstrap scripts; workspace analyze/test commands |

## Frontend frameworks and build tools

Framework authorities to reference from stack-specific UI standards.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [React Documentation](https://react.dev/) | Meta / React | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `react`, `react-spa`, `react-ssr` | - | Components; hooks; state; effects; React compiler guidance |
| [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) | React | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `react` | `react-components`, `hooks` | Hook call placement; custom hook constraints; lint mapping |
| [React Router Documentation](https://reactrouter.com/) | React Router | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `react-spa`, `react-router` | `react-fullstack` | Routing modes; data routers; framework mode; SPA fallback implications |
| [Vite Guide](https://vite.dev/guide/) | Vite | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vite` | `spa`, `frontend-build` | Dev server; production build; static deployment; env variables |
| [Deploying a Static Site](https://vite.dev/guide/static-deploy) | Vite | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vite` | `static-site`, `spa` | Static hosting expectations; SPA deployment guidance |
| [Env Variables and Modes](https://vite.dev/guide/env-and-mode) | Vite | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vite` | `spa`, `client-env` | Client-exposed environment variables; mode-specific config; public env prefixes |
| [Next.js Documentation](https://nextjs.org/docs) | Vercel | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `react-ssr` | `nextjs`, `react-fullstack` | App Router; server components; route handlers; deployment |
| [Data Security](https://nextjs.org/docs/app/guides/data-security) | Next.js | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `nextjs`, `react-server-components`, `server-data` | Server component data boundaries; DTOs; sensitive data handling |
| [Vue.js Guide](https://vuejs.org/guide/introduction.html) | Vue | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `vue`, `vue-spa`, `vue-ssr` | Composition API; SFCs; reactivity; app structure |
| [Vue Style Guide](https://vuejs.org/style-guide/) | Vue | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `vue`, `vue-components` | Vue-specific conventions; component naming; anti-patterns |
| [Svelte Documentation](https://svelte.dev/docs) | Svelte | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `svelte`, `sveltekit` | Svelte syntax; runes; compiler warnings; component model |
| [SvelteKit Documentation](https://svelte.dev/docs/kit/introduction) | Svelte | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `sveltekit`, `svelte-fullstack`, `svelte-ssr` | Routing; load functions; server endpoints; deployment adapters |
| [Angular Documentation](https://angular.dev/) | Google / Angular | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `angular`, `angular-spa` | Signals; templates; dependency injection; Angular CLI |
| [Astro Documentation](https://docs.astro.build/) | Astro | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `astro`, `static-site`, `content-site` | Content collections; islands architecture; static/SSR output |

## Cloudflare edge stack

Cloudflare platform references for Pages, Workers, D1, Durable Objects, and SaaS isolation.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [Pages Functions](https://developers.cloudflare.com/pages/functions/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-pages-fullstack`, `cloudflare-pages-functions`, `react-spa-on-cloudflare-pages` | `pages-functions` | Functions directory; middleware; routing; bindings; runtime configuration |
| [Pages Functions Routing](https://developers.cloudflare.com/pages/functions/routing/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-pages-functions`, `cloudflare-pages-fullstack` | `pages-functions` | File-based routes; dynamic segments; route matching |
| [Pages Functions Middleware](https://developers.cloudflare.com/pages/functions/middleware/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-pages-functions` | `pages-functions`, `auth-middleware`, `api-edge` | Middleware chains; error handling; authentication middleware |
| [Pages Preview Deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `cloudflare-pages`, `preview-deployments` | Preview URLs; preview aliases; Access protection; preview indexing posture |
| [Pages Branch Build Controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `cloudflare-pages`, `release-branches` | Production branch control; preview branch control; release policy |
| [Direct Upload with Continuous Integration](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `cloudflare-pages`, `ci-deploy` | CI-managed Pages deploys; artifact promotion; deployment traceability |
| [Workers Documentation](https://developers.cloudflare.com/workers/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `cloudflare-worker-mcp-server` | `cloudflare-worker`, `edge-api`, `mcp-worker` | Worker runtime; bindings; compatibility dates; deployment |
| [Workers Best Practices](https://developers.cloudflare.com/workers/best-practices/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers` | `cloudflare-worker`, `edge-api` | Worker production patterns; anti-patterns; performance and reliability |
| [Workers Environments](https://developers.cloudflare.com/workers/wrangler/environments/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `tenant-deployed-cloudflare-saas` | `cloudflare-worker`, `wrangler` | Environment-specific configuration; binding selection; deployment isolation |
| [Workers Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `tenant-deployed-cloudflare-saas` | `cloudflare-worker`, `bindings` | Resource bindings; runtime configuration; service boundaries |
| [Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `tenant-deployed-cloudflare-saas` | `cloudflare-worker`, `secrets` | Secret configuration; secret scope; secret handling |
| [Workers Preview URLs](https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `tenant-deployed-cloudflare-saas` | `cloudflare-worker`, `preview-deployments` | Worker preview exposure; preview URL policy |
| [Workers Versions and Deployments](https://developers.cloudflare.com/workers/versions-and-deployments/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `tenant-deployed-cloudflare-saas` | `cloudflare-worker`, `deployment-versioning` | Worker versions; deployments; rollback and promotion evidence |
| [D1 Documentation](https://developers.cloudflare.com/d1/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-d1`, `cloudflare-pages-fullstack`, `cloudflare-workers` | `d1-database`, `cloudflare-worker` | D1 database model; bindings; local/remote database behavior |
| [D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-d1` | `d1-database`, `database-migrations` | SQL migration files; migrations folder; versioned database changes |
| [D1 Prepared Statement Methods](https://developers.cloudflare.com/d1/worker-api/prepared-statements/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-d1` | `d1-database`, `query-safety`, `edge-sql` | Prepared statements; parameter binding; query result APIs |
| [D1 Environments](https://developers.cloudflare.com/d1/configuration/environments/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-d1` | `d1-database`, `cloudflare-environments`, `preview-database` | Preview database IDs; environment-specific D1 bindings |
| [D1 Time Travel and Backups](https://developers.cloudflare.com/d1/reference/time-travel/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-d1`, `tenant-deployed-cloudflare-saas` | `d1-database`, `backup` | Point-in-time restore; backup bookmarks; restore runbooks |
| [D1 Import and Export Data](https://developers.cloudflare.com/d1/best-practices/import-export-data/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-d1`, `tenant-deployed-cloudflare-saas` | `d1-database`, `backup` | Tenant data export; restore/fix-forward runbooks; data preservation |
| [Durable Objects Documentation](https://developers.cloudflare.com/durable-objects/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `durable-objects`, `cloudflare-worker-mcp-server` | `stateful-worker`, `mcp-worker` | Durable Object model; bindings; storage; stateful coordination |
| [Durable Objects Best Practices](https://developers.cloudflare.com/durable-objects/best-practices/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `durable-objects` | `stateful-worker` | Object design; storage; RPC; error handling; anti-patterns |
| [SaaS Data Isolation](https://developers.cloudflare.com/use-cases/saas/data-isolation/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `multi-tenant-saas`, `cloudflare-saas`, `tenant-isolation` | Tenant data isolation; Cloudflare SaaS architecture references |
| [Service tokens](https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `cloudflare-access`, `machine-auth`, `edge-perimeter` | Service token behavior; Access policy integration |
| [Model Context Protocol (MCP)](https://developers.cloudflare.com/agents/model-context-protocol/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-worker-mcp-server` | `mcp-worker`, `agents` | MCP on Cloudflare Workers and Agents; remote MCP server implementation |
| [Workers CI/CD with GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/) | Cloudflare | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-workers`, `github-actions`, `tenant-deployed-cloudflare-saas` | `cloudflare-worker` | Wrangler deployment from GitHub Actions; CI/CD setup; Cloudflare deploy automation |

## APIs, auth, validation, and AI protocols

Contract, authentication, authorization, schema, and AI-tool protocol references.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) | OpenAPI Initiative | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `typescript-sdk` | `rest-api`, `sdk`, `api-contract` | HTTP API contracts; client generation; operation schemas |
| [JSON Schema](https://json-schema.org/specification) | JSON Schema | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `api-contract`, `validation`, `configuration` | JSON validation; machine-readable schemas; config contracts |
| [Zod Documentation](https://zod.dev/) | Zod | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `zod-validation` | `runtime-validation`, `typescript-boundaries` | Runtime validation; schema inference; safe parsing |
| [OAuth 2.1 Authorization Framework](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1) | IETF | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `cloudflare-worker-mcp-server` | `oauth`, `authorization`, `remote-mcp`, `web-app-auth` | Authorization code flow; PKCE; bearer token handling |
| [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) | OpenID Foundation | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `oidc`, `login`, `identity` | ID tokens; claims; authentication flows |
| [Model Context Protocol Specification](https://modelcontextprotocol.io/specification/2025-11-25) | Model Context Protocol | Pinned to dated specification 2025-11-25. | CI-enforced 2xx | none expected | `mcp-server` | `mcp-client`, `ai-tools` | Protocol messages; tools; resources; prompts; transports |
| [MCP Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization) | Model Context Protocol | Pinned to dated specification 2025-11-25. | CI-enforced 2xx | none expected | `cloudflare-worker-mcp-server`, `mcp-server` | `remote-mcp`, `oauth` | Remote MCP authorization; resource server behavior; protected resource metadata |
| [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) | Model Context Protocol | Tracks current canonical upstream URL. | CI-enforced 2xx | [expected redirect](https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices) | `mcp-server` | `mcp-client`, `ai-tools` | Tool poisoning defenses; authorization risks; prompt injection considerations |
| [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) | Model Context Protocol | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `mcp-server`, `typescript`, `node`, `cloudflare-workers` | `worker` | Server implementation patterns; tool schemas; transport support |

## Security, CI, and testing

Security verification, CI hardening, and automated test references.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `web-app-security`, `api-security`, `secure-development` | Security requirements; authentication; access control; session handling |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `security` | `web-app`, `api`, `auth` | Topic-specific secure implementation guidance |
| [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `web-app`, `cookie-auth`, `mutating-requests` | CSRF controls; same-site cookies; origin checks; custom headers |
| [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `session-auth`, `web-app-auth`, `cookies` | Session ID handling; cookie attributes; timeout and renewal |
| [Multi Tenant Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `multi-tenant-saas`, `tenant-isolation` | Tenant isolation risks; multi-tenant security design; shared-resource risk |
| [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `authorization`, `access-control` | Server-side authorization; least privilege; tenant access checks |
| [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tenant-deployed-cloudflare-saas` | `secrets`, `credential-management` | Secret lifecycle; rotation; revocation; safe logging |
| [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `input-validation`, `api-security`, `runtime-validation` | Boundary validation; allowlisting; runtime input parsing |
| [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `sql`, `database`, `query-safety` | Parameterized queries; safe query APIs; SQL injection prevention |
| [Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `injection`, `command-execution`, `interpreter-boundaries` | Injection-prone interpreter boundaries; command/query construction |
| [Server Side Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `ssrf`, `outbound-fetch`, `webhooks` | Outbound URL constraints; SSRF prevention; allowlisting |
| [Cross Site Scripting Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `xss`, `browser-output`, `html-rendering` | Output encoding; HTML sanitization; dangerous browser sinks |
| [Error Handling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `error-handling`, `api-security`, `safe-output` | Safe errors; exception handling; information disclosure prevention |
| [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) | OWASP | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `logging`, `audit`, `incident-response` | Security events; safe logging; audit evidence |
| [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use) | GitHub | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `github-actions` | `ci`, `supply-chain` | Workflow permissions; untrusted code; third-party actions; secret handling |
| [Security hardening your deployments](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments) | GitHub | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `github-actions` | `deployment`, `oidc` | OIDC for cloud deployments; environment protection; deployment hardening |
| [Deployments and Environments](https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments) | GitHub | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `github-actions`, `tenant-deployed-cloudflare-saas` | `deployment-environments` | Environment protection rules; deployment approvals; environment-scoped secrets |
| [Vitest Guide](https://vitest.dev/guide/) | Vitest | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vite` | `unit-tests`, `typescript-tests` | Test runner setup; coverage; watch vs run mode |
| [Playwright Best Practices](https://playwright.dev/docs/best-practices) | Microsoft / Playwright | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `e2e-tests`, `browser-tests`, `web-app` | Locator strategy; test isolation; resilient browser tests |
| [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles/) | Testing Library | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `react` | `component-tests`, `ui-tests`, `vue`, `svelte` | User-centered test style; DOM queries; implementation-detail avoidance |

## Apps, extensions, and packaging

Editor, desktop, mobile, and distribution references.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [Extension API](https://code.visualstudio.com/api) | Visual Studio Code | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vscode-extension` | `editor-extension` | Extension structure; activation events; commands; webviews; testing |
| [Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) | Visual Studio Code | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vscode-extension` | `marketplace` | Marketplace metadata; engines.vscode; VSIX packaging; publisher requirements |
| [Extension Runtime Security](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security) | Visual Studio Code | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `vscode-extension` | `extension-security` | Extension trust boundaries; runtime permissions; user risk model |
| [Metadata syntax for GitHub Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax) | GitHub | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `github-action` | `action-yml` | action.yml schema; inputs; outputs; runs; branding |
| [Creating actions](https://docs.github.com/en/actions/how-tos/create-and-publish-actions) | GitHub | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `github-action` | `ci-automation` | JavaScript actions; composite actions; Docker actions |
| [Tauri Documentation](https://v2.tauri.app/) | Tauri | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `tauri` | `desktop-app`, `rust-webview` | Tauri app structure; commands; capabilities; plugins; bundling |
| [Electron Documentation](https://www.electronjs.org/docs/latest/) | Electron | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `electron`, `desktop-app` | Main/renderer process boundaries; IPC; security; packaging |
| [Flutter Documentation](https://docs.flutter.dev/) | Flutter | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `flutter` | `mobile-app`, `desktop-app` | Flutter app structure; widgets; testing; deployment |
| [Add Firebase to your Flutter app](https://firebase.google.com/docs/flutter/setup) | Firebase | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `firebase`, `flutter`, `flutter-firebase-app` | `flutterfire`, `firebase-core`, `mobile-app`, `web-app` | FlutterFire setup; Firebase CLI and FlutterFire CLI configuration; platform app registration |

## Architecture and documentation

Architecture decision and knowledge-base references.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [Architecture Decision Records](https://github.com/architecture-decision-record/architecture-decision-record) | Michael Nygard / joelparkerhenderson | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `docs-kb` | `adr`, `architecture-docs`, `knowledge-base` | ADR structure; decision history; docs-as-architecture |
| [The C4 Model](https://c4model.com/) | Structurizr | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | - | `architecture-docs`, `system-design`, `diagrams` | Context/container/component/code diagrams; architecture communication |
| [Diataxis](https://diataxis.fr/) | Diataxis | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `docs-kb` | `documentation`, `knowledge-base`, `developer-docs` | Tutorial/how-to/reference/explanation structure |
| [Zensical Documentation](https://zensical.org/docs/) | Zensical | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `docs-kb` | `zensical`, `documentation-site`, `kb-publishing` | Zensical site configuration; Markdown authoring; static docs publishing |
| [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) | Material for MkDocs | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `docs-kb` | `mkdocs`, `documentation-site` | Docs navigation; search; admonitions; theme configuration |

## Firebase backend platform

Firebase Auth, Firestore, Functions, Hosting, rules, and emulator references for client-backed apps.

| Reference | Publisher | Version policy | Link check | Redirect target | Controlled appliesTo | Topics | Use it for |
|---|---|---|---|---|---|---|---|
| [Cloud Functions for Firebase](https://firebase.google.com/docs/functions) | Firebase | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `firebase`, `flutter-firebase-app`, `node` | `cloud-functions`, `server-side-javascript`, `firebase-admin` | server-side Firebase functions; runtime configuration; backend mutation boundaries |
| [Get started with Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started) | Firebase | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `firebase`, `flutter-firebase-app` | `firestore`, `security-rules`, `tenant-isolation` | Firestore rules authoring; rules simulator expectations; client data access boundaries |
| [Build unit tests for Firebase Security Rules](https://firebase.google.com/docs/rules/unit-tests) | Firebase | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `firebase`, `flutter-firebase-app`, `testing` | `firestore`, `security-rules`, `emulator`, `rules-tests` | Emulator-backed rules tests; local rules validation; automated security-rule test gates |
| [Deploy to live and preview channels via GitHub pull requests](https://firebase.google.com/docs/hosting/github-integration) | Firebase | Tracks current canonical upstream URL. | CI-enforced 2xx | none expected | `firebase`, `flutter-firebase-app`, `github-actions` | `firebase-hosting`, `preview-deployments`, `ci-deploy` | Firebase Hosting deploy automation; preview channels; GitHub Actions deployment evidence |
