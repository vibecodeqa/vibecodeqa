# 3 · Structure & routing

How the source tree is organized and how the app moves between views. A static SPA has no
router on a server — every navigation happens in the browser, in JavaScript that already
shipped. That single fact drives every routing rule here: routing is client-side, views are
code-split, and a deep link only works because the *host* is told to fall back to
`index.html`. The structure rules keep the tree navigable as the app grows so those routing
boundaries stay clean.

## Rules — structure (`STRUCT`)

### R-STRUCT-1 · Feature-colocated layout under `src/`

**Rule.** Source is organized by feature/domain (a folder owns its components, hooks, and
helpers together), not by technical kind (`components/`, `hooks/`, `utils/` mega-folders
that each hold the whole app).

**Why.** In a client app all code ships to the browser, so the tree is also the map of what
loads together. Colocating a feature keeps a code-split boundary (see R-ROUTE-4) aligned
with a folder, makes deletion safe, and stops the cross-folder import sprawl that defeats
tree-shaking.

```
src/
├─ features/
│  ├─ dashboard/  { Dashboard.tsx, useMetrics.ts, MetricCard.tsx, Dashboard.test.tsx }
│  └─ settings/   { Settings.tsx, useSettings.ts }
├─ shared/        { Button.tsx, formatDate.ts }   # genuinely cross-feature only
├─ App.tsx
└─ main.tsx
```

**vcqa.** `src/` shows feature/domain folders that mix component + hook + test, rather than
only top-level `components/`+`hooks/`+`utils/` buckets holding the entire app.

### R-STRUCT-2 · One component per file, named exports

**Rule.** Each `.tsx` file exports one component as a **named** export; no `default export`
for components, no multiple sibling components sharing a file.

**Why.** Named exports give every component one grep-able, rename-safe identity — default
exports let each importer pick a different local name and hide the symbol from tooling. One
component per file keeps the file's identity equal to its name, which is what makes a
code-split `React.lazy(() => import('./View'))` boundary predictable.

```tsx
// ❌ default + two components in one file
export default function Panel() { /* ... */ }
function PanelHeader() { /* ... */ }

// ✅ one named component per file
export function Panel() { /* ... */ }
```

!!! note
    `React.lazy` needs a default export at the split point specifically. Keep the component
    a named export and add a thin `export default X` **only** on the lazily-imported view
    module, or use `.then(m => ({ default: m.View }))` in the `lazy()` call.

**vcqa.** `.tsx` component files use named exports; flag multiple component declarations per
file and `export default function` for ordinary (non-lazy-target) components.

### R-STRUCT-3 · Separate presentational from data-touching components

**Rule.** Components that fetch/subscribe/mutate data are distinct from components that only
render props; a leaf UI component takes data via props and does no `fetch`/SDK calls.

**Why.** Mixing I/O into a presentational leaf makes it un-testable without a network, un-
reusable across screens, and a hidden source of duplicate requests. In a static app the
data layer is the only moving part — isolating it keeps the render tree pure and keeps the
fetch/cache rules (see [State & data](state-and-data.md)) in one place.

```tsx
// ✅ container touches data, leaf is pure
function UserBadgeContainer({ id }: { id: string }) {
  const user = useUser(id);          // data
  return <UserBadge name={user.name} />;
}
function UserBadge({ name }: { name: string }) {
  return <span className="badge">{name}</span>;   // pure render
}
```

**vcqa.** Leaf/presentational components (those under `shared/` or named `*Card`/`*Badge`/
`*Row`, etc.) contain no `fetch`/SDK-client calls; data access lives in hooks or container
components.

### R-STRUCT-4 · File-size discipline

**Rule.** A component file that exceeds roughly **250 lines** is a smell to split; no
component file over ~400 lines.

**Why.** An oversized component is usually several components and several responsibilities
fused together — it can't be code-split, is hard to test, and re-renders more than it
should. Splitting restores clean boundaries the router and bundler can act on.

**vcqa.** Flag `.tsx` files whose length exceeds the threshold; treat >400 lines as a
finding, 250–400 as a warning.

### R-STRUCT-5 · `main.tsx` is a thin entry

**Rule.** The entry file only creates the root, mounts the tree in `StrictMode`, and imports
global CSS — no business logic, data fetching, or view code lives there.

**Why.** The entry is the one module that always loads first and can never be code-split.
Any logic placed there ships to every user on first paint and can't be lazy-loaded. Keeping
it thin keeps the initial bundle minimal, which is the whole point of a static SPA's fast
first load.

```tsx
// src/main.tsx — nothing but wiring
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
```

**vcqa.** `main.tsx` contains only root creation + render + CSS import; flag `fetch`, route
definitions, or component bodies declared in the entry file.

### R-STRUCT-6 · Colocate tests with source

**Rule.** Unit/component tests live next to the code they cover (`Dashboard.test.tsx`
beside `Dashboard.tsx`), not in a distant mirror `__tests__` tree; end-to-end specs stay in
a top-level `e2e/`.

**Why.** A colocated test moves, renames, and deletes with its subject, so coverage tracks
reality instead of rotting in a parallel tree. (Playwright e2e is different — it exercises
the built app across features, so it belongs outside `src/`; see [Testing](testing.md).)

**vcqa.** Component/unit tests sit beside their source under `src/`; Playwright specs live
in `e2e/`.

## Rules — routing (`ROUTE`)

### R-ROUTE-1 · Routing is client-side only — no server render step

**Rule.** All routing happens in the browser; there is **no** server-side render, no
framework/SSR route loader, no per-request server that produces HTML for a route.

**Why.** This is the archetype's defining line, applied to navigation. The app ships one
static `index.html` plus JS; the router decides what to show by reading `location` in the
browser and swapping components. The moment a route needs a server to render it, the project
is a `react-ssr` app under a different standard. Everything else in this section assumes
this rule holds.

```tsx
// ✅ SPA data router — resolves entirely in the browser
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
const router = createBrowserRouter(routes);   // no server loader step
export function App() { return <RouterProvider router={router} />; }
```

!!! warning
    Do **not** use `react-router`'s framework/SSR mode, `renderToString`, Next.js, Remix,
    or any `entry.server` file. Any of those means server rendering — not this archetype.

**vcqa.** No `next`/`remix`/`@react-router/dev` framework deps; no `renderToString`/
`renderToPipeableStream`/`entry.server.*`; routing resolves from `window.location` in the
client bundle.

### R-ROUTE-2 · No router for a single view

**Rule.** An app with one meaningful view does **not** pull in a routing library; a hand-
rolled `useState` view switch is the house default for small consoles.

**Why.** A router is weight and indirection you only earn by having multiple deep-linkable
views. For a single-screen console, `useState` switching between panels is simpler, smaller
in the bundle, and has nothing to misconfigure. Adding `react-router-dom` "just in case" is
premature and ships dead code to every user.

```tsx
// ✅ single-view console — no router needed
const [tab, setTab] = useState<'metrics' | 'settings'>('metrics');
return tab === 'metrics' ? <Metrics /> : <Settings />;
```

**vcqa.** Repos with one view and no deep-linking needs should not depend on
`react-router-dom`; a router dependency with a single route is a warning.

### R-ROUTE-3 · Multi-view uses `react-router-dom` v7 in data-router mode

**Rule.** When the app genuinely has multiple deep-linkable views, routing uses
`react-router-dom` **v7** via `createBrowserRouter` + `RouterProvider` — not the legacy
`<BrowserRouter>`/`<Routes>` element tree, and not its SSR/framework mode.

**Why.** The data-router API (`createBrowserRouter`) is the current, forward-compatible
surface: it supports lazy routes, per-route error boundaries, and loaders that run **in the
browser**. Using it in SPA mode keeps every benefit of v7 while staying fully client-side
per R-ROUTE-1.

```tsx
const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/reports/:id', element: <Report />, errorElement: <RouteError /> },
]);
```

**vcqa.** Multi-view repos depend on `react-router-dom@^7` and construct routes with
`createBrowserRouter`; flag legacy `<BrowserRouter><Routes>` as the primary router and flag
any framework-mode/SSR entry.

### R-ROUTE-4 · Route-based code splitting

**Rule.** Non-initial routes are loaded with `React.lazy` + dynamic `import()` and wrapped
in `<Suspense>`; the whole app is not one eager bundle.

**Why.** A static SPA's first paint is gated by how much JS must download before anything
renders. Splitting per route means a user who lands on `/` never downloads the `/reports`
code. `Suspense` gives that lazy chunk a defined loading state instead of a stall.

```tsx
const Reports = React.lazy(() => import('./features/reports/Reports'));
// ...
{ path: '/reports', element: (
    <Suspense fallback={<RouteSpinner />}><Reports /></Suspense>
  ) }
```

**vcqa.** Route element modules are imported via `React.lazy(() => import(...))` and wrapped
in `<Suspense>`; an app with several routes and zero dynamic `import()` is a finding.

### R-ROUTE-5 · Never a blank screen — always a loading/error state

**Rule.** Every lazy boundary has a `Suspense` fallback and every data-bearing route has an
error boundary (`errorElement` or an `<ErrorBoundary>`); a failed chunk or fetch renders a
message, not a white page.

**Why.** With no server to render a fallback, an unhandled lazy-chunk failure or thrown
render leaves the user staring at blank `#root`. A static app must degrade visibly — a
spinner while loading, a retry/error card when a chunk 404s (common right after a deploy
swaps hashed filenames).

**vcqa.** Each `Suspense` supplies a non-null `fallback`; routes that load data declare an
`errorElement`/error boundary; flag `Suspense` with no fallback and route trees with no
error boundary.

### R-ROUTE-6 · Deep links require the SPA fallback

**Rule.** `BrowserRouter`/`createBrowserRouter` (clean-path) routing is only used when the
host serves `index.html` for unknown paths; the repo must not assume the server resolves
`/reports/42` to a file.

**Why.** With clean paths, hitting `/reports/42` directly asks the host for a file that
doesn't exist on disk — only the SPA fallback (host rewrites unknown paths to `index.html`)
lets the client router take over. This is a **hosting** requirement, defined once as
**R-BUILD-3** in [Build & hosting](build-and-hosting.md); this rule just binds clean-path
routing to it. Verify the fallback config ships in the repo (`_redirects`, host worker
rule, etc.).

**vcqa.** A repo using `createBrowserRouter`/clean paths ships an SPA-fallback config
(cross-check R-BUILD-3); browser-history routing with no fallback config is a finding.

### R-ROUTE-7 · Hash routing only as a fallback of last resort

**Rule.** `createHashRouter`/`HashRouter` is used only when the host genuinely cannot serve
an `index.html` fallback; it is not the default choice.

**Why.** Hash routing (`/#/reports/42`) sidesteps the fallback problem because the server
never sees the path after `#` — so deep links work anywhere, even dumb static hosts. But it
costs clean URLs, hurts analytics/SEO, and complicates scroll/anchor behavior. Prefer clean
paths + the SPA fallback (R-ROUTE-6); reach for hash routing only when no fallback is
possible.

**vcqa.** `createHashRouter`/`HashRouter` present without a documented reason (a host that
can't do fallback) is a warning; it should be the exception, not the default.

## Checklist

- [ ] Feature-colocated `src/` layout (**R-STRUCT-1**)
- [ ] One component per file, named exports (**R-STRUCT-2**)
- [ ] Presentational components take data via props; I/O in containers/hooks (**R-STRUCT-3**)
- [ ] Component files under the size threshold (**R-STRUCT-4**)
- [ ] `main.tsx` is a thin entry — wiring only (**R-STRUCT-5**)
- [ ] Unit tests colocated; e2e in `e2e/` (**R-STRUCT-6**)
- [ ] Routing is client-side only; no server render step (**R-ROUTE-1**)
- [ ] No router for a single-view app; `useState` switch instead (**R-ROUTE-2**)
- [ ] Multi-view uses `react-router-dom` v7 `createBrowserRouter` (SPA mode) (**R-ROUTE-3**)
- [ ] Route-based code splitting with `React.lazy` + `Suspense` (**R-ROUTE-4**)
- [ ] Always a loading/error state — never a blank screen (**R-ROUTE-5**)
- [ ] Clean-path routing paired with the SPA fallback (**R-ROUTE-6**, see **R-BUILD-3**)
- [ ] Hash routing only where a fallback is impossible (**R-ROUTE-7**)
