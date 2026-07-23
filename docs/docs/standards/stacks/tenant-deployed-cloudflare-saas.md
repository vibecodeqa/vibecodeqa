# Tenant-Deployed Cloudflare SaaS

**Status:** Authored as [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/)

A SaaS product deployed as isolated tenant instances or tenant environments on
Cloudflare Pages, Workers, D1, and related bindings. This stack treats deployment
topology, tenant isolation, promotion, preview exposure, and operational evidence as
part of the product contract.

## Full rubric

Use [Tenant-Deployed Cloudflare SaaS v1](/standards/tenant-deployed-cloudflare-saas/v1/)
when a repository operates tenant-scoped Cloudflare deployment surfaces.

Reference implementation:
[vibecodeqa/ref-cloudflare-saas](https://github.com/vibecodeqa/ref-cloudflare-saas).
Use it as a product-neutral template that demonstrates the stack; use the rubric as the
source of truth for judgment.

The rubric has stable rule IDs across:

- suitability and deployment shape
- tenant resource manifests
- tenant/environment bindings and secrets
- preview URLs, aliases, custom domains, and indexing posture
- promotion gates, D1 migration state, rollback, and fix-forward
- tenant provisioning and deprovisioning runbooks
- tenant-aware observability, audit, and incident evidence

## What this teaches

Choose this stack when each customer needs its own deployable Cloudflare surface:
separate Pages projects, Workers, routes/domains, D1 databases, secrets, Access
policies, or environment bindings. It fits white-label SaaS, regulated customer
deployments, tenant-specific release windows, and products where a tenant incident
must be contained without taking every customer down.

Do not choose this stack for a normal single-production SaaS, a purely row-keyed
multi-tenant app with no tenant-level deployment operations, or a product that cannot
fund tenant provisioning, migration, secret rotation, observability, and incident
response per tenant. If tenant identity is only an application column and all tenants
share one deployable artifact, use lower-level Cloudflare, D1, and web-security
standards instead.

## Scope

- Tenant-deployed SaaS on Cloudflare Pages, Workers, or Pages Functions.
- Per-tenant or per-tenant-environment D1 databases, bindings, secrets, routes,
  aliases, and custom domains.
- CI/CD promotion from preview to staging to production using GitHub Actions and
  Wrangler or Cloudflare-managed deployments.
- Tenant provisioning, deprovisioning, rollback, fix-forward, observability, and
  audit evidence needed to operate the stack safely.

## Not in scope

- Single-production SaaS with one shared deployment lifecycle.
- Generic SaaS product management, billing, customer success, or packaging.
- Generic Cloudflare account administration that is not tied to tenant deployment
  isolation.
- Non-Cloudflare deployment targets.

## Upstream references

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- Cloudflare Pages branch deployment controls:
  <https://developers.cloudflare.com/pages/configuration/branch-build-controls/>
- Cloudflare Pages direct upload with CI:
  <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>
- Cloudflare Workers environments:
  <https://developers.cloudflare.com/workers/wrangler/environments/>
- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- Cloudflare Workers preview URLs:
  <https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/>
- Cloudflare Workers versions and deployments:
  <https://developers.cloudflare.com/workers/versions-and-deployments/>
- Cloudflare D1 Time Travel and backups:
  <https://developers.cloudflare.com/d1/reference/time-travel/>
- Cloudflare D1 import and export:
  <https://developers.cloudflare.com/d1/best-practices/import-export-data/>
- Cloudflare Workers CI/CD with GitHub Actions:
  <https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>
- GitHub Actions deployment environments:
  <https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments>
- GitHub Actions deployment protection rules:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>
- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## Composes

- [Cloudflare Pages Functions](../items/cloudflare-pages-functions.md)
- [Cloudflare D1](../items/cloudflare-d1.md)
- [Cloudflare Workers](../items/cloudflare-workers.md)
- [GitHub Actions](../items/github-actions.md)
- [Web Security](../items/web-security.md)
- [Docs KB](../items/docs-kb.md)

## VCQA-owned rule surface

- Tenant instance isolation and resource ownership.
- Staging/production promotion gates and branch controls.
- Preview deployment safety for URLs, data, secrets, and indexing.
- Per-tenant D1 database, migration, backup, and restore expectations.
- Per-tenant and per-environment secret and binding boundaries.
- Deployment alias, custom-domain, and Access/auth perimeter.
- Tenant provisioning, deprovisioning, and change documentation.
- Rollback and fix-forward expectations for code, config, and D1 state.
- Tenant-aware observability, audit trails, and incident evidence.

## Detection signals

- Multiple Cloudflare Pages projects, Workers, routes, custom domains, or aliases named
  by tenant or tenant environment.
- `wrangler.toml`, `wrangler.json`, or generated deployment config containing
  `[env.<name>]`, `[[d1_databases]]`, `vars`, `secrets`, `routes`, or Pages project names
  that vary by tenant.
- GitHub Actions workflows that deploy to Cloudflare with tenant, staging, preview, or
  production environment names.
- Cloudflare Access policies, preview URL settings, branch deployment controls, or custom
  preview aliases.
- Tenant provisioning docs, tenant manifests, account mapping docs, customer-specific
  runbooks, or release notes.
- D1 migration commands, tenant database IDs, database export/restore scripts, or Time
  Travel runbook references.
- Logs, audit events, alerts, or trace metadata that include `tenant_id`, deployment
  alias, environment, actor, commit SHA, or Cloudflare deployment/version ID.

## Combination-born guidelines

- Tenant boundaries must be deployable boundaries. A tenant deployment must map to named
  Cloudflare resources, and shared resources must be called out explicitly with the
  compensating isolation model.
- Preview is not staging. Cloudflare Pages and Workers preview URLs are useful for PR
  validation, but their URL behavior and bindings must be treated as exposure decisions.
- Tenant secrets and D1 databases must not be shared across preview, staging, and
  production unless the repo documents the shared-infrastructure design and tests the
  authorization boundary.
- Promotion must move known artifacts forward: commit, Worker version or Pages
  deployment, migration set, tenant manifest, and approval evidence.
- Deployment aliases and custom domains are part of the auth perimeter. They need the
  same access, indexing, DNS, and data-safety review as the underlying deployment.
- D1 rollback is a product runbook, not just a platform feature. Code rollback and data
  restore/fix-forward need separate decisions and evidence.
- Provisioning docs are operational controls. Resource creation, bindings, secrets,
  Access policies, migrations, DNS, smoke tests, and audit setup must be reproducible.
- Observability must be tenant-aware. Logs and audit trails should include tenant,
  environment, actor, deployment/version, and data target.

## Rule highlights

- **R-FIT-1:** Tenant deployment boundary is justified.
- **R-RESOURCE-1:** Tenant manifest lists Cloudflare resources.
- **R-ENV-1:** Bindings are scoped by tenant and environment.
- **R-PREVIEW-1:** Preview deployments are access-controlled or public-safe.
- **R-PROMOTE-1:** Promotion gates name tenant, environment, and artifact.
- **R-D1-1:** Tenant D1 isolation is the default.
- **R-ROLL-1:** Rollback and fix-forward cover code and D1 state separately.
- **R-PROV-1:** Tenant provisioning is repeatable.
- **R-OBS-1:** Logs carry tenant and deployment context.
- **R-AUDIT-1:** Mutating tenant operations create audit evidence.

## Anti-patterns

- Treating tenant isolation as a naming convention while all tenants share one production
  D1 database, secret set, or integration credential.
- Letting PR previews use production secrets, production D1 bindings, production webhooks,
  or production tenant API credentials.
- Publishing preview URLs or readable aliases without Cloudflare Access, app auth, or
  explicit public/noindex review.
- Running tenant production deploys from a local laptop with no CI approval, deployment
  record, or reproducible artifact.
- Promoting by rebuilding from a branch instead of referencing the tested commit, Worker
  version, Pages deployment, migration set, and tenant manifest.
- Assuming a Worker rollback also rolls back D1 schema or data.
- Leaving tenant provisioning as an ad hoc checklist outside the repo or customer
  operations docs.
- Logging request data without tenant context, or logging tenant secrets and tokens while
  trying to make operations auditable.

## Benefits

- Defines when tenant-deployed Cloudflare is the right architecture rather than a default
  SaaS deployment shape.
- Raises preview URLs, aliases, bindings, secrets, and D1 state to first-class
  production-readiness concerns.
- Gives Cloudflare SaaS repositories a reusable path to tenant-safe provisioning,
  promotion, rollback/fix-forward, observability, and auditability.
