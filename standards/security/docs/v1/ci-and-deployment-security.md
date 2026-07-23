# CI and deployment security

## R-CI-1 - Workflow permissions are minimum required

**Rule.** GitHub Actions workflows must set minimum required `permissions`, especially
for jobs that handle secrets, deploy, publish packages, run untrusted code, or mutate
production state.

**Why.** The default token can be available to actions and scripts unless permission scope
is reduced.

**vcqa.** Flag workflows with broad or implicit permissions when the job performs deploy,
release, package publish, secret-bearing test, or production mutation work.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-CI-2 - Production mutation uses protected deployment environments

**Rule.** Production deploys, migrations, secret rotation, tenant provisioning, and
restore operations must run through protected environments or equivalent approval gates.

**Why.** Production mutation needs explicit review, environment-scoped secrets, and a
durable execution record.

**vcqa.** Flag production-mutating workflows that can run from arbitrary branches,
unreviewed pull requests, local scripts, or unprotected GitHub Actions jobs.

**References.**

- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-TOKEN-1 - Deployment credentials are scoped to target operations

**Rule.** Deployment credentials must be scoped to the specific environment, tenant,
project, package, or cloud resource they mutate.

**Why.** A single broad token across all environments and tenants turns one workflow or
secret leak into full production compromise.

**vcqa.** Flag Cloudflare API tokens, GitHub tokens, npm tokens, OAuth client secrets, and
third-party deploy keys that are shared across unrelated environments or grant broader
permissions than the workflow needs.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>

## R-DEPLOY-1 - Untrusted pull request code cannot access privileged secrets

**Rule.** Workflows triggered by untrusted pull request code must not expose privileged
secrets or production deployment credentials.

**Why.** Pull request workflows execute code that may not be trusted by the repository
owners.

**vcqa.** Flag `pull_request_target`, checkout of untrusted head refs, PR preview
workflows, or test jobs that combine untrusted code execution with privileged secrets.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
