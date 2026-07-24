# Tenant-Deployed Cloudflare SaaS

This standard applies when a SaaS product is operated through tenant-scoped Cloudflare
deployment surfaces: projects, Pages or Workers deployables, routes, custom domains,
aliases, data resources, bindings, and secrets.

It is useful for white-label deployments, regulated customer environments,
tenant-specific release windows, and products where an incident must be contained to one
tenant without taking every customer down.

## Do not use this standard when

- The product has one production deployment and one shared operational lifecycle.
- Tenant identity is only an application data column and there are no tenant-level
  deployment operations.
- The team cannot operate per-tenant provisioning, migration, rollback, secret rotation,
  observability, and incident response.

Use lower-level Cloudflare app/API, data-resource, Worker MCP, and security standards
instead. Apply the D1 App standard only when the tenant data resource is D1.

## Editions

| Edition | Status | Reviewed | Pin as |
| --- | --- | --- | --- |
| [v1](v1/index.md) | latest | 2026-07 | `tenant-deployed-cloudflare-saas@v1` |

## VCQA owns

- Tenant resource ownership and manifest requirements.
- Tenant/environment binding and secret boundaries.
- Preview URL, alias, custom-domain, and indexing posture.
- Promotion gates across code, config, deployments/versions, and data-resource state.
- Provisioning and deprovisioning runbooks.
- Tenant-aware observability, audit events, and incident evidence.
