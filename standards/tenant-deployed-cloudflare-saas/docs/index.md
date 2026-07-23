# Tenant-Deployed Cloudflare SaaS

This standard applies when a SaaS product is operated through tenant-scoped Cloudflare
deployment surfaces: Pages projects, Pages Functions, Workers, D1 databases, routes,
custom domains, aliases, bindings, and secrets.

It is useful for white-label deployments, regulated customer environments,
tenant-specific release windows, and products where an incident must be contained to one
tenant without taking every customer down.

## Do not use this standard when

- The product has one production deployment and one shared operational lifecycle.
- Tenant identity is only an application data column and there are no tenant-level
  deployment operations.
- The team cannot operate per-tenant provisioning, migration, rollback, secret rotation,
  observability, and incident response.

Use the lower-level Cloudflare Pages Fullstack, Cloudflare D1 App, Worker MCP, and
security standards instead.

## Editions

| Edition | Status | Reviewed | Pin as |
| --- | --- | --- | --- |
| [v1](v1/index.md) | latest | 2026-07 | `tenant-deployed-cloudflare-saas@v1` |

## VCQA owns

- Tenant resource ownership and manifest requirements.
- Tenant/environment binding and secret boundaries.
- Preview URL, alias, custom-domain, and indexing posture.
- Promotion gates across code, config, Worker versions, Pages deployments, and D1 state.
- Provisioning and deprovisioning runbooks.
- Tenant-aware observability, audit events, and incident evidence.
