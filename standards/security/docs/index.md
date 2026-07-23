# Security

Security is the cross-cutting VCQA standard for application, deployment, and automation
boundaries. It applies to browser apps, server routes, Cloudflare Workers and Pages
Functions, MCP tools, CLIs, SDKs, and CI workflows.

This standard does not re-create OWASP doctrine. OWASP ASVS and the OWASP Cheat Sheet
Series remain the broad authority. VCQA owns the repo-level and stack-composition checks:
where authorization happens, where secrets can leak, how untrusted input crosses runtime
boundaries, how previews and tenants are isolated, and whether CI/CD can safely mutate
production.

## Editions

| Edition | Status | Reviewed | Pin as |
| --- | --- | --- | --- |
| [v1](v1/index.md) | latest | 2026-07 | `security@v1` |

## Applies when

- A slice has API routes, server handlers, Workers, Pages Functions, MCP tools, CLI
  commands, SDK clients, or browser code.
- A repo has secrets, environment variables, deployment workflows, database access,
  external API calls, auth/session code, or tenant boundaries.
- A judge needs a reusable baseline before applying stack-specific rubrics.

## VCQA owns

- Server-side authorization boundary checks.
- Client/server secret exposure and environment-scope checks.
- Input validation and injection-prone boundary checks.
- Output safety for browser, logs, tool responses, and generated content.
- Tenant, preview, staging, and production isolation signals.
- GitHub Actions and deployment permission gates.
- Security logging, audit, and incident evidence expectations.
