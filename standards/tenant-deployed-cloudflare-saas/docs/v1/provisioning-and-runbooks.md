# Provisioning and runbooks

## R-PROV-1 - Tenant provisioning is repeatable

**Rule.** A new tenant can be created from documented steps or automation covering
Cloudflare resources, DNS, data migrations or storage setup, secrets, bindings, access
policy, smoke tests, observability, and rollback notes.

**Why.** Tenant deployment is an operational product feature. It cannot depend on one
operator's memory.

**vcqa.** Flag repos with tenant deployment claims but no provisioning runbook,
automation, checklist, or generated manifest path.

**References.**

- Cloudflare Workers CI/CD with GitHub Actions:
  <https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>
- Cloudflare Pages direct upload with CI:
  <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>

## R-PROV-2 - Tenant deprovisioning is repeatable

**Rule.** The repo must document how to disable access, revoke secrets, preserve or export
required data, remove routes and domains, and retain audit evidence for a tenant.

**Why.** Deprovisioning mistakes create data-retention, access-control, and billing risk.

**vcqa.** Flag provisioning docs with no deprovisioning path or no treatment of data
retention, secret revocation, and domain/route cleanup.

**References.**

- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- Cloudflare D1 import and export:
  <https://developers.cloudflare.com/d1/best-practices/import-export-data/>

## R-DOC-1 - Tenant runbooks are source-controlled or linked

**Rule.** Tenant provisioning, migration, rollback, restore, secret rotation, and
incident-response runbooks must live in the repo or be linked from the repo's operations
docs.

**Why.** Reviewers and automated judges need a stable discovery path for operational
controls.

**vcqa.** Flag runbook references that only exist in chat, issue comments, dashboard
state, or tribal knowledge.

**References.**

- GitHub Actions deployment environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-SMOKE-1 - New tenant smoke proves auth, API, data, and automation boundaries

**Rule.** Tenant acceptance must include smoke checks for app routing, server-side auth,
API access, data-resource access, relevant Worker/MCP tools, logging, and audit output.

**Why.** Tenant provisioning is not complete until the operational boundary has been
tested end to end.

**vcqa.** Flag tenant provisioning workflows with no post-create smoke tests or tests
that only prove the frontend loads.

**References.**

- Playwright best practices:
  <https://playwright.dev/docs/best-practices>
- Cloudflare Workers observability:
  <https://developers.cloudflare.com/workers/observability/>
