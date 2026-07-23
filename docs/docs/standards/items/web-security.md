# Web Security

Web security is the cross-cutting security item for browser/server seams, deployment
boundaries, sessions, authorization, secrets, and injection risks. VCQA delegates generic
security doctrine to OWASP and records only the stack-specific review surfaces here.

## Full rubric

[Security v1](/standards/security/v1/) is the authored cross-cutting rubric. Use this
item page for source ownership and composition context; use the rubric for rule-by-rule
judgment.

## Upstream references

- [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [GitHub Actions Secure Use](https://docs.github.com/en/actions/reference/security/secure-use)

## What upstream owns

- ASVS requirement taxonomy
- topic-specific OWASP cheat sheet guidance
- generic auth, session, CSRF, injection, and secret-management controls

## VCQA-owned rule surface

- **SEC-AUTHZ:** authorization is enforced at the server, Function, Worker, MCP tool, or
  desktop command boundary that performs the protected read/write.
- **SEC-SESSION:** cookie/session use records CSRF and session attributes at the same route
  boundary that receives mutating requests.
- **SEC-SECRETS:** client-exposed env vars, checked-in config, preview bindings, and tenant
  deployment config are reviewed for secret leakage and environment isolation.
- **SEC-INJECTION:** SQL, command, URL fetch, HTML, and tool-dispatch inputs are parameterized
  or schema-validated before side effects.
- **SEC-TENANT:** tenant, preview, staging, and production boundaries are explicit when the
  composed stack supports per-tenant Cloudflare deployments.
- **SEC-CI:** security-sensitive deployment jobs depend on tests/builds and use minimum
  permissions; GitHub Actions owns the workflow mechanics.
- **SEC-LOG:** security-sensitive events are logged with useful context and without
  leaking secrets, credentials, or sensitive tenant data.

## Detection signals

- auth, session, OAuth, cookie, or token code
- API routes, Pages Functions, Workers, MCP tool handlers, or Tauri commands
- secret-like env names, `VITE_*` usage, Wrangler bindings, and workflow secrets
- raw SQL construction, command execution, HTML injection, redirects, or outbound fetches
- tenant deployment workflows or per-tenant database/project config

## Composed standards

- [React SPA](../stacks/react-spa.md)
- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Cloudflare D1 App](../stacks/cloudflare-d1-app.md)
- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)
- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [VS Code Extension Package](../stacks/vscode-extension-package.md)
- [Tauri React Desktop](../stacks/tauri-react-desktop.md)

## Combination-born examples

- React SPA plus auth provider means tokens cannot be treated as server-side secrets.
- Pages Functions plus cookies requires CSRF/session controls at the Function boundary.
- MCP tools plus OAuth require tool-level authorization, not only transport-level login.
- D1 plus request data requires parameter binding and tenant scoping, not string-built SQL.
- Tenant-deployed Cloudflare SaaS requires per-tenant secret and database boundaries unless
  shared infrastructure is explicitly documented.
