# Promotion, data resources, and rollback

## R-PROMOTE-1 - Promotion gates name tenant, environment, and artifact

**Rule.** CI/CD promotion must record the tenant, target environment, actor, commit SHA,
Cloudflare deployment or Worker version, data-resource migration or compatibility set,
and approval evidence.

**Why.** Tenant promotion must move known artifacts forward. Rebuilding ambiguous state at
each step makes incidents hard to trace and roll back.

**vcqa.** Flag production deploy workflows that do not bind a tenant/environment to a
specific commit, deployment/version, migration or compatibility set, and approval record.

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

## R-DATA-1 - Tenant data-resource isolation is the default

**Rule.** A tenant-deployed SaaS should use per-tenant production data resources unless a
shared data model is documented, tested for tenant authorization, and accepted as an
explicit risk. D1-backed tenants also apply the Cloudflare D1 App rubric.

**Why.** Tenant data is one of the highest-impact tenant boundaries. Shared state can be
valid, but it needs stronger proof than naming conventions.

**vcqa.** Flag shared production databases, buckets, namespaces, Durable Objects, or
external data bindings with no tenant-isolation design, no authorization tests, no
resource-scoping checks, and no risk acceptance.

**References.**

- Cloudflare D1 environments:
  <https://developers.cloudflare.com/d1/configuration/environments/>
- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>

## R-DATA-2 - Data migrations or compatibility changes are promoted before traffic

**Rule.** Tenant production traffic must not be shifted to code requiring a new schema,
bucket layout, object format, Durable Object state shape, or external data contract until
that tenant's data-resource state is known, recorded, and compatible with the deployed
version.

**Why.** Code rollback and database state do not roll back together automatically.

**vcqa.** Flag production deploys where data migration, compatibility, or restore state
is manual, unordered, unrecorded, or not tied to the deployed tenant artifact.

**References.**

- Cloudflare D1 migrations:
  <https://developers.cloudflare.com/d1/reference/migrations/>
- Cloudflare Workers versions and deployments:
  <https://developers.cloudflare.com/workers/versions-and-deployments/>

## R-ROLL-1 - Rollback and fix-forward cover code and data state separately

**Rule.** The runbook must explain when to roll back code, when to fix forward, when to
use platform backup/restore such as D1 Time Travel or import/export, who approves
destructive restore, and how tenant downtime or data loss is communicated.

**Why.** Worker versions and Pages deployments are not a full database rollback strategy.
Data restore affects data state and requires tenant-specific approval.

**vcqa.** Flag rollback docs that only mention redeploying code and do not cover data
state, restore approval, backup evidence, or tenant communication.

**References.**

- Cloudflare D1 Time Travel and backups:
  <https://developers.cloudflare.com/d1/reference/time-travel/>
- Cloudflare D1 import and export:
  <https://developers.cloudflare.com/d1/best-practices/import-export-data/>
