# Cloudflare Pages Fullstack - Gold Standard

This is the reference standard for one deployable stack shape: a static frontend
co-deployed with Cloudflare Pages Functions.

It exists because none of the upstream sources own the combined seam. React/Vite docs
cover the frontend. Cloudflare docs cover Pages Functions. GitHub Actions docs cover CI.
OWASP covers broad security. VCQA owns the repo-level rules that appear when these are
combined.

## When this standard applies

A repo or slice is `cloudflare-pages-fullstack` when all of these hold:

- a static frontend is built and deployed to Cloudflare Pages
- a `functions/` directory or equivalent Pages Functions configuration exists
- frontend routes and Function routes are deployed together
- API routes are usually same-origin, commonly under `/api/*`
- no separate long-running server is required to serve requests

If the backend is a standalone Worker with no Pages frontend, use a Worker standard. If
the frontend is a pure static SPA with no Functions, use [React SPA](/standards/react-spa/v1/)
or another static frontend standard.

## Editions

| Edition | Targets | Reviewed | Next review due | Status |
| --- | --- | --- | --- | --- |
| [v1](v1/index.md) | Cloudflare Pages Functions + static frontend + TypeScript | 2026-07 | 2027-07 | latest |

## What this standard owns

- the same-origin frontend/API seam
- route namespace discipline
- middleware and authorization placement
- environment-variable and binding boundaries
- typed or schema-validated request/response contracts
- deploy assembly for static assets plus Functions
- preview smoke tests and operational visibility
