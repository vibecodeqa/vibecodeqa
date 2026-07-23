# Tenant-Deployed Cloudflare SaaS - Edition v1

!!! info "Edition metadata"
    **Targets:** Cloudflare Pages · Pages Functions · Workers · D1 · Wrangler · GitHub Actions
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `tenant-deployed-cloudflare-saas@v1`

This edition captures the gold standard for a tenant-scoped SaaS deployment model on
Cloudflare. It focuses on the seams between tenant resources, preview exposure, binding
and secret scope, promotion gates, D1 state, provisioning, observability, and audit.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
a `vcqa` signal, and primary references.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Suitability and shape](suitability-and-shape.md) | `FIT` / `SHAPE` | when this stack is justified and how deployable surfaces are named |
| 2 | [Tenant resources](tenant-resources.md) | `RESOURCE` / `DOMAIN` / `OWNER` | tenant manifests, resource ownership, shared-resource exceptions |
| 3 | [Environments, secrets, and bindings](environments-secrets-and-bindings.md) | `ENV` / `SECRET` / `AUTH` | scoped bindings, secret lifecycle, server-side authorization |
| 4 | [Preview access and aliases](preview-access-and-aliases.md) | `PREVIEW` / `ALIAS` / `INDEX` | preview safety, protected aliases, public indexing posture |
| 5 | [Promotion, D1, and rollback](promotion-d1-and-rollbacks.md) | `PROMOTE` / `D1` / `ROLL` | deploy evidence, migration order, code rollback vs data restore |
| 6 | [Provisioning and runbooks](provisioning-and-runbooks.md) | `PROV` / `DOC` / `SMOKE` | repeatable tenant lifecycle and acceptance checks |
| 7 | [Observability and audit](observability-and-audit.md) | `OBS` / `AUDIT` / `INCIDENT` | tenant context in logs, mutating-operation audit, incident evidence |

## Non-negotiables

- **R-FIT-1** - tenant deployment boundaries are justified by a real operational need.
- **R-RESOURCE-1** - every production tenant has a manifest of Cloudflare resources,
  environments, owners, and runbooks.
- **R-ENV-1** - bindings are scoped by tenant and environment.
- **R-PREVIEW-1** - preview deployments are access-controlled or explicitly public-safe.
- **R-PROMOTE-1** - promotion gates name the tenant, environment, commit, deployment,
  and migration set.
- **R-D1-1** - tenant D1 isolation is the default; shared D1 requires documented risk and
  tests.
- **R-ROLL-1** - rollback and fix-forward treat code and D1 state separately.
- **R-PROV-1** - tenant provisioning is repeatable from documented steps or automation.
- **R-OBS-1** - logs carry tenant, environment, deployment, and target-resource context.
- **R-AUDIT-1** - mutating tenant operations create audit evidence.

## Reference baseline

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- Cloudflare Pages branch deployment controls:
  <https://developers.cloudflare.com/pages/configuration/branch-build-controls/>
- Cloudflare Workers versions and deployments:
  <https://developers.cloudflare.com/workers/versions-and-deployments/>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- Cloudflare D1 Time Travel and backups:
  <https://developers.cloudflare.com/d1/reference/time-travel/>
- Cloudflare D1 import and export:
  <https://developers.cloudflare.com/d1/best-practices/import-export-data/>
- GitHub Actions deployment environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>
- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>
