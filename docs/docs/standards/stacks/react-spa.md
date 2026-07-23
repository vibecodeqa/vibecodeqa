# React SPA

**Status:** Authored

Client-rendered React applications built as static files, with no server render step and no server of their own.

## Full rubric

[/standards/react-spa/v1/](/standards/react-spa/v1/)

## Reference implementation

[vibecodeqa/ref-react-spa](https://github.com/vibecodeqa/ref-react-spa) is
the forkable template for this stack. It shows the expected repo shape, CI gates, static
build path, Playwright smoke coverage, and tracked VCQA report without tying the standard
to any product.

## Aliases

- `react-spa-static`

## Scope

Client-rendered React applications built as static files, with no server render step and no server of their own.

## Not in scope

- React SSR or framework-mode apps
- Cloudflare Pages Functions APIs
- native desktop shells

## Composes

- [React](../items/react.md)
- [React Router](../items/react-router.md)
- [Vite](../items/vite.md)
- [TypeScript](../items/typescript.md)
- [Web Accessibility](../items/web-accessibility.md)
- [Web Security](../items/web-security.md)
- [Vitest](../items/vitest.md)
- [Playwright](../items/playwright.md)

## VCQA-owned rule surface

- static SPA boundary.
- client env vars are non-secret only.
- SPA routing fallback.
- build output and asset hygiene.

## Detection signals

- `react` and `react-dom`
- Vite or another static app build tool
- no server/framework runtime dependency
- no `functions/` server slice

## Combination-born guidelines

- `VITE_*` variables are public client configuration, never secrets.
- Deep links require SPA fallback or hash routing because no server route renders them.
- Client auth guards improve UX but do not authorize access to private data.

## Benefits

- vibecodeqa/app web dashboard.
- Cloudflare SaaS example frontend.
