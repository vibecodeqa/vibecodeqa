# tenant-deployed-cloudflare-saas

Gold-standard rubric for SaaS products deployed as tenant-scoped Cloudflare surfaces:
projects, Pages or Workers deployables, routes, data resources, bindings, secrets,
domains, aliases, promotion gates, provisioning, and auditability.

Published rubric:
<https://vibecodeqa.online/standards/tenant-deployed-cloudflare-saas/v1/>

## What this standard is

This is not a generic Cloudflare standard and not a product-domain standard. It owns the
rules that appear when a product chooses tenant-level deployment boundaries on
Cloudflare.

It commonly composes:

- GitHub Actions, security, and docs-KB practices
- Cloudflare Workers and deployable resource bindings
- Cloudflare Pages Fullstack, when the tenant surface includes a Pages app or API
- Cloudflare D1 App, when tenant state uses D1
- Cloudflare Worker MCP Server, when tenant operations expose remote MCP tools
- React SPA, SDK, or CLI standards when those optional surfaces are present

## Editions

| Edition | Status | Reviewed | Next review |
| --- | --- | --- | --- |
| `v1` | latest | 2026-07 | 2027-07 |
