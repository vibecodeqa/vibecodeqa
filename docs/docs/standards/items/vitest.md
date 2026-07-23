# Vitest

Vitest is the unit, integration, and contract-test runner used where VCQA stacks need fast
TypeScript-adjacent checks. This item records expected test surfaces and CI glue, not a
complete testing philosophy.

## Upstream references

- [Vitest Guide](https://vitest.dev/guide/)
- [Vitest configuration](https://vitest.dev/config/)
- [Coverage](https://vitest.dev/guide/coverage.html)
- [Mocking](https://vitest.dev/guide/mocking.html)
- [Test projects](https://vitest.dev/guide/projects.html)

## What upstream owns

- runner, worker, and project configuration
- assertion, fixture, snapshot, and mocking APIs
- coverage providers and reporting mechanics
- environment support such as Node, jsdom, and browser mode

## VCQA-owned rule surface

- **TEST-SCRIPT:** composed stacks declare a repeatable `test` or stack-specific CI command
  that runs Vitest without watch mode.
- **TEST-BOUNDARY:** route guards, schema parsers, SDK contracts, action inputs, and D1
  migration helpers have focused tests where the composed stack depends on them.
- **TEST-ENV:** `environment`, setup files, fake timers, and mocks match the runtime being
  simulated and do not hide Worker/browser/Node boundary mistakes.
- **TEST-COVERAGE:** coverage thresholds and include/exclude patterns apply to owned source;
  generated files and fixtures are excluded intentionally.
- **TEST-DRIFT:** contract or generated-code tests fail when public types, OpenAPI clients,
  or runtime schemas drift from checked-in sources.

## Detection signals

- `vitest` dependency
- `vitest.config.*`
- `vite.config.*` with a `test` block
- `vitest.workspace.*`
- `*.test.ts` or `*.spec.ts` files
- coverage configuration or CI jobs invoking `vitest`

## Composed standards

- [React SPA](../stacks/react-spa.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)

## Combination-born examples

- React SPA plus Vitest should cover route guards and boundary parsing without relying only on E2E tests.
- SDK plus Vitest needs consumer-facing contract tests, not only internal unit tests.
- D1 migrations plus Vitest can run local apply/query checks before deployment.
- GitHub Action packages plus Vitest need input parsing and side-effect guards tested outside
  a live workflow.
