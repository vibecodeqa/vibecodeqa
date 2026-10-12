# Deployment evidence

## R-DEPLOY-1 - Compatibility matrix names current and legacy lanes

**Severity.** `evidence-only`, escalating to `high` when missing evidence hides an
unsupported client/protocol state, and to `blocker` when the repo claims current support
but cannot name supported versions.

**Rule.** The repo must document which MCP protocol versions, routes, transports,
Cloudflare handler paths, auth modes, and clients are supported, including any legacy lane
and its migration/removal plan.

**Why.** MCP `2026-07-28` and older initialization-based revisions are different protocol
eras. Operators and reviewers need to know what the Worker actually supports.

**Evidence.**

- Source/config: README, runbook, compatibility matrix, route map, registry targets.
- CI/artifacts: smoke tests per supported lane.
- Runtime/deploy: deployed route/version transcript.
- Exception: accepted only during active migration; include owner, clients affected, route
  scope, controls, evidence, expiry/review date, and approval trail.

**vcqa.** Flag repos with MCP route code but no supported-version matrix, or matrices that
claim `2026-07-28` while tests only exercise `initialize`/legacy flows.

**References.**

- MCP versioning and compatibility:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/versioning>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>

## R-DEPLOY-2 - CI proves current protocol behavior

**Severity.** `blocker` when deploy can happen without protocol/auth smoke; otherwise
`high`.

**Rule.** CI must run tests or smoke checks for stateless requests, unsupported versions,
required Streamable HTTP headers, `server/discover`, cacheable list/read results,
unauthorized rejection, validation failure, at least one read path, and at least one
mutating or denied-mutating path where such tools exist.

**Why.** Current MCP conformance is observable over HTTP. Unit tests alone do not prove the
deployed Worker route speaks the expected protocol.

**Evidence.**

- Source/config: workflow files, test commands, Worker test harness, smoke scripts.
- CI/artifacts: logs/transcripts for the required checks and deploy job dependencies.
- Runtime/deploy: preview or production smoke output retained per release.
- Exception: `acceptedException` only for a standard with no mutating tools; include owner,
  route scope, evidence of no mutations, review date, and approval trail.

**vcqa.** Flag deploy workflows that skip tests, MCP tests that never perform HTTP calls,
or protocol tests that omit headers/discovery/cache/auth/validation failure cases.

**References.**

- MCP Streamable HTTP:
  <https://modelcontextprotocol.io/specification/2026-07-28/basic/transports/streamable-http>
- MCP server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/discover>
- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>

## R-DEPLOY-3 - Environment promotion gates protect secrets and bindings

**Severity.** `high`, escalating to `blocker` when production deploys can use preview/local
credentials or unreviewed binding changes.

**Rule.** Production Worker deploys must be gated by reviewed environment configuration,
environment-scoped secrets, typed binding changes, and promotion evidence. Local, preview,
and production credentials must not be interchangeable.

**Why.** A remote tool server commonly has write-capable credentials. A wrong binding or
secret can turn a preview test into a production mutation path.

**Evidence.**

- Source/config: Wrangler environments, GitHub Actions environments, secret names, binding
  review policy.
- CI/artifacts: typecheck/build/deploy workflow logs and environment protection settings.
- Runtime/deploy: deployment runbook and rollback/rotation instructions.
- Exception: `acceptedException` must name the environment, owner, controls, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag one shared secret/binding set across all environments, deploy workflows with
broad Cloudflare tokens, or config changes with no deploy/test gate.

**References.**

- Cloudflare Workers environments:
  <https://developers.cloudflare.com/workers/wrangler/environments/>
- Cloudflare Workers secrets:
  <https://developers.cloudflare.com/workers/configuration/secrets/>
- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>

## R-DEPLOY-4 - Legacy migration evidence is retained

**Severity.** `evidence-only`, escalating to `high` when a legacy lane is still reachable
in production and no drain/removal evidence exists.

**Rule.** If the Worker supports legacy MCP routes or `McpAgent`, the repo must retain
migration evidence: client inventory, stateless route rollout, legacy usage monitoring,
drain criteria, route removal criteria, and Durable Object/storage migration notes.

**Why.** Cloudflare's migration path allows dual-era operation, but only as a staged
rollout. Without evidence, legacy support becomes permanent hidden behavior.

**Evidence.**

- Source/config: migration runbook, route flags, legacy handler config, Durable Object
  migration config.
- CI/artifacts: tests for stateless and legacy lanes plus monitoring evidence.
- Runtime/deploy: production usage dashboard or log query.
- Exception: `acceptedException` must include owner, affected clients, lane scope, controls,
  evidence, expiry/review date, and approval trail.

**vcqa.** Flag `McpAgent`, `/sse`, legacy handlers, or initialization support without a
migration runbook and removal criteria.

**References.**

- Cloudflare `McpAgent` API:
  <https://developers.cloudflare.com/agents/model-context-protocol/apis/agent-api/>
- Cloudflare migrate to MCP SDK v2:
  <https://developers.cloudflare.com/agents/model-context-protocol/guides/migrate-to-mcp-sdk-v2/>

## R-CI-1 - Deployment credentials are least privilege

**Severity.** `high`, escalating to `blocker` when a compromised CI job could mutate
unrelated Cloudflare accounts, tenants, secrets, or production resources.

**Rule.** CI credentials used to deploy the Worker must be scoped to the minimum Cloudflare
account/project/resources and protected by branch, environment, and workflow permissions.

**Why.** Remote MCP Workers are a privileged product surface. CI compromise should not give
wide Cloudflare or GitHub control.

**Evidence.**

- Source/config: GitHub workflow permissions, environment protection, Cloudflare token
  scope docs, OIDC or secret policy.
- CI/artifacts: deploy logs proving protected environment and required checks.
- Runtime/deploy: credential rotation/revocation runbook.
- Exception: `acceptedException` must name owner, credential scope, controls, evidence,
  expiry/review date, and approval trail.

**vcqa.** Flag workflows with broad `contents: write`, unprotected deploy jobs, missing
environment gates, or docs indicating account-wide Cloudflare API tokens.

**References.**

- GitHub Actions secure use:
  <https://docs.github.com/en/actions/reference/security/secure-use>
- GitHub Actions OIDC deployment hardening:
  <https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments>
- Cloudflare Workers CI/CD with GitHub Actions:
  <https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/>

## R-EVIDENCE-1 - MCP smoke evidence is retained

**Severity.** `evidence-only`, escalating to `high` when missing evidence is the only proof
for protocol, auth, validation, or mutation behavior.

**Rule.** Each release or production deploy must retain enough MCP smoke output to prove
which route, protocol version, handler path, auth mode, tools, and representative calls were
checked.

**Why.** Standards claims need dated evidence. A green deploy log with no transcript cannot
prove what protocol or route was tested.

**Evidence.**

- Source/config: smoke command, artifact upload, release checklist.
- CI/artifacts: retained transcripts for `server/discover`, required headers, auth denial,
  tool list, invalid input, and representative calls.
- Runtime/deploy: release notes or runbook linking the latest smoke artifact.
- Exception: accepted only for local-only preview runs; include owner, scope, controls,
  evidence, expiry/review date, and approval trail.

**vcqa.** Flag smoke jobs that print only "ok", artifacts uploaded conditionally after
success only, or releases with no route/version/auth transcript.

**References.**

- MCP server discovery:
  <https://modelcontextprotocol.io/specification/2026-07-28/server/discover>
- GitHub Actions deployments and environments:
  <https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments>
