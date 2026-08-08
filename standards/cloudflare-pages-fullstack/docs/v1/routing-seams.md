# Routing Seams

## R-SEAM-1 - Reserve the API namespace

**Severity.** `blocker`. A shadowed API namespace means the deployed route graph cannot
serve both halves.

**Rule.** Pages Functions own the API namespace, normally `/api/*`; SPA routes must not
shadow that namespace, and the static asset catch-all must not intercept it.

**Why.** A route collision can cause API requests to return `index.html` or allow UI
routing to bypass expected server behavior.

```text
good:
  functions/api/users.ts
  src/routes/settings.tsx

bad:
  functions/api/users.ts
  src/routes/api/users.tsx
```

**vcqa.** Compare frontend route declarations and Functions paths for namespace overlap.
Concretely:

- enumerate Function routes from the `functions/` tree (`functions/api/users.ts` →
  `/api/users`, `functions/api/[id].ts` → `/api/:id`) and from `_routes.json` `include`;
- enumerate SPA routes from the router declarations (`createBrowserRouter`, `<Route path>`,
  file-based route directory);
- flag any SPA path that matches a Function path or falls under the reserved API prefix;
- flag a `_redirects` catch-all (`/*  /index.html  200`) that has no preceding rule or
  `_routes.json` `exclude` keeping the API prefix out of the fallback.

**Evidence.**

- Source/config: `functions/**`, `_routes.json`, `_redirects`, and the frontend router
  declarations.
- Runtime/deploy: a deployed-URL request to a known API path returning
  `content-type: application/json`, never `text/html`.
- Exception: not available for the reserved prefix itself. A different prefix is fine when
  it is declared once and used consistently by config, Functions, and the API client.

**References.**

- Pages Functions routing: <https://developers.cloudflare.com/pages/functions/routing/>
- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>

## R-SEAM-2 - Preserve SPA fallback without swallowing APIs

**Severity.** `high`, escalating to `blocker` when a deployed API path returns the SPA
shell, because clients then parse HTML as an API response.

**Rule.** Unknown UI routes must fall back to the frontend entrypoint with a `200`, and API
routes must still dispatch to Functions or return an API-shaped `404` with a JSON
content type.

**Why.** Deep links and API calls have different failure modes. A Pages deployment must
make both predictable.

**vcqa.** Check routing config and preview smoke tests for one UI deep link and one missing
API route. Required signals:

- a fallback rule exists: `_redirects` containing `/*  /index.html  200`, or an equivalent
  Pages/asset configuration, or the router is hash-based;
- the fallback does not cover the asset directory or the API prefix — `_routes.json`
  `include`/`exclude` is the authoritative statement of which paths invoke Functions;
- a Function or middleware returns a structured `404` for unmatched API paths rather than
  falling through to the asset handler;
- the smoke assertions in R-TEST-1 cover both paths.

**Evidence.**

- Source/config: `_redirects`, `_routes.json`, `functions/api/_middleware.ts` or the
  catch-all Function.
- CI/artifacts: the retained smoke transcript from R-TEST-3.
- Runtime/deploy: `GET /<deep/link>` → `200` and `content-type: text/html`;
  `GET /api/<unknown>` → `404` and `content-type: application/json`.
- Exception: `acceptedException` only for a documented non-SPA hosting mode; it must name
  owner, scope, compensating control, and review date.

**References.**

- Pages Functions routing: <https://developers.cloudflare.com/pages/functions/routing/>
- Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>

## R-SEAM-3 - Keep route parameters consistent across the seam

**Severity.** `medium`, escalating to `high` when the mismatched identifier is a tenant,
account, or authorization subject.

**Rule.** Dynamic route names used by frontend links and Function handlers must describe
the same resource identity, or the mapping must be documented at the API client.

**Why.** Divergent route parameters create subtle bugs such as `/accounts/:id` in the UI
calling `/api/customers/:customerId` without a documented mapping.

**vcqa.** Compare route patterns and API client calls; flag undocumented mismatches between
the UI parameter name, the API client argument name, and the `functions/api/[param].ts`
file name.

**Evidence.**

- Source/config: frontend route declarations, the API client module, `functions/api/**`
  dynamic segment file names.
- CI/artifacts: type-check output when the parameter type is shared.
- Exception: `acceptedException` when the mapping is deliberate; the record must point at
  the documentation or adapter that states it.

**References.**

- Pages Functions routing: <https://developers.cloudflare.com/pages/functions/routing/>

## R-SEAM-4 - Use explicit API clients or fetch wrappers

**Severity.** `low`, escalating to `medium` when auth headers, credentials mode, or error
parsing are duplicated inconsistently across call sites.

**Rule.** Browser code must call same-origin APIs through a single API client or fetch
wrapper rather than scattered ad hoc `fetch` strings, unless an `acceptedException` records
why a direct call is required.

**Why.** A seam is easier to validate when URL construction, auth headers, error handling,
and response parsing are centralized.

**Scoring.** Two or more distinct browser modules issuing literal API-prefix `fetch` calls
with no shared wrapper is a fail. One call site, or all call sites routed through a wrapper,
is a pass.

**vcqa.** Flag repeated literal `/api/` fetches where no API client abstraction exists.
Also confirm the API base is same-origin: a hardcoded absolute origin, or a
`VITE_API_BASE_URL` pointing at a different host, means the deployment is no longer a
same-origin Pages seam and must be assessed as a cross-origin API instead.

**Evidence.**

- Source/config: the API client module, browser `fetch` call sites, and any env-configured
  API base.
- Runtime/deploy: built assets contain relative API paths rather than a foreign origin; no
  wildcard CORS header is required for the app's own API.
- Exception: `acceptedException` with owner, scope, reason, compensating controls,
  evidence, expiry/review date, and approval trail.

**References.**

- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>
- Vite env and mode: <https://vite.dev/guide/env-and-mode>
