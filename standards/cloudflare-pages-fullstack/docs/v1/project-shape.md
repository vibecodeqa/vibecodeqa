# Project Shape

## R-SHAPE-1 - Keep the frontend and Functions as distinct slices

**Severity.** `high`, escalating to `blocker` when a privileged binding, secret, or
server-only module is reachable from browser source or from the built assets.

**Rule.** A Pages fullstack app separates static frontend source from Pages Functions
source, even when they live in the same package. Browser source must not import Function
modules, binding types used to hold credentials, or server-only helpers.

**Why.** The frontend ships to the browser; Functions run at the edge with privileged
bindings. VCQA must judge those surfaces differently.

```text
good:
  app/src/
  app/functions/
  app/wrangler.toml

bad:
  app/src/api/
  app/src/secrets.ts
```

**vcqa.** Detect a frontend build source and a `functions/` tree; flag privileged code or
bindings imported into browser source.

**Evidence.**

- Source/config: the frontend entry (`index.html`, `src/**`), the Functions tree
  (`functions/**` or `_worker.js`), and the build config that names the output directory.
- CI/artifacts: build log showing the frontend output directory and that `functions/` is
  published alongside it, not bundled into browser assets.
- Runtime/deploy: `grep` over the built asset directory for server-only module names or
  binding identifiers.
- Exception: `acceptedException` with owner, scope (the specific shared module), reason,
  compensating controls, evidence, expiry/review date, and approval trail. Shared code is
  acceptable only when it is pure and free of credentials or binding access.

**References.**

- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>
- Pages Functions routing: <https://developers.cloudflare.com/pages/functions/routing/>

## R-SHAPE-2 - Do not require a long-running server

**Severity.** `blocker`. This rule is archetype identity: a repo that fails it is not a
`cloudflare-pages-fullstack` and cannot be scored against this rubric with an exception.

**Rule.** The app must build into static assets plus Pages Functions; it must not require
an Express, Fastify, Hono, or Next server process to serve production requests.

**Why.** Pages Functions are request handlers in Cloudflare's edge runtime. A long-running
server changes the stack and invalidates this standard.

**Scoring.** A server framework listed under `devDependencies` and used only by a local
dev, mock, or test script does not fail this rule. A server entrypoint referenced by the
production `start`/deploy path does.

**vcqa.** Check package dependencies and scripts for server runtimes; distinguish local
dev helpers from production requirements.

**Evidence.**

- Source/config: `package.json` dependencies and scripts, `Dockerfile`/`Procfile` if
  present, and any `server.*` entrypoint.
- CI/artifacts: the deploy workflow, which must publish a directory rather than start a
  process.
- Runtime/deploy: the Pages deployment serves the app with no additional origin.
- Exception: not available. Record the correct archetype instead.

**References.**

- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>
- Vite static deploy: <https://vite.dev/guide/static-deploy>

## R-SHAPE-3 - Declare the Cloudflare project boundary

**Severity.** `high`, escalating to `blocker` when the Pages project name cannot be
determined from the repo at all, because no reviewer can then verify which deployment the
rubric applies to.

**Rule.** The repo must declare, in version control, the Pages project that receives both
the static assets and the Functions, together with the published output directory.

**Why.** Fullstack behavior depends on deploying both halves into the same Pages project.

**vcqa.** Read the Pages project name and output directory from at least one of:

- `wrangler.toml`/`wrangler.json`/`wrangler.jsonc` with `name = "<pages-project>"` and
  `pages_build_output_dir = "<dir>"`;
- a deploy workflow invoking `wrangler pages deploy <dir> --project-name <pages-project>`;
- `cloudflare/wrangler-action` whose `command:` contains the same `pages deploy`
  invocation;
- a repo doc or runbook that names the project and output directory and is referenced from
  the deploy workflow.

Flag a repo where the project name exists only in the Cloudflare dashboard, where two
sources disagree, or where the published directory does not match the frontend build
output.

**Evidence.**

- Source/config: Wrangler config keys above, or the workflow step that names the project.
- CI/artifacts: deploy log line showing the project name and the uploaded directory.
- Runtime/deploy: the deployment URL that CI printed (see R-OBS-2).
- Exception: `acceptedException` naming the owner, the out-of-repo source of truth, and a
  compensating control that keeps it reviewable, with an expiry/review date.

**References.**

- Pages direct upload from CI:
  <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>
- Cloudflare Pages Functions: <https://developers.cloudflare.com/pages/functions/>

## R-SHAPE-4 - Keep generated output out of source rules

**Severity.** `low`, escalating to `medium` when a committed generated artifact is the only
place a deployment setting exists and therefore drifts silently.

**Rule.** Built `dist/`, generated `.wrangler/`, and local preview artifacts are not the
source of truth for the standard, and must not be the only place a binding, route, or
project setting is recorded.

**Why.** A judge should inspect source and config, not stale generated files.

**vcqa.** Ignore generated output for rule ownership; flag generated directories committed
as authoritative deployment config unless intentionally documented.

**Evidence.**

- Source/config: `.gitignore` entries for `dist/`, `.wrangler/`, and preview output; the
  authored config files that carry the same settings.
- CI/artifacts: build log proving the generated directory is produced by the pipeline.
- Exception: `acceptedException` when a generated artifact is committed deliberately
  (for example a checked-in build for a consumer), naming owner, scope, and review date.

**References.**

- Vite static deploy: <https://vite.dev/guide/static-deploy>
