# Cloudflare Pages Functions

Pages Functions provide server-side routes co-deployed with a Cloudflare Pages static site.

## Upstream references

- [Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Pages Functions Routing](https://developers.cloudflare.com/pages/functions/routing/)
- [Pages Functions Middleware](https://developers.cloudflare.com/pages/functions/middleware/)

## What upstream owns

- Functions routing model
- middleware mechanics
- Cloudflare binding behavior

## What VCQA owns

- functions directory shape.
- same-origin API seam.
- SPA/functions route collision checks.
- binding and env policy.

## Detection signals

- `functions/` directory
- `wrangler.toml` or Pages config
- Cloudflare deployment workflow

## Composed standards

- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)

## Combination-born guidelines

- Pages Functions plus React Router requires a route namespace that avoids `/api/*` collisions.
- Pages Functions plus D1 requires bindings per environment, not shared production credentials in preview.
- Pages Functions plus client auth requires middleware enforcement for protected data routes.
