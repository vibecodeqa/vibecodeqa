# Playwright

Playwright provides browser automation for end-to-end and smoke testing.

## Upstream references

- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

## What upstream owns

- browser automation APIs
- locator guidance
- test isolation practices

## What VCQA owns

- E2E smoke coverage by deployable app shape.
- artifact and failure-report expectations.

## Detection signals

- `@playwright/test` dependency
- `playwright.config.*`
- `e2e` or `tests` browser specs

## Composed standards

- [React SPA](../stacks/react-spa.md)

## Combination-born guidelines

- React SPA plus static hosting needs deep-link smoke tests against the built artifact.
- Pages Functions plus frontend needs same-origin API smoke tests in preview.
- Docs KB publishing needs smoke tests for important public routes and search assets.
