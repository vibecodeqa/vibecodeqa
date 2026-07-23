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
local `wrangler dev` or preview URL tests, and negative auth cases before deploy.

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
