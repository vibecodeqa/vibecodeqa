# GitHub Actions

GitHub Actions runs CI, package, release, and Cloudflare deployment workflows. VCQA uses
this item to connect upstream workflow mechanics to stack-specific gates and least-privilege
deployment checks.

## Upstream references

- [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)
- [Workflow syntax](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax)
- [Use `GITHUB_TOKEN` for authentication](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)
- [OpenID Connect](https://docs.github.com/en/actions/concepts/security/openid-connect)
- [Security hardening your deployments](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments)

## What upstream owns

- workflow syntax, events, jobs, environments, and permissions
- `GITHUB_TOKEN`, secret, and artifact behavior
- secure-use guidance for untrusted input, third-party actions, and script injection
- OIDC token mechanics and cloud-provider deployment hardening patterns

## VCQA-owned rule surface

- **CI-PERM:** workflows and jobs set minimum `permissions`; write permissions are justified
  by a release, deployment, or action-publishing need.
- **CI-PIN:** third-party actions used in privileged jobs are pinned to a reviewed version or
  SHA according to the consuming stack policy.
- **CI-GATE:** deployment and release jobs depend on stack-required typecheck, unit, E2E,
  migration, packaging, or docs-build checks.
- **CI-OIDC:** cloud deployments prefer OIDC or scoped environment secrets over long-lived
  broad credentials when supported by the target provider.
- **CI-ENV:** preview, staging, production, and tenant environments have separate secrets,
  variables, approvals, and deployment targets.
- **CI-INPUT:** workflow-dispatched inputs, PR metadata, branch names, and issue/comment text
  are treated as untrusted when interpolated into scripts.

## Detection signals

- `.github/workflows/*.yml`
- `.github/workflows/*.yaml`
- workflow permissions
- deployment jobs
- `id-token: write`, `secrets.*`, `vars.*`, `environment`, or `concurrency`
- third-party `uses:` entries and shell interpolation

## Composed standards

- [Cloudflare Pages Fullstack](../stacks/cloudflare-pages-fullstack.md)
- [Cloudflare D1 App](../stacks/cloudflare-d1-app.md)
- [Cloudflare Worker MCP Server](../stacks/cloudflare-worker-mcp-server.md)
- [Tenant-Deployed Cloudflare SaaS](../stacks/tenant-deployed-cloudflare-saas.md)
- [GitHub Action Package](../stacks/github-action-package.md)
- [Zensical KB Site](../stacks/zensical-kb-site.md)

## Combination-born examples

- Actions plus Cloudflare Pages should deploy the production branch explicitly.
- Actions plus D1 needs migration checks before production promotion.
- Actions plus GitHub Action packages requires minimum token permissions and pinned release tags.
- Actions plus tenant-deployed Cloudflare SaaS requires deployment targets and secrets to be
  tenant/environment scoped, not derived from unchecked workflow input.
- Actions plus Playwright requires failed-run artifacts to be retained for release-blocking
  browser checks.
