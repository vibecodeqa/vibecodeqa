# Security - Edition v1

!!! info "Edition metadata"
    **Targets:** browser apps · APIs · Cloudflare Workers/Pages Functions · MCP · CLIs · SDKs · GitHub Actions
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `security@v1`

This edition captures the cross-cutting security baseline VibeCode QA applies across
repo slices. It focuses on checkable code and deployment signals, then defers broad
security taxonomy to upstream authorities.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
a `vcqa` signal, and primary references.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Authorization boundaries](authorization-boundaries.md) | `AUTHZ` / `SESSION` | protected read/write boundary, tenant and role checks, cookie/session controls |
| 2 | [Secrets and environment exposure](secrets-and-environment-exposure.md) | `SECRET` / `ENV` | secret storage, client env leakage, preview/prod separation |
| 3 | [Input, query, and command safety](input-query-and-command-safety.md) | `INPUT` / `SQL` / `CMD` / `FETCH` | untrusted input validation, parameterized queries, command and URL safety |
| 4 | [Output, browser, and tool safety](output-browser-and-tool-safety.md) | `OUT` / `XSS` / `TOOL` | encoded output, dangerous HTML, untrusted MCP/tool content |
| 5 | [Tenant and environment isolation](tenant-and-environment-isolation.md) | `TENANT` / `BOUNDARY` | tenant scoping, preview/staging/prod isolation, shared-resource evidence |
| 6 | [CI and deployment security](ci-and-deployment-security.md) | `CI` / `DEPLOY` / `TOKEN` | workflow permissions, protected production mutation, deploy credential scope |
| 7 | [Logging and incident evidence](logging-and-incident-evidence.md) | `LOG` / `AUDIT` / `INCIDENT` | security events, safe logging, traceable mutating operations |

## Non-negotiables

- **R-AUTHZ-1** - protected reads and writes enforce authorization at the server,
  Function, Worker, MCP tool, CLI, or command boundary that performs the action.
- **R-AUTHZ-2** - tenant identity, role, and resource ownership are derived server-side or
  from trusted claims, never only from client route state or request body convention.
- **R-SECRET-1** - secrets are not committed, bundled into browser code, exposed through
  public env names, or reused across preview/staging/production without an exception.
- **R-SQL-1** - untrusted values enter database queries through parameter binding or an
  equivalent safe query API.
- **R-XSS-1** - untrusted HTML, Markdown, tool output, and generated content are encoded,
  sanitized, or rendered in a constrained component.
- **R-TENANT-1** - shared tenant resources have explicit isolation checks and accepted
  risk.
- **R-CI-1** - production-mutating workflows use minimum permissions, protected
  environments, and scoped deployment credentials.
- **R-LOG-1** - security-sensitive failures and mutating operations leave enough evidence
  to investigate without logging secrets.

## Reference baseline

- OWASP ASVS: <https://owasp.org/www-project-application-security-verification-standard/>
- OWASP Cheat Sheet Series: <https://cheatsheetseries.owasp.org/>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
- OWASP SQL Injection Prevention Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html>
- OWASP Logging Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html>
- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
