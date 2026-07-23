# Tenant-Deployed Cloudflare SaaS

**Status:** Planned charter

A SaaS product deployed as isolated tenant instances or tenant environments on
Cloudflare Pages, Workers, D1, and related bindings. This stack treats deployment
topology, tenant isolation, promotion, preview exposure, and operational evidence as
part of the product contract.

## Full rubric

No full versioned rubric has been authored yet.

Do not promote this charter to `v1` until the dependent D1 and Cloudflare deployment
rules are stable enough to make D1 migration, backup, rollback, and binding checks
auditable without relying on unfinished rubrics.

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

Before production, this stack requires documented tenant provisioning, explicit
tenant-to-Cloudflare-resource mapping, environment-specific bindings and secrets,
protected previews and deployment aliases, promotion gates for staging and production,
D1 backup/restore or fix-forward runbooks, and tenant-aware logs/audit trails.

## Scope

- Tenant-deployed SaaS on Cloudflare Pages, Workers, or Pages Functions.
- Per-tenant or per-tenant-environment D1 databases, bindings, secrets, routes,
  aliases, and custom domains.
- CI/CD promotion from preview to staging to production using GitHub Actions and
  Wrangler or Cloudflare-managed deployments.
- Tenant provisioning, deprovisioning, rollback, fix-forward, observability, and
  audit evidence needed to operate the stack safely.

## Not in scope

- Single-tenant apps with one production deployment.
- Generic SaaS product management, billing, customer success, or packaging.
- Full D1 migration doctrine beyond the tenant/environment requirements this stack
  depends on.
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
- GitHub Actions OIDC for cloud providers:
  <https://docs.github.com/actions/security-for-github-actions/security-hardening-your-deployments/configuring-openid-connect-in-cloud-providers>
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

- Multiple Cloudflare Pages projects, Workers, routes, custom domains, or aliases
  named by tenant or tenant environment.
- `wrangler.toml`, `wrangler.json`, or generated deployment config containing
  `[env.<name>]`, `[[d1_databases]]`, `vars`, `secrets`, `routes`, or Pages project
  names that vary by tenant.
- GitHub Actions workflows that deploy to Cloudflare with tenant, staging, preview,
  or production environment names.
- Cloudflare Access policies, preview URL settings, branch deployment controls, or
  custom preview aliases.
- Tenant provisioning docs, tenant manifests, account mapping docs, customer-specific
  runbooks, or release notes.
- D1 migration commands, tenant database IDs, database export/restore scripts, or
  Time Travel runbook references.
- Logs, audit events, alerts, or trace metadata that include `tenant_id`,
  deployment alias, environment, actor, commit SHA, or Cloudflare deployment/version ID.

## Combination-born guidelines

- Tenant boundaries must be deployable boundaries. A tenant deployment must map to
  named Cloudflare resources, and shared resources must be called out explicitly with
  the compensating isolation model.
- Preview is not staging. Cloudflare Pages and Workers preview URLs are useful for PR
  validation, but their public URL behavior and bindings must be treated as exposure
  decisions, not as harmless build artifacts.
- Tenant secrets and D1 databases must not be shared across preview, staging, and
  production unless the repo documents the shared-infrastructure design and tests the
  authorization boundary.
- Promotion must move known artifacts forward. The system should promote a tested
  commit, Worker version, Pages deployment, migration set, and tenant manifest rather
  than rebuilding ambiguous state at each step.
- Deployment aliases and custom domains are part of the auth perimeter. A readable
  alias such as `customer-staging` must have the same access, indexing, and data
  safety review as the underlying deployment.
- D1 rollback is a product runbook, not just a platform feature. Cloudflare Workers
  versions can be rolled back, but D1 state is outside Worker version tracking and
  D1 point-in-time restore is destructive. Tenant incidents need an explicit
  restore-or-fix-forward decision path.
- Provisioning docs are operational controls. A tenant cannot be considered production
  ready if resource creation, binding configuration, secrets, Access policies,
  migrations, DNS, and smoke tests only exist in an operator's memory.
- Observability must be tenant-aware. Logs and audit trails should include tenant,
  environment, actor, deployment/version, and data target so cross-tenant access and
  tenant-specific incidents can be investigated.

## Candidate rules

These are not final rule IDs yet. They are the seed set for `v1`.

- **R-TENANT-1: Tenant resource ownership is explicit.** Every production tenant has a
  manifest or equivalent documentation listing its Cloudflare account/project,
  Worker(s), Pages project(s), route(s), custom domain(s), D1 database(s), bindings,
  secrets, Access policy, and responsible owner.
- **R-TENANT-2: Shared resources require a named isolation model.** Shared Workers,
  D1 databases, KV/R2 buckets, queues, or third-party credentials are findings unless
  the repo documents how tenant access is scoped and how cross-tenant access is tested.
- **R-ENV-1: Bindings are environment- and tenant-specific.** Preview, staging,
  production, and tenant-specific deployments must bind to the intended D1 databases,
  secrets, queues, buckets, and service bindings by configuration, not operator memory.
- **R-ENV-2: Secrets have scoped lifecycle metadata.** Tenant and deployment secrets
  should have an owner, target environment, rotation path, revocation path, and
  evidence that production values are not exposed to preview or local development.
- **R-PREVIEW-1: Preview deployments are access-controlled.** Pages or Workers preview
  URLs that can expose non-public product behavior, tenant data, or privileged flows
  must be disabled or protected with Cloudflare Access or an equivalent auth layer.
- **R-PREVIEW-2: Preview data cannot mutate production tenant state.** PR previews and
  aliased previews must not write to production D1 databases or production tenant
  integrations unless a documented, reviewed exception exists.
- **R-PREVIEW-3: Preview indexing is intentionally controlled.** Public previews must
  be noindexed or disabled when they contain customer-specific, non-public, or
  security-sensitive application surfaces.
- **R-PROMOTE-1: Promotion gates name the tenant and target environment.** CI/CD must
  distinguish tenant preview, tenant staging, and tenant production, preferably using
  GitHub deployment environments with environment-scoped secrets and protection rules.
- **R-PROMOTE-2: Production deploys are reviewable and traceable.** A production
  promotion records the tenant, actor, commit SHA, Cloudflare project, Worker
  version/deployment or Pages deployment URL, D1 migration set, and approval evidence.
- **R-PROMOTE-3: Branch controls match the release model.** Pages production and
  preview branch settings must be documented so tenant production cannot be updated
  from an unreviewed branch or accidental direct upload.
- **R-D1-1: Tenant D1 databases are isolated by default.** A per-tenant deployment
  should use a per-tenant production D1 database unless the shared database model is
  documented, tested for tenant authorization, and accepted as an explicit risk.
- **R-D1-2: Migrations are promoted before traffic.** Tenant production traffic should
  not be shifted to code requiring a new schema until the tenant's migration state is
  known, recorded, and compatible with the deployed version.
- **R-D1-3: Restore and fix-forward are both documented.** The runbook must explain
  when to use D1 Time Travel or export/import, when to fix forward, who approves a
  destructive restore, and how tenant downtime and data loss are communicated.
- **R-ALIAS-1: Deployment aliases are protected surfaces.** Custom preview aliases,
  tenant staging aliases, and custom domains must have documented authentication,
  authorization, cache, indexing, and DNS ownership expectations.
- **R-PROV-1: Tenant provisioning is repeatable.** A new tenant can be created from
  documented steps or automation covering Cloudflare resources, DNS, D1 migrations,
  secrets, bindings, Access policy, smoke tests, observability, and rollback notes.
- **R-PROV-2: Tenant deprovisioning is repeatable.** The repo documents how to disable
  access, revoke secrets, preserve/export required data, remove routes/domains, and
  retain audit evidence for a tenant.
- **R-OBS-1: Logs carry tenant and deployment context.** Server logs, audit events, and
  alerts must include enough tenant, environment, actor, deployment/version, and data
  target context to investigate cross-tenant access and production incidents.
- **R-OBS-2: Mutating tenant operations are auditable.** Tenant provisioning,
  deprovisioning, migration, secret rotation, domain/alias changes, production deploys,
  restore operations, and administrative data mutations create an audit event.
- **R-AUTH-1: Tenant authorization is enforced server-side.** Client routing,
  Pages visibility, or naming conventions cannot be the only tenant boundary;
  Workers/Functions must check tenant authorization before serving or mutating
  tenant data.

## Anti-patterns

- Treating tenant isolation as a naming convention while all tenants share one
  production D1 database, secret set, or integration credential.
- Letting PR previews use production secrets, production D1 bindings, production
  webhooks, or production tenant API credentials.
- Publishing preview URLs or readable aliases without Cloudflare Access, app auth,
  or explicit public/noindex review.
- Using the same GitHub secret or Cloudflare API token for all tenants and
  environments without least-privilege scoping or rotation ownership.
- Running tenant production deploys from a local laptop with no CI approval,
  deployment record, or reproducible artifact.
- Promoting by rebuilding from a branch instead of referencing the tested commit,
  Worker version, Pages deployment, migration set, and tenant manifest.
- Assuming a Worker rollback also rolls back D1 schema or data.
- Applying destructive D1 restores without tenant-specific approval, bookmark or
  timestamp evidence, and a communication plan.
- Leaving tenant provisioning as an ad hoc checklist outside the repo or customer
  operations docs.
- Logging request data without tenant context, or logging tenant secrets and tokens
  while trying to make operations auditable.

## Production readiness checklist

- A tenant manifest exists for every production tenant and environment.
- All Cloudflare bindings and secrets are scoped by tenant and environment.
- Preview deployments are disabled, Access-protected, or explicitly safe for public
  access and search indexing.
- GitHub Actions deployment environments or equivalent gates separate preview,
  staging, and production, with production approvals and environment-scoped secrets.
- Pages branch controls or direct-upload controls match the release policy.
- Tenant D1 migration state is recorded, and the restore/fix-forward runbook has been
  tested on a non-production tenant.
- Tenant custom domains, preview aliases, and staging aliases have documented auth,
  DNS, cache, and indexing posture.
- Provisioning and deprovisioning instructions cover resources, secrets, bindings,
  migrations, Access policy, smoke tests, observability, and audit retention.
- Logs and audit events include tenant, environment, actor, commit/deployment, and
  target resource identifiers.

## Open authoring questions

- Should `v1` require one Cloudflare account per tenant for regulated workloads, or
  allow account-level sharing when resource manifests and IAM controls are strong?
- What minimum proof should satisfy tenant D1 isolation: separate databases only, or
  can shared D1 pass with mandatory row-key tests and audit queries?
- Should GitHub OIDC be a required target for Cloudflare deploy credentials if
  Cloudflare support is available for the workflow, or should scoped API tokens remain
  acceptable?
- What level of automated evidence should be required for Cloudflare Access policies
  on preview URLs and aliases?
- How should the full rubric distinguish rollback expectations for Workers/Pages code
  from D1 state restoration, since Cloudflare Worker versions do not track D1 state?
- Should tenant provisioning docs live in repo standards, product docs, or generated
  tenant manifests, and what minimum fields should be machine-checkable?

## Benefits

- Defines when tenant-deployed Cloudflare is the right architecture rather than a
  default SaaS deployment shape.
- Raises preview URLs, aliases, bindings, secrets, and D1 state to first-class
  production-readiness concerns.
- Gives Cloudflare SaaS examples a clear path to tenant-safe provisioning, promotion,
  rollback/fix-forward, observability, and auditability.
