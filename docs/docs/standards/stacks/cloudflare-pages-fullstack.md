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

## Benefits

- crm/app.
- future VCQA fullstack dashboard patterns.
