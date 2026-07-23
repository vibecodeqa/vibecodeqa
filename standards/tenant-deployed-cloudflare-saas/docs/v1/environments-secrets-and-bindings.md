# Environments, secrets, and bindings

## R-ENV-1 - Bindings are scoped by tenant and environment

**Rule.** Preview, staging, production, and tenant-specific deployments must bind to the
intended D1 databases, secrets, queues, buckets, service bindings, and OAuth clients by
configuration.

**Why.** Tenant and environment isolation fails when a deployment relies on operator
memory to select resources.

**vcqa.** Check `wrangler.toml`, generated deployment config, CI variables, and runbooks
for tenant/environment-specific binding names. Flag production bindings reachable from
preview or local workflows without an explicit exception.

**References.**

- Cloudflare Workers environments:
  <https://developers.cloudflare.com/workers/wrangler/environments/>
- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>

## R-ENV-2 - Remote commands name tenant and environment

**Rule.** Any command that mutates remote Cloudflare state must require or derive an
explicit tenant and environment.

**Why.** Commands such as deploy, migrate, secret set, domain change, and restore are
high-risk in a tenant-deployed architecture.

**vcqa.** Flag scripts that call Wrangler or Cloudflare APIs against remote state without
a tenant/environment argument, selected deployment environment, or manifest lookup.

**References.**

- Wrangler commands:
  <https://developers.cloudflare.com/workers/wrangler/commands/>

## R-SECRET-1 - Secrets have lifecycle metadata

**Rule.** Tenant and environment secrets must have an owner, target environment, rotation
path, revocation path, and evidence that production values are not exposed to preview or
local development.

**Why.** Tenant-scoped deployment multiplies secrets and makes stale or overbroad
credentials more likely.

**vcqa.** Flag secrets with no owner, no rotation path, no environment scope, or workflows
that reuse production secrets across preview and staging.

**References.**

- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- OWASP Secrets Management Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html>

## R-SECRET-2 - Preview and local cannot access production secrets

**Rule.** Preview and local development must not use production tenant secrets,
production D1 bindings, production webhooks, or production tenant API credentials unless
a reviewed exception exists.

**Why.** Preview deployments are often easier to access and change more frequently than
production.

**vcqa.** Flag preview/local workflows that read production secrets or production tenant
bindings without a documented exception, least-privilege token, and audit path.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>

## R-AUTH-1 - Tenant authorization is enforced server-side

**Rule.** Workers and Pages Functions must check tenant authorization before serving or
mutating tenant data.

**Why.** Client routing, deployment names, URL paths, and tenant-specific domains are not
authorization controls by themselves.

**vcqa.** Flag tenant data access where authorization is only enforced in React, route
names, conventions, or UI state.

**References.**

- OWASP Authorization Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html>
