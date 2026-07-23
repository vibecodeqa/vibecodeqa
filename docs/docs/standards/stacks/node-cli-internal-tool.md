# Node CLI Internal Tool

**Status:** Planned charter

Node-based command-line tools used by developers, CI, operators, or internal automation.

## Full rubric

No full versioned rubric has been authored yet.

## Teaching focus

This standard teaches that an internal CLI is still a public contract for scripts, CI, and
operators. Choosing this stack means choosing predictable process behavior, safe defaults for
privileged environments, and automation-friendly output before adding convenience features.

## Scope

Node-based command-line tools used by developers, CI, operators, or internal automation.

## Not in scope

- browser apps
- published SDKs with no CLI entrypoint
- long-running services unless the CLI controls them

## Composes

- [TypeScript](../items/typescript.md)
- [Node.js](../items/node.md)
- [OpenAPI](../items/openapi.md)
- [GitHub Actions](../items/github-actions.md)
- [Web Security](../items/web-security.md)

## Upstream references

- [Node.js process API](https://nodejs.org/api/process.html)
- [Node.js package entry points and package metadata](https://nodejs.org/api/packages.html)
- [Node.js security best practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
- [npm package.json docs](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/)
- [GitHub Actions workflow commands](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-commands)
- [GitHub Actions exit codes for actions](https://docs.github.com/actions/creating-actions/setting-exit-codes-for-actions)
- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

## VCQA-owned rule surface

- argument parsing and command shape.
- exit-code, stderr, and stdout contract.
- structured JSON output mode.
- credential lookup and redaction boundaries.
- staging/prod safety defaults.
- dry-run, idempotency, and retry behavior.
- noninteractive behavior for CI and agents.
- config precedence and environment selection.
- release, runtime, and packaging policy.
- SDK reuse instead of API duplication.

## Detection signals

- `package.json#bin`
- Node CLI dependencies such as `commander` or `yargs`
- scripts invoked by CI or operators
- `process.argv`, `process.exitCode`, `process.stdout`, or `process.stderr`
- `--json`, `--dry-run`, `--yes`, `--force`, `--env`, `--profile`, or similar CLI flags
- CI workflows invoking package scripts or published bins
- direct API calls from a CLI package that duplicate an SDK client

## Combination-born guidelines

- Exit codes and stderr/stdout behavior are part of the API.
- Credential lookup order must make production operations explicit.
- Structured output mode is required when CI or agents consume results.
- TypeScript types do not validate command-line input; parse and validate external input before side
  effects.
- GitHub Actions commands use stdout, so CI-facing CLIs must avoid mixing human logs into
  machine-readable output.
- Node child process and shell features are high-risk boundaries; user-controlled input must not be
  interpolated into shell commands.
- OpenAPI-backed CLIs should call the same generated or hand-authored SDK used by other clients
  unless the CLI owns a lower-level transport concern.

## Candidate rules

- **R-CLI-1: Command syntax is explicit and documented.** Commands, positional arguments, options,
  defaults, aliases, examples, and deprecations are discoverable through `--help` and checked docs.
- **R-CLI-2: Exit codes are stable.** `0` means success; non-zero codes distinguish usage errors,
  validation failures, auth/config failures, not-found/no-op cases, partial failures, and unexpected
  runtime failures where the distinction matters to automation.
- **R-CLI-3: stdout is for results.** Human diagnostics, progress, warnings, and prompts go to
  stderr; stdout contains only the primary result, plain text requested by a human, or structured
  output requested by automation.
- **R-CLI-4: JSON mode is structured and quiet.** `--json` emits one documented JSON value to
  stdout, uses stderr for diagnostics, redacts secrets, and returns a non-zero exit code for
  failures instead of embedding success as a string.
- **R-CLI-5: Noninteractive mode never waits.** CI and agent use must fail fast when required input,
  confirmation, or credentials are missing; prompts require an interactive TTY unless an explicit
  `--yes`, `--force`, or equivalent flag is present.
- **R-CLI-6: Config precedence is deterministic.** Non-secret configuration resolves in a documented
  order, normally flags, environment variables, project config, user config, then defaults, with an
  inspectable redacted effective-config view.
- **R-CLI-7: Credentials are separated from config.** Secrets come from CI secret stores,
  environment variables, OS credential stores, or a documented secret manager; project config may
  name a profile or account but must not contain raw production secrets.
- **R-CLI-8: Production writes are explicit.** Destructive or production-scoped operations require
  an explicit environment, target, and confirmation mechanism; staging or read-only behavior is the
  default when ambiguity would be dangerous.
- **R-CLI-9: Dry-run predicts side effects.** Mutating commands provide a dry-run mode when
  feasible, show the target environment and planned operations, and avoid fetching or printing
  secret material in preview output.
- **R-CLI-10: Mutations are idempotent or resumable.** Commands used by CI or operators define retry
  behavior, idempotency keys, conflict handling, and partial-failure reporting so reruns do not
  silently duplicate work.
- **R-CLI-11: Runtime and release policy are pinned.** `engines.node`, package manager expectations,
  executable bins, lockfiles, and release artifacts are aligned so CI, developer machines, and
  operator environments run the same supported Node line.
- **R-CLI-12: API behavior is not forked.** A CLI that drives a product API reuses the product SDK
  or a shared generated client and keeps its request/response contract fresh with the checked-in API
  description.

## Anti-patterns

- Printing progress, warnings, or prompts to stdout while also advertising scriptable output.
- Returning `0` for failed operations because an error object was printed.
- Requiring a TTY prompt in CI, cron, release jobs, or agent workflows.
- Defaulting ambiguous destructive commands to production.
- Storing API tokens in repository config, examples, snapshots, or generated debug logs.
- Treating `--force` as a blanket bypass instead of a narrow confirmation of a specific risky
  action.
- Building a separate CLI HTTP client that drifts from the SDK or OpenAPI contract.
- Shelling out with concatenated user input where an argument-array API or library call is
  available.
- Publishing a bin without a documented Node support range or tested install path.

## Benefits

- Cloudflare SaaS example CLI.
- vcqa/cli.
