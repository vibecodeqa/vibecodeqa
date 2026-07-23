# Cloudflare Pages Fullstack - Edition v1

!!! info "Edition metadata"
    **Targets:** Cloudflare Pages Functions · static frontend · TypeScript · GitHub Actions
    **Reviewed:** 2026-07 · **Next review due:** 2027-07
    **Status:** latest · **Pin as:** `cloudflare-pages-fullstack@v1`

This edition captures the gold standard for a static frontend co-deployed with
Cloudflare Pages Functions. It focuses on the seam between frontend, edge API,
Cloudflare bindings, auth middleware, and deployment.

## Rule shape

Each rule has a stable ID (`R-<AREA>-<n>`), one checkable statement, the reason it exists,
and a `vcqa` signal that describes how a scanner or judge evaluates it.

## The rubric

| # | Area | Code | What it governs |
| --- | --- | --- | --- |
| 1 | [Project shape](project-shape.md) | `SHAPE` | repo layout, static frontend, Functions slice |
| 2 | [Routing seams](routing-seams.md) | `SEAM` | SPA fallback, `/api/*`, route collision avoidance |
| 3 | [Auth and security](auth-and-security.md) | `AUTH` / `SEC` | authorization boundary, secret handling, safe errors |
| 4 | [Environment and bindings](environment-and-bindings.md) | `ENV` / `BIND` | client env, Cloudflare bindings, preview/prod isolation |
| 5 | [Typing and validation](typing-and-validation.md) | `TYPE` / `VAL` | request/response contracts and runtime validation |
| 6 | [Deployment and CI](deployment-and-ci.md) | `DEPLOY` / `CI` | build assembly, branch deployment, permissions |
| 7 | [Testing and observability](testing-and-observability.md) | `TEST` / `OBS` | preview smoke tests, logs, diagnostics |

## Non-negotiables

- **R-SEAM-1** - Pages Functions own the API namespace and must not be shadowed by SPA
  routes.
- **R-AUTH-1** - protected API reads and writes are authorized in Functions or middleware,
  not only in client code.
- **R-ENV-1** - client environment variables are public; secrets live in Cloudflare
  bindings or deployment secrets.
- **R-BIND-1** - preview, staging, and production bindings are explicitly separated.
- **R-DEPLOY-1** - static assets and Functions are assembled into one Pages deployment.
