# Preview access and aliases

## R-PREVIEW-1 - Preview deployments are access-controlled or public-safe

**Rule.** Pages or Workers previews that expose non-public product behavior, tenant data,
admin flows, or privileged APIs must be disabled or protected by Cloudflare Access,
application auth, or an equivalent access layer.

**Why.** Preview deployments can be created for branches and pull requests. Public preview
URLs are useful for review, but they are still deployed application surfaces.

**vcqa.** Flag public previews that expose tenant data, admin actions, auth-sensitive
flows, or production-like integrations without a documented public-safe decision.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
- Cloudflare Workers preview URLs:
  <https://developers.cloudflare.com/workers/versions-and-deployments/preview-urls/>

## R-PREVIEW-2 - Preview data cannot mutate production tenant state

**Rule.** Pull request previews and aliased previews must not write to production data
resources, production tenant integrations, production queues, or production webhooks
unless a documented and reviewed exception exists.

**Why.** Preview code is usually less reviewed than production code and often runs before
release gates.

**vcqa.** Flag preview bindings, secrets, URLs, or CI variables that point to production
tenant state.

**References.**

- Cloudflare Pages Functions bindings:
  <https://developers.cloudflare.com/pages/functions/bindings/>
- Cloudflare D1 environments:
  <https://developers.cloudflare.com/d1/configuration/environments/>

## R-ALIAS-1 - Deployment aliases are protected surfaces

**Rule.** Custom preview aliases, tenant staging aliases, and custom domains must have
documented authentication, authorization, cache, indexing, and DNS ownership posture.

**Why.** Stable aliases are easier to discover and remember than hash URLs, so they need
the same security and privacy review as the deployment they point at.

**vcqa.** Flag aliases that are not listed in a tenant manifest or that lack access,
indexing, DNS, and cache ownership.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>

## R-INDEX-1 - Public previews are intentionally noindexed or disabled

**Rule.** Public preview surfaces must be intentionally noindexed or disabled when they
contain customer-specific, non-public, or security-sensitive product behavior.

**Why.** Search indexing can turn temporary previews into durable public discovery
surfaces.

**vcqa.** Flag public previews with no documented indexing posture, especially when the
preview is tenant-specific or contains non-public workflows.

**References.**

- Cloudflare Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>
