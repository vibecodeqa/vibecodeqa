# 7 · PWA & assets

A static SPA is only as good as the bytes it ships and the way the browser caches them.
This page covers the optional-but-house-default service worker (`vite-plugin-pwa`) and its
correctness traps — a stale worker that pins an old build is the worst failure a static app
can have — plus the asset hygiene that keeps caching safe: content-hashed filenames, sized
media, self-hosted fonts.

## Rules

### R-PWA-1 · Service worker via `vite-plugin-pwa`, not hand-rolled

**Rule.** If the app is installable/offline-capable it uses **`vite-plugin-pwa`** to
generate the service worker and manifest. A hand-written `sw.js` registered directly is a
finding.

**Why.** A correct service worker is hard: precache manifests must be regenerated on every
build with the new hashed filenames, and Workbox handles the routing/cleanup that a
hand-rolled worker gets wrong. `vite-plugin-pwa` wires the precache list to Vite's actual
output so the worker and the build never disagree. The PWA is optional for this archetype,
but when present this is how it is built.

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({ registerType: 'autoUpdate', /* … */ }),
  ],
});
```

**vcqa.** If a service worker exists, `vite-plugin-pwa` is in `devDependencies` and
`VitePWA(...)` is in the plugin list; flag a raw `navigator.serviceWorker.register('/sw.js')`
against a hand-authored worker.

### R-PWA-2 · `registerType: 'autoUpdate'`, never a manual prompt left unhandled

**Rule.** The plugin is configured with `registerType: 'autoUpdate'`. If instead
`registerType: 'prompt'` is used, the app **must** wire the update prompt (`useRegisterSW`)
to actually apply the waiting worker.

**Why.** The signature static-PWA bug is "the site serves last deploy forever": a new build
ships, but the old service worker keeps answering from its precache and the waiting worker
never activates, so users are pinned to stale JS until they manually clear storage.
`autoUpdate` takes the new worker live on the next navigation. `prompt` is valid only when
the app renders and handles the update UI — a `prompt` config with no handler is the bug.

```ts
// ✅ house default — new build goes live automatically
VitePWA({ registerType: 'autoUpdate' })

// ❌ prompt mode with nothing calling updateSW() → stale build pinned forever
VitePWA({ registerType: 'prompt' })   // and no useRegisterSW() anywhere
```

**vcqa.** `registerType: 'autoUpdate'` present; OR `registerType: 'prompt'` **with** a
`useRegisterSW`/`onNeedRefresh` handler in source. `prompt` with no handler = finding.

### R-PWA-3 · `skipWaiting` + `clientsClaim` so the new worker takes over

**Rule.** The generated worker calls `skipWaiting` and `clientsClaim` (the plugin's Workbox
defaults under `autoUpdate`), and `cleanupOutdatedCaches: true` is set so old precaches are
purged.

**Why.** Without `skipWaiting`/`clientsClaim` a freshly installed worker sits in `waiting`
until every tab closes — on a long-lived SPA that can be days, extending the stale-build
window. `cleanupOutdatedCaches` deletes precaches keyed to previous hashed filenames so
storage doesn't grow unbounded across deploys.

```ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
  },
})
```

**vcqa.** Workbox config has `skipWaiting`/`clientsClaim` (or relies on the `autoUpdate`
default) and `cleanupOutdatedCaches: true`; a `prompt` build that disables skipWaiting must
own the activation.

### R-PWA-4 · Precache globs cover the real asset types

**Rule.** `workbox.globPatterns` includes every extension the build actually emits — at
minimum `js,css,html`, plus the image/font/media types the app ships (`svg,png,webp,woff2`
…). The default `{js,css,html}` is a finding if the app also serves fonts or images it wants
offline.

**Why.** Anything not matched by a glob is not precached; offline loads then fail for those
assets, or the worker serves a half-cached shell (HTML + JS but no fonts/images). The glob
list is the contract for what "works offline" means, so it must match the emitted output.

```ts
workbox: {
  globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
}
```

**vcqa.** `globPatterns` present and its extension set is a superset of the asset types in
`dist/assets/`; a glob of only `{js,css,html}` alongside shipped fonts/images = finding.

### R-PWA-5 · Manifest `start_url` and `scope` match the deploy path prefix

**Rule.** The web app manifest's `start_url` and `scope` are **relative** (`.` / `./`) or
match the exact path prefix the app is deployed under; they are not hard-coded to `/`.

**Why.** This ties directly to the relative-base rule (R-SETUP-6). A static SPA served at
`example.com/app/` with a manifest `start_url: '/'` launches the installed PWA at the domain
root — a 404 or the wrong app. A relative `start_url`/`scope` resolves under any prefix, and
the service worker's control scope matches where the assets actually live.

```json
// ✅ resolves under any path prefix
{ "start_url": ".", "scope": "./" }

// ❌ breaks when the app is served under /app/
{ "start_url": "/", "scope": "/" }
```

**vcqa.** Manifest `start_url`/`scope` are relative or equal the known deploy prefix; an
absolute `/` on a path-prefixed target = finding. Cross-check against `base` in the Vite
config.

### R-PWA-6 · Icons: 192 and 512, plus a maskable variant

**Rule.** The manifest declares at least a **192×192** and a **512×512** PNG icon, and at
least one icon has `"purpose": "maskable"`.

**Why.** These sizes are the install/splash-screen minimum across Android/Chrome; omitting
them makes the app non-installable or gives a blurry launcher icon. A maskable icon with
safe-zone padding prevents the platform from cropping the logo into a circle/squircle badly.

```json
"icons": [
  { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" },
  { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" },
  { "src": "icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
]
```

**vcqa.** Manifest has icons at `192x192` and `512x512`; at least one `purpose` contains
`maskable`.

### R-PWA-7 · Versioned assets are imported through the bundler (content-hashed)

**Rule.** Images, fonts, and other versioned assets are **imported in source** (`import
logo from './logo.svg'`) or referenced from `src/` so Vite emits them with a content hash
(`logo-a1b2c3.svg`). Assets that change between deploys are **not** dropped in `public/` and
referenced by a stable unhashed path.

**Why.** A content hash in the filename makes the URL change whenever the bytes change, so a
long `Cache-Control: immutable` is safe and cache-busting is automatic. An unhashed
`public/logo.svg` on an immutable cache serves the old bytes after a deploy — the same
stale-asset class of bug as the stale service worker. `public/` is only for files that must
keep a fixed name (`robots.txt`, `favicon.ico`, a manifest referenced by URL).

```tsx
// ✅ hashed, cache-bust-safe
import hero from './assets/hero.webp';
<img src={hero} width={1200} height={630} alt="…" />

// ❌ unhashed public path for a versioned asset → stale after redeploy
<img src="/hero.webp" />
```

**vcqa.** Versioned images/fonts are imported from `src/` (appear hashed in `dist/assets/`);
flag `public/`-hosted images/fonts referenced by stable path that aren't `favicon`/`robots`/
`manifest`-class files.

### R-PWA-8 · Images are sized and lazy-loaded

**Rule.** `<img>` elements carry intrinsic `width`/`height` (or an aspect-ratio box) and
below-the-fold images use `loading="lazy"`. Modern formats (`.webp`/`.avif`) are preferred
over raw PNG/JPEG for photographic content.

**Why.** An image without dimensions reflows the page when it loads, causing Cumulative
Layout Shift (a Core Web Vitals failure — see R-PERF-*). `loading="lazy"` keeps
off-screen images out of the initial network contention so LCP lands sooner. WebP/AVIF cut
transfer size for the same visual quality.

```tsx
// ✅ reserves space, defers off-screen work
<img src={thumb} width={320} height={180} loading="lazy" alt="…" />

// ❌ no dimensions → layout shift when it loads
<img src={thumb} alt="…" />
```

**vcqa.** `<img>` tags have both `width` and `height` (or an explicit `aspect-ratio`); images
plausibly below the fold set `loading="lazy"`; hero/photo assets use `webp`/`avif`.

### R-PWA-9 · Fonts self-hosted with `font-display: swap` and the critical face preloaded

**Rule.** Custom fonts are **self-hosted** (bundled `woff2`, not fetched from a third-party
CDN at runtime), declared with `font-display: swap`, and the primary face is `<link
rel="preload" as="font">`ed.

**Why.** A static SPA should not depend on a third-party font host at runtime — it adds a
blocking cross-origin request, a privacy leak, and a point of failure the app can't cache.
`font-display: swap` renders text immediately in a fallback instead of an invisible-text
(FOIT) gap. Preloading the critical face starts the download before CSS is parsed, cutting
the render delay.

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2'); /* imported/hashed asset */
  font-display: swap;
}
```

**vcqa.** No `fonts.googleapis.com`/third-party font `<link>` at runtime; `@font-face` blocks
set `font-display: swap`; the primary font has a `rel="preload" as="font"` hint.

### R-PWA-10 · Small, repeated SVGs are inlined or components — not extra requests

**Rule.** Icon-scale SVGs used in the UI are inlined as JSX/components (or a sprite), not
loaded as many individual `<img src="*.svg">` requests; large/rarely-changing artwork stays
an imported (hashed) asset.

**Why.** Each `<img>` SVG is a network round-trip and can't be styled with `currentColor`.
Inlining icons removes the requests, lets them inherit color/size from CSS, and keeps them in
the JS the page already loads. Reserve file-based SVGs for large illustrations where inlining
would bloat the bundle.

```tsx
// ✅ inline icon component — no request, styleable
export const CheckIcon = (p: React.SVGProps<SVGSVGElement>) =>
  <svg viewBox="0 0 24 24" {...p}><path d="…" /></svg>;
```

**vcqa.** Repeated small icons are inline `<svg>`/components or a sprite, not a fan-out of
`<img src="*.svg">`; large illustration SVGs are imported (hashed) assets.

## Checklist

- [ ] Service worker (if any) generated by `vite-plugin-pwa`, not hand-rolled (**R-PWA-1**)
- [ ] `registerType: 'autoUpdate'`, or `prompt` with a real update handler (**R-PWA-2**)
- [ ] `skipWaiting` + `clientsClaim` + `cleanupOutdatedCaches` (**R-PWA-3**)
- [ ] Precache globs cover every shipped asset type (**R-PWA-4**)
- [ ] Manifest `start_url`/`scope` relative — match the deploy prefix (**R-PWA-5**)
- [ ] Icons 192 + 512 + a maskable variant (**R-PWA-6**)
- [ ] Versioned assets imported through the bundler → content-hashed (**R-PWA-7**)
- [ ] Images sized (`width`/`height`) + `loading="lazy"` + modern formats (**R-PWA-8**)
- [ ] Fonts self-hosted, `font-display: swap`, critical face preloaded (**R-PWA-9**)
- [ ] UI SVGs inlined/components, not a fan-out of requests (**R-PWA-10**)
