# React Router

React Router provides route matching, navigation, and route organization for React apps.

## Upstream references

- [React Router Documentation](https://reactrouter.com/)

## What upstream owns

- routing APIs
- route definitions
- data/framework mode behavior

## What VCQA owns

- SPA fallback expectations.
- route/module organization for static deployments.

## Detection signals

- `react-router` dependency
- route modules or router setup files
- SPA fallback needs in hosting config

## Composed standards

- [React SPA](../stacks/react-spa.md)

## Combination-born guidelines

- React Router plus static hosting requires SPA fallback or hash routing for deep links.
- React Router plus Pages Functions requires route namespaces that do not collide with `/api/*`.
- React Router plus code splitting needs route-level lazy loading rules to keep startup bundles bounded.
