# Tenant resources

## R-RESOURCE-1 - Tenant manifest lists Cloudflare resources

**Rule.** Every production tenant must have a manifest, or an equivalent generated
record, listing its Cloudflare account or project, Pages deployment surface, Worker
surface, routes, custom domains, D1 databases, bindings, secrets, access policy, and
owner.

**Why.** Tenant operations need an auditable source of truth for what exists and who owns
it.

**vcqa.** Require a manifest path, generated artifact, or linked system of record. Flag
production tenants that only exist in Cloudflare dashboard state or undocumented scripts.

**References.**

- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>
- Cloudflare Pages Functions bindings:
  <https://developers.cloudflare.com/pages/functions/bindings/>

## R-RESOURCE-2 - Shared resources require isolation evidence

**Rule.** Shared resources must have documented tenant-scoping rules and tests or
operational checks that prove cross-tenant access is blocked.

**Why.** A shared Worker, D1 database, bucket, OAuth app, queue, or token can silently
become the weakest tenant boundary.

**vcqa.** Flag shared resources with no tenant authorization tests, no scoped query
checks, no access policy, or no accepted risk note.

**References.**

- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>
- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>

## R-DOMAIN-1 - Domains and aliases map to owners and environments

**Rule.** Tenant custom domains, staging domains, preview aliases, and route patterns must
map to a tenant, environment, owner, and access posture.

**Why.** A readable alias or custom domain is a user-facing surface and part of the
authorization perimeter, not a harmless label.

**vcqa.** Flag aliases or custom domains that cannot be traced to a tenant manifest,
environment, DNS owner, cache policy, and auth/indexing posture.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>

## R-OWNER-1 - Production tenants have accountable ownership

**Rule.** Each production tenant must identify the operational owner or owning team for
deploys, migration approvals, secret rotation, incident response, and deprovisioning.

**Why.** Tenant isolation is only useful if a team can act on a tenant-specific incident
quickly and with authority.

**vcqa.** Flag tenant manifests or runbooks that list resources but no responsible owner
or escalation path.

**References.**

- GitHub Actions deployment environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>
