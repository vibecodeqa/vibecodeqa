# 11 · Build & hosting

Where the archetype meets reality: a folder of static files served by a host that knows
nothing about React. The app is `vite build` → `dist/`, deployed from CI to Cloudflare Pages /
R2 behind a host worker, on a custom domain. The rules here are the ones that decide whether a
correct build actually *works* once it's served — relative assets, SPA fallback, and cache
discipline are the difference between a green deploy and a blank page.

## Rules

### R-BUILD-1 · Static output only, no server runtime

**Rule.** `vite build` produces a self-contained `dist/` of HTML, hashed JS/CSS, and assets.
Nothing in the deploy pipeline starts a Node/SSR process to serve a request.

**Why.** This is R-SETUP-1 at the hosting layer: the host is a dumb file server + CDN. A static
`dist/` is edge-cacheable, has no runtime to keep alive or patch, and can be served from R2,
Pages, or any CDN identically. The moment a request needs server code to render, it's a
different archetype.

**vcqa.** `build` ends in `vite build`; deploy artifact is `dist/`; no server entrypoint
(`server.js`, `functions/`, `[[path]].ts` SSR handler) is deployed alongside the static output.

### R-BUILD-2 · Assets load from a relative base (proxy-safe)

**Rule.** The built `index.html` references assets **relatively** (`./assets/…`), the runtime
result of `base: './'` (R-SETUP-6). Verified at the hosting layer: the app must load when
served under a path prefix or behind a proxy, not only at the domain root.

**Why.** House hosting puts apps behind a host worker and often under a prefix
(`store.example.com/app/`, a per-PR preview URL, a worker that strips a segment). With an
absolute base the HTML requests `/assets/app.[hash].js` at the *origin root* — which the proxy
never mapped — so every asset 404s and the page is blank though the build "succeeded". Relative
URLs resolve against the document's actual path, so the same `dist/` works at the root, under a
prefix, and on a preview URL unchanged. This is the number-one "works locally, blank in prod"
failure and it manifests only once hosted.

```html
<!-- ✅ relative — resolves under any prefix or proxy -->
<script type="module" src="./assets/index.[hash].js"></script>
<!-- ❌ absolute — bypasses the proxy, 404s under /app/ -->
<script type="module" src="/assets/index.[hash].js"></script>
```

**vcqa.** Built `index.html` uses relative `./assets/*` references; no root-absolute `/assets/`
when the deploy target is path-prefixed; cross-check `vite.config` `base` is not `'/'`.

### R-BUILD-3 · Host serves index.html for unknown paths (SPA fallback)

**Rule.** The host is configured so any path that isn't a real file returns `index.html` with a
`200` (SPA fallback), letting the client router take over — or the app uses hash routing as the
fallback. A deep link or refresh must **never** 404.

**Why.** Client-side routing means routes like `/settings/profile` exist only in JS. A user who
deep-links, refreshes, or shares that URL hits the host directly; without a fallback the host
looks for a `settings/profile` file, finds none, and 404s — the app appears broken on exactly
the shareable URLs. The fallback hands every unknown path to `index.html` so the router
resolves it. Hash routing (`/#/settings/profile`) sidesteps it entirely since the host only
ever sees `/`, and is the correct fallback when the host can't be configured.

```jsonc
// Cloudflare Pages — _redirects (SPA fallback, 200 not 302)
/*    /index.html   200
```

!!! warning "Fallback must not swallow real 404s or assets"
    Rewrite only what isn't a real file, and keep the asset path (`/assets/*`) and any API
    prefix out of the catch-all — otherwise a mistyped asset URL returns HTML with a `200` and
    the browser fails to parse it as JS.

**vcqa.** A SPA-fallback rule exists for the host (`_redirects`/`200.html`/worker
`notFoundHandling: "single-page-application"`/`try_files … /index.html`), **or** the router is
`createHashRouter`/`HashRouter`; deep paths return `200` with the app shell.

### R-BUILD-4 · Only public values in build-time env

**Rule.** Configuration reaches the app through `import.meta.env` (Vite `VITE_`-prefixed vars),
and **only values safe to publish** are put there. Secrets are never build-time env — see
R-DATA-1 for the canonical rule.

**Why.** Vite **inlines** `import.meta.env.VITE_*` as string literals into the shipped bundle at
build time. Anything placed there is readable by anyone who opens the JS — it is published, not
configured. Public API base URLs, feature flags, and publishable keys are fine; a token, secret,
or DB credential put here is leaked to every visitor (cross-ref R-DATA-1). Only `VITE_`-prefixed
vars are exposed, so a stray `SECRET=…` in `.env` isn't inlined — but a `VITE_SECRET=…` is, and
that's the trap.

```ts
// ✅ public, publishable
const apiBase = import.meta.env.VITE_API_BASE_URL;
// ❌ inlined verbatim into the bundle — anyone can read it
const key = import.meta.env.VITE_STRIPE_SECRET_KEY;
```

**vcqa.** Env access is `import.meta.env.VITE_*`; no `VITE_`-prefixed var whose name matches
`SECRET|TOKEN|PRIVATE|PASSWORD|_KEY` (allow publishable/`PUBLIC` keys); `.env*` with real
values is gitignored.

### R-BUILD-5 · Deterministic builds

**Rule.** Builds are reproducible: Node is pinned (R-SETUP-5), the lockfile is committed, and CI
installs with `pnpm install --frozen-lockfile`. A build never mutates the lockfile.

**Why.** The exact bytes users download depend on the resolved dependency tree and toolchain.
An unpinned Node or a floating install lets CI resolve a different graph than local or than
yesterday — a bug appears with no source change, and is unreproducible. `--frozen-lockfile`
fails loudly when `package.json` and the lockfile disagree instead of silently resolving
something new.

```yaml
# ✅ CI install — fail if the lockfile is stale, never rewrite it
- run: pnpm install --frozen-lockfile
```

**vcqa.** `pnpm-lock.yaml` committed; CI uses `--frozen-lockfile`; `setup-node` version matches
`engines.node`; no `--no-frozen-lockfile` in the deploy path.

### R-BUILD-6 · Content-hashed assets cached hard, index.html served fresh

**Rule.** Immutable, content-hashed assets (`app.[hash].js`) are served with a long,
`immutable` cache; `index.html` is served with a short/`no-cache` (revalidated) policy.

**Why.** Vite hashes asset filenames, so a changed asset gets a new name — safe to cache for a
year. `index.html` is the un-hashed entry that *points at* those hashes. If the HTML is
long-cached, a returning visitor keeps an old `index.html` referencing asset hashes that no
longer exist after a deploy → every asset 404s → blank page (the "stale-index trap"). Serving
HTML fresh means each visit re-reads the pointer and picks up the current asset set.

```
# ✅ the two-tier policy
/assets/*     Cache-Control: public, max-age=31536000, immutable
/index.html   Cache-Control: no-cache            # revalidate every load
```

!!! warning "Stale-index trap"
    Long-cached HTML + content-hashed assets is a guaranteed post-deploy blank page for
    returning users. The hashed asset is fine to cache forever *because* the HTML that names it
    is not.

**vcqa.** Host config (`_headers`/worker) sets `immutable`, long `max-age` on `/assets/*` and a
short/`no-cache` policy on `index.html`; HTML is not blanket long-cached.

### R-BUILD-7 · Deploy from CI, never a laptop

**Rule.** Deploys happen only through GitHub Actions (build → gate → publish to Pages/R2). There
is no `wrangler deploy` / `pages deploy` run from a developer machine as the release path.

**Why.** A laptop deploy ships whatever is in one person's working tree with their local
toolchain — unpinned, untested, unaudited, unattributable. CI gives one reproducible
environment (R-BUILD-5), runs the test gate (R-TEST-10) before publishing, and leaves an audit
trail. It's also the only way credentials stay out of laptops.

```yaml
# .github/workflows/deploy.yml — the only release path
on: { push: { branches: [main] } }
jobs:
  deploy:
    steps:
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3   # publishes dist/ from CI
```

**vcqa.** A deploy workflow exists and publishes `dist/`; the gate (typecheck/test) runs before
publish; no documented laptop-deploy step; deploy credentials are CI secrets, not committed.

### R-BUILD-8 · Custom domain via CNAME

**Rule.** The production domain is attached by pointing a **CNAME** at the Pages/host target;
the host terminates TLS. DNS config is declared, not clicked-together-and-forgotten.

**Why.** The archetype is a static origin behind a CDN; the domain is just a CNAME to that
edge, which provisions the certificate and routing. A repo without a registry/host entry for its
domain is drift — the symptom is a CF 1014 (CNAME cross-user) or an unprovisioned-domain error.
Declaring it keeps the mapping reproducible.

**vcqa.** Custom domain is a CNAME to the Pages/host target (documented in repo or the host
registry); no apex A-record hardcoding a fragile IP; TLS is host-terminated.

### R-BUILD-9 · Preview deploy per PR

**Rule.** Every PR produces an isolated **preview deployment** at a unique URL, built the same
way as production.

**Why.** A static build's real failures — the relative-base breakage (R-BUILD-2), the SPA
fallback, asset hashing — only appear once served. A per-PR preview lets reviewers and e2e
exercise the actual built artifact under a prefixed/preview URL before it reaches the domain,
which is exactly the condition that trips absolute-base bugs.

**vcqa.** CI or the host produces a per-PR preview URL (Pages preview / `wrangler versions` /
deploy-preview action); previews build via the same `pnpm build`.

### R-BUILD-10 · A version / health signal is shipped

**Rule.** The build emits a machine-readable stamp — e.g. `version.json` at the site root or a
`<meta name="build">` — carrying the commit SHA and build time, so you can tell what's live.

**Why.** With aggressive edge + browser caching you cannot eyeball whether a deploy actually
took (the stale-index trap makes "looks the same" ambiguous). A fetchable `version.json` lets a
smoke test, an uptime probe, or a human confirm the live bytes match the intended commit — and
pins down "is this the old bundle?" instantly.

```jsonc
// dist/version.json — written at build from CI env
{ "sha": "cc65218", "builtAt": "2026-07-16T09:12:00Z" }
```

**vcqa.** Build produces a `version.json`/build-stamp with commit + timestamp reachable at a
stable URL; the value is generated at build time, not hardcoded.

## Checklist

- [ ] `vite build` → static `dist/`; no server runtime deployed (**R-BUILD-1**)
- [ ] Relative asset base; loads under any prefix/proxy (**R-BUILD-2**)
- [ ] Host serves `index.html` for unknown paths, or hash routing (**R-BUILD-3**)
- [ ] Only public values in `import.meta.env`; secrets never build-time (**R-BUILD-4**)
- [ ] Deterministic build: pinned Node, committed lockfile, `--frozen-lockfile` (**R-BUILD-5**)
- [ ] Hashed assets `immutable`; `index.html` served fresh (**R-BUILD-6**)
- [ ] Deploy from CI only, no laptop deploys (**R-BUILD-7**)
- [ ] Custom domain via CNAME to the host target (**R-BUILD-8**)
- [ ] Per-PR preview deployment (**R-BUILD-9**)
- [ ] Version/health stamp shipped so you know what's live (**R-BUILD-10**)
