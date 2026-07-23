# Project Shape And Bindings

## R-SHAPE-1 - The runtime boundary is Cloudflare-owned

**Rule.** D1 access lives only in Cloudflare Workers, Pages Functions, or framework server
code compiled to those runtimes; browser/client code never imports or calls a database
adapter directly.

**Why.** D1 is exposed to application code through Cloudflare runtime bindings. Client code
cannot safely hold database access and cannot receive a D1 binding.

**vcqa.** Detect D1 usage in Worker entrypoints, `functions/`, Pages adapters, or server
routes; flag D1 imports/usages from browser bundles or UI-only files.

**References.** <https://developers.cloudflare.com/d1/worker-api/>,
<https://developers.cloudflare.com/pages/functions/bindings/>

## R-SHAPE-2 - D1 databases are declared as platform bindings

**Rule.** Every D1 database used by app code has a declared Cloudflare binding in Wrangler
configuration, Pages project binding configuration, or documented deployment-managed
binding.

**Why.** Binding names are the runtime contract. Undeclared or dashboard-only bindings
without repo documentation cause preview/local failures and make deploy review unreliable.

**vcqa.** Inspect `wrangler.toml`, `wrangler.json`, `wrangler.jsonc`, Pages docs, and
deployment scripts for `d1_databases` or equivalent binding declarations matching code
names such as `env.DB` and `context.env.DB`.

**References.** <https://developers.cloudflare.com/workers/runtime-apis/bindings/>,
<https://developers.cloudflare.com/pages/functions/bindings/>,
<https://developers.cloudflare.com/workers/wrangler/configuration/>

## R-BIND-1 - Binding names are stable and typed at the boundary

**Rule.** D1 binding names are stable, documented, and represented in TypeScript via
generated Cloudflare types or explicit `Env`/`Bindings` interfaces.

**Why.** D1 binding failures are runtime failures unless the boundary is typed and reviewed
with the request handler.

**vcqa.** Check for `wrangler types`, `worker-configuration.d.ts`, `Env` interfaces, Hono
`Bindings`, PagesFunction generics, or equivalent type declarations containing each D1
binding name.

**References.** <https://developers.cloudflare.com/d1/worker-api/>,
<https://developers.cloudflare.com/pages/functions/bindings/>

## R-BIND-2 - D1 access is centralized behind a small data layer

**Rule.** Request handlers call D1 through a small data-access module or repository layer
instead of scattering raw SQL across unrelated route files.

**Why.** A central data layer makes tenant scoping, parameter binding, row typing, and
migration compatibility reviewable as one surface.

**vcqa.** Prefer `db/`, `data/`, `repositories/`, or service modules; flag broad raw
`prepare()` usage across many UI/route files when no local pattern explains it.

**References.** <https://developers.cloudflare.com/d1/worker-api/prepared-statements/>,
<https://developers.cloudflare.com/d1/worker-api/>
