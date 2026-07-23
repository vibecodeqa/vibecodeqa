# Vite

Vite is the frontend build tool and dev server used by many browser apps.

## Upstream references

- [Vite Guide](https://vite.dev/guide/)
- [Deploying a Static Site](https://vite.dev/guide/static-deploy)

## What upstream owns

- dev server and production build behavior
- static deployment mechanics
- environment variable loading semantics

## What VCQA owns

- build artifact expectations.
- client environment-variable boundary.
- static hosting fit.

## Detection signals

- `vite` dependency
- `vite.config.*`
- `npm run build` invoking `vite build`

## Composed standards

- [React SPA](../stacks/react-spa.md)

## Combination-born guidelines

- Vite plus static hosting means `base` must match deploy path expectations.
- Vite plus client config means `VITE_*` values are public and must not contain secrets.
- Vite plus Cloudflare Pages requires build output and Functions assembly to deploy together.
