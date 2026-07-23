# Deployment And CI

## R-DEPLOY-1 - Deploy the frontend and Functions as one artifact

**Rule.** CI assembles static assets and Pages Functions into one Cloudflare Pages
deployment.

**Why.** Deploying only one half can break routes, auth, or contracts.

**vcqa.** Inspect workflows for docs/static build, Functions inclusion, and Pages deploy
of the assembled output.

## R-DEPLOY-2 - Production deploys target the production branch

**Rule.** The Cloudflare Pages deploy command identifies the intended production branch
or equivalent production environment.

**Why.** Deploying without a branch can create preview deployments instead of updating the
custom domain.

**vcqa.** Check for `--branch main` or documented equivalent in Pages deployment.

## R-CI-1 - Use least-privilege workflow permissions

**Rule.** Deployment workflows declare minimal GitHub token permissions and keep Cloudflare
credentials in secrets.

**Why.** CI is part of the deployment boundary.

**vcqa.** Inspect workflow `permissions` and secret usage.

## R-CI-2 - Build and type checks run before deploy

**Rule.** The pipeline runs frontend build and relevant type checks before publishing.

**Why.** A fullstack Pages deployment should not be the first place route or type failures
appear.

**vcqa.** Check workflow ordering for build/type steps before deploy.
