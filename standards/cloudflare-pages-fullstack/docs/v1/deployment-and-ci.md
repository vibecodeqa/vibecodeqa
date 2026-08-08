# Deployment And CI

## R-DEPLOY-1 - Deploy the frontend and Functions as one artifact

**Severity.** `blocker` when the two halves can ship out of step (separate workflows,
separate triggers, or a publish step that uploads only one of them); otherwise `high`.

**Rule.** CI assembles static assets and Pages Functions into one Cloudflare Pages
deployment, published by a single step.

**Why.** Deploying only one half can break routes, auth, or contracts.

**vcqa.** Inspect workflows for docs/static build, Functions inclusion, and Pages deploy
of the assembled output. Concretely:

- one job builds the frontend into the published directory and, in the same job, publishes
  with `wrangler pages deploy <dir> --project-name <pages-project>` (directly or through
  `cloudflare/wrangler-action`);
- the `functions/` tree sits at the Pages project root of the uploaded directory, or is the
  repo-root `functions/` that Pages picks up for that project, or is bundled to
  `<dir>/_worker.js` by the build;
- `_routes.json` and `_redirects` are present in the uploaded directory when the routing
  rules of R-SEAM-1/R-SEAM-2 depend on them;
- no second workflow publishes assets or Functions independently.

**Evidence.**

- Source/config: the deploy workflow, the build script, `wrangler.toml`
  `pages_build_output_dir`.
- CI/artifacts: deploy log listing the uploaded files or file count, including the Functions
  entry, and the resulting deployment URL.
- Runtime/deploy: after the deploy, an asset request and an API request against the same
  deployment URL both succeed.
- Exception: not available. Split deploys must be modelled as separate projects and
  assessed separately.

**References.**

- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>
- Pages direct upload from CI:
  <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>

## R-DEPLOY-2 - Production deploys target the production branch

**Severity.** `high`, escalating to `blocker` when the custom domain silently serves an
older deployment because production deploys land as previews.

**Rule.** The Cloudflare Pages deploy command identifies the intended production branch or
equivalent production environment, and the repo states which branch the Pages project
treats as production.

**Why.** Deploying without a branch can create preview deployments instead of updating the
custom domain.

**vcqa.** Check for `--branch main` or documented equivalent in Pages deployment.
Concretely, a pass requires all three:

- the deploy step passes `--branch <production-branch>` (or the Pages Git integration owns
  the deploy and the workflow does not upload separately);
- the production branch named in the deploy matches the Pages project's production branch
  as recorded in the repo (Wrangler config, workflow, or the runbook referenced by it);
- the workflow trigger that reaches the production deploy is restricted to that branch, so
  a feature branch cannot publish to production.

Flag `wrangler pages deploy` with no `--branch` in a workflow that is meant to be the
production release path, and flag a mismatch between the trigger branch and the deploy
branch.

**Evidence.**

- Source/config: the deploy workflow `on:` block, the deploy command, and the recorded
  production branch.
- CI/artifacts: deploy log showing the branch and whether the deployment is production or
  preview, plus the deployment URL from R-OBS-2.
- Runtime/deploy: the custom domain serves the commit that CI just deployed, confirmed by
  the build stamp or the smoke transcript.
- Exception: `acceptedException` for a documented manual promotion model, naming owner,
  scope, the promotion gate, evidence, and review date.

**References.**

- Pages branch build controls:
  <https://developers.cloudflare.com/pages/configuration/branch-build-controls/>
- Pages preview deployments:
  <https://developers.cloudflare.com/pages/configuration/preview-deployments/>

## R-CI-1 - Use least-privilege workflow permissions

**Severity.** `high`, escalating to `blocker` when deployment credentials are committed,
printed to logs, or exposed to workflows triggered by untrusted contributors.

**Rule.** Deployment workflows declare minimal GitHub token permissions and keep Cloudflare
credentials in secrets.

**Why.** CI is part of the deployment boundary.

**vcqa.** Inspect workflow `permissions` and secret usage. Concretely: a `permissions:`
block exists at workflow or job level and does not grant `write-all`; the Cloudflare API
token and account ID come from `secrets.*`, never from literals or repository variables
holding credential material; workflows triggered by `pull_request_target` or by forks do
not receive the deploy secrets.

**Evidence.**

- Source/config: `.github/workflows/*.yml` `permissions`, `on:` triggers, and secret
  references; the scope of the Cloudflare API token as documented in the repo.
- CI/artifacts: workflow run log with no credential material in plaintext.
- Exception: `acceptedException` naming each extra permission granted, why it is required,
  and its review date.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
- Cloudflare Workers CI/CD with GitHub Actions:
  <https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>

## R-CI-2 - Build and type checks run before deploy

**Severity.** `medium`, escalating to `high` when the deploy step runs regardless of the
check outcome (`continue-on-error`, a non-required check, or a separate unlinked workflow).

**Rule.** The pipeline runs frontend build and relevant type checks, covering both the
frontend and the Functions, before publishing.

**Why.** A fullstack Pages deployment should not be the first place route or type failures
appear.

**vcqa.** Check workflow ordering for build/type steps before deploy. Concretely: the
build and type-check steps precede the publish step in the same job, or the publish job
declares `needs:` on the job that ran them; the type-check covers `functions/**` and not
only the frontend `tsconfig`; no `continue-on-error: true` sits on a gate step in the
deploy path.

**Evidence.**

- Source/config: the workflow job graph, the `tsconfig` files or project references that
  include the Functions slice, the package scripts the workflow calls.
- CI/artifacts: run log showing the gate steps and their exit status before the publish
  step.
- Exception: `acceptedException` when a check is deliberately advisory, naming owner,
  scope, compensating controls, and review date.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
- TypeScript handbook:
  <https://www.typescriptlang.org/docs/handbook/intro.html>
