# Web Security

Web security covers secrets, authentication, authorization, sessions, injection, and supply-chain controls.

## Upstream references

- [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Cross-Site Request Forgery Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)

## What upstream owns

- OWASP security requirements
- topic-specific cheat sheets
- generic web security guidance

## What VCQA owns

- stack-specific auth and secret boundaries.
- detectable unsafe patterns.
- security gates in CI.

## Detection signals

- auth/session code
- API routes
- secret-like env names
- browser or server entrypoints

## Composed standards

- [React SPA](../stacks/react-spa.md)
- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Cloudflare D1 App](../stacks/cloudflare-d1-app.md)
- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)
- [Node CLI Internal Tool](../stacks/node-cli-internal-tool.md)
- [VS Code Extension Package](../stacks/vscode-extension-package.md)
- [Tauri React Desktop](../stacks/tauri-react-desktop.md)

## Combination-born guidelines

- React SPA plus auth provider means tokens cannot be treated as server-side secrets.
- Pages Functions plus cookies requires CSRF/session controls at the Function boundary.
- MCP tools plus OAuth require tool-level authorization, not only transport-level login.
