# Standards References

This is the authority map for VibeCode QA standards. These are the official specs,
framework docs, platform docs, security standards, and testing guides we cite before
writing stack-specific rubrics.

The machine-readable version lives at
[`/standards/references.json`](/standards/references.json).

## Authoring rule

Do not re-create broad framework doctrine when an upstream standard already exists.
VibeCode QA standards compose these sources, then add only the stack shape, deployment
constraints, detection mapping, exceptions, and anti-patterns needed to judge a repository.

## Web platform

| Reference | Publisher | Use it for |
|---|---|---|
| [HTML Living Standard](https://html.spec.whatwg.org/) | WHATWG | HTML semantics, forms, navigation, browser integration. |
| [WCAG 2.2](https://www.w3.org/TR/WCAG22/) | W3C WAI | Accessibility conformance and success criteria. |
| [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) | W3C WAI | ARIA widgets, keyboard interaction, focus behavior. |
| [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web) | Mozilla | Browser APIs, compatibility, web platform explanations. |

## Languages and runtimes

| Reference | Publisher | Use it for |
|---|---|---|
| [TSConfig Reference](https://www.typescriptlang.org/tsconfig/) | TypeScript | Strictness flags, module resolution, project references. |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | TypeScript | Type modeling, narrowing, generics, declaration files. |
| [Node.js API Docs](https://nodejs.org/docs/latest/api/) | OpenJS Foundation | Runtime APIs, process behavior, streams, crypto, file system. |
| [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices) | OpenJS Foundation | Node runtime security posture and dependency/input guidance. |
| [package.json](https://docs.npmjs.com/cli/v10/configuring-npm/package-json) | npm | Package metadata, `bin`, `exports`, `files`, scripts, engines. |
| [pnpm Workspaces](https://pnpm.io/workspaces) | pnpm | Workspace layout, workspace protocol, recursive scripts. |
| [Effective Dart](https://dart.dev/effective-dart) | Dart | Dart style, documentation, usage and design guidance. |

## Frontend frameworks and build tools

| Reference | Publisher | Use it for |
|---|---|---|
| [React Documentation](https://react.dev/) | React | Components, hooks, state, effects, compiler guidance. |
| [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks) | React | Hook call placement and custom hook constraints. |
| [React Router](https://reactrouter.com/) | React Router | Routing modes, data routers, framework mode, SPA fallback implications. |
| [Vite Guide](https://vite.dev/guide/) | Vite | Dev server, production build, static deployment, env variables. |
| [Vite Static Deploy](https://vite.dev/guide/static-deploy) | Vite | Static hosting expectations and SPA deployment guidance. |
| [Next.js Documentation](https://nextjs.org/docs) | Vercel | App Router, server components, route handlers, deployment. |
| [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security) | Next.js | Server component data boundaries, DTOs, sensitive data handling. |
| [Vue.js Guide](https://vuejs.org/guide/introduction.html) | Vue | Composition API, SFCs, reactivity, app structure. |
| [Vue Style Guide](https://vuejs.org/style-guide/) | Vue | Vue-specific conventions, component naming, anti-patterns. |
| [Svelte Documentation](https://svelte.dev/docs) | Svelte | Svelte syntax, runes, compiler warnings, component model. |
| [SvelteKit Documentation](https://svelte.dev/docs/kit) | Svelte | Routing, load functions, server endpoints, deployment adapters. |
| [Angular Documentation](https://angular.dev/) | Angular | Signals, templates, dependency injection, Angular CLI. |
| [Astro Documentation](https://docs.astro.build/) | Astro | Content collections, islands architecture, static/SSR output. |

## Cloudflare edge stack

| Reference | Publisher | Use it for |
|---|---|---|
| [Pages Functions](https://developers.cloudflare.com/pages/functions/) | Cloudflare | Functions directory, middleware, routing, bindings, runtime configuration. |
| [Pages Functions Routing](https://developers.cloudflare.com/pages/functions/routing/) | Cloudflare | File-based routes, dynamic segments, route matching. |
| [Pages Functions Middleware](https://developers.cloudflare.com/pages/functions/middleware/) | Cloudflare | Middleware chains, error handling, authentication middleware. |
| [Workers Documentation](https://developers.cloudflare.com/workers/) | Cloudflare | Worker runtime, bindings, compatibility dates, deployment. |
| [Workers Best Practices](https://developers.cloudflare.com/workers/best-practices/) | Cloudflare | Worker production patterns, anti-patterns, performance and reliability. |
| [D1 Documentation](https://developers.cloudflare.com/d1/) | Cloudflare | D1 database model, bindings, local/remote database behavior. |
| [D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/) | Cloudflare | SQL migration files, migrations folder, versioned database changes. |
| [Durable Objects](https://developers.cloudflare.com/durable-objects/) | Cloudflare | Durable Object model, bindings, storage, stateful coordination. |
| [Durable Objects Best Practices](https://developers.cloudflare.com/durable-objects/best-practices/) | Cloudflare | Object design, storage, RPC, error handling, anti-patterns. |
| [SaaS Data Isolation](https://developers.cloudflare.com/use-cases/saas/data-isolation/) | Cloudflare | Tenant data isolation and Cloudflare SaaS architecture references. |
| [Cloudflare Access Service Tokens](https://developers.cloudflare.com/cloudflare-one/identity/service-tokens/) | Cloudflare | Service token behavior and Access policy integration. |

## APIs, auth, validation, and AI protocols

| Reference | Publisher | Use it for |
|---|---|---|
| [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) | OpenAPI Initiative | HTTP API contracts, client generation, operation schemas. |
| [JSON Schema](https://json-schema.org/specification) | JSON Schema | JSON validation, machine-readable schemas, config contracts. |
| [Zod Documentation](https://zod.dev/) | Zod | Runtime validation, schema inference, safe parsing. |
| [OAuth 2.1](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-1) | IETF | Authorization code flow, PKCE, bearer token handling. |
| [OpenID Connect Core](https://openid.net/specs/openid-connect-core-1_0.html) | OpenID Foundation | ID tokens, claims, authentication flows. |
| [MCP Specification](https://modelcontextprotocol.io/specification/2025-06-18) | Model Context Protocol | Protocol messages, tools, resources, prompts, transports. |
| [MCP Authorization](https://modelcontextprotocol.io/specification/draft/basic/authorization) | Model Context Protocol | Remote MCP authorization and protected resource metadata. |
| [MCP Security Best Practices](https://modelcontextprotocol.io/docs/tutorials/security/security_best_practices) | Model Context Protocol | Tool poisoning defenses, authorization risks, prompt injection considerations. |
| [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) | Model Context Protocol | Server implementation patterns, tool schemas, transport support. |

## Security, CI, and testing

| Reference | Publisher | Use it for |
|---|---|---|
| [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | Security requirements, authentication, access control, session handling. |
| [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/) | OWASP | Topic-specific secure implementation guidance. |
| [CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html) | OWASP | CSRF controls, SameSite cookies, origin checks, custom headers. |
| [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html) | OWASP | Session ID handling, cookie attributes, timeout and renewal. |
| [GitHub Actions Secure Use](https://docs.github.com/en/actions/reference/security/secure-use) | GitHub | Workflow permissions, untrusted code, third-party actions, secret handling. |
| [GitHub Actions Deployment Hardening](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments) | GitHub | OIDC for cloud deployments, environment protection, deployment hardening. |
| [Vitest Guide](https://vitest.dev/guide/) | Vitest | Test runner setup, coverage, watch vs run mode. |
| [Playwright Best Practices](https://playwright.dev/docs/best-practices) | Playwright | Locator strategy, test isolation, resilient browser tests. |
| [Testing Library Guiding Principles](https://testing-library.com/docs/guiding-principles) | Testing Library | User-centered test style and implementation-detail avoidance. |

## Apps, extensions, and packaging

| Reference | Publisher | Use it for |
|---|---|---|
| [VS Code Extension API](https://code.visualstudio.com/api) | Visual Studio Code | Extension structure, activation events, commands, webviews, testing. |
| [VS Code Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) | Visual Studio Code | Marketplace metadata, `engines.vscode`, VSIX packaging. |
| [VS Code Extension Runtime Security](https://code.visualstudio.com/docs/configure/extensions/extension-runtime-security) | Visual Studio Code | Extension trust boundaries, runtime permissions, user risk model. |
| [GitHub Action Metadata Syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/metadata-syntax) | GitHub | `action.yml` schema, inputs, outputs, runs, branding. |
| [Creating Actions](https://docs.github.com/en/actions/sharing-automations/creating-actions) | GitHub | JavaScript actions, composite actions, Docker actions. |
| [Tauri Documentation](https://v2.tauri.app/) | Tauri | Tauri app structure, commands, capabilities, plugins, bundling. |
| [Electron Documentation](https://www.electronjs.org/docs/latest/) | Electron | Main/renderer boundaries, IPC, security, packaging. |
| [Flutter Documentation](https://docs.flutter.dev/) | Flutter | Flutter app structure, widgets, testing, deployment. |

## Architecture and documentation

| Reference | Publisher | Use it for |
|---|---|---|
| [Architecture Decision Records](https://github.com/joelparkerhenderson/architecture-decision-record) | Michael Nygard / community | ADR structure, decision history, docs-as-architecture. |
| [The C4 Model](https://c4model.com/) | Structurizr | Context, container, component, and code diagrams. |
| [Diataxis](https://diataxis.fr/) | Diataxis | Tutorial, how-to, reference, and explanation structure. |
| [Zensical Documentation](https://zensical.org/docs/) | Zensical | Zensical site configuration, Markdown authoring, static docs publishing. |
| [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) | Material for MkDocs | Docs navigation, search, admonitions, theme configuration. |
