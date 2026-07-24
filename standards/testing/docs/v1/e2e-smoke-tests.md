# E2E smoke tests

## R-E2E-1 - Deployable apps have built-artifact smoke tests

**Rule.** A deployable app must have at least one E2E smoke test that runs against the
built artifact or production-like preview, not only the development server.

**Why.** Dev servers hide build, asset, routing, environment, and bundling failures. Smoke
tests should prove the shape users actually load.

**vcqa.** Flag app repos with build/deploy workflows but no Playwright or equivalent smoke
test that serves the built artifact or preview deployment.

**References.**

- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

## R-SMOKE-1 - Critical flow smoke tests are minimal and stable

**Rule.** E2E smoke tests must cover the smallest set of critical user or operator flows
needed to detect a broken deploy.

**Why.** A smoke suite that tries to test everything becomes slow and flaky. A smoke suite
that tests nothing important cannot protect production.

**vcqa.** Flag E2E suites that have no critical flow assertions, rely only on homepage
load, or contain broad fragile journeys better suited to lower-level tests.

**References.**

- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

## R-E2E-2 - Routing and direct entry are covered where relevant

**Rule.** Browser apps with routing must include direct-entry or refresh tests for at
least one non-root route.

**Why.** Click-through tests can pass while direct links and browser refreshes 404 after
deployment.

**vcqa.** Flag routed browser apps whose E2E tests never call `page.goto` on a non-root
route or reload a deep route.

**References.**

- Playwright Best Practices: <https://playwright.dev/docs/best-practices>

