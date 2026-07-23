# Vitest

Vitest is a test runner commonly used in Vite and TypeScript projects.

## Upstream references

- [Vitest Guide](https://vitest.dev/guide/)

## What upstream owns

- runner configuration
- assertion and mocking APIs
- coverage mechanics

## What VCQA owns

- required test layers by stack.
- coverage and CI gate expectations.

## Detection signals

- `vitest` dependency
- `vitest.config.*`
- `*.test.ts` or `*.spec.ts` files

## Composed standards

- [React SPA](../stacks/react-spa.md)
- [TypeScript SDK](../stacks/typescript-sdk.md)

## Combination-born guidelines

- React SPA plus Vitest should cover route guards and boundary parsing without relying only on E2E tests.
- SDK plus Vitest needs consumer-facing contract tests, not only internal unit tests.
- D1 migrations plus Vitest can run local apply/query checks before deployment.
