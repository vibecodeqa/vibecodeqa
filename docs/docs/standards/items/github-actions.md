# GitHub Actions

GitHub Actions runs CI, release, and deployment workflows.

## Upstream references

- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [Security hardening your deployments](https://docs.github.com/actions/how-tos/secure-your-work/security-harden-deployments)

## What upstream owns

- workflow syntax
- security hardening guidance
- OIDC deployment mechanics

## What VCQA owns

- workflow permission gates.
- deployment environment checks.
- required test/build gates by stack.

## Detection signals

- `.github/workflows/*.yml`
- workflow permissions
- deployment jobs

## Composed standards

- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Cloudflare D1 App](../stacks/cloudflare-d1-app.md)
- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)
- [GitHub Action Package](../stacks/github-action-package.md)
- [Zensical KB Site](../stacks/zensical-kb-site.md)

## Combination-born guidelines

- Actions plus Cloudflare Pages should deploy the production branch explicitly.
- Actions plus D1 needs migration checks before production promotion.
- Actions plus GitHub Action packages requires minimum token permissions and pinned release tags.
