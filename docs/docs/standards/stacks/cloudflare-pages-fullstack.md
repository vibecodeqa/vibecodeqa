# Cloudflare Pages Fullstack

**Status:** Planned charter

A static frontend co-deployed with Cloudflare Pages Functions, usually with same-origin `/api/*` routes.

## Full rubric

No full versioned rubric has been authored yet.


## Scope

A static frontend co-deployed with Cloudflare Pages Functions, usually with same-origin `/api/*` routes.

## Not in scope

- standalone Workers without Pages
- database-specific D1 migration rules
- generic React component doctrine

## Composes

- [React SPA](react-spa.md)
- [Cloudflare Pages Functions](../items/cloudflare-pages-functions.md)
- [TypeScript](../items/typescript.md)
- [Web Security](../items/web-security.md)
- [GitHub Actions](../items/github-actions.md)

## VCQA-owned rule surface

- same-origin /api seam.
- functions route shape.
- middleware/auth placement.
- bindings and deployed vars.
- SPA/functions deploy assembly.

## Detection signals

- `functions/` directory
- `wrangler.toml` or Pages project config
- frontend build output deployed with Functions

## Combination-born guidelines

- SPA routes and Functions routes must not collide; reserve `/api/*` for Functions.
- Protected API routes need middleware/server-side enforcement, not client-only guards.
- Bindings and secrets are environment-scoped; preview must not reuse production secrets accidentally.

## Candidate rules

These are not final rule IDs yet. They are the seed set for `v1`.

- **R-SEAM-1: Reserve the API namespace.** Pages Functions own `/api/*`; the SPA router
  must not define user-facing routes that shadow that namespace.
- **R-SEAM-2: Deep links and API routes are tested together.** A deployed preview must
  prove that unknown UI routes fall back to `index.html` while API routes still dispatch
  to Functions.
- **R-AUTH-1: Client guards are not authorization.** Protected reads and writes require
  middleware or per-route authorization in Functions.
- **R-ENV-1: Client env vars are public.** `VITE_*` values may configure URLs and feature
  flags, but secrets must live in Cloudflare bindings or deployment secrets.
- **R-BIND-1: Bindings are environment-scoped.** Preview, staging, and production bindings
  are named and reviewed separately.
- **R-DEPLOY-1: The frontend and Functions deploy as one artifact.** The CI pipeline must
  assemble static assets and Functions into the same Pages deployment.
- **R-TYPE-1: API contracts cross the seam.** Request/response shapes used by the SPA and
  Functions should be typed or schema-validated at the boundary.
- **R-OBS-1: Server errors are observable.** Functions should return safe client errors
  while preserving enough server-side context for debugging.

## Anti-patterns

- Treating a React route guard as the only protection for private data.
- Putting production secrets in `VITE_*` variables or checked-in config.
- Letting `/api/*` be handled by the SPA fallback.
- Deploying frontend assets without the matching Functions version.
- Sharing production bindings with preview deployments.

## Open authoring questions

- Should the standard prescribe `/api/*`, or allow a documented alternative namespace?
- Which auth providers should have first-class examples?
- Should D1-specific bindings live here or only in [Cloudflare D1 App](cloudflare-d1-app.md)?

## Benefits

- crm/app.
- future VCQA fullstack dashboard patterns.
