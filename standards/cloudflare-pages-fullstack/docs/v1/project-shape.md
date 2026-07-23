# Project Shape

## R-SHAPE-1 - Keep the frontend and Functions as distinct slices

**Rule.** A Pages fullstack app separates static frontend source from Pages Functions
source, even when they live in the same package.

**Why.** The frontend ships to the browser; Functions run at the edge with privileged
bindings. VCQA must judge those surfaces differently.

```text
good:
  app/src/
  app/functions/
  app/wrangler.toml

bad:
  app/src/api/
  app/src/secrets.ts
```

**vcqa.** Detect a frontend build source and a `functions/` tree; flag privileged code or
bindings imported into browser source.

## R-SHAPE-2 - Do not require a long-running server

**Rule.** The app must build into static assets plus Pages Functions; it must not require
an Express, Fastify, Hono, or Next server process to serve requests.

**Why.** Pages Functions are request handlers in Cloudflare's edge runtime. A long-running
server changes the stack and invalidates this standard.

**vcqa.** Check package dependencies and scripts for server runtimes; distinguish local
dev helpers from production requirements.

## R-SHAPE-3 - Declare the Cloudflare project boundary

**Rule.** The repo documents or configures which Pages project receives the static assets
and Functions.

**Why.** Fullstack behavior depends on deploying both halves into the same Pages project.

**vcqa.** Check Wrangler config, deployment workflow, or docs for Pages project name and
publish directory.

## R-SHAPE-4 - Keep generated output out of source rules

**Rule.** Built `dist/`, generated `.wrangler/`, and local preview artifacts are not the
source of truth for the standard.

**Why.** A judge should inspect source and config, not stale generated files.

**vcqa.** Ignore generated output for rule ownership; flag generated directories committed
as authoritative deployment config unless intentionally documented.
