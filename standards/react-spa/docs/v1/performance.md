# 8 · Performance

For a client-rendered static SPA, performance *is* the JavaScript story: nothing paints until
the bundle downloads, parses, and hydrates in the user's browser. There is no server to
pre-render, so Time-to-Interactive is dominated by the bytes you ship. This page sets a
budget, mandates code splitting, and ties the concrete SPA failure modes to Core Web Vitals —
all measured, not guessed.

## Rules

### R-PERF-1 · An explicit bundle budget, enforced

**Rule.** The repo declares an **initial JS budget** (house target: **≤ 200 KB gzipped** for
the entry chunk) and CI fails when the main bundle exceeds it.

**Why.** Without a number, bundles only grow. The entry chunk is on the critical path — every
kilobyte is download + parse + execute before the app is interactive on a mid-range phone. A
committed budget with a CI gate turns "the app got slow" into a caught regression on the PR
that caused it.

```jsonc
// package.json — one enforceable form
"size-limit": [
  { "path": "dist/assets/index-*.js", "limit": "200 KB" }
]
```

**vcqa.** A budget mechanism is present — `size-limit`/`bundlesize` config, a Vite
`build.chunkSizeWarningLimit` set below the default, or a CI step that measures `dist` size —
and it is wired into CI, not just documented.

### R-PERF-2 · Routes are code-split with `React.lazy` + `Suspense`

**Rule.** Route-level components are loaded with `React.lazy(() => import('./Route'))` behind
a `<Suspense>` boundary, so each route is its own chunk rather than part of the entry bundle.

**Why.** A single monolithic bundle makes the user download every screen to see the first one.
Splitting per route means the initial load ships only the landing view; other routes stream on
navigation. This is the highest-leverage size win in a multi-route SPA.

```tsx
// ✅ each route is a separate chunk
const Dashboard = lazy(() => import('./routes/Dashboard'));

<Suspense fallback={<Spinner />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

**vcqa.** Route components appear in `React.lazy(() => import(...))` calls wrapped by a
`Suspense` boundary; a multi-route app importing every route statically at the top of the
router = finding.

### R-PERF-3 · Split heavy, non-critical dependencies too

**Rule.** Large libraries that aren't needed for first paint — chart engines, rich-text/markdown
editors, date pickers, 3D — are behind a **dynamic `import()`**, loaded when the feature is
used, not at module top level.

**Why.** A charting or editor library can dwarf the rest of the app. If it's imported
statically it lands in the entry chunk even for users who never open that feature. Deferring it
to a dynamic import keeps it off the critical path.

```tsx
// ✅ the chart engine loads only when the chart mounts
const Chart = lazy(() => import('./HeavyChart'));

// ❌ pulls the whole engine into the entry bundle for everyone
import { Chart } from 'heavy-chart-lib';
```

**vcqa.** Known-heavy deps (chart/editor/3D/PDF libraries) are reached via `import()` /
`React.lazy`, not statically imported into a widely-loaded module.

### R-PERF-4 · Import what you use — no barrel/whole-library imports

**Rule.** Imports are specific (`import debounce from 'lodash/debounce'` or a tree-shakeable
named import), never a namespace/whole-library pull (`import _ from 'lodash'`,
`import * as Icons from 'some-icons'`). Prefer libraries that tree-shake; avoid ones that
don't (e.g. non-modular `moment`).

**Why.** A namespace import or a non-tree-shakeable library defeats dead-code elimination — the
whole package ships even if one function is used. `import _ from 'lodash'` alone can add tens of
KB. Icon barrels are a classic trap: one glyph pulls the entire set.

```ts
// ✅ only the function you use is bundled
import debounce from 'lodash-es/debounce';
import { Check } from 'lucide-react';

// ❌ ships the entire library / icon set
import _ from 'lodash';
import * as Icons from 'lucide-react';
```

**vcqa.** No default/namespace import of large utility or icon libraries; date handling avoids
non-tree-shakeable `moment`; icon usage is per-glyph named imports.

### R-PERF-5 · The bundle is analyzable

**Rule.** A bundle visualizer (`rollup-plugin-visualizer`) is wired to the build and runnable
(`pnpm build --mode analyze` or an `analyze` script), so composition can be inspected on demand
or in CI.

**Why.** You can't shrink what you can't see. When the budget (R-PERF-1) trips, the visualizer
is how you find the offending dependency — a duplicated library, an accidental whole-package
import, a heavy transitive dep. Making it a first-class script means anyone can run it.

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';
// plugins: [..., process.env.ANALYZE && visualizer({ gzipSize: true })]
```

**vcqa.** `rollup-plugin-visualizer` (or equivalent) present and reachable via a script/flag;
bonus if CI uploads the treemap as an artifact.

### R-PERF-6 · Render discipline: stable keys, no needless re-renders

**Rule.** Lists use **stable, item-identity keys** (never the array index for reorderable/
mutable lists); components don't create new object/array/function props inline where it forces
children to re-render unnecessarily.

**Why.** Index keys make React mismatch DOM on insert/reorder, corrupting state and hurting
INP. Fresh inline props break referential equality and re-render memoized children every parent
render. These are correctness-and-speed bugs, not micro-optimizations.

```tsx
// ✅ stable identity
{items.map((it) => <Row key={it.id} {...it} />)}

// ❌ index key on a mutable list
{items.map((it, i) => <Row key={i} {...it} />)}
```

**vcqa.** `.map(...)` render loops key by a stable id, not the index, for mutable lists; flag
obvious inline-object props feeding `React.memo` children in hot paths.

### R-PERF-7 · Memoize only where measured — don't cargo-cult

**Rule.** `useMemo` / `useCallback` / `React.memo` are applied to **measured** hot paths
(expensive computes, stable props for memoized children), not wrapped reflexively around every
value and handler.

**Why.** Memoization isn't free — it adds dependency arrays, allocations, and cognitive load,
and wrong deps cause stale bugs. Blanket-memoizing trivial values costs more than it saves and
hides the few places that genuinely need it. React 19's compiler further reduces the need for
manual memoization. Reach for it after a profile shows a problem.

**vcqa.** No wholesale `useMemo`/`useCallback` on trivial primitives/inline handlers with no
measured cost; presence where it guards a genuinely expensive compute or a memoized subtree is
expected, not flagged.

### R-PERF-8 · Virtualize long lists

**Rule.** Lists/tables that can render **hundreds+ rows** are windowed (e.g. `@tanstack/virtual`,
`react-window`) so only visible rows mount, rather than mapping the entire dataset into the DOM.

**Why.** Thousands of live DOM nodes blow up memory, layout, and INP — scrolling janks and
interactions lag. Virtualization keeps the node count bounded regardless of dataset size, which
is the difference between a snappy and an unusable large list on a static SPA with no server
paging.

**vcqa.** Components rendering unbounded/large collections use a virtualization library or
explicit windowing; a raw `.map` over a large fetched array straight into the DOM = finding.

### R-PERF-9 · Debounce/throttle expensive event handlers

**Rule.** High-frequency handlers — search-as-you-type, `resize`, `scroll`, `mousemove` — that
trigger fetches, layout, or heavy compute are **debounced or throttled**, not run on every event.

**Why.** An unthrottled handler firing on every keystroke or scroll frame floods the main thread
(and any external API), tanking INP and, for search, hammering the backing service. Debouncing
the fetch and throttling layout work keeps interactions responsive.

```tsx
// ✅ one fetch after typing settles
const onSearch = useMemo(() => debounce(runSearch, 250), []);
```

**vcqa.** `onChange`/`scroll`/`resize` handlers that fetch or do heavy work are wrapped in a
debounce/throttle; flag a per-keystroke `fetch` on a search input.

### R-PERF-10 · Core Web Vitals targets, with SPA-specific causes handled

**Rule.** The app targets **LCP < 2.5 s**, **CLS < 0.1**, **INP < 200 ms**, and the known SPA
causes are addressed: unsized media (→ CLS) is fixed per R-PWA-8, the entry bundle (→ LCP/INP)
is budgeted and split per R-PERF-1..3.

**Why.** These are the field metrics users and search ranking actually see. In a client-rendered
SPA the causes are specific and controllable: layout shift comes from unsized images/late fonts;
poor LCP/INP comes from an oversized bundle blocking the main thread. Naming the targets makes
"fast enough" checkable.

**vcqa.** Media is sized (cross-ref R-PWA-8), fonts use `swap` + preload (R-PWA-9), the bundle is
budgeted/split (R-PERF-1..3); no layout-shifting ad/embed injected without reserved space.

### R-PERF-11 · Measure with real tools; defer non-critical work

**Rule.** Performance is verified with **Lighthouse** and/or the **`web-vitals`** library
(reporting real field metrics), and non-critical startup work — analytics, non-essential
third-party scripts, prefetch — is deferred off the initial render path.

**Why.** Guessing at performance leads to premature and wrong optimization. A Lighthouse budget
in CI and `web-vitals` reporting from production give the numbers that decide what to fix.
Loading analytics/marketing scripts synchronously at startup steals the main thread from first
paint — defer them (idle, post-load, or dynamic import).

```ts
// ✅ report real field metrics
import { onLCP, onCLS, onINP } from 'web-vitals';
onLCP(send); onCLS(send); onINP(send);
```

**vcqa.** `web-vitals` wired and/or a Lighthouse CI step present; third-party/analytics scripts
are deferred (`async`/`defer`/idle/dynamic-import), not blocking on the critical path.

## Checklist

- [ ] Explicit initial-JS budget, enforced in CI (**R-PERF-1**)
- [ ] Routes code-split via `React.lazy` + `Suspense` (**R-PERF-2**)
- [ ] Heavy non-critical deps behind dynamic `import()` (**R-PERF-3**)
- [ ] Specific imports; no barrel/whole-library pulls (**R-PERF-4**)
- [ ] Bundle visualizer wired and runnable (**R-PERF-5**)
- [ ] Stable list keys; no needless re-render props (**R-PERF-6**)
- [ ] Memoize only where measured (**R-PERF-7**)
- [ ] Long lists virtualized (**R-PERF-8**)
- [ ] Expensive handlers debounced/throttled (**R-PERF-9**)
- [ ] CWV targets (LCP/CLS/INP) with SPA causes handled (**R-PERF-10**)
- [ ] Measured with Lighthouse/`web-vitals`; non-critical work deferred (**R-PERF-11**)
