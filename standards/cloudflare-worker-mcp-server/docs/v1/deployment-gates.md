# Deployment Gates

## R-DEPLOY-1 - Wrangler config is the deployment source of truth

**Rule.** Worker name, entrypoint, compatibility date, routes, bindings, migrations, and
environment overrides must live in Wrangler configuration reviewed with the code.

**Why.** Remote MCP correctness depends on the exact deployed Worker and bindings.
Dashboard-only or undocumented config changes make VCQA and code review blind.

**vcqa.** Parse `wrangler.toml`, `wrangler.json`, or `wrangler.jsonc`; flag missing
entrypoints, missing `compatibility_date`, undocumented dashboard-only bindings, or
production routes not represented in config.

**References.**

- https://developers.cloudflare.com/workers/wrangler/configuration/
- https://developers.cloudflare.com/workers/configuration/compatibility-dates/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/

## R-DEPLOY-2 - Environments and secrets are promotion gates

**Rule.** Preview, staging, and production environments must declare separate bindings,
OAuth settings, and secrets, and CI must select the intended environment explicitly.

**Why.** Remote MCP authorization and storage are environment-sensitive. A production
token, Durable Object namespace, or OAuth redirect reused in preview can expose real data.

**vcqa.** Inspect Wrangler `env` blocks, CI deploy commands, `.dev.vars*` handling,
secret setup docs, OAuth callback URLs, and protected-resource metadata for environment
separation and explicit `--env` or equivalent selection.

**References.**

- https://developers.cloudflare.com/workers/wrangler/environments/
- https://developers.cloudflare.com/workers/configuration/environment-variables/
- https://developers.cloudflare.com/workers/configuration/secrets/

## R-DEPLOY-3 - CI runs protocol and auth smoke tests before production

**Rule.** Production deploys must be gated by tests that exercise MCP initialization,
`tools/list`, at least one representative tool call, unauthenticated rejection, and
authorization failure behavior.

**Why.** Type checks alone do not prove that a remote MCP endpoint negotiates correctly,
advertises schemas, or rejects unauthorized clients after Worker deployment.

**vcqa.** Inspect CI workflows and test scripts for MCP inspector/client smoke tests,
local `wrangler dev` or preview URL tests, and negative auth cases before deploy. The gate
must cover every row of the compatibility matrix required by
[R-PROTO-5](protocol-and-transport.md#r-proto-5-declare-a-compatibility-matrix), and its
output must be retained per
[R-DEPLOY-5](#r-deploy-5-mcp-smoke-evidence-is-retained).

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/test-remote-mcp-server/
- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools

## R-DEPLOY-4 - Types, schemas, and advertised tools are checked together

**Rule.** CI must run TypeScript checks and schema/tool listing checks before deployment,
including generated Worker binding types when bindings change.

**Why.** MCP tools are a contract across TypeScript, Zod, JSON Schema, and the remote
protocol. A passing compile can still advertise the wrong schema to clients.

**vcqa.** Check workflows for `tsc`, `wrangler types` freshness, unit tests for schema
parsing, and snapshots or assertions over `tools/list` output.

**References.**

- https://developers.cloudflare.com/workers/best-practices/workers-best-practices/
- https://ts.sdk.modelcontextprotocol.io/
- https://zod.dev/json-schema

## R-DEPLOY-5 - MCP smoke evidence is retained

**Severity.** `evidence-only`, escalating to `high` when the missing output is what would
show whether protocol negotiation, tool advertisement, or authorization denial actually
worked on the deployed Worker, and to `blocker` when no retained evidence exists for an
auth denial on a production endpoint that serves privileged tools.

**Rule.** The smoke run required by R-DEPLOY-3 must retain its output as a CI artifact or
durable log attached to the run that produced it, uploaded on failure as well as success.
At minimum the retained set must cover four exchanges per matrix row:

| Exchange | What the retained record must show |
|---|---|
| `initialize` | the request's offered `protocolVersion`, the server's negotiated `protocolVersion`, the advertised `capabilities`, and the server name/version |
| `tools/list` | the full advertised tool list with each tool's name and input schema, so a schema change is visible in the diff |
| representative tool call | one real `tools/call` for a tool that exercises a binding or an external effect, with its arguments and the result or structured error |
| auth denial | an unauthenticated or insufficiently scoped request and the rejection it received, including the HTTP status and the `WWW-Authenticate` challenge or protected-resource pointer where R-AUTH-2 requires one |

Every record must carry the endpoint URL, the environment, the commit SHA, and the
timestamp, with tokens and secret values redacted. The retention period must be stated
explicitly rather than left to a platform default.

**Why.** A remote MCP deployment can be green in CI and still fail a real client path.
Retained transcripts are what makes the compatibility claims of R-PROTO-5 auditable after
the fact: they tie a protocol revision, an SDK version, a transport, an auth mode, and a
client to a specific deployment at a specific commit.

**Scoring.** A pass requires the artifacts to exist for the run that deployed the current
production version, to be reachable from that run, and to match the matrix rows. Console
output that is only visible while a run's logs live, an upload step that a failing run never
reaches, and an artifact overwritten by the next run all fail this rule.

**vcqa.** Check the workflow for an upload step covering the smoke output with an
always-run condition and an explicit retention setting; confirm the smoke runner writes a
file rather than only printing; open the artifact and confirm it contains the four
exchanges, the endpoint, the environment, the commit, and the timestamp. Flag redaction
failures — a retained transcript containing a live token is a security finding, not
evidence.

**Evidence.**

- Source/config: the smoke script and its output path, the workflow upload step, its
  condition and retention setting, the redaction helper.
- CI/artifacts: the uploaded transcript, inspector output, or client log from a real run,
  resolvable to a commit and an endpoint.
- Runtime/deploy: the endpoint recorded inside the artifact matches the deployed Worker
  route for that environment.
- Exception: `acceptedException` when evidence must be redacted further or stored outside
  CI, naming owner, scope, environment, the durable store, the retention period,
  compensating controls, evidence, expiry/review date, and approval trail.

**References.**

- https://developers.cloudflare.com/agents/model-context-protocol/guides/test-remote-mcp-server/
- https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle
- https://modelcontextprotocol.io/specification/2025-11-25/server/tools
- https://docs.github.com/en/actions/reference/security/secure-use

## R-CI-1 - Deployment credentials are least privilege

**Rule.** CI must use least-privilege GitHub workflow permissions and Cloudflare
credentials scoped to the target account, Worker, and environment.

**Why.** The deployment pipeline can change tool permissions, OAuth metadata, bindings,
and production code. Its own credentials are part of the remote MCP trust boundary.

**vcqa.** Inspect GitHub Actions `permissions`, Cloudflare API token usage, secret names,
environment protection, and branch/tag deploy restrictions.

**References.**

- https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
- https://docs.github.com/actions/security-for-github-actions/security-guides/automatic-token-authentication

## R-CI-2 - Durable Object migrations are deploy-reviewed

**Rule.** Durable Object class additions, renames, deletions, and storage backend changes
must be represented in Wrangler migrations and reviewed before deployment.

**Why.** MCP session and audit state may live in Durable Objects. Migration mistakes can
orphan state or shift tools to a different storage backend.

**vcqa.** Inspect Wrangler `migrations`, Durable Object class exports, storage backend
configuration, and CI deployment diffs; flag changed DO classes without migration entries.

**References.**

- https://developers.cloudflare.com/durable-objects/best-practices/access-durable-objects-storage/
- https://developers.cloudflare.com/durable-objects/reference/durable-object-class-migrations-legacy/
- https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/
