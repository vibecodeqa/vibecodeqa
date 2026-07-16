# 10 · Testing

A static SPA has no server to catch a bad deploy — the browser is the only runtime, and the
user is the one who finds the bug. Tests are the safety net. The house stack is **Vitest**
for unit/component tests, **Testing Library** for behaviour-level component tests, and
**Playwright** for end-to-end runs against the real built app. Every gate runs in CI on every
PR and blocks merge.

## Rules

### R-TEST-1 · Vitest is the unit/component runner

**Rule.** The test runner is **Vitest**, sharing the Vite config and plugin pipeline. A Vite
app does not add Jest.

**Why.** Vitest resolves the same `vite.config.ts` (aliases, `base`, `import.meta.env`, the
React plugin, Tailwind), so tests transform code the way the bundle does. Jest runs a second,
divergent toolchain (its own transformer, module resolver, ESM quirks) — the classic "passes
in Jest, breaks in the build" gap, plus duplicated config to keep in sync.

```jsonc
// package.json (web) — the target
"devDependencies": {
  "vitest": "^3",
  "@testing-library/react": "^16",
  "@testing-library/jest-dom": "^6",
  "jsdom": "^25"
}
```

**vcqa.** `vitest` present; `jest`/`babel-jest`/`ts-jest` **absent**; a `test` script invokes
`vitest`; Vitest config reuses the Vite config (root `vite.config.ts` with a `test` block, or
`vitest.config.ts` that imports it).

### R-TEST-2 · Test behaviour through Testing Library, not implementation

**Rule.** Component tests use **@testing-library/react** and query by accessible role, label,
or text (`getByRole`, `getByLabelText`, `findByText`) — not by test-id-everywhere, CSS class,
component internals, or state. No shallow rendering, no `enzyme`.

**Why.** A static SPA's only contract with the user is the rendered, accessible DOM. Tests
pinned to internals (a hook's state, a private method, a class name) break on every refactor
while missing real regressions; role/label queries assert what the user actually perceives and
double as an accessibility check (R-TEST-8). Shallow rendering asserts a component tree that
never runs the way it ships.

```tsx
// ✅ behaviour: query the accessible DOM, interact like a user
render(<LoginForm />);
await userEvent.type(screen.getByLabelText(/email/i), 'a@b.co');
await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
expect(await screen.findByRole('alert')).toHaveTextContent(/invalid/i);

// ❌ implementation: reaches into internals, asserts nothing the user sees
expect(wrapper.find('LoginForm').state('error')).toBe(true);
```

**vcqa.** `@testing-library/react` present; `enzyme`/`react-test-renderer` shallow usage
**absent**; component tests favour `getByRole`/`getByLabelText`/`getByText` over `getByTestId`
and over `container.querySelector`.

### R-TEST-3 · Mock the network at the boundary with MSW

**Rule.** Tests that hit an external API or platform SDK intercept at the **network boundary**
with **MSW** (Mock Service Worker) — they do not monkey-patch `fetch`, stub the data-fetching
hook, or replace the API client module.

**Why.** Data in this archetype comes from outside the app (R-DATA-*). Mocking at the
transport layer exercises the real request-building, serialization, error-mapping, and
caching code; stubbing an internal module skips exactly the code most likely to be wrong and
rots when the internals move. One MSW handler set also serves both Vitest and Playwright.

```ts
// ✅ intercept the request itself
server.use(
  http.get('/api/todos', () => HttpResponse.json([{ id: '1', title: 'x' }])),
);

// ❌ stubbing the app's own module — the real fetch code never runs
vi.mock('../api/client', () => ({ getTodos: () => Promise.resolve([]) }));
```

**vcqa.** `msw` present; test setup starts a `setupServer`/worker; `vi.mock` of the app's own
API/fetch modules and hand-rolled `global.fetch = vi.fn()` are the exception, not the pattern.

### R-TEST-4 · Test loading and error states, not just the happy path

**Rule.** For every async view, tests assert the **loading**, **success**, and **error**
(and where relevant **empty**) states — driven by MSW responses, including a failing/`500`
and a delayed response.

**Why.** In a serverless SPA every network call can fail in the user's browser (offline, CORS,
5xx, expired token) and there is no server-rendered fallback to hide behind. Untested error
and loading branches are where SPAs show a blank screen or a spinner that never resolves.

**vcqa.** Component/integration tests for async views include at least one error-path case
(MSW handler returning an error) and assert a visible loading indicator; not solely happy-path
`200` assertions.

### R-TEST-5 · Playwright drives the real built app end-to-end

**Rule.** End-to-end tests live in `web/e2e` with a `playwright.config.ts`, and run against
the **production build** served by `vite preview` (or the built `dist/`), not the dev server.

**Why.** Dev-server behaviour diverges from the shipped bundle: minification, asset hashing,
the relative `base` (R-BUILD-2), code-splitting boundaries, and env inlining only exist in the
build. E2E against `vite preview` is the closest thing to what the user loads; it's the gate
that catches "works in dev, blank in prod".

```ts
// playwright.config.ts — build, then serve the real output
export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'pnpm build && pnpm preview --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**vcqa.** `@playwright/test` present; `playwright.config.ts` exists with `testDir` under
`web/e2e`; `webServer.command` runs `build`+`preview` (not `dev`).

### R-TEST-6 · Deep-link and refresh are covered by e2e

**Rule.** At least one Playwright test **navigates directly to a non-root route** (e.g.
`page.goto('/settings/profile')`) and one **reloads on a deep route**, asserting the app
renders that view rather than a 404.

**Why.** This guards the SPA-fallback contract (R-BUILD-3) end-to-end. Client-side routing
makes deep links work only if the host serves `index.html` for unknown paths; a
click-through-only e2e suite passes even when a direct hit or refresh 404s in production. This
is the single most common SPA hosting regression and needs an explicit test.

```ts
// ✅ direct hit + reload must render the route, not 404
await page.goto('/settings/profile');
await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
await page.reload();
await expect(page.getByRole('heading', { name: /profile/i })).toBeVisible();
```

**vcqa.** An e2e spec calls `page.goto` on a non-root path and/or `page.reload()` on a deep
route and asserts real content; not exclusively root-then-click navigation.

### R-TEST-7 · Offline / failed-API states are exercised end-to-end

**Rule.** Playwright covers at least one degraded-network path — an aborted or `500` API
response (via `page.route(...)`) and/or `context.setOffline(true)` — asserting the app shows a
recoverable error UI, not a crash or infinite spinner.

**Why.** A static client cannot assume its data provider is reachable; the browser is hostile
and networks fail. E2E is where you prove the real error boundary and retry UI actually render
against the real bundle, not just in a jsdom unit test.

```ts
// ✅ force the API to fail and assert graceful degradation
await page.route('**/api/**', (r) => r.fulfill({ status: 500 }));
await page.goto('/');
await expect(page.getByRole('alert')).toContainText(/try again/i);
```

**vcqa.** An e2e spec uses `page.route` to fail/abort an API call or `setOffline(true)` and
asserts an error/retry UI; the app is not assumed always-online in e2e.

### R-TEST-8 · Accessibility assertions are wired into the suite

**Rule.** Automated a11y checks run in tests — **axe** in component tests (`jest-axe` /
`vitest-axe`) and/or `@axe-core/playwright` in e2e — asserting no violations on key views.

**Why.** Accessibility (see the A11Y page) regresses silently; a scanner catch in CI is cheaper
than a manual audit. Role-based Testing Library queries already lean on the accessibility tree,
and an axe pass turns that into an enforced gate on contrast, labels, and ARIA misuse.

```ts
// ✅ fail the test on any axe violation
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations).toEqual([]);
```

**vcqa.** `jest-axe`/`vitest-axe` or `@axe-core/playwright` present and invoked with a
zero-violations assertion on at least the primary views.

### R-TEST-9 · A meaningful coverage floor on logic

**Rule.** Coverage is collected (`vitest --coverage`) and a floor is enforced on **logic**
modules (data mapping, validation, hooks, utils) — a realistic threshold (e.g. 80% of that
code), not a repo-wide vanity 100%.

**Why.** Untested transform/validation code is where silent data corruption hides in a client
app. A floor keeps coverage from eroding PR by PR; scoping it to logic (excluding generated
files, config, pure-presentational leaves) keeps the number honest instead of gamed with
shallow render snapshots.

```jsonc
// vitest coverage — enforce, and scope to logic
"coverage": {
  "provider": "v8",
  "thresholds": { "lines": 80, "functions": 80, "branches": 70 },
  "exclude": ["**/*.stories.tsx", "**/main.tsx", "e2e/**"]
}
```

**vcqa.** Coverage config present with non-zero `thresholds`; a coverage step runs in CI; the
threshold is not trivially `0` and not a suspicious blanket `100`.

### R-TEST-10 · The test gate runs in CI and blocks merge

**Rule.** A GitHub Actions workflow runs, on every PR, **typecheck + unit/component +
e2e**, and merge is blocked on their success (required status checks). Tests are not
laptop-only.

**Why.** No-laptop-deploys (R-BUILD-7) is only real if the same gate that guards deploys guards
merges. Typecheck belongs in the gate because `tsc` catches the whole class of shape bugs a
static app otherwise ships to the user (cross-ref R-SETUP-7). A green local run that never runs
in CI protects nobody.

```yaml
# .github/workflows/ci.yml — the gate
- run: pnpm install --frozen-lockfile
- run: pnpm typecheck            # part of the test gate
- run: pnpm test --coverage      # vitest
- run: pnpm exec playwright install --with-deps
- run: pnpm e2e                  # playwright against the build
```

**vcqa.** A CI workflow runs `typecheck`, `vitest`, and Playwright on `pull_request`; the repo
declares these as required checks; e2e installs browsers and runs against the build.

## Checklist

- [ ] Vitest is the runner, sharing Vite config; no Jest (**R-TEST-1**)
- [ ] Testing Library by role/label; no shallow rendering or internals (**R-TEST-2**)
- [ ] Network mocked at the boundary with MSW, not internal stubs (**R-TEST-3**)
- [ ] Loading + success + error states all tested (**R-TEST-4**)
- [ ] Playwright e2e in `web/e2e` against the built app (**R-TEST-5**)
- [ ] Deep-link + refresh on a route covered by e2e (**R-TEST-6**)
- [ ] Offline / failed-API states exercised end-to-end (**R-TEST-7**)
- [ ] axe accessibility assertions in component and/or e2e tests (**R-TEST-8**)
- [ ] Coverage collected with a meaningful floor on logic (**R-TEST-9**)
- [ ] Typecheck + unit + e2e run in CI and block merge (**R-TEST-10**)
