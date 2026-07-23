# Tenant and environment isolation

## R-TENANT-1 - Shared tenant resources have isolation evidence

**Rule.** Shared tenant resources must have explicit tenant-scoping rules, authorization
checks, tests, and accepted risk.

**Why.** Shared D1 databases, Workers, queues, buckets, OAuth apps, API tokens, and
third-party integrations can silently become cross-tenant access paths.

**vcqa.** Flag shared tenant resources when there is no row/resource scoping, no
server-side authorization, no tenant-specific test, and no documented risk acceptance.

**References.**

- OWASP Multi Tenant Security Cheat Sheet:
  <https://cheatsheetseries.owasp.org/cheatsheets/Multi_Tenant_Security_Cheat_Sheet.html>

## R-BOUNDARY-1 - Preview, staging, and production are separate security contexts

**Rule.** Preview, staging, and production must have separate security context for data,
secrets, auth clients, webhooks, deployment aliases, and privileged integrations unless a
reviewed exception exists.

**Why.** Preview and staging deployments are useful precisely because they move quickly;
that makes accidental production access more dangerous.

**vcqa.** Flag preview/staging code paths that bind production D1 databases, production
secrets, production OAuth clients, production webhooks, or production tenant integrations
without an exception.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-BOUNDARY-2 - Cloudflare bindings define the resource boundary

**Rule.** Worker and Pages Function resource access should use named Cloudflare bindings
whose scope matches the target environment and resource owner.

**Why.** Bindings make resource access explicit and reduce reliance on broad REST API
tokens or operator-selected resource IDs.

**vcqa.** Flag Workers/Functions that use broad Cloudflare API tokens to reach resources
that could be expressed as bindings, or bindings that do not vary across environments
where they should.

**References.**

- Cloudflare Workers bindings:
  <https://developers.cloudflare.com/workers/runtime-apis/bindings/>

## R-BOUNDARY-3 - Deployment aliases inherit production-like review

**Rule.** Stable preview aliases, tenant aliases, and custom domains must have explicit
auth, indexing, cache, and data posture.

**Why.** A stable alias can expose product behavior even when the underlying deployment is
temporary.

**vcqa.** Flag aliases and custom domains that are not tied to an environment, owner,
data source, and access posture.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
