# CI And Deploy Gates

## R-CI-1 - Build, type, lint, and tests run before D1 promotion

**Rule.** Remote D1 migrations and production deploys are gated by the repo's build,
TypeScript, lint/security, unit, and integration checks.

**Why.** A schema migration is part of the release. It should not be promoted from code
that cannot build or from handlers that fail the D1 test suite.

**vcqa.** Inspect workflow job dependencies and step order; flag remote migration jobs that
can run before build/type/test jobs pass.

**References.** <https://docs.github.com/en/actions/tutorials/authenticate-with-github_token>,
<https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>

## R-CI-2 - Production migrations run before production code deploy

**Rule.** Production deploy workflows apply production D1 migrations before deploying code
that depends on the new schema, unless the rollout plan explicitly requires the reverse.

**Why.** Edge code can reach a database immediately after deploy. Code that expects columns
or indexes not yet migrated will fail in production.

**vcqa.** Check workflow order for `wrangler d1 migrations apply <DB> --remote` before
`wrangler deploy`, `pages deploy`, or Cloudflare deploy action steps; allow documented
expand/contract exceptions.

**References.** <https://developers.cloudflare.com/workers/wrangler/commands/d1/>,
<https://developers.cloudflare.com/d1/reference/migrations/>

## R-CI-3 - Remote migration commands are non-interactive and auditable

**Rule.** CI remote migration steps name the database/environment, run non-interactively,
and preserve logs showing which migrations were applied.

**Why.** Wrangler skips the interactive confirmation in CI/CD while still applying
migrations and capturing a backup. Reviewers need an audit trail for production database
changes.

**vcqa.** Check workflow logs/scripts for explicit database names, `--remote`/`--env`, and
saved or visible migration apply output.

**References.** <https://developers.cloudflare.com/workers/wrangler/commands/d1/>,
<https://developers.cloudflare.com/d1/reference/time-travel/>

## R-CI-4 - Cloudflare credentials are least-privilege secrets

**Rule.** Cloudflare API credentials used by CI are stored as CI secrets and scoped as
narrowly as the deployment allows; GitHub token permissions are minimized.

**Why.** CI can deploy code and mutate production D1 schema. Credential scope is part of
the database safety boundary.

**vcqa.** Check GitHub Actions `permissions`, Cloudflare token secret usage, absence of
checked-in tokens, and environment protection for production jobs.

**References.** <https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>,
<https://docs.github.com/en/actions/tutorials/authenticate-with-github_token>,
<https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-cloud-providers>

## R-DEPLOY-1 - Preview deploys do not run production migrations

**Rule.** Pull request and preview deployments use preview/staging databases and never
apply migrations to production D1.

**Why.** Preview code is untrusted release-candidate code. Its migration experiments must
not mutate the production database.

**vcqa.** Flag PR workflows where `pull_request` events can run `wrangler d1 migrations
apply` with production database names, production secrets, or `--remote` without a preview
environment.

**References.** <https://developers.cloudflare.com/d1/configuration/environments/>,
<https://developers.cloudflare.com/pages/functions/bindings/>,
<https://docs.github.com/en/actions/tutorials/authenticate-with-github_token>

## R-DEPLOY-2 - Backup or recovery posture is known before destructive changes

**Rule.** Production workflows that include destructive SQL record the D1 Time Travel or
export/recovery posture before running the change.

**Why.** D1 Time Travel can restore recent database state, but restore overwrites the
database in place and has retention limits. Teams need the recovery plan before the
migration runs.

**vcqa.** Flag destructive migrations without a recovery note, bookmark/export step,
Time Travel awareness, or release checklist.

**References.** <https://developers.cloudflare.com/d1/reference/time-travel/>,
<https://developers.cloudflare.com/workers/wrangler/commands/d1/>
