# Suitability and shape

## R-FIT-1 - Tenant deployment boundary is justified

**Rule.** A repository using this standard must document why tenants need distinct
Cloudflare deployment surfaces instead of one shared production SaaS deployment.

**Why.** Tenant deployment multiplies provisioning, migration, secret, release,
observability, and incident-response work. It should be chosen for isolation, compliance,
white-labeling, per-tenant release windows, or contained operations rather than as a
default architecture.

**vcqa.** Flag a tenant-deployed claim when no architecture note, stack decision, or
tenant runbook explains the operational reason for tenant-level deployment.

**References.**

- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>

## R-FIT-2 - Single-production SaaS is not misclassified

**Rule.** A product with one production deployment and no tenant-level deployment
operations must not be judged as tenant-deployed Cloudflare SaaS.

**Why.** Single-production SaaS still needs authorization, data-resource, and deployment
standards, but it does not need tenant provisioning, alias, per-tenant migration, and per-tenant
rollback rules.

**vcqa.** If tenant identity appears only as an application field and no Cloudflare
resource varies by tenant, resolve the repo to lower-level stack standards only.

**References.**

- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>

## R-SHAPE-1 - Deployable tenant surfaces are named

**Rule.** The repo must name each deployable tenant surface it owns: Pages project,
Pages Functions API, Worker, route, custom domain, data resource, queue, bucket, Durable
Object namespace, service binding, or integration credential.

**Why.** Operators cannot prove isolation, roll back a tenant, or investigate an incident
if deployable surfaces are inferred from naming conventions or console state.

**vcqa.** Look for a tenant manifest, deployment map, IaC file, generated config, or
source-controlled operations doc that maps tenants and environments to Cloudflare
resources.

**References.**

- Cloudflare Pages Functions bindings:
  <https://developers.cloudflare.com/pages/functions/bindings/>
- Cloudflare Workers environments:
  <https://developers.cloudflare.com/workers/wrangler/environments/>

## R-SHAPE-2 - Shared versus isolated resources are explicit

**Rule.** Every resource is marked as tenant-isolated or shared, and shared resources must
state the compensating isolation model.

**Why.** Shared resources are sometimes appropriate, but they change the threat model and
the operational blast radius.

**vcqa.** Flag unclassified databases, Workers, KV/R2/queues, Durable Object namespaces,
secrets, API tokens, OAuth clients, and third-party credentials when a repo claims tenant
isolation.

**References.**

- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
