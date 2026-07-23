# Tenant-Deployed Cloudflare SaaS

**Status:** Planned charter

SaaS products deployed per tenant or per tenant environment on Cloudflare Pages, Workers, D1, and related bindings.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

SaaS products deployed per tenant or per tenant environment on Cloudflare Pages, Workers, D1, and related bindings.

## Not in scope

- single-tenant apps with one production deployment
- generic SaaS product management
- billing features unless tied to deployment isolation

## Composes

- [Cloudflare Pages Functions](../items/cloudflare-pages-functions.md)
- [Cloudflare D1](../items/cloudflare-d1.md)
- [Cloudflare Workers](../items/cloudflare-workers.md)
- [GitHub Actions](../items/github-actions.md)
- [Web Security](../items/web-security.md)
- [Docs KB](../items/docs-kb.md)

## VCQA-owned rule surface

- tenant instance isolation.
- staging/prod promotion gates.
- per-tenant D1 and secret boundaries.
- deployment alias auth perimeter.
- tenant provisioning documentation.

## Detection signals

- tenant deployment workflows
- per-tenant Cloudflare project or database config
- deployment alias/access policy

## Combination-born guidelines

- Tenant secrets and D1 databases must not be shared unless explicitly designed as shared infrastructure.
- Promotion gates must distinguish tenant preview, staging, and production.
- Tenant provisioning docs are part of the operational standard, not optional marketing docs.

## Benefits

- crm tenant deployment model.
