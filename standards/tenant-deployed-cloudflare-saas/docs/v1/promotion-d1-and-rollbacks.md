# Promotion, D1, and rollback

## R-PROMOTE-1 - Promotion gates name tenant, environment, and artifact

**Rule.** CI/CD promotion must record the tenant, target environment, actor, commit SHA,
Pages deployment or Worker version/deployment, D1 migration set, and approval evidence.

**Why.** Tenant promotion must move known artifacts forward. Rebuilding ambiguous state at
each step makes incidents hard to trace and roll back.

**vcqa.** Flag production deploy workflows that do not bind a tenant/environment to a
specific commit, deployment, migration set, and approval record.

**References.**

- GitHub Actions deployment environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>
- Cloudflare Workers versions and deployments:
  <https://developers.cloudflare.com/workers/versions-and-deployments/>

## R-PROMOTE-2 - Production deploys are reviewable and traceable

**Rule.** A production tenant deploy must leave a durable record that can be inspected
after the fact.

**Why.** Tenant incidents require knowing exactly what changed, who approved it, and which
resources were affected.

**vcqa.** Flag local-only or dashboard-only production deploys with no CI run, no
deployment environment, no release note, and no artifact or manifest reference.

**References.**

- Cloudflare Pages direct upload with CI:
  <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>
- GitHub Actions deployment environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-D1-1 - Tenant D1 isolation is the default

**Rule.** A tenant-deployed SaaS should use a per-tenant production D1 database unless a
shared database model is documented, tested for tenant authorization, and accepted as an
explicit risk.

**Why.** D1 state is one of the highest-impact tenant boundaries. Shared state can be
valid, but it needs stronger proof than naming conventions.

**vcqa.** Flag shared production D1 databases with no tenant-isolation design, no
authorization tests, no query-scoping checks, and no risk acceptance.

**References.**

- Cloudflare D1 environments:
  <https://developers.cloudflare.com/d1/configuration/environments/>
- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>

## R-D1-2 - Migrations are promoted before traffic

**Rule.** Tenant production traffic must not be shifted to code requiring a new D1 schema
until that tenant's migration state is known, recorded, and compatible with the deployed
version.

**Why.** Code rollback and database state do not roll back together automatically.

**vcqa.** Flag production deploys where migration application is manual, unordered,
unrecorded, or not tied to the deployed tenant artifact.

**References.**

- Cloudflare D1 migrations:
  <https://developers.cloudflare.com/d1/reference/migrations/>
- Cloudflare Workers versions and deployments:
  <https://developers.cloudflare.com/workers/versions-and-deployments/>

## R-ROLL-1 - Rollback and fix-forward cover code and D1 state separately

**Rule.** The runbook must explain when to roll back code, when to fix forward, when to
use D1 Time Travel or import/export, who approves destructive restore, and how tenant
downtime or data loss is communicated.

**Why.** Worker versions and Pages deployments are not a full database rollback strategy.
D1 point-in-time restore affects data state and requires tenant-specific approval.

**vcqa.** Flag rollback docs that only mention redeploying code and do not cover D1 state,
restore approval, backup evidence, or tenant communication.

**References.**

- Cloudflare D1 Time Travel and backups:
  <https://developers.cloudflare.com/d1/reference/time-travel/>
- Cloudflare D1 import and export:
  <https://developers.cloudflare.com/d1/best-practices/import-export-data/>
