# Playwright

Playwright provides browser automation for deployed and built-artifact smoke tests. VCQA
uses this item for route, auth, deployment, and artifact checks that unit tests cannot prove.

## Upstream references

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Test configuration](https://playwright.dev/docs/test-configuration)
- [Locators](https://playwright.dev/docs/locators)
- [Test isolation](https://playwright.dev/docs/browser-contexts)
- [Trace viewer](https://playwright.dev/docs/trace-viewer)
- [Continuous integration](https://playwright.dev/docs/ci)

## What upstream owns

- browser automation APIs and browser install/runtime behavior
- locator, assertion, and auto-waiting guidance
- test isolation, retries, projects, traces, screenshots, and reports

## VCQA-owned rule surface

- **E2E-SMOKE:** deployable browser stacks have a small smoke suite covering key public
  routes, deep links, auth-gated UX, and same-origin API reachability where applicable.
- **E2E-ARTIFACT:** tests run against the built preview or production-like artifact, not only
  a dev server, when the stack standard is about deployability.
- **E2E-LOCATOR:** selectors use user-visible locators or explicit test IDs for durable
  product contracts; brittle CSS/XPath selectors are findings for core flows.
- **E2E-ISOLATION:** tests do not depend on prior test state, third-party live services, or
  shared tenant data unless the stack explicitly marks the scenario as external smoke.
- **E2E-REPORT:** CI keeps traces, screenshots, videos, or HTML reports for failed browser
  runs when the workflow uses Playwright as a release gate.

## Detection signals

- `@playwright/test` dependency
- `playwright.config.*`
- `e2e` or `tests` browser specs
- CI jobs invoking `playwright test`
- artifacts such as `playwright-report`, traces, screenshots, or videos

## Composed standards

- [React SPA](../stacks/react-spa.md)

## Combination-born examples

- React SPA plus static hosting needs deep-link smoke tests against the built artifact.
- Pages Functions plus frontend needs same-origin API smoke tests in preview.
- Docs KB publishing needs smoke tests for important public routes and search assets.
- Tenant-deployed Cloudflare SaaS needs smoke coverage that proves tenant aliases and public
  routes resolve to the expected environment without sharing private data.
